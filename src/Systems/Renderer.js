import { WebGLRenderer } from "three";

class Renderer extends WebGLRenderer {
    constructor() {
        super({ antialias: true });
        this.setPixelRatio(window.devicePixelRatio);
        this.setSize(window.innerWidth, window.innerHeight);
        this.physicallyCorrectLights = true;
        this.shadowMap.enabled = true;
    }
}

export { Renderer }