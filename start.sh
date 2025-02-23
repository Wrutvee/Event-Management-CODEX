#!/bin/bash

# Start Admin Panel Backend (Port 3000)
cd admin-panel-backend
npm install
npm start &

# Start Users Panel Backend (Port 3001)
cd ../users-panel-backend
npm install
npm start &

# Start Admin Panel Frontend (Port 5174)
cd ../admin-panel-frontend
npm install
npm run dev &

# Start Users Panel Frontend (Port 5173)
cd ../users-panel-frontend
npm install
npm run dev &

# Wait for all background processes
wait