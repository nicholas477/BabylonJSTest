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
import { SSAOPass } from 'three/addons/postprocessing/SSAOPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { GUI } from 'three/addons/libs/dat.gui.module.js';

var world;
var gui;

function getWorld() {
    return world;
}

function setWorld(inWorld) {
    world = inWorld;
}

class World {
    constructor(container) {
        this.camera = new OrthoCamera();
        this.scene = new Scene();
        this.renderer = new Renderer();

        // Init gui
        gui = new GUI();
        gui.add(this.renderer, 'toneMappingExposure', 0.1, 2);


        this.addLighting();

        this.loop = new Loop(container, this.camera, this.scene, this.renderer);

        const floor = new Floor();
        this.scene.add(floor);

        const grid = new GridHelper(2048, 2048 / 128, 0x000000, 0x000000);
        grid.position.add(new Vector3(0.0, -1, 0.0))
        grid.material.opacity = 0.2;
        grid.material.transparent = true;
        this.scene.add(grid);

        this.scene.add(this.camera);

        this.addPostProcessing();

        container.appendChild(this.renderer.domElement);

        const resizer = new Resizer(container, this.camera, this.renderer);
    }

    addLighting() {
        const hemiLight = new HemisphereLight(
            0xffeeb1, // bright sky color
            0x080820, // dim ground color
            2.0, // intensity
        );
        this.scene.add(hemiLight);

        gui.add(hemiLight, 'intensity').min(0).max(10);

        // var ambientLight = new AmbientLight(0xcccccc, 0.0);
        // this.scene.add(ambientLight);

        const directionalLight = new DirectionalLight(0xffffff, 15.0);
        directionalLight.position.set(200, 100, 100);
        directionalLight.lookAt(new Vector3(0, 0, 0));
        directionalLight.castShadow = true;
        directionalLight.shadow.camera.top = 180;
        directionalLight.shadow.camera.bottom = -100;
        directionalLight.shadow.camera.left = -120;
        directionalLight.shadow.camera.right = 120;
        directionalLight.tick = (deltaTime) => {
            let time = getWorld().getTime() / 30.0;
            directionalLight.position.set(Math.sin(time) * 200, 200, Math.cos(time) * 100);
            directionalLight.lookAt(new Vector3(0, 0, 0));
        }
        registerTicker(directionalLight);
        this.scene.add(directionalLight);
    }

    addPostProcessing() {
        this.composer = new EffectComposer(this.renderer);

        const renderScene = new RenderPass(this.scene, this.camera);

        // const ssaoPass = new SSAOPass(this.scene, this.camera, window.innerWidth, window.innerHeight);
        // ssaoPass.minDistance = 0.5;
        // ssaoPass.maxDistance = 5.0;
        // ssaoPass.kernelRadius = 16;
        //this.composer.addPass(ssaoPass);

        const bloomPass = new UnrealBloomPass(new Vector2(window.innerWidth, window.innerHeight), 1.0, 0.4, 0.85);
        gui.add(bloomPass, 'threshold').min(0).max(10);
        gui.add(bloomPass, 'strength').min(0).max(10);
        gui.add(bloomPass, 'radius').min(0).max(10);
        // bloomPass.threshold = params.bloomThreshold;
        // bloomPass.strength = params.bloomStrength;
        // bloomPass.radius = params.bloomRadius;
        this.composer.addPass(renderScene);
        //this.composer.addPass(bloomPass);

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
}

export { World, getWorld, setWorld };