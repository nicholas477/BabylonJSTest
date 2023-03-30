import { RenderPixelatedPass } from 'three/addons/postprocessing/RenderPixelatedPass.js';

class PixelationPass extends RenderPixelatedPass {
    render(renderer, writeBuffer, readBuffer) {

        const uniforms = this.fsQuad.material.uniforms;
        uniforms.normalEdgeStrength.value = this.normalEdgeStrength;
        uniforms.depthEdgeStrength.value = this.depthEdgeStrength;

        renderer.setRenderTarget(this.beautyRenderTarget);
        renderer.render(this.scene, this.camera);

        const overrideMaterial_old = this.scene.overrideMaterial;
        renderer.setRenderTarget(this.normalRenderTarget);
        this.scene.overrideMaterial = this.normalMaterial;
        renderer.render(this.scene, this.camera);
        this.scene.overrideMaterial = overrideMaterial_old;

        uniforms.tDiffuse.value = this.beautyRenderTarget.texture;
        uniforms.tDepth.value = this.beautyRenderTarget.depthTexture;
        uniforms.tNormal.value = this.normalRenderTarget.texture;

        if (this.renderToScreen) {

            renderer.setRenderTarget(null);

        } else {

            renderer.setRenderTarget(writeBuffer);

            if (this.clear) renderer.clear();

        }

        this.fsQuad.render(renderer);

    }
}

export { PixelationPass }