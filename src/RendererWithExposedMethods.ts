/**
 * Renderer which exposes certain methods to set WebGL state and update matrices.
 */
export interface RendererWithExposedMethods {
    /**
     * Updates MVP matrix.
     *
     * @param tx Translation x component.
     * @param ty Translation y component.
     * @param tz Translation z component.
     * @param rx Rotation x component.
     * @param ry Rotation y component.
     * @param rz Rotation z component.
     * @param sx Scale x component.
     * @param sy Scale y component.
     * @param sz Scale z component.
     */
    calculateMVPMatrix(
        tx: number, ty: number, tz: number,
        rx: number, ry: number, rz: number,
        sx: number, sy: number, sz: number
    ): void;

    /**
     * Binds OpenGL texture to texture unit.
     *
     * @param textureUnit Texture unit id.
     * @param textureID   Texture id.
     * @param uniformID   Shader uniform.
     */
    setTexture2D(textureUnit: number, texture: WebGLTexture, uniform: WebGLUniformLocation): void;

    /**
     * Get MVP matrix.
     *
     * @return MVP matrix.
     */
    getMVPMatrix(): Float32Array;

    /**
     * Returns orthographic matrix to render to off-screen targets.
     *
     * @return Orthographic matrix.
     */
    getOrthoMatrix(): Float32Array;

    /**
     * Checks for OpenGL ES errors.
     *
     * @param op Message to log.
     */
    checkGlError(operation: string): void;

    // /**
    //  * Invalidate depth buffer for attachment.
    //  */
    // invalidateDepthAttachment(): void;

    // /**
    //  * Invalidate on-screen depth buffer.
    //  */
    // invalidateDepthDefault(): void;

    /**
     * Unbinds all currently bound OpenGL ES buffers.
     */
    unbindBuffers(): void;

    /**
     * Get model matrix.
     *
     * @return Model matrix.
     */
    getModelMatrix(): Float32Array;

    /**
     * Get view matrix.
     *
     * @return View matrix.
     */
    getViewMatrix(): Float32Array;

    /** Getter for current WebGL context. */
    gl: WebGLRenderingContext;
}
