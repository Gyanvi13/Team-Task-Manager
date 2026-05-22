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

## Railway Deployment

This project is intended to be deployed on Railway for submission.

- Backend service: use the `server/` folder, build with `npm install`, start with `npm start`.
- Frontend service: use the `client/` folder, build with `npm install && npm run build`, start with `npm start`.
- Set `VITE_API_URL` on the frontend to your Railway backend URL plus `/api`.
- Set `CLIENT_URL` on the backend to your Railway frontend URL.
- Keep `MONGODB_URI` pointed at MongoDB Atlas.

Recommended Railway env vars:

- Backend: `MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL`, `PORT`
- Frontend: `VITE_API_URL`

## Submission Checklist

- [ ] Railway backend deployed and healthy
- [ ] Railway frontend deployed and loading
- [ ] Login and signup verified in production
- [ ] Admin dashboard verified for admin account
- [ ] Member dashboard verified for member account
- [ ] Projects, tasks, and status updates verified end-to-end
