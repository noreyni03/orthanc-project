'use client';

import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { motion } from 'framer-motion';

Chart.register(...registerables);

interface BenchmarkResult {
  id: string;
  modelName: string;
  type: 'classification' | 'segmentation' | 'detection';
  metrics: {
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
    inferenceTime: number;
  };
  dataset: string;
  date: string;
}

interface BenchmarkChartProps {
  results: BenchmarkResult[];
  metric: string;
  selectedModels: string[];
  onModelSelect: (models: string[]) => void;
}

const BenchmarkChart: React.FC<BenchmarkChartProps> = ({
  results,
  metric,
  selectedModels,
  onModelSelect
}) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  const getMetricValue = (result: BenchmarkResult) => {
    return result.metrics[metric as keyof typeof result.metrics] || 0;
  };

  const getMetricLabel = (metric: string) => {
    switch (metric) {
      case 'accuracy':
        return 'Précision globale';
      case 'precision':
        return 'Précision';
      case 'recall':
        return 'Rappel';
      case 'f1Score':
        return 'Score F1';
      case 'inferenceTime':
        return 'Temps d\'inférence (s)';
      default:
        return metric;
    }
  };

  const getMetricColor = (type: string) => {
    switch (type) {
      case 'classification':
        return 'rgba(6, 182, 212, 0.8)'; // cyan
      case 'segmentation':
        return 'rgba(16, 185, 129, 0.8)'; // green
      case 'detection':
        return 'rgba(245, 158, 11, 0.8)'; // yellow
      default:
        return 'rgba(156, 163, 175, 0.8)'; // gray
    }
  };

  useEffect(() => {
    if (!chartRef.current) return;

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    // Détruire le graphique existant
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Préparer les données
    const labels = results.map(result => result.modelName);
    const data = results.map(result => getMetricValue(result));
    const backgroundColors = results.map(result => getMetricColor(result.type));
    const borderColors = results.map(result => getMetricColor(result.type).replace('0.8', '1'));

    // Créer le nouveau graphique
    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: getMetricLabel(metric),
            data,
            backgroundColor: backgroundColors,
            borderColor: borderColors,
            borderWidth: 1,
            borderRadius: 4,
            barThickness: 40,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const value = context.raw as number;
                return metric === 'inferenceTime'
                  ? `${value.toFixed(2)} secondes`
                  : `${(value * 100).toFixed(1)}%`;
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            max: metric === 'inferenceTime' ? undefined : 1,
            ticks: {
              callback: function(value) {
                return metric === 'inferenceTime'
                  ? `${value}s`
                  : `${(Number(value) * 100).toFixed(0)}%`;
              },
            },
          },
        },
        onClick: (_, elements) => {
          if (elements.length > 0) {
            const index = elements[0].index;
            const modelId = results[index].id;
            onModelSelect(
              selectedModels.includes(modelId)
                ? selectedModels.filter(id => id !== modelId)
                : [...selectedModels, modelId]
            );
          }
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [results, metric, selectedModels]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-[400px] w-full"
    >
      <canvas ref={chartRef} />
    </motion.div>
  );
};

export default BenchmarkChart; 