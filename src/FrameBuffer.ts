export class FrameBuffer {
    private m_textureHandle: WebGLTexture | null = null;
    private m_depthTextureHandle: WebGLTexture | null = null;
    private m_framebufferHandle: WebGLFramebuffer | null = null;
    private m_depthbufferHandle: WebGLRenderbuffer | null = null;
    private m_width: number | undefined;
    private m_height: number | undefined;

    /** Constructor. */
    constructor(private gl: WebGLRenderingContext | WebGL2RenderingContext) { }

    /** Creates OpenGL objects */
    createGLData(width: number, height: number) {
        this.m_width = width;
        this.m_height = height;

        if (this.m_textureHandle !== null && this.m_width > 0 && this.m_height > 0) {
            this.m_framebufferHandle = this.gl.createFramebuffer(); // alternative to GLES20.glGenFramebuffers()

            if (this.m_textureHandle !== null) {
                this.gl.bindTexture(this.gl.TEXTURE_2D, this.m_textureHandle);

                this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.m_framebufferHandle);
                this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, this.m_textureHandle, 0);
                this.checkGlError("FB");
            }

            if (this.m_depthTextureHandle === null) {
                this.m_depthbufferHandle = this.gl.createRenderbuffer();

                this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, this.m_depthbufferHandle);
                this.checkGlError("FB - glBindRenderbuffer");
                this.gl.renderbufferStorage(this.gl.RENDERBUFFER, this.gl.DEPTH_COMPONENT16, this.m_width, this.m_height);
                this.checkGlError("FB - glRenderbufferStorage");
                this.gl.framebufferRenderbuffer(this.gl.FRAMEBUFFER, this.gl.DEPTH_ATTACHMENT, this.gl.RENDERBUFFER, this.m_depthbufferHandle);
                this.checkGlError("FB - glFramebufferRenderbuffer");
            } else {
                this.gl.bindTexture(this.gl.TEXTURE_2D, this.m_depthTextureHandle);
                this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.m_framebufferHandle);
                this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.DEPTH_ATTACHMENT, this.gl.TEXTURE_2D, this.m_depthTextureHandle, 0);
                this.checkGlError("FB depth");
            }

            const result = this.gl.checkFramebufferStatus(this.gl.FRAMEBUFFER);
            if (result != this.gl.FRAMEBUFFER_COMPLETE) {
                console.error(`Error creating framebufer: ${result}`);
            }

            this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, null);
            // this.gl.bindTexture(this.gl.TEXTURE_2D, 0);
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
        }
    }

    private checkGlError(op: string) {
        let error;
        while ((error = this.gl.getError()) !== this.gl.NO_ERROR) {
            console.error(`${op}: glError ${error}`);
        }
    }

    public get width(): number | undefined {
        return this.m_width;
    }
    public set width(value: number | undefined) {
        this.m_width = value;
    }
    public get height(): number | undefined {
        return this.m_height;
    }
    public set height(value: number | undefined) {
        this.m_height = value;
    }

    public get textureHandle(): WebGLTexture | null {
        return this.m_textureHandle;
    }
    public set textureHandle(value: WebGLTexture | null) {
        this.m_textureHandle = value;
    }

    public get depthbufferHandle(): WebGLRenderbuffer | null {
        return this.m_depthbufferHandle;
    }
    public set depthbufferHandle(value: WebGLRenderbuffer | null) {
        this.m_depthbufferHandle = value;
    }

    public get framebufferHandle(): WebGLFramebuffer | null {
        return this.m_framebufferHandle;
    }
    public set framebufferHandle(value: WebGLFramebuffer | null) {
        this.m_framebufferHandle = value;
    }

    public get depthTextureHandle(): WebGLTexture | null {
        return this.m_depthTextureHandle;
    }
    public set depthTextureHandle(value: WebGLTexture | null) {
        this.m_depthTextureHandle = value;
    }
}
