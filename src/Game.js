import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { createNoise3D } from "simplex-noise";
import Planet from "./Planet";
import Entity from "./Entity";
import alea from "alea";

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
    Object.values(this.entities[name]).forEach((component) => {
      this.scene.remove(component);
    });

    delete this.entities[name];
  }

  start() {
    // Create and add Camera Entity

    const cameraEntity = new Entity("camera");
    cameraEntity.addComponent(
      new THREE.PerspectiveCamera(
        70,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      ),
      "camera"
    );
    this.addEntity(cameraEntity);

    this.entities.camera.components.camera.position.z = -5;
    this.entities.camera.components.camera.lookAt(new THREE.Vector3(0, 0, 0));

    const lightEntity = new Entity("light");
    lightEntity.addComponent(new THREE.AmbientLight());
    this.addEntity(lightEntity);

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

    animate();
  }
}
