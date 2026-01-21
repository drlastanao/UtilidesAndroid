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

          <a
            className={styles.pary}
            href="/split"
          >
            <div className={styles.cardContent}>
              <h3>Repartidor de Pagos <span>-&gt;</span></h3>
              <p>Divide la cuenta entre amigos fácilmente.</p>
            </div>
          </a>

          <a
            className={styles.pary}
            href="/password"
          >
            <div className={styles.cardContent}>
              <h3>Generador de Contraseñas <span>-&gt;</span></h3>
              <p>Crea contraseñas seguras y personalizadas.</p>
            </div>
          </a>

          <a
            className={styles.pary}
            href="/hangman"
          >
            <div className={styles.cardContent}>
              <h3>Juego del Ahorcado <span>-&gt;</span></h3>
              <p>Adivina la palabra oculta antes de que sea tarde.</p>
            </div>
          </a>
        </div>
      </main>
    </div>
  );
}
