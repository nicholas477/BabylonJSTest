import { MathUtils, Vector3 } from "three";

function v3damp(from, to, speed, dt) {
    return from.clone().lerp(to, 1 - Math.exp(-speed * dt));
}

function damp(from, to, speed, dt) {
    return MathUtils.lerp(from, to, 1 - Math.exp(-speed * dt));
}

export { v3damp, damp }