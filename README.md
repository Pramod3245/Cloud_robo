# Remote Robot Management Cloud System

A comprehensive web-based platform for visualizing, tele-operating, and managing fleets of service robots. This system combines a modern React frontend with a robust Python FastAPI backend to deliver real-time diagnostics, kinematics analysis, and remote control capabilities.

## 📚 Documentation

Detailed documentation is available in the following files:

-   **[Setup Guide](SETUP.md)**: Step-by-step instructions for installing dependencies and running the project locally.
-   **[Project Details](PROJECT_DETAILS.md)**: A deep dive into the system architecture, core features, and page-by-page functionality.

## 🚀 Quick Start

1.  **Backend**:
    ```bash
    uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
    ```

2.  **Frontend**:
    ```bash
    npm run dev
    ```

3.  **Access**: Open `http://localhost:8080` in your browser.

## 🛠️ Tech Stack

-   **Frontend**: React, TypeScript, Vite, Tailwind CSS, Shadcn UI
-   **Backend**: Python, FastAPI, Socket.IO
-   **Communication**: WebSockets (Real-time telemetry)
-   **Simulation**: Physics-based robot simulator (Kinematics, Battery, Sensors)

## ✨ Key Features

-   **Real-time Dashboard**: Monitor robot vitals, location, and status.
-   **Tele-operation**: Manual remote control with live camera feed simulation.
-   **Kinematics Analysis**: Visualize pathing and movement efficiency.
-   **OTA Updates**: Simulate remote firmware updates.
-   **Self-Healing**: Diagnostic tools for system health.

## 🤝 Contributing

Contributions are welcome! Please check the [Project Details](PROJECT_DETAILS.md) to understand the architecture before making changes.

## 📄 License

This project is licensed under the MIT License.
