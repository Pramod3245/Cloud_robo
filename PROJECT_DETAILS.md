# Project Overview and Functionality

This document provides a detailed explanation of the Remote Robot Management Cloud System, including its architecture, core features, and a breakdown of each page in the application.

## System Architecture

The system consists of three main components:

1.  **Frontend (Web Dashboard)**: A modern, responsive web application built with React and Tailwind CSS. It provides the user interface for monitoring and controlling the robot.
2.  **Backend (API & Real-time Engine)**: A FastAPI (Python) server that manages the system logic. It handles API requests and maintains a persistent WebSocket connection with the frontend.
3.  **Robot Simulator**: A software module running within the backend that mimics the physical behavior of a robot. It simulates kinematics, battery drainage, temperature changes, and sensor data, providing a realistic testing environment without physical hardware.

## Core Features

-   **Real-time Telemetry**: Continuous streaming of robot data (position, speed, battery, temperature) to the dashboard with low latency.
-   **Remote Tele-operation**: Manual control of the robot's movement using a virtual interface, simulating remote driving capabilities.
-   **Health Monitoring**: Comprehensive tracking of system vitals to predict and prevent failures.
-   **Kinematics Analysis**: Visualization of movement data to analyze pathing efficiency and stability.
-   **OTA Updates**: Simulation of Over-The-Air firmware updates to manage software versions remotely.

## Page-by-Page Guide

### 1. Home Dashboard (Index)
**Purpose**: Provides a high-level overview of the robot's current status.
-   **Health Metrics**: Displays critical vitals such as battery health, temperature, and CPU load.
-   **Robot Visual**: A graphical representation of the robot.
-   **Status Cards**: Quick summary cards showing the current task, battery percentage, and location.
-   **Activity Timeline**: A log of recent events and actions performed by the robot.

### 2. Tele-Op (Remote Control)
**Purpose**: Allows manual override and direct control of the robot.
-   **Live Camera Feed**: Simulates a real-time video stream from the robot's onboard camera with HUD overlays for augmented reality data.
-   **Movement Controls**: Directional buttons (Forward, Backward, Left, Right) to drive the robot.
-   **Speed Control**: A slider to adjust the maximum speed of the robot during manual operation.
-   **Command Log**: A real-time log displaying the commands sent to the robot and its responses.
-   **Safety Modes**: Toggle between "Safe Mode" (restricted speed/movement) and "Manual Mode" (full control).

### 3. Health Page
**Purpose**: Deep dive into the system's diagnostic data.
-   **Component Status**: Detailed breakdown of individual components (Motors, Sensors, Compute Unit).
-   **Historical Data**: Charts showing trends in temperature and power consumption over time.
-   **Diagnostics**: Tools to run self-tests and identify potential hardware issues.

### 4. Kinematics Page
**Purpose**: Analyzes the robot's motion and navigation performance.
-   **Path Visualization**: Graphical display of the robot's movement path.
-   **Velocity Charts**: Graphs showing linear and angular velocity over time.
-   **Orientation Data**: Real-time display of the robot's heading (yaw, pitch, roll).

### 5. Updates Page (OTA)
**Purpose**: Manages firmware and software versions.
-   **Version History**: List of installed and available updates.
-   **Update Trigger**: Functionality to initiate a firmware update simulation.
-   **Progress Monitoring**: Real-time progress bar showing the status of an ongoing update.

### 6. Settings Page
**Purpose**: Configuration of system parameters.
-   **General Settings**: Robot name, ID, and display preferences.
-   **Network Configuration**: Connection settings for the telemetry stream.
-   **Alert Thresholds**: Customizable limits for battery warnings and temperature alerts.

## Technical Highlights

-   **WebSockets**: Used for bidirectional, real-time communication between the client and server, ensuring instant feedback for control inputs.
-   **Responsive Design**: The interface is fully optimized for desktop, tablet, and mobile devices.
-   **Simulated Physics**: The backend simulator uses kinematic equations to calculate position and movement, providing realistic inertia and acceleration behavior.
