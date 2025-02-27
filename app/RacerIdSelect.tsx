import React from 'react';
import ResultsDisplay from './ResultsDisplay';

interface Racer {
  Number: string;
  FirstName: string;
  LastName: string;
}

interface RacerIdSelectProps {
  racers: Racer[];
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
        <option value="">Select a Racer</option>
        {racers.Competitors && Object.keys(racers.Competitors).map((key) => (
          <option key={key} value={key}>
            {racers.Competitors[key].Number} - {racers.Competitors[key].FirstName} {racers.Competitors[key].LastName}
          </option>
        ))}
      </select>
      <button onClick={onSubmit}>Submit</button>
      {results && <ResultsDisplay results={results} />}
    </div>
  );
};

export default React.memo(RacerIdSelect);