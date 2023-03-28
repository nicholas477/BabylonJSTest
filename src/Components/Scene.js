import { Color, Scene as ThreeScene, FogExp2, PMREMGenerator, sRGBEncoding, EquirectangularReflectionMapping, TextureLoader } from "three";
import { EXRLoader } from 'three/addons/loaders/EXRLoader.js';
import { getWorld } from "../World/World.js";

const params = {
    envMap: 'EXR',
    roughness: 0.0,
    metalness: 0.0,
    exposure: 1.0,
    debug: false,
};

let pngCubeRenderTarget, exrCubeRenderTarget;
let pngBackground, exrBackground;
let pmremGenerator;

class Scene extends ThreeScene {
    constructor() {
        super();
        pmremGenerator = new PMREMGenerator(getWorld().renderer);

        this.background = new Color(0xcecece);
        //this.fog = new Fog('white', 1024, 4096);
        //this.fog = new FogExp2(0xcccccc, 0.0003);

        new EXRLoader().load('assets/textures/piz_compressed.exr', function (texture) {

            texture.mapping = EquirectangularReflectionMapping;

            exrCubeRenderTarget = pmremGenerator.fromEquirectangular(texture);
            exrBackground = texture;

            getWorld().scene.environment = texture;
            getWorld().scene.environment.mapping = EquirectangularReflectionMapping;
        });

        pmremGenerator.compileEquirectangularShader();


        //this.environment = new RGBELoader().load('assets/textures/equirectangular/venice_sunset_1k.hdr');
        //this.environment.Color = new Color('white');
        //this.environment.mapping = EquirectangularReflectionMapping;
    }
}

export { Scene }