'use strict';

define(() => {

    class FrameBuffer {

        /**
         * Constructor
         */
        constructor() {
            this.textureHandle = null;
            this.depthTextureHandle = null;
            this.framebufferHandle = null;
            this.depthbufferHandle = null;
            this.width = 0;
            this.height = 0;
        }

        /**
         * Creates OpenGL objects
         */
        createGLData() {
            if (this.textureHandle !== null && this.width > 0 && this.height > 0) {
                this.framebufferHandle = gl.createFramebuffer(); // alternative to GLES20.glGenFramebuffers()

                if (this.textureHandle !== null) {
                    gl.bindTexture(gl.TEXTURE_2D, this.textureHandle);

                    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebufferHandle);
                    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.textureHandle, 0);
                    this.checkGlError("FB");
                }

                if (this.depthTextureHandle === null) {
                    this.depthbufferHandle = gl.createRenderBuffer();


                    gl.bindRenderbuffer(gl.RENDERBUFFER, this.depthbufferHandle);
                    this.checkGlError("FB - glBindRenderbuffer");
                    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, this.width, this.height);
                    checkGlError("FB - glRenderbufferStorage");
                    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this.depthbufferHandle);
                    checkGlError("FB - glFramebufferRenderbuffer");
                } else {
                    gl.bindTexture(gl.TEXTURE_2D, this.depthTextureHandle);
                    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebufferHandle);
                    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, this.depthTextureHandle, 0);
                    checkGlError("FB depth");
                }

                const result = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
                if (result != gl.FRAMEBUFFER_COMPLETE) {
                    console.error(`Error creating framebufer: ${result}`);
                }

                gl.bindRenderbuffer(gl.RENDERBUFFER, 0);
                gl.bindTexture(gl.TEXTURE_2D, 0);
                gl.bindFramebuffer(gl.FRAMEBUFFER, 0);
            }
        }

        checkGlError(op) {
            let error;

            while ((error = GLES20.glGetError()) !== gl.NO_ERROR) {
                console.error(`${op}: glError ${error}`);
            }
        }
    };

    return FrameBuffer;
});
