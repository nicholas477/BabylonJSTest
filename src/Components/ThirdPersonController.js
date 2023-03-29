import { Vector3, Quaternion, MathUtils, PerspectiveCamera, Object3D, Euler } from "three";
import { registerTicker } from "../Systems/Loop.js";
import { getKeyValue } from "../Systems/Input.js";
import { getWorld } from "../World/World.js";

const cameraOffset = new Vector3(-0.5, 2.0, 0.0);
const cameraPivotOffset = new Vector3(0.0, 0.0, -1.5);

class ThirdPersonController {
    constructor(camera, target, options = {}) {
        this.camera = camera;
        this.target = target;

        this.speed = options.speed || 4;
        this.sensitivity = options.sensitivity || 0.3;

        this.isRMD = false;
        this.pivot = new Vector3();
        this.moveVector = new Vector3();

        this.bindEvents();
        this.bindGUI();

        registerTicker(this);
    }

    bindEvents() {
        document.addEventListener("mousemove", this.onMouseMove.bind(this));
        document.addEventListener("mousedown", this.onMouseDown.bind(this));
        document.addEventListener("mouseup", this.onMouseUp.bind(this));
    }

    bindGUI() {
        const folder = getWorld().gui.addFolder("Third Person Controller");
        folder.add(cameraOffset, "y", 0, 10.0).name("Camera Height");
        folder.add(cameraPivotOffset, "z", -10, 0).name("Camera Distance");
        folder.add(cameraOffset, "x", -5, 5).name("Camera Shoulder Offset");

    }

    tick(dt) {
        const move = this.moveVector;

        move.set(0, 0, 0);
        if (getKeyValue('w')) move.z -= 1;
        if (getKeyValue('s')) move.z += 1;
        if (getKeyValue('a')) move.x -= 1;
        if (getKeyValue('d')) move.x += 1;

        if (move.length()) {
            move.applyQuaternion(this.camera.quaternion);
            move.y = 0;
            move.normalize().multiplyScalar(this.speed * dt);
            this.target.position.add(move);
        }

        const targetRot = this.target.rotation.clone();
        this.pivot.copy(this.target.position).add(cameraOffset.clone().applyEuler(targetRot));
        const pivotToCam = cameraPivotOffset.clone();

        this.camera.position.copy(this.pivot).add(pivotToCam.applyEuler(targetRot));
        this.camera.lookAt(this.pivot);
    }

    onMouseMove(e) {
        if (this.isRMD) {
            this.target.rotateY(MathUtils.degToRad(-e.movementX * this.sensitivity));
        }
    }

    onMouseDown(e) {
        if (e.button === 1) {
            this.isRMD = true;
        }
    }

    onMouseUp(e) {
        if (e.button === 1) {
            this.isRMD = false;
        }
    }
}

export { ThirdPersonController }