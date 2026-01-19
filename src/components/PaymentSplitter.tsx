'use client';

import { useState, useMemo } from 'react';
import styles from './PaymentSplitter.module.css';

export default function PaymentSplitter() {
    const [total, setTotal] = useState<number | ''>('');
    const [discount, setDiscount] = useState<number | ''>(0);
    const [people, setPeople] = useState<number | ''>(1);

    const result = useMemo(() => {
        const totalVal = Number(total) || 0;
        const discountVal = Number(discount) || 0;
        const peopleVal = Number(people) || 1;

        if (peopleVal <= 0) return 0;

        const finalAmount = Math.max(0, totalVal - discountVal);
        return finalAmount / peopleVal;
    }, [total, discount, people]);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Repartidor de Pagos</h1>

            <div className={styles.inputGroup}>
                <label className={styles.label}>Importe Total (€)</label>
                <input
                    type="number"
                    className={styles.input}
                    placeholder="0.00"
                    value={total}
                    onChange={(e) => setTotal(e.target.value === '' ? '' : parseFloat(e.target.value))}
                    min="0"
                    step="0.01"
                />
            </div>

            <div className={styles.inputGroup}>
                <label className={styles.label}>Importe a Descontar (€)</label>
                <input
                    type="number"
                    className={styles.input}
                    placeholder="0.00"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value === '' ? '' : parseFloat(e.target.value))}
                    min="0"
                    step="0.01"
                />
            </div>

            <div className={styles.inputGroup}>
                <label className={styles.label}>Número de Personas</label>
                <input
                    type="number"
                    className={styles.input}
                    placeholder="1"
                    value={people}
                    onChange={(e) => setPeople(e.target.value === '' ? '' : parseInt(e.target.value))}
                    min="1"
                    step="1"
                />
            </div>

            <div className={styles.resultContainer}>
                <div className={styles.resultLabel}>Cada persona paga</div>
                <div className={styles.resultAmount}>
                    {result.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    <span className={styles.currency}>€</span>
                </div>
            </div>
        </div>
    );
}
