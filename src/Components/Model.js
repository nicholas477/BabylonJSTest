import { MeshPhysicalMaterial, MeshLambertMaterial, Mesh, Vector3, TextureLoader, NearestFilter, RepeatWrapping, PerspectiveCamera } from "three";
import { getWorld } from "../World/World.js";
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { pixelTexture } from "../Utils/Texture.js";
import { registerTicker } from "../Systems/Loop.js";
import { ThirdPersonController } from "./ThirdPersonController.js";

const texLoader = new TextureLoader();
const texChecker = pixelTexture(texLoader.load('assets/textures/checker.png'));
const texChecker2 = pixelTexture(texLoader.load('assets/textures/checker.png'));
texChecker.repeat.set(1, 1);

const defaultMaterial = new MeshPhysicalMaterial({ metalness: 0.0, color: 0xffffff, roughness: 0.5, map: texChecker });
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
        object.scale.setScalar(0.01);
        getWorld().scene.add(object);

    },
    // called when loading is in progresses
    function (xhr) {

        console.log((xhr.loaded / xhr.total * 100) + '% loaded');

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

        getWorld().setCamera(new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000));
        getWorld().camera.resize = () => {
            getWorld().camera.aspect = window.innerWidth / window.innerHeight;
            getWorld().camera.updateProjectionMatrix();
        }
        new ThirdPersonController(getWorld().camera, object);

        object.scale.setScalar(0.01);
        getWorld().scene.add(object);
        getWorld().gui.add(defaultMaterial, "metalness", 0, 1);
        getWorld().gui.add(defaultMaterial, "roughness", 0, 1);
    },
    // called when loading is in progresses
    function (xhr) {

        console.log((xhr.loaded / xhr.total * 100) + '% loaded');

    }
);

class Model extends Mesh {
    constructor() {
        super();
    }
}

export { Model }