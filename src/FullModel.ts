import { BinaryDataLoader } from './BinaryDataLoader'

export class FullModel {
  /** Indices buffer. */
  protected bufferIndices: any
  /** Strides buffer. */
  protected bufferStrides: any
  /** Number of model indices. */
  protected numIndices = 0

  /** Default constructor. */
  constructor() {}

  private loadBuffer(
    gl: WebGLRenderingContext,
    buffer: WebGLBuffer,
    target: number,
    arrayBuffer: ArrayBuffer
  ) {
    var byteArray = new Uint8Array(arrayBuffer, 0, arrayBuffer.byteLength)
    gl.bindBuffer(target, buffer)
    gl.bufferData(target, byteArray, gl.STATIC_DRAW)
  }

  /**
   * Loads model.
   *
   * @param url Base URL to model indices and strides files.
   * @param gl WebGL context.
   * @returns Promise which resolves when model is loaded.
   */
  async load(url: string, gl: WebGLRenderingContext): Promise<void> {
    const dataIndices = await BinaryDataLoader.load(url + '-indices.bin')
    const dataStrides = await BinaryDataLoader.load(url + '-strides.bin')
    console.log(`Loaded  + ${url}-indices.bin: ${dataIndices.byteLength} bytes.`)
    console.log(`Loaded  + ${url}-strides.bin: ${dataStrides.byteLength} bytes.`)

    this.bufferIndices = gl.createBuffer()
    this.loadBuffer(gl, this.bufferIndices, gl.ELEMENT_ARRAY_BUFFER, dataIndices)
    this.numIndices = dataIndices.byteLength / 2 / 3

    this.bufferStrides = gl.createBuffer()
    this.loadBuffer(gl, this.bufferStrides, gl.ARRAY_BUFFER, dataStrides)
  }

  /**
   * Binds buffers for a `glDrawElements()` call.
   *
   * @param gl WebGL context.
   */
  bindBuffers(gl: WebGLRenderingContext): void {
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferStrides)
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufferIndices)
  }

  /**
   * Returns number of indices in model.
   *
   * @return Number of indices
   */
  getNumIndices() {
    return this.numIndices
  }
}
