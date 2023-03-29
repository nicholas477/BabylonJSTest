import { World } from "./World/World.js";
import { registerInputSystem } from "./Systems/Input.js";

function main() {
    // Get a reference to the container element that will hold our scene
    const container = document.querySelector('#scene-container');

    const world = new World(container);

    registerInputSystem();

    world.start();
}

main();