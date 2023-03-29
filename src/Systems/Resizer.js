import { getWorld } from "../World/World.js";

var resizeListeners = [];

function registerResizeListener(object) {
    resizeListeners.push(object);
}

class Resizer {
    constructor(container) {
        window.addEventListener("resize", () => {
            for (const object of resizeListeners) {
                object.resize(container);
            }
        });

        for (const object of resizeListeners) {
            object.resize(container);
        }
    }
}

export { Resizer, registerResizeListener };