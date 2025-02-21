"use client";

import React, { useState, useEffect } from 'react';
import "./globals.css";
import './layout.css'; // Import the new CSS file
import ResultsDisplay from './ResultsDisplay';
import RaceIdSelect from './RaceIdSelect';
import RacerIdSelect from './RacerIdSelect';

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
  const [races, setRaces] = useState([]);
  const [racers, setRacers] = useState([]);

  useEffect(() => {
    const fetchRaces = async () => {
      const url = new URL('https://api.race-monitor.com/v2/Common/CurrentRaces');
      url.searchParams.append('apiToken', process.env.REACT_APP_RACE_MONITOR_API_KEY);
      const response = await fetch(url.toString(), {
        method: 'POST'
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const raceData = await response.json();
      setRaces(raceData.Races);
    };

    fetchRaces();
  }, []);

  useEffect(() => {
    const fetchRacers = async () => {
      if (raceId) {
        const url = new URL('https://api.race-monitor.com/v2/Live/GetSession');
        url.searchParams.append('raceID', raceId);
        url.searchParams.append('apiToken', process.env.REACT_APP_RACE_MONITOR_API_KEY);
        const response = await fetch(url.toString(), {
          method: 'POST'
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const sessionData = await response.json();
        setRacers(sessionData.Session.Competitors);
      }
    };

    fetchRacers();
  }, [raceId]);

  const handleRaceIdChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRaceId(event.target.value);
    setRacers([]); // Clear racers when race ID changes
    setRacer1Id(''); // Clear selected racer 1 ID
    setRacer2Id(''); // Clear selected racer 2 ID
  };

  const handleRacer1IdChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRacer1Id(event.target.value);
  };

  const handleRacer2IdChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRacer2Id(event.target.value);
  };

  const handleRacer1IdSubmit = async () => {
    const results = await formatResults(raceId, racer1Id);
    setRacer1Results(results);
  };

  const handleRacer2IdSubmit = async () => {
    const results = await formatResults(raceId, racer2Id);
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
          <RaceIdSelect races={races} raceId={raceId} onChange={handleRaceIdChange} />
          <div className="form-container">
            <RacerIdSelect
              racers={racers}
              racerId={racer1Id}
              onChange={handleRacer1IdChange}
              onSubmit={handleRacer1IdSubmit}
              results={racer1Results}
            />
            <RacerIdSelect
              racers={racers}
              racerId={racer2Id}
              onChange={handleRacer2IdChange}
              onSubmit={handleRacer2IdSubmit}
              results={racer2Results}
            />
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
