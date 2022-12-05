import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { createNoise3D } from "simplex-noise";
import Planet from "./Planet";
import Entity from "./Entity";
import alea from "alea";

function randomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

export default class Game {
  constructor() {
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.entities = {};
    this.components = {};
    this.systems = {};
  }

  addEntity(object) {
    Object.values(object.components).forEach((component) => {
      this.scene.add(component);
    });

    this.entities[object.name] = object;
    console.log(this.entities);
  }

  removeEntity(name) {
    console.log(name);
    Object.values(this.entities[name].components).forEach((component) => {
      console.log("Object.values", component);
      this.scene.remove(component);
      component = undefined;
    });

    delete this.entities[name];

    this.renderer.renderLists.dispose();
  }

  start() {
    // Create and add Camera Entity

    const cameraEntity = new Entity("camera");
    cameraEntity.addComponent(
      new THREE.PerspectiveCamera(
        70,
        window.innerWidth / window.innerHeight,
        0.1,
        1000000
      ),
      "camera"
    );
    this.addEntity(cameraEntity);

    this.entities.camera.components.camera.position.z = -5;
    this.entities.camera.components.camera.lookAt(new THREE.Vector3(0, 0, 0));

    // Ambient Light

    const lightEntity = new Entity("light");
    lightEntity.addComponent(new THREE.AmbientLight());
    this.addEntity(lightEntity);

    // Sun Light

    const light = new THREE.PointLight(0xfce570, 1.5, 1000000);
    light.position.set(10000, 0, 0);

    // Sun Mesh

    const sunGeometry = new THREE.IcosahedronGeometry(100, 12);
    const sunMaterial = new THREE.MeshToonMaterial({
      color: 0xfce570,
      emissive: true,
      emissiveIntensity: 100,
    });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    sun.position.set(10000, 0, 0);

    const sunEntity = new Entity("sun");
    sunEntity.addComponent(light, "light");
    sunEntity.addComponent(sun, "geometry");
    this.addEntity(sunEntity);

    // https://stackoverflow.com/questions/54190036/three-js-how-to-generate-stars-efficiently
    for (let i = 1; i < 1000; i++) {
      let geometry = new THREE.SphereGeometry(
        100 * randomArbitrary(0.5, 1),
        6,
        6
      );
      let material = new THREE.MeshBasicMaterial({
        color: new THREE.Color(
          1,
          randomArbitrary(190, 220) / 255,
          Math.round(Math.random())
        ),
      });
      let sphere = new THREE.Mesh(geometry, material);
      sphere.position.setFromSpherical(
        new THREE.Spherical(
          100000 + 5 * Math.random(),
          2 * Math.PI * Math.random(),
          2 * Math.PI * Math.random()
        )
      );

      let starEntity = new Entity(Math.random());
      starEntity.addComponent(sphere);
      this.addEntity(starEntity);
    }

    // Context Creator

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    // Controls

    this.systems.controls = new OrbitControls(
      this.entities.camera.components.camera,
      this.renderer.domElement
    );
    this.systems.controls.update();

    // this not defined quick fix (need to do more research, would like to make animate a method of Game)
    const controls = this.systems.controls;
    const renderer = this.renderer;
    const scene = this.scene;
    const camera = this.entities.camera.components.camera;

    function animate() {
      requestAnimationFrame(animate);

      controls.update();

      renderer.render(scene, camera);
    }

    window.addEventListener("resize", onWindowResize, false);

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate();
  }
}
