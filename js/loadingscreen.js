import * as THREE from 'three';
export {textureLoader};

const manager = new THREE.LoadingManager();
manager.onStart = function (url, itemsLoaded, itemsTotal) {
    console.log(`Started loading: ${url} (${itemsLoaded}/${itemsTotal})`);
};

manager.onLoad = function () {
    document.getElementById('loading-screen').style.display = 'none';
    console.log('All assets are loaded.');
};

manager.onProgress = function (url, itemsLoaded, itemsTotal) {
    console.log(`Loading file: ${url} (${itemsLoaded}/${itemsTotal})`);
};

manager.onError = function (url) {
    console.log('There was an error loading ' + url);
};

const textureLoader = new THREE.TextureLoader(manager);