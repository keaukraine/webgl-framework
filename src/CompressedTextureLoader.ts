import { BinaryDataLoader } from "./BinaryDataLoader";

const PKM_HEADER_SIZE = 16; // size of PKM header
const PKM_HEADER_WIDTH_OFFSET = 8; // offset to texture width
const PKM_HEADER_HEIGHT_OFFSET = 10; // offset to texture height
const ETC1_RGB8_OES = 36196;

export class CompressedTextureLoader {
    /**
     * Loads ETC1 texture in PKM container.
     *
     * @param url URL to texture PKM file.
     * @param gl WebGL context.
     */
    static async loadETC1(
        url: string,
        gl: WebGLRenderingContext | WebGL2RenderingContext
    ): Promise<WebGLTexture | null> {
        const texture = gl.createTexture();
        const data = await BinaryDataLoader.load(url);

        if (data.byteLength > 0) {
            // Endianness depends on machine architecture, can't read Int16
            // In PKM, width and height are big-endian, and x86 is little-endian and ARM is bi-endian
            const bufWidth = new Uint8Array(data, PKM_HEADER_WIDTH_OFFSET, 2);
            const width = bufWidth[0] * 256 + bufWidth[1];
            const bufHeight = new Uint8Array(data, PKM_HEADER_HEIGHT_OFFSET, 2);
            const height = bufHeight[0] * 256 + bufHeight[1];
            const bufData = new Uint8Array(data, PKM_HEADER_SIZE, data.byteLength - PKM_HEADER_SIZE);

            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.compressedTexImage2D(gl.TEXTURE_2D, 0, ETC1_RGB8_OES, width, height, 0, bufData);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.bindTexture(gl.TEXTURE_2D, null);

            console.log('Loaded texture ' + url + ' [' + width + 'x' + height + ']');

            return texture;
        } else {
            throw new Error("No texture data received");
        }
    }
}
