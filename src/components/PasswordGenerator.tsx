"use client";

import { useState, useEffect } from "react";
import styles from "./PasswordGenerator.module.css";

export default function PasswordGenerator() {
    const [length, setLength] = useState<number>(12);
    const [useUppercase, setUseUppercase] = useState<boolean>(true);
    const [useLowercase, setUseLowercase] = useState<boolean>(true);
    const [useSymbols, setUseSymbols] = useState<boolean>(false);
    const [password, setPassword] = useState<string>("");
    const [copied, setCopied] = useState<boolean>(false);

    const generatePassword = () => {
        let charset = "";
        if (useLowercase) charset += "abcdefghijklmnopqrstuvwxyz";
        if (useUppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        if (useSymbols) charset += "!@#$%^&*()_+~`|}{[]:;?><,./-=";

        // Fallback if nothing is selected (prevent infinite loop or empty charset)
        if (charset === "") {
            charset = "abcdefghijklmnopqrstuvwxyz";
            setUseLowercase(true);
        }

        let result = "";
        for (let i = 0; i < length; i++) {
            result += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        setPassword(result);
        setCopied(false);
    };

    // Generate on first mount
    useEffect(() => {
        generatePassword();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const copyToClipboard = async () => {
        if (!password) return;
        try {
            await navigator.clipboard.writeText(password);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy!", err);
        }
    };

    const handleLengthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = parseInt(e.target.value);
        if (isNaN(val)) val = 1;
        if (val < 1) val = 1;
        if (val > 100) val = 100; // Reasonable limit
        setLength(val);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2>Generador de Contraseñas</h2>
            </div>

            <div className={styles.passwordDisplay}>
                <div className={styles.passwordText}>{password}</div>
                <button className={styles.copyButton} onClick={copyToClipboard} title="Copiar al portapapeles">
                    {copied ? (
                        <>
                            <span>Copiado!</span>
                        </>
                    ) : (
                        <>
                            <span>Copiar</span>
                        </>
                    )}
                </button>
            </div>

            <div className={styles.controls}>
                <div className={styles.controlGroup}>
                    <label htmlFor="length">Longitud:</label>
                    <input
                        id="length"
                        type="number"
                        className={styles.input}
                        value={length}
                        onChange={handleLengthChange}
                        min="4"
                        max="64"
                    />
                </div>

                <div className={styles.controlGroup}>
                    <label htmlFor="uppercase">Mayúsculas (A-Z)</label>
                    <input
                        id="uppercase"
                        type="checkbox"
                        className={styles.checkbox}
                        checked={useUppercase}
                        onChange={(e) => setUseUppercase(e.target.checked)}
                    />
                </div>

                <div className={styles.controlGroup}>
                    <label htmlFor="lowercase">Minúsculas (a-z)</label>
                    <input
                        id="lowercase"
                        type="checkbox"
                        className={styles.checkbox}
                        checked={useLowercase}
                        onChange={(e) => setUseLowercase(e.target.checked)}
                    />
                </div>

                <div className={styles.controlGroup}>
                    <label htmlFor="symbols">Símbolos (!@#...)</label>
                    <input
                        id="symbols"
                        type="checkbox"
                        className={styles.checkbox}
                        checked={useSymbols}
                        onChange={(e) => setUseSymbols(e.target.checked)}
                    />
                </div>
            </div>

            <button className={styles.generateButton} onClick={generatePassword}>
                Generar Contraseña
            </button>
        </div>
    );
}
