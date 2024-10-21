import Link from 'next/link';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <h1>Welcome to the Todo App</h1>
      <div className={styles.links}>
        <Link href="/register">Register</Link>
        <Link href="/login">Login</Link>
        <Link href="/todos/create">Create Todo</Link>
        <Link href="/todos">List Todos</Link>
      </div>
    </div>
  );
}
