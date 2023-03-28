
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
}

function getKeyValue(key) {
    if (keysDown.has(key)) {
        return keysDown.get(key);
    }

    return 0.0;
}

function registerWheelListener(object) {
    wheelListeners.push(object);
}

export { registerInputSystem, getKeyValue, registerWheelListener }