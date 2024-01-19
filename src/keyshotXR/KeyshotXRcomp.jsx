import { useEffect } from "react";

import keyshotXRConstructor from "./KeyShotXR";
import Fullscreen from "../fullscreen/Fullscreen";
import styles from "../App.module.css";
import { useWindowContext } from "../context/WindowContext";

function KeyshotXRcomp() {
  window.keyshotXRConstructor = keyshotXRConstructor;
  const { clientHeight, clientWidth } = useWindowContext();

  function requestFullscreen() {
    document.querySelector("#KeyShotXR").requestFullscreen();
  }

  useEffect(() => {
    const div = document.createElement("div");
    div.setAttribute("id", "KeyShotXR");
    document.querySelector("#root").appendChild(div);

    window.p = !0;
    window.t = null;
    window.u = !1;

    window.initKeyShotXR = initKeyShotXR;
    // window.initKeyShotXR(clientWidth * 0.9, clientHeight);
    const scale = clientWidth >= clientHeight ? 0.8 : 1;
    window.initKeyShotXR(clientWidth * scale, clientHeight);
    // window.initKeyShotXR();

    return () => {
      div.remove();
    };
  }, []);

  return (
    <div className={styles.fullscreenContainer}>
      <Fullscreen onRequestFullscreen={requestFullscreen} />
    </div>
  );
}

export default KeyshotXRcomp;

function initKeyShotXR(viewPortWidth = 3840, viewPortHeight = 2400) {
  var nameOfDiv = "KeyShotXR";
  var folderName = "gondola.0";
  // var viewPortWidth = 3840;
  // var viewPortHeight = 2400;
  var backgroundColor = "#FFFFFF";
  var uCount = 24;
  var vCount = 1;
  var uWrap = true;
  var vWrap = false;
  var uMouseSensitivity = -0.1;
  var vMouseSensitivity = 1;
  var uStartIndex = 12;
  var vStartIndex = 0;
  var minZoom = 1;
  var maxZoom = 1;
  var rotationDamping = 0.96;
  var downScaleToBrowser = true;
  var addDownScaleGUIButton = false;
  var downloadOnInteraction = false;
  var imageExtension = "png";
  var showLoading = true;
  var loadingIcon = "ks_logo.png"; // Set to empty string for default icon.
  var allowFullscreen = true; // Double-click in desktop browsers for fullscreen.
  var uReverse = false;
  var vReverse = false;
  var hotspots = {};
  var isIBooksWidget = false;

  window.keyshotXR = new window.keyshotXRConstructor(
    nameOfDiv,
    folderName,
    viewPortWidth,
    viewPortHeight,
    backgroundColor,
    uCount,
    vCount,
    uWrap,
    vWrap,
    uMouseSensitivity,
    vMouseSensitivity,
    uStartIndex,
    vStartIndex,
    minZoom,
    maxZoom,
    rotationDamping,
    downScaleToBrowser,
    addDownScaleGUIButton,
    downloadOnInteraction,
    imageExtension,
    showLoading,
    loadingIcon,
    allowFullscreen,
    uReverse,
    vReverse,
    hotspots,
    isIBooksWidget
  );
}
