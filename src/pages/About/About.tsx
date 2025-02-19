import { useEffect, useRef } from 'react';
import styles from './About.module.css';
import PhysicsSkills from '../../components/PhysicsWords/PhysicsSkills';

type Achievement = {
  title: string;
  description: string;
  imageUrl: string;
};

const achievements: Achievement[] = [
  {
    title: "Full Stack stack stack Development",
    description: "Developed and deployed multiple full-stack applications using React, Node.js, and PostgreSQL. Implemented responsive designs and modern UI/UX practices while ensuring cross-browser compatibility.",
    imageUrl: "/src/assets/AboutMe.jpg"
  },
  {
    title: "Full Stack Development",
    description: "Developed and deployed multiple full-stack applications using React, Node.js, and PostgreSQL. Implemented responsive designs and modern UI/UX practices while ensuring cross-browser compatibility.",
    imageUrl: "/api/placeholder/400/300"
  },
  {
    title: "Cloud Architecture",
    description: "Designed and implemented scalable cloud solutions using AWS services. Created efficient CI/CD pipelines and automated deployment processes for multiple projects.",
    imageUrl: "/api/placeholder/400/300"
  },
  {
    title: "Team Leadership",
    description: "Led a team of 5 developers in delivering a complex e-commerce platform. Implemented agile methodologies and improved team productivity by 40%.",
    imageUrl: "/api/placeholder/400/300"
  },
];

const AboutMeSection = () => {
  const observerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const arrowRef = useRef<HTMLDivElement>(null);

  // Observer for achievement blocks
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.visible);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1,
      }
    );

    observerRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      observerRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  // Separate observer for the arrow
  useEffect(() => {
    if (arrowRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              arrowRef.current?.classList.add(styles.arrowVisible);
            }
          });
        },
        { threshold: 0.1 }
      );

      observer.observe(arrowRef.current);
      return () => observer.disconnect();
    }
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>About Me</h1>
      
      <div className={styles.achievementsContainer}>
        {achievements.map((achievement, index) => (
          <div
            key={achievement.title}
            ref={(el) => {observerRefs.current[index] = el}}
            className={`${styles.achievementBlock} ${
              index % 2 !== 0 ? styles.achievementBlockReverse : ''
            }`}
          >
            <div className={styles.imageContainer}>
              <div className={styles.imageWrapper}>
                <img
                  src={achievement.imageUrl}
                  alt={achievement.title}
                  className={styles.image}
                />
                {index === 0 && (
                  <div
                    ref={arrowRef}
                    className={styles.arrow}
                  />
                )}
              </div>
            </div>
            
            <div className={styles.contentContainer}>
              <h2 className={styles.achievementTitle}>{achievement.title}</h2>
              <p className={styles.achievementDescription}>
                {achievement.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: '80px' }}/> 
      <PhysicsSkills
        skills={skills} 
        width={1500}    // Custom width
        height={800}    // Custom height
      />

    </div>
  );
};

const skills = [
  { id: '1', name: 'Java' },
  { id: '2', name: 'Python' },
  { id: '3', name: 'C#' },
  { id: '4', name: 'Circuit Development' },
  { id: '5', name: 'Website Development' },
  { id: '6', name: 'Networking Architecture' },
  { id: '7', name: 'Project Management' },
  { id: '8', name: 'Leadership' },
  { id: '9', name: 'Azure' },
  { id: '10', name: 'C' },
  { id: '11', name: 'Digital Logic' },
  { id: '12', name: 'Data Structures' },
  { id: '13', name: 'FPGA\'s' },
  { id: '14', name: 'GIT' },
  { id: '15', name: 'Virtualization' },
  { id: '16', name: 'Team Development' },
  { id: '17', name: 'GoLang' },
  { id: '18', name: 'Active Directory' },
  { id: '19', name: 'React' },
  { id: '20', name: 'TypeScript' },
  { id: '21', name: 'Docker' }
];

export default AboutMeSection;