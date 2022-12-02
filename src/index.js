import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import "normalize.css";
import { createNoise3D } from "simplex-noise";
const noise3D = createNoise3D();

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
console.log(geometry.attributes.position.array);

for (let i = 0; i < geometry.attributes.position.array.length; i += 3) {
  var vertex = {
    x: geometry.attributes.position.array[i],
    y: geometry.attributes.position.array[i + 1],
    z: geometry.attributes.position.array[i + 2],
  };

  var actualNoiseValue = noise3D(vertex.x, vertex.y, vertex.z);
  var noiseValue = actualNoiseValue;
  console.log(noiseValue);

  var heightOffset = 0.02;
  var seaLevelOffset = 0.005;

  geometry.attributes.position.array[i] *=
    1.0 + seaLevelOffset + noiseValue * heightOffset;
  geometry.attributes.position.array[i + 1] *=
    1.0 + seaLevelOffset + noiseValue * heightOffset;
  geometry.attributes.position.array[i + 2] *=
    1.0 + seaLevelOffset + noiseValue * heightOffset;
}

geometry.computeVertexNormals();
geometry.attributes.position.needsUpdate = true;


const mesh = new THREE.Mesh(
  geometry,
  new THREE.MeshPhongMaterial({
    color: 0x007a39,
    flatShading: false,
    vertexColors: THREE.FaceColors,
  })
);

scene.add(mesh);

// Water

const waterGeometry = new THREE.IcosahedronGeometry(1, 6);
const waterMaterial = new THREE.MeshPhongMaterial({ color: 0x74ccf4, shininess: 100, transparent: 0.3 });
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
