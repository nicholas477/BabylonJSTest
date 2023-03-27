import { BoxGeometry, MeshStandardMaterial, Mesh, AmbientLight, DirectionalLight } from "https://cdn.skypack.dev/three@0.132.2";
import { registerTicker } from "../Systems/Loop.js";

class Cube extends Mesh {
    constructor() {
        const geometry = new BoxGeometry(150, 150, 150);
        const material = new MeshStandardMaterial({ color: 0x00ffff });
        super(geometry, material);
        this.rotation.set(-0.5, -0.1, 0.8);

        registerTicker(this);
    }

    tick(deltaTime) {
        this.rotation.z += 1.0 * deltaTime;
        this.rotation.x += 1.0 * deltaTime;
        this.rotation.y += 1.0 * deltaTime;
    }
}

export { Cube }