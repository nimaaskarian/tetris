import * as THREE from "three";
import { RaycasterHelper } from "gsimone-three-raycaster-helper";

import * as Utils from "./Utils.js";
import * as Config from "./Config.js";

export const type = {
  I: Symbol("I"),
  J: Symbol("J"),
  L: Symbol("L"),
  O: Symbol("O"),
  T: Symbol("T"),
};

export function create(tetrominoType, color) {
  const raycasters = {
    all: /**     @type {THREE.Raycaster[]} */ ([]),
    up: /**      @type {THREE.Raycaster[]} */ ([]),
    down: /**    @type {THREE.Raycaster[]} */ ([]),
    left: /**    @type {THREE.Raycaster[]} */ ([]),
    right: /**   @type {THREE.Raycaster[]} */ ([]),
    helpers: /** @type {RaycasterHelper[]} */ ([]),
  };

  const addUpRaycaster = (origin) => {
    const direction = new THREE.Vector3(0, 1, 0);
    const raycaster = new THREE.Raycaster(origin.clone(), direction);
    raycaster.far = 1;
    raycasters.up.push(raycaster);
    raycasters.all.push(raycaster);
    if (Config.debug) {
      const helper = new RaycasterHelper(raycaster);
      raycasters.helpers.push(helper);
    }
  };

  const addDownRaycaster = (origin) => {
    const direction = new THREE.Vector3(0, -1, 0);
    const raycaster = new THREE.Raycaster(origin.clone(), direction);
    raycaster.far = 1;
    raycasters.down.push(raycaster);
    raycasters.all.push(raycaster);
    if (Config.debug) {
      const helper = new RaycasterHelper(raycaster);
      raycasters.helpers.push(helper);
    }
  };

  const addLeftRaycaster = (origin) => {
    const direction = new THREE.Vector3(-1, 0, 0);
    const raycaster = new THREE.Raycaster(origin.clone(), direction);
    raycaster.far = 1;
    raycasters.left.push(raycaster);
    raycasters.all.push(raycaster);
    if (Config.debug) {
      const helper = new RaycasterHelper(raycaster);
      raycasters.helpers.push(helper);
    }
  };

  const addRightRaycaster = (origin) => {
    const direction = new THREE.Vector3(1, 0, 0);
    const raycaster = new THREE.Raycaster(origin.clone(), direction);
    raycaster.far = 1;
    raycasters.right.push(raycaster);
    raycasters.all.push(raycaster);
    if (Config.debug) {
      const helper = new RaycasterHelper(raycaster);
      raycasters.helpers.push(helper);
    }
  };

  const object = new THREE.Group();
  object.name = tetrominoType.toString();

  const addCube = (position) => {
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshPhongMaterial({ color });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(position.x, position.y, position.z);
    object.add(cube);
  };

  if (tetrominoType === type.I) {
    const a = new THREE.Vector3(-1.5, -0.5);
    addUpRaycaster(a);
    addDownRaycaster(a);
    addLeftRaycaster(a);

    const b = new THREE.Vector3(-0.5, -0.5);
    addUpRaycaster(b);
    addDownRaycaster(b);

    const c = new THREE.Vector3(0.5, -0.5);
    addUpRaycaster(c);
    addDownRaycaster(c);

    const d = new THREE.Vector3(1.5, -0.5);
    addUpRaycaster(d);
    addDownRaycaster(d);
    addRightRaycaster(d);

    for (const position of [a, b, c, d]) {
      addCube(position);
    }
  } else if (tetrominoType === type.J) {
    const a = new THREE.Vector3(-1, 1);
    addUpRaycaster(a);
    addLeftRaycaster(a);
    addRightRaycaster(a);

    const b = new THREE.Vector3(-1, 0);
    addDownRaycaster(b);
    addLeftRaycaster(b);

    const c = new THREE.Vector3(0, 0);
    addUpRaycaster(c);
    addDownRaycaster(c);

    const d = new THREE.Vector3(1, 0);
    addUpRaycaster(d);
    addDownRaycaster(d);
    addRightRaycaster(d);

    for (const position of [a, b, c, d]) {
      addCube(position);
    }
  } else if (tetrominoType === type.L) {
    const a = new THREE.Vector3(1, 1);
    addUpRaycaster(a);
    addLeftRaycaster(a);
    addRightRaycaster(a);

    const b = new THREE.Vector3(-1, 0);
    addUpRaycaster(b);
    addLeftRaycaster(b);
    addDownRaycaster(b);

    const c = new THREE.Vector3(0, 0);
    addUpRaycaster(c);
    addDownRaycaster(c);

    const d = new THREE.Vector3(1, 0);
    addDownRaycaster(d);
    addRightRaycaster(d);

    for (const position of [a, b, c, d]) {
      addCube(position);
    }
  } else if (tetrominoType === type.O) {
    const a = new THREE.Vector3(-0.5, 0.5);
    addUpRaycaster(a);
    addLeftRaycaster(a);

    const b = new THREE.Vector3(0.5, 0.5);
    addUpRaycaster(b);
    addRightRaycaster(b);

    const c = new THREE.Vector3(-0.5, -0.5);
    addDownRaycaster(c);
    addLeftRaycaster(c);

    const d = new THREE.Vector3(0.5, -0.5);
    addDownRaycaster(d);
    addRightRaycaster(d);

    for (const position of [a, b, c, d]) {
      addCube(position);
    }
  } else if (tetrominoType === type.T) {
    const a = new THREE.Vector3(0, 1);
    addUpRaycaster(a);
    addLeftRaycaster(a);
    addRightRaycaster(a);

    const b = new THREE.Vector3(-1, 0);
    addUpRaycaster(b);
    addDownRaycaster(b);
    addLeftRaycaster(b);

    const c = new THREE.Vector3(0, 0);
    addDownRaycaster(c);

    const d = new THREE.Vector3(1, 0);
    addUpRaycaster(d);
    addDownRaycaster(d);
    addRightRaycaster(d);

    for (const position of [a, b, c, d]) {
      addCube(position);
    }
  } else {
    throw new Error(`Invalid tetromino type: ${tetrominoType}`);
  }

  return { object, type: tetrominoType, raycasters, moving: false };
}

/**
 * @param {ReturnType<typeof create>} tetromino
 */
export async function move(tetromino, x = 0, y = 0, z = 0) {
  if (tetromino.moving) {
    return;
  }
  tetromino.moving = true;
  try {
    for (let i = 0; i < 10; i++) {
      moveInstantly(tetromino, x / 10, y / 10, z / 10);
      await Utils.sleep(5);
    }
  } finally {
    tetromino.moving = false;
  }
}

/**
 * @param {ReturnType<typeof create>} tetromino
 */
export function moveInstantly(tetromino, x = 0, y = 0, z = 0) {
  tetromino.object.position.x += x;
  tetromino.object.position.y += y;
  tetromino.object.position.z += z;
  for (const raycaster of tetromino.raycasters.all) {
    raycaster.ray.origin.x += x;
    raycaster.ray.origin.y += y;
    raycaster.ray.origin.z += z;
  }
  for (const helper of tetromino.raycasters.helpers) {
    helper.update();
  }
}

/**
 * @param {ReturnType<typeof create>} tetromino
 * @param {THREE.Scene} scene
 */
export function downIntersection(tetromino, scene) {
  for (const raycaster of tetromino.raycasters.down) {
    const intersections = raycaster.intersectObjects(
      scene.children.filter((x) => x.type !== "GridHelper"),
    );
    if (intersections.length > 0) {
      return true;
    }
  }
  return false;
}

/**
 * @param {ReturnType<typeof create>} tetromino
 * @param {THREE.Scene} scene
 */
export function leftIntersection(tetromino, scene) {
  for (const raycaster of tetromino.raycasters.left) {
    const intersections = raycaster.intersectObjects(
      scene.children.filter((x) => x.type !== "GridHelper"),
    );
    if (intersections.length > 0) {
      return true;
    }
  }
  return false;
}

/**
 * @param {ReturnType<typeof create>} tetromino
 * @param {THREE.Scene} scene
 */
export function rightIntersection(tetromino, scene) {
  for (const raycaster of tetromino.raycasters.right) {
    const intersections = raycaster.intersectObjects(
      scene.children.filter((x) => x.type !== "GridHelper"),
    );
    if (intersections.length > 0) {
      return true;
    }
  }
  return false;
}

/**
 * @param {ReturnType<typeof create>} tetromino
 * @param {THREE.Scene} scene
 */
export async function descend(tetromino, scene) {
  if (tetromino.moving) {
    return;
  }
  tetromino.moving = true;
  try {
    while (!downIntersection(tetromino, scene)) {
      moveInstantly(tetromino, 0, -1);
      await Utils.sleep(1);
    }
  } finally {
    tetromino.moving = false;
  }
}

/**
 * @param {ReturnType<typeof create>} tetromino
 */
export async function rotate(tetromino) {
  if (tetromino.moving) {
    return;
  }
  tetromino.moving = true;

  try {
    const axis = new THREE.Vector3(0, 0, 1);
    const prevRotation = tetromino.object.rotation.z;

    for (let i = 0; i <= 9; i++) {
      const angle = (-Math.PI / 2) * 0.1;
      tetromino.object.rotateZ(angle);

      for (const raycaster of tetromino.raycasters.all) {
        raycaster.ray.direction.applyAxisAngle(axis, angle);
        raycaster.ray.origin.sub(tetromino.object.position);
        raycaster.ray.origin.applyAxisAngle(axis, angle);
        raycaster.ray.origin.add(tetromino.object.position);
      }
      for (const helper of tetromino.raycasters.helpers) {
        helper.update();
      }

      await Utils.sleep(10);
    }

    // Stop error accumulation
    let nextRotation = prevRotation - Math.PI / 2;
    if (0 >= nextRotation && nextRotation >= -Math.PI / 2) {
      nextRotation = -Math.PI / 2;
    } else if (-Math.PI / 2 >= nextRotation && nextRotation >= -Math.PI) {
      nextRotation = -Math.PI;
    } else if (-Math.PI >= nextRotation && nextRotation >= (-3 * Math.PI) / 2) {
      nextRotation = (-3 * Math.PI) / 2;
    } else {
      nextRotation = 0;
    }
    tetromino.object.rotation.set(0, 0, nextRotation);
    for (const raycaster of tetromino.raycasters.all) {
      raycaster.ray.direction.round();
    }

    const downRaycasters = tetromino.raycasters.down;
    tetromino.raycasters.down = tetromino.raycasters.right;
    tetromino.raycasters.right = tetromino.raycasters.up;
    tetromino.raycasters.up = tetromino.raycasters.left;
    tetromino.raycasters.left = downRaycasters;
  } finally {
    tetromino.moving = false;
  }
}
