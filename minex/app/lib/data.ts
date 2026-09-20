// ─── Shared data for all MineX pages ───────────────────────────────────────

export const features = [
  {
    icon: "🎥",
    title: "4K Night Vision",
    desc: "Dual-channel night vision cameras with infrared illuminators deliver crystal-clear imagery even in total darkness at depths exceeding 300 m.",
    detail:
      "Equipped with Sony IMX477 sensors paired with high-intensity IR LEDs, MineX can capture usable footage at 0 lux ambient light. The 120° wide-angle lens captures the full tunnel cross-section while the digital zoom allows operators to inspect hairline cracks in rock faces from 10 m away.",
  },
  {
    icon: "📡",
    title: "Real-Time Streaming",
    desc: "Wi-Fi 6 and long-range RF backup ensure uninterrupted 1080p live video feed and telemetry to the surface command centre.",
    detail:
      "Primary link uses 802.11ax (Wi-Fi 6) with MIMO antennas for sub-80 ms latency. When Wi-Fi coverage drops, the LoRa 868 MHz fallback kicks in automatically, maintaining telemetry at up to 3 km line-of-sight through rock and steel.",
  },
  {
    icon: "🧭",
    title: "Smart Navigation",
    desc: "LIDAR-assisted SLAM mapping combined with ultrasonic obstacle detection enables full autonomous pathfinding in unmapped tunnels.",
    detail:
      "RPLidar A1M8 generates 360° point clouds at 10 Hz. The onboard Jetson Nano runs a custom SLAM pipeline (GMapping) to build and update the tunnel map in real time, while four HC-SR04 ultrasonic sensors handle close-range collision avoidance below 50 cm.",
  },
  {
    icon: "⚠️",
    title: "Gas Detection",
    desc: "Multi-gas sensor array continuously monitors CO, CH₄, O₂, H₂S, and NO₂ levels with instant surface alerts on threshold breach.",
    detail:
      "The MQ-series array samples every 200 ms. Readings are fused with temperature and humidity data for accurate compensation. When any gas exceeds MSHA-defined limits, the rover immediately transmits an alert payload, activates a local siren, and initiates auto-return.",
  },
  {
    icon: "🔋",
    title: "Extended Runtime",
    desc: "High-density LiFePO₄ battery pack delivers 8 hours of active runtime with intelligent power management.",
    detail:
      "The 4S4P 20 Ah pack runs all motors, sensors, and compute simultaneously for 8 hours. A custom BMS handles cell balancing, over-current protection, and communicates SoC to the surface in real time. Auto-sleep mode extends standby to 24 hours when stationary.",
  },
  {
    icon: "💪",
    title: "Rugged Design",
    desc: "IP67-rated military-grade chassis withstands rock impacts, water ingress, dust, and extreme temperature swings.",
    detail:
      "The outer shell is 4 mm aluminium-acrylic composite tested to MIL-STD-810H for shock (40 g, 11 ms half-sine), vibration, humidity (95% RH), and temperature (-20 °C to +60 °C). All cable glands are IP68-rated and connector shells are stainless steel.",
  },
];

export const hardwareModules = [
  {
    icon: "📡",
    label: "Top Module",
    title: "Sensor Array",
    desc: "The elevated sensor crown gives MineX 360° environmental awareness with zero blind spots.",
    tags: ["Dual Ultrasonic", "Night Vision", "LIDAR", "Gas Sensor", "IMU"],
    specs: [
      { label: "LIDAR Range", value: "12 m @ 10 Hz" },
      { label: "Camera", value: "Sony IMX477, 1080p–4K" },
      { label: "Gas Sensors", value: "MQ-2 / 4 / 7 / 135" },
      { label: "IMU", value: "MPU-6050 6-DOF" },
    ],
  },
  {
    icon: "🏠",
    label: "Main Module",
    title: "Core Enclosure",
    desc: "Hardened IP67 enclosure houses the compute and power electronics, sealed against dust and water jets.",
    tags: ["Arduino Mega", "Motor Drivers", "Acrylic Housing", "RF Module", "Relay Board"],
    specs: [
      { label: "Main MCU", value: "Arduino Mega 2560" },
      { label: "AI Co-processor", value: "NVIDIA Jetson Nano" },
      { label: "Motor Driver", value: "L298N × 2 (dual H-bridge)" },
      { label: "RF Module", value: "LoRa SX1278 868 MHz" },
    ],
  },
  {
    icon: "⚙️",
    label: "Bottom Module",
    title: "Drive System",
    desc: "Six-wheel differential drive on rubber treads conquers slopes up to 45° and 12 cm ground clearance.",
    tags: ["DC Motors", "Rubber Treads", "Steel Chassis", "LiFePO₄ Pack", "Encoders"],
    specs: [
      { label: "Motors", value: "775-series DC, 200 RPM" },
      { label: "Tread Material", value: "NBR Rubber, anti-slip" },
      { label: "Battery", value: "LiFePO₄ 4S4P 20 Ah" },
      { label: "Max Speed", value: "1.2 m/s on flat terrain" },
    ],
  },
];

export const capabilities = [
  {
    icon: "🗺️",
    title: "3D Environment Mapping",
    desc: "SLAM-powered point-cloud generation builds real-time 3D maps of unmapped mine tunnels for surface operators.",
  },
  {
    icon: "🚨",
    title: "Gas Alert System",
    desc: "Instant multi-channel alerts via RF and Wi-Fi when hazardous gas concentrations exceed MSHA safety thresholds.",
  },
  {
    icon: "🏔️",
    title: "All-Terrain Mobility",
    desc: "Rubber treads and articulated chassis handle loose shale, wet rock, puddles, and 45° inclines effortlessly.",
  },
  {
    icon: "🔍",
    title: "Remote Inspection",
    desc: "Operators remotely inspect structurally compromised areas without risking human life via HD live video.",
  },
  {
    icon: "🤖",
    title: "Autonomous Mode",
    desc: "Full AI-driven autonomous exploration with auto-return-to-base when battery drops below 20%.",
  },
  {
    icon: "🛡️",
    title: "Military-Grade Durability",
    desc: "Tested to MIL-STD-810H for shock, vibration, humidity, and temperature extremes.",
  },
];

export type SpecRow = { label: string; value: string };
export type SpecsData = Record<string, SpecRow[]>;

export const specs: SpecsData = {
  Mechanical: [
    { label: "Dimensions (L × W × H)", value: "420 × 320 × 280 mm" },
    { label: "Weight", value: "6.8 kg (incl. battery)" },
    { label: "Chassis Material", value: "Mil-spec Aluminium + Acrylic" },
    { label: "IP Rating", value: "IP67 (Dust & Water Jet Proof)" },
    { label: "Max Slope", value: "45° continuous, 55° burst" },
    { label: "Ground Clearance", value: "120 mm" },
    { label: "Track Width", value: "320 mm" },
    { label: "Drive Type", value: "6-Wheel Differential Drive" },
  ],
  Electronics: [
    { label: "Main Controller", value: "Arduino Mega 2560 + Jetson Nano" },
    { label: "Motor Drivers", value: "Dual L298N H-Bridge (×2)" },
    { label: "Wireless (Primary)", value: "Wi-Fi 6 (802.11ax), 2.4 / 5 GHz" },
    { label: "Wireless (Backup)", value: "LoRa 868 MHz (3 km range)" },
    { label: "Video Encoder", value: "H.264 / H.265, up to 4K @ 30 fps" },
    { label: "Operating Voltage", value: "12 V / 5 V regulated rails" },
    { label: "Comm Latency", value: "< 80 ms (Wi-Fi), < 300 ms (LoRa)" },
  ],
  Power: [
    { label: "Battery Type", value: "LiFePO₄ 18650 (4S4P pack)" },
    { label: "Capacity", value: "20 Ah @ 14.8 V (296 Wh)" },
    { label: "Discharge Rate", value: "2C continuous, 4C burst" },
    { label: "Runtime (Active)", value: "8 hours @ normal load" },
    { label: "Runtime (Idle)", value: "24 hours standby" },
    { label: "Charge Time", value: "4 hours (standard), 2 hours (fast)" },
    { label: "Peak Power Draw", value: "85 W (drive + all sensors)" },
  ],
  Sensors: [
    { label: "Ultrasonic", value: "HC-SR04 × 4 (Front / Rear / Left / Right)" },
    { label: "LIDAR", value: "RPLidar A1M8 (360°, 12 m range)" },
    { label: "Camera", value: "Sony IMX477 (1080p / 4K, IR + visible)" },
    { label: "Gas Detection", value: "MQ-2 / MQ-4 / MQ-7 / MQ-135 array" },
    { label: "Temperature / Humidity", value: "DHT22 (±0.2 °C / ±2% RH)" },
    { label: "IMU", value: "MPU-6050 6-DOF (Gyro + Accel)" },
    { label: "Ambient Light", value: "BH1750 (1–65535 lux)" },
  ],
};

export const teamMembers = [
  {
    name: "Chandan Kumar",
    role: "Lead Developer & Systems Architect",
    emoji: "👨‍💻",
    desc: "Full-stack development, embedded systems, autonomous navigation algorithms and overall system integration.",
  },
  {
    name: "Team Member 2",
    role: "Hardware & Electronics Engineer",
    emoji: "🔧",
    desc: "PCB design, sensor integration, motor driver circuits and power management system.",
  },
  {
    name: "Team Member 3",
    role: "Mechanical Design & Chassis",
    emoji: "⚙️",
    desc: "CAD modelling, chassis fabrication, tread system design and IP67 enclosure engineering.",
  },
  {
    name: "Team Member 4",
    role: "AI & Computer Vision",
    emoji: "🤖",
    desc: "SLAM implementation, object detection, autonomous pathfinding and Jetson Nano optimisation.",
  },
  {
    name: "Team Member 5",
    role: "Communication & RF Systems",
    emoji: "📡",
    desc: "Wi-Fi 6 networking, LoRa RF backup, telemetry protocol design and real-time data streaming.",
  },
  {
    name: "Team Member 6",
    role: "Safety Systems & QA",
    emoji: "🛡️",
    desc: "Gas detection calibration, MIL-STD-810H testing, safety protocol development and documentation.",
  },
];

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/features", label: "Features" },
  { href: "/hardware", label: "Hardware" },
  { href: "/capabilities", label: "Capabilities" },
  { href: "/about", label: "About" },
];
