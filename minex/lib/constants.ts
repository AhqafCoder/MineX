export const SITE_NAME = "MineX";
export const SITE_TAGLINE = "Intelligent Rover. Safer Mines.";
export const ROVER_ID = "MINEX-01";
export const MISSION_ID = "MX-2026-041";
export const MISSION_NAME = "Tunnel Inspection";

export const ROVER_COMMAND_CENTER_URL = "http://winner.local:8080/";

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Features", href: "/features" },
  { label: "Technology", href: "/technology" },
  { label: "Safety", href: "/safety" },
  { label: "Command Center", href: ROVER_COMMAND_CENTER_URL },
];

export const DASHBOARD_NAV = [
  { label: "Overview", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "Live Mission", href: "/dashboard/mission", icon: "Target" },
  { label: "Map & LiDAR", href: "/dashboard/map", icon: "Map" },
  { label: "Vision", href: "/dashboard/vision", icon: "Camera" },
  { label: "Environment", href: "/dashboard/environment", icon: "Thermometer" },
  { label: "Telemetry", href: "/dashboard/telemetry", icon: "Activity" },
  { label: "Alerts", href: "/dashboard/alerts", icon: "AlertTriangle" },
  { label: "Reports", href: "/dashboard/reports", icon: "FileText" },
];

export const COLORS = {
  primary: "#0a0a0f",
  graphite: "#111118",
  charcoal: "#1a1a24",
  cyan: "#00d4ff",
  blue: "#0080ff",
  green: "#00ff88",
  amber: "#ffaa00",
  red: "#ff3333",
  border: "#1e2030",
  text: {
    primary: "#e8eaf0",
    secondary: "#8892a4",
    muted: "#4a5568",
  },
};
