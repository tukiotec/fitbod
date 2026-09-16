@echo off
title Fitbod Pro - Global Mobile Server (4G/5G)
cd /d "%~dp0"

echo ===================================================
echo   FITBOD PRO MOBILE - KET NOI TOAN CAU 4G/5G
echo ===================================================
echo Dang khoi tao may chu va duong truyen Cloudflare...
echo.

python start_tunnel.py

pause

