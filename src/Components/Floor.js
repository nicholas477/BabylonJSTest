import { BoxGeometry, MeshStandardMaterial, Mesh, AmbientLight, DirectionalLight } from "three";
import { registerTicker } from "../Systems/Loop.js";

class Floor extends Mesh {
    constructor() {
        const geometry = new BoxGeometry(2048, 1, 2048);
        const material = new MeshStandardMaterial({ color: 0xdedede });
        super(geometry, material);
        this.receiveShadow = true;
        this.position.set(0, -2.2, 0);
    }
}

export { Floor }