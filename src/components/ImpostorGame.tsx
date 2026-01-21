"use client";

import React, { useState } from 'react';
import { useImpostorGame } from '../hooks/useImpostorGame';
import styles from './ImpostorGame.module.css';

export const ImpostorGame: React.FC = () => {
    const {
        roomId,
        roomState,
        myPlayer,
        error,
        createRoom,
        joinRoom,
        startGame,
        leaveRoom
    } = useImpostorGame();

    const [name, setName] = useState('');
    const [joinCode, setJoinCode] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [isJoining, setIsJoining] = useState(false);

    const handleCreate = () => {
        if (!name) return;
        createRoom(name);
    };

    const handleJoin = () => {
        if (!name || !joinCode) return;
        joinRoom(joinCode.toUpperCase(), name);
    };

    const copyCode = () => {
        if (roomId) {
            navigator.clipboard.writeText(roomId);
            alert('¡Código copiado!');
        }
    };

    // 1. Home Screen
    if (!roomId) {
        return (
            <div className={styles.container}>
                <div className={styles.card}>
                    <h1 className={styles.title}>EL IMPOSTOR</h1>
                    <p className={styles.subtitle}>¿Quién dice la verdad?</p>

                    {!isCreating && !isJoining ? (
                        <div className={styles.buttonGroup}>
                            <button
                                className={styles.primaryButton}
                                onClick={() => setIsCreating(true)}
                            >
                                Crear Sala
                            </button>
                            <button
                                className={styles.secondaryButton}
                                onClick={() => setIsJoining(true)}
                            >
                                Unirse a Sala
                            </button>
                        </div>
                    ) : (
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Tu Nombre</label>
                            <input
                                className={styles.input}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Nombre de jugador"
                            />

                            {isJoining && (
                                <>
                                    <label className={styles.label} style={{ marginTop: '1rem' }}>Código de Sala</label>
                                    <input
                                        className={styles.input}
                                        value={joinCode}
                                        onChange={(e) => setJoinCode(e.target.value)}
                                        placeholder="ABCDEF"
                                    />
                                </>
                            )}

                            {error && <p className={styles.error}>{error}</p>}

                            <div className={styles.buttonGroup} style={{ marginTop: '1.5rem' }}>
                                <button
                                    className={styles.primaryButton}
                                    onClick={isCreating ? handleCreate : handleJoin}
                                >
                                    {isCreating ? 'Empezar' : 'Unirse'}
                                </button>
                                <button
                                    className={styles.secondaryButton}
                                    onClick={() => { setIsCreating(false); setIsJoining(false); }}
                                >
                                    Atrás
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // 2. Lobby Screen
    if (roomState?.status === 'LOBBY') {
        return (
            <div className={styles.container}>
                <div className={styles.card}>
                    <h2 className={styles.subtitle}>SALA DE ESPERA</h2>
                    <div className={styles.roomCodeContainer}>
                        <div>
                            <span className={styles.label}>Código</span>
                            <div className={styles.roomCode}>{roomId}</div>
                        </div>
                        <button className={styles.copyButton} onClick={copyCode}>Copiar</button>
                    </div>

                    <div className={styles.playerList}>
                        <span className={styles.label}>Jugadores ({roomState.players.length})</span>
                        {roomState.players.map(p => (
                            <div key={p.id} className={styles.playerItem}>
                                <span>{p.name} {p.id === myPlayer?.id && '(Tú)'}</span>
                                {p.isHost && <span className={styles.hostBadge}>HOST</span>}
                            </div>
                        ))}
                    </div>

                    <div className={styles.buttonGroup}>
                        {myPlayer?.isHost ? (
                            <button
                                className={styles.primaryButton}
                                onClick={startGame}
                                disabled={roomState.players.length < 3}
                            >
                                {roomState.players.length < 3 ? 'Esperando jugadores (mín. 3)' : 'Iniciar Juego'}
                            </button>
                        ) : (
                            <p className={styles.subtitle}>Esperando al host...</p>
                        )}
                        <button className={styles.secondaryButton} onClick={leaveRoom}>
                            Salir
                        </button>
                    </div>

                    {myPlayer?.isHost && (
                        <p className={styles.label} style={{ marginTop: '1rem' }}>
                            Comparte el código con tus amigos para que se unan.
                        </p>
                    )}
                </div>
            </div>
        );
    }

    // 3. Game Screen
    if (roomState?.status === 'PLAYING') {
        const isImpostor = myPlayer?.role === 'IMPOSTOR';

        return (
            <div className={styles.container}>
                <div className={styles.card}>
                    <div className={`${styles.roleCard} ${isImpostor ? styles.roleImpostor : styles.roleCitizen}`}>
                        <h3 className={styles.roleTitle}>Tu Juego</h3>
                        {isImpostor ? (
                            <>
                                <div className={styles.impostorText}>ERES EL IMPOSTOR</div>
                                <p className={styles.subtitle}>No conoces la palabra. ¡Invéntatela!</p>
                            </>
                        ) : (
                            <>
                                <div className={styles.citizenText}>ERES UN CIUDADANO</div>
                                <div className={styles.wordBox}>{roomState.secretWord}</div>
                                <p className={styles.subtitle}>Detecta al impostor antes de que gane.</p>
                            </>
                        )}
                    </div>

                    <div className={styles.buttonGroup}>
                        <button className={styles.secondaryButton} onClick={leaveRoom}>
                            Finalizar Juego
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return null;
};
