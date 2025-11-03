# Smart Health Tracking Management System

This repository contains the full Smart Health Tracking project (frontend, backend and legacy server). It was uploaded from a local workspace and contains three top-level folders:

- `frontend/` — React + Vite frontend application (TypeScript, Tailwind)
- `backend/` — Node/TypeScript backend (Prisma schema, controllers, routes)
- `smart-health-tracker/` — legacy Express/EJS app (server.js and views)

## Quick start
**###Link**:
https://unbeautifully-brainiest-nixon.ngrok-free.dev/ 
1. open link and press on visit site 

### 1. Frontend

```bash
cd frontend
npm install
npm run dev
```

### 2. Backend

```bash
cd backend
npm install
# set your DATABASE_URL in .env, then
npx prisma generate
npx prisma db push
npm run dev
```

### 3. Legacy Express app

```bash
cd smart-health-tracker
npm install
npm start
```

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
- React + Vite (frontend)
- TypeScript (backend)
- Prisma (database ORM)

## Environment Variables
- `PORT` - HTTP server port (default: 3000)
- `WS_PORT` - WebSocket server port (default: 8080)

## API Endpoints
- `/` - Dashboard view
- `/monitor` - Real-time monitoring
- `/appointments` - Appointment management
- `/profile` - User profile
- `/add` - Add health data
- `/api/iot-data` - IoT device data endpoint

## Notes

- The backend and frontend were uploaded as nested repositories originally. If you want this repo to contain their full file contents directly (without nested `.git` folders), I can "flatten" the structure by removing the nested `.git` directories and recommitting.
- The current remote is set to: `https://github.com/Karthyk-ram/smart-health-tracking-management.git` — verify on GitHub to confirm everything looks correct.

## Contact / author

Repository uploaded by a local machine. If you want the commit author changed to a different name/email (for example, "Ishita"), tell me the exact name/email and I will amend the commit and force-push.
