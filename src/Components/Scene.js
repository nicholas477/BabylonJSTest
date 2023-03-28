import { Color, Scene as ThreeScene } from "three";

class Scene extends ThreeScene {
    constructor() {
        super();
        this.background = new Color('skyblue');
    }
}

export { Scene }