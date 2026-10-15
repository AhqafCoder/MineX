<p align="center">
  <img src="minex/public/minex-rover.png" alt="MineX Rover" width="280" />
</p>

<h1 align="center">MineX</h1>

<p align="center">
  <strong>Intelligent Rover. Safer Mines.</strong>
</p>


<p align="center">
  An autonomous, AI-powered rover and command center for underground mine safety, environmental monitoring, and rescue operations.
</p>

<p align="center">
  <a href="#overview">Overview</a> ·
  <a href="#key-features">Features</a> ·
  <a href="#system-architecture">Architecture</a> ·
  <a href="#hardware">Hardware</a> ·
  <a href="#tech-stack">Tech Stack</a> ·
  <a href="#project-structure">Structure</a> ·
  <a href="#license">License</a>
</p>

---

## Overview

**MineX** is an edge-intelligent mining rover system purpose-built for hazardous underground environments. It combines real-time AI vision, environmental sensing, and a professional command center dashboard to enable safe, remote exploration of mine tunnels — without putting human operators at risk.

The rover detects trapped personnel, monitors toxic gas concentrations, maps collapsed tunnel geometry via SLAM, and streams all data to a web-based command center in real time.

> **Note:** The current hardware sensor suite (DHT22, MQ-135, MPU-6050, QMC5310) is prototype-level, selected for rapid iteration and proof of concept. Production deployments would use industrial-grade equivalents.

## Key Features

| Feature | Description |
|---|---|
| **AI Pose Detection** | YOLOv8-based skeletal pose estimation to detect standing, crouching, or fallen personnel underground |
| **Live Camera Feed** | MJPEG video stream from ESP32-CAM with fullscreen mode and camera pan control |
| **Environmental Sensing** | Real-time temperature, humidity (DHT22), and toxic gas monitoring (MQ-135) with threshold alerts — prototype-level sensors |
| **3D SLAM Mapping** | Interactive 3D mine tunnel visualization with multi-level tunnels, patrol paths, and gas hotspot overlays |
| **Motion & Orientation** | 6-axis IMU (MPU-6050) and digital compass (QMC5310) for heading, pitch, and roll tracking — prototype-level sensors |
| **Command Center** | Professional web dashboard with live telemetry charts, rover controls, alert center, and session logging |
| **Session Recording** | Start/stop mission recording with timestamped telemetry for post-operation analysis |
| **Fault-Tolerant Design** | Multi-threaded sensor architecture with automatic thread recovery and health monitoring |

## System Architecture

```
┌──────────────────────────────────────────────────────────┐
│                  COMMAND CENTER (Next.js)                 │
│  ┌────────────┐ ┌────────────┐ ┌────────────────────┐   │
│  │  Live Feed  │ │ Telemetry  │ │   Rover Controls   │   │
│  │  (MJPEG)   │ │  Charts    │ │  D-Pad / Servo     │   │
│  └────────────┘ └────────────┘ └────────────────────┘   │
│  ┌────────────┐ ┌────────────┐ ┌────────────────────┐   │
│  │  3D SLAM   │ │   Alert    │ │  Session Logging   │   │
│  │   Map      │ │  Center    │ │  & Recording       │   │
│  └────────────┘ └────────────┘ └────────────────────┘   │
└──────────────────────┬───────────────────────────────────┘
                       │ HTTP API
┌──────────────────────┴───────────────────────────────────┐
│              AI VISION SERVICE (Python / FastAPI)         │
│  ┌──────────────────────────────────────────────────┐   │
│  │   YOLOv8 Pose Estimation (MPS / CUDA / CPU)      │   │
│  │   Annotated MJPEG Stream + REST Inference API     │   │
│  └──────────────────────────────────────────────────┘   │
└──────────────────────┬───────────────────────────────────┘
                       │ MJPEG / HTTP
┌──────────────────────┴───────────────────────────────────┐
│                   ROVER (ESP32 + Sensors)                 │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────────┐ │
│  │ ESP32-CAM │ │  DHT22   │ │  MQ-135  │ │ MPU-6050 + │ │
│  │ (Vision) │ │ (Env)    │ │ (Gas)    │ │ QMC5310    │ │
│  └──────────┘ └──────────┘ └──────────┘ └────────────┘ │
│  ┌──────────────────────────────────────────────────┐   │
│  │          Motor Driver (L298N) — 4WD Drive        │   │
│  └──────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────┘
```

## Hardware

> The following components represent the **prototype build**. Sensor modules are selected for rapid development and proof of concept.

| Component | Purpose |
|---|---|
| **ESP32** | Main microcontroller, Wi-Fi access point, sensor hub |
| **ESP32-CAM** | Live MJPEG video stream and AI inference input |
| **DHT22** | Temperature and humidity monitoring |
| **MQ-135** | Air quality and toxic gas detection |
| **MPU-6050** | 6-axis accelerometer + gyroscope (pitch, roll) |
| **QMC5310** | Digital compass for heading |
| **L298N** | Dual H-bridge motor driver for 4WD |
| **Servo Motor** | Camera pan control |

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 16, React 19, TypeScript |
| **Styling** | Tailwind CSS 4 |
| **3D Rendering** | React Three Fiber, Three.js, Drei |
| **Animations** | Framer Motion |
| **Charts** | Recharts |
| **Icons** | Lucide React |
| **AI Service** | Python, FastAPI, YOLOv8 (Ultralytics), OpenCV, PyTorch |
| **Firmware** | MicroPython / Arduino (ESP32) |

## Command Center

The MineX Command Center is a real-time web dashboard providing full operational visibility and control:

- **Rover Vision** — Live MJPEG camera feed with fullscreen mode
- **Safety Intel** — Environmental sensor readings with configurable threshold alerts
- **Rover Controls** — Directional D-pad, camera servo slider, and headlight toggle
- **3D Mine Map** — Interactive SLAM-based tunnel visualization with gas hotspot overlays
- **Telemetry Charts** — Scrolling time-series graphs for temperature, humidity, gas levels, and heading
- **Alert Center** — Real-time hazard detection and notification feed
- **Session Logging** — Mission recording with timestamped telemetry export

## Project Structure

```
MineX/
├── minex/                        # Next.js web application
│   ├── app/
│   │   ├── page.tsx              # Landing page
│   │   ├── dashboard/            # Command center
│   │   ├── about/                # About page
│   │   ├── features/             # Features page
│   │   ├── technology/           # Technology page
│   │   ├── safety/               # Safety page
│   │   ├── contact/              # Contact page
│   │   └── api/                  # Backend API routes
│   │       ├── rover/            # Rover proxy endpoints
│   │       │   ├── drive/        #   Motor control
│   │       │   ├── telemetry/    #   Sensor data
│   │       │   ├── video/        #   Camera stream
│   │       │   ├── servo/        #   Camera pan
│   │       │   ├── light/        #   Headlight toggle
│   │       │   ├── slam/         #   SLAM map data
│   │       │   └── record/       #   Session recording
│   │       └── ai/               # AI vision service proxy
│   │           ├── stream/       #   Annotated video stream
│   │           ├── infer/        #   Inference results
│   │           ├── config/       #   Model configuration
│   │           └── status/       #   Service health
│   ├── components/
│   │   ├── dashboard/            # Dashboard panels & controls
│   │   ├── landing/              # Homepage sections
│   │   ├── navigation/           # Navbar & footer
│   │   ├── architecture/         # Architecture diagrams
│   │   ├── features/             # Feature showcases
│   │   └── technology/           # Tech stack display
│   ├── lib/                      # Utilities & constants
│   └── public/                   # Static assets
├── ai_pose_service.py            # YOLOv8 AI vision service
├── yolov8n-pose.pt               # Pre-trained pose model
├── LICENSE
└── README.md
```

## License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.
