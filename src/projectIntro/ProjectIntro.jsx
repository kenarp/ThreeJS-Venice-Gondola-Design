import { useState } from "react";
import styles from "./ProjectIntro.module.css";

function ProjectIntro({ children }) {
  const [isHover, setIsHover] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  return (
    <>
      <button
        className={
          isHover || isClicked
            ? `${styles.button} ${styles.buttonActive}`
            : styles.button
        }
        onMouseOver={() => {
          setIsHover(true);
        }}
        onMouseLeave={() => {
          setIsHover(false);
        }}
        onClick={() => {
          setIsClicked(true);
        }}
      >
        About this Project
      </button>
      <article
        className={
          isHover || isClicked
            ? `${styles.intro} ${styles.introActive}`
            : styles.intro
        }
      >
        {isClicked && (
          <button
            onClick={() => {
              setIsClicked(false);
            }}
          >
            &times;
          </button>
        )}
        {children}
      </article>
    </>
  );
}

export default ProjectIntro;
