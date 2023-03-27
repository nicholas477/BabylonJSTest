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

import { World } from "./World/World.js";
import { registerInputSystem } from "./Systems/Input.js";

function main() {
    // Get a reference to the container element that will hold our scene
    const container = document.querySelector('#scene-container');

    registerInputSystem();

    // 1. Create an instance of the World app
    const world = new World(container);

    // 2. Render the scene
    world.start();

    // // ---------------- RENDERER ----------------

    // renderer = new WebGLRenderer({ antialias: true });
    // renderer.setPixelRatio(window.devicePixelRatio);
    // renderer.setSize(window.innerWidth, window.innerHeight);
    // container.append(renderer.domElement);

    // // ---------------- CAMERA ----------------

    // camera = new OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, 0, 10000);
    // camera.position.set(-500, 500, -500);
    // camera.lookAt(new Vector3(0, 0, 0));
    // scene.add(camera);

    // setupKeyControls();

    // // ---------------- LIGHTS ----------------

    // var ambientLight = new AmbientLight(0xcccccc, 0.2);
    // scene.add(ambientLight);

    // const directionalLight = new DirectionalLight(0xffffff, 0.6);
    // scene.add(directionalLight);

    // // ---------------- 3D CUBE ----------------

    // const geometry = new BoxGeometry(150, 150, 150);
    // const material = new MeshPhongMaterial({ color: 0x00ffff });
    // cube = new Mesh(geometry, material);
    // scene.add(cube);

    // // ---------------- STARTING THE RENDER LOOP ----------------

    // render();

}

function render() {
    renderer.render(scene, camera); 	// We are rendering the 3D world
    requestAnimationFrame(render);	// we are calling render() again,  to loop
}

main();