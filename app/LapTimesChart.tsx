import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


interface LapTimesChartProps {
  laps: { lapNumber: number; lapTime: string; lapTime2?: string }[];
}


const LapTimesChart: React.FC<LapTimesChartProps> = ({ laps }) => {
  // Helper to convert mm:ss.SSS to seconds
  function parseLapTime(lapTime: string): number | null {
    if (!lapTime) return null;
    const parts = lapTime.split(':');
    if (parts.length === 3) {
      const [mm, ss, ms] = parts;
      return parseInt(mm) * 60 + parseInt(ss) + parseFloat('0.' + ms);
    } else if (parts.length === 2) {
      const [ss, ms] = parts;
      return parseInt(ss) + parseFloat('0.' + ms);
    }
    return null;
  }

  const datasets = [
    {
      label: 'Driver 1',
      data: laps.map((lap) => lap.lapTime ? parseLapTime(lap.lapTime) : null),
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 2,
    },
  ];
  if (laps.some(lap => lap.lapTime2)) {
    datasets.push({
      label: 'Driver 2',
      data: laps.map((lap) => lap.lapTime2 ? parseLapTime(lap.lapTime2) : null),
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 2,
    });
  }
  const data = {
    labels: laps.map((lap) => `Lap ${lap.lapNumber}`),
    datasets,
  };


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
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default LapTimesChart;