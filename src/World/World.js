import { Camera } from "../Components/Camera.js";
import { Scene } from "../Components/Scene.js";
import { Renderer } from "../Systems/Renderer.js";
import { Loop } from '../Systems/Loop.js';
import { Cube } from "../Components/Cube.js";
import { Resizer } from "../Systems/Resizer.js";

import { BoxGeometry, MeshStandardMaterial, Mesh, AmbientLight, DirectionalLight } from "https://cdn.skypack.dev/three@0.132.2";

class World {
    constructor(container) {
        this.camera = new Camera();
        this.scene = new Scene();
        this.renderer = new Renderer();
        this.loop = new Loop(this.camera, this.scene, this.renderer);

        this.cube = new Cube();

        var ambientLight = new AmbientLight(0xcccccc, 0.5);
        const directionalLight = new DirectionalLight(0xffffff, 8.0);
        directionalLight.position.set(10, 10, 10);


        this.scene.add(this.camera);
        this.scene.add(this.cube);
        this.scene.add(ambientLight);
        this.scene.add(directionalLight);

        container.append(this.renderer.domElement);

        const resizer = new Resizer(container, this.camera, this.renderer);
    }

    start() {
        this.loop.start();
    }

    stop() {
        this.loop.stop();
    }
}

export { World };