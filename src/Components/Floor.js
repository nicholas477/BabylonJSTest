import { BoxGeometry, MeshPhysicalMaterial, Mesh, AmbientLight, DirectionalLight } from "three";
import { registerTicker } from "../Systems/Loop.js";

class Floor extends Mesh {
    constructor() {
        const geometry = new BoxGeometry(20.48, .01, 20.48);
        const material = new MeshPhysicalMaterial({ color: 0xdedede, roughness: 0.5 });
        super(geometry, material);
        this.receiveShadow = true;
        this.position.set(0, -0.022, 0);
    }
}

export { Floor }