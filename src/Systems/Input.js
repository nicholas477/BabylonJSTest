
var keysDown = new Map();

function registerInputSystem() {
    addEventListener("keydown", (e) => {
        keysDown.set(e.key, 1.0);
    });
    addEventListener("keyup", (e) => {
        keysDown.set(e.key, 0.0);
    });
}

function getKeyValue(key) {
    if (keysDown.has(key)) {
        return keysDown.get(key);
    }

    return 0.0;
}

export { registerInputSystem, getKeyValue }