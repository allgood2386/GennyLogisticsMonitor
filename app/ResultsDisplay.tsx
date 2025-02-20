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
    </div>
  );
};

export default ResultsDisplay;