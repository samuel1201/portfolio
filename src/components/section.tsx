import styles from './section.module.css';

interface SectionProps {
  id?: string;
  title: string;
  bgColor: string;
  children?: React.ReactNode;
  className?: string;
}

export const Section = ({ id, title, bgColor, children, className = '' }: SectionProps) => {
  const theme: 'light' | 'dark' = bgColor.toLowerCase() === '#1d1d1d' ? 'dark' : 'light';
  return (
    <section
      id={id}
      className={`${styles.section} panel ${className}`}
      style={{ '--section-bg': bgColor } as React.CSSProperties}
      data-color={bgColor}
      data-theme={theme}
    >
      {title ? (
        <h2 className={`${styles.title} sectionTitle`}>
          {title}
          <span className={`${styles.titleLine} titleLine`}></span>
        </h2>
      ) : null}
      {children}
    </section>
  );
};
