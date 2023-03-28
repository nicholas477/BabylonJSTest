import { WebGLRenderer, ACESFilmicToneMapping, sRGBEncoding, PCFSoftShadowMap } from "three";

class Renderer extends WebGLRenderer {
    constructor() {
        super({ antialias: true });
        this.setPixelRatio(window.devicePixelRatio);
        this.setSize(window.innerWidth, window.innerHeight);
        this.shadowMap.type = PCFSoftShadowMap;
        this.shadowMap.enabled = true;
        this.gammaFactor = 2.2;
        this.toneMapping = ACESFilmicToneMapping;
        this.toneMappingExposure = 0.85;
        this.outputEncoding = sRGBEncoding;
    }
}

export { Renderer }