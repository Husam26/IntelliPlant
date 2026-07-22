@echo off
echo ===================================================
echo   IntelliPlant - Automatic Project Setup ^& Runner
echo ===================================================
echo.

:: Check for python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed or not in PATH. Please install Python.
    pause
    exit /b
)

:: Check for npm
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js/npm is not installed or not in PATH. Please install Node.js.
    pause
    exit /b
)

echo [1/3] Setting up Backend Virtual Environment...
cd backend
if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
)
echo Activating virtual environment and installing dependencies...
call venv\Scripts\activate
pip install -r requirements.txt
echo.

echo [2/3] Setting up Frontend...
cd ../frontend
echo Installing frontend dependencies...
call npm install
echo.

echo [3/3] Checking Database Seeding...
cd ../backend
call venv\Scripts\activate
echo Seeding initial demo data...
python seed_demo_data.py
echo.

echo ===================================================
echo   Starting Backend and Frontend Servers...
echo ===================================================
echo.
cd ..

:: Start backend in a new command window
start "IntelliPlant Backend" cmd /k "cd backend && venv\Scripts\activate && uvicorn app.main:app --reload --port 8000"

:: Start frontend in a new command window
start "IntelliPlant Frontend" cmd /k "cd frontend && npm run dev"

echo Servers are launching!
echo.
echo Backend URL:  http://localhost:8000
echo Frontend URL: http://localhost:5173
echo.
echo Press any key to exit this launcher window (the servers will remain running in their own windows).
pause
