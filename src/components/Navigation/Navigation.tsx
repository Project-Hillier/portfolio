import { Link, useLocation } from 'react-router-dom';
import styles from './Navigation.module.css';

const Navigation = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path ? styles.active : '';
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          Hillier
        </Link>
        <div className={styles.navLinks}>
          <Link to="/about" className={`${styles.link} ${isActive('/about')}`}>
            About
          </Link>
          <Link to="/projects" className={`${styles.link} ${isActive('/projects')}`}>
            Projects
          </Link>
          <Link to="/resume" className={`${styles.link} ${isActive('/resume')}`}>
            Resume
          </Link>
          <Link to="/contact" className={`${styles.link} ${isActive('/contact')}`}>
            Contact
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;