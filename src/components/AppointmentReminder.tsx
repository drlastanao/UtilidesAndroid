'use client';

import { useState, useEffect } from 'react';
import styles from './AppointmentReminder.module.css';

interface Appointment {
    id: string;
    date: string; // YYYY-MM-DD
    title: string;
    description: string;
}

export default function AppointmentReminder() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [showAll, setShowAll] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    const today = new Date().toISOString().split('T')[0];

    // Load from LocalStorage and cleanup on mount
    useEffect(() => {
        const saved = localStorage.getItem('appointments');
        let currentAppointments: Appointment[] = [];

        if (saved) {
            try {
                currentAppointments = JSON.parse(saved);
            } catch (e) {
                console.error('Failed to parse appointments', e);
            }
        }

        const expiredCount = currentAppointments.filter(app => app.date < today).length;

        if (expiredCount > 0) {
            const pastTasks = currentAppointments
                .filter(app => app.date < today)
                .map(app => `• ${app.title} (${app.date})`)
                .join('\n');

            alert(`Se han eliminado ${expiredCount} citas pasadas:\n${pastTasks}`);

            currentAppointments = currentAppointments.filter(app => app.date >= today);
            localStorage.setItem('appointments', JSON.stringify(currentAppointments));
        }

        setAppointments(currentAppointments);
        setIsLoaded(true);
    }, [today]);

    // Save to LocalStorage whenever appointments change
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('appointments', JSON.stringify(appointments));
        }
    }, [appointments, isLoaded]);

    const addAppointment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !selectedDate) return;

        const newApp: Appointment = {
            id: crypto.randomUUID(),
            date: selectedDate,
            title: title.trim(),
            description: description.trim(),
        };

        const updated = [...appointments, newApp].sort((a, b) => a.date.localeCompare(b.date));
        setAppointments(updated);
        setTitle('');
        setDescription('');
    };

    const deleteAppointment = (id: string) => {
        setAppointments(appointments.filter(app => app.id !== id));
    };

    if (!isLoaded) return null;

    const filteredAppointments = showAll
        ? appointments
        : appointments.filter(app => app.date === selectedDate);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Mis Citas</h1>

            <form onSubmit={addAppointment} className={styles.controls}>
                <div className={styles.inputGroup}>
                    <label htmlFor="date">Fecha</label>
                    <input
                        id="date"
                        type="date"
                        min={today}
                        className={styles.input}
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        required
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label htmlFor="title">Título</label>
                    <input
                        id="title"
                        type="text"
                        placeholder="Médico, Reunión..."
                        className={styles.input}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label htmlFor="description">Descripción (Opcional)</label>
                    <textarea
                        id="description"
                        placeholder="Detalles de la cita..."
                        className={styles.textarea}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                <div className={styles.actions}>
                    <button type="submit" className={styles.addButton}>
                        Añadir Cita
                    </button>
                    <button
                        type="button"
                        className={`${styles.viewAllButton} ${showAll ? styles.active : ''}`}
                        onClick={() => setShowAll(!showAll)}
                    >
                        {showAll ? 'Ver solo hoy' : 'Ver todas'}
                    </button>
                </div>
            </form>

            <ul className={styles.appointmentList}>
                {filteredAppointments.map((app) => (
                    <li key={app.id} className={styles.appointmentItem}>
                        <div className={styles.appointmentInfo}>
                            <span className={styles.dateBadge}>{app.date}</span>
                            <h4>{app.title}</h4>
                            {app.description && <p>{app.description}</p>}
                        </div>
                        <button
                            className={styles.deleteButton}
                            onClick={() => deleteAppointment(app.id)}
                            aria-label="Borrar cita"
                        >
                            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </li>
                ))}

                {filteredAppointments.length === 0 && (
                    <div className={styles.emptyState}>
                        <p>No tienes citas para {showAll ? 'esta lista' : (selectedDate === today ? 'hoy' : selectedDate)}.</p>
                    </div>
                )}
            </ul>
        </div>
    );
}
