"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { 
  Compass, 
  Layers, 
  Maximize2, 
  Minimize2, 
  RotateCcw, 
  Play, 
  Pause, 
  Eye, 
  Flame, 
  Radio, 
  Activity, 
  Crosshair,
  Sliders,
  ChevronRight,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { DashboardState } from "@/app/dashboard/page";

interface Props {
  state?: DashboardState;
  heightClass?: string;
}

// Tunnel waypoints for the mine network (expanded multi-level mine)
const TUNNEL_NODES = [
  // Main shaft (Level 1)
  { id: "A0", x: -50, y: 0, z: 0, label: "Mine Entrance / Portal" },
  { id: "A1", x: -35, y: -2, z: 0, label: "Main Incline Shaft" },
  { id: "A2", x: -15, y: -4, z: 0, label: "Station Alpha (Sub-Level 1)" },
  { id: "A3", x: 10, y: -6, z: 0, label: "Central Drift Junction" },
  { id: "A4", x: 30, y: -8, z: 0, label: "Extraction Stope 101" },
  { id: "A5", x: 50, y: -10, z: 0, label: "Dead End / Deep Heading" },
  // North branch
  { id: "B1", x: 10, y: -6, z: 22, label: "North Crosscut 1" },
  { id: "B2", x: 25, y: -7, z: 40, label: "Ventilation Shaft North" },
  { id: "B3", x: 45, y: -9, z: 35, label: "Abandoned Stope N-2" },
  // South branch
  { id: "C1", x: -15, y: -4, z: -22, label: "South Haulage Drift" },
  { id: "C2", x: 5, y: -5, z: -40, label: "Substation South" },
  { id: "C3", x: 28, y: -7, z: -30, label: "Ore Pass 4B" },
  // Deep level (Level 2)
  { id: "D1", x: 10, y: -14, z: 0, label: "Level 2 – Decline Access" },
  { id: "D2", x: 30, y: -16, z: 0, label: "Level 2 – Loading Bay" },
  { id: "D3", x: 50, y: -18, z: 0, label: "Level 2 – Stope Face 202" },
  // East wing
  { id: "E1", x: 30, y: -8, z: 18, label: "East Crosscut Connector" },
  { id: "E2", x: 50, y: -10, z: 28, label: "East Ore Body" },
  // West connector (connects south and deep level)
  { id: "F1", x: -15, y: -8, z: -22, label: "West Ramp Entry" },
  { id: "F2", x: -15, y: -12, z: -10, label: "Pump Station W-1" },
  // Ventilation rise
  { id: "V1", x: 25, y: -3, z: 40, label: "Vent Rise Surface" },
  { id: "V2", x: 50, y: -5, z: 0, label: "Return Air Raise" },
];

// Gas concentration hotspots in 3D space
interface GasHotspot {
  id: string;
  x: number;
  y: number;
  z: number;
  type: "CH4 (Methane)" | "CO (Carbon Monoxide)" | "H2S (Hydrogen Sulfide)" | "Normal Air" | "NO2 (Nitrogen Dioxide)" | "SO2 (Sulfur Dioxide)";
  level: "safe" | "warning" | "critical";
  ppm: number;
  radius: number;
  chamber: string;
}

const GAS_HOTSPOTS: GasHotspot[] = [
  // Main shaft
  { id: "G1", x: -50, y: 0, z: 0, type: "Normal Air", level: "safe", ppm: 12, radius: 8, chamber: "Portal Area" },
  { id: "G2", x: -15, y: -4, z: 0, type: "Normal Air", level: "safe", ppm: 28, radius: 9, chamber: "Station Alpha" },
  { id: "G3", x: 30, y: -8, z: 0, type: "CO (Carbon Monoxide)", level: "warning", ppm: 72, radius: 8, chamber: "Extraction Stope 101" },
  { id: "G4", x: 50, y: -10, z: 0, type: "CH4 (Methane)", level: "critical", ppm: 310, radius: 11, chamber: "Deep Heading" },
  // North branch
  { id: "G5", x: 10, y: -6, z: 22, type: "CO (Carbon Monoxide)", level: "warning", ppm: 85, radius: 7, chamber: "North Crosscut 1" },
  { id: "G6", x: 45, y: -9, z: 35, type: "CH4 (Methane)", level: "critical", ppm: 240, radius: 10, chamber: "Abandoned Stope N-2" },
  { id: "G7", x: 25, y: -7, z: 40, type: "Normal Air", level: "safe", ppm: 38, radius: 7, chamber: "Vent Shaft North" },
  // South branch
  { id: "G8", x: 5, y: -5, z: -40, type: "H2S (Hydrogen Sulfide)", level: "warning", ppm: 45, radius: 7, chamber: "Substation South" },
  { id: "G9", x: 28, y: -7, z: -30, type: "CO (Carbon Monoxide)", level: "warning", ppm: 65, radius: 8, chamber: "Ore Pass 4B" },
  // Deep level
  { id: "G10", x: 10, y: -14, z: 0, type: "NO2 (Nitrogen Dioxide)", level: "warning", ppm: 55, radius: 8, chamber: "Level 2 Decline" },
  { id: "G11", x: 30, y: -16, z: 0, type: "CH4 (Methane)", level: "critical", ppm: 280, radius: 10, chamber: "Loading Bay L2" },
  { id: "G12", x: 50, y: -18, z: 0, type: "CH4 (Methane)", level: "critical", ppm: 420, radius: 12, chamber: "Stope Face 202" },
  // East wing
  { id: "G13", x: 50, y: -10, z: 28, type: "SO2 (Sulfur Dioxide)", level: "warning", ppm: 52, radius: 7, chamber: "East Ore Body" },
  // West connector
  { id: "G14", x: -15, y: -12, z: -10, type: "Normal Air", level: "safe", ppm: 22, radius: 7, chamber: "Pump Station W-1" },
  // Near portal (fresh air)
  { id: "G15", x: -35, y: -2, z: 0, type: "Normal Air", level: "safe", ppm: 8, radius: 9, chamber: "Incline Shaft" },
];

// Path waypoints for rover patrol loop (extended to cover all branches)
const ROVER_PATROL_PATH = [
  // Start at portal, go down main shaft
  new THREE.Vector3(-50, 0, 0),
  new THREE.Vector3(-35, -2, 0),
  new THREE.Vector3(-15, -4, 0),
  new THREE.Vector3(10, -6, 0),
  // North branch exploration
  new THREE.Vector3(10, -6, 22),
  new THREE.Vector3(25, -7, 40),
  new THREE.Vector3(45, -9, 35),
  new THREE.Vector3(25, -7, 40),
  new THREE.Vector3(10, -6, 22),
  new THREE.Vector3(10, -6, 0),
  // Continue main shaft east
  new THREE.Vector3(30, -8, 0),
  // East wing detour
  new THREE.Vector3(30, -8, 18),
  new THREE.Vector3(50, -10, 28),
  new THREE.Vector3(30, -8, 18),
  new THREE.Vector3(30, -8, 0),
  // Deep heading
  new THREE.Vector3(50, -10, 0),
  new THREE.Vector3(30, -8, 0),
  // Drop to Level 2
  new THREE.Vector3(10, -6, 0),
  new THREE.Vector3(10, -14, 0),
  new THREE.Vector3(30, -16, 0),
  new THREE.Vector3(50, -18, 0),
  new THREE.Vector3(30, -16, 0),
  new THREE.Vector3(10, -14, 0),
  new THREE.Vector3(10, -6, 0),
  // Back to main and south branch
  new THREE.Vector3(-15, -4, 0),
  new THREE.Vector3(-15, -4, -22),
  new THREE.Vector3(5, -5, -40),
  new THREE.Vector3(28, -7, -30),
  new THREE.Vector3(5, -5, -40),
  new THREE.Vector3(-15, -4, -22),
  // West connector
  new THREE.Vector3(-15, -8, -22),
  new THREE.Vector3(-15, -12, -10),
  new THREE.Vector3(-15, -8, -22),
  new THREE.Vector3(-15, -4, -22),
  new THREE.Vector3(-15, -4, 0),
  // Return to portal
  new THREE.Vector3(-35, -2, 0),
];

export default function MineSlamMap3D({ state, heightClass = "h-[560px]" }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Layer Toggles
  const [showPointCloud, setShowPointCloud] = useState(true);
  const [showTunnelMesh, setShowTunnelMesh] = useState(true);
  const [showGasMap, setShowGasMap] = useState(true);
  const [showTrajectory, setShowTrajectory] = useState(true);
  const [showLidarBeams, setShowLidarBeams] = useState(true);
  const [showArches, setShowArches] = useState(true);

  // Camera & Mode Controls
  const [cameraMode, setCameraMode] = useState<"orbit" | "topdown" | "chase" | "fpv">("orbit");
  const [isPatrolling, setIsPatrolling] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedHotspot, setSelectedHotspot] = useState<GasHotspot | null>(null);

  // SLAM Realtime Stats
  const [slamStats, setSlamStats] = useState({
    pointCount: 32840,
    mappedArea: 3200, // m²
    loopClosures: 34,
    roverX: -15.0,
    roverY: -4.0,
    roverZ: 0.0,
    roverYaw: 0,
    currentGas: "Normal (28 ppm)",
    currentChamber: "Station Alpha",
  });

  // ─── Mutable refs so the animation loop always reads current values ───
  // Without these, the useEffect closure captures stale state, and worse,
  // including them in the dependency array tears down the entire WebGL scene
  // on every change (destroying OrbitControls interactivity).
  const cameraModeRef = useRef(cameraMode);
  const isPatrollingRef = useRef(isPatrolling);
  const stateRef = useRef(state);
  const slamStatsThrottleRef = useRef(0); // frame counter for throttled stats update

  // Keep refs in sync with React state
  useEffect(() => { cameraModeRef.current = cameraMode; }, [cameraMode]);
  useEffect(() => { isPatrollingRef.current = isPatrolling; }, [isPatrolling]);
  useEffect(() => { stateRef.current = state; }, [state]);

  // Scene references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const roverGroupRef = useRef<THREE.Group | null>(null);
  const lidarRaysRef = useRef<THREE.LineSegments | null>(null);
  const pointCloudRef = useRef<THREE.Points | null>(null);
  const tunnelGroupRef = useRef<THREE.Group | null>(null);
  const gasGroupRef = useRef<THREE.Group | null>(null);
  const trajectoryLineRef = useRef<THREE.Line | null>(null);
  const archesGroupRef = useRef<THREE.Group | null>(null);

  // Animation variables
  const animFrameIdRef = useRef<number | null>(null);
  const patrolProgressRef = useRef(0);
  const pathCurveRef = useRef<THREE.CatmullRomCurve3 | null>(null);

  // Initialize Three.js scene — runs ONCE on mount only
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!mountRef.current) return;
    const mount = mountRef.current;
    const width = mount.clientWidth;
    const height = mount.clientHeight;

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x06080d);
    scene.fog = new THREE.FogExp2(0x06080d, 0.015);
    sceneRef.current = scene;

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(-45, 35, 55);
    cameraRef.current = camera;

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;
    mount.appendChild(renderer.domElement);

    // 4. Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.maxPolarAngle = Math.PI / 2 + 0.2; // Allow slight upward angle inside mine
    controls.minDistance = 3;
    controls.maxDistance = 180;
    controls.target.set(0, -8, 0);
    controlsRef.current = controls;

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0x22263a, 1.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x8fa8ff, 0.6);
    dirLight.position.set(30, 50, 20);
    scene.add(dirLight);

    // Underground grid floor plane
    const gridHelper = new THREE.GridHelper(160, 50, 0x24324f, 0x111927);
    gridHelper.position.y = -22;
    scene.add(gridHelper);

    // 6. Build 3D Mine Tunnel Network
    const tunnelGroup = new THREE.Group();
    const archesGroup = new THREE.Group();
    tunnelGroupRef.current = tunnelGroup;
    archesGroupRef.current = archesGroup;

    // Generate CatmullRom splines for tunnels — expanded multi-level mine
    const mainBranch = [
      new THREE.Vector3(-50, 0, 0),
      new THREE.Vector3(-35, -2, 0),
      new THREE.Vector3(-15, -4, 0),
      new THREE.Vector3(10, -6, 0),
      new THREE.Vector3(30, -8, 0),
      new THREE.Vector3(50, -10, 0),
    ];
    const northBranch = [
      new THREE.Vector3(10, -6, 0),
      new THREE.Vector3(10, -6, 22),
      new THREE.Vector3(25, -7, 40),
      new THREE.Vector3(45, -9, 35),
    ];
    const southBranch = [
      new THREE.Vector3(-15, -4, 0),
      new THREE.Vector3(-15, -4, -22),
      new THREE.Vector3(5, -5, -40),
      new THREE.Vector3(28, -7, -30),
    ];
    // Deep level (Level 2) — vertical decline then horizontal
    const deepLevelDecline = [
      new THREE.Vector3(10, -6, 0),
      new THREE.Vector3(10, -10, 0),
      new THREE.Vector3(10, -14, 0),
    ];
    const deepLevelDrift = [
      new THREE.Vector3(10, -14, 0),
      new THREE.Vector3(30, -16, 0),
      new THREE.Vector3(50, -18, 0),
    ];
    // East wing connector
    const eastWing = [
      new THREE.Vector3(30, -8, 0),
      new THREE.Vector3(30, -8, 18),
      new THREE.Vector3(50, -10, 28),
    ];
    // West connector ramp (south branch down to pump station)
    const westConnector = [
      new THREE.Vector3(-15, -4, -22),
      new THREE.Vector3(-15, -8, -22),
      new THREE.Vector3(-15, -12, -10),
    ];
    // Ventilation shaft rise (north branch up to surface)
    const ventShaft = [
      new THREE.Vector3(25, -7, 40),
      new THREE.Vector3(25, -5, 40),
      new THREE.Vector3(25, -3, 40),
    ];

    const branches = [mainBranch, northBranch, southBranch, deepLevelDecline, deepLevelDrift, eastWing, westConnector, ventShaft];

    // Helper to create hollow tunnel tube mesh & arches
    branches.forEach((pts) => {
      const curve = new THREE.CatmullRomCurve3(pts);
      const tubeGeo = new THREE.TubeGeometry(curve, 64, 4.2, 12, false);
      const tubeMat = new THREE.MeshStandardMaterial({
        color: 0x1b2438,
        roughness: 0.85,
        metalness: 0.1,
        wireframe: false,
        side: THREE.BackSide, // Visible from inside the tunnel
        transparent: true,
        opacity: 0.85,
      });
      const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
      tunnelGroup.add(tubeMesh);

      // Outer wireframe overlay to give high-tech SLAM mesh look
      const wireGeo = new THREE.TubeGeometry(curve, 32, 4.25, 8, false);
      const wireMat = new THREE.MeshBasicMaterial({
        color: 0x334d77,
        wireframe: true,
        transparent: true,
        opacity: 0.25,
      });
      tunnelGroup.add(new THREE.Mesh(wireGeo, wireMat));

      // Add steel support arches along the tunnel
      const sampleCount = Math.max(2, Math.floor(curve.getLength() / 4.5));
      for (let i = 0; i <= sampleCount; i++) {
        const t = i / sampleCount;
        const pos = curve.getPoint(t);
        const tangent = curve.getTangent(t);

        const archGeo = new THREE.TorusGeometry(4.0, 0.12, 8, 24, Math.PI);
        const archMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.4, metalness: 0.8 });
        const archMesh = new THREE.Mesh(archGeo, archMat);
        archMesh.position.copy(pos);
        archMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tangent);
        archMesh.rotateX(Math.PI / 2);
        archMesh.rotateZ(Math.PI / 2);
        archesGroup.add(archMesh);
      }
    });

    scene.add(tunnelGroup);
    scene.add(archesGroup);

    // 7. Create SLAM Point Cloud (32,000+ points sampled around tunnel surfaces + random rock features)
    const pointsCount = 32000;
    const pointPositions = new Float32Array(pointsCount * 3);
    const pointColors = new Float32Array(pointsCount * 3);

    let pIdx = 0;
    branches.forEach((pts) => {
      const curve = new THREE.CatmullRomCurve3(pts);
      const ptsPerBranch = Math.floor(pointsCount / branches.length);

      for (let i = 0; i < ptsPerBranch; i++) {
        const t = Math.random();
        const center = curve.getPoint(t);
        const tangent = curve.getTangent(t);

        // Random radial angle and distance around the tunnel wall
        const theta = Math.random() * Math.PI * 2;
        const radius = 3.6 + (Math.random() - 0.5) * 1.2; // wall jitter/roughness

        // Build orthogonal basis
        const normal = new THREE.Vector3(0, 1, 0).cross(tangent).normalize();
        if (normal.length() < 0.1) normal.set(1, 0, 0);
        const binormal = tangent.clone().cross(normal).normalize();

        const offset = normal.clone().multiplyScalar(Math.cos(theta) * radius)
          .add(binormal.clone().multiplyScalar(Math.sin(theta) * radius));

        const pt = center.clone().add(offset);
        pointPositions[pIdx * 3] = pt.x;
        pointPositions[pIdx * 3 + 1] = pt.y;
        pointPositions[pIdx * 3 + 2] = pt.z;

        // Color coding: Elevation gradient (cyan at bottom, purple/orange at top) + reflectivity
        const heightNorm = (pt.y + 12) / 12; // 0 to 1
        const r = 0.1 + (1 - heightNorm) * 0.4;
        const g = 0.4 + heightNorm * 0.5;
        const b = 0.8 + (1 - heightNorm) * 0.2;

        pointColors[pIdx * 3] = r;
        pointColors[pIdx * 3 + 1] = g;
        pointColors[pIdx * 3 + 2] = b;

        pIdx++;
      }
    });

    const pcGeometry = new THREE.BufferGeometry();
    pcGeometry.setAttribute("position", new THREE.BufferAttribute(pointPositions, 3));
    pcGeometry.setAttribute("color", new THREE.BufferAttribute(pointColors, 3));

    const pcMaterial = new THREE.PointsMaterial({
      size: 0.18,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
    });
    const pointCloud = new THREE.Points(pcGeometry, pcMaterial);
    pointCloudRef.current = pointCloud;
    scene.add(pointCloud);

    // 8. 3D Volumetric Gas Heatmap Hotspots
    const gasGroup = new THREE.Group();
    gasGroupRef.current = gasGroup;

    GAS_HOTSPOTS.forEach((spot) => {
      // Color based on level
      const color = spot.level === "critical" ? 0xef4444 : spot.level === "warning" ? 0xf59e0b : 0x10b981;
      
      // Outer translucent glow sphere
      const sphereGeo = new THREE.SphereGeometry(spot.radius * 0.5, 20, 20);
      const sphereMat = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: spot.level === "critical" ? 0.35 : 0.2,
        wireframe: true,
      });
      const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
      sphereMesh.position.set(spot.x, spot.y, spot.z);
      gasGroup.add(sphereMesh);

      // Core pulsing node
      const coreGeo = new THREE.SphereGeometry(0.8, 16, 16);
      const coreMat = new THREE.MeshStandardMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: 0.8,
        roughness: 0.2,
      });
      const coreMesh = new THREE.Mesh(coreGeo, coreMat);
      coreMesh.position.set(spot.x, spot.y, spot.z);
      gasGroup.add(coreMesh);

      // Alert beacon ring for critical/warning
      if (spot.level !== "safe") {
        const ringGeo = new THREE.RingGeometry(1.2, 1.4, 32);
        const ringMat = new THREE.MeshBasicMaterial({
          color: color,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.8,
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.position.set(spot.x, spot.y + 0.1, spot.z);
        ringMesh.rotation.x = Math.PI / 2;
        gasGroup.add(ringMesh);
      }
    });

    scene.add(gasGroup);

    // 9. Build 3D Rover Model
    const roverGroup = new THREE.Group();
    roverGroupRef.current = roverGroup;

    // Chassis body
    const bodyGeo = new THREE.BoxGeometry(2.4, 0.8, 1.6);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0xe056fd, // High-visibility tech orange / purple
      metalness: 0.7,
      roughness: 0.3,
    });
    const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
    bodyMesh.position.y = 0.7;
    bodyMesh.castShadow = true;
    roverGroup.add(bodyMesh);

    // Upper electronics bay & solar/sensor hood
    const hoodGeo = new THREE.BoxGeometry(1.8, 0.4, 1.2);
    const hoodMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.9, roughness: 0.2 });
    const hoodMesh = new THREE.Mesh(hoodGeo, hoodMat);
    hoodMesh.position.set(0, 1.2, 0);
    roverGroup.add(hoodMesh);

    // 6 Rugged All-Terrain Wheels
    const wheelGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 16);
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.9 });
    
    const wheelPositions = [
      [-0.9, 0.4, 0.95],
      [0, 0.4, 0.95],
      [0.9, 0.4, 0.95],
      [-0.9, 0.4, -0.95],
      [0, 0.4, -0.95],
      [0.9, 0.4, -0.95],
    ];

    wheelPositions.forEach(([wx, wy, wz]) => {
      const wheelMesh = new THREE.Mesh(wheelGeo, wheelMat);
      wheelMesh.position.set(wx, wy, wz);
      wheelMesh.rotation.x = Math.PI / 2;
      wheelMesh.castShadow = true;
      roverGroup.add(wheelMesh);
    });

    // Top LiDAR Turret Puck
    const lidarPuckGeo = new THREE.CylinderGeometry(0.25, 0.28, 0.35, 16);
    const lidarPuckMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.8, emissive: 0x0369a1, emissiveIntensity: 0.4 });
    const lidarPuck = new THREE.Mesh(lidarPuckGeo, lidarPuckMat);
    lidarPuck.position.set(0.5, 1.55, 0);
    roverGroup.add(lidarPuck);

    // Front Camera / Sensor Mast (ESP32-CAM)
    const mastGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.6, 8);
    const mastMat = new THREE.MeshStandardMaterial({ color: 0x475569 });
    const mast = new THREE.Mesh(mastGeo, mastMat);
    mast.position.set(1.0, 1.3, 0);
    roverGroup.add(mast);

    const camHeadGeo = new THREE.BoxGeometry(0.3, 0.25, 0.35);
    const camHeadMat = new THREE.MeshStandardMaterial({ color: 0x10b981, emissive: 0x059669, emissiveIntensity: 0.5 });
    const camHead = new THREE.Mesh(camHeadGeo, camHeadMat);
    camHead.position.set(1.0, 1.65, 0);
    roverGroup.add(camHead);

    // Front Headlights with Volumetric Spotlights
    const spotLight = new THREE.SpotLight(0xfff7ed, 4.0, 25, Math.PI / 6, 0.4, 1.2);
    spotLight.position.set(1.2, 0.8, 0);
    const spotTarget = new THREE.Object3D();
    spotTarget.position.set(10, 0, 0);
    roverGroup.add(spotTarget);
    spotLight.target = spotTarget;
    roverGroup.add(spotLight);

    // Headlight lens glow
    const lensGeo = new THREE.SphereGeometry(0.12, 12, 12);
    const lensMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
    const lens1 = new THREE.Mesh(lensGeo, lensMat);
    lens1.position.set(1.2, 0.7, 0.5);
    const lens2 = new THREE.Mesh(lensGeo, lensMat);
    lens2.position.set(1.2, 0.7, -0.5);
    roverGroup.add(lens1);
    roverGroup.add(lens2);

    scene.add(roverGroup);

    // 10. LiDAR Live Scan Rays (Sweeping Green Laser Fans)
    const rayCount = 48;
    const rayPositions = new Float32Array(rayCount * 2 * 3);
    const rayGeo = new THREE.BufferGeometry();
    rayGeo.setAttribute("position", new THREE.BufferAttribute(rayPositions, 3));
    const rayMat = new THREE.LineBasicMaterial({
      color: 0x22c55e,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });
    const lidarRays = new THREE.LineSegments(rayGeo, rayMat);
    lidarRaysRef.current = lidarRays;
    scene.add(lidarRays);

    // 11. Rover Trajectory Ribbon
    const pathCurve = new THREE.CatmullRomCurve3(ROVER_PATROL_PATH, true);
    pathCurveRef.current = pathCurve;

    const trajPoints = pathCurve.getPoints(120);
    const trajGeo = new THREE.BufferGeometry().setFromPoints(trajPoints);
    const trajMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      linewidth: 2,
      transparent: true,
      opacity: 0.7,
    });
    const trajectoryLine = new THREE.Line(trajGeo, trajMat);
    trajectoryLineRef.current = trajectoryLine;
    scene.add(trajectoryLine);

    // 12. Handle Window Resize
    const handleResize = () => {
      if (!mount || !renderer || !camera) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    // 13. Main Animation & SLAM Loop
    let time = 0;
    let frameCount = 0;
    const animate = () => {
      time += 0.015;
      frameCount++;
      animFrameIdRef.current = requestAnimationFrame(animate);

      // Read current values from refs (never stale)
      const currentCameraMode = cameraModeRef.current;
      const currentIsPatrolling = isPatrollingRef.current;
      const currentState = stateRef.current;

      // Auto-Patrol Rover Animation along 3D Mine Spline
      if (pathCurveRef.current && roverGroupRef.current) {
        if (currentIsPatrolling) {
          patrolProgressRef.current = (patrolProgressRef.current + 0.0008) % 1;
        }

        const t = patrolProgressRef.current;
        const currentPos = pathCurveRef.current.getPoint(t);
        const nextPos = pathCurveRef.current.getPoint((t + 0.002) % 1);
        const tangent = pathCurveRef.current.getTangent(t);

        roverGroupRef.current.position.copy(currentPos);
        roverGroupRef.current.lookAt(nextPos);

        // Apply pitch/roll from live state if available
        if (currentState && (currentState.pitch !== 0 || currentState.roll !== 0)) {
          roverGroupRef.current.rotation.x += (currentState.pitch * Math.PI) / 180;
          roverGroupRef.current.rotation.z += (currentState.roll * Math.PI) / 180;
        }

        // Update LiDAR Scanner Rays in real time
        if (lidarRaysRef.current) {
          const posAttr = lidarRaysRef.current.geometry.attributes.position as THREE.BufferAttribute;
          const origin = currentPos.clone().add(new THREE.Vector3(0, 1.55, 0));

          for (let i = 0; i < rayCount; i++) {
            const angle = time * 3 + (i / rayCount) * Math.PI * 2;
            const dist = 3.5 + Math.sin(angle * 4 + time * 2) * 1.0;
            const end = origin.clone().add(
              new THREE.Vector3(Math.cos(angle) * dist, (Math.sin(angle * 2) * 0.5), Math.sin(angle) * dist)
            );

            // Line Start
            posAttr.setXYZ(i * 2, origin.x, origin.y, origin.z);
            // Line End
            posAttr.setXYZ(i * 2 + 1, end.x, end.y, end.z);
          }
          posAttr.needsUpdate = true;
        }

        // Camera Follow Modes — only override when NOT in free orbit mode
        if (camera && controls && currentCameraMode !== "orbit") {
          if (currentCameraMode === "chase") {
            const chaseOffset = tangent.clone().multiplyScalar(-10).add(new THREE.Vector3(0, 5, 0));
            const camTargetPos = currentPos.clone().add(chaseOffset);
            camera.position.lerp(camTargetPos, 0.05);
            controls.target.lerp(currentPos, 0.08);
          } else if (currentCameraMode === "fpv") {
            const fpvPos = currentPos.clone().add(new THREE.Vector3(0, 1.6, 0)).add(tangent.clone().multiplyScalar(1.2));
            camera.position.lerp(fpvPos, 0.1);
            const lookTarget = fpvPos.clone().add(tangent.clone().multiplyScalar(15));
            controls.target.lerp(lookTarget, 0.1);
          } else if (currentCameraMode === "topdown") {
            const topPos = new THREE.Vector3(currentPos.x, 40, currentPos.z);
            camera.position.lerp(topPos, 0.05);
            controls.target.lerp(currentPos, 0.08);
          }
        }

        // Find nearest gas hotspot to update HUD
        let nearestSpot = GAS_HOTSPOTS[0];
        let minDist = 999;
        GAS_HOTSPOTS.forEach((spot) => {
          const d = currentPos.distanceTo(new THREE.Vector3(spot.x, spot.y, spot.z));
          if (d < minDist) {
            minDist = d;
            nearestSpot = spot;
          }
        });

        // Update SLAM Stats every 10 frames to avoid excessive re-renders
        if (frameCount % 10 === 0) {
          const yawDeg = Math.round(((Math.atan2(tangent.x, tangent.z) * 180) / Math.PI + 360) % 360);
          setSlamStats({
            pointCount: 32840 + Math.floor(t * 2400),
            mappedArea: 3200 + Math.floor(t * 320),
            loopClosures: 34 + Math.floor(t * 8),
            roverX: Number(currentPos.x.toFixed(1)),
            roverY: Number(currentPos.y.toFixed(1)),
            roverZ: Number(currentPos.z.toFixed(1)),
            roverYaw: yawDeg,
            currentGas: `${nearestSpot.type} (${nearestSpot.ppm} ppm)`,
            currentChamber: nearestSpot.chamber,
          });
        }
      }

      // Pulse gas nodes
      if (gasGroupRef.current) {
        gasGroupRef.current.children.forEach((child, i) => {
          if (child instanceof THREE.Mesh && child.geometry instanceof THREE.SphereGeometry && child.material.wireframe) {
            const scale = 1 + Math.sin(time * 2 + i) * 0.08;
            child.scale.set(scale, scale, scale);
          }
        });
      }

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      window.removeEventListener("resize", handleResize);
      if (renderer.domElement && mount) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []); // ← Empty dependency array: scene initialises once, never torn down

  // Update visibility layers
  useEffect(() => {
    if (pointCloudRef.current) pointCloudRef.current.visible = showPointCloud;
    if (tunnelGroupRef.current) tunnelGroupRef.current.visible = showTunnelMesh;
    if (gasGroupRef.current) gasGroupRef.current.visible = showGasMap;
    if (trajectoryLineRef.current) trajectoryLineRef.current.visible = showTrajectory;
    if (lidarRaysRef.current) lidarRaysRef.current.visible = showLidarBeams;
    if (archesGroupRef.current) archesGroupRef.current.visible = showArches;
  }, [showPointCloud, showTunnelMesh, showGasMap, showTrajectory, showLidarBeams, showArches]);

  // Camera preset handler — directly moves camera+controls without re-mounting
  const setCameraPreset = useCallback((mode: "orbit" | "topdown" | "chase" | "fpv") => {
    setCameraMode(mode);
    // cameraModeRef is synced via the useEffect above

    if (!cameraRef.current || !controlsRef.current) return;

    if (mode === "orbit") {
      cameraRef.current.position.set(-45, 35, 55);
      controlsRef.current.target.set(0, -8, 0);
      controlsRef.current.update();
    } else if (mode === "topdown") {
      cameraRef.current.position.set(0, 75, 0);
      controlsRef.current.target.set(0, -8, 0);
      controlsRef.current.update();
    }
    // "chase" and "fpv" are driven by the animation loop via cameraModeRef
  }, []);

  const resetCamera = useCallback(() => {
    setCameraPreset("orbit");
  }, [setCameraPreset]);

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative bg-gray-950 rounded-3xl border border-gray-800 shadow-xl overflow-hidden flex flex-col select-none",
        isFullscreen ? "fixed inset-0 z-50 rounded-none border-0" : heightClass
      )}
    >
      {/* 3D WebGL Canvas Mount */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top HUD: Title, SLAM Status & View Modes */}
      <div className="relative z-10 flex flex-wrap items-center justify-between p-4 bg-gradient-to-b from-gray-950/90 via-gray-950/40 to-transparent pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto">
          <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center shadow-lg shadow-orange-500/5">
            <Radio className="w-5 h-5 text-orange-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white text-base tracking-wide">3D Mine SLAM & LiDAR Visualizer</h3>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                SLAM ACTIVE
              </span>
            </div>
            <p className="text-xs text-gray-400">Subterranean Shaft Network · LiDAR Odometry · 3D Gas Volumetrics</p>
          </div>
        </div>

        {/* Camera Views & Fullscreen Controls */}
        <div className="flex items-center gap-2 pointer-events-auto mt-2 sm:mt-0">
          <div className="flex items-center bg-gray-900/80 backdrop-blur-md p-1 rounded-xl border border-gray-800 shadow-lg">
            <button
              onClick={() => setCameraPreset("orbit")}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                cameraMode === "orbit" ? "bg-orange-600 text-white shadow-sm" : "text-gray-400 hover:text-white"
              )}
            >
              Free 3D
            </button>
            <button
              onClick={() => setCameraPreset("topdown")}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                cameraMode === "topdown" ? "bg-orange-600 text-white shadow-sm" : "text-gray-400 hover:text-white"
              )}
            >
              Top-Down
            </button>
            <button
              onClick={() => setCameraPreset("chase")}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                cameraMode === "chase" ? "bg-orange-600 text-white shadow-sm" : "text-gray-400 hover:text-white"
              )}
            >
              Follow Rover
            </button>
            <button
              onClick={() => setCameraPreset("fpv")}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                cameraMode === "fpv" ? "bg-orange-600 text-white shadow-sm" : "text-gray-400 hover:text-white"
              )}
            >
              FPV Cam
            </button>
          </div>

          <button
            onClick={() => setIsPatrolling(!isPatrolling)}
            className={cn(
              "p-2 rounded-xl backdrop-blur-md border transition-all shadow-lg",
              isPatrolling
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                : "bg-gray-900/80 text-gray-400 border-gray-800 hover:text-white"
            )}
            title={isPatrolling ? "Pause Rover Patrol" : "Start Rover Patrol"}
          >
            {isPatrolling ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          <button
            onClick={resetCamera}
            className="p-2 bg-gray-900/80 hover:bg-gray-800 text-gray-400 hover:text-white rounded-xl backdrop-blur-md border border-gray-800 transition-colors shadow-lg"
            title="Reset Camera View"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-2 bg-gray-900/80 hover:bg-gray-800 text-gray-400 hover:text-white rounded-xl backdrop-blur-md border border-gray-800 transition-colors shadow-lg"
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Left SLAM Live Pose & Chamber Overlay */}
      <div className="absolute left-4 top-20 z-10 flex flex-col gap-2 max-w-xs pointer-events-none">
        {/* Rover Position Card */}
        <div className="bg-gray-950/85 backdrop-blur-md p-3.5 rounded-2xl border border-gray-800/80 shadow-2xl pointer-events-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
              <Crosshair className="w-3 h-3 text-orange-400" />
              Rover SLAM Pose
            </span>
            <span className="text-[10px] font-bold text-emerald-400 font-mono">RTK-FIX</span>
          </div>
          
          <div className="grid grid-cols-3 gap-1.5 mb-2 text-center">
            <div className="bg-gray-900/90 p-1.5 rounded-lg border border-gray-800">
              <div className="text-[9px] text-gray-500">X (East)</div>
              <div className="text-xs font-bold text-white font-mono">{slamStats.roverX}m</div>
            </div>
            <div className="bg-gray-900/90 p-1.5 rounded-lg border border-gray-800">
              <div className="text-[9px] text-gray-500">Y (Depth)</div>
              <div className="text-xs font-bold text-white font-mono">{slamStats.roverY}m</div>
            </div>
            <div className="bg-gray-900/90 p-1.5 rounded-lg border border-gray-800">
              <div className="text-[9px] text-gray-500">Z (North)</div>
              <div className="text-xs font-bold text-white font-mono">{slamStats.roverZ}m</div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1 border-t border-gray-800/60">
            <span className="text-gray-400 text-[11px]">Heading (Yaw):</span>
            <span className="font-bold text-orange-400 font-mono">{slamStats.roverYaw}°</span>
          </div>
          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-gray-400 text-[11px]">Zone / Chamber:</span>
            <span className="font-bold text-gray-200 text-[11px] truncate max-w-[130px]">{slamStats.currentChamber}</span>
          </div>
        </div>

        {/* Current Environment & Gas Node Card */}
        <div className="bg-gray-950/85 backdrop-blur-md p-3.5 rounded-2xl border border-gray-800/80 shadow-2xl pointer-events-auto">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
              <Flame className="w-3 h-3 text-red-400" />
              Zone Gas Mapping
            </span>
          </div>
          <div className="text-xs font-bold text-white mb-1 flex items-center justify-between">
            <span className="text-gray-300">{slamStats.currentGas}</span>
          </div>
          <div className="w-full bg-gray-900 h-1.5 rounded-full overflow-hidden border border-gray-800">
            <div 
              className={cn(
                "h-full rounded-full transition-all duration-500",
                slamStats.currentGas.includes("CH4") ? "bg-red-500 w-3/4" : slamStats.currentGas.includes("CO") ? "bg-yellow-500 w-1/2" : "bg-emerald-500 w-1/4"
              )} 
            />
          </div>
        </div>
      </div>

      {/* Right Layer Toggle Drawer */}
      <div className="absolute right-4 top-20 z-10 flex flex-col gap-2 pointer-events-auto">
        <div className="bg-gray-950/85 backdrop-blur-md p-3 rounded-2xl border border-gray-800/80 shadow-2xl">
          <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2.5 flex items-center gap-1.5">
            <Layers className="w-3 h-3 text-purple-400" />
            3D Visual Layers
          </div>

          <div className="space-y-1.5">
            <label className="flex items-center justify-between gap-3 text-xs text-gray-300 hover:text-white cursor-pointer select-none">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-sm" />
                LiDAR Points ({slamStats.pointCount})
              </span>
              <input
                type="checkbox"
                checked={showPointCloud}
                onChange={(e) => setShowPointCloud(e.target.checked)}
                className="rounded bg-gray-900 border-gray-700 text-orange-500 focus:ring-0"
              />
            </label>

            <label className="flex items-center justify-between gap-3 text-xs text-gray-300 hover:text-white cursor-pointer select-none">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-600 shadow-sm" />
                Mine Tunnel Mesh
              </span>
              <input
                type="checkbox"
                checked={showTunnelMesh}
                onChange={(e) => setShowTunnelMesh(e.target.checked)}
                className="rounded bg-gray-900 border-gray-700 text-orange-500 focus:ring-0"
              />
            </label>

            <label className="flex items-center justify-between gap-3 text-xs text-gray-300 hover:text-white cursor-pointer select-none">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500 shadow-sm" />
                3D Gas Heatmap Nodes
              </span>
              <input
                type="checkbox"
                checked={showGasMap}
                onChange={(e) => setShowGasMap(e.target.checked)}
                className="rounded bg-gray-900 border-gray-700 text-orange-500 focus:ring-0"
              />
            </label>

            <label className="flex items-center justify-between gap-3 text-xs text-gray-300 hover:text-white cursor-pointer select-none">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm" />
                LiDAR Scanning Rays
              </span>
              <input
                type="checkbox"
                checked={showLidarBeams}
                onChange={(e) => setShowLidarBeams(e.target.checked)}
                className="rounded bg-gray-900 border-gray-700 text-orange-500 focus:ring-0"
              />
            </label>

            <label className="flex items-center justify-between gap-3 text-xs text-gray-300 hover:text-white cursor-pointer select-none">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-sky-400 shadow-sm" />
                Rover Patrol Path
              </span>
              <input
                type="checkbox"
                checked={showTrajectory}
                onChange={(e) => setShowTrajectory(e.target.checked)}
                className="rounded bg-gray-900 border-gray-700 text-orange-500 focus:ring-0"
              />
            </label>

            <label className="flex items-center justify-between gap-3 text-xs text-gray-300 hover:text-white cursor-pointer select-none">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-400 shadow-sm" />
                Support Arches
              </span>
              <input
                type="checkbox"
                checked={showArches}
                onChange={(e) => setShowArches(e.target.checked)}
                className="rounded bg-gray-900 border-gray-700 text-orange-500 focus:ring-0"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Bottom HUD: SLAM Performance Telemetry Bar & Navigation Guide */}
      <div className="relative mt-auto z-10 flex flex-wrap items-center justify-between px-5 py-3 bg-gradient-to-t from-gray-950/95 via-gray-950/80 to-transparent border-t border-gray-900">
        <div className="flex items-center gap-6 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-orange-400" />
            <span>SLAM Cloud: <strong className="text-white font-mono">{slamStats.pointCount.toLocaleString()} pts</strong></span>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <span>Area Mapped: <strong className="text-white font-mono">{slamStats.mappedArea} m²</strong></span>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <span>Loop Closures: <strong className="text-emerald-400 font-mono">{slamStats.loopClosures} OK</strong></span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-gray-500">
          <span className="hidden lg:inline">🖱️ Drag to Rotate · Scroll to Zoom · Right-Click to Pan</span>
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-gray-900 border border-gray-800 text-gray-300 text-[10px]">
            <Compass className="w-3 h-3 text-orange-400" />
            3D Spatial Engine Active
          </div>
        </div>
      </div>
    </div>
  );
}

