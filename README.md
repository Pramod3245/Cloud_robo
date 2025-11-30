# Cloud Robot Management System

## Overview

The Cloud Robot Management System is a comprehensive web-based platform designed for real-time monitoring, control, and management of autonomous service robots. This system provides a unified interface for visualizing robot telemetry, executing remote operations, analyzing performance metrics, and managing fleet-wide configurations. Built with modern web technologies, it delivers a responsive and intuitive user experience while maintaining robust backend infrastructure for reliable robot communication.

## Table of Contents

- [System Architecture](#system-architecture)
- [Core Features](#core-features)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Deployment](#deployment)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## System Architecture

The application follows a client-server architecture with clear separation of concerns:

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type-safe component development
- **Build Tool**: Vite for fast development and optimized production builds
- **Styling**: Tailwind CSS with custom design tokens and Shadcn UI components
- **State Management**: React Hooks (useState, useEffect, useRef) for local state
- **Real-time Communication**: Socket.IO client for WebSocket connections
- **Routing**: React Router v6 for client-side navigation

### Backend Architecture
- **Framework**: FastAPI for high-performance asynchronous API endpoints
- **Real-time Engine**: Python Socket.IO for bidirectional event-based communication
- **Data Validation**: Pydantic models for request/response validation
- **Simulation**: Custom physics-based robot simulator with kinematic modeling
- **CORS**: Configured middleware for secure cross-origin requests

### Communication Protocol
- **REST API**: HTTP endpoints for stateless operations (GET, POST)
- **WebSocket**: Socket.IO for real-time telemetry streaming at 10Hz
- **Data Format**: JSON serialization for all data exchange

## Core Features

### 1. Real-time Dashboard
The dashboard provides an at-a-glance view of critical robot metrics:
- Live battery status with runtime estimation
- Current operational status and active tasks
- Location tracking with semantic naming (Living Room, Kitchen, etc.)
- System health score aggregation
- Visual robot representation with real-time orientation

### 2. Teleoperation Interface
Manual control capabilities with comprehensive feedback:
- Directional control pad for linear and angular movement
- Adjustable speed limits with safety constraints
- Live camera feed integration with recording capabilities
- Command logging with timestamp tracking
- Emergency stop functionality
- Safe mode and manual mode switching

### 3. Activity Management
Task assignment and monitoring system:
- Pre-configured household tasks (Folding Clothes, Sweeping Floor)
- Custom workflow creation interface
- Task history with status tracking (Pending, In Progress, Completed, Failed)
- Real-time progress monitoring
- Task timestamp and duration tracking

### 4. Health Monitoring
Comprehensive hardware diagnostics:
- CPU load and memory usage tracking
- Motor temperature monitoring (left and right)
- Battery temperature and health metrics
- Network latency measurement
- Component lifecycle prediction
- Maintenance scheduling
- Service log history

### 5. Kinematics Analysis
Motion planning and path visualization:
- Real-time position tracking (X, Y coordinates)
- Orientation monitoring (theta angle)
- Velocity vector display (linear and angular)
- Path history visualization
- Movement efficiency metrics

### 6. Settings Management
Centralized configuration interface:
- Speed limit adjustment
- Safe mode toggle
- Theme selection (Dark, Light, System)
- Telemetry interval configuration
- Firmware channel selection
- Alert threshold customization
- OTA update preferences

### 7. Firmware Updates
Over-the-air update management:
- Current firmware version display
- Update availability checking
- Progress tracking with percentage and stage indication
- Automatic rollback capability
- Update history logging

### 8. Self-Healing Diagnostics
Automated system health management:
- Anomaly detection algorithms
- Diagnostic test execution
- Issue resolution recommendations
- System recovery procedures

## Technology Stack

### Frontend Technologies
- **React** 18.3.1 - Component-based UI library
- **TypeScript** 5.6.2 - Static type checking
- **Vite** 6.0.1 - Next-generation build tool
- **Tailwind CSS** 3.4.17 - Utility-first CSS framework
- **Shadcn UI** - Accessible component library
- **Lucide React** - Icon library
- **Socket.IO Client** 4.8.1 - WebSocket client
- **React Router DOM** 7.1.1 - Client-side routing
- **Recharts** 2.15.0 - Data visualization

### Backend Technologies
- **Python** 3.11+ - Programming language
- **FastAPI** 0.122.1 - Modern web framework
- **Uvicorn** 0.38.0 - ASGI server
- **Python-SocketIO** 5.15.0 - WebSocket server
- **Pydantic** 2.12.5 - Data validation

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## Prerequisites

Before installing the application, ensure you have the following software installed:

### Required Software
- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 9.0.0 or higher (comes with Node.js)
- **Python**: Version 3.11 or higher
- **pip**: Python package installer (comes with Python)

### Optional Software
- **Git**: For version control
- **Virtual Environment**: Python venv or conda for isolated dependencies

### System Requirements
- **Operating System**: Windows 10/11, macOS 10.15+, or Linux (Ubuntu 20.04+)
- **RAM**: Minimum 4GB, recommended 8GB
- **Disk Space**: Minimum 500MB for dependencies
- **Network**: Internet connection for initial setup

## Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/Pramod3245/Cloud_robo.git
cd Cloud_robo
```

### Step 2: Backend Setup

#### Create Virtual Environment (Recommended)

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

#### Install Python Dependencies

```bash
cd backend
pip install -r requirements.txt
```

The `requirements.txt` includes:
- fastapi - Web framework
- uvicorn - ASGI server
- python-socketio - WebSocket support
- pydantic - Data validation

### Step 3: Frontend Setup

#### Install Node Dependencies

```bash
# From project root
npm install
```

This will install all dependencies listed in `package.json`, including:
- React and React DOM
- TypeScript compiler
- Vite build tool
- Tailwind CSS
- Socket.IO client
- UI component libraries

## Configuration

### Backend Configuration

#### Environment Variables
Create a `.env` file in the `backend` directory (optional):

```env
HOST=0.0.0.0
PORT=8000
RELOAD=true
LOG_LEVEL=info
```

#### CORS Settings
Update `backend/main.py` to configure allowed origins:

```python
api.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Frontend Configuration

#### Vite Configuration
The `vite.config.ts` file includes proxy settings for API and WebSocket connections:

```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8000',
      changeOrigin: true,
    },
    '/socket.io': {
      target: 'http://localhost:8000',
      changeOrigin: true,
      ws: true,
    },
  },
}
```

## Running the Application

### Development Mode

#### Start Backend Server

```bash
# From project root
uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```

The backend will be available at:
- API: `http://localhost:8000`
- API Documentation: `http://localhost:8000/docs`
- WebSocket: `ws://localhost:8000/socket.io`

#### Start Frontend Development Server

```bash
# From project root
npm run dev
```

The frontend will be available at:
- Application: `http://localhost:5173` (or `http://localhost:8080`)

### Production Mode

#### Build Frontend

```bash
npm run build
```

This creates an optimized production build in the `dist` directory.

#### Serve Production Build

```bash
npm run preview
```

#### Production Backend

```bash
uvicorn backend.main:app --host 0.0.0.0 --port 8000 --workers 4
```

## API Documentation

### REST Endpoints

#### Robot Status
```
GET /api/status
Response: Complete robot state including position, battery, temperature, tasks, etc.
```

#### Task Management
```
GET /api/tasks
Response: List of all tasks

POST /api/tasks
Body: {"name": "Task Name"}
Response: {"message": "Task created"}
```

#### Health Metrics
```
GET /api/health
Response: Detailed health metrics (CPU, memory, temperatures, latency)
```

#### Camera Control
```
GET /api/camera
Response: Camera state (is_on, is_recording, recording_time)

POST /api/camera
Body: {"is_on": boolean, "is_recording": boolean}
Response: Updated camera state
```

#### Settings Management
```
GET /api/settings
Response: Current robot settings

POST /api/settings
Body: {"speed_limit": float, "safe_mode": boolean, "theme": string}
Response: Updated settings
```

#### Firmware Updates
```
GET /api/updates
Response: Firmware information

POST /api/update
Response: {"message": "Update started"}
```

### WebSocket Events

#### Client to Server
```
control: {"linear": float, "angular": float}
```

#### Server to Client
```
telemetry: Complete RobotState object (emitted every 100ms)
```

## Project Structure

```
Cloud_robo/
├── backend/
│   ├── __init__.py           # Package initialization
│   ├── main.py               # FastAPI application and routes
│   ├── simulator.py          # Robot physics simulation
│   └── requirements.txt      # Python dependencies
├── src/
│   ├── components/           # Reusable React components
│   │   ├── home/            # Dashboard components
│   │   ├── activity/        # Activity modal components
│   │   └── ui/              # Shadcn UI components
│   ├── hooks/               # Custom React hooks
│   │   ├── useRobot.ts      # Robot state and control hook
│   │   └── useCamera.ts     # Camera management hook
│   ├── pages/               # Page components
│   │   ├── Index.tsx        # Dashboard page
│   │   ├── TeleOp.tsx       # Teleoperation page
│   │   ├── Activity.tsx     # Activity management page
│   │   ├── Health.tsx       # Health monitoring page
│   │   ├── Kinematics.tsx   # Kinematics analysis page
│   │   ├── Settings.tsx     # Settings page
│   │   ├── Updates.tsx      # Firmware updates page
│   │   └── SelfHeal.tsx     # Diagnostics page
│   ├── lib/                 # Utility functions
│   ├── App.tsx              # Main application component
│   └── main.tsx             # Application entry point
├── public/                  # Static assets
├── SETUP.md                 # Detailed setup instructions
├── PROJECT_DETAILS.md       # Architecture documentation
├── DEPLOYMENT.md            # Deployment guide
├── README.md                # This file
├── package.json             # Node.js dependencies
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite configuration
└── tailwind.config.ts       # Tailwind CSS configuration
```

## Development Workflow

### Adding New Features

1. **Backend Changes**:
   - Add new Pydantic models in `simulator.py`
   - Create new API endpoints in `main.py`
   - Update simulator logic as needed

2. **Frontend Changes**:
   - Update TypeScript interfaces in `useRobot.ts`
   - Create or modify page components
   - Add new API calls in custom hooks

3. **Testing**:
   - Test API endpoints using `/docs` interface
   - Verify WebSocket communication in browser console
   - Test UI interactions and state updates

### Code Style Guidelines

- **TypeScript**: Use strict type checking, avoid `any` types
- **Python**: Follow PEP 8 style guide
- **Components**: Use functional components with hooks
- **Naming**: Use descriptive names, camelCase for JavaScript, snake_case for Python

## Deployment

For detailed deployment instructions to free hosting platforms, see [DEPLOYMENT.md](DEPLOYMENT.md).

### Quick Deployment Options

1. **Vercel (Frontend) + Render (Backend)**: Recommended for best performance
2. **Railway**: Full-stack deployment on single platform
3. **GitHub Pages**: Static frontend hosting (requires separate backend)

### Production Checklist

- [ ] Update CORS origins to production URLs
- [ ] Set environment variables for production
- [ ] Enable HTTPS/SSL certificates
- [ ] Configure rate limiting
- [ ] Set up monitoring and logging
- [ ] Optimize build size
- [ ] Test all features in production environment

## Testing

### Manual Testing

1. **Backend API**:
   - Access `http://localhost:8000/docs`
   - Test each endpoint using Swagger UI
   - Verify response schemas

2. **WebSocket Connection**:
   - Open browser developer console
   - Check for Socket.IO connection messages
   - Verify telemetry data updates

3. **Frontend Features**:
   - Test navigation between pages
   - Verify real-time data updates
   - Test control commands
   - Check responsive design

### Automated Testing (Future)

- Unit tests for backend endpoints
- Integration tests for WebSocket communication
- Component tests for React components
- End-to-end tests for critical user flows

## Contributing

Contributions are welcome and appreciated. To contribute:

1. **Fork the Repository**: Create your own fork on GitHub
2. **Create a Branch**: `git checkout -b feature/your-feature-name`
3. **Make Changes**: Implement your feature or bug fix
4. **Test Thoroughly**: Ensure all existing functionality works
5. **Commit Changes**: `git commit -m "Add detailed description"`
6. **Push to Branch**: `git push origin feature/your-feature-name`
7. **Submit Pull Request**: Create a PR with detailed description

### Contribution Guidelines

- Follow existing code style and conventions
- Add comments for complex logic
- Update documentation for new features
- Test changes across different browsers
- Ensure backward compatibility

## Troubleshooting

### Common Issues

**Backend won't start**:
- Verify Python version is 3.11+
- Check if port 8000 is available
- Ensure all dependencies are installed

**Frontend build errors**:
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version is 18+
- Verify all imports are correct

**WebSocket connection failed**:
- Check CORS settings in backend
- Verify proxy configuration in vite.config.ts
- Ensure backend is running before frontend

**Styling issues**:
- Run `npm run build` to regenerate Tailwind classes
- Check browser console for CSS errors
- Verify Tailwind configuration

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Acknowledgments

- Built with React, FastAPI, and Socket.IO
- UI components from Shadcn UI
- Icons from Lucide React
- Styling with Tailwind CSS

## Contact

For questions, issues, or suggestions, please open an issue on GitHub or contact the maintainers.

## Additional Resources

- [Setup Guide](SETUP.md) - Detailed installation instructions
- [Project Details](PROJECT_DETAILS.md) - Architecture and feature documentation
- [Deployment Guide](DEPLOYMENT.md) - Free hosting deployment instructions
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [Socket.IO Documentation](https://socket.io/)
