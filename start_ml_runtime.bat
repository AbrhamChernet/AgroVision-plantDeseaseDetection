@echo off
title AgroVision Host ML Runtime
echo ===================================================
echo Starting AgroVision Host ML Runtime (YOLOv8 CPU)...
echo ===================================================
cd /d "%~dp0ml_service"
.\venv\Scripts\python.exe -m uvicorn main:app --host 0.0.0.0 --port 8001
pause
