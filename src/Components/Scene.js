import { Color, Scene as ThreeScene, FogExp2, EquirectangularReflectionMapping } from "three";
import { EXRLoader } from 'three/addons/loaders/EXRLoader.js';

class Scene extends ThreeScene {
    constructor() {
        super();
        this.background = new Color(0xcecece);
        //this.fog = new Fog('white', 1024, 4096);
        //this.fog = new FogExp2(0xcccccc, 0.0003);
        const params = {
            envMap: 'EXR',
            roughness: 0.0,
            metalness: 0.0,
            exposure: 1.0,
            debug: false,
        };


        //this.environment = new RGBELoader().load('assets/textures/equirectangular/venice_sunset_1k.hdr');
        //this.environment.Color = new Color('white');
        //this.environment.mapping = EquirectangularReflectionMapping;
    }
}

export { Scene }