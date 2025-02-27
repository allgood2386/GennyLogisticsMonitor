const API_BASE_URL = 'https://api.race-monitor.com/v2';
const RACE_MONITOR_KEY: string = (process.env.REACT_APP_RACE_MONITOR_API_KEY as string);

export const fetchRaces = async () => {
  const url = new URL(`${API_BASE_URL}/Common/CurrentRaces`);
  url.searchParams.append('apiToken', RACE_MONITOR_KEY);
  const response = await fetch(url.toString(), {
    method: 'POST'
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const raceData = await response.json();
  return raceData.Races;
};

export const fetchSession = async (raceId: string) => {
  const url = new URL(`${API_BASE_URL}/Live/GetSession`);
  url.searchParams.append('raceID', raceId);
  url.searchParams.append('apiToken', RACE_MONITOR_KEY);
  const response = await fetch(url.toString(), {
    method: 'POST'
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const sessionData = await response.json();
  return sessionData.Session;
};

export const fetchRacer = async (raceId: string, racerId: string) => {
  const url = new URL(`${API_BASE_URL}/Live/GetRacer`);
  url.searchParams.append('raceID', raceId);
  url.searchParams.append('racerID', racerId);
  url.searchParams.append('apiToken', RACE_MONITOR_KEY);

  const response = await fetch(url.toString(), {
    method: 'POST'
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const racerData = await response.json();
  return racerData;
};