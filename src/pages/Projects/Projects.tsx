import { Link } from 'react-router-dom';
import styles from './Projects.module.css';

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
}

const projects: Project[] = [
  // Add your projects here
  {
    id: 1,
    title: "Project 1",
    description: "Description for Project 1",
    image: "src/assets/1.webp"
  },

  {
    id: 2,
    title: "Project 1",
    description: "Description for Project 1",
    image: "src/assets/2.jpg"
  },

  {
    id: 3,
    title: "Project 1",
    description: "Description for Project 1",
    image: "src/assets/3.jpg"
  },

  {
    id: 4,
    title: "Project 1",
    description: "Description for Project 1",
    image: "src/assets/4.jpg"
  },



];

const Projects = () => {
  return (
    <div className={styles.grid}>
      {projects.map((project) => (
        <Link
          key={project.id}
          to={`/projects/${project.id}`}
          className={styles.card}
        >
          <img
            src={project.image}
            alt={project.title}
            className={styles.cardImage}
          />
          <div className={styles.cardContent}>
            <h3 className={styles.cardTitle}>{project.title}</h3>
            <p className={styles.cardDescription}>{project.description}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Projects;