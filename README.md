# SchoolHub – MERN School Management System

Modern, role-based school management system inspired by eskooly.com, built with:

- Backend: Node.js, Express.js, MongoDB, JWT, Socket.IO
- Frontend: React (Vite, .jsx), Tailwind CSS, ShadCN UI
- PWA (vite-plugin-pwa) ready

## Features

- Auth: Register/Login with JWT, role-based (Admin/Teacher/Student)
- Dashboards per role
- Student/Teacher/Class management (REST endpoints scaffolded)
- Attendance, Exams, Fees (scaffolded endpoints)
- Timetable (placeholder)
- Notifications & real-time Chat (Socket.IO skeleton)
- Moodle integration service (placeholder)
- PWA manifest + service worker stub

## Monorepo Structure

```
schoolhub/
├── client/ (React + Vite)
└── server/ (Express + MongoDB)
```

## Quick Start

1) Copy env and set variables

```
cd server
cp .env.example .env
# Edit .env with your values
```

2) Install dependencies and run

Backend:

```
cd server
npm install
npm run dev
```

Frontend:

```
cd client
npm install
npm run dev
```

3) Open the app

- Frontend: http://localhost:5173
- Backend: http://localhost:4000

Default CORS allows `CLIENT_URL` from `.env`.

## Tech Notes

- All React components use `.jsx` extension
- Global auth state via Context API
- Axios instance with JWT interceptors
- RoleGuard for route protection
- Socket.IO for chat (`/server/src/sockets/chat.js`)
- ShadCN ready via `components.json`

## Scripts

Backend (server/package.json):

- `dev` – nodemon for development
- `start` – production start

Frontend (client/package.json):

- `dev`, `build`, `preview`

## Docker (optional)

See `docker-compose.yml` for MongoDB and server service example. Adjust env vars as needed.

