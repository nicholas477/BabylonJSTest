import { NearestFilter, RepeatWrapping } from "three";

function pixelTexture(texture) {
    texture.minFilter = NearestFilter;
    texture.magFilter = NearestFilter;
    texture.generateMipmaps = false;
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    return texture;
}

export { pixelTexture }