import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { GroundProjectedSkybox } from "three/addons/objects/GroundProjectedSkybox.js";
import { Fragment, useEffect, useRef, useState } from "react";
import { useWindowContext } from "../context/WindowContext";
import { EXRLoader } from "three/addons/loaders/EXRLoader.js";
import Fullscreen from "../fullscreen/Fullscreen";

import styles from "./ThreeRendering.module.css";
import appStyles from "../App.module.css";
// import * as dat from "lil-gui";
// import { RGBELoader } from "three/addons/loaders/RGBELoader.js";

let controls, renderer, scene, camera, directionalLight;
const global = {};
//Update all materials
function updateAllMaterials(scene) {
  scene.traverse((child) => {
    if (child.isMesh && child.material.isMeshStandardMaterial) {
      child.material.envMapIntensity = global.envMapIntensity;
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
}

function initialization() {
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
  // const global = {};

  // Create a scene
  scene = new THREE.Scene();

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
    // "files/threeJS/environmentMaps/venice_equirectangular.png"
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
    // "files/threeJS/environmentMaps/hdri-exr_venice_compressed.exr",
    "/environmentMaps/hdri-exr_venice_compressed.exr",
    (envMap) => {
      envMap.mapping = THREE.EquirectangularReflectionMapping;
      scene.environment = envMap;
    }
  );

  /**
   * Models
   */
  const wireframeMaterial = new THREE.MeshStandardMaterial({
    // wireframe: true,
    color: "#dddddd",
  });
  gltfLoader.load(
    // "files/threeJS/models/gondola_lowPoly.glb",
    "/models/gondola_lowPoly.glb",
    // "/models/gondola_wireframe.glb",
    // "/models/gondola_glass.glb",
    // "/models/gondola_wood.glb",
    (gltf) => {
      // gltf.scene.scale.set(0.1, 0.1, 0.1);
      // gltf.scene.position.z = 8;
      gltf.scene.traverse((obj) => {
        if (obj.isMesh) {
          // console.log(obj.material);
          obj.material = wireframeMaterial;
        }
      });
      scene.add(gltf.scene);
      updateAllMaterials(scene);
    }
  );

  /* Camera
   */
  camera = new THREE.PerspectiveCamera(
    75, // perspective
    document.documentElement.clientWidth /
      document.documentElement.clientHeight, //width-height ratio
    0.1, //near face
    500 //far face
  );
  // set the position of camera
  camera.position.x = 11; //Red line for x axis
  camera.position.z = 0; //Blue line for z axis
  camera.position.y = 5; //Green line for y axis

  /* Directional light
   */
  directionalLight = new THREE.DirectionalLight("#ffffff", 5);
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
}

/**
 * React component
 */
function ThreeRendering() {
  const [isLoading, setIsLoading] = useState(false);
  const { clientHeight, clientWidth, isFullscreen } = useWindowContext();
  const scale = isFullscreen ? 1 : 0.9;
  const rendererCanvas = useRef(null);

  function requestFullscreen() {
    rendererCanvas.current.requestFullscreen();
  }

  useEffect(() => {
    if (renderer) {
      // console.log(renderer);
      return;
    }

    THREE.DefaultLoadingManager.onStart = function () {
      // console.log("Start Loading");
      setIsLoading(true);
    };

    initialization();

    /* Renderer*/
    renderer = new THREE.WebGLRenderer({
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
    controls = new OrbitControls(camera, renderer.domElement);
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
  }, []);

  useEffect(() => {
    THREE.DefaultLoadingManager.onLoad = function () {
      // console.log("Loading Complete!");
      setIsLoading(false);
    };

    //Render Function
    function animate() {
      controls.update();
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }

    camera.updateProjectionMatrix();
    rendererCanvas.current.appendChild(renderer.domElement);
    animate();
    updateAllMaterials(scene);
  }, []);

  useEffect(() => {
    renderer.setSize(
      clientWidth <= clientHeight ? clientWidth : clientWidth * scale,
      clientHeight * scale
    );

    let renderSize = new THREE.Vector2();
    renderer.getSize(renderSize);
    camera.aspect = renderSize.width / renderSize.height;
    camera.updateProjectionMatrix();
  }, [clientWidth, clientHeight, scale]);

  return (
    <>
      <div className={appStyles.fullscreenContainer}>
        <Fullscreen onRequestFullscreen={requestFullscreen}></Fullscreen>
      </div>
      <div className={styles.three}>
        {isLoading && <div className={styles.loader}>Loading...</div>}
        <div className={styles.threeContainer} ref={rendererCanvas}></div>
      </div>
    </>
  );
}

export default ThreeRendering;
