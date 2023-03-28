import { BoxGeometry, MeshPhysicalMaterial, Mesh, AmbientLight, DirectionalLight } from "three";
import { registerTicker } from "../Systems/Loop.js";

class Floor extends Mesh {
    constructor() {
        const geometry = new BoxGeometry(2048, 1, 2048);
        const material = new MeshPhysicalMaterial({ color: 0xdedede, roughness: 0.5 });
        super(geometry, material);
        this.receiveShadow = true;
        this.position.set(0, -2.2, 0);
    }
}

export { Floor }