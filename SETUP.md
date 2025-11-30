# Project Setup Guide

This guide provides step-by-step instructions to set up and run the Remote Robot Management Cloud System on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:

1.  **Node.js**: Version 18 or higher.
2.  **Python**: Version 3.8 or higher.
3.  **Git**: For cloning the repository.

## Installation

### 1. Clone the Repository

Open your terminal and run the following command to clone the project:

```bash
git clone <repository-url>
cd Cloud_robo
```

### 2. Backend Setup

The backend is built with Python and FastAPI. It handles the robot simulation and real-time communication.

1.  Navigate to the project root directory.
2.  Create a virtual environment (optional but recommended):
    ```bash
    python -m venv venv
    # Windows
    .\venv\Scripts\activate
    # macOS/Linux
    source venv/bin/activate
    ```
3.  Install the required Python dependencies:
    ```bash
    pip install -r backend/requirements.txt
    ```

### 3. Frontend Setup

The frontend is built with React, TypeScript, and Vite.

1.  Navigate to the project root directory (if not already there).
2.  Install the required Node.js dependencies:
    ```bash
    npm install
    ```

## Running the Application

To run the full system, you need to start both the backend and the frontend servers.

### Step 1: Start the Backend Server

Open a terminal window and run:

```bash
uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```

You should see output indicating that the server has started and is listening on port 8000.

### Step 2: Start the Frontend Server

Open a second terminal window and run:

```bash
npm run dev
```

This will start the Vite development server.

### Step 3: Access the Application

Open your web browser and navigate to the URL shown in the frontend terminal (usually `http://localhost:8080`).

## Troubleshooting

-   **Port Conflicts**: If port 8000 or 8080 is already in use, the servers may fail to start. You can change the ports in the command line arguments or configuration files.
-   **Connection Issues**: If the frontend says "Disconnected", ensure the backend server is running and that there are no errors in the backend terminal.
-   **Dependencies**: If you encounter "module not found" errors, double-check that you have installed all dependencies for both backend (`pip install`) and frontend (`npm install`).
