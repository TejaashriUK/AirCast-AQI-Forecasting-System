# AirCast — Complete Setup Guide

## STEP 1 — OPEN IN VS CODE

Double-click:  aircast.code-workspace

VS Code will open showing both panels on the left:
  🖥️  Backend  (FastAPI + Python)
  🎨  Frontend (React + JS)


## STEP 2 — PLACE YOUR .pkl MODEL FILES

In the VS Code file explorer (left sidebar), expand:
  🖥️  Backend → models/

Drag your downloaded files from Downloads folder into that folder:
  xgboost_model.pkl    ← drag here
  scaler.pkl           ← drag here

The models/ folder should now contain:
  ├── xgboost_model.pkl   ✅
  ├── scaler.pkl          ✅
  └── PLACE_YOUR_FILES_HERE.txt  (can delete this)


## STEP 3 — RUN BACKEND (Terminal 1)

In VS Code:  Menu → Terminal → New Terminal

Type these commands:
  cd backend
  python -m venv venv

  Windows:     venv\Scripts\activate
  Mac/Linux:   source venv/bin/activate

  pip install -r requirements.txt
  uvicorn main:app --reload --port 8000

Success message you should see:
  ✅  xgboost_model.pkl + scaler.pkl  loaded!
  🚀  AirCast running  →  http://localhost:8000


## STEP 4 — RUN FRONTEND (Terminal 2)

Click the  +  icon in the terminal panel (bottom of VS Code)
A second terminal opens.

Type these commands:
  cd frontend
  npm install
  npm start

Browser auto-opens at:  http://localhost:3000


## STEP 5 — USE THE APP

Select city    →  Delhi / Mumbai / Bengaluru
Select window  →  6h / 12h / 24h / 36h / 48h
Click Refresh  →  Get updated forecast

The dashboard shows:
  • AQI gauge (animated circular)
  • Safe / Unsafe badge
  • Health advisory with advice bullets
  • Live weather (temp, humidity, wind, rain)
  • Stats: avg AQI, peak AQI, safe hours, risky hours
  • 24h area forecast chart
  • Hour-by-hour bar chart


## VERIFY EVERYTHING WORKS

Open these URLs in browser:
  http://localhost:8000/health     → should show  "model_loaded": true
  http://localhost:8000/docs       → interactive API documentation
  http://localhost:8000/cities     → list of 3 cities
  http://localhost:3000            → your React frontend


## PROJECT FILE TREE EXPLAINED

aircast-project/
│
├── aircast.code-workspace         ← OPEN THIS in VS Code
├── HOW_TO_RUN.md                  ← this guide
│
├── backend/                       ← Python FastAPI server
│   ├── main.py                    ← all backend logic
│   ├── requirements.txt           ← pip install this
│   └── models/
│       ├── xgboost_model.pkl      ← ★ YOUR MODEL FILE
│       ├── scaler.pkl             ← ★ YOUR SCALER FILE
│       └── PLACE_YOUR_FILES_HERE.txt
│
└── frontend/                      ← React app
    ├── package.json               ← npm install reads this
    ├── public/
    │   └── index.html             ← HTML shell
    └── src/
        ├── index.js               ← React entry point
        ├── App.js                 ← main page layout
        └── components/
            ├── AqiGauge.js        ← animated circular gauge
            ├── AdvisoryPanel.js   ← safe/unsafe + health tips
            ├── WeatherStrip.js    ← weather chips (temp/wind/rain)
            ├── ForecastChart.js   ← area chart (recharts)
            ├── HourlyBars.js      ← hour-by-hour bar chart
            └── StatsStrip.js      ← avg/peak/safe/risky stats
