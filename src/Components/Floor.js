import { BoxGeometry, MeshPhysicalMaterial, Mesh, TextureLoader } from "three";
import { registerTicker } from "../Systems/Loop.js";
import { pixelTexture } from "../Utils/Texture.js";

class Floor extends Mesh {
    constructor() {
        const texLoader = new TextureLoader();
        const texChecker = pixelTexture(texLoader.load('assets/textures/checker.png'));
        texChecker.repeat.set(20.48 / 1.28, 20.48 / 1.28);

        const geometry = new BoxGeometry(20.48, .01, 20.48);
        const material = new MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.5, map: texChecker });
        super(geometry, material);
        this.receiveShadow = true;
        this.position.set(0, -0.022, 0);
    }
}

export { Floor }