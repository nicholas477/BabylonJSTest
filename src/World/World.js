import { OrthoCamera } from "../Components/Camera.js";
import { Scene } from "../Components/Scene.js";
import { Renderer } from "../Systems/Renderer.js";
import { Loop, registerTicker } from '../Systems/Loop.js';
import { Floor } from "../Components/Floor.js";
import { Resizer } from "../Systems/Resizer.js";
import { AmbientLight, HemisphereLight, DirectionalLight, GridHelper, Vector3, Vector2 } from "three";
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import "../Components/Model.js"

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

        this.gui = new GUI();

        this.container = container;
        this.camera = new OrthoCamera();
        this.renderer = new Renderer(null, this.camera);
        this.scene = new Scene();
        this.renderer.setScene(this.scene);

        const floor = new Floor();
        this.scene.add(floor);

        this.addLighting();

        this.loop = new Loop(container, this.renderer);

        const grid = new GridHelper(20.48, 20.48 / 1.28, 0x000000, 0x000000);
        grid.position.add(new Vector3(0.0, -0.01, 0.0))
        grid.material.opacity = 0.2;
        grid.material.transparent = true;
        this.scene.add(grid);

        container.appendChild(this.renderer.webGLRenderer.domElement);

        const resizer = new Resizer(container);
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

            if (getWorld().camera instanceof OrthoCamera) {
                const shadowFrustrum = getWorld().camera.getCameraFrustum();
                directionalLight.shadow.camera.top = shadowFrustrum.z;
                directionalLight.shadow.camera.bottom = shadowFrustrum.w;
                directionalLight.shadow.camera.left = shadowFrustrum.x;
                directionalLight.shadow.camera.right = shadowFrustrum.y;
                directionalLight.shadow.camera.updateProjectionMatrix();
            }

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

    getContainer() {
        return this.container;
    }
}

export { World, getWorld };