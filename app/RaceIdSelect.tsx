import React from 'react';

interface Race {
  RaceID: string;
  RaceName: string;
}

interface RaceIdSelectProps {
  raceId: string;
  races: Race[];
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const RaceIdSelect: React.FC<RaceIdSelectProps> = ({ raceId, races, onChange }) => {
  return (
    <div>
      <label htmlFor="raceId">Select Race:</label>
      <select id="raceId" value={raceId} onChange={onChange}>
        <option value="">Select a race</option>
        {races.map((race) => (
          <option key={raceId} value={race.RaceID}>
            {race.RaceName}
          </option>
        ))}
      </select>
    </div>
  );
};

export default RaceIdSelect;