import { FullModel } from "./FullModel";
import { RendererWithExposedMethods } from "./RendererWithExposedMethods";

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
     */
    drawModel(
        renderer: RendererWithExposedMethods,
        model: FullModel,
        tx: number, ty: number, tz: number,
        rx: number, ry: number, rz: number,
        sx: number, sy: number, sz: number
    ): void;
}
