import * as THREE from "three";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

import * as Utils from "./lib/Utils.js";
import * as Tetromino from "./lib/Tetromino.js";
import * as Frame from "./lib/Frame.js";
import * as Config from "./lib/Config.js";

async function main() {
  const canvas = document.querySelector("#c");
  const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });

  const frame = Frame.create(Config.frameWidth, Config.frameHeight);

  const camera = createCamera(frame);

  const scene = new THREE.Scene();
  scene.add(frame.object);
  for (const helper of frame.helpers) {
    scene.add(helper);
  }

  const controls = new OrbitControls(camera, canvas);
  controls.target = new THREE.Vector3(frame.width / 2, frame.height / 2, 0);
  controls.update();

  addLight(scene);

  if (Config.debug) {
    addGridHelper(scene);
  }

  renderer.render(scene, camera);

  const frameRequestCallback = createFrameRequestCallback(
    renderer,
    camera,
    scene,
  );
  requestAnimationFrame(frameRequestCallback);

  const state = {
    tetromino: null,
    keydownEventListener: null,
  };

  state.tetromino = addRandomTetromino(frame);
  state.keydownEventListener = createKeydownEventListener(
    state.tetromino,
    scene,
  );
  document.addEventListener("keydown", state.keydownEventListener);

  for (;;) {
    const start = Date.now();

    const tetrominoObjects = frame.object.children.filter(
      (x) => x.type === "Group",
    );
    if (Tetromino.downIntersection(state.tetromino, scene)) {
      document.removeEventListener("keydown", state.keydownEventListener);

      const deletedRows = [];
      for (let i = 0; i < frame.raycasters.length; i++) {
        const raycaster = frame.raycasters[i];

        const intersections = raycaster.intersectObjects(tetrominoObjects);
        const intersectedObjects = Utils.filterDuplicates(
          intersections.map((x) => x.object),
        );

        if (intersectedObjects.length >= frame.width - 2) {
          for (const object of intersectedObjects) {
            object.removeFromParent();
          }
          deletedRows.push(i + 1);
        }
      }
      for (const deletedRow of deletedRows) {
        const floatingTCubes = [];
        for (let i = deletedRow; i < frame.raycasters.length; i++) {
          const raycaster = frame.raycasters[i];

          const intersections = raycaster.intersectObjects(tetrominoObjects);
          floatingTCubes.push(
            ...intersections
              .map((x) => x.object)
              .filter((x) => x.type === "Mesh"),
          );
        }
        for (let i = 0; i < 10; i++) {
          for (const object of Utils.filterDuplicates(floatingTCubes)) {
            scene.attach(object);
            object.position.y -= 0.1;
          }
          await Utils.sleep(5);
        }
      }

      state.tetromino = addRandomTetromino(frame);
      if (Tetromino.downIntersection(state.tetromino, scene)) {
        return;
      }

      state.keydownEventListener = createKeydownEventListener(
        state.tetromino,
        scene,
      );
      document.addEventListener("keydown", state.keydownEventListener);
    } else {
      await Tetromino.move(state.tetromino, 0, -1);
    }

    const end = Date.now();
    const offset = end - start;
    await Utils.sleep(1_000 - offset);
  }
}

function createKeydownEventListener(tetromino, scene) {
  return async function keydownEventListener(event) {
    if (["ArrowUp", "k", "w"].includes(event.key)) {
      await Tetromino.rotate(tetromino);
    } else if (["ArrowLeft", "h", "a"].includes(event.key)) {
      if (!Tetromino.leftIntersection(tetromino, scene)) {
        await Tetromino.move(tetromino, -1);
      }
    } else if (["ArrowRight", "l", "d"].includes(event.key)) {
      if (!Tetromino.rightIntersection(tetromino, scene)) {
        await Tetromino.move(tetromino, +1);
      }
    } else if (["ArrowDown", "j", "s"].includes(event.key)) {
      if (!Tetromino.downIntersection(tetromino, scene)) {
        await Tetromino.move(tetromino, 0, -1);
      }
    } else if (event.key === " ") {
      await Tetromino.descend(tetromino, scene);
    }
  };
}

function resizeRendererToDisplaySize(renderer) {
  const canvas = renderer.domElement;
  const needResize =
    canvas.width !== canvas.clientWidth ||
    canvas.height !== canvas.clientHeight;
  if (needResize) {
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
  }
  return needResize;
}

function createFrameRequestCallback(renderer, camera, scene) {
  return function frameRequestCallback(time) {
    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    renderer.render(scene, camera);

    requestAnimationFrame(frameRequestCallback);
  };
}

/**
 * @param {ReturnType<typeof Frame.create>} frame
 */
function addRandomTetromino(frame) {
  const type = Utils.getRandomElement(Object.values(Tetromino.type));
  const color = Utils.getRandomElement(["red", "green", "blue", "yellow"]);
  const tetromino = Tetromino.create(type, color);

  let xOffset = 0;
  let yOffset = 0;

  if (tetromino.type === Tetromino.type.I) {
    xOffset = Math.floor(frame.width / 2) - 0.5;
    yOffset = frame.height - 1.5;
  } else if (tetromino.type === Tetromino.type.J) {
    xOffset = Math.floor(frame.width / 2) - 1;
    yOffset = frame.height - 3;
  } else if (tetromino.type === Tetromino.type.L) {
    xOffset = Math.floor(frame.width / 2) - 1;
    yOffset = frame.height - 3;
  } else if (tetromino.type === Tetromino.type.O) {
    xOffset = Math.floor(frame.width / 2) - 0.5;
    yOffset = frame.height - 2.5;
  } else if (tetromino.type === Tetromino.type.T) {
    xOffset = Math.floor(frame.width / 2) - 1;
    yOffset = frame.height - 3;
  }
  Tetromino.moveInstantly(tetromino, xOffset, yOffset);

  frame.object.add(tetromino.object);
  for (const helper of tetromino.raycasters.helpers) {
    frame.object.add(helper);
  }

  return tetromino;
}

/**
 * @param {ReturnType<typeof Frame.create>} frame
 */
function createCamera(frame) {
  const fov = 75;
  const aspect = 2;
  const near = 0.1;
  const far = 50;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(frame.width / 2, frame.height / 2, 20);
  camera.lookAt(new THREE.Vector3(frame.width / 2, frame.height / 2, 0));
  return camera;
}

function addGridHelper(scene) {
  const size = 100;
  const divisions = 100;
  const gridHelper = new THREE.GridHelper(size, divisions);
  gridHelper.rotateX(Math.PI / 2);
  gridHelper.position.x += 0.5;
  gridHelper.position.y += 0.5;

  scene.add(gridHelper);
}

function addLight(scene) {
  const color = 0xffffff;
  const intensity = 3;
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(20, 30, 10);
  scene.add(light);
  if (Config.debug) {
    const helper = new THREE.DirectionalLightHelper(light);
    scene.add(helper);
  }
}

await main();
