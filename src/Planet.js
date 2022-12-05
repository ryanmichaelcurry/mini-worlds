import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { createNoise3D } from "simplex-noise";
import alea from "alea";
import Entity from "./Entity";

// https://stackoverflow.com/questions/14224535/scaling-between-two-number-ranges
function convertRange(value, r1, r2) {
  return ((value - r1[0]) * (r2[1] - r2[0])) / (r1[1] - r1[0]) + r2[0];
}

export default class Planet extends Entity {
  constructor(
    name,
    radius,
    detail,
    seed,
    planetColor,
    oceanColor,
    seaLevelOffset,
    heightOffset
  ) {
    super(name); // name is going to be the seed of the planet
    this.radius = radius;
    this.detail = convertRange(detail, [0, 100], [4, 32]);
    this.planetColor = planetColor;
    this.oceanColor = oceanColor;
    this.seaLevelOffset = convertRange(
      seaLevelOffset,
      [0, 100],
      [0.0175, -0.05]
    );
    this.heightOffset = convertRange(heightOffset, [0, 100], [0.01, 0.2]);
    this.noise3D = createNoise3D(alea(seed));

    this.generatePlanet();
    if (seaLevelOffset != 0) {
      this.generateOcean();
    }

    console.log(this);
  }

  generatePlanet() {
    // generates icosphere
    const geometry = new THREE.IcosahedronGeometry(1, Math.floor(this.detail));

    // modify icospehre positions
    for (let i = 0; i < geometry.attributes.position.count * 3; i += 3) {
      var vertex = {
        x: geometry.attributes.position.array[i],
        y: geometry.attributes.position.array[i + 1],
        z: geometry.attributes.position.array[i + 2],
      };

      var actualNoiseValue = this.noise3D(vertex.x, vertex.y, vertex.z);
      var noiseValue = actualNoiseValue;

      /*
      var heightOffset = 0.02;
      var seaLevelOffset = 0.005;
      */

      geometry.attributes.position.array[i] *=
        1.0 + this.seaLevelOffset + noiseValue * this.heightOffset;
      geometry.attributes.position.array[i + 1] *=
        1.0 + this.seaLevelOffset + noiseValue * this.heightOffset;
      geometry.attributes.position.array[i + 2] *=
        1.0 + this.seaLevelOffset + noiseValue * this.heightOffset;
    }

    // create color attribute
    geometry.setAttribute(
      "color",
      new THREE.BufferAttribute(
        new Float32Array(geometry.attributes.position.count * 3),
        3
      )
    );

    // generate palette
    const palette = this.generatePalette(this.planetColor);

    // coloring
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

      if (centerDistance > 1 + 9 * (this.heightOffset / 10)) {
        //peaks
        geometry.attributes.color.setXYZ(
          i,
          palette[0].r,
          palette[0].g,
          palette[0].b
        );
      } else if (centerDistance > 1 + 8 * (this.heightOffset / 10)) {
        //plains
        geometry.attributes.color.setXYZ(
          i,
          palette[1].r,
          palette[1].g,
          palette[1].b
        );
      } else if (centerDistance > 1 + 7 * (this.heightOffset / 10)) {
        //plains
        geometry.attributes.color.setXYZ(
          i,
          palette[2].r,
          palette[2].g,
          palette[2].b
        );
      } else if (centerDistance > 1 + 6 * (this.heightOffset / 10)) {
        //plains
        geometry.attributes.color.setXYZ(
          i,
          palette[2].r,
          palette[2].g,
          palette[2].b
        );
      } else if (centerDistance > 1 + 5 * (this.heightOffset / 10)) {
        //plains
        geometry.attributes.color.setXYZ(
          i,
          palette[3].r,
          palette[3].g,
          palette[3].b
        );
      } else if (centerDistance > 1 + 3 * (this.heightOffset / 10)) {
        //mountians
        geometry.attributes.color.setXYZ(
          i,
          palette[4].r,
          palette[4].g,
          palette[4].b
        );
      } else if (centerDistance > 1 + 2 * (this.heightOffset / 10)) {
        //plains
        geometry.attributes.color.setXYZ(
          i,
          palette[5].r,
          palette[5].g,
          palette[5].b
        );
      } else if (centerDistance > 1 + this.heightOffset / 10) {
        // coastal
        geometry.attributes.color.setXYZ(
          i,
          palette[6].r,
          palette[6].g,
          palette[6].b
        );
      } else if (centerDistance > 1 - 2 * (this.heightOffset / 10)) {
        //plains
        geometry.attributes.color.setXYZ(
          i,
          palette[7].r,
          palette[7].g,
          palette[7].b
        );
      } else if (centerDistance > 1 - 3 * (this.heightOffset / 10)) {
        //plains
        geometry.attributes.color.setXYZ(
          i,
          palette[8].r,
          palette[8].g,
          palette[8].b
        );
      } else if (centerDistance > 1 - 4 * (this.heightOffset / 10)) {
        //plains
        geometry.attributes.color.setXYZ(
          i,
          palette[9].r,
          palette[9].g,
          palette[9].b
        );
      } else if (centerDistance > 1 - 5 * (this.heightOffset / 10)) {
        //plains
        geometry.attributes.color.setXYZ(
          i,
          palette[10].r,
          palette[10].g,
          palette[10].b
        );
      } else if (centerDistance > 1 - 6 * (this.heightOffset / 10)) {
        //plains
        geometry.attributes.color.setXYZ(
          i,
          palette[11].r,
          palette[11].g,
          palette[11].b
        );
      } else if (centerDistance > 1 - 7 * (this.heightOffset / 10)) {
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

    // finished planet mesh
    this.components.surface = new THREE.Mesh(
      geometry,
      new THREE.MeshToonMaterial({
        vertexColors: true,
      })
    );
  }

  generateOcean() {
    console.log("oceanColor", this.oceanColor);

    const waterGeometry = new THREE.IcosahedronGeometry(1, 6);
    const waterMaterial = new THREE.MeshToonMaterial({
      shininess: 100,
      transparent: 0.3,
    });
    waterMaterial.color.setRGB(
      this.oceanColor.r / 255,
      this.oceanColor.g / 255,
      this.oceanColor.b / 255
    );

    this.components.ocean = new THREE.Mesh(waterGeometry, waterMaterial);
  }

  generatePalette(color) {
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
}
