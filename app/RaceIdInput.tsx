"use client";

import React, { useState } from 'react';

interface RaceIdInputProps {
  onSubmit: (raceId: string) => void;
}

const RaceIdInput: React.FC<RaceIdInputProps> = ({ onSubmit }) => {
  const [raceId, setRaceId] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRaceId(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(raceId);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="raceId">Race ID:</label>
        <input
          type="text"
          id="raceId"
          value={raceId}
          onChange={handleChange}
        />
      </div>
      <button type="submit">Update Race ID:</button>
    </form>
  );
};

export default RaceIdInput;