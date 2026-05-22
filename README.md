# Team Task Manager

A mini Jira/Trello-style team task manager with a React + Vite frontend and an Express + MongoDB backend.

## What it does

- Admin users can create projects, add team members, create tasks, assign work, and view analytics.
- Team members can log in, view assigned tasks, and update task status.

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, Axios, React Router DOM, React Toastify
- Backend: Node.js, Express, MongoDB Atlas, JWT authentication, bcryptjs

## Project Structure

- `client/` - React app
- `server/` - Express API

## Local Setup

1. Install dependencies from the repository root:

```bash
npm install
```

2. Create the environment files:

- `server/.env`
- `client/.env`

3. Start the app in development mode:

```bash
npm run dev
```

## Environment Variables

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

## Production / Railway

The app is set up for Railway deployment.

- Backend service should use the `server/` workspace and start with `npm start`.
- The server serves the built client when `client/dist` is available.
- `server/package.json` includes a `postinstall` step that builds the client during deploy.
- Set `MONGODB_URI`, `JWT_SECRET`, and `CLIENT_URL` on Railway.
- Set `VITE_API_URL` for the frontend if you deploy it separately.

Example backend values:

```env
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=https://your-frontend-domain.example
```

## API Endpoints

- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/projects`
- `POST /api/projects`
- `GET /api/tasks`
- `POST /api/tasks`
- `PATCH /api/tasks/:id/status`
- `GET /api/analytics/overview`

## Seed Data

On first run, the server seeds demo accounts and starter data:

- Admin: `admin@teamtask.local` / `password123`
- Member: `member@teamtask.local` / `password123`

## Troubleshooting

- If Railway shows `Not Found - /`, make sure the client has been built and the server is serving `client/dist`.
- If API calls fail, confirm `VITE_API_URL` points to the deployed backend and `CLIENT_URL` matches the deployed frontend origin.
- If the server fails to start, verify `MONGODB_URI` and `JWT_SECRET` are set correctly.

## Quick Checks

```bash
npm run dev
curl http://localhost:5000/api/health
```
