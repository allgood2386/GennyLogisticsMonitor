const API_BASE_URL = 'https://api.race-monitor.com/v2';

export const fetchRaces = async (apiToken: string) => {
  const url = new URL(`${API_BASE_URL}/Common/CurrentRaces`);
  url.searchParams.append('apiToken', apiToken);
  const response = await fetch(url.toString(), {
    method: 'POST'
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const raceData = await response.json();
  return raceData.Races;
};

export const fetchRacers = async (raceId: string, apiToken: string) => {
  const url = new URL(`${API_BASE_URL}/Live/GetSession`);
  url.searchParams.append('raceID', raceId);
  url.searchParams.append('apiToken', apiToken);
  const response = await fetch(url.toString(), {
    method: 'POST'
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const sessionData = await response.json();
  return sessionData.Session.Competitors;
};

export const fetchRacer = async (raceId: string, racerId: string, apiToken: string) => {
  const url = new URL(`${API_BASE_URL}/Live/GetRacer`);
  url.searchParams.append('raceID', raceId);
  url.searchParams.append('racerID', racerId);
  url.searchParams.append('apiToken', apiToken);
  const response = await fetch(url.toString(), {
    method: 'POST'
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const racerData = await response.json();
  return racerData;
};

export const fetchRaceSession = async (raceId: string, racerId: string, apiToken: string) => {
  const url = new URL(`${API_BASE_URL}/Live/GetSession`);
  url.searchParams.append('raceID', raceId);
  url.searchParams.append('racerID', racerId);
  url.searchParams.append('apiToken', apiToken);
  const response = await fetch(url.toString(), {
    method: 'POST'
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const sessionData = await response.json();
  return sessionData;
};