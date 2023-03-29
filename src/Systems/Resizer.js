import { getWorld } from "../World/World.js";

const setSize = (container, camera, renderer) => {
    camera.resize();

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    getWorld().composer.setSize(window.innerWidth, window.innerHeight);
};

class Resizer {
    constructor(container, camera, renderer) {
        setSize(container, camera, renderer);

        window.addEventListener("resize", () => {
            // set the size again if a resize occurs
            setSize(container, camera, renderer);
        });
    }
}

export { Resizer };