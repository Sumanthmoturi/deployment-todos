
import Link from 'next/link';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.sticker}></div>
      <h1 className={styles.heading}>Welcome to the Todo App</h1>
      <div className={styles.links}>
      <Link href="/register">Register</Link>
      <Link href="/login">Login</Link>
      </div>
      </div>
  );
}

