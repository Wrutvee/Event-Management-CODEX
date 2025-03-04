@echo off
title Event Management System Servers

:: Kill any existing processes on the ports (optional)
echo Killing existing processes on ports...
taskkill /F /IM node.exe > nul 2>&1

:: Set window colors
color 0A

echo Starting all servers...
echo.

:: Start Admin Panel Backend (Port 5000)
start "Admin Backend" cmd /k "cd admin-panel-backend && npm start"

:: Start Admin Panel Frontend (Port 5173)
start "Admin Frontend" cmd /k "cd admin-panel-frontend && npm run dev"

:: Start Users Panel Backend (Port 5001)
start "Users Backend" cmd /k "cd users-panel-backend && npm start"

:: Start Users Panel Frontend (Port 5174)
start "Users Frontend" cmd /k "cd users-panel-frontend && npm run dev"

echo.
echo All servers started! You can minimize this window.
echo.
echo Admin Panel: http://localhost:5173
echo Users Panel: http://localhost:5174
echo.
echo Press any key to stop all servers...

pause > nul

:: Kill all node processes when user presses a key
taskkill /F /IM node.exe