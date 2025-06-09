import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EXRLoader } from 'three/addons/loaders/EXRLoader.js';

// === RENDERER ===
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// === SCENE ===
const scene = new THREE.Scene();

// === CAMERA ===
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(4, 5, 11);

// === CONTROLS ===
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 5;
controls.maxDistance = 20;
controls.minPolarAngle = 0.5;
controls.maxPolarAngle = 1.5;
controls.autoRotate = false;
controls.target.set(0, 1, 0);
controls.update();

// === CLICKABLE OBJECTS ===
const clickableObjects = [];

// === LIGHTS ===
const spotLight = new THREE.SpotLight(0xffffff, 3000, 100, 0.22, 1);
spotLight.position.set(0, 25, 0);
spotLight.castShadow = true;
spotLight.shadow.bias = -0.0001;
scene.add(spotLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(ambientLight);

// === ENVIRONMENT MAP (EXR) ===
const exrLoader = new EXRLoader();
exrLoader.setPath('public/hdri/');
exrLoader.load('example.exr', function (texture) {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = texture;
  scene.background = texture;
});

// === MODEL LOADING ===
const loader = new GLTFLoader().setPath('public/');
loader.load('drone_model_texturedv6.glb', (gltf) => {
  console.log('loading model');
  const mesh = gltf.scene;

mesh.traverse((child) => {
  if (child.isMesh) {
    if (!(child.material instanceof THREE.MeshStandardMaterial)) {
      console.log(`Replacing material for ${child.name} (${child.material.type})`);

      const oldMat = child.material;
      child.material = new THREE.MeshStandardMaterial({
        color: oldMat.color ? oldMat.color.clone() : new THREE.Color(0xffffff),
        map: oldMat.map || null,
        metalness: 0.2,
        roughness: 0.6,
      });
    }

    child.castShadow = true;
    child.receiveShadow = true;

    if (!child.name || child.name === "") {
      child.name = "Unnamed part";
    }
    if (child.parent && child.parent.name === "flight_controller_pcb") {
      child.name = "flight_controller_pcb";  // Force name to match parent
    }
    clickableObjects.push(child);
  }
});


  mesh.position.set(0, 1.05, -1);
  mesh.scale.set(0.05, 0.05, 0.05);

  scene.add(mesh);

  document.getElementById('progress-container').style.display = 'none';
}, (xhr) => {
  console.log(`loading ${xhr.loaded / xhr.total * 100}%`);
}, (error) => {
  console.error(error);
});
function showDescription(name) {
const descriptions = {
  "battery": {
    title: "Tattu 5200mAh 14.8V 35C 4S1P LiPo Battery",
    text: "The primary power source for the drone. This 4-cell LiPo battery supplies electrical energy to the ESC, motors, flight controller, and other onboard components."
  },
  "esc": {
    title: "SpeedyBee BL32 32bit 50A 4-in-1 ESC",
    text: "An electronic speed controller (ESC) that regulates power to the four brushless motors based on flight controller commands. Enables precise control of motor speeds and thrust."
  },
  "frame": {
    title: "Pyrodrone Source One 7\" Frame Kit (V0.2 DeadCat Arms)",
    text: "A lightweight and durable carbon fiber frame that supports all components of the drone. Its 'DeadCat' arm configuration improves forward camera view by moving front propellers out of frame."
  },
  "FRSKY": {
    title: "FrSky XM+ SBUS Mini Radio Receiver",
    text: "A compact radio receiver that receives control signals from the pilot’s FrSky-compatible transmitter and forwards them to the flight controller for manual flight control."
  },
  "motor1": {
    title: "BrotherHobby Avenger 2507 V2 Motor - 1500KV (Motor 1)",
    text: "A high-efficiency brushless DC motor responsible for driving Propeller 1 and contributing to lift, thrust, and maneuverability."
  },
  "motor2": {
    title: "BrotherHobby Avenger 2507 V2 Motor - 1500KV (Motor 2)",
    text: "A high-efficiency brushless DC motor responsible for driving Propeller 2 and contributing to lift, thrust, and maneuverability."
  },
  "motor3": {
    title: "BrotherHobby Avenger 2507 V2 Motor - 1500KV (Motor 3)",
    text: "A high-efficiency brushless DC motor responsible for driving Propeller 3 and contributing to lift, thrust, and maneuverability."
  },
  "motor4": {
    title: "BrotherHobby Avenger 2507 V2 Motor - 1500KV (Motor 4)",
    text: "A high-efficiency brushless DC motor responsible for driving Propeller 4 and contributing to lift, thrust, and maneuverability."
  },
  "prop1": {
    title: "HQ Prop Durable 7x4x3 Tri-Blade (Propeller 1)",
    text: "A durable tri-blade propeller designed to generate lift and assist with drone maneuvering. Driven by Motor 1."
  },
  "prop2": {
    title: "HQ Prop Durable 7x4x3 Tri-Blade (Propeller 2)",
    text: "A durable tri-blade propeller designed to generate lift and assist with drone maneuvering. Driven by Motor 2."
  },
  "prop3": {
    title: "HQ Prop Durable 7x4x3 Tri-Blade (Propeller 3)",
    text: "A durable tri-blade propeller designed to generate lift and assist with drone maneuvering. Driven by Motor 3."
  },
  "prop4": {
    title: "HQ Prop Durable 7x4x3 Tri-Blade (Propeller 4)",
    text: "A durable tri-blade propeller designed to generate lift and assist with drone maneuvering. Driven by Motor 4."
  },
  "reciever": {  // Matches Blender spelling — this is the SiK Telemetry Radio
    title: "SiK Telemetry Radio V3 - 100mW/915MHz",
    text: "A telemetry radio module that provides real-time two-way data link between the drone and ground station software (e.g. Mission Planner), enabling monitoring of flight status, GPS position, and tuning parameters."
  },
  "teensy": {
    title: "Teensy 4.0 Microcontroller",
    text: "The central processing unit of the flight controller. The Teensy 4.0 runs the flight control firmware, processes IMU data, and generates motor commands."
  },
  "flight_controller_pcb": {
    title: "Custom Flight Controller PCB",
    text: "A custom-designed printed circuit board (PCB) that integrates the Teensy microcontroller, IMU, connectors, SD slot, and power management components required to control the drone’s flight."
  },
  "default": {
    title: "Drone Model",
    text: "Click on any component of the drone to view a detailed description and learn more about its function and role in the system."
  }
};


  const descBox = document.getElementById('description');
  const descContent = document.getElementById('description-content');

  const desc = descriptions[name] || descriptions["default"];

  descContent.innerHTML = `
    <h2>${desc.title}</h2>
    <p>${desc.text}</p>
  `;
  descBox.classList.add('show');
}

// === RAYCASTER FOR CLICK INTERACTION ===
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('click', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(clickableObjects, true);

  if (intersects.length > 0) {
    const clickedObject = intersects[0].object;
    console.log('Clicked:', clickedObject.name);

    showDescription(clickedObject.name);
    isolatePart(clickedObject);
  } else {
    resetIsolation();
    showDescription();  // <- show default description
  }
});


// === DESCRIPTION ===

// === ISOLATION ===
function isolatePart(clickedObject) {
  clickableObjects.forEach((obj) => {
    if (obj === clickedObject) {
      obj.material.transparent = false;
      obj.material.opacity = 1.0;
      obj.material.emissive = new THREE.Color(0x444444);  // optional slight glow
    } else {
      obj.material.transparent = true;
      obj.material.opacity = 0.1;
      obj.material.emissive = new THREE.Color(0x000000);
    }
  });
}

function resetIsolation() {
  clickableObjects.forEach((obj) => {
    obj.material.transparent = false;
    obj.material.opacity = 1.0;
    obj.material.emissive = new THREE.Color(0x000000);
  });
}

// === HANDLE RESIZE ===
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// === ANIMATION LOOP ===
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();
showDescription();  // Show default description on startup
