// components/charts/PerformanceChart.tsx
'use client';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, TimeScale } from 'chart.js';
import 'chartjs-adapter-dayjs';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, TimeScale);

export default function PerformanceChart({ labels, data }: { labels: string[]; data: number[] }) {
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Cumulative PnL',
        data,
        tension: 0.3,
        fill: true,
        borderWidth: 2,
        pointRadius: 0
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { x: { type: 'time', time: { unit: 'day' } } }
  };

  return <Line data={chartData} options={options} />;
}
