import { OrthographicCamera, Vector3 } from "https://cdn.skypack.dev/three@0.132.2";
import { registerTicker } from "../Systems/Loop.js";
import { getKeyValue } from "../Systems/Input.js";
import { v3damp } from "../Utils/VectorUtils.js"

var logged = false;

class Camera extends OrthographicCamera {
    constructor() {
        super(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, 0, 10000);
        this.position.set(-500, 500, -500);
        this.lookAt(new Vector3(0, 0, 0));

        this.velocity = new Vector3(0, 0, 0);
        this.cameraSpeed = 1000.0;
        this.cameraLagSpeed = 15.0
        registerTicker(this);
    }

    tick(deltaTime) {
        let cameraTarget = new Vector3(0, 0, 0);
        cameraTarget.add(new Vector3(-this.cameraSpeed, 0, -this.cameraSpeed).multiplyScalar(getKeyValue('w')));
        cameraTarget.add(new Vector3(-this.cameraSpeed, 0, this.cameraSpeed).multiplyScalar(getKeyValue('a')));
        cameraTarget.add(new Vector3(this.cameraSpeed, 0, this.cameraSpeed).multiplyScalar(getKeyValue('s')));
        cameraTarget.add(new Vector3(this.cameraSpeed, 0, -this.cameraSpeed).multiplyScalar(getKeyValue('d')));
        this.velocity.lerp(cameraTarget, 1 - Math.exp(-this.cameraLagSpeed * deltaTime));

        this.position.add(new Vector3().copy(this.velocity).multiplyScalar(deltaTime));
    }
}

export { Camera };