# Race Monitor API Documentation

## Endpoints

### 1. Get Current Races
- **URL:** `https://api.race-monitor.com/v2/Common/CurrentRaces`
- **Method:** POST
- **Parameters:**
  - `apiToken` (string, required)
  - `seriesID` (int, optional, default: 0)
- **Response:**
  - `Successful` (boolean)
  - `Races` (array of race objects)
    - `ID`, `Name`, `SeriesName`, `IsLive`, `ImageUrl`, etc.

### 2. Get Session (Drivers in Race)
- **URL:** `https://api.race-monitor.com/v2/Live/GetSession`
- **Method:** POST
- **Parameters:**
  - `apiToken` (string, required)
  - `raceID` (int, required)
- **Response:**
  - `Successful` (boolean)
  - `Session` (object)
    - `Competitors` (object of drivers)

### 3. Get Racer (Lap Data)
- **URL:** `https://api.race-monitor.com/v2/Live/GetRacer`
- **Method:** POST
- **Parameters:**
  - `apiToken` (string, required)
  - `raceID` (int, required)
  - `racerID` (string, required)
- **Response:**
  - `Successful` (boolean)
  - `Details`
    - `Competitor` (driver info)
    - `Laps` (array of lap objects)

## Usage Notes
- Minimize API calls due to limited key usage.
- Fetch races once, then fetch session/driver data as needed.
- Cache results in state where possible.

---

This file documents the Race Monitor API for quick onboarding and future reference.
