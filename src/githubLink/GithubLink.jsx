import styles from "./GithubLink.module.css";

function GithubLink({ url }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.githubLink}
    >
      <img
        // src="files/threeJS/github-mark.svg"
        src="/github-mark.svg"
        alt="Github Repo"
      />
      <span>Source Code</span>
    </a>
  );
}

export default GithubLink;
