
import PaymentSplitter from '@/components/PaymentSplitter';
import styles from './split.module.css';
import Link from 'next/link';

export default function SplitPage() {
    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <Link href="/" className={styles.backButton}>
                    ← Volver
                </Link>
            </header>
            <main className={styles.main}>
                <PaymentSplitter />
            </main>
        </div>
    );
}
