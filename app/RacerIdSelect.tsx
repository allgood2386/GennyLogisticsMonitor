import React from 'react';
import ResultsDisplay from './ResultsDisplay';

interface RacerIdSelectProps {
  racers: { Number: string; FirstName: string; LastName: string }[];
  racerId: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  onSubmit: () => void;
  results: any;
}

const RacerIdSelect: React.FC<RacerIdSelectProps> = ({ racers, racerId, onChange, onSubmit, results }) => {
    console.log(racers);
    const Session = racers.Session;
    console.log(Session);
    const Competitors = racers.Competitors;
    console.log(Competitors);
  return (
    <div>
      <label htmlFor="racerId">Select Racer:</label>
      <select id="racerId" value={racerId} onChange={onChange}>
        <option value="">Select a racer</option>
        {Array.isArray(racers) && racers.map((racer) => (
          <option key={racer.Number} value={racer.Number}>
            {racer.Number} - {racer.FirstName} {racer.LastName}
          </option>
        ))}
      </select>
      <button onClick={onSubmit}>Submit</button>
      {results && <ResultsDisplay results={results} />}
    </div>
  );
};

export default React.memo(RacerIdSelect);