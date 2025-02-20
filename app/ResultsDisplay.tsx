import React from 'react';

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results }) => {
  return (
    <div>
      <h3>Results</h3>
      <p>Last Lap: {results.lastLapTime}</p>
      <p>Best Lap: {results.bestLap}</p>
      <p>Best Lap Time: {results.bestLapTime}</p>
      <p>Best Posistion: {results.bestPosition}</p>
      <p>Current Posistion: {results.currentPosition}</p>
      <p>Total Laps:</p>
      <ul>
        {results.laps.slice().reverse().map((lap, index) => (
          <li key={index}>
            <p>Lap {lap.Lap}: {lap.LapTime}</p>
            <p>Position: {lap.Position}</p>
            <p>Flag: {lap.FlagStatus}</p>
            <p>Total Time: {lap.TotalTime}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ResultsDisplay;