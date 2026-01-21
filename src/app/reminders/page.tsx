import AppointmentReminder from '@/components/AppointmentReminder';
import styles from './reminders.module.css';
import Link from 'next/link';

export default function RemindersPage() {
    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <Link href="/" className={styles.backButton}>
                    ← Volver
                </Link>
            </header>
            <main className={styles.main}>
                <AppointmentReminder />
            </main>
        </div>
    );
}
