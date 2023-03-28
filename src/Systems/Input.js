
import { getWorld } from "../World/World.js";

var keysDown = new Map();
var wheelListeners = [];

function registerInputSystem() {
    addEventListener("keydown", (e) => {
        keysDown.set(e.key, 1.0);
    });

    addEventListener("keyup", (e) => {
        keysDown.set(e.key, 0.0);
    });

    addEventListener("wheel", (e) => {
        for (const object of wheelListeners) {
            object.wheel(e);
        }
    });

    // Mouse/touch
    getWorld().container.addEventListener('pointerdown', (event) => {
        keysDown.set('pointerdown', 1.0);
        keysDown.set('pointerpos', [event.pageX, event.pageY]);
    });
    getWorld().container.addEventListener('pointermove', (event) => {
        keysDown.set('pointerpos', [event.pageX, event.pageY]);
    });
    getWorld().container.addEventListener('pointerup', (event) => {
        keysDown.set('pointerdown', 0.0);
    });
}

function getKeyValue(key) {
    if (keysDown.has(key)) {
        return keysDown.get(key);
    }

    return null;
}

function registerWheelListener(object) {
    wheelListeners.push(object);
}

export { registerInputSystem, getKeyValue, registerWheelListener }