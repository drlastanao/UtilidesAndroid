
import TodoApp from '@/components/TodoApp';
import styles from './tasks.module.css';
import Link from 'next/link';

export default function TasksPage() {
    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <Link href="/" className={styles.backButton}>
                    ← Volver
                </Link>
            </header>
            <main className={styles.main}>
                <TodoApp />
            </main>
        </div>
    );
}
