import { Camera } from "../Components/Camera.js";
import { Scene } from "../Components/Scene.js";
import { Renderer } from "../Systems/Renderer.js";
import { Loop } from '../Systems/Loop.js';
import { Floor } from "../Components/Floor.js";
import { Resizer } from "../Systems/Resizer.js";
import { Model } from "../Components/Model.js"
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';

import { AmbientLight, DirectionalLight, GridHelper, Vector3 } from "three";
import { MapControls } from 'three/addons/controls/OrbitControls.js';

import { SSAOPass } from 'three/addons/postprocessing/SSAOPass.js';

var world;

function getWorld() {
    return world;
}

function setWorld(inWorld) {
    world = inWorld;
}

class World {
    constructor(container) {
        this.camera = new Camera();
        this.scene = new Scene();
        this.renderer = new Renderer();
        this.loop = new Loop(this.camera, this.scene, this.renderer);
        const composer = new EffectComposer(this.renderer);
        const ssaoPass = new SSAOPass(this.scene, this.camera, 0, 0.1, 0.1, 0.1);
        ssaoPass.kernelRadius = 16;
        composer.addPass( ssaoPass );
        
        var ambientLight = new AmbientLight(0xcccccc, 1.0);
        const directionalLight = new DirectionalLight(0xffffff, 8.0);
        directionalLight.position.set(200, 100, 100);
        directionalLight.castShadow = true;
        directionalLight.shadow.camera.top = 180;
        directionalLight.shadow.camera.bottom = - 100;
        directionalLight.shadow.camera.left = - 120;
        directionalLight.shadow.camera.right = 120;

        const floor = new Floor();
        this.scene.add(floor);

        const grid = new GridHelper(2048, 2048 / 128, 0x000000, 0x000000);
        grid.position.add(new Vector3(0.0, -1, 0.0))
        grid.material.opacity = 0.2;
        grid.material.transparent = true;
        this.scene.add(grid);

        this.scene.add(this.camera);
        this.scene.add(ambientLight);
        this.scene.add(directionalLight);

        container.appendChild(this.renderer.domElement);

        const resizer = new Resizer(container, this.camera, this.renderer);
    }

    start() {
        this.loop.start();
    }

    stop() {
        this.loop.stop();
    }
}

export { World, getWorld, setWorld };