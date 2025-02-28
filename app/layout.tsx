"use client";

import React, { useState, useEffect } from 'react';
import "./globals.css";
import './layout.css'; // Import the new CSS file
import RaceIdSelect from './RaceIdSelect';
import RacerIdSelect from './RacerIdSelect';
import LapTimesChart from './LapTimesChart';
import { fetchRacer, fetchRaces, fetchSession } from './api';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [raceId, setRaceId] = useState('');
  const [racer1Id, setRacer1Id] = useState('');
  const [racer1Results, setRacer1Results] = useState(null);
  const [races, setRaces] = useState([]);
  const [racers, setRacers] = useState([]);

  useEffect(() => {
    const fetchRacesData = async () => {
      try {
        const raceData = await fetchRaces();
        setRaces(raceData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchRacesData();
  }, []);

  useEffect(() => {
    const fetchRacersData = async () => {
      if (raceId) {
        try {
          const racerData = await fetchSession(raceId);
          setRacers(racerData);
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchRacersData();
  }, [raceId]);

  const handleRaceIdChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRaceId(event.target.value);
    setRacers([]); // Clear racers when race ID changes
    setRacer1Id(''); // Clear selected racer 1 ID
  };

  const handleRacer1IdChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRacer1Id(event.target.value);
  };

  const handleRacer1IdSubmit = async () => {
    const results = await formatResults(raceId, racer1Id); 
    setRacer1Results(results);
  };

  const formatResults = async (raceId: string, racerId: string) => {
    try {
      const sessionData = await fetchSession(raceId, racerId);
      const racerData = await fetchRacer(raceId, racerId);
      const results = {
        sessionName: sessionData.SessionName,
        currentTime: sessionData.CurrentTime,
        sessionTime: sessionData.SessionTime,
        timeToGo: sessionData.TimeToGo,
        flagStatus: sessionData.FlagStatus,
        currentPosition: racerData.Details.Competitor.Position,
        bestPosition: racerData.Details.Competitor.BestPosition,
        bestLap: racerData.Details.Competitor.BestLap,
        bestLapTime: racerData.Details.Competitor.BestLapTime,
        lastLapTime: racerData.Details.Competitor.LastLapTime,
        laps: racerData.Details.Laps
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
    }, 31000); // 31 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [raceId, racer1Id]);

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
          </div>
          {children}
        </main>
        <footer>
          <p>&copy; 2025 Cream Logistics Monitor</p>
        </footer>
      </body>
    </html>
  );
}
