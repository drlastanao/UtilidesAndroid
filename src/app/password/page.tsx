import PasswordGenerator from "../../components/PasswordGenerator";
import styles from "../page.module.css";
import Link from 'next/link';

export default function PasswordPage() {
    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <Link href="/" className={styles.backLink}>
                    ← Volver
                </Link>
            </header>
            <main className={styles.main}>
                <PasswordGenerator />
            </main>
        </div>
    );
}
