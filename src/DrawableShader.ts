import { FullModel } from "./FullModel";
import { RendererWithExposedMethods } from "./RendererWithExposedMethods";

/**
 * Descriptor of a vertex attribute.
 */
export type AttributeDescriptor = [size: GLint, type: GLenum, normalized: GLboolean, stride: GLsizei, offset: GLintptr];

export interface DrawableShader {
    /**
     * Draws model using this shader. Binds draw buffers.
     *
     * @param renderer Renderer instance.
     * @param model    Model to draw.
     * @param tx       Translation x
     * @param ty       Translation y
     * @param tz       Translation z
     * @param rx       Rotation x
     * @param ry       Rotation y
     * @param rz       Rotation z
     * @param sx       Scale x
     * @param sy       Scale y
     * @param sz       Scale z
     * @param attribs  Vertex data attribute bindings. Key - attribute id, value - descriptor params.
     */
    drawModel(
        renderer: RendererWithExposedMethods,
        model: FullModel,
        tx: number, ty: number, tz: number,
        rx: number, ry: number, rz: number,
        sx: number, sy: number, sz: number,
        attribs?: Map<number, AttributeDescriptor>
    ): void;
}
