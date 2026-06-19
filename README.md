# DevTrack

DevTrack is a production-ready MERN dashboard for managing personal software projects, repositories, deployments, tasks, bugs, maintenance work, upgrades, notifications, and activity history.

## Stack

- React + Vite, React Router, Axios, Recharts, Lucide React, React Hot Toast
- Node.js, Express, MongoDB Atlas, Mongoose, JWT authentication
- Frontend deploy-ready for Vercel from `server/client`
- Backend deploy-ready for Render

## Quick Start

1. Install dependencies:

   ```bash
   npm  install
   ```

2. Configure environment files:

   ```bash
   cd backend
   npm install
   nodemon server.js
      ```

3. Update `server/.env` with your MongoDB Atlas URI and JWT secret.

4. Run both apps:

   ```bash
   cd client
   npm install
   npm run dev
   ```

Frontend: `http://localhost:5173`  
Backend: `http://localhost:5000`

## Deployment

Render backend:

- Root directory: `server`
- Build command: `npm install`
- Start command: `npm start`
- Environment variables: `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`, `NODE_ENV=production`

Vercel frontend:

- Root directory: `server/client`
- Build command: `npm run build`
- Output directory: `dist`
- Environment variable: `VITE_API_URL=https://your-render-api.onrender.com/api`
=======
# Dashboard
DevTrack is a professional developer dashboard for managing and tracking software projects. Monitor project status, progress, upgrades, maintenance, tasks, deadlines, repositories, and deployment links in one place, with analytics and email reminders to improve productivity and organization.
>>>>>>>
