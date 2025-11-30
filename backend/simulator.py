import math
import time
import random
from pydantic import BaseModel
from typing import List, Optional

class Task(BaseModel):
    id: str
    name: str
    status: str = "pending" # pending, in_progress, completed, failed
    progress: float = 0.0
    timestamp: float

class CameraState(BaseModel):
    is_on: bool = True
    is_recording: bool = False
    recording_time: float = 0.0

class HealthDetails(BaseModel):
    cpu_load: float = 15.0
    memory_usage: float = 30.0
    motor_temp_l: float = 35.0
    motor_temp_r: float = 35.0
    battery_temp: float = 32.0
    latency: float = 24.0

class FirmwareState(BaseModel):
    version: str = "1.0.0"
    update_available: bool = False
    update_progress: float = 0.0
    is_updating: bool = False

class SettingsState(BaseModel):
    speed_limit: float = 100.0
    safe_mode: bool = True
    theme: str = "dark"
    log_level: str = "info"

class RobotState(BaseModel):
    x: float = 0.0
    y: float = 0.0
    theta: float = 0.0
    linear_velocity: float = 0.0
    angular_velocity: float = 0.0
    battery: float = 100.0
    temperature: float = 35.0
    is_charging: bool = False
    mode: str = "safe"
    status: str = "idle"
    location_name: str = "Docking Station"
    
    tasks: List[Task] = []
    camera: CameraState = CameraState()
    health_details: HealthDetails = HealthDetails()
    firmware: FirmwareState = FirmwareState()
    settings: SettingsState = SettingsState()

class RobotSimulator:
    def __init__(self):
        self.state = RobotState()
        self.last_update = time.time()
        self.target_linear_velocity = 0.0
        self.target_angular_velocity = 0.0
        
        # Seed initial tasks
        self.add_task("System Boot", "completed")
        self.add_task("Sensor Check", "completed")

    def add_task(self, name: str, status: str = "pending"):
        task_id = str(int(time.time() * 1000))
        task = Task(id=task_id, name=name, status=status, progress=100.0 if status == "completed" else 0.0, timestamp=time.time())
        self.state.tasks.insert(0, task)
        self.state.tasks = self.state.tasks[:50] # Keep last 50

    def set_control(self, linear: float, angular: float):
        # Apply speed limit
        limit_factor = self.state.settings.speed_limit / 100.0
        self.target_linear_velocity = linear * limit_factor
        self.target_angular_velocity = angular * limit_factor
        
        if linear != 0 or angular != 0:
            self.state.status = "moving"
        else:
            self.state.status = "idle"

    def update(self):
        current_time = time.time()
        dt = current_time - self.last_update
        self.last_update = current_time

        # --- Kinematics ---
        accel = 2.0 * dt
        if self.state.linear_velocity < self.target_linear_velocity:
            self.state.linear_velocity = min(self.state.linear_velocity + accel, self.target_linear_velocity)
        elif self.state.linear_velocity > self.target_linear_velocity:
            self.state.linear_velocity = max(self.state.linear_velocity - accel, self.target_linear_velocity)

        if self.state.angular_velocity < self.target_angular_velocity:
            self.state.angular_velocity = min(self.state.angular_velocity + accel, self.target_angular_velocity)
        elif self.state.angular_velocity > self.target_angular_velocity:
            self.state.angular_velocity = max(self.state.angular_velocity - accel, self.target_angular_velocity)

        rad_theta = math.radians(self.state.theta)
        self.state.x += self.state.linear_velocity * math.cos(rad_theta) * dt
        self.state.y += self.state.linear_velocity * math.sin(rad_theta) * dt
        self.state.theta += self.state.angular_velocity * dt
        self.state.theta = self.state.theta % 360

        # --- Location Name Logic ---
        if abs(self.state.x) < 1.0 and abs(self.state.y) < 1.0:
            self.state.location_name = "Docking Station"
        elif self.state.x > 2.0 and self.state.y > 2.0:
            self.state.location_name = "Living Room"
        elif self.state.x > 2.0 and self.state.y < -2.0:
            self.state.location_name = "Kitchen"
        elif self.state.x < -2.0:
            self.state.location_name = "Bedroom"
        else:
            self.state.location_name = "Hallway"

        # --- Battery & Temp ---
        drain_rate = 0.05 if self.state.status == "moving" else 0.01
        self.state.battery = max(0, self.state.battery - drain_rate * dt)

        target_temp = 45.0 if self.state.status == "moving" else 35.0
        temp_change = 0.5 * dt
        if self.state.temperature < target_temp:
            self.state.temperature += temp_change
        else:
            self.state.temperature -= temp_change

        # --- Detailed Health Simulation ---
        self.state.health_details.cpu_load = 15.0 + (10.0 * abs(self.state.linear_velocity)) + random.uniform(-2, 2)
        self.state.health_details.motor_temp_l = self.state.temperature + random.uniform(-1, 1)
        self.state.health_details.motor_temp_r = self.state.temperature + random.uniform(-1, 1)

        # --- Camera Recording ---
        if self.state.camera.is_recording:
            self.state.camera.recording_time += dt

        # --- Firmware Update Simulation ---
        if self.state.firmware.is_updating:
            self.state.firmware.update_progress += 5.0 * dt
            if self.state.firmware.update_progress >= 100.0:
                self.state.firmware.update_progress = 100.0
                self.state.firmware.is_updating = False
                self.state.firmware.version = "1.1.0" # Mock upgrade
                self.add_task("Firmware Update", "completed")

        return self.state
