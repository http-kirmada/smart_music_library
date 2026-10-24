@echo off
title Smart Music Library & Recommendation System
color 0B
cls

echo ===============================================================================
echo       SMART MUSIC LIBRARY & GRAPH-BASED RECOMMENDATION SYSTEM
echo ===============================================================================
echo.
echo   [DSA Implementation]:
echo     1. Multi-Way Tree           - Hierarchical Music Library (Genre -^> Artist -^> Album)
echo     2. Doubly Linked List       - Playlist Management & Reordering
echo     3. FIFO Playback Queue      - Up Next Playback Queue
echo     4. LIFO History Stack       - Playback History & Back Navigation
echo     5. Undirected Weighted Graph - Similar Song Recommendations
echo     6. Song Hash Table          - O(1) Exact Song Retrieval
echo     7. Auth Hash Table          - 5 Pre-Configured User Accounts
echo.
echo   [5 Pre-Configured Accounts for Evaluator]:
echo     1. alex_music   / MusicPass123!   (Music Enthusiast)
echo     2. sarah_rock   / RockOn2026#     (Rock Enthusiast)
echo     3. david_jazz   / JazzSmooth!45   (Jazz Curator)
echo     4. elena_dsa    / GraphAlgo99$    (DSA Evaluator - Recommended)
echo     5. harsh_admin  / SmartMaster77!  (System Administrator)
echo.
echo ===============================================================================
echo.

cd /d "%~dp0"

echo [1/4] Checking Node.js runtime...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH!
    echo Please install Node.js from https://nodejs.org/ and re-run.
    pause
    exit /b 1
)
echo      Node.js is available.

echo.
echo [2/4] Checking node dependencies...
if not exist "node_modules\" (
    echo      Installing dependencies (express, cors, pdfkit)...
    call npm install
) else (
    echo      Dependencies verified.
)

echo.
echo [3/4] Checking DSA Guidelines PDF...
if not exist "Smart_Music_Library_DSA_Guidelines_and_Info.pdf" (
    echo      Compiling technical guidelines PDF...
    node generate_pdf.js
) else (
    echo      PDF guidelines ready.
)

echo.
echo [4/4] Starting server and launching browser...
echo.
echo      Opening http://localhost:5000 in your browser...
start http://localhost:5000

echo.
echo ===============================================================================
echo      Server running on http://localhost:5000  (Press Ctrl+C to stop)
echo ===============================================================================
echo.

node server.js
pause
