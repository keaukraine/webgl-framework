import { mat4 } from "gl-matrix";
import { RendererWithExposedMethods } from "./RendererWithExposedMethods";

export abstract class BaseRenderer implements RendererWithExposedMethods {
    protected mMMatrix = mat4.create();
    protected mVMatrix = mat4.create();
    protected mMVPMatrix = mat4.create();
    protected mProjMatrix = mat4.create();
    protected matOrtho = mat4.create();

    private m_boundTick = this.tick.bind(this);

    private m_gl: WebGLRenderingContext | WebGL2RenderingContext | undefined;
    protected isWebGL2 = false;

    protected viewportWidth = 0;
    protected viewportHeight = 0;

    protected canvas: HTMLCanvasElement | undefined;

    constructor() { }

    /** Getter for current WebGL context. */
    get gl(): WebGLRenderingContext | WebGL2RenderingContext {
        if (this.m_gl === undefined) {
            throw new Error("No WebGL context");
        }
        return this.m_gl;
    }

    /** Logs last GL error to console */
    logGLError(): void {
        var err = this.gl.getError();
        if (err !== this.gl.NO_ERROR) {
            console.warn(`WebGL error # + ${err}`);
        }
    }

    /**
     * Binds 2D texture.
     *
     * @param textureUnit A texture unit to use
     * @param texture A texture to be used
     * @param uniform Shader's uniform ID
     */
    setTexture2D(textureUnit: number, texture: WebGLTexture, uniform: WebGLUniformLocation): void {
        this.gl.activeTexture(this.gl.TEXTURE0 + textureUnit);
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
        this.gl.uniform1i(uniform, textureUnit);
    }

    /**
     * Binds cubemap texture.
     *
     * @param textureUnit A texture unit to use
     * @param texture A texture to be used
     * @param uniform Shader's uniform ID
     */
    setTextureCubemap(textureUnit: number, texture: WebGLTexture, uniform: WebGLUniformLocation): void {
        this.gl.activeTexture(this.gl.TEXTURE0 + textureUnit);
        this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, texture);
        this.gl.uniform1i(uniform, textureUnit);
    }

    /**
     * Calculates FOV for matrix.
     *
     * @param matrix Output matrix
     * @param fovY Vertical FOV in degrees
     * @param aspect Aspect ratio of viewport
     * @param zNear Near clipping plane distance
     * @param zFar Far clipping plane distance
     */
    setFOV(matrix: mat4, fovY: number, aspect: number, zNear: number, zFar: number): void {
        const fH = Math.tan(fovY / 360.0 * Math.PI) * zNear;
        const fW = fH * aspect;
        mat4.frustum(matrix, -fW, fW, -fH, fH, zNear, zFar);
    }

    /**
     * Calculates MVP matrix. Saved in this.mMVPMatrix
     */
    calculateMVPMatrix(tx: number, ty: number, tz: number, rx: number, ry: number, rz: number, sx: number, sy: number, sz: number) {
        mat4.identity(this.mMMatrix);
        mat4.rotate(this.mMMatrix, this.mMMatrix, 0, [1, 0, 0]);
        mat4.translate(this.mMMatrix, this.mMMatrix, [tx, ty, tz]);
        mat4.scale(this.mMMatrix, this.mMMatrix, [sx, sy, sz]);
        mat4.rotateX(this.mMMatrix, this.mMMatrix, rx);
        mat4.rotateY(this.mMMatrix, this.mMMatrix, ry);
        mat4.rotateZ(this.mMMatrix, this.mMMatrix, rz);
        mat4.multiply(this.mMVPMatrix, this.mVMatrix, this.mMMatrix);
        mat4.multiply(this.mMVPMatrix, this.mProjMatrix, this.mMVPMatrix);
    }

    /** Called before WebGL initialization. */
    abstract onBeforeInit(): void;

    /** Called right after WebGL initialization */
    abstract onAfterInit(): void;

    /** Called on WebGL initialization error */
    abstract onInitError(): void;

    /** Shaders initialization code goes here */
    abstract initShaders(): void;

    /** Load WebGL data here */
    abstract loadData(): void;

    /** Perform each frame's draw calls here. */
    protected drawScene(): void {
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    }

    /** Update timers and aminate stuff here. */
    abstract animate(): void;

    /** Called on each frame. */
    private tick(): void {
        requestAnimationFrame(this.m_boundTick);
        this.resizeCanvas();
        this.drawScene();
        this.animate();
    }

    /**
     * Initializes WebGL context.
     *
     * @param canvas Canvas to initialize WebGL.
     */
    protected initGL(canvas: HTMLCanvasElement): WebGLRenderingContext {
        const gl = canvas.getContext("webgl", { alpha: false });
        if (gl === null) {
            throw new Error("Cannot initialize WebGL context");
        }
        // this.isETC1Supported = !!gl.getExtension('WEBGL_compressed_texture_etc1');

        return gl;
    };

    /**
     * Initializes WebGL 2 context
     *
     * @param canvas Canvas to initialize WebGL 2.
     */
    protected initGL2(canvas: HTMLCanvasElement): WebGLRenderingContext | WebGL2RenderingContext {
        let gl: WebGLRenderingContext | WebGL2RenderingContext | null = canvas.getContext("webgl2", { alpha: false });
        if (gl === null) {
            console.warn('Could not initialise WebGL 2, falling back to WebGL 1');
            return this.initGL(canvas);
        }

        return gl;
    };

    /**
     * Initializes WebGL and calls all callbacks.
     *
     * @param canvasID ID of canvas element to initialize WebGL.
     * @param requestWebGL2 Set to `true` to initialize WebGL 2 context.
     */
    init(canvasID: string, requestWebGL2 = false): void {
        this.onBeforeInit();

        this.canvas = document.getElementById(canvasID) as HTMLCanvasElement;

        if (this.canvas === null) {
            throw new Error("Cannot find canvas element");
        }

        this.viewportWidth = this.canvas.width;
        this.viewportHeight = this.canvas.height;

        this.m_gl = !!requestWebGL2 ? this.initGL2(this.canvas) : this.initGL(this.canvas);

        if (this.m_gl) {
            this.resizeCanvas();
            this.onAfterInit();
            this.initShaders();
            this.loadData();
            this.m_boundTick();
        } else {
            this.onInitError();
        }
    }

    /** Adjusts viewport according to resizing of canvas. */
    resizeCanvas(): void {
        if (this.canvas === undefined) {
            return;
        }

        const cssToRealPixels = window.devicePixelRatio || 1;
        const displayWidth = Math.floor(this.canvas.clientWidth * cssToRealPixels);
        const displayHeight = Math.floor(this.canvas.clientHeight * cssToRealPixels);

        if (this.canvas.width != displayWidth || this.canvas.height != displayHeight) {
            this.canvas.width = displayWidth;
            this.canvas.height = displayHeight;
        }
    }

    /**
     * Logs GL error to console.
     *
     * @param operation Operation name.
     */
    checkGlError(operation: string): void {
        let error;
        while ((error = this.gl.getError()) !== this.gl.NO_ERROR) {
            console.error(`${operation}: glError ${error}`);
        }
    }

    /** @inheritdoc */
    unbindBuffers(): void {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
    }

    /** @inheritdoc */
    getMVPMatrix(): mat4 {
        return this.mMVPMatrix;
    }

    /** @inheritdoc */
    getOrthoMatrix(): mat4 {
        return this.matOrtho;
    }

    /** @inheritdoc */
    getModelMatrix(): mat4 {
        return this.mMMatrix;
    }

    /** @inheritdoc */
    getViewMatrix(): mat4 {
        return this.mVMatrix;
    }
}
