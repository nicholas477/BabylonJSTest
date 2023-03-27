import { WebGLRenderer } from "https://cdn.skypack.dev/three@0.132.2";

class Renderer extends WebGLRenderer {
    constructor() {
        super({ antialias: true });
        this.setPixelRatio(window.devicePixelRatio);
        this.setSize(window.innerWidth, window.innerHeight);
        this.physicallyCorrectLights = true;
    }
}

export { Renderer }