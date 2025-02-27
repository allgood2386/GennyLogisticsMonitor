import type { NextConfig } from "next";

const RACE_MONITOR_KEY: string = (process.env.REACT_APP_RACE_MONITOR_API_KEY as string);
const nextConfig: NextConfig = {
  /* config options here */
  env: {
    REACT_APP_RACE_MONITOR_API_KEY: RACE_MONITOR_KEY
  }
};

export default nextConfig;
