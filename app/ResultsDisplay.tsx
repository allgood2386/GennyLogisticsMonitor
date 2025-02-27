import React from 'react';

interface Lap {
  Lap: number;
  LapTime: string;
  Position: number;
  FlagStatus: string;
  TotalTime: string;
}

interface ResultsDisplayProps {
  results: {
    sessionName: string;
    currentTime: string;
    sessionTime: string;
    timeToGo: string;
    flagStatus: string;
    lastLapTime: string;
    bestLap: number;
    bestLapTime: string;
    bestPosition: number;
    currentPosition: number;
    laps?: Lap[]; // Make laps optional
  };
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results }) => {
  return (
    <div>
      <h3>Results</h3>
      <p>Sessssssion Name: {results.sessionName}</p>
      <p>Current Time: {results.currentTime}</p>
      <p>Session Time: {results.sessionTime}</p>
      <p>Time To Go: {results.timeToGo}</p>
      <p>Flag Status: {results.flagStatus}</p>
      <p>Last Lap: {results.lastLapTime}</p>
      <p>Best Lap: {results.bestLap}</p>
      <p>Best Lap Time: {results.bestLapTime}</p>
      <p>Best Position: {results.bestPosition}</p>
      <p>Current Position: {results.currentPosition}</p>
      <p>Total Laps:</p>
      {results.laps === undefined || results.laps.length === 0 ? (
        <p>No Lap Data</p>
      ) : (
        <ul>
          {results.laps.slice().reverse().map((lap, index) => (
            <li key={index} className="lap-item">
              <p>Lap {lap.Lap}: {lap.LapTime}</p>
              <p>Position: {lap.Position}</p>
              <p>Flag: {lap.FlagStatus}</p>
              <p>Total Time: {lap.TotalTime}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ResultsDisplay;