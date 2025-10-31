import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const textureLoader = new THREE.TextureLoader();
let scene = new THREE.Scene();
let falcon;
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);
const sunLight = new THREE.PointLight(0xffffff, 8, 1000, 0.8);
sunLight.position.set(0, 0, 0);
scene.add(sunLight);
let renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.8;
let sun;
let planets = [];
let satellites = [];
let t0 = Date.now();
let accglobal = 0.001;
let timestamp;
let previousTime = 0;
const FLIGHT_SPEED = 20;
const TARGET_DISTANCE = 50;
const START_DISTANCE = 200;
const ORBIT_RADIUS = 150;
const ORBIT_SPEED = 0.2;
const buttonGeneralvision = document.getElementById("GeneralButton");
const buttonFalconvision = document.getElementById("FalconButton");
const SOLAR_SYSTEM_SCALE = 3;

let camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 100, 200);
camera.name = "Vista Externa";

let camera2 = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera2.position.set(0, 0, 0);
camera2.name = "Vista desde la Nave";
let activeCamera = camera;

let controls, controls2;
let orbitAngle = 0;
let isFalconMoving = true;
let falconOrbitPosition = new THREE.Vector3(START_DISTANCE, 0, 0);

buttonGeneralvision.addEventListener("click", function () {
  console.log("Camara 1 - Vista Externa");
  activeCamera = camera;
  if (falcon) {
    falcon.visible = true;
  }
  controls.enabled = true;
  if (controls2) controls2.enabled = false;
});

buttonFalconvision.addEventListener("click", function () {
  console.log("Camara 2 - Vista desde la Nave");
  activeCamera = camera2;
  if (falcon) {
    falcon.visible = false;
  }
  controls.enabled = false;
  if (controls2) controls2.enabled = true;
});

function createstar(radio, texture) {
  const geometry = new THREE.SphereGeometry(
    radio * SOLAR_SYSTEM_SCALE,
    100,
    100
  );
  const textureLoader = new THREE.TextureLoader();
  const earthTexture = textureLoader.load(texture);
  const material = new THREE.MeshBasicMaterial({
    map: earthTexture,
    emissive: 0xffff00,
    emissiveIntensity: 0.5,
  });

  sun = new THREE.Mesh(geometry, material);
  sun.position.set(0, 0, 0);
  scene.add(sun);
}

function createplanet(
  radioPlanet,
  distance,
  speed,
  texture,
  f1,
  f2,
  name,
  rotationSpeed = 0.01
) {
  const geometry = new THREE.SphereGeometry(
    radioPlanet * SOLAR_SYSTEM_SCALE,
    100,
    100
  );
  const textureLoader = new THREE.TextureLoader();
  const planetTexture = textureLoader.load(texture);
  const material = new THREE.MeshStandardMaterial({
    map: planetTexture,
    roughness: 0.7,
    metalness: 0.3,
  });

  const newPlanet = new THREE.Mesh(geometry, material);

  newPlanet.userData = {
    name,
    dist: distance * SOLAR_SYSTEM_SCALE,
    speed,
    f1,
    f2,
    rotationSpeed,
  };

  planets.push(newPlanet);
  createOrbit(distance * SOLAR_SYSTEM_SCALE, f1, f2);
  scene.add(newPlanet);
}

function loadMillenniumFalcon() {
  const loader = new GLTFLoader();
  const modelUrl = "./src/star_wars_-_halcon_milenario/scene.gltf";

  loader.load(
    modelUrl,
    function (gltf) {
      falcon = gltf.scene;
      falcon.scale.set(0.05, 0.05, 0.05);
      falcon.visible = true;
      // Posición inicial para vista externa (órbita)
      falcon.position.copy(falconOrbitPosition);

      // CORRECCIÓN: Hacer que mire en la dirección de la órbita (tangente a la trayectoria)
      const tangent = new THREE.Vector3(
        -falconOrbitPosition.z,
        0,
        falconOrbitPosition.x
      ).normalize();
      falcon.lookAt(falcon.position.clone().add(tangent));

      scene.add(falcon);

      console.log("Halcón Milenario cargado correctamente.");
    },
    undefined,
    function (error) {
      console.error("Error al cargar el Halcón Milenario:", error);
    }
  );
}

function createOrbit(distance, f1, f2) {
  const curve = new THREE.EllipseCurve(0, 0, distance * f1, distance * f2);
  const points = curve.getPoints(50);
  const orbitGeometry = new THREE.BufferGeometry().setFromPoints(points);
  const orbitMaterial = new THREE.LineBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.3,
  });
  const ellipse = new THREE.Line(orbitGeometry, orbitMaterial);
  scene.add(ellipse);
}

function createsatellite(planeta, radio, dist, vel, col, angle, name) {
  const geometry = new THREE.SphereGeometry(radio * SOLAR_SYSTEM_SCALE, 32, 32);
  const material = new THREE.MeshStandardMaterial({
    color: col,
    roughness: 0.7,
    metalness: 0.3,
  });
  const satellite = new THREE.Mesh(geometry, material);

  satellite.userData = {
    name,
    dist: dist * SOLAR_SYSTEM_SCALE,
    speed: vel,
    rotationSpeed: 0.02,
    parentPlanet: planeta,
    angle: Math.random() * Math.PI * 2,
    startTime: Date.now(),
  };

  satellites.push(satellite);
  scene.add(satellite);
}

function loadSpaceBackground() {
  const spaceTexture = textureLoader.load(
    "./textures/space2.jpeg",
    function () {
      scene.background = spaceTexture;
    }
  );
}

function init() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setAnimationLoop(animation);
  document.body.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  loadSpaceBackground();

  // Crear el Sol
  createstar(3.5, "./textures/sol.jpg");

  const factorEscalaInterior = 15;

  // Crear planetas
  createplanet(
    0.4,
    0.387 * factorEscalaInterior,
    4.15,
    "./textures/mercurio.jpg",
    1.05,
    0.95,
    "Mercurio",
    0.02
  );
  createplanet(
    0.8,
    0.723 * factorEscalaInterior,
    1.63,
    "./textures/venus.jpg",
    1.0,
    1.0,
    "Venus",
    0.015
  );
  createplanet(
    0.9,
    1.0 * factorEscalaInterior,
    0.4,
    "./textures/tierra.jpg",
    1.0,
    1.0,
    "Tierra",
    0.03
  );
  createplanet(
    0.6,
    1.524 * factorEscalaInterior,
    0.53,
    "./textures/marte.jpeg",
    1.0,
    1.0,
    "Marte",
    0.025
  );
  createplanet(
    2.5,
    17.5,
    0.084,
    "./textures/jupiter.jpg",
    1.0,
    1.0,
    "Jupiter",
    0.04
  );
  createplanet(
    2.2,
    24.0,
    0.034,
    "./textures/saturno.jpg",
    1.0,
    1.0,
    "Saturno",
    0.035
  );
  createplanet(
    1.6,
    31.0,
    0.012,
    "./textures/urano.jpg",
    1.0,
    1.0,
    "Urano",
    0.03
  );
  createplanet(
    1.5,
    35.0,
    0.006,
    "./textures/neptuno.jpg",
    1.0,
    1.0,
    "Neptuno",
    0.032
  );
  createplanet(
    0.25,
    38.0,
    0.004,
    "./textures/pluton.jpg",
    1.0,
    1.0,
    "Plutón",
    0.01
  );

  // Crear lunas
  createsatellite(planets[2], 0.25, 1.5, 2.0, 0xffffff, 0, "Luna");
  createsatellite(planets[3], 0.15, 1.2, 3.0, 0x808080, 0.5, "Fobos");
  createsatellite(planets[4], 0.6, 4.0, 1.5, 0xfaebd7, 1, "Ganimedes");
  createsatellite(planets[4], 0.4, 3.0, 2.5, 0xffa500, 1.5, "Ío");
  createsatellite(planets[5], 0.5, 4.0, 1.0, 0xf0e68c, 1, "Titán");
  createsatellite(planets[5], 0.2, 2.5, 1.8, 0xeee9e9, 1.5, "Encélado");
  createsatellite(planets[6], 0.3, 2.8, 0.8, 0xb0c4de, 3, "Titania");
  createsatellite(planets[7], 0.4, 3.5, 0.6, 0xadd8e6, 3.5, "Tritón");
  createsatellite(planets[8], 0.2, 1.0, 1.2, 0x999999, 4, "Caronte");

  loadMillenniumFalcon();
  animate();
}

function animate(time) {
  requestAnimationFrame(animate);
  animation(time);
}

function animation(time) {
  const delta = (time - previousTime) / 1000;
  previousTime = time;
  timestamp = (Date.now() - t0) * accglobal;

  // Rotación de planetas
  for (let object of planets) {
    object.position.x =
      Math.cos(timestamp * object.userData.speed) *
      object.userData.f1 *
      object.userData.dist;
    object.position.y =
      Math.sin(timestamp * object.userData.speed) *
      object.userData.f2 *
      object.userData.dist;
    object.rotation.y += object.userData.rotationSpeed || 0.01;
  }

  // Órbita para satélites
  for (let satellite of satellites) {
    const planeta = satellite.userData.parentPlanet;
    const dist = satellite.userData.dist;
    const speed = satellite.userData.speed;
    const satelliteTime = timestamp * speed;

    satellite.position.x = planeta.position.x + Math.cos(satelliteTime) * dist;
    satellite.position.y = planeta.position.y + Math.sin(satelliteTime) * dist;
    satellite.position.z = planeta.position.z;
    satellite.rotation.y += satellite.userData.rotationSpeed || 0.015;
  }

  if (falcon) {
    if (activeCamera === camera) {
      // CÁMARA 1: La nave orbita alrededor del sistema solar en el plano XZ
      orbitAngle += ORBIT_SPEED * delta;

      falconOrbitPosition.x = Math.cos(orbitAngle) * ORBIT_RADIUS;
      falconOrbitPosition.z = Math.sin(orbitAngle * 2) * 20;
      falconOrbitPosition.y = Math.sin(orbitAngle) * ORBIT_RADIUS; // Movimiento vertical suave

      falcon.position.copy(falconOrbitPosition);
      const tangent = new THREE.Vector3(
        -Math.sin(orbitAngle) * ORBIT_SPEED,
        Math.cos(orbitAngle) * ORBIT_SPEED * 0.5, // Ajustar para el movimiento vertical
        Math.cos(orbitAngle * 2) * ORBIT_SPEED * 2
      ).normalize();

      falcon.lookAt(falcon.position.clone().add(tangent));

      controls.update();
    } else if (activeCamera === camera2) {
      orbitAngle += ORBIT_SPEED * delta;
      falconOrbitPosition.x = Math.cos(orbitAngle) * ORBIT_RADIUS;
      falconOrbitPosition.z = Math.sin(orbitAngle * 2) * 20;
      falconOrbitPosition.y = Math.sin(orbitAngle) * ORBIT_RADIUS; // Movimiento vertical suave

      falcon.position.copy(falconOrbitPosition);

      const tangent = new THREE.Vector3(
        -Math.sin(orbitAngle) * ORBIT_SPEED,
        Math.cos(orbitAngle) * ORBIT_SPEED * 0.5,
        Math.cos(orbitAngle * 2) * ORBIT_SPEED * 2
      ).normalize();

      falcon.lookAt(falcon.position.clone().add(tangent));

      if (!controls2) {
        controls2 = new OrbitControls(camera2, renderer.domElement);
        controls2.enableDamping = true;
        controls2.dampingFactor = 0.05;
        controls2.enabled = true;
      }

      // Configurar la cámara en primera persona - posición fija dentro de la nave
      camera2.position.copy(falcon.position);

      // Ajustar la posición de la cámara para que esté dentro del cockpit
      const forward = new THREE.Vector3();
      falcon.getWorldDirection(forward);

      // Posicionar la cámara dentro del cockpit (posición relativa a la nave)
      camera2.position.addScaledVector(forward, -1.5); // 1.5 unidades hacia adelante (dentro de la nave)
      camera2.position.y += 0.8; // 0.8 unidades hacia arriba
      controls2.object.position.copy(camera2.position);
      controls2.update();
    }
  }

  renderer.render(scene, activeCamera);
}

init();

