export class UncompressedTextureLoader {
  static load(
    url: string,
    gl: WebGLRenderingContext,
    minFilter = gl.LINEAR,
    magFilter = gl.LINEAR,
    clamp = false
  ): Promise<WebGLTexture> {
    return new Promise((resolve, reject) => {
      const texture = gl.createTexture()

      if (texture === null) {
        reject('Error creating WebGL texture')
        return
      }

      const image = new Image()
      image.src = url
      image.onload = () => {
        gl.bindTexture(gl.TEXTURE_2D, texture)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minFilter)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, magFilter)
        if (clamp === true) {
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
        } else {
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT)
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT)
        }
        gl.bindTexture(gl.TEXTURE_2D, null)

        if (image && image.src) {
          console.log(`Loaded texture ${url} [${image.width}x${image.height}]`)
        }

        resolve(texture)
      }
      image.onerror = () => reject('Cannot load image')
    })
  }
}
