import { MeshStandardMaterial, Mesh } from "three";
import { getWorld } from "../World/World.js";
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

const loader = new OBJLoader();
loader.load(
    // resource URL
    'assets/powerplant.obj',
    // called when resource is loaded
    function (object) {
        object.traverse(function (child) {

            if (child.isMesh) {
                child.material = new MeshStandardMaterial({ color: 0x00ffff });
                child.receiveShadow = true;
                child.castShadow = true;
            }

        });

        console.log(object);
        getWorld().scene.add(object);

    },
    // called when loading is in progresses
    function (xhr) {

        console.log((xhr.loaded / xhr.total * 100) + '% loaded');

    },
    // called when loading has errors
    function (error) {

        console.log('An error happened');

    }
);

class Model extends Mesh {
    constructor() {
        super();
    }
}

export { Model }