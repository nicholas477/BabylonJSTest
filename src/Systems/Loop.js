import { Clock } from "https://cdn.skypack.dev/three@0.132.2";

var updatables = [];
const clock = new Clock();

function registerTicker(object) {
    updatables.push(object);
}

class Loop {
    constructor(camera, scene, renderer) {
        this.camera = camera;
        this.scene = scene;
        this.renderer = renderer;
    }

    start() {
        this.renderer.setAnimationLoop(() => {
            this.tick();

            // render a frame
            this.renderer.render(this.scene, this.camera);
        });
    }

    stop() {
        this.renderer.setAnimationLoop(null);
    }

    tick() {
        const delta = clock.getDelta();

        for (const object of updatables) {
            object.tick(delta);
        }
    }
}

export { Loop, registerTicker };