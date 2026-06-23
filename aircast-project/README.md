# AirCast – Air Quality Forecasting System

AirCast is a full-stack machine learning application that forecasts Air Quality Index (AQI) levels using historical environmental data and presents predictions through an interactive web dashboard.

The project combines a React frontend, a FastAPI backend and an XGBoost machine learning model to generate AQI forecasts and provide users with easy-to-understand visual insights.

---

## Project Overview

Air quality has a direct impact on public health. Most air quality platforms focus on displaying current conditions while offering limited forecasting capabilities.

AirCast addresses this problem by predicting future AQI values using machine learning. The application enables users to explore forecast trends, view air quality metrics and understand potential health impacts through a simple dashboard.

---

## Features

* AQI prediction using XGBoost
* FastAPI REST API backend
* React-based dashboard
* Multi-city forecast support
* Interactive forecast visualizations
* Hourly AQI breakdown
* Health advisory recommendations
* Model status monitoring
* Modular frontend and backend architecture

---

## Technology Stack

### Frontend

* React.js
* JavaScript
* Recharts
* HTML
* CSS

### Backend

* FastAPI
* Python
* Uvicorn

### Machine Learning

* XGBoost
* Scikit-Learn
* Pandas
* NumPy

### Development Tools

* Git
* GitHub
* VS Code

---

## Architecture

```text
User Interface (React)

        ↓

FastAPI Backend

        ↓

Data Processing

        ↓

XGBoost Prediction Model

        ↓

Forecast Results

        ↓

Charts and Health Advisories
```

---

## Project Structure

```text
aircast-project/

├── README.md

├── backend/
│   ├── main.py
│   ├── requirements.txt
│   └── models/
│       ├── xgboost_model.pkl
│       └── scaler.pkl

└── frontend/
    ├── package.json
    ├── public/
    │   └── index.html
    └── src/
        ├── index.js
        ├── App.js
        └── components/
            ├── AqiGauge.js
            ├── WeatherStrip.js
            ├── ForecastChart.js
            ├── HourlyBars.js
            ├── AdvisoryCard.js
            └── StatsStrip.js
```

---

## Screenshots

https://kommodo.ai/i/zbNOsn8wPN4KWd5oxHUQ
https://kommodo.ai/i/YQgDbsV7ZBp2kGWXCLR0
https://kommodo.ai/i/IX2tpMCrtzrnTvN7p8au
https://kommodo.ai/i/8vUuD6VPqkJa3CoSViZC
https://kommodo.ai/i/5MTo2O4FWPxxuu5fFlBC
https://kommodo.ai/i/6LNOH5myulaB3IkrfGt4 

---

## Installation

### Clone the Repository

```bash
git clone https://github.com/TejaashriUK/AirCast-AQI-Forecasting-System.git

cd AirCast-AQI-Forecasting-System
```
`
### Backend Setup

```bash
cd backend

python -m venv venv

# Windows
venv\Scripts\activate

# Linux / macOS
source venv/bin/activate

pip install -r requirements.txt

uvicorn main:app --reload --port 8000
```

### Frontend Setup

```bash
cd frontend

npm install

npm start
```

Frontend:

```text
http://localhost:3000
```

Backend:

```text
http://localhost:8000
```

API Documentation:

```text
http://localhost:8000/docs
```

---

## API Endpoints

| Method | Endpoint         | Description                   |
| ------ | ---------------- | ----------------------------- |
| POST   | /forecast        | Generate AQI forecast         |
| GET    | /forecast/{city} | Forecast for a specific city  |
| GET    | /cities          | List supported cities         |
| GET    | /health          | Verify model status           |
| GET    | /docs            | Interactive API documentation |

---

## Machine Learning Workflow

1. Data collection
2. Data preprocessing
3. Feature engineering
4. Data scaling
5. Model training using XGBoost
6. Forecast generation
7. Result visualization
8. Health advisory generation

---

## Future Improvements

* Integration with real-time weather APIs
* Live AQI monitoring
* Cloud deployment
* Historical trend analysis
* User authentication
* Mobile application support

---

## What I Learned

This project helped me gain practical experience in:

* Machine learning model development
* Full-stack application development
* REST API design
* Frontend engineering with React
* Data visualization
* Project organization
* Version control using Git and GitHub

---

## Author

Tejaashri K

B.Tech Artificial Intelligence and Data Science

GitHub: [Add GitHub Profile Link]

LinkedIn: [Add LinkedIn Profile Link]

---

## License

This project is licensed under the MIT License.
