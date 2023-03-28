import {
    AmbientLight,
    DirectionalLight,
    BoxBufferGeometry,
    BoxGeometry,
    Color,
    Mesh,
    MeshBasicMaterial,
    MeshPhongMaterial,
    PerspectiveCamera,
    Scene,
    WebGLRenderer,
    OrthographicCamera,
    Vector3
} from "https://cdn.skypack.dev/three@0.132.2";

import { World, setWorld } from "./World/World.js";
import { registerInputSystem } from "./Systems/Input.js";

function main() {
    // Get a reference to the container element that will hold our scene
    const container = document.querySelector('#scene-container');

    registerInputSystem();

    const world = new World(container);
    setWorld(world);

    world.start();
}

function render() {
    renderer.render(scene, camera); 	// We are rendering the 3D world
    requestAnimationFrame(render);	// we are calling render() again,  to loop
}

main();