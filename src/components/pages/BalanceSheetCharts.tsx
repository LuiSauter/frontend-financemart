import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { Chart, ChartTypeRegistry, registerables, ChartConfiguration, TooltipItem } from 'chart.js';
import { useBalance } from '@/context/BalanceContext';

Chart.register(...registerables);

const BalanceSheetCharts = forwardRef(function BalanceSheetCharts(props, ref) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const { balance } = useBalance();
  let chartInstance: Chart<keyof ChartTypeRegistry, number[], string> | null = null;

  useImperativeHandle(ref, () => ({
    toBase64Image: () => {
      return chartInstance ? chartInstance.toBase64Image() : null;
    }
  }));

  useEffect(() => {
    const chartCanvas = chartRef.current ? (chartRef.current as HTMLCanvasElement).getContext('2d') : null;
    if (!chartCanvas) return;

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

    const config: ChartConfiguration<'pie', number[], string> = {
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
              label: (context: TooltipItem<'pie'>) => {
                const label = context.label || '';
                const value = context.raw || 0;
                const total = context.chart.data.datasets[context.datasetIndex].data.reduce((acc, value) => (acc as number) + (value as number), 0);
                const percentage = ((Number(value) / Number(total)) * 100).toFixed(2);
                return `${label}: ${value.toLocaleString()} (${percentage}%)`;
              }
            }
          }
        }
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    chartInstance = new Chart(chartCanvas, config);

    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, [balance]);

  return <canvas ref={chartRef} />;
});

export default BalanceSheetCharts;