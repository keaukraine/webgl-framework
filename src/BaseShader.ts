export abstract class BaseShader {
  protected vertexShaderCode = "";
  protected fragmentShaderCode = "";
  protected program: WebGLProgram | undefined;

  /**
   * Constructor. Compiles shader.
   */
  constructor(protected gl: WebGLRenderingContext) {
    this.fillCode();
    this.initShader();
  }

  /**
   * Used to fill shader code. Put actual shader code to this.vertexShaderCode and this.fragmentShaderCode
   */
  abstract fillCode(): void

  /**
   * Creates WebGL shader from code.
   *
   * @param type Shader type.
   * @param code GLSL code.
   * @returns Shader or `undefined` if there were errors during shader compilation.
   */
  private getShader(type: GLenum, code: string): WebGLShader | undefined {
    const shader = this.gl.createShader(type);

    if (!shader) {
      console.warn('Error creating shader.');
      return undefined;
    }

    this.gl.shaderSource(shader, code);
    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.warn(this.gl.getShaderInfoLog(shader));
      return undefined;
    }

    return shader;
  }

  /**
   * Retrieve and save uniforms and attributes for actual shader here
   */
  abstract fillUniformsAttributes(): void

  /**
   * Get shader unform location.
   *
   * @param uniform Uniform name.
   * @return Uniform location.
   */
  getUniform(uniform: string): WebGLUniformLocation {
    if (this.program === undefined) {
      throw new Error('No program for shader.');
    }
    const result = this.gl.getUniformLocation(this.program, uniform);
    if (result !== null) {
      return result;
    } else {
      throw new Error(`Cannot get uniform "${uniform}".`);
    }
  }

  /**
   * Get shader attribute location
   *
   * @param attrib Attribute name
   * @return Attribute location
   */
  getAttrib(attrib: string): number {
    if (this.program === undefined) {
      throw new Error("No program for shader.");
    }
    return this.gl.getAttribLocation(this.program, attrib);
  }

  /**
   * Initializes shader.
   */
  private initShader(): void {
    const fragmentShader = this.getShader(this.gl.FRAGMENT_SHADER, this.fragmentShaderCode);
    const vertexShader = this.getShader(this.gl.VERTEX_SHADER, this.vertexShaderCode);
    const shaderProgram = this.gl.createProgram();

    if (fragmentShader === undefined || vertexShader === undefined || shaderProgram === null) {
      return;
    }

    this.gl.attachShader(shaderProgram, vertexShader);
    this.gl.attachShader(shaderProgram, fragmentShader);
    this.gl.linkProgram(shaderProgram);

    if (!this.gl.getProgramParameter(shaderProgram, this.gl.LINK_STATUS)) {
      console.warn(this.constructor.name + ": Could not initialise shader");
    } else {
      console.log(this.constructor.name + ": Initialised shader");
    }

    this.gl.useProgram(shaderProgram);
    this.program = shaderProgram;

    this.fillUniformsAttributes();
  }

  /**
   * Activates shader.
   */
  use(): void {
    if (this.program) {
      this.gl.useProgram(this.program);
    }
  }

  /**
   * Deletes shader.
   */
  deleteProgram(): void {
    if (this.program) {
      this.gl.deleteProgram(this.program);
    }
  }
}
