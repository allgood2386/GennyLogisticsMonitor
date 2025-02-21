"use client";

import React, { useState, useEffect } from 'react';
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
    const results = await formatResults(raceId, id);
    setRacer1Results(results);
  };

  const handleRacer2IdSubmit = async (id: string) => {
    setRacer2Id(id);
    const results = await formatResults(raceId, id);
    setRacer2Results(results);
  };

  const fetchRacer = async (raceId: string, racerId: string) => {
    const url = new URL('https://api.race-monitor.com/v2/Live/GetRacer');
    url.searchParams.append('raceID', raceId);
    url.searchParams.append('racerID', racerId);
    url.searchParams.append('apiToken', process.env.REACT_APP_RACE_MONITOR_API_KEY);
    const response = await fetch(url.toString(), {
      method: 'POST'
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const racerData = await response.json();
    return racerData;
  };

  const fetchRaceSession = async (raceId: string, racerId: string) => {
    const url = new URL('https://api.race-monitor.com/v2/Live/GetSession');
    url.searchParams.append('raceID', raceId);
    url.searchParams.append('racerID', racerId);
    url.searchParams.append('apiToken', process.env.REACT_APP_RACE_MONITOR_API_KEY);
    const response = await fetch(url.toString(), {
      method: 'POST'
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const SessionData = await response.json();
    return SessionData;
  };

  const formatResults = async (raceId: string, racerId: string) => {
    try {
      const SessionData = await fetchRaceSession(raceId, racerId);
      const Racer = await fetchRacer(raceId, racerId);

      const results = {
        sessionName: SessionData.Session.SessionName,
        currentTime: SessionData.Session.CurrentTime,
        sessionTime: SessionData.Session.SessionTime,
        timeToGo: SessionData.Session.TimeToGo,
        flagStatus: SessionData.Session.FlagStatus,
        currentPosition: Racer.Details.Competitor.Position,
        bestPosition: Racer.Details.Competitor.BestPosition,
        bestLap: Racer.Details.Competitor.BestLap,
        bestLapTime: Racer.Details.Competitor.BestLapTime,
        lastLapTime: Racer.Details.Competitor.LastLapTime,
        laps: Racer.Details.Laps
      };

      return results;
    } catch (error) {
      return { 
        error: error.message
      };
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (raceId && racer1Id) {
        formatResults(raceId, racer1Id).then(setRacer1Results);
      }
      if (raceId && racer2Id) {
        formatResults(raceId, racer2Id).then(setRacer2Results);
      }
    }, 31000); // 31 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [raceId, racer1Id, racer2Id]);

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
