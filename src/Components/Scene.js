import { Color, Scene as ThreeScene, Fog } from "three";

class Scene extends ThreeScene {
    constructor() {
        super();
        this.background = new Color('skyblue');
        this.fog = new Fog(0xa0a0a0, 200, 4096);
    }
}

export { Scene }