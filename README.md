# Smart Health Tracker Server

A Node.js Express server for health data monitoring and management.

## Features
- Real-time health data monitoring via WebSocket
- Appointment management
- User profile management
- Health metrics tracking (weight, blood pressure, heart rate, etc.)

## Tech Stack
- Node.js
- Express
- WebSocket (ws)
- EJS templating
- Chart.js for visualizations

## Installation
```bash
npm install
```

## Running the Server
```bash
npm start
```

The server will start on:
- HTTP: http://localhost:3000
- WebSocket: ws://localhost:8080

## Environment Variables
- `PORT` - HTTP server port (default: 3000)
- `WS_PORT` - WebSocket server port (default: 8080)

## API Endpoints
- `/` - Dashboard view
- `/monitor` - Real-time monitoring
- `/appointments` - Appointment management
- `/profile` - User profile
- `/add` - Add health data
- `/api/iot-data` - IoT device data endpoint# smart-health-tracking-management-system
# smart-health-tracking-management-system
