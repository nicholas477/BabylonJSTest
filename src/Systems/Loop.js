import { Clock } from "three";
import Stats from 'three/addons/libs/stats.module.js';

var updatables = [];
const clock = new Clock();

function registerTicker(object) {
    updatables.push(object);
}

class Loop {
    constructor(container, renderer) {
        this.renderer = renderer;
        this.deltaTime = 1000 / 60;

        this.stats = new Stats();
        container.appendChild(this.stats.domElement);
    }

    start() {
        this.renderer.webGLRenderer.setAnimationLoop(() => {
            this.stats.begin();
            this.tick();

            this.renderer.render();
            this.stats.end();
        });
    }

    stop() {
        this.renderer.webGLRenderer.setAnimationLoop(null);
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