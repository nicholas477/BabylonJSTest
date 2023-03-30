import { MeshPhysicalMaterial, MeshLambertMaterial, Mesh, Vector3, TextureLoader, NearestFilter, RepeatWrapping, PerspectiveCamera } from "three";
import { getWorld } from "../World/World.js";
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { pixelTexture } from "../Utils/Texture.js";
import { registerTicker } from "../Systems/Loop.js";
import { ThirdPersonController } from "./ThirdPersonController.js";
import { registerResizeListener } from "../Systems/Resizer.js";

const modelPath = 'assets/models/';

const texLoader = new TextureLoader();
const texChecker = pixelTexture(texLoader.load('assets/textures/checker.png'));
texChecker.repeat.set(1, 1);

const loader = new OBJLoader();
const defaultMaterial = new MeshPhysicalMaterial({ metalness: 0.0, color: 0xffffff, roughness: 0.5, map: texChecker });

function loadModel(path, pos, onLoaded) {
    loader.load(
        // resource URL
        path,
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
            if (pos != null) {
                object.position.copy(pos);
            }
            if (onLoaded != null) {
                onLoaded(object);
            }
        },
        // called when loading is in progresses
        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        }
    );
}

function constructCharacter(object) {
    const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    getWorld().renderer.setCamera(camera);
    getWorld().renderer.camera.resize = (container) => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    };
    registerResizeListener(camera);
    new ThirdPersonController(camera, object);
    getWorld().gui.add(defaultMaterial, "metalness", 0, 1);
    getWorld().gui.add(defaultMaterial, "roughness", 0, 1);
}

loadModel(modelPath + 'powerplant.obj');
loadModel(modelPath + 'kaiju.obj', null, constructCharacter);
loadModel(modelPath + 'building_1.obj', new Vector3(0, 0, 2.56));
loadModel(modelPath + 'building_1.obj', new Vector3(2.56, 0, 2.56));
loadModel(modelPath + 'building_2.obj', new Vector3(2.56 + 1.28, 0, 1.28));
loadModel(modelPath + 'building_3.obj', new Vector3(2.56 + 2.56, 0, 1.28));
loadModel(modelPath + 'building_4.obj', new Vector3(2.56 + 2.56, 0, 2.56));

class Model extends Mesh {
    constructor() {
        super();
    }
}

export { Model }