import { ReactNode } from 'react';
import styles from './Layout.module.css';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  console.log('Layout styles:', styles); // Add this debug log
  return (
    <div className={styles.layout}>
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
};

export default Layout;