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
import marstexture from "../mars-texture.jpg";
import jupitertexture from "../jupiter-texture.jpg";
import saturntexture from "../saturn-texture.jpg";
import saturnringstexture from "../saturn-rings-texture.png";
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

const stars = getStarField({ numStars: 3000, innerRadius: 90, outerRadius: 150 });
scene.add(stars);



//Earth geometry
const earthGroup = new THREE.Group();
const earthGeometry = new THREE.SphereGeometry(8, 64, 64);
const earthMaterial = new THREE.MeshPhongMaterial({
    map: textureLoader.load(earthTexture),
    alphaTest: true
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
const originalScale = 8;
const targetScale = 3;
const scaleFactor = targetScale / originalScale;
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
const sunlight = new THREE.PointLight(0xffffff, 1000, 0, 2);
sunlight.add(new THREE.Mesh(sunGeometry, new THREE.MeshBasicMaterial({
    map: textureLoader.load(sunTexture),
    color: 0xcccccc
})));
sunlight.castShadow = true;
sunlight.position.set(0, 0, -50);
scene.add(sunlight);
   

//Mercury geometry
const mercuryGeometry = new THREE.SphereGeometry(1, 64, 64);
const mercuryMaterial = new THREE.MeshPhongMaterial({
    map: textureLoader.load(mercurytexture),
})
const mercuryMesh = new THREE.Mesh(mercuryGeometry, mercuryMaterial);

mercuryMesh.position.set(15, 0, -50);
scene.add(mercuryMesh);



//Venus geometry
const venusGeometry = new THREE.SphereGeometry(3, 64, 64);
const venusMaterial = new THREE.MeshPhongMaterial({
    map: textureLoader.load(venustexture)
})
const venusMesh = new THREE.Mesh(venusGeometry, venusMaterial);

venusMesh.position.set(20, -2, -40);
scene.add(venusMesh);


//Mars geometry
const marsGeometry = new THREE.SphereGeometry(2.5, 64, 64);
const marsMaterial = new THREE.MeshPhongMaterial({
    map: textureLoader.load(marstexture)
})
const marsMesh = new THREE.Mesh(marsGeometry, marsMaterial);
marsMesh.position.set(33, 0, -50);
scene.add(marsMesh);


//jupiter geometry
const jupiterGeometry = new THREE.SphereGeometry(6, 64, 64);
const jupiterMaterial = new THREE.MeshPhongMaterial({
    map: textureLoader.load(jupitertexture)
});
const jupiterMesh = new THREE.Mesh(jupiterGeometry, jupiterMaterial);
jupiterMesh.position.set(-50, 2, -65);
scene.add(jupiterMesh); 


//saturn geometry
const saturnGeometry = new THREE.SphereGeometry(6, 64, 64);
const saturnMaterial = new THREE.MeshPhongMaterial({
    map: textureLoader.load(saturntexture)
});
const saturnMesh = new THREE.Mesh(saturnGeometry, saturnMaterial);
saturnMesh.position.set(0, -10, -50);
saturnMesh.castShadow = true;
scene.add(saturnMesh);

const saturnRingsGeometry = new THREE.RingGeometry(7, 10, 32);
const texture = textureLoader.load(saturnringstexture, function(tex){
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(0.6, 0.6);
    tex.rotation = Math.PI / 4;
});

const saturnRingsMaterial = new THREE.MeshPhongMaterial({
    map: texture,
    side: THREE.DoubleSide
});
const saturnRingsMesh = new THREE.Mesh(saturnRingsGeometry, saturnRingsMaterial);
saturnRingsMesh.position.copy(saturnMesh.position);
saturnRingsMesh.rotation.x += 14;
saturnRingsMesh.receiveShadow = true;
scene.add(saturnRingsMesh);


// Light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.013);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(-15, 20, 5);
directionalLight.intensity = 1;
scene.add(directionalLight);


let moonOrbitRadius = 11;
const moonOrbitSpeed = 0.004;
let moonAngle = 0;
const mercuryOrbitRadius = 13;
const mercuryOrbitSpeed = 0.008;
let mercuryAngle = 0;
const venusOrbitRadius = 16;
const venusOrbitSpeed = 0.003;
let venusAngle = 0;
const marsOrbitRadius = 33;
let marsAngle = 0;
const jupiterorbitRadius = 40;
const jupiterOrbitSpeed = 0.001;
let jupiterAngle = 0;
const saturnOrbitRadius = 50;
const saturnOrbitSpeed = 0.0007;
let saturnAngle = 0;

//Render function
function animate(){
    requestAnimationFrame(animate);
    earthGroup.rotation.y += 0.0003;
    cloudsMesh.rotation.y += 0.0004; 
    sunlight.rotation.y += 0.0005;
    mercuryMesh.rotation.y += 0.0004;
    venusMesh.rotation.y += 0.0004;
    marsMesh.rotation.y += 0.0005;
    jupiterMesh.rotation.y += 0.002;
    saturnMesh.rotation.y += 0.0008;

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

    //mars movement
    marsAngle += venusOrbitSpeed;
    marsMesh.position.x = sunlight.position.x + marsOrbitRadius * Math.sin(marsAngle);
    marsMesh.position.z = sunlight.position.z + marsOrbitRadius * Math.cos(marsAngle);

    //jupiter movement
    jupiterAngle += jupiterOrbitSpeed;
    jupiterMesh.position.x = sunlight.position.x + jupiterorbitRadius * Math.cos(jupiterAngle);
    jupiterMesh.position.y = sunlight.position.y + jupiterorbitRadius * Math.sin(jupiterAngle);

    //saturn movement
    saturnAngle += saturnOrbitSpeed;
    saturnMesh.position.x = sunlight.position.x + saturnOrbitRadius * Math.sin(saturnAngle);
    saturnMesh.position.z = sunlight.position.z + saturnOrbitRadius * Math.cos(saturnAngle);
    saturnMesh.position.y = sunlight.position.y + saturnOrbitRadius * Math.cos(saturnAngle);
    saturnRingsMesh.position.x = sunlight.position.x + saturnOrbitRadius * Math.sin(saturnAngle);
    saturnRingsMesh.position.z = sunlight.position.z + saturnOrbitRadius * Math.cos(saturnAngle);
    saturnRingsMesh.position.y = sunlight.position.y + saturnOrbitRadius * Math.cos(saturnAngle);
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
        if(camera.position.z >= 65){
            return;
        }
    }else{
        if(camera.position.z >= 50){
            return;
        }
    }

    requestAnimationFrame(exploreAnimation);
    camera.position.z += 0.1; 

    renderer.render(scene, camera);
}

let earthAngle = 0;

function earthOrbiting(){
    requestAnimationFrame(earthOrbiting);
    const earthOrbitRadius = 22;
    const earthOrbitSpeed = 0.002;
    

    earthAngle -= earthOrbitSpeed;
    earthGroup.position.x = sunlight.position.x + earthOrbitRadius * Math.cos(earthAngle);
    earthGroup.position.z = sunlight.position.z + earthOrbitRadius * Math.sin(earthAngle);
    earthGroup.position.y = sunlight.position.y + earthOrbitRadius * Math.sin(earthAngle);
    cloudsMesh.position.x = sunlight.position.x + earthOrbitRadius * Math.cos(earthAngle);
    cloudsMesh.position.z = sunlight.position.z + earthOrbitRadius * Math.sin(earthAngle);
    cloudsMesh.position.y = sunlight.position.y + earthOrbitRadius * Math.sin(earthAngle);
    renderer.render(scene, camera);
}

const explore = document.querySelector(".explore-button")
explore.addEventListener('click', function() {
    const controls = new OrbitControls( camera, renderer.domElement );
    controls.enableZoom = false;
    tl.fromTo('.home-content', {y: "0%"}, {y: "-200%", duration: 2});
    controls.update();
    
    ambientLight.intensity = 0.02;
    moonOrbitRadius = 4;
    tl.fromTo(earthMesh.scale, {x: 1, y: 1, z: 1}, {x: scaleFactor, y: scaleFactor, z: scaleFactor}, "<")
        .fromTo(cloudsMesh.scale, {x: 1, y: 1, z: 1}, {x: 0.38, y: 0.38, z: 0.38}, "<")
        .fromTo(moonMesh.scale, {x: 1, y: 1, z: 1}, {x: 0.34, y: 0.34, z: 0.34}, "<")
        .fromTo(directionalLight, {intensity: 1}, {intensity: 0, duration: 0.3}, "<")
        .fromTo([earthGroup.position, cloudsMesh.position], {x: 0, y: 0, z: 0}, {x: -5, y: 20, z: -30}, "<");
    exploreAnimation();
    earthOrbiting();
});