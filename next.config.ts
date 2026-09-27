import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Let phones on the same network load dev assets and HMR via the Mac's LAN IP.
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*", "172.*.*.*", "*.local"],
};

export default nextConfig;
