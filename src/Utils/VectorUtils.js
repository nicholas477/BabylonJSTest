import { Vector3 } from "https://cdn.skypack.dev/three@0.132.2";

function v3damp(from, to, speed, dt) {
    return from.lerp(to, 1 - Math.exp(-speed * dt));
}

export { v3damp }