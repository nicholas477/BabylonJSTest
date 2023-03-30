import { OrthographicCamera, PerspectiveCamera, Vector3, Vector4, Matrix3, Matrix4 } from "three";
import { registerTicker } from "../Systems/Loop.js";
import { getKeyValue, registerWheelListener } from "../Systems/Input.js";
import { damp, v3damp } from "../Utils/MathUtils.js"
import { getWorld } from "../World/World.js";
import { MathUtils } from "three";
import { registerResizeListener } from "../Systems/Resizer.js";

class CameraControl {
    constructor(camera) {
        this.camera = camera;

        this.velocity = new Vector3(0, 0, 0);
        this.cameraSpeed = 15.0;
        this.cameraLagSpeed = 10.0;

        this.cameraZoomInputScale = 0.25;
        this.cameraZoomTarget = 1.0;
        this.cameraZoomLagSpeed = 10.0;
        this.cameraZoomMin = 1.0;
        this.cameraZoomMax = 2.5;

        this.pointerDown = false;
        this.lastFramePointerPos = (0, 0);

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

        this.velocity = v3damp(this.velocity, cameraTarget, this.cameraLagSpeed, deltaTime);
        this.camera.position.add(new Vector3().copy(this.velocity).multiplyScalar(deltaTime));
    }

    tickCameraMouseMovement(deltaTime) {
        const isMouseDown = getKeyValue('pointerdown') !== null ? getKeyValue('pointerdown') > 0.5 : false;

        if (isMouseDown != this.pointerDown) {
            if (isMouseDown) {
                this.lastFramePointerPos = getKeyValue('pointerpos');
            }
            this.pointerDown = isMouseDown;
        }

        if (this.pointerDown) {
            const [currentPosX, currentPosY] = getKeyValue('pointerpos');
            const [lastPosX, lastPosY] = this.lastFramePointerPos;
            const positionOffset = new Vector3(-(currentPosX - lastPosX), currentPosY - lastPosY, 0.0);
            //const positionOffset = new Vector3(1.0, 0, 1.0).multiplyScalar(currentPosY - lastPosY);
            //positionOffset.add(new Vector3(1.0, 0, -1.0).multiplyScalar(currentPosX - lastPosX));
            positionOffset.multiplyScalar(0.01);
            positionOffset.applyMatrix3(new Matrix3().setFromMatrix4(this.camera.matrix));
            //const posOffsetLength = positionOffset.length();
            //positionOffset.multiply(new Vector3(1.0, 0.0, 1.0)).normalize().multiplyScalar(posOffsetLength);
            this.camera.position.add(positionOffset);

            this.lastFramePointerPos = getKeyValue('pointerpos');
        }
    }

    tickCameraZoomMovement(deltaTime) {
        if (this.camera instanceof OrthoCamera) {
            this.camera.zoom = damp(this.camera.zoom, this.cameraZoomTarget, this.cameraZoomLagSpeed, deltaTime);
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
        this.tickCameraMouseMovement(deltaTime);
        this.tickCameraZoomMovement(deltaTime);
    }
}

class OrthoCamera extends OrthographicCamera {
    constructor() {
        super(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, 0, 4096);
        const position = new Vector3(-10.24, 10.24, -10.24);
        position.multiplyScalar(1.0);
        this.position.copy(position);
        this.lookAt(new Vector3(0, 0, 0));

        this.control = new CameraControl(this);
        this.zoom = 1.0;

        registerResizeListener(this);
    }

    resize() {
        const frustrum = this.getCameraFrustum();
        this.left = frustrum.x;
        this.right = frustrum.y;
        this.top = frustrum.z;
        this.bottom = frustrum.w;
        this.updateProjectionMatrix();
    }

    getCameraFrustum() {
        const frustrum = new Vector4(
            window.innerWidth / -this.zoom, // left
            window.innerWidth / this.zoom,  // right
            window.innerHeight / this.zoom, // top
            window.innerHeight / -this.zoom // bottom
        );

        frustrum.multiplyScalar(0.01);

        return frustrum;
    }
}

export { OrthoCamera };