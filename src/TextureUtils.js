'use strict';

define(() => {

    function TextureUtils() { }

    TextureUtils.createNPOTTexture = (texWidth, texHeight, bUseAlpha) => {
        const textureID = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, textureID);
        gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        const stride = texWidth * (bUseAlpha ? 4 : 3);
        const dataArray = new Uint8Array(stride * texHeight);
        let glFormat = null, glInternalFormat = null;

        if (bUseAlpha) {
            glFormat = gl.RGBA;
            glInternalFormat = gl.RGBA;
        } else {
            glFormat = gl.RGB;
            glInternalFormat = gl.RGB;
        }

        gl.texImage2D(gl.TEXTURE_2D, 0, glInternalFormat, texWidth, texHeight, 0, glFormat, gl.UNSIGNED_BYTE, dataArray);

        return textureID;
    };

    TextureUtils.createDepthTexture = (texWidth, texHeight) => {
        const textureID = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, textureID);
        gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        const stride = texWidth * 4; // GL_DEPTH_COMPONENT32F
        const dataArray = new Uint8Array(stride * texHeight);
        const glFormat = gl.DEPTH_COMPONENT;
        const glInternalFormat = gl.DEPTH_COMPONENT;

        // FIXME: In WebGL, we cannot pass array to depth texture.

        // gl.texImage2D(gl.TEXTURE_2D, 0, glInternalFormat, texWidth, texHeight, 0, glFormat, gl.UNSIGNED_BYTE, dataArray);
        // gl.texImage2D(gl.TEXTURE_2D, 0, glInternalFormat, texWidth, texHeight, 0, glFormat, gl.UNSIGNED_SHORT, dataArray);
        gl.texImage2D(gl.TEXTURE_2D, 0, glInternalFormat, texWidth, texHeight, 0, glFormat, gl.UNSIGNED_SHORT, null);

        return textureID;
    };

    return TextureUtils;
});




//     public int createNPOTTexture(String filename, int texWidth, int texHeight, boolean bUseAlpha) {
//         if (mapGPUTextures.containsKey(filename)) {
//             // Log.d(TAG, "Texture '" + filename + "' is already in GPU, reusing it.");
//             return mapGPUTextures.get(filename);
//         } else {
//             int[] textures = new int[1];
//             GLES20.glGenTextures(1, textures, 0);

//             int textureID = textures[0];
//             GLES20.glBindTexture(GLES20.GL_TEXTURE_2D, textureID);

//             GLES20.glTexParameterf(GLES20.GL_TEXTURE_2D, GLES20.GL_TEXTURE_MIN_FILTER, GLES20.GL_NEAREST);
//             GLES20.glTexParameterf(GLES20.GL_TEXTURE_2D, GLES20.GL_TEXTURE_MAG_FILTER, GLES20.GL_LINEAR);

//             GLES20.glTexParameteri(GLES20.GL_TEXTURE_2D, GLES20.GL_TEXTURE_WRAP_S, GLES20.GL_CLAMP_TO_EDGE);
//             GLES20.glTexParameteri(GLES20.GL_TEXTURE_2D, GLES20.GL_TEXTURE_WRAP_T, GLES20.GL_CLAMP_TO_EDGE);

//             String key = filename + "-decoded";

//             if (mapTextures.containsKey(key)) {
//                 //Log.d(TAG, "Loading cached PNG decoded data: " + key);
//                 GLTextureData tex = mapTextures.get(key);
//                 tex.getBuffer().position(0);
//                 GLES20.glTexImage2D(GLES20.GL_TEXTURE_2D, 0, tex.getGlInternalFormat(), tex.getWidth(), tex.getHeight(), 0, tex.getGlFormat(), GLES20.GL_UNSIGNED_BYTE, tex.getBuffer());
//             } else {
//                 //Log.d(TAG, "Loading non-cached PNG decoded data: " + key);

//                 GLTextureData tex = new GLTextureData();

//                 int stride = texWidth * (bUseAlpha ? 4 : 3);
//                 tex.setBuffer(ensureBufferSize(tex.getBuffer(), stride * texHeight));

//                 int glFormat, glInternalFormat;
//                 if (bUseAlpha) {
//                     glFormat = GL_RGBA;
//                     glInternalFormat = GL_RGBA;
//                 } else {
//                     glFormat = GL_RGB;
//                     glInternalFormat = GL_RGB;
//                 }

//                 tex.getBuffer().flip();

//                 memoryUsed += stride * texHeight;
//                 mapTextures.put(key, tex);
//                 tex.getBuffer().position(0);
//                 tex.setGlFormat(glFormat);
//                 tex.setGlInternalFormat(glInternalFormat);
//                 tex.setWidth(texWidth);
//                 tex.setHeight(texHeight);
//                 GLES20.glTexImage2D(GLES20.GL_TEXTURE_2D, 0, glInternalFormat, texWidth, texHeight, 0, glFormat, GLES20.GL_UNSIGNED_BYTE, tex.getBuffer());
//                 checkGlError("create texture");
//             }

//             mapGPUTextures.put(filename, textureID);
//             return textureID;
//         }
//     }

//     public int createDepthTexture(String filename, int texWidth, int texHeight) {
//         if (mapGPUTextures.containsKey(filename)) {
//              Log.d(TAG, "Texture '" + filename + "' is already in GPU, reusing it.");
//             return mapGPUTextures.get(filename);
//         } else {
//             int[] textures = new int[1];
//             GLES20.glGenTextures(1, textures, 0);

//             int textureID = textures[0];
//             GLES20.glBindTexture(GLES20.GL_TEXTURE_2D, textureID);

// //            GLES20.glTexParameterf(GLES20.GL_TEXTURE_2D, GLES20.GL_TEXTURE_MIN_FILTER, GLES20.GL_NEAREST);
// //            GLES20.glTexParameterf(GLES20.GL_TEXTURE_2D, GLES20.GL_TEXTURE_MAG_FILTER, GLES20.GL_NEAREST);
// //            FIXME linear
//             GLES20.glTexParameterf(GLES20.GL_TEXTURE_2D, GLES20.GL_TEXTURE_MIN_FILTER, GLES20.GL_LINEAR);
//             GLES20.glTexParameterf(GLES20.GL_TEXTURE_2D, GLES20.GL_TEXTURE_MAG_FILTER, GLES20.GL_LINEAR);

//             GLES20.glTexParameteri(GLES20.GL_TEXTURE_2D, GLES20.GL_TEXTURE_WRAP_S, GLES20.GL_CLAMP_TO_EDGE);
//             GLES20.glTexParameteri(GLES20.GL_TEXTURE_2D, GLES20.GL_TEXTURE_WRAP_T, GLES20.GL_CLAMP_TO_EDGE);

//             String key = filename;

//             if (mapTextures.containsKey(key)) {
//                 GLTextureData tex = mapTextures.get(key);
//                 tex.getBuffer().position(0);
//                 GLES20.glTexImage2D(GLES20.GL_TEXTURE_2D, 0, tex.getGlInternalFormat(), tex.getWidth(), tex.getHeight(), 0, tex.getGlFormat(), GLES20.GL_UNSIGNED_INT, tex.getBuffer());
//             } else {
//                 GLTextureData tex = new GLTextureData();

//                 int stride = texWidth * (4); // GL_DEPTH_COMPONENT32F
//                 tex.setBuffer(ensureBufferSize(tex.getBuffer(), stride * texHeight));

//                 int glFormat, glInternalFormat;
//                 glFormat = GLES20.GL_DEPTH_COMPONENT;
//                 glInternalFormat = GLES30.GL_DEPTH_COMPONENT;

//                 tex.getBuffer().flip();

//                 memoryUsed += stride * texHeight;
//                 mapTextures.put(key, tex);
//                 tex.getBuffer().position(0);
//                 tex.setGlFormat(glFormat);
//                 tex.setGlInternalFormat(glInternalFormat);
//                 tex.setWidth(texWidth);
//                 tex.setHeight(texHeight);
//                 GLES20.glTexImage2D(GLES20.GL_TEXTURE_2D, 0, glInternalFormat, texWidth, texHeight, 0, glFormat, GLES20.GL_UNSIGNED_INT, tex.getBuffer());
//                 checkGlError("create texture");
//             }

//             mapGPUTextures.put(filename, textureID);
//             return textureID;
//         }
//     }