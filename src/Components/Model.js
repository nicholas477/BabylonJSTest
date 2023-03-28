import { MeshPhysicalMaterial, MeshLambertMaterial, Mesh, Vector3 } from "three";
import { getWorld } from "../World/World.js";
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

const defaultMaterial = new MeshPhysicalMaterial({ metalness: 0.0, color: 0xf0f0f0, roughness: 0.33333 });
const loader = new OBJLoader();
loader.load(
    // resource URL
    'assets/powerplant.obj',
    // called when resource is loaded
    function (object) {
        object.traverse(function (child) {

            if (child.isMesh) {
                child.material = defaultMaterial;
                child.receiveShadow = true;
                child.castShadow = true;
            }

        });

        console.log(object);
        object.scale.setScalar(0.01);
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

loader.load(
    // resource URL
    'assets/kaiju.obj',
    // called when resource is loaded
    function (object) {
        object.traverse(function (child) {

            if (child.isMesh) {
                child.material = defaultMaterial;
                child.receiveShadow = true;
                child.castShadow = true;
            }

        });

        object.scale.setScalar(0.01);
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