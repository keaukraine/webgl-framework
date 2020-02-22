import { BinaryDataLoader } from "./BinaryDataLoader";

export class FullModel {
    /** Indices buffer. */
    protected bufferIndices: any;
    /** Strides buffer. */
    protected bufferStrides: any;
    /** Number of model indices. */
    protected numIndices = 0;

    /** Default constructor. */
    constructor(protected gl: WebGLRenderingContext) { }

    private loadBuffer(buffer: WebGLBuffer, target: number, arrayBuffer: ArrayBuffer) {
        var byteArray = new Uint8Array(arrayBuffer, 0, arrayBuffer.byteLength);
        this.gl.bindBuffer(target, buffer);
        this.gl.bufferData(target, byteArray, this.gl.STATIC_DRAW);
    }

    /**
     * Loads model.
     *
     * @param url Base URL to model indices and strides files.
     * @returns Promise which resolves when model is loaded.
     */
    async load(url: string): Promise<void> {
        const dataIndices = await BinaryDataLoader.load(url + "-indices.bin");
        const dataStrides = await BinaryDataLoader.load(url + "-strides.bin");
        console.log(`Loaded  + ${url}-indices.bin: ${dataIndices.byteLength} bytes.`);
        console.log(`Loaded  + ${url}-strides.bin: ${dataStrides.byteLength} bytes.`);

        this.bufferIndices = this.gl.createBuffer();
        this.loadBuffer(this.bufferIndices, this.gl.ELEMENT_ARRAY_BUFFER, dataIndices);
        this.numIndices = dataIndices.byteLength / 2 / 3;

        this.bufferStrides = this.gl.createBuffer();
        this.loadBuffer(this.bufferStrides, this.gl.ARRAY_BUFFER, dataStrides);
    }

    /**
     * Binds buffers for a `glDrawElements()` call.
     */
    bindBuffers(): void {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.bufferStrides);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.bufferIndices);
    }

    /**
     * Returns number of indices in model.
     *
     * @return Number of indices
     */
    getNumIndices() {
        return this.numIndices;
    }
}
