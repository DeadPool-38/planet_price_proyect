@echo off
echo ========================================
echo BloqueSite E-Commerce Platform
echo Starting Backend and Frontend Servers
echo ========================================
echo.

REM Start Backend Server in new window
echo Starting Django Backend Server...
start "Django Backend - Port 8000" cmd /k "cd /d "%~dp0" && ..\bloque\Scripts\activate && python manage.py runserver"

REM Wait a moment for backend to start
timeout /t 3 /nobreak >nul

REM Start Frontend Server in new window
echo Starting React Frontend Server...
start "React Frontend - Port 3000" cmd /k "cd /d "%~dp0frontend" && npm start"

echo.
echo ========================================
echo Servers are starting...
echo.
echo Backend:  http://localhost:8000
echo Frontend: http://localhost:3000
echo Admin:    http://localhost:8000/admin
echo.
echo Press any key to close this window...
echo ========================================
pause >nul