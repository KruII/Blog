import styles from './Block.module.css';

export default function Block({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={styles.box_shadow}>
      <span className={styles.box_shadow_inner}></span>
      <span className={styles.box_shadow_outer}></span>
      {children}
    </div>
  );
};
