import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.intro}>
          <h1>Utilidades Android</h1>
          <p>
            Selecciona una herramienta para comenzar.
          </p>
        </div>

        <div className={styles.ctas}>
          <a
            className={styles.pary}
            href="/tasks"
          >
            <div className={styles.cardContent}>
              <h3>Gestor de Tareas <span>-&gt;</span></h3>
              <p>Organiza tu día con este simple gestor de tareas.</p>
            </div>
          </a>
        </div>
      </main>
    </div>
  );
}
