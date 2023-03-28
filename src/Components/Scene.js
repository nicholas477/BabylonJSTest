import { Color, Scene as ThreeScene, Fog, EquirectangularReflectionMapping } from "three";
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

class Scene extends ThreeScene {
    constructor() {
        super();
        this.background = new Color('white');
        this.fog = new Fog('white', 1024, 4096);
        this.environment = new RGBELoader().load('assets/textures/equirectangular/venice_sunset_1k.hdr');
        this.environment.mapping = EquirectangularReflectionMapping;
    }
}

export { Scene }