import React from 'react';

interface RacerIdSelectProps {
  racers: { RacerID: string; Name: string }[];
  racerId: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  onSubmit: () => void;
  results: any;
}

const RacerIdSelect: React.FC<RacerIdSelectProps> = ({ racers, racerId, onChange, onSubmit, results }) => {
  return (
    <div>
      <label htmlFor="racerId">Select Racer:</label>
      <select id="racerId" value={racerId} onChange={onChange}>
        <option value="">Select a racer</option>
        {Array.isArray(racers) && racers.map((racer) => (
          <option key={racer.RacerID} value={racer.RacerID}>
            {racer.Name}
          </option>
        ))}
      </select>
      <button onClick={onSubmit}>Submit</button>
      {results && <ResultsDisplay results={results} />}
    </div>
  );
};

export default RacerIdSelect;