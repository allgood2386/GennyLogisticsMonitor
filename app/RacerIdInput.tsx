"use client";

import React, { useState } from 'react';

interface RacerIdInputProps {
  onSubmit: (racerId: string) => void;
}

const RacerIdInput: React.FC<RacerIdInputProps> = ({ onSubmit }) => {
  const [racerId, setRacerId] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRacerId(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(racerId);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="racerId">Racer ID:</label>
        <input
          type="text"
          id="racerId"
          value={Name}
          onChange={handleChange}
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default RacerIdInput;