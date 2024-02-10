import * as THREE from 'three';
import "/css/stylesheet.css";
import gsap from 'gsap';
import earthTexture from "../earth-texture.jpg";
import earthClouds from "../earth-clouds.jpg";
import moonTexture from "../moon-texture.jpg";
import starTexture from "../circle.png";
import {textureLoader} from './loadingscreen.js';
// Scene
const scene = new THREE.Scene();
const earthSizes = {
    width : window.innerWidth,
    height: (window.innerHeight + 300)
};
const camera = new THREE.PerspectiveCamera(65, earthSizes.width/earthSizes.height, 0.1, 1000);
const canvas = document.querySelector(".home-canvas");
const renderer = new THREE.WebGLRenderer({canvas, antialias: true, alha: true});
renderer.setClearColor(0x000000, 0);
renderer.setSize(earthSizes.width, earthSizes.height);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);


//Starry background
function getStarField({numStars = 500} = {}){


function randomSpherePoint(){
    const radius = Math.random() * 25 + 25;
    const u = Math.random();
    const v = Math.random();
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);
    let x = radius * Math.sin(phi) * Math.cos(theta);
    let y = radius * Math.sin(phi) * Math.sin(theta);
    let z = radius * Math.cos(phi);

    const zLimit = -10;
    if(z > zLimit){
        z = zLimit - Math.random() * 5;
    }

    return{
        pos: new THREE.Vector3(x,y,z),
        hue: 0.6,
        minDist: radius,
    };
}

const verts = [];
const colors = [];
const positions = [];
let col;
for(let i = 0; i< numStars; i+=1){
    let p = randomSpherePoint();
    const{pos, hue} = p;
    positions.push(p);
    col = new THREE.Color().setHSL(hue, 0.2, Math.random());
    verts.push(pos.x, pos.y, pos.z);
    colors.push(col.r, col.g, col.b);
}

const geo = new THREE.BufferGeometry();
geo.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
const mat = new THREE.PointsMaterial({
    size: 0.2,
    vertexColors: true,
    map: textureLoader.load(starTexture),
});
const points = new THREE.Points(geo, mat);
return points;
}

const stars = getStarField({numStars: 2000});
scene.add(stars);


//Earth geometry
const earthGroup = new THREE.Group();
const earthGeometry = new THREE.SphereGeometry(8, 64, 64);
const earthMaterial = new THREE.MeshPhongMaterial({
    map: textureLoader.load(earthTexture),
});
const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);

const cloudsEarthMaterial = new THREE.MeshStandardMaterial({
    map: textureLoader.load(earthClouds),
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
    map: textureLoader.load(moonTexture),
});

const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
scene.add(moonMesh);

moonMesh.position.x += 2;
moonMesh.position.z += 2;
moonMesh.rotation.y += 4;

//Light
const directionalLight = new THREE.DirectionalLight(0xcccccc);
directionalLight.position.set(-0.6,1,0.2).normalize();
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

if(window.innerWidth < 1200){
    camera.position.set(0, 4.5, 50);
}
else{
    camera.position.set(0, 6, 30);
    camera.fov = 50;
}
animate();


//Resizing

window.addEventListener("resize", ()=> {
    if(window.innerWidth < 1200){
        camera.position.set(0, 4.5, 50);
    }
    else{
        camera.position.set(0, 6, 30);
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
  