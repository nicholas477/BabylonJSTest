import { WebGLRenderer, ACESFilmicToneMapping, sRGBEncoding, PCFSoftShadowMap, WebGLRenderTarget, LinearFilter, RGBAFormat, FloatType, LinearToneMapping, LinearEncoding, Vector2 } from "three";
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { registerResizeListener } from "./Resizer.js";
import { getWorld } from "../World/World.js";

import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { RenderPixelatedPass } from 'three/addons/postprocessing/RenderPixelatedPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { SAOPass } from 'three/addons/postprocessing/SAOPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { AdaptiveToneMappingPass } from 'three/addons/postprocessing/AdaptiveToneMappingPass.js';
import { ACESFilmicToneMappingShader } from '../Shaders/ACESFilmicToneMappingShader.js';
import { GammaCorrectionShader } from 'three/addons/shaders/GammaCorrectionShader.js';

class Renderer {
    constructor(scene, camera) {
        this.scene = scene;
        this.camera = camera;

        this.rendererFolder = getWorld().gui.addFolder("Renderer");

        this.webGLRenderer = new WebGLRenderer({ antialias: true });
        this.webGLRenderer.setPixelRatio(window.devicePixelRatio);
        this.webGLRenderer.setSize(window.innerWidth, window.innerHeight);
        this.webGLRenderer.shadowMap.type = PCFSoftShadowMap;
        this.webGLRenderer.shadowMap.enabled = true;
        // this.webGLRenderer.gammaFactor = 2.2;
        this.webGLRenderer.toneMapping = LinearToneMapping;
        //this.webGLRenderer.toneMappingExposure = 0.85;
        this.webGLRenderer.outputEncoding = LinearEncoding;

        this.initializeComposer();

        registerResizeListener(this);
    }

    initializeComposer() {
        const parameters = { minFilter: LinearFilter, magFilter: LinearFilter, format: RGBAFormat, type: FloatType };
        this.hdrRenderTarget = new WebGLRenderTarget(window.innerWidth, window.innerHeight, parameters);
        this.composer = new EffectComposer(this.webGLRenderer, this.hdrRenderTarget);

        const renderScene = new RenderPass(this.scene, this.camera);
        this.composer.addPass(renderScene);

        this.createSSAOPass();
        this.createTonemappingPass();
        this.createBloomPass();
        this.createGammaCorrectionPass();

        //     const renderPixelatedPass = new RenderPixelatedPass(3, this.scene, this.camera);
        //     renderPixelatedPass.depthEdgeStrength = 1.0;
        //     renderPixelatedPass.normalEdgeStrength = 0.1;

        //     const pixelationFolder = this.gui.addFolder("Pixelation");
        //     pixelationFolder.add(renderPixelatedPass, 'enabled');
        //     pixelationFolder.add(renderPixelatedPass, 'depthEdgeStrength', 0, 10);
        //     pixelationFolder.add(renderPixelatedPass, 'normalEdgeStrength', 0, 10);
        //     this.composer.addPass(renderPixelatedPass);
    }

    createSSAOPass() {
        if (this.saoPass) {
            this.composer.removePass(this.saoPass);
            this.saoPass.dispose();
            this.saoPass = null;
        }

        if (this.ssaoFolder) {
            this.ssaoFolder.destroy();
            this.ssaoFolder = null;
        }

        this.saoPass = new SAOPass(this.scene, this.camera, false, true);
        this.saoPass.params.saoBias = 0.5;
        this.saoPass.params.saoIntensity = 0.385;
        this.saoPass.params.saoScale = 256;
        this.saoPass.params.saoKernelRadius = 8;
        this.composer.addPass(this.saoPass);

        this.ssaoFolder = this.rendererFolder.addFolder("SSAO");
        this.ssaoFolder.add(this.saoPass.params, 'output', {
            'Beauty': SAOPass.OUTPUT.Beauty,
            'Beauty+SAO': SAOPass.OUTPUT.Default,
            'SAO': SAOPass.OUTPUT.SAO,
            'Depth': SAOPass.OUTPUT.Depth,
            'Normal': SAOPass.OUTPUT.Normal
        }).onChange(function (value) {
            this.saoPass.params.output = parseInt(value);
        });
        this.ssaoFolder.add(this.saoPass.params, 'saoBias', - 1024, 1024);
        this.ssaoFolder.add(this.saoPass.params, 'saoIntensity', 0, 1);
        this.ssaoFolder.add(this.saoPass.params, 'saoScale', 0, 1024);
        this.ssaoFolder.add(this.saoPass.params, 'saoKernelRadius', 0, 1024);
        this.ssaoFolder.add(this.saoPass.params, 'saoMinResolution', 0, 1);
        this.ssaoFolder.add(this.saoPass.params, 'saoBlur');
        this.ssaoFolder.add(this.saoPass.params, 'saoBlurRadius', 0, 200);
        this.ssaoFolder.add(this.saoPass.params, 'saoBlurStdDev', 0.5, 150);
        this.ssaoFolder.add(this.saoPass.params, 'saoBlurDepthCutoff', 0.0, 0.1);
    }

    createBloomPass() {
        if (this.bloomPass) {
            this.composer.removePass(this.bloomPass);
            this.bloomPass.dispose();
            this.bloomPass = null;
        }

        if (this.bloomFolder) {
            this.bloomFolder.destroy();
            this.bloomFolder = null;
        }

        this.bloomPass = new UnrealBloomPass(new Vector2(window.innerWidth, window.innerHeight), 1.0, 0.4, 0.85);
        this.bloomFolder = this.rendererFolder.addFolder("Bloom");
        this.bloomFolder.add(this.bloomPass, 'threshold').min(0).max(10);
        this.bloomFolder.add(this.bloomPass, 'strength').min(0).max(10);
        this.bloomFolder.add(this.bloomPass, 'radius').min(0).max(10);
        // bloomPass.threshold = params.bloomThreshold;
        // bloomPass.strength = params.bloomStrength;
        // bloomPass.radius = params.bloomRadius;
        this.composer.addPass(this.bloomPass);
    }

    createTonemappingPass() {
        if (this.tonemappingPass) {
            this.composer.removePass(this.tonemappingPass);
            this.tonemappingPass.dispose();
            this.tonemappingPass = null;
        }

        this.tonemappingPass = new ShaderPass(ACESFilmicToneMappingShader, 'tDiffuse');
        this.rendererFolder.add(this.tonemappingPass.uniforms.exposure, 'value', 0.0, 2).name("Exposure");
        this.composer.addPass(this.tonemappingPass);
    }

    createGammaCorrectionPass() {
        if (this.gammaCorrectionPass) {
            this.composer.removePass(this.gammaCorrectionPass);
            this.gammaCorrectionPass.dispose();
            this.gammaCorrectionPass = null;
        }

        this.gammaCorrectionPass = new ShaderPass(GammaCorrectionShader);
        this.composer.addPass(this.gammaCorrectionPass);
    }

    setScene(scene) {
        this.scene = scene;
        for (const pass of this.composer.passes) {
            pass.scene = scene;
        }
    }

    setCamera(camera) {
        this.camera = camera;
        for (const pass of this.composer.passes) {
            pass.camera = camera;
        }

        this.createSSAOPass();
        this.createBloomPass();
        //this.createTonemappingPass()
    }

    resize(container) {
        this.webGLRenderer.setPixelRatio(window.devicePixelRatio);
        this.webGLRenderer.setSize(window.innerWidth, window.innerHeight);
        this.composer.setSize(window.innerWidth, window.innerHeight);
        for (const pass of this.composer.passes) {
            pass.setSize(window.innerWidth, window.innerHeight);
        }

        this.createSSAOPass();
        this.createBloomPass();
        //this.createTonemappingPass();
    }

    render() {
        if (this.scene && this.camera) {
            this.composer.render();
        }
    }
}

export { Renderer }