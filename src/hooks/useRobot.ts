import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

export interface Task {
    id: string;
    name: string;
    status: string;
    progress: number;
    timestamp: number;
}

export interface CameraState {
    is_on: boolean;
    is_recording: boolean;
    recording_time: number;
}

export interface HealthDetails {
    cpu_load: number;
    memory_usage: number;
    motor_temp_l: number;
    motor_temp_r: number;
    battery_temp: number;
    latency: number;
}

export interface FirmwareState {
    version: string;
    update_available: boolean;
    update_progress: number;
    is_updating: boolean;
}

export interface SettingsState {
    speed_limit: number;
    safe_mode: boolean;
    theme: string;
    log_level: string;
}

export interface RobotState {
    x: number;
    y: number;
    theta: number;
    linear_velocity: number;
    angular_velocity: number;
    battery: number;
    temperature: number;
    is_charging: boolean;
    mode: string;
    status: string;
    location_name: string;
    tasks: Task[];
    camera: CameraState;
    health_details: HealthDetails;
    firmware: FirmwareState;
    settings: SettingsState;
}

const useRobot = () => {
    const [robotState, setRobotState] = useState<RobotState>({
        x: 0,
        y: 0,
        theta: 0,
        linear_velocity: 0,
        angular_velocity: 0,
        battery: 100,
        temperature: 35,
        is_charging: false,
        mode: 'safe',
        status: 'idle',
        location_name: 'Living Room',
        tasks: [],
        camera: { is_on: true, is_recording: false, recording_time: 0 },
        health_details: { cpu_load: 0, memory_usage: 0, motor_temp_l: 0, motor_temp_r: 0, battery_temp: 0, latency: 0 },
        firmware: { version: '1.0.0', update_available: false, update_progress: 0, is_updating: false },
        settings: { speed_limit: 100, safe_mode: true, theme: 'dark', log_level: 'info' },
    });

    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        socketRef.current = io('/', {
            path: '/socket.io',
        });

        socketRef.current.on('telemetry', (data: RobotState) => {
            setRobotState(data);
        });

        return () => {
            socketRef.current?.disconnect();
        };
    }, []);

    const sendControl = (linear: number, angular: number) => {
        socketRef.current?.emit('control', { linear, angular });
    };

    const createTask = async (name: string) => {
        await fetch('/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name }),
        });
    };

    const toggleCamera = async (is_on?: boolean, is_recording?: boolean) => {
        await fetch('/api/camera', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ is_on, is_recording }),
        });
    };

    const updateSettings = async (settings: Partial<SettingsState>) => {
        await fetch('/api/settings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(settings),
        });
    };

    const triggerUpdate = async () => {
        await fetch('/api/update', { method: 'POST' });
    };

    return { robotState, sendControl, createTask, toggleCamera, updateSettings, triggerUpdate };
};

export default useRobot;
