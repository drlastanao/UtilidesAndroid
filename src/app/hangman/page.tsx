import HangmanGame from "@/components/HangmanGame";
import styles from "../page.module.css";
// reusing page.module.css for layout structure if needed, or just specific styles

export default function HangmanPage() {
    return (
        <div style={{ padding: '2rem', minHeight: '100vh', background: '#0a0a0a' }}>
            <a href="/" style={{ color: '#888', textDecoration: 'none', marginBottom: '2rem', display: 'inline-block' }}>
                ← Volver al inicio
            </a>
            <HangmanGame />
        </div>
    );
}
