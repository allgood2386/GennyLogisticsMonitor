"use client";

import React, { useState } from 'react';
import "./globals.css";
import './layout.css'; // Import the new CSS file
import RaceIdInput from './RaceIdInput';
import RacerIdInput from './RacerIdInput';
import ResultsDisplay from './ResultsDisplay';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [raceId, setRaceId] = useState('');
  const [racer1Id, setRacer1Id] = useState('');
  const [racer2Id, setRacer2Id] = useState('');
  const [racer1Results, setRacer1Results] = useState(null);
  const [racer2Results, setRacer2Results] = useState(null);

  const handleRaceIdSubmit = (id: string) => {
    setRaceId(id);
  };

  const handleRacer1IdSubmit = async (id: string) => {
    setRacer1Id(id);
    const results = await fetchResults(raceId, id);
    setRacer1Results(results);
  };

  const handleRacer2IdSubmit = async (id: string) => {
    setRacer2Id(id);
    const results = await fetchResults(raceId, id);
    setRacer2Results(results);
  };

  const fetchResults = async (raceId: string, racerId: string) => {

    try {
      const url = new URL('https://api.race-monitor.com/v2/Live/GetRacer');
      url.searchParams.append('raceID', raceId);
      url.searchParams.append('racerID', racerId);
      url.searchParams.append('apiToken', '');
      const response = await fetch(url.toString(), {
        method: 'POST'
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const racerData = await response.json();
      console.log(racerData.Details);
      const results = {
        bestLap: racerData.Details.Competitor.BestLap,
        bestLapTime: racerData.Details.Competitor.BestLapTime,
        bestPosition: racerData.Details.Competitor.BestPosition,
        lastLapTime: racerData.Details.Competitor.LastLapTime,
        currentPosition: racerData.Details.Competitor.Position,
        laps: racerData.Details.Laps
      };
      console.log(results);
      return results;
    } catch (error) {
      console.error('Failed to fetch results:', error);
      return {
        trackName: 'Error',
        sessionName: 'Error',
        currentTime: 'Error',
        flagStatus: 'Error',
        position: 0,
        bestPosition: 0,
        lastLap: []
      };
    }
  };

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="https://substackcdn.com/image/fetch/f_auto,q_auto:good,fl_progressive:steep/https://bucketeer-e05bbc84-baa3-437e-9518-adb32be77984.s3.amazonaws.com/public/images/a26c7e47-8642-4257-af60-71a1e46cebe4_600x600.png" />
      </head>
      <body>
        <header>
          <h1>Cream Logistics Monitor</h1>
        </header>
        <main>
          <RaceIdInput onSubmit={handleRaceIdSubmit} />
          <div className="form-container">
            <div>
              <RacerIdInput onSubmit={handleRacer1IdSubmit} />
              {racer1Results && <ResultsDisplay results={racer1Results} />}
            </div>
            <div>
              <RacerIdInput onSubmit={handleRacer2IdSubmit} />
              {racer2Results && <ResultsDisplay results={racer2Results} />}
            </div>
          </div>
          {children}
        </main>
        <footer>
          <p>&copy; 2025 Cream Ale Monitor</p>
        </footer>
      </body>
    </html>
  );
}
