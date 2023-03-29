import { Clock } from "three";
import Stats from 'three/addons/libs/stats.module.js';

var updatables = [];
const clock = new Clock();

function registerTicker(object) {
    updatables.push(object);
}

class Loop {
    constructor(container, camera, scene, renderer) {
        this.camera = camera;
        this.scene = scene;
        this.renderer = renderer;
        this.deltaTime = 1000 / 60;

        this.stats = new Stats();
        container.appendChild(this.stats.domElement);
    }

    setPostProcessingComposer(composer) {
        this.composer = composer;
    }

    start() {
        this.renderer.setAnimationLoop(() => {
            this.tick();

            // render a frame
            this.stats.begin();
            //this.renderer.render(this.scene, this.camera);
            if (this.composer !== null) {
                this.composer.render();
            }
            this.stats.end();
        });
    }

    stop() {
        this.renderer.setAnimationLoop(null);
    }

    tick() {
        this.deltaTime = clock.getDelta();

        for (const object of updatables) {
            object.tick(this.deltaTime);
        }
    }

    getDeltaTime() {
        return this.deltaTime;
    }

    getTime() {
        return clock.elapsedTime;
    }
}

export { Loop, registerTicker };