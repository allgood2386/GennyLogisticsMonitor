"use client";

import React, { useState, useEffect } from 'react';
import RaceIdSelect from './RaceIdSelect';
import LapTimesChart from './LapTimesChart';
import { fetchRacer, fetchRaces, fetchSession } from './api';

// Types for API responses
interface Competitor {
  RacerID: string;
  Number: string;
  FirstName: string;
  LastName: string;
  Position: string;
  BestPosition: string;
  BestLap: string;
  BestLapTime: string;
  LastLapTime: string;
}
interface Lap {
  Lap: string;
  LapTime: string;
  Position: string;
  FlagStatus: string;
  TotalTime: string;
}
interface Session {
  SessionName: string;
  CurrentTime: string;
  SessionTime: string;
  TimeToGo: string;
  FlagStatus: string;
  Competitors: { [key: string]: Competitor };
}
interface RacerResults {
  sessionName: string;
  currentTime: string;
  sessionTime: string;
  timeToGo: string;
  flagStatus: string;
  currentPosition: string;
  bestPosition: string;
  bestLap: string;
  bestLapTime: string;
  lastLapTime: string;
  laps?: Lap[];
}

export default function Home() {
  const [raceId, setRaceId] = useState<string>('');
  const [racer1Id, setRacer1Id] = useState<string>('');
  const [racer2Id, setRacer2Id] = useState<string>('');
  const [racer1Results, setRacer1Results] = useState<RacerResults | null>(null);
  const [racer2Results, setRacer2Results] = useState<RacerResults | null>(null);
  const [races, setRaces] = useState<any[]>([]);
  const [racers, setRacers] = useState<Session | null>(null);
  const [lapCount, setLapCount] = useState<number>(10);
  // New: update rates in seconds (0 = off)
  const [racer1Rate, setRacer1Rate] = useState<number>(30);
  const [racer2Rate, setRacer2Rate] = useState<number>(30);

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
    setRacers(null);
    setRacer1Id('');
    setRacer2Id('');
    setRacer1Results(null);
    setRacer2Results(null);
  };

  const handleRacer1IdChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRacer1Id(event.target.value);
  };

  const handleRacer2IdChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRacer2Id(event.target.value);
  };

  const handleLapCountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLapCount(Number(event.target.value));
  };

  const handleRefresh = async () => {
    if (raceId && racer1Id) {
      const res1 = await formatResults(raceId, racer1Id);
      setRacer1Results(res1);
    }
    if (raceId && racer2Id) {
      const res2 = await formatResults(raceId, racer2Id);
      setRacer2Results(res2);
    }
  };

  const formatResults = async (raceId: string, racerId: string): Promise<RacerResults | null> => {
    try {
      const sessionData = await fetchSession(raceId);
      const racerData = await fetchRacer(raceId, racerId);
      const results: RacerResults = {
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
      return null;
    }
  };

  // Racer 1 update interval
  useEffect(() => {
    if (!raceId || !racer1Id || racer1Rate === 0) return;
    const interval = setInterval(() => {
      formatResults(raceId, racer1Id).then(setRacer1Results);
    }, racer1Rate * 1000);
    return () => clearInterval(interval);
  }, [raceId, racer1Id, racer1Rate]);

  // Racer 2 update interval
  useEffect(() => {
    if (!raceId || !racer2Id || racer2Rate === 0) return;
    const interval = setInterval(() => {
      formatResults(raceId, racer2Id).then(setRacer2Results);
    }, racer2Rate * 1000);
    return () => clearInterval(interval);
  }, [raceId, racer2Id, racer2Rate]);

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ textAlign: 'center', marginBottom: 24 }}>Cream Logistics Monitor</h1>
      <RaceIdSelect races={races} raceId={raceId} onChange={handleRaceIdChange} />
      <div className="form-container" style={{ gap: 16 }}>
        <div>
          <label htmlFor="racer1Id">Select Driver:</label>
          <select id="racer1Id" value={racer1Id} onChange={handleRacer1IdChange}>
            <option value="">Select a Driver</option>
            {racers && racers.Competitors && Object.keys(racers.Competitors).map((key) => (
              <option key={key} value={key}>
                {racers.Competitors[key].Number} - {racers.Competitors[key].FirstName} {racers.Competitors[key].LastName}
              </option>
            ))}
          </select>
          <div style={{ marginTop: 8 }}>
            <label htmlFor="racer1Rate">Update Rate: </label>
            <select id="racer1Rate" value={racer1Rate} onChange={e => setRacer1Rate(Number(e.target.value))}>
              <option value={0}>Off</option>
              <option value={15}>15s</option>
              <option value={30}>30s</option>
              <option value={60}>60s</option>
            </select>
          </div>
        </div>
        <div>
          <label htmlFor="racer2Id">Compare to Driver:</label>
          <select id="racer2Id" value={racer2Id} onChange={handleRacer2IdChange}>
            <option value="">Select a Driver</option>
            {racers && racers.Competitors && Object.keys(racers.Competitors).map((key) => (
              <option key={key} value={key}>
                {racers.Competitors[key].Number} - {racers.Competitors[key].FirstName} {racers.Competitors[key].LastName}
              </option>
            ))}
          </select>
          <div style={{ marginTop: 8 }}>
            <label htmlFor="racer2Rate">Update Rate: </label>
            <select id="racer2Rate" value={racer2Rate} onChange={e => setRacer2Rate(Number(e.target.value))}>
              <option value={0}>Off</option>
              <option value={15}>15s</option>
              <option value={30}>30s</option>
              <option value={60}>60s</option>
            </select>
          </div>
        </div>
        <div>
          <label htmlFor="lapCount">Show last </label>
          <input
            id="lapCount"
            type="number"
            min={1}
            max={50}
            value={lapCount}
            onChange={handleLapCountChange}
            style={{ width: 60, marginRight: 8 }}
          />
          laps
          <button style={{ marginLeft: 12 }} onClick={handleRefresh}>Refresh</button>
        </div>
      </div>
      {/* Summary Cards */}
      <div style={{ display: 'flex', gap: 24, margin: '24px 0' }}>
        {racer1Results && (
          <div style={{ border: '1px solid #02311e', borderRadius: 8, padding: 16, minWidth: 180 }}>
            <h4>Driver 1</h4>
            <div>Best Lap: {racer1Results.bestLapTime}</div>
            <div>Last Lap: {racer1Results.lastLapTime}</div>
            <div>Total Laps: {racer1Results.laps?.length || 0}</div>
          </div>
        )}
        {racer2Results && (
          <div style={{ border: '1px solid #02311e', borderRadius: 8, padding: 16, minWidth: 180 }}>
            <h4>Driver 2</h4>
            <div>Best Lap: {racer2Results.bestLapTime}</div>
            <div>Last Lap: {racer2Results.lastLapTime}</div>
            <div>Total Laps: {racer2Results.laps?.length || 0}</div>
          </div>
        )}
      </div>
      {/* Lap Times Chart */}
      {(racer1Results?.laps || racer2Results?.laps) && (
        <div style={{ maxWidth: 900, margin: '0 auto 32px auto' }}>
          <LapTimesChart
            laps={Array.from({ length: lapCount }, (_, i) => {
              const lapIndex = (racer1Results?.laps?.length || 0) - lapCount + i;
              return {
                lapNumber: lapIndex + 1,
                lapTime: racer1Results?.laps?.[lapIndex]?.LapTime || '',
                lapTime2: racer2Results?.laps?.[lapIndex]?.LapTime || '',
              };
            }).filter(lap => lap.lapTime || lap.lapTime2)}
          />
        </div>
      )}
      {/* Lap Table */}
      {(racer1Results?.laps || racer2Results?.laps) && (
        <div style={{ maxWidth: 900, margin: '0 auto 32px auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f5f5dc' }}>
                <th>Lap</th>
                <th>Driver 1 Lap Time</th>
                <th>Driver 2 Lap Time</th>
                <th>Driver 1 Position</th>
                <th>Driver 2 Position</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: lapCount }, (_, i) => {
                const lapIndex = (racer1Results?.laps?.length || 0) - lapCount + i;
                if (lapIndex < 0) return null;
                return (
                  <tr key={i} style={{ borderBottom: '1px solid #ccc' }}>
                    <td>{lapIndex + 1}</td>
                    <td>{racer1Results?.laps?.[lapIndex]?.LapTime || '-'}</td>
                    <td>{racer2Results?.laps?.[lapIndex]?.LapTime || '-'}</td>
                    <td>{racer1Results?.laps?.[lapIndex]?.Position || '-'}</td>
                    <td>{racer2Results?.laps?.[lapIndex]?.Position || '-'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
