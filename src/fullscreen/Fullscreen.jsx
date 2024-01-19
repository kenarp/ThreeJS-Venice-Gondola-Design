import { useWindowContext } from "../context/WindowContext";
import styles from "./Fullscreen.module.css";

function Fullscreen({ onRequestFullscreen }) {
  const { isFullscreen } = useWindowContext();

  function handleClick() {
    if (isFullscreen) {
      document.exitFullscreen();
    } else {
      onRequestFullscreen();
    }
  }

  return (
    <button onClick={handleClick} className={styles.fullscreenButton}>
      {isFullscreen ? "Exit Full Screen" : "Full Screen"}
    </button>
  );
}

export default Fullscreen;
