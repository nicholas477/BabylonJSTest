import { OrthographicCamera, PerspectiveCamera, Vector3 } from "three";
import { registerTicker } from "../Systems/Loop.js";
import { getKeyValue, registerWheelListener } from "../Systems/Input.js";
import { v3damp } from "../Utils/VectorUtils.js"
import { getWorld } from "../World/World.js";
import { MathUtils } from "three";

var logged = false;

class CameraControl {
    constructor(camera) {
        this.camera = camera;

        this.velocity = new Vector3(0, 0, 0);
        this.cameraSpeed = 1500.0;
        this.cameraLagSpeed = 10.0;

        this.cameraZoomInputScale = 0.25;
        this.cameraZoomTarget = 1.0;
        this.cameraZoomLagSpeed = 10.0;
        this.cameraZoomMin = 1.0;
        this.cameraZoomMax = 2.5;

        registerTicker(this);
        registerWheelListener(this);
    }

    tickCameraWASDMovement(deltaTime) {
        let cameraTarget = new Vector3(0, 0, 0);
        cameraTarget.add(new Vector3(this.cameraSpeed, 0, this.cameraSpeed).multiplyScalar(getKeyValue('w')));
        cameraTarget.add(new Vector3(this.cameraSpeed, 0, -this.cameraSpeed).multiplyScalar(getKeyValue('a')));
        cameraTarget.add(new Vector3(-this.cameraSpeed, 0, -this.cameraSpeed).multiplyScalar(getKeyValue('s')));
        cameraTarget.add(new Vector3(-this.cameraSpeed, 0, this.cameraSpeed).multiplyScalar(getKeyValue('d')));
        cameraTarget.multiplyScalar(1.0 / this.camera.zoom);
        this.velocity.lerp(cameraTarget, 1 - Math.exp(-this.cameraLagSpeed * deltaTime));

        this.camera.position.add(new Vector3().copy(this.velocity).multiplyScalar(deltaTime));
    }

    tickCameraZoomMovement(deltaTime) {
        if (this.camera instanceof OrthoCamera) {
            this.camera.zoom = MathUtils.lerp(this.camera.zoom, this.cameraZoomTarget, 1 - Math.exp(-this.cameraZoomLagSpeed * deltaTime));
            this.camera.resize();
        }
        else {

        }
    }

    wheel(event) {
        this.cameraZoomTarget = this.cameraZoomTarget + (-event.deltaY * getWorld().getDeltaTime() * this.cameraZoomInputScale);
        this.cameraZoomTarget = MathUtils.clamp(this.cameraZoomTarget, this.cameraZoomMin, this.cameraZoomMax);
    }

    tick(deltaTime) {
        this.tickCameraWASDMovement(deltaTime);
        this.tickCameraZoomMovement(deltaTime);
    }
}

class OrthoCamera extends OrthographicCamera {
    constructor() {
        super(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, 0, 4096);
        this.position.set(-1024, 1024, -1024);
        this.lookAt(new Vector3(0, 0, 0));

        this.control = new CameraControl(this);
        this.zoom = 1.0;
    }

    resize() {
        this.left = window.innerWidth / -this.zoom;

        this.right = window.innerWidth / this.zoom;

        this.top = window.innerHeight / this.zoom;

        this.bottom = window.innerHeight / -this.zoom;

        this.updateProjectionMatrix();
    }
}

export { OrthoCamera };