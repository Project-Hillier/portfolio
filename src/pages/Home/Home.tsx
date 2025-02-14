// src/pages/Home/Home.tsx
import styles from './Home.module.css';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className={styles.backgroundimage}>
      <img src="/src/assets/HeroBackground2.jpg" alt="Ryan Hillier" className={styles.backgroundimage} />
      <div className={styles.container}>
        <div className={styles.hero}>
          <h1 className={styles.title}>Ryan Hillier</h1>
          <h2 className={styles.subtitle}>Data Center Engineer</h2>
          <p className={styles.description}>
            Welcome to my portfolio! I'm passionate about crafting elegant solutions 
            to complex problems. Specializing in web development, artificial intelligence,
            and user experience design.
          </p>
          <Link to="/projects" className={styles.cta}>
            View My Work
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;