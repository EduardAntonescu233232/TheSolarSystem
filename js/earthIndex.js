import * as THREE from 'three';
import "/css/stylesheet.css";
import gsap from 'gsap';
import earthTexture from "../earth-texture.jpg";
import earthClouds from "../earth-clouds.jpg";
import moonTexture from "../moon-texture.jpg";
import starTexture from "../circle.png";
import sunTexture from "../sun-texture.jpg";
import {textureLoader} from './loadingscreen.js';
import mercurytexture from "../mercury-texture.jpg";
import venustexture from "../venus-texture.jpg";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// Scene
const scene = new THREE.Scene();
const earthSizes = {
    width : window.innerWidth,
    height: (window.innerHeight+ 300)
};
const camera = new THREE.PerspectiveCamera(65, earthSizes.width/earthSizes.height, 0.1, 1500);
const canvas = document.querySelector(".home-canvas");
const renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true, alha: true});
renderer.setClearColor(0x000000, 0);
renderer.setSize(earthSizes.width, earthSizes.height);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);


//Starry background
function getStarField({ numStars = 500, innerRadius = 1, outerRadius = 700 } = {}) {
    function randomSpherePoint() {
        let x, y, z, d;
        do {
            
            x = Math.random() * 2 - 1;
            y = Math.random() * 2 - 1;
            z = Math.random() * 2 - 1;
            d = x * x + y * y + z * z;
        
        } while (d > 1 || d < (innerRadius / outerRadius) * (innerRadius / outerRadius));

        
        const scale = Math.cbrt(Math.random()) * (outerRadius - innerRadius) + innerRadius;
        const factor = scale / Math.sqrt(d);
        x *= factor;
        y *= factor;
        z *= factor;

        return {
            pos: new THREE.Vector3(x, y, z),
            hue: Math.random(), 
        };
    }

    const verts = [];
    const colors = [];
    for (let i = 0; i < numStars; i += 1) {
        let { pos, hue } = randomSpherePoint();
        let col = new THREE.Color().setHSL(hue, 1, 0.5); 
        verts.push(pos.x, pos.y, pos.z);
        colors.push(1, 1, 1);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    const material = new THREE.PointsMaterial({
        size: 0.5, 
        vertexColors: true,
        map: textureLoader.load(starTexture), 
        transparent: true,
    });

    return new THREE.Points(geometry, material);
}

const stars = getStarField({ numStars: 4000, innerRadius: 50, outerRadius: 150 });
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

moonMesh.position.set(2, 0 ,2);
moonMesh.rotation.y += 4;


//Sun geometry

const sunGeometry = new THREE.SphereGeometry(10, 64, 64);
const sunlight = new THREE.PointLight(0xffffff, 500);
sunlight.add(new THREE.Mesh(sunGeometry, new THREE.MeshBasicMaterial({
    map: textureLoader.load(sunTexture)
})));

sunlight.position.set(0, 0, -50);


//Mercury geometry
const mercuryGeometry = new THREE.SphereGeometry(1, 64, 64);
const mercuryMaterial = new THREE.MeshPhongMaterial({
    map: textureLoader.load(mercurytexture),
})
const mercuryMesh = new THREE.Mesh(mercuryGeometry, mercuryMaterial);

mercuryMesh.position.set(15, 0, -50);


//Venus geometry
const venusGeometry = new THREE.SphereGeometry(3, 64, 64);
const venusMaterial = new THREE.MeshPhongMaterial({
    map: textureLoader.load(venustexture)
})
const venusMesh = new THREE.Mesh(venusGeometry, venusMaterial);

venusMesh.position.set(20, -2, -40);

// Light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.013);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(-15, 20, 5);
directionalLight.intensity = 1;
scene.add(directionalLight);


const moonOrbitRadius = 11;
const moonOrbitSpeed = 0.004;
let moonAngle = 0;
const mercuryOrbitRadius = 15;
const mercuryOrbitSpeed = 0.008;
let mercuryAngle = 0;
const venusOrbitRadius = 20;
const venusOrbitSpeed = 0.003;
let venusAngle = 0;

//Render function
function animate(){
    requestAnimationFrame(animate);
    earthGroup.rotation.y += 0.0003;
    cloudsMesh.rotation.y += 0.0004; 
    sunlight.rotation.y += 0.0005;
    mercuryMesh.rotation.y += 0.0004;

    //moon movement
    moonAngle += moonOrbitSpeed;
    moonMesh.position.x = earthGroup.position.x + moonOrbitRadius * Math.cos(moonAngle);
    moonMesh.position.z = earthGroup.position.z + moonOrbitRadius * Math.sin(moonAngle);
    moonMesh.position.y = earthGroup.position.y + moonOrbitRadius * Math.cos(moonAngle);

    //mercury movement
    mercuryAngle += mercuryOrbitSpeed;
    mercuryMesh.position.x = sunlight.position.x + mercuryOrbitRadius * Math.sin(mercuryAngle);
    mercuryMesh.position.z = sunlight.position.z + mercuryOrbitRadius * Math.cos(mercuryAngle);
    renderer.render(scene, camera);
    
    //venus movement
    venusAngle += venusOrbitSpeed;
    venusMesh.position.x = sunlight.position.x + venusOrbitRadius * Math.sin(venusAngle);
    venusMesh.position.z = sunlight.position.z + venusOrbitRadius * Math.cos(venusAngle);
    venusMesh.position.y = sunlight.position.y + venusOrbitRadius * Math.sin(venusAngle);
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
  

//animation to explore

function exploreAnimation() {

    if(window.innerWidth < 1200){
        if(camera.position.z <= 25 && camera.position.y <= 0){
            return;
        }
    }else{
        if(camera.position.z <= 15 && camera.position.y <= 0){
            return;
        }
    }

    requestAnimationFrame(exploreAnimation);
    camera.position.z -= 0.1;
    camera.position.y -= 0.05;
    earthGroup.position.y -= 0.2;
    cloudsMesh.position.y -= 0.2;

    renderer.render(scene, camera);
}

const explore = document.querySelector(".explore-button")
explore.addEventListener('click', function() {
    exploreAnimation();
    scene.add(sunlight);
    scene.add(mercuryMesh);
    scene.add(venusMesh);
    
    const controls = new OrbitControls( camera, renderer.domElement );
    controls.enableZoom = false;
    
    tl.fromTo('.home-content', {y: "0%"}, {y: "-200%"})
      .fromTo(directionalLight, {intensity: 1}, {intensity: 0, duration: 2});
      controls.update();
});