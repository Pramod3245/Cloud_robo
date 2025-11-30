import asyncio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import socketio
try:
    from .simulator import RobotSimulator
except ImportError:
    from simulator import RobotSimulator


# Create FastAPI app
api = FastAPI()

# Configure CORS
api.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create Socket.IO server (Async)
sio = socketio.AsyncServer(async_mode='asgi', cors_allowed_origins='*')
# Wrap FastAPI with Socket.IO
app = socketio.ASGIApp(sio, api)

# Initialize Simulator
robot = RobotSimulator()

# Background task to update robot state and emit telemetry
async def robot_loop():
    while True:
        state = robot.update()
        await sio.emit('telemetry', state.model_dump())
        await asyncio.sleep(0.1)  # 10Hz update rate

@api.on_event("startup")
async def startup_event():
    asyncio.create_task(robot_loop())

@sio.event
async def connect(sid, environ):
    print(f"Client connected: {sid}")
    await sio.emit('telemetry', robot.state.model_dump(), to=sid)

@sio.event
async def disconnect(sid):
    print(f"Client disconnected: {sid}")

@sio.event
async def control(sid, data):
    # data: {'linear': float, 'angular': float}
    linear = float(data.get('linear', 0.0))
    angular = float(data.get('angular', 0.0))
    robot.set_control(linear, angular)

@api.get("/api/status")
async def get_status():
    return robot.state

@api.get("/api/tasks")
async def get_tasks():
    return robot.state.tasks

@api.post("/api/tasks")
async def create_task(task: dict):
    # task: {"name": "Task Name"}
    name = task.get("name", "New Task")
    robot.add_task(name)
    return {"message": "Task created"}

@api.get("/api/health")
async def get_health():
    return robot.state.health_details

@api.get("/api/camera")
async def get_camera():
    return robot.state.camera

@api.post("/api/camera")
async def update_camera(data: dict):
    # data: {"is_on": bool, "is_recording": bool}
    if "is_on" in data:
        robot.state.camera.is_on = data["is_on"]
    if "is_recording" in data:
        robot.state.camera.is_recording = data["is_recording"]
        if not robot.state.camera.is_recording:
            robot.state.camera.recording_time = 0.0
    return robot.state.camera

@api.get("/api/settings")
async def get_settings():
    return robot.state.settings

@api.post("/api/settings")
async def update_settings(data: dict):
    # data: {"speed_limit": float, "safe_mode": bool, "theme": str}
    if "speed_limit" in data:
        robot.state.settings.speed_limit = float(data["speed_limit"])
    if "safe_mode" in data:
        robot.state.settings.safe_mode = bool(data["safe_mode"])
    if "theme" in data:
        robot.state.settings.theme = str(data["theme"])
    return robot.state.settings

@api.get("/api/updates")
async def get_updates():
    return robot.state.firmware

@api.post("/api/update")
async def trigger_update():
    if not robot.state.firmware.is_updating:
        robot.state.firmware.is_updating = True
        robot.state.firmware.update_progress = 0.0
        robot.add_task("Firmware Update", "in_progress")
    return {"message": "Update started"}
