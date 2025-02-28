import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface LapTimesChartProps {
  laps: { lapNumber: number; lapTime: string }[];
}

const LapTimesChart: React.FC<LapTimesChartProps> = ({ laps }) => {
    console.log('laps', laps);
  const data = {
    labels: laps.map((lap) => `Lap ${lap.lapNumber}`),
    datasets: [
      {
        label: 'Lap Time',
        data: laps.map((lap) => parseFloat(lap.lapTime)),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };
  console.log('data', data);

  const options = {
    scales: {
      x: {
        title: {
          display: true,
          text: 'Lap Number',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Lap Time (seconds)',
        },
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default LapTimesChart;