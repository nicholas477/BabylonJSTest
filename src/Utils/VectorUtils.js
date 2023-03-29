import { Vector3 } from "three";

function v3damp(from, to, speed, dt) {
    return from.clone().lerp(to, 1 - Math.exp(-speed * dt));
}

export { v3damp }