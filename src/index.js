import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import "normalize.css";
import { createNoise3D } from "simplex-noise";
import alea from 'alea';




// Mississippi State Pregame
// https://stackoverflow.com/questions/831030/how-to-get-get-request-parameters-in-javascript

function get(name) {
  if (
    (name = new RegExp("[?&]" + encodeURIComponent(name) + "=([^&]*)").exec(
      location.search
    ))
  ) {
    return decodeURIComponent(name[1]);
  } else {
    return undefined;
  }
}

const noise3D = createNoise3D(alea(get('seed') === undefined ? Math.random() : get('seed')));

// init

const camera = new THREE.PerspectiveCamera(
  70,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = -5;
camera.lookAt(new THREE.Vector3(0, 0, 0));

const scene = new THREE.Scene();

// Planet

const geometry = new THREE.IcosahedronGeometry(1, 8);

var old = geometry.attributes.position.array;
console.log(geometry);

for (let i = 0; i < geometry.attributes.position.count * 3; i += 3) {
  var vertex = {
    x: geometry.attributes.position.array[i],
    y: geometry.attributes.position.array[i + 1],
    z: geometry.attributes.position.array[i + 2],
  };

  var actualNoiseValue = noise3D(vertex.x, vertex.y, vertex.z);
  var noiseValue = actualNoiseValue;

  var heightOffset = 0.02;
  var seaLevelOffset = 0.005;

  geometry.attributes.position.array[i] *=
    1.0 + seaLevelOffset + noiseValue * heightOffset;
  geometry.attributes.position.array[i + 1] *=
    1.0 + seaLevelOffset + noiseValue * heightOffset;
  geometry.attributes.position.array[i + 2] *=
    1.0 + seaLevelOffset + noiseValue * heightOffset;
}

geometry.setAttribute(
  "color",
  new THREE.BufferAttribute(
    new Float32Array(geometry.attributes.position.count * 3),
    3
  )
);

// Coloring

function generatePalette(color) {
  var palette = new Array(14);

  palette[0] = new THREE.Color(
    color["r"] / 255,
    color["g"] / 255,
    color["b"] / 255
  );

  for (let i = 1; i < palette.length; i++) {
    var newColor = new THREE.Color(
      color["r"] / 255 - i * 0.05 * (color["r"] / 255),
      color["g"] / 255 - i * 0.05 * (color["g"] / 255),
      color["b"] / 255 - i * 0.05 * (color["b"] / 255)
    );

    palette[i] = newColor;
  }

  return palette;
}

const palette = generatePalette({ r: 50, g: 205, b: 50 });
console.log(palette);

// https://stackoverflow.com/questions/22845995/three-js-how-can-i-calculate-the-distance-between-two-3d-positions#22846762
function distanceVector(v1, v2) {
  var dx = v1.x - v2.x;
  var dy = v1.y - v2.y;
  var dz = v1.z - v2.z;

  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

for (let i = 0; i < geometry.attributes.position.count; i++) {
  var vertex = {
    x: geometry.attributes.position.array[i * 3],
    y: geometry.attributes.position.array[i * 3 + 1],
    z: geometry.attributes.position.array[i * 3 + 2],
  };

  var centerDistance = distanceVector(vertex, new THREE.Vector3(0, 0, 0));

  if (centerDistance > 1 + 9 * (heightOffset / 10)) {
    //peaks
    geometry.attributes.color.setXYZ(
      i,
      palette[0].r,
      palette[0].g,
      palette[0].b
    );
  } else if (centerDistance > 1 + 8 * (heightOffset / 10)) {
    //plains
    geometry.attributes.color.setXYZ(
      i,
      palette[1].r,
      palette[1].g,
      palette[1].b
    );
  } else if (centerDistance > 1 + 7 * (heightOffset / 10)) {
    //plains
    geometry.attributes.color.setXYZ(
      i,
      palette[2].r,
      palette[2].g,
      palette[2].b
    );
  } else if (centerDistance > 1 + 6 * (heightOffset / 10)) {
    //plains
    geometry.attributes.color.setXYZ(
      i,
      palette[2].r,
      palette[2].g,
      palette[2].b
    );
  } else if (centerDistance > 1 + 5 * (heightOffset / 10)) {
    //plains
    geometry.attributes.color.setXYZ(
      i,
      palette[3].r,
      palette[3].g,
      palette[3].b
    );
  } else if (centerDistance > 1 + 3 * (heightOffset / 10)) {
    //mountians
    geometry.attributes.color.setXYZ(
      i,
      palette[4].r,
      palette[4].g,
      palette[4].b
    );
  } else if (centerDistance > 1 + 2 * (heightOffset / 10)) {
    //plains
    geometry.attributes.color.setXYZ(
      i,
      palette[5].r,
      palette[5].g,
      palette[5].b
    );
  } else if (centerDistance > 1 + heightOffset / 10) {
    // coastal
    geometry.attributes.color.setXYZ(
      i,
      palette[6].r,
      palette[6].g,
      palette[6].b
    );
  } else if (centerDistance > 1 - 2 * (heightOffset / 10)) {
    //plains
    geometry.attributes.color.setXYZ(
      i,
      palette[7].r,
      palette[7].g,
      palette[7].b
    );
  } else if (centerDistance > 1 - 3 * (heightOffset / 10)) {
    //plains
    geometry.attributes.color.setXYZ(
      i,
      palette[8].r,
      palette[8].g,
      palette[8].b
    );
  } else if (centerDistance > 1 - 4 * (heightOffset / 10)) {
    //plains
    geometry.attributes.color.setXYZ(
      i,
      palette[9].r,
      palette[9].g,
      palette[9].b
    );
  } else if (centerDistance > 1 - 5 * (heightOffset / 10)) {
    //plains
    geometry.attributes.color.setXYZ(
      i,
      palette[10].r,
      palette[10].g,
      palette[10].b
    );
  } else if (centerDistance > 1 - 6 * (heightOffset / 10)) {
    //plains
    geometry.attributes.color.setXYZ(
      i,
      palette[11].r,
      palette[11].g,
      palette[11].b
    );
  } else if (centerDistance > 1 - 7 * (heightOffset / 10)) {
    //plains
    geometry.attributes.color.setXYZ(
      i,
      palette[12].r,
      palette[12].g,
      palette[12].b
    );
  } else {
    geometry.attributes.color.setXYZ(
      i,
      palette[13].r,
      palette[13].g,
      palette[13].b
    );
  }
}

const mesh = new THREE.Mesh(
  geometry,
  new THREE.MeshToonMaterial({
    vertexColors: true,
  })
);

scene.add(mesh);

// Water

const waterGeometry = new THREE.IcosahedronGeometry(1, 6);
const waterMaterial = new THREE.MeshPhongMaterial({
  color: 0x74ccf4,
  shininess: 100,
  transparent: 0.3,
});
const waterMesh = new THREE.Mesh(waterGeometry, waterMaterial);
scene.add(waterMesh);

// Sun

const sun = new THREE.PointLight(0xf1cd6c, 1, 100000);
sun.position.set(10000, 0, 0);
sun.scale.set(1000, 1000, 1000);
scene.add(sun);

// Sun Model

const sunGeometry = new THREE.IcosahedronGeometry(1, 5);
const sunMaterial = new THREE.MeshPhongMaterial({
  color: 0xfce570,
  emissive: 0xfce570,
  emissiveIntensity: 10,
});
const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
sunMesh.position.set(100, 0, 0);
scene.add(sunMesh);

// Ambient

const light = new THREE.AmbientLight(0x404040, 2);
scene.add(light);

// Adding objects to scene

scene.add(camera);

// Context Creator

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Controls

const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

// animation

function animate() {
  requestAnimationFrame(animate);

  controls.update();

  renderer.render(scene, camera);
}

animate();
