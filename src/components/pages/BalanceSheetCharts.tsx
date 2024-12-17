import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { Chart, registerables } from 'chart.js';
import { useBalance } from '@/context/BalanceContext';

Chart.register(...registerables);

const BalanceSheetCharts = forwardRef((props, ref) => {
    const chartRef = useRef(null);
    const { balance } = useBalance();
    let chartInstance = null;

    useImperativeHandle(ref, () => ({
        toBase64Image: () => {
            return chartInstance ? chartInstance.toBase64Image() : null;
        }
    }));

    useEffect(() => {
        const chartCanvas = chartRef.current.getContext('2d');

        const activoCirculante = balance.entries.filter(entry => entry.category === 'activo' && entry.subcategory === 'circulante').reduce((acc, entry) => acc + entry.value, 0);
        const activoFijo = balance.entries.filter(entry => entry.category === 'activo' && entry.subcategory === 'fijo').reduce((acc, entry) => acc + entry.value, 0);
        const otrosActivos = balance.entries.filter(entry => entry.category === 'activo' && entry.subcategory === 'otros_activos').reduce((acc, entry) => acc + entry.value, 0);
        const pasivoCortoPlazo = balance.entries.filter(entry => entry.category === 'pasivo' && entry.subcategory === 'corto_plazo').reduce((acc, entry) => acc + entry.value, 0);
        const pasivoLargoPlazo = balance.entries.filter(entry => entry.category === 'pasivo' && entry.subcategory === 'largo_plazo').reduce((acc, entry) => acc + entry.value, 0);
        const patrimonio = balance.entries.filter(entry => entry.category === 'patrimonio').reduce((acc, entry) => acc + entry.value, 0);

        const chartData = {
            labels: ['Activo Circulante', 'Activo Fijo', 'Otros Activos', 'Pasivo Corto Plazo', 'Pasivo Largo Plazo', 'Patrimonio'],
            datasets: [
                {
                    label: 'Balance General',
                    data: [activoCirculante, activoFijo, otrosActivos, pasivoCortoPlazo, pasivoLargoPlazo, patrimonio],
                    backgroundColor: ['#3B82F6', '#6366F1', '#A78BFA', '#F59E0B', '#EF4444', '#10B981'],
                    hoverOffset: 4
                }
            ]
        };

        const config = {
            type: 'pie',
            data: chartData,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const label = context.label || '';
                                const value = context.raw || 0;
                                const total = context.chart._metasets[context.datasetIndex].total;
                                const percentage = ((value / total) * 100).toFixed(2);
                                return `${label}: ${value.toLocaleString()} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        };

        chartInstance = new Chart(chartCanvas, config);

        return () => {
            chartInstance.destroy();
        };
    }, [balance]);

    return <canvas ref={chartRef} />;
});

export default BalanceSheetCharts;