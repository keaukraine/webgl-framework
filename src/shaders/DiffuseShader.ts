import { BaseShader } from "../BaseShader";
import { AttributeDescriptor, DrawableShader } from "../DrawableShader";
import { RendererWithExposedMethods } from "../RendererWithExposedMethods";
import { FullModel } from "../FullModel";

/**
 * Simple shader using one texture.
 */
export class DiffuseShader extends BaseShader implements DrawableShader {
    view_proj_matrix: WebGLUniformLocation | undefined;
    sTexture: WebGLUniformLocation | undefined;
    rm_Vertex: number | undefined;
    rm_TexCoord0: number | undefined;

    /** @inheritdoc */
    fillCode() {
        this.vertexShaderCode = 'uniform mat4 view_proj_matrix;\n' +
            'attribute vec4 rm_Vertex;\n' +
            'attribute vec2 rm_TexCoord0;\n' +
            'varying vec2 vTextureCoord;\n' +
            '\n' +
            'void main() {\n' +
            '  gl_Position = view_proj_matrix * rm_Vertex;\n' +
            '  vTextureCoord = rm_TexCoord0;\n' +
            '}';

        this.fragmentShaderCode = 'precision mediump float;\n' +
            'varying vec2 vTextureCoord;\n' +
            'uniform sampler2D sTexture;\n' +
            '\n' +
            'void main() {\n' +
            '  gl_FragColor = texture2D(sTexture, vTextureCoord);\n' +
            '}';
    }

    /** @inheritdoc */
    fillUniformsAttributes() {
        this.view_proj_matrix = this.getUniform('view_proj_matrix');
        this.rm_Vertex = this.getAttrib('rm_Vertex');
        this.rm_TexCoord0 = this.getAttrib('rm_TexCoord0');
        this.sTexture = this.getUniform('sTexture');
    }

    /** @inheritdoc */
    drawModel(
        renderer: RendererWithExposedMethods,
        model: FullModel,
        tx: number, ty: number, tz: number,
        rx: number, ry: number, rz: number,
        sx: number, sy: number, sz: number,
        attribs?: Map<number, AttributeDescriptor>
    ): void {
        if (this.rm_Vertex === undefined || this.rm_TexCoord0 === undefined || this.view_proj_matrix === undefined) {
            return;
        }

        const gl = renderer.gl;

        model.bindBuffers(gl);

        gl.enableVertexAttribArray(this.rm_Vertex);
        gl.enableVertexAttribArray(this.rm_TexCoord0);

        if (attribs) {
            for (const [key, value] of attribs) {
                gl.vertexAttribPointer(key, ...value);
            }
        } else {
            gl.vertexAttribPointer(this.rm_Vertex, 3, gl.FLOAT, false, 4 * (3 + 2), 0);
            gl.vertexAttribPointer(this.rm_TexCoord0, 2, gl.FLOAT, false, 4 * (3 + 2), 4 * 3);
        }

        renderer.calculateMVPMatrix(tx, ty, tz, rx, ry, rz, sx, sy, sz);

        gl.uniformMatrix4fv(this.view_proj_matrix, false, renderer.getMVPMatrix());
        gl.drawElements(gl.TRIANGLES, model.getNumIndices() * 3, gl.UNSIGNED_SHORT, 0);

        renderer.checkGlError("DiffuseShader glDrawElements");
    }
}
