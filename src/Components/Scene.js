import { Color, Scene as ThreeScene } from "https://cdn.skypack.dev/three@0.132.2";

class Scene extends ThreeScene {
    constructor() {
        super();
        this.background = new Color('skyblue');
    }
}

export { Scene }