import * as THREE from "three";
import { OrbitControls } from './OrbitControls';
import "normalize.css";

// init

const camera = new THREE.PerspectiveCamera(
  70,
  window.innerWidth / window.innerHeight,
  0.01,
  10
);
camera.position.z = -5;
camera.lookAt(new THREE.Vector3(0, 0, 0));

const scene = new THREE.Scene();


const geometry = new THREE.IcosahedronGeometry(1, 0);
const material = new THREE.MeshPhongMaterial({ color: 0xe27b58 });
const mesh = new THREE.Mesh(geometry, material);

// Sun
const sun = new THREE.PointLight(0xf1cd6c, 1, 100);
sun.position.set(5, 0, 0);
scene.add(sun);

// Ambient

const light = new THREE.AmbientLight( 0x404040, 1 );
scene.add(light);


// Adding objects to scene

scene.add(mesh);
scene.add(camera);

// Context Creator

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Controls
const controls = new OrbitControls( camera, renderer.domElement );
controls.update();

// animation

function animate() {
  requestAnimationFrame(animate);

  controls.update();

  renderer.render(scene, camera);
}

animate();
