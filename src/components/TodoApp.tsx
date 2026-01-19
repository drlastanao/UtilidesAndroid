'use client';

import { useState, useEffect } from 'react';
import styles from './TodoApp.module.css';

interface Task {
    id: string;
    text: string;
    completed: boolean;
}

export default function TodoApp() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTask, setNewTask] = useState('');
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from LocalStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('tasks');
        if (saved) {
            try {
                setTasks(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to parse tasks', e);
            }
        }
        setIsLoaded(true);
    }, []);

    // Save to LocalStorage whenever tasks change
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }
    }, [tasks, isLoaded]);

    const addTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTask.trim()) return;

        const task: Task = {
            id: crypto.randomUUID(),
            text: newTask.trim(),
            completed: false,
        };

        setTasks([task, ...tasks]);
        setNewTask('');
    };

    const toggleTask = (id: string) => {
        setTasks(tasks.map(t =>
            t.id === id ? { ...t, completed: !t.completed } : t
        ));
    };

    const deleteTask = (id: string) => {
        setTasks(tasks.filter(t => t.id !== id));
    };

    if (!isLoaded) return null; // Prevent hydration mismatch

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Mis Tareas</h1>

            <form onSubmit={addTask} className={styles.inputGroup}>
                <input
                    type="text"
                    className={styles.input}
                    placeholder="Escribe una nueva tarea..."
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                />
                <button type="submit" className={styles.addButton}>
                    Añadir
                </button>
            </form>

            <ul className={styles.taskList}>
                {tasks.map((task) => (
                    <li key={task.id} className={styles.taskItem}>
                        <input
                            type="checkbox"
                            className={styles.checkbox}
                            checked={task.completed}
                            onChange={() => toggleTask(task.id)}
                        />
                        <span className={`${styles.taskText} ${task.completed ? styles.completed : ''}`}>
                            {task.text}
                        </span>
                        <button
                            className={styles.deleteButton}
                            onClick={() => deleteTask(task.id)}
                            aria-label="Borrar tarea"
                        >
                            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </li>
                ))}
                {tasks.length === 0 && (
                    <p style={{ textAlign: 'center', opacity: 0.5, marginTop: '2rem' }}>
                        No hay tareas pendientes. ¡Añade una!
                    </p>
                )}
            </ul>
        </div>
    );
}
