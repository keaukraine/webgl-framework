export class UncompressedTextureLoader {
    static load(
        url: string,
        gl: WebGLRenderingContext,
        minFilter = gl.LINEAR,
        magFilter = gl.LINEAR,
        clamp = false
    ): Promise<WebGLTexture> {
        return new Promise((resolve, reject) => {
            const texture = gl.createTexture();

            if (texture === null) {
                reject("Error creating WebGL texture");
                return;
            }

            const image = new Image();
            image.src = url;
            image.onload = () => {
                gl.bindTexture(gl.TEXTURE_2D, texture);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minFilter);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, magFilter);
                if (clamp === true) {
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                } else {
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
                }
                gl.bindTexture(gl.TEXTURE_2D, null);

                if (image && image.src) {
                    console.log(`Loaded texture ${url} [${image.width}x${image.height}]`);
                }

                resolve(texture);
            }
            image.onerror = () => reject("Cannot load image");
        });
    }

    static async loadCubemap(url: string, gl: WebGL2RenderingContext, extension = "png"): Promise<WebGLTexture> {
        const texture = gl.createTexture();

        if (texture === null) {
            throw new Error("Error creating WebGL texture");
        }

        gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

        const promises = [
            { type: gl.TEXTURE_CUBE_MAP_POSITIVE_X, suffix: `-posx.${extension}` },
            { type: gl.TEXTURE_CUBE_MAP_NEGATIVE_X, suffix: `-negx.${extension}` },
            { type: gl.TEXTURE_CUBE_MAP_POSITIVE_Y, suffix: `-posy.${extension}` },
            { type: gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, suffix: `-negy.${extension}` },
            { type: gl.TEXTURE_CUBE_MAP_POSITIVE_Z, suffix: `-posz.${extension}` },
            { type: gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, suffix: `-negz.${extension}` }
        ].map(face =>
            new Promise<void>((resolve, reject) => {
                const image = new Image();
                image.src = url + face.suffix;

                image.onload = () => {
                    gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
                    // gl.texImage2D(face.type, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
                    gl.texImage2D(face.type, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

                    if (image && image.src) {
                        console.log(`Loaded texture ${url}${face.suffix} [${image.width}x${image.height}]`);
                    }

                    resolve();
                }
                image.onerror = () => reject("Cannot load image");
            })
        );

        await Promise.all(promises);

        gl.bindTexture(gl.TEXTURE_2D, null);

        return texture;
    }
}
