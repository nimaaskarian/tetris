import * as THREE from "three";
import { RaycasterHelper } from "gsimone-three-raycaster-helper";

import * as Config from "./Config.js";

export function create(width, height) {
  const material = new THREE.MeshPhongMaterial({ color: 0xff_ff_ff });
  const geometry = new THREE.BoxGeometry();

  const object = new THREE.Group();
  object.name = "frame";
  for (let i = 0; i < width; i++) {
    const down = new THREE.Mesh(geometry, material);
    down.position.x = i;
    object.add(down);

    const up = new THREE.Mesh(geometry, material);
    up.position.x = i;
    up.position.y = height - 1;
    object.add(up);
  }

  for (let i = 0; i < height - 1; i++) {
    const left = new THREE.Mesh(geometry, material);
    left.position.y = i;
    object.add(left);

    const right = new THREE.Mesh(geometry, material);
    right.position.y = i;
    right.position.x = width - 1;
    object.add(right);
  }

  const raycasters = [];
  const helpers = [];

  for (let i = 1; i < height - 1; i++) {
    const origin = new THREE.Vector3(0, i, 0);
    const direction = new THREE.Vector3(1, 0, 0);
    const raycaster = new THREE.Raycaster(origin, direction);
    raycaster.far = width - 1;
    raycasters.push(raycaster);

    if (Config.debug) {
      const helper = new RaycasterHelper(raycaster);
      helper.update();
      helpers.push(helper);
    }
  }

  return { object, width, height, raycasters, helpers };
}
