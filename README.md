# Team Task Manager

A mini Jira/Trello-style team task manager with a React + Vite frontend and an Express + MongoDB backend.

## Stack

- Frontend: React, Vite, Tailwind CSS, Axios, React Router DOM, React Toastify
- Backend: Node.js, Express.js, MongoDB Atlas, JWT authentication, bcryptjs

## Structure

- `client/` - React app
- `server/` - Express API

## Features

- Admin: create projects, add team members, create tasks, assign tasks, change task status, view analytics/dashboard
- Member: login, view assigned tasks, update task status, view project details

## Setup

1. Install dependencies from the repository root:

```bash
npm install
```

2. Create environment files:

- `server/.env`
- `client/.env`

3. Start both apps:

```bash
npm run dev
```

## Environment

### `server/.env`

```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
```

### `client/.env`

```env
VITE_API_URL=http://localhost:5000/api
```

## API Overview

- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/projects`
- `GET /api/projects`
- `POST /api/tasks`
- `PATCH /api/tasks/:id/status`
- `GET /api/analytics/overview`

## Notes

- The backend expects MongoDB Atlas for persistence.
- JWT tokens are stored in the client and attached to API requests.
- On first run, the server seeds demo accounts and starter data:
	- Admin: `admin@teamtask.local` / `password123`
	- Member: `member@teamtask.local` / `password123`
