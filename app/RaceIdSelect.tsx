import React from 'react';

interface RaceIdSelectProps {
  races: { RaceID: string; RaceName: string }[];
  raceId: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const RaceIdSelect: React.FC<RaceIdSelectProps> = ({ races, raceId, onChange }) => {
  return (
    <div>
      <label htmlFor="raceId">Select Race:</label>
      <select id="raceId" value={raceId} onChange={onChange}>
        <option value="">Select a race</option>
        {races.map((race) => (
          <option key={race.ID} value={race.ID}>
            {race.Name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default RaceIdSelect;