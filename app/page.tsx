"use client";

import React, { useState, useEffect } from 'react';
// Helper to detect rate limit (customize as needed)
function isRateLimitError(error: any) {
  if (!error) return false;
  if (error.status === 429) return true;
  if (typeof error === 'string' && error.toLowerCase().includes('rate limit')) return true;
  if (error.message && error.message.toLowerCase().includes('rate limit')) return true;
  return false;
}
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
  const [raceListRate, setRaceListRate] = useState<number>(30); // new: race/driver list refresh
  const [racer1Rate, setRacer1Rate] = useState<number>(30);
  const [racer2Rate, setRacer2Rate] = useState<number>(30);
  // Rate limit toggles for each driver
  const [racer1AutoUpdate, setRacer1AutoUpdate] = useState(true);
  const [racer2AutoUpdate, setRacer2AutoUpdate] = useState(true);
  const [showRacer2, setShowRacer2] = useState<boolean>(true); // new: toggle for second driver

  // Rate limit warning state
  const [rateLimitWarning, setRateLimitWarning] = useState(false);

  // Race/driver list refresh interval
  useEffect(() => {
    const fetchRacesData = async () => {
      try {
        const raceData = await fetchRaces();
        setRaces(raceData);
        setRateLimitWarning(false); // clear warning on success
        // Auto-select first race on initial load
        if (raceId === '' && raceData && raceData.length > 0) {
          setRaceId(raceData[0].RaceID || raceData[0].id || raceData[0].raceId || '');
        }
      } catch (error: any) {
        if (isRateLimitError(error)) {
          setRateLimitWarning(true);
        }
        // else ignore, keep current data
      }
    };
    fetchRacesData();
    if (raceListRate === 0) return;
    const interval = setInterval(fetchRacesData, raceListRate * 1000);
    return () => clearInterval(interval);
  }, [raceListRate]);

  useEffect(() => {
    const fetchRacersData = async () => {
      if (raceId) {
        try {
          const racerData = await fetchSession(raceId);
          setRacers(racerData);
          setRateLimitWarning(false); // clear warning on success
        } catch (error: any) {
          if (isRateLimitError(error)) {
            setRateLimitWarning(true);
          }
          // else ignore, keep current data
        }
      }
    };
    fetchRacersData();
    if (raceId && raceListRate !== 0) {
      const interval = setInterval(fetchRacersData, raceListRate * 1000);
      return () => clearInterval(interval);
    }
  }, [raceId, raceListRate]);

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
      setRateLimitWarning(false); // clear warning on success
      return results;
    } catch (error: any) {
      if (isRateLimitError(error)) {
        setRateLimitWarning(true);
      }
      // else ignore, keep current data
      return null;
    }
  };

  // Racer 1 update interval
  useEffect(() => {
    if (!raceId || !racer1Id || racer1Rate === 0 || !racer1AutoUpdate) return;
    const interval = setInterval(() => {
      formatResults(raceId, racer1Id).then(res => {
        if (res) setRacer1Results(res);
      });
    }, racer1Rate * 1000);
    return () => clearInterval(interval);
  }, [raceId, racer1Id, racer1Rate, racer1AutoUpdate]);

  // Racer 2 update interval
  useEffect(() => {
    if (!showRacer2 || !raceId || !racer2Id || racer2Rate === 0 || !racer2AutoUpdate) return;
    const interval = setInterval(() => {
      formatResults(raceId, racer2Id).then(res => {
        if (res) setRacer2Results(res);
      });
    }, racer2Rate * 1000);
    return () => clearInterval(interval);
  }, [showRacer2, raceId, racer2Id, racer2Rate, racer2AutoUpdate]);

  return (
    <div style={{ padding: 24 }}>
      {rateLimitWarning && (
        <div style={{
          position: 'relative',
          width: '100%',
          marginBottom: 24,
          background: '#b22222',
          color: 'white',
          padding: '18px 32px',
          borderRadius: 8,
          border: '3px solid #a00',
          fontSize: '1.25rem',
          fontWeight: 'bold',
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 24,
          zIndex: 100
        }}>
          <span>⚠️ API rate limit reached. Data not updated. Please wait or adjust refresh rates.</span>
          <button
            style={{
              marginLeft: 12,
              padding: '6px 18px',
              background: 'white',
              color: '#b22222',
              border: '2px solid #b22222',
              borderRadius: 4,
              fontWeight: 'bold',
              fontSize: '1rem',
              cursor: 'pointer'
            }}
            onClick={() => setRateLimitWarning(false)}
          >
            Dismiss
          </button>
        </div>
      )}
      <div style={{ marginBottom: 12 }}>
        <label htmlFor="raceListRate">Race/Driver List Update Rate: </label>
        <select id="raceListRate" value={raceListRate} onChange={e => setRaceListRate(Number(e.target.value))}>
          <option value={0}>Off</option>
          <option value={15}>15s</option>
          <option value={30}>30s</option>
          <option value={60}>60s</option>
          <option value={90}>90s</option>
          <option value={120}>120s</option>
          <option value={150}>150s</option>
          <option value={180}>180s</option>
        </select>
      </div>
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
          <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
            <label htmlFor="racer1Rate">Update Rate: </label>
            <select id="racer1Rate" value={racer1Rate} onChange={e => setRacer1Rate(Number(e.target.value))}>
              <option value={0}>Off</option>
              <option value={15}>15s</option>
              <option value={30}>30s</option>
              <option value={60}>60s</option>
              <option value={90}>90s</option>
              <option value={120}>120s</option>
              <option value={150}>150s</option>
              <option value={180}>180s</option>
            </select>
            <label style={{ marginLeft: 12 }}>
              <input
                type="checkbox"
                checked={racer1AutoUpdate}
                onChange={e => setRacer1AutoUpdate(e.target.checked)}
                style={{ marginRight: 4 }}
              />
              Auto-update
            </label>
          </div>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              checked={showRacer2}
              onChange={e => setShowRacer2(e.target.checked)}
              style={{ marginRight: 8 }}
            />
            Enable Driver Comparison
          </label>
          {showRacer2 && (
            <>
              <label htmlFor="racer2Id" style={{ display: 'block', marginTop: 8 }}>Compare to Driver:</label>
              <select id="racer2Id" value={racer2Id} onChange={handleRacer2IdChange}>
                <option value="">Select a Driver</option>
                {racers && racers.Competitors && Object.keys(racers.Competitors).map((key) => (
                  <option key={key} value={key}>
                    {racers.Competitors[key].Number} - {racers.Competitors[key].FirstName} {racers.Competitors[key].LastName}
                  </option>
                ))}
              </select>
              <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                <label htmlFor="racer2Rate">Update Rate: </label>
                <select id="racer2Rate" value={racer2Rate} onChange={e => setRacer2Rate(Number(e.target.value))}>
                  <option value={0}>Off</option>
                  <option value={15}>15s</option>
                  <option value={30}>30s</option>
                  <option value={60}>60s</option>
                  <option value={90}>90s</option>
                  <option value={120}>120s</option>
                  <option value={150}>150s</option>
                  <option value={180}>180s</option>
                </select>
                <label style={{ marginLeft: 12 }}>
                  <input
                    type="checkbox"
                    checked={racer2AutoUpdate}
                    onChange={e => setRacer2AutoUpdate(e.target.checked)}
                    style={{ marginRight: 4 }}
                  />
                  Auto-update
                </label>
              </div>
            </>
          )}
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
        {showRacer2 && racer2Results && (
          <div style={{ border: '1px solid #02311e', borderRadius: 8, padding: 16, minWidth: 180 }}>
            <h4>Driver 2</h4>
            <div>Best Lap: {racer2Results.bestLapTime}</div>
            <div>Last Lap: {racer2Results.lastLapTime}</div>
            <div>Total Laps: {racer2Results.laps?.length || 0}</div>
          </div>
        )}
      </div>
      {/* Lap Times Chart */}
      {(racer1Results?.laps || (showRacer2 && racer2Results?.laps)) && (
        <div style={{ maxWidth: 900, margin: '0 auto 32px auto' }}>
          <LapTimesChart
            laps={Array.from({ length: lapCount }, (_, i) => {
              const lapIndex = (racer1Results?.laps?.length || 0) - lapCount + i;
              return {
                lapNumber: lapIndex + 1,
                lapTime: racer1Results?.laps?.[lapIndex]?.LapTime || '',
                lapTime2: showRacer2 ? (racer2Results?.laps?.[lapIndex]?.LapTime || '') : '',
              };
            }).filter(lap => lap.lapTime || lap.lapTime2)}
          />
        </div>
      )}
      {/* Lap Table */}
      {(racer1Results?.laps || (showRacer2 && racer2Results?.laps)) && (
        <div style={{ maxWidth: 900, margin: '0 auto 32px auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f5f5dc' }}>
                <th>Lap</th>
                <th>Driver 1 Lap Time</th>
                {showRacer2 && <th>Driver 2 Lap Time</th>}
                <th>Driver 1 Position</th>
                {showRacer2 && <th>Driver 2 Position</th>}
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
                    {showRacer2 && <td>{racer2Results?.laps?.[lapIndex]?.LapTime || '-'}</td>}
                    <td>{racer1Results?.laps?.[lapIndex]?.Position || '-'}</td>
                    {showRacer2 && <td>{racer2Results?.laps?.[lapIndex]?.Position || '-'}</td>}
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
