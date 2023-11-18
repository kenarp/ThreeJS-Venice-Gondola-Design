import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { GroundProjectedSkybox } from "three/addons/objects/GroundProjectedSkybox.js";
import { useEffect, useRef, useState } from "react";
import { useWindowContext } from "../context/WindowContext";
import styles from "./ThreeRendering.module.css";
import { EXRLoader } from "three/addons/loaders/EXRLoader.js";
// import * as dat from "lil-gui";

// import { RGBELoader } from "three/addons/loaders/RGBELoader.js";
// import * as dat from "lil-gui";

/**
 * Loaders
 */
// const hdrLoader = new RGBELoader();
const gltfLoader = new GLTFLoader();
const exrLoader = new EXRLoader();
const textureLoader = new THREE.TextureLoader();

/**
 * Base
 */
// Debug
// const gui = new dat.GUI();
const global = {};

// Create a scene
const scene = new THREE.Scene();

/**
 * Global intensity
 */
global.envMapIntensity = 0.7;
// gui
//   .add(global, "envMapIntensity")
//   .min(0)
//   .max(1)
//   .step(0.01)
//   .onChange(updateAllMaterials);

//Update all materials
function updateAllMaterials() {
  scene.traverse((child) => {
    if (child.isMesh && child.material.isMeshStandardMaterial) {
      child.material.envMapIntensity = global.envMapIntensity;
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
}

/**
 * Environment map
 */
// scene.backgroundBlurriness = 0;
// scene.backgroundIntensity = 1;

// gui.add(scene, "backgroundBlurriness").min(0).max(1).step(0.001);
// gui.add(scene, "backgroundIntensity").min(0).max(10).step(0.01);

// LDR equirectanglar background
const backgroundMap = textureLoader.load(
  "/environmentMaps/venice_equirectangular.png"
);
// environmentMap.mapping = THREE.EquirectangularReflectionMapping;
backgroundMap.colorSpace = THREE.SRGBColorSpace;
backgroundMap.generateMipmaps = false;
// scene.background = environmentMap;
// scene.environment = backgroundMap;
// Ground projected skybox
const skybox = new GroundProjectedSkybox(backgroundMap);
skybox.scale.setScalar(20);
scene.add(skybox);

//Compressed EXR equirectanglar environment map
exrLoader.load(
  "environmentMaps/hdri-exr_venice_compressed.exr",
  // "environmentMaps/hdri-exr_venice.exr"
  (envMap) => {
    envMap.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = envMap;
  }
);

/**
 * Models
 */
gltfLoader.load(
  "/models/gondola_paint.glb",
  // "/models/gondola_glass.glb",
  // "/models/gondola_wood.glb",
  (gltf) => {
    // gltf.scene.scale.set(1, 1, 1);
    // gltf.scene.position.z = 8;
    // for (const child of gltf.scene.children) {
    //   console.log(child);
    // }
    scene.add(gltf.scene);
    updateAllMaterials();
  }
);

/* Camera
 */
const camera = new THREE.PerspectiveCamera(
  75, // perspective
  document.documentElement.clientWidth / document.documentElement.clientHeight, //width-height ratio
  0.1, //near face
  500 //far face
);
// set the position of camera
camera.position.x = 11; //Red line for x axis
camera.position.z = 0; //Blue line for z axis
camera.position.y = 5; //Green line for y axis

/* Directional light
 */
const directionalLight = new THREE.DirectionalLight("#ffffff", 5);
directionalLight.position.set(0, 12, -10);
directionalLight.castShadow = true;

// gui
//   .add(directionalLight, "intensity")
//   .min(0)
//   .max(15)
//   .step(0.001)
//   .name("lightIntensity");
// gui
//   .add(directionalLight.position, "x")
//   .min(-3)
//   .max(3)
//   .step(0.001)
//   .name("lightX");
// gui
//   .add(directionalLight.position, "y")
//   .min(0)
//   .max(50)
//   .step(0.001)
//   .name("lightY");
// gui
//   .add(directionalLight.position, "z")
//   .min(-10)
//   .max(0)
//   .step(0.001)
//   .name("lightZ");
// Helper
directionalLight.target.position.set(0, 2, 2);
directionalLight.shadow.camera.far = 21;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.target.updateWorldMatrix();
scene.add(directionalLight);
// const directionalLightCameraHelper = new THREE.CameraHelper(
//   directionalLight.shadow.camera
// );
// scene.add(directionalLightCameraHelper);
directionalLight.shadow.normalBias = 0.027;
directionalLight.shadow.bias = -0.004;
/* Renderer*/
const renderer = new THREE.WebGLRenderer({
  alpha: false,
  antialias: true,
});
renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.toneMappingExposure = 2;
// Shadows
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
directionalLight.castShadow = true;

// Add world AxesHelper
// const axesHelper = new THREE.AxesHelper(500);
// scene.add(axesHelper);

//Add OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
//Set resistance
controls.enableDamping = true;
// controls.dampingFactor = 0.05;//Damping factor
controls.target.y = 4;
controls.rotateSpeed = 0.4;
controls.maxDistance = 10;
controls.minDistance = 5;
controls.maxPolarAngle = THREE.MathUtils.degToRad(110); //Math.PI / 2;
controls.enablePan = false;
// controls.screenSpacePanning = true;

//Render Function
function animate() {
  controls.update();
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

/**
 * React component
 */
function ThreeRendering() {
  const [fullScreen, setFullScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { clientHeight, clientWidth } = useWindowContext();
  const rendererCanvas = useRef(null);

  function handleClick() {
    // fullScreen ? document.exitFullscreen() : document.body.requestFullscreen();
    // console.log("clicked");
    fullScreen
      ? document.exitFullscreen()
      : rendererCanvas.current.requestFullscreen();
    setFullScreen(!fullScreen);
  }

  useEffect(() => {
    // Default Laoding Manager
    THREE.DefaultLoadingManager.onLoad = function () {
      // console.log("Loading Complete!");
      setIsLoading(false);
    };
    camera.updateProjectionMatrix();
    rendererCanvas.current.appendChild(renderer.domElement);
    animate();
    updateAllMaterials();
  }, []);

  useEffect(() => {
    renderer.setSize(clientWidth, clientHeight);
    camera.aspect = clientWidth / clientHeight;
    camera.updateProjectionMatrix();
  }, [clientWidth, clientHeight]);

  return (
    <>
      {isLoading && <div className={styles.loader}>Is Loading...</div>}
      <div className={styles.three} ref={rendererCanvas}>
        <button onClick={handleClick}>
          {fullScreen ? "Exit Full Screen" : "Full Screen"}
        </button>
        {fullScreen ? null : (
          <a
            href="https://github.com/kenarp/ThreeJS-Venice-Gondola-Design"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="/github-mark.svg" alt="Github Repo" />
          </a>
        )}
      </div>
    </>
  );
}

export default ThreeRendering;
