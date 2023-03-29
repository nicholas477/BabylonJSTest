import { OrthoCamera } from "../Components/Camera.js";
import { Scene } from "../Components/Scene.js";
import { Renderer } from "../Systems/Renderer.js";
import { Loop, registerTicker } from '../Systems/Loop.js';
import { Floor } from "../Components/Floor.js";
import { Resizer } from "../Systems/Resizer.js";
import { Model } from "../Components/Model.js"
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';

import { AmbientLight, HemisphereLight, DirectionalLight, GridHelper, Vector3, Vector2 } from "three";
import { MapControls } from 'three/addons/controls/OrbitControls.js';

import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { RenderPixelatedPass } from 'three/addons/postprocessing/RenderPixelatedPass.js';
import { SAOPass } from 'three/addons/postprocessing/SAOPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

var world;

function getWorld() {
    return world;
}

function setWorld(inWorld) {
    world = inWorld;
}

class World {
    constructor(container) {
        setWorld(this);

        this.container = container;
        this.camera = new OrthoCamera();
        this.renderer = new Renderer();
        this.scene = new Scene();

        // Init this.gui
        this.gui = new GUI();
        this.gui.add(this.renderer, 'toneMappingExposure', 0.1, 2);


        this.addLighting();

        this.loop = new Loop(container, this.camera, this.scene, this.renderer);

        const floor = new Floor();
        this.scene.add(floor);

        const grid = new GridHelper(20.48, 20.48 / 1.28, 0x000000, 0x000000);
        grid.position.add(new Vector3(0.0, -0.01, 0.0))
        grid.material.opacity = 0.2;
        grid.material.transparent = true;
        this.scene.add(grid);

        this.scene.add(this.camera);

        this.addPostProcessing();

        container.appendChild(this.renderer.domElement);

        const resizer = new Resizer(container, this.camera, this.renderer);
    }

    addLighting() {
        const lightingFolder = this.gui.addFolder("Lighting");
        const hemiLight = new HemisphereLight(
            0xffeeb1, // bright sky color
            0x080820, // dim ground color
            0.33333, // intensity
        );
        this.scene.add(hemiLight);

        lightingFolder.add(hemiLight, 'intensity').min(0).max(10).name("Ambient Light Intensity");

        // var ambientLight = new AmbientLight(0xcccccc, 0.0);
        // this.scene.add(ambientLight);

        const directionalLight = new DirectionalLight(0xffffff, 1.0);
        directionalLight.position.set(200, 100, 100);
        directionalLight.lookAt(new Vector3(0, 0, 0));
        directionalLight.castShadow = true;
        const shadowFrustrum = this.camera.getCameraFrustum();
        directionalLight.shadow.camera.top = shadowFrustrum.z;
        directionalLight.shadow.camera.bottom = shadowFrustrum.w;
        directionalLight.shadow.camera.left = shadowFrustrum.x;
        directionalLight.shadow.camera.right = shadowFrustrum.y;
        directionalLight.shadow.mapSize.width = 2048; // default
        directionalLight.shadow.mapSize.height = 2048; // default
        // directionalLight.shadow.camera.near = 0.5; // default
        // directionalLight.shadow.camera.far = 500; // default

        lightingFolder.add(directionalLight, 'intensity').min(0).max(10).name("Direction Light Intensity");

        directionalLight.tick = (deltaTime) => {
            let time = getWorld().getTime() / 30.0;

            const shadowFrustrum = getWorld().camera.getCameraFrustum();
            directionalLight.shadow.camera.top = shadowFrustrum.z;
            directionalLight.shadow.camera.bottom = shadowFrustrum.w;
            directionalLight.shadow.camera.left = shadowFrustrum.x;
            directionalLight.shadow.camera.right = shadowFrustrum.y;
            directionalLight.shadow.camera.updateProjectionMatrix();

            directionalLight.position.set(Math.sin(time) * 200, 200, Math.cos(time) * 100);
            directionalLight.lookAt(new Vector3(0, 0, 0));
        }
        registerTicker(directionalLight);
        this.scene.add(directionalLight);
    }

    addPostProcessing() {
        this.composer = new EffectComposer(this.renderer);

        const renderScene = new RenderPass(this.scene, this.camera);
        this.composer.addPass(renderScene);

        const saoPass = new SAOPass(this.scene, this.camera, false, true);
        saoPass.params.saoBias = 10;
        saoPass.params.saoIntensity = 0.385;
        saoPass.params.saoScale = 256;
        saoPass.params.saoKernelRadius = 8;
        this.composer.addPass(saoPass);

        const ssaoFolder = this.gui.addFolder("SSAO");
        ssaoFolder.add(saoPass.params, 'output', {
            'Beauty': SAOPass.OUTPUT.Beauty,
            'Beauty+SAO': SAOPass.OUTPUT.Default,
            'SAO': SAOPass.OUTPUT.SAO,
            'Depth': SAOPass.OUTPUT.Depth,
            'Normal': SAOPass.OUTPUT.Normal
        }).onChange(function (value) {
            saoPass.params.output = parseInt(value);
        });
        ssaoFolder.add(saoPass.params, 'saoBias', - 1024, 1024);
        ssaoFolder.add(saoPass.params, 'saoIntensity', 0, 1);
        ssaoFolder.add(saoPass.params, 'saoScale', 0, 1024);
        ssaoFolder.add(saoPass.params, 'saoKernelRadius', 0, 1024);
        ssaoFolder.add(saoPass.params, 'saoMinResolution', 0, 1);
        ssaoFolder.add(saoPass.params, 'saoBlur');
        ssaoFolder.add(saoPass.params, 'saoBlurRadius', 0, 200);
        ssaoFolder.add(saoPass.params, 'saoBlurStdDev', 0.5, 150);
        ssaoFolder.add(saoPass.params, 'saoBlurDepthCutoff', 0.0, 0.1);
        //this.composer.addPass(ssaoPass);

        // const bloomPass = new UnrealBloomPass(new Vector2(window.innerWidth, window.innerHeight), 1.0, 0.4, 0.85);
        // this.gui.add(bloomPass, 'threshold').min(0).max(10);
        // this.gui.add(bloomPass, 'strength').min(0).max(10);
        // this.gui.add(bloomPass, 'radius').min(0).max(10);
        // bloomPass.threshold = params.bloomThreshold;
        // bloomPass.strength = params.bloomStrength;
        // bloomPass.radius = params.bloomRadius;
        //this.composer.addPass(renderScene);
        //this.composer.addPass(bloomPass);

        const renderPixelatedPass = new RenderPixelatedPass(3, this.scene, this.camera);
        renderPixelatedPass.depthEdgeStrength = 1.0;
        renderPixelatedPass.normalEdgeStrength = 0.1;

        const pixelationFolder = this.gui.addFolder("Pixelation");
        pixelationFolder.add(renderPixelatedPass, 'enabled');
        pixelationFolder.add(renderPixelatedPass, 'depthEdgeStrength', 0, 10);
        pixelationFolder.add(renderPixelatedPass, 'normalEdgeStrength', 0, 10);
        this.composer.addPass(renderPixelatedPass);

        this.loop.setPostProcessingComposer(this.composer);
    }

    start() {
        this.loop.start();
    }

    stop() {
        this.loop.stop();
    }

    getDeltaTime() {
        return this.loop.getDeltaTime();
    }

    getTime() {
        return this.loop.getTime();
    }

    getContainer() {
        return this.container;
    }
}

export { World, getWorld };