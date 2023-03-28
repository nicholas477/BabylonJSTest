import { OrthoCamera } from "../Components/Camera.js";
import { Scene } from "../Components/Scene.js";
import { Renderer } from "../Systems/Renderer.js";
import { Loop, registerTicker } from '../Systems/Loop.js';
import { Floor } from "../Components/Floor.js";
import { Resizer } from "../Systems/Resizer.js";
import { Model } from "../Components/Model.js"
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';

import { AmbientLight, HemisphereLight, DirectionalLight, GridHelper, Vector3 } from "three";
import { MapControls } from 'three/addons/controls/OrbitControls.js';

import { SSAOPass } from 'three/addons/postprocessing/SSAOPass.js';
import { GUI } from 'three/addons/libs/dat.gui.module.js';

var world;

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
        this.composer = new EffectComposer(this.renderer);

        const ssaoPass = new SSAOPass(this.scene, this.camera, window.innerWidth, window.innerHeight);
        ssaoPass.minDistance = 0.5;
        ssaoPass.maxDistance = 5.0;
        ssaoPass.kernelRadius = 16;
        console.log(ssaoPass);
        //this.composer.addPass(ssaoPass);

        // Init gui
        const gui = new GUI();

        gui.add(ssaoPass, 'output', {
            'Default': SSAOPass.OUTPUT.Default,
            'SSAO Only': SSAOPass.OUTPUT.SSAO,
            'SSAO Only + Blur': SSAOPass.OUTPUT.Blur,
            'Beauty': SSAOPass.OUTPUT.Beauty,
            'Depth': SSAOPass.OUTPUT.Depth,
            'Normal': SSAOPass.OUTPUT.Normal
        }).onChange(function (value) {

            ssaoPass.output = parseInt(value);

        });
        gui.add(ssaoPass, 'kernelRadius').min(0).max(2048);
        gui.add(ssaoPass, 'minDistance').min(0.001).max(1024.0);
        gui.add(ssaoPass, 'maxDistance').min(0.01).max(1024.0);

        this.addLighting();

        this.loop = new Loop(container, this.camera, this.scene, this.renderer, this.composer);

        const floor = new Floor();
        this.scene.add(floor);

        const grid = new GridHelper(2048, 2048 / 128, 0x000000, 0x000000);
        grid.position.add(new Vector3(0.0, -1, 0.0))
        grid.material.opacity = 0.2;
        grid.material.transparent = true;
        this.scene.add(grid);

        this.scene.add(this.camera);

        container.appendChild(this.renderer.domElement);

        const resizer = new Resizer(container, this.camera, this.renderer);
    }

    addLighting() {
        const hemiLight = new HemisphereLight(
            0xffeeb1, // bright sky color
            0x080820, // dim ground color
            3.0, // intensity
        );
        this.scene.add(hemiLight);

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