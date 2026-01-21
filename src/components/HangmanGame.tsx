"use client";

import { useState, useEffect, useCallback } from "react";
import styles from "./HangmanGame.module.css";

const WORDS = [
    "COMPUTADORA", "PROGRAMACION", "TECLADO", "PANTALLA", "INTERNET",
    "APLICACION", "DESARROLLO", "SISTEMA", "CODIGO", "NAVEGADOR",
    "TELEFONO", "USUARIO", "SERVIDOR", "DATOS", "ALGORITMO",
    "VARIABLE", "FUNCION", "BUCLE", "OBJETO", "CLASE",
    "ARCHIVO", "CARPETA", "MEMORIA", "PROCESADOR", "DISCO",
    "INTELIGENCIA", "ARTIFICIAL", "ROBOTICA", "SEGURIDAD", "ENCRIPTACION",
    "LENGUAJE", "COMPILADOR", "INTERPRETE", "EJECUCION", "BINARIO"
];

const MAX_FAILURES = 5;

export default function HangmanGame() {
    const [targetWord, setTargetWord] = useState("");
    const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set());
    const [failures, setFailures] = useState(0);
    const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost' | 'surrendered'>('playing');

    const startNewGame = useCallback(() => {
        const randomWord = WORDS[Math.floor(Math.random() * WORDS.length)];
        setTargetWord(randomWord);
        setGuessedLetters(new Set());
        setFailures(0);
        setGameStatus('playing');
    }, []);

    useEffect(() => {
        startNewGame();
    }, [startNewGame]);

    const handleGuess = (letter: string) => {
        if (gameStatus !== 'playing' || guessedLetters.has(letter)) return;

        const newGuessed = new Set(guessedLetters);
        newGuessed.add(letter);
        setGuessedLetters(newGuessed);

        if (!targetWord.includes(letter)) {
            const newFailures = failures + 1;
            setFailures(newFailures);
            if (newFailures >= MAX_FAILURES) {
                setGameStatus('lost');
            }
        } else {
            const isWon = targetWord.split('').every(char => newGuessed.has(char));
            if (isWon) {
                setGameStatus('won');
            }
        }
    };

    const handleSurrender = () => {
        setGameStatus('surrendered');
    };

    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2>Juego del Ahorcado</h2>
            </div>

            <div className={styles.displayArea}>
                <div className={styles.hangmanDrawing}>
                    {/* Simple text representation of failures */}
                    Fallos: {failures} / {MAX_FAILURES}
                </div>

                <div className={styles.wordDisplay}>
                    {targetWord.split("").map((letter, index) => {
                        const isRevealed = guessedLetters.has(letter) || gameStatus !== 'playing';
                        const isMissed = gameStatus === 'lost' || gameStatus === 'surrendered';

                        return (
                            <div
                                key={index}
                                className={`${styles.letterSlot} ${isRevealed ? styles.revealed : ''} ${isMissed && !guessedLetters.has(letter) ? styles.missed : ''}`}
                            >
                                {isRevealed ? letter : ""}
                            </div>
                        );
                    })}
                </div>

                <div className={styles.statusMessage}>
                    {gameStatus === 'won' && <span className={styles.win}>¡Ganaste!</span>}
                    {gameStatus === 'lost' && <span className={styles.lose}>Has perdido. La palabra era: {targetWord}</span>}
                    {gameStatus === 'surrendered' && <span className={styles.lose}>Te rendiste. La palabra era: {targetWord}</span>}
                    {gameStatus === 'playing' && <span>Elige una letra</span>}
                </div>
            </div>

            <div className={styles.keyboard}>
                {alphabet.map((letter) => {
                    const isGuessed = guessedLetters.has(letter);
                    const isCorrect = targetWord.includes(letter);

                    let className = styles.key;
                    if (isGuessed) {
                        className += ` ${isCorrect ? styles.correct : styles.wrong}`;
                    }

                    return (
                        <button
                            key={letter}
                            className={className}
                            onClick={() => handleGuess(letter)}
                            disabled={isGuessed || gameStatus !== 'playing'}
                        >
                            {letter}
                        </button>
                    );
                })}
            </div>

            <div className={styles.controls}>
                {gameStatus === 'playing' ? (
                    <button className={`${styles.button} ${styles.surrenderBtn}`} onClick={handleSurrender}>
                        Rendirse
                    </button>
                ) : (
                    <button className={`${styles.button} ${styles.resetBtn}`} onClick={startNewGame}>
                        Jugar de nuevo
                    </button>
                )}
            </div>
        </div>
    );
}
