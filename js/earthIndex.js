import * as THREE from 'three';
import "/css/stylesheet.css";
import gsap from 'gsap';
// Scene
const scene = new THREE.Scene();
const earthSizes = {
    width : window.innerWidth,
    height: window.innerHeight
};
const camera = new THREE.PerspectiveCamera(65, earthSizes.width/earthSizes.height, 0.1, 100);
const canvas = document.querySelector(".home-canvas");
const renderer = new THREE.WebGLRenderer({canvas, antialias: true});
renderer.setSize(earthSizes.width, earthSizes.height);
document.body.appendChild(renderer.domElement);

//Earth geometry
const earthGroup = new THREE.Group();
const earthGeometry = new THREE.SphereGeometry(8, 64, 64);
const textureLoader = new THREE.TextureLoader();
const earthMaterial = new THREE.MeshPhongMaterial({
    map: textureLoader.load('./earth-texture.jpg'),
});
const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);

const cloudsEarthMaterial = new THREE.MeshStandardMaterial({
    map: textureLoader.load('./earth-clouds.jpg'),
    blending: THREE.AdditiveBlending,
    opacity: 0.7,
})
const cloudsMesh = new THREE.Mesh(earthGeometry, cloudsEarthMaterial);
cloudsMesh.scale.setScalar(1.003);
scene.add(cloudsMesh);


earthGroup.rotation.z = -23.4 * Math.PI / 180;
earthGroup.rotation.y -= 2.1;
earthGroup.add(earthMesh);
scene.add(earthGroup);

//Moon Geometry
const moonGeometry = new THREE.SphereGeometry(2, 32, 32);
const moonMaterial = new THREE.MeshPhongMaterial({
    map: textureLoader.load('./moon-texture.jpg'),
});

const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
scene.add(moonMesh);

moonMesh.position.x += 2;
moonMesh.position.z += 2;

//Light
const directionalLight = new THREE.DirectionalLight(0xcccccc);
directionalLight.position.set(-0.8,1,0.2).normalize();
directionalLight.intensity = 1.4;
scene.add(directionalLight);




const moonOrbitRadius = 11;
const moonOrbitSpeed = 0.004;
let moonAngle = 0;
//Render function
function animate(){
    requestAnimationFrame(animate);
    earthGroup.rotation.y += 0.0003;
    cloudsMesh.rotation.y += 0.0004;

    moonAngle += moonOrbitSpeed;
    moonMesh.position.x = earthGroup.position.x + moonOrbitRadius * Math.cos(moonAngle);
    moonMesh.position.z = earthGroup.position.z + moonOrbitRadius * Math.sin(moonAngle);
    moonMesh.position.y = earthGroup.position.y + moonOrbitRadius * Math.cos(moonAngle);
    renderer.render(scene, camera); 
}

if(window.innerWidth < 700){
    camera.position.set(0, 0, 50);
}
else{
    camera.position.set(0, 0, 15);
}
animate();


//Resizing

window.addEventListener("resize", ()=> {
    earthSizes.width = window.innerWidth;
    earthSizes.height = window.innerHeight;
    camera.aspect = earthSizes.width/earthSizes.height;
    if(window.innerWidth < 700){
        camera.position.set(0, 0, 50);
    }
    else{
        camera.position.set(0, 0, 15);
    }
    camera.updateProjectionMatrix();
    renderer.setSize(earthSizes.width, earthSizes.height);
});

    
const tl = gsap.timeline({defaults: {duration: 1}});
earthGroup.children.forEach(child => {
    if (child.material) {
      child.material.transparent = true;
    }
  });
cloudsMesh.material.transparent = true;

tl.fromTo([earthGroup.position, cloudsMesh.position], {z: 0, x: 0, y: -15}, {z: 0, x: 0, y: 0})
  .fromTo('.home-content', {x: "-100%"}, {x: "0%"}, "<");