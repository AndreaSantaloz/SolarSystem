# Sistema solar

## Autora
1. Andrea Santana López

## ¿De qué se trata la prática?
Este proyecto se basa en un sistema solar con todos los planetas del sistema solar y satelites más icónicos del sistema solar.
Además hemos creado dos cámaras donde se ve en una el sistema solar con el halcón milenario que es una nave de star wars y en la
segunda cámara simula que estamos en primera persona dentro del Halcón Milenario.

## Preinstalación
En nuestro caso nuestro proyecto se realizo en codesanbox con lo que tendría usted que hacerse una cuenta,crear un proyetco especificando como tecnología javascript y 
a la vez que vas poniendo código si pones los imports te pedira si lo quieres instalar y tu le debes decir que sí.

## ¿Cómo puede moverse el usuario por la aplicación del sistema solar?
Tiene dos botones basta con pulsar uno de ellos y te lleva  a las distintas vistas.Una vez pulsado en la primera verá el sistema solar y la nave moviendose y usted puede rotar,trasladar y hacer zoom al sistema solar.
En cuanto a la segunda vista usted vera moverse la nave y brevemente podra mover un poco estando dentro el zoom y poca traslación.

## Estructura del proyecto
Carpetas iniciales src donde está la app y textures donde están todas las texturas.
<br>
<img width="1117" height="105" alt="imagen" src="https://github.com/user-attachments/assets/2aa9220d-356f-4213-8a71-ed9b182e11d4" />
<br>
Dentro del SRC está como explicaremos más adelante script.js,index.html y sytles.css
<img width="1853" height="203" alt="imagen" src="https://github.com/user-attachments/assets/8e13c654-d07f-43e7-8d41-6c5795c22bdb" />

## Demostración 
|[video](./videoSpace/videoSpaceExperience.mp4)

## Cómo se ha desarrollado

Primero desarrollamos tres tipos de documentos primero el index.html donde estará la estructura de nuestro projecto,es decir,el html con donde declaramos un titulo a la página como Prática S6 IG,especificamos los metadatos y la página css que hemos creado que es el segundo fichero llamado styles.css.Después en el body del html declaramos los dos botones que tienen las siguientes funcionalidades:una vista general del sistema solar con la nave halcón milenario de star wars y una vista en primer plano dentro de la nave viendo el sistema solar como si estuvieramos dentro de la nave.Después ejecutamos el tercer documento del que vamos a hablar llamado script.js donde tiene todo el contenido de Three.js.
<br>
```html
<!DOCTYPE html>
<html>
  <head>
    <title>Práctica S6 IG</title>
    <meta charset="UTF-8" />
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <div class="orden">
      <p id="value">Space experience</p>
      <button id="GeneralButton">General vision</button>
      <button id="FalconButton">Millennium Falcon vision</button>
    </div>
    <script src="./script.js"></script>
  </body>
</html>
```
<br>
El segundo fichero ya mencionado se trata de un documento css ,es decir, una hoja de estilos para mejorar los estilos de la aplicación visual.
<br>

```
body {
  margin: 0;
  padding: 0;
  overflow: hidden;
  background-color: #000;
  font-family: Arial, sans-serif;
}

.orden {
  position: absolute;
  top: 20px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  box-sizing: border-box;
  z-index: 1000;
}

#value {
  margin: 0;
  color: white;
  font-size: 18px;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.orden button {
  padding: 10px 20px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  border: 1px solid #fff;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  backdrop-filter: blur(5px);
  transition: all 0.3s ease;
}

.orden button:hover {
  background-color: rgba(50, 50, 50, 0.9);
  transform: scale(1.05);
}
````
<br>
Por último hablaremos más a profundidad de nuestro script.js donde empieza la magia.En primer lugar importamos las librerias Three.js,OrbitControls y GTLFLoader.
<br>

```
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
```
En segundo lugar declaramos una serie de parametros explicados en la siguiente tabla.

|parametro    | explicación                         |
-----------------------
|textureLoader| para cargar texturas en los objetos|
|scene        | para cargar la escena de donde estará el sistema solar y la nave|
|ambientLight | para crear una iluminación base general y uniforme que ilumine la escena|
|sunLight     | la luz puntual que iluminará a los planetas para generar sombras|
|render       | Para renderizar la aplicación|
|sun          | Donde almacenará los datos del sol|
|planets      |Los planetas que irémos creando|
|satellites   |Los satélites naturales que irémos creando |
|t0           |Para hacer cálculos de movimiento de planetas,satelites,etc.|
|accglobal    |variable constante para los cálculos de movimiento del sistema solar |
|timestamp    |variable variable para los cálculos de movimiento del sistema solar|
|previousTime |variable variable para los cálculos de movimiento del sistema solar|
|FLIGHT_SPEED |variable constante para los cálculos del movimiento de la nave|
|TARGET_DISTANCE |variable constante para los cálculos del movimiento de la nave|
|START_DISTANCE |variable constante para los cálculos del movimiento de la nave|
|ORBIT_SPEED |variable constante para los cálculos del movimiento de la nave|
|ORBIT_RADIUS |variable constante para los cálculos del movimiento de la nave|
|SOLAR_SYSTEM_SCALE |variable constante para escalar el sistema solar|
|buttonGeneralvision|Para entrar en la vista general del sistema solar|
|buttonGFalconvision|Para entrar a la nave para ver el sistema solar|
|camera|Basicamente es la cámara de la vision general|
|camera2|Basicamente es la cámara de la vision del halcón milenario |
|controls|Para moverse con los dedos/ratón haciendo zoom o trasladandose a través del sistema solar |
|controls2|Para moverse con los dedos/ratón haciendo zoom o trasladandose a través del sistema solar |
|falconOrbitPosition|Para el movimiento orbital del halcón milenario|
|activecamara|Para comprobar que camara esta poniendose|

<br>

Aquí declaramos las dos cámaras para las distintas tipos de vistas

```

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

```

Aquí declaramos los botones para cambiar el tipo de vista.
<br>

```

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
```

Aquí declaramos la función para crear el sol o cualquier tipo de estrella donde especificamos el radio y la textura almacenada en textures.Luego usamos SpehereGeometry para el radio y escalandolo y poniendo las demás variables a 100 para conseguir que la esfera se vea completamente redonda.Luego cargamos la textura y en material especificamos el material para que ilumine,después en MESH lo unificamos y con position le ponemos donde queremos que este y finalmente lo añadimos a la escena.
<br>

```
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
```

Los mismo haremos con la función para crear planetas pero añadiendo factores de elipticidad,velocidad y velocidad de rotacion.
<br>

```

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
```
Aquí ponemos la función para crear el halcón milenario donde utilizamos un modelo 3d ya creado de tipo GTLF y lo descargamos
<br>

```

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

```
Aquí le ponemos a la función de crear una orbita que llamamos desde la función de crear un planeta donde la pasamos la distancia del planeta y los factores de elapticidad.
<br>

```

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
```

Aquí es lo mismo que el planeta y el sol pero con los sátelites naturales.
<br>

```

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

```
Aquí tenemos otra función pero esta es para cargar una textura en la escena.
<br>

```
function loadSpaceBackground() {
  const spaceTexture = textureLoader.load(
    "./textures/space2.jpeg",
    function () {
      scene.background = spaceTexture;
    }
  );
}

```
En el init realizamos las llamadas para crear los planetas,el halc
on milenario,los sátelites y el sol ,además de establecer características para el render y poner los controles basicos de la vista principal.Aparte llamamos a la funcion animate para optimizar la animación.
<br>

```

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
```
<br>

```
function animate(time) {
  requestAnimationFrame(animate);
  animation(time);
}
```
Por último esta función llama a  la función animation la cual toma el tiempo actual y lo utiliza para actualizar las posiciones orbitales y de rotación de planetas, lunas y una nave espacial, y finalmente, renderiza el resultado en pantalla.

<br>

```

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
```

## ¿Qué tecnologías hemos usado?
1. Three.js
2. OrbitControl
3. HTML
4. CSS
5. Javascript
6. GTLF
 
## Contacto
Si quieres saber más sobre el proyecto o plantear posibles mejoras a él mi correo es andreasantaloz@gmail.com

