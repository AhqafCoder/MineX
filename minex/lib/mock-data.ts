// Mock data for MineX dashboard simulation

export interface TelemetryPoint {
  time: string;
  value: number;
}

export interface Alert {
  id: string;
  priority: "critical" | "high" | "medium" | "info";
  title: string;
  description: string;
  location: string;
  rover: string;
  timestamp: string;
  status: "active" | "acknowledged" | "dismissed";
}

export interface Waypoint {
  id: string;
  x: number;
  y: number;
  status: "completed" | "active" | "pending";
  label: string;
}

export const roverStatus = {
  id: "MINEX-01",
  status: "online" as "online" | "offline" | "emergency",
  battery: 78,
  signal: 96,
  speed: 1.2,
  distance: 428,
  heading: 142,
  motorTemp: 42,
  x: 385,
  y: 290,
};

export const missionData = {
  id: "MX-2026-041",
  name: "Tunnel Inspection",
  status: "active" as "active" | "paused" | "completed",
  progress: 68,
  totalDistance: 620,
  coveredDistance: 428,
  totalWaypoints: 12,
  completedWaypoints: 8,
  startTime: "14:22",
  estimatedEnd: "15:04",
  elapsedSeconds: 6138, // 01:42:18
  estimatedRemaining: 22,
};

export const detectionData = {
  human: {
    detected: true,
    confidence: 94,
    distance: 8.4,
    zone: "Tunnel B-04",
    x: 245,
    y: 165,
    width: 80,
    height: 120,
  },
  cellPhone: {
    detected: true,
    confidence: 67,
    distance: 9.1,
    x: 310,
    y: 175,
    width: 30,
    height: 50,
  },
};

export const environmentData = {
  temperature: 31,
  humidity: 68,
  gasLevel: "normal" as "normal" | "warning" | "critical",
  airQuality: "safe" as "safe" | "caution" | "danger",
  mq135: 142,
};

export const systemHealth = {
  edgeNode: "online" as "online" | "offline",
  raspberryPi: "healthy" as "healthy" | "degraded" | "offline",
  yolov8: "ready" as "ready" | "processing" | "offline",
  lidar: "online" as "online" | "offline",
  esp32cam: "online" as "online" | "offline",
  mpu6050: "online" as "online" | "offline",
  qmc6310: "online" as "online" | "offline",
  dht22: "online" as "online" | "offline",
  mq135: "online" as "online" | "offline",
  sqlite: "synced" as "synced" | "local" | "offline",
  mongodb: "connected" as "connected" | "disconnected",
  tcp: "streaming" as "streaming" | "connecting" | "offline",
};

export const alerts: Alert[] = [
  {
    id: "ALT-001",
    priority: "high",
    title: "Human detected in restricted zone",
    description: "YOLOv8 detected human presence in Tunnel B-04 with 94% confidence at 8.4m range",
    location: "Tunnel B-04",
    rover: "MINEX-01",
    timestamp: "2 minutes ago",
    status: "active",
  },
  {
    id: "ALT-002",
    priority: "medium",
    title: "Obstacle detected ahead",
    description: "LiDAR sensor detected stationary obstacle at 3.2m. Autonomous avoidance engaged.",
    location: "Tunnel A-07",
    rover: "MINEX-01",
    timestamp: "5 minutes ago",
    status: "active",
  },
  {
    id: "ALT-003",
    priority: "info",
    title: "Mission waypoint completed",
    description: "Waypoint WP-08 reached and logged. Proceeding to WP-09.",
    location: "Junction C",
    rover: "MINEX-01",
    timestamp: "8 minutes ago",
    status: "acknowledged",
  },
  {
    id: "ALT-004",
    priority: "info",
    title: "MongoDB sync completed",
    description: "428 telemetry records synchronized to MongoDB Atlas successfully.",
    location: "System",
    rover: "MINEX-01",
    timestamp: "12 minutes ago",
    status: "acknowledged",
  },
  {
    id: "ALT-005",
    priority: "medium",
    title: "Battery below 80%",
    description: "Battery at 78%. Estimated 2h 14m of operation remaining at current load.",
    location: "System",
    rover: "MINEX-01",
    timestamp: "18 minutes ago",
    status: "acknowledged",
  },
];

// Generate realistic telemetry history
function generateHistory(
  base: number,
  variance: number,
  points: number = 20
): TelemetryPoint[] {
  const now = Date.now();
  return Array.from({ length: points }, (_, i) => ({
    time: new Date(now - (points - i) * 30000).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    value: Math.max(0, base + (Math.random() - 0.5) * variance * 2),
  }));
}

export const telemetryHistory = {
  speed: generateHistory(1.2, 0.4),
  battery: generateHistory(80, 3),
  motorTemp: generateHistory(42, 4),
  signal: generateHistory(94, 5),
  gasLevel: generateHistory(140, 15),
  distance: Array.from({ length: 20 }, (_, i) => ({
    time: new Date(Date.now() - (20 - i) * 30000).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    value: 200 + i * 12 + Math.random() * 5,
  })),
};

export const waypoints: Waypoint[] = [
  { id: "WP-01", x: 80, y: 350, status: "completed", label: "WP-01" },
  { id: "WP-02", x: 130, y: 300, status: "completed", label: "WP-02" },
  { id: "WP-03", x: 190, y: 280, status: "completed", label: "WP-03" },
  { id: "WP-04", x: 240, y: 260, status: "completed", label: "WP-04" },
  { id: "WP-05", x: 290, y: 250, status: "completed", label: "WP-05" },
  { id: "WP-06", x: 340, y: 260, status: "completed", label: "WP-06" },
  { id: "WP-07", x: 370, y: 280, status: "completed", label: "WP-07" },
  { id: "WP-08", x: 385, y: 290, status: "active", label: "WP-08" },
  { id: "WP-09", x: 420, y: 270, status: "pending", label: "WP-09" },
  { id: "WP-10", x: 460, y: 250, status: "pending", label: "WP-10" },
  { id: "WP-11", x: 500, y: 240, status: "pending", label: "WP-11" },
  { id: "WP-12", x: 540, y: 260, status: "pending", label: "WP-12" },
];

export const fleetData = [
  { id: "MINEX-01", status: "online" as const, battery: 78, mission: "Tunnel Inspection", signal: 96 },
  { id: "MINEX-02", status: "online" as const, battery: 91, mission: "Shaft Survey", signal: 88 },
  { id: "MINEX-03", status: "mission" as const, battery: 64, mission: "Emergency Response", signal: 74 },
  { id: "MINEX-04", status: "standby" as const, battery: 100, mission: "—", signal: 0 },
];

export const missionReports = [
  {
    id: "MX-2026-040",
    name: "Sector 7 Inspection",
    date: "2026-09-07",
    duration: "2h 18m",
    distance: 1240,
    humanDetections: 0,
    hazards: 2,
    status: "completed",
  },
  {
    id: "MX-2026-039",
    name: "Emergency Response - B Block",
    date: "2026-09-05",
    duration: "1h 44m",
    distance: 890,
    humanDetections: 3,
    hazards: 5,
    status: "completed",
  },
  {
    id: "MX-2026-038",
    name: "Weekly Tunnel Sweep",
    date: "2026-09-02",
    duration: "4h 02m",
    distance: 2100,
    humanDetections: 1,
    hazards: 3,
    status: "completed",
  },
];
