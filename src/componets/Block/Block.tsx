import styles from './Block.module.css';

export default function Block({
  children,
  borderRadius = "var(--border-radius-one)", // Domyślna wartość
}: Readonly<{
  children?: React.ReactNode;
  borderRadius?: string; // Opcjonalny prop dla borderRadius
}>) {
  return (
    <div 
      className={styles.box_shadow}
      style={{ borderRadius }}
    >
      <span
        className={styles.box_shadow_inner}
        style={{ borderRadius }}
      ></span>
      <span
        className={styles.box_shadow_outer}
        style={{ borderRadius }}
      ></span>
      {children}
    </div>
  );
};
