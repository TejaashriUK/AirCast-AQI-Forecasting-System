"""
AirCast Engine — FastAPI Backend v2.0
Cities: Delhi (ITO) | Mumbai (Bandra) | Bengaluru (Silk Board)
Model: XGBoost (26 features) + StandardScaler
Weather: Open-Meteo (free, no API key needed)

STEP TO INTEGRATE YOUR MODEL:
  Place both files inside  backend/models/
    → xgboost_model.pkl
    → scaler.pkl
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import pandas as pd
import numpy as np
import joblib, os, logging, warnings
from datetime import datetime, timedelta

warnings.filterwarnings("ignore")
logging.basicConfig(level=logging.INFO, format="%(levelname)s  %(message)s")
logger = logging.getLogger("AirCast")

app = FastAPI(title="AirCast Engine", version="2.0.0")
app.add_middleware(CORSMiddleware, allow_origins=["*"],
    allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

BASE_DIR  = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, "models")

CITY_CONFIG = {
    "Delhi":     {"lat":28.6139,"lon":77.2090,"station":"ITO","state":"Delhi NCR","population":"32M","color":"#ef4444","description":"India's capital — highest pollution megacity"},
    "Mumbai":    {"lat":19.0760,"lon":72.8777,"station":"Bandra","state":"Maharashtra","population":"21M","color":"#3b82f6","description":"Financial capital with coastal weather patterns"},
    "Bengaluru": {"lat":12.9716,"lon":77.5946,"station":"Silk Board","state":"Karnataka","population":"13M","color":"#22c55e","description":"Silicon Valley of India — cleaner baseline"},
}

AQI_LEVELS = [
    (0,   50,  "Good",        "#22c55e","#dcfce7","😊",True,
     "Air quality is excellent. Enjoy outdoor activities freely!",
     ["Safe for all outdoor activities including sports and jogging","Great day to open windows for fresh natural ventilation","Children and elderly can go out without any restrictions"],
     "Not Required","Fully Safe ✓"),
    (51,  100, "Satisfactory","#84cc16","#f7fee7","🙂",True,
     "Air quality is acceptable. Very sensitive individuals may feel minor discomfort.",
     ["Generally safe for most people outdoors","People with severe asthma may reduce prolonged outdoor exertion","Good for light to moderate outdoor exercise"],
     "Not Required","Safe ✓"),
    (101, 200, "Moderate",    "#eab308","#fefce8","😐",False,
     "Moderate pollution. Sensitive groups should reduce outdoor exposure.",
     ["Children, elderly and respiratory patients limit outdoor time","Carry inhaler or medication if you have breathing conditions","Avoid outdoor exercise during peak hours 8-10 AM and 6-9 PM","Keep car windows closed during commute"],
     "Recommended for sensitive groups","Limit Extended Exposure ⚠️"),
    (201, 300, "Poor",        "#f97316","#fff7ed","😷",False,
     "Poor air quality. Avoid outdoor activities. Health risk for everyone.",
     ["Everyone should limit time outdoors as much as possible","Keep all windows and doors tightly closed","Use air purifiers indoors if available — set to maximum","Seek medical attention if experiencing any breathing difficulty","Avoid opening car windows during travel"],
     "Wear N95/N99 Mask Outdoors","Avoid Unnecessary Exposure 🚫"),
    (301, 400, "Very Poor",   "#ef4444","#fef2f2","🚨",False,
     "Very poor air — HEALTH EMERGENCY for sensitive groups. Stay indoors.",
     ["Stay indoors as much as humanly possible","Avoid ALL outdoor physical exercise completely","Seal gaps under doors and around windows with tape","Schools must cancel all outdoor activities","Hospitals should expect increased respiratory patient load","Consult doctor immediately for any breathing discomfort"],
     "N95/N99 Mandatory Outdoors","STAY INDOORS 🛑"),
    (401, 500, "Severe",      "#9f1239","#fff1f2","☠️",False,
     "SEVERE HAZARD — Public health emergency. Do NOT go outside.",
     ["DO NOT go outside under any circumstances","Seal all gaps in windows and doors with tape immediately","Run air purifiers on maximum setting — replace filters now","Schools, offices and public events must be CLOSED immediately","All outdoor construction and burning must stop","Seek emergency medical care for any respiratory symptoms","Pregnant women, children and elderly need immediate safe shelter"],
     "Full Respiratory Protection MANDATORY","EMERGENCY — Do NOT Go Outside ☠️"),
]

def get_advisory(aqi):
    aqi = float(np.clip(aqi, 0, 500))
    for lo,hi,level,color,bg,emoji,safe,msg,advice,mask,outdoor in AQI_LEVELS:
        if lo <= aqi <= hi:
            return {"level":level,"color":color,"bg":bg,"emoji":emoji,"safe":safe,"message":msg,"advice":advice,"mask":mask,"outdoor":outdoor}
    return {"level":"Severe","color":"#9f1239","bg":"#fff1f2","emoji":"☠️","safe":False,
            "message":AQI_LEVELS[-1][7],"advice":AQI_LEVELS[-1][8],"mask":AQI_LEVELS[-1][9],"outdoor":AQI_LEVELS[-1][10]}

class ModelStore:
    model = None; scaler = None; loaded = False
    FEATURE_COLS = [
        'temperature_2m','relativehumidity_2m','windspeed_10m','precipitation',
        'traffic_density','hour','dayofweek','dayofyear','month',
        'pm25_lag_1','pm25_lag_2','pm25_lag_3','pm25_lag_24',
        'city_Delhi','city_Mumbai','co','no','no2','nox','o3','pm10',
        'relativehumidity','so2','temperature','wind_direction','wind_speed',
    ]
    @classmethod
    def load(cls):
        mp = os.path.join(MODEL_DIR,"xgboost_model.pkl")
        sp = os.path.join(MODEL_DIR,"scaler.pkl")
        if not os.path.exists(mp): logger.warning("xgboost_model.pkl not found → fallback mode"); return False
        if not os.path.exists(sp): logger.warning("scaler.pkl not found → fallback mode"); return False
        try:
            cls.model=joblib.load(mp); cls.scaler=joblib.load(sp); cls.loaded=True
            logger.info("✅  xgboost_model.pkl + scaler.pkl  loaded!"); return True
        except Exception as e: logger.error(f"Load error: {e}"); return False

@app.on_event("startup")
async def startup():
    os.makedirs(MODEL_DIR, exist_ok=True); ModelStore.load()
    logger.info("🚀  AirCast running  →  http://localhost:8000")

def fetch_weather(city):
    try:
        import requests_cache; from retry_requests import retry; import openmeteo_requests
        cfg=CITY_CONFIG[city]; today=datetime.now().strftime("%Y-%m-%d")
        yest=(datetime.now()-timedelta(days=1)).strftime("%Y-%m-%d")
        cs=requests_cache.CachedSession('.wx_cache',expire_after=900)
        rs=retry(cs,retries=3,backoff_factor=0.3); omc=openmeteo_requests.Client(session=rs)
        params={"latitude":cfg["lat"],"longitude":cfg["lon"],"start_date":yest,"end_date":today,
                "hourly":["temperature_2m","relativehumidity_2m","windspeed_10m","winddirection_10m","precipitation"],
                "timezone":"Asia/Kolkata"}
        resp=omc.weather_api("https://archive-api.open-meteo.com/v1/archive",params=params)
        hourly=resp[0].Hourly()
        def sg(idx,fb):
            try: v=hourly.Variables(idx).ValuesAsNumpy(); v=v[~np.isnan(v)]; return float(v[-1]) if len(v)>0 else fb
            except: return fb
        return {"temperature_2m":sg(0,28),"relativehumidity_2m":sg(1,60),"windspeed_10m":sg(2,10),"wind_direction":sg(3,180),"precipitation":sg(4,0)}
    except:
        d={"Delhi":{"temperature_2m":28,"relativehumidity_2m":55,"windspeed_10m":12,"wind_direction":270,"precipitation":0},
           "Mumbai":{"temperature_2m":30,"relativehumidity_2m":78,"windspeed_10m":14,"wind_direction":220,"precipitation":0},
           "Bengaluru":{"temperature_2m":24,"relativehumidity_2m":62,"windspeed_10m":10,"wind_direction":180,"precipitation":0}}
        return d.get(city,d["Delhi"])

SEASON_DATA={
    "Delhi":{"Winter":{"pm10":220,"co":1.5,"no":22,"no2":55,"nox":77,"o3":35,"so2":18},"Summer":{"pm10":150,"co":1.0,"no":16,"no2":40,"nox":56,"o3":55,"so2":14},"Monsoon":{"pm10":80,"co":0.7,"no":10,"no2":25,"nox":35,"o3":30,"so2":9},"PostMon":{"pm10":180,"co":1.3,"no":19,"no2":48,"nox":67,"o3":40,"so2":16}},
    "Mumbai":{"Winter":{"pm10":100,"co":1.1,"no":17,"no2":42,"nox":59,"o3":32,"so2":11},"Summer":{"pm10":85,"co":0.9,"no":14,"no2":35,"nox":49,"o3":45,"so2":9},"Monsoon":{"pm10":55,"co":0.6,"no":9,"no2":22,"nox":31,"o3":22,"so2":6},"PostMon":{"pm10":95,"co":1.0,"no":15,"no2":38,"nox":53,"o3":36,"so2":10}},
    "Bengaluru":{"Winter":{"pm10":85,"co":0.9,"no":14,"no2":35,"nox":49,"o3":28,"so2":9},"Summer":{"pm10":70,"co":0.7,"no":11,"no2":28,"nox":39,"o3":40,"so2":7},"Monsoon":{"pm10":45,"co":0.5,"no":7,"no2":18,"nox":25,"o3":20,"so2":5},"PostMon":{"pm10":78,"co":0.8,"no":12,"no2":30,"nox":42,"o3":30,"so2":8}},
}
BASELINES={"Delhi":{"Winter":280,"Summer":175,"Monsoon":95,"PostMon":210},"Mumbai":{"Winter":130,"Summer":100,"Monsoon":65,"PostMon":110},"Bengaluru":{"Winter":100,"Summer":80,"Monsoon":55,"PostMon":90}}

def get_season(m):
    if m in [3,4,5]: return "Summer"
    elif m in [6,7,8,9]: return "Monsoon"
    elif m in [10,11]: return "PostMon"
    return "Winter"

def build_row(city,dt,weather,l1=None,l2=None,l3=None,l24=None):
    s=get_season(dt.month); p=SEASON_DATA[city][s]; b=BASELINES[city][s]
    h,dow=dt.hour,dt.weekday()
    rush=int(h in [7,8,9,17,18,19,20]); we=int(dow>=5)
    traf=float(np.clip(0.5+(0.15 if not we else -0.15)+(0.20 if rush else 0),0,1))
    _l1=l1 if l1 is not None else float(b); _l2=l2 if l2 is not None else float(b)
    _l3=l3 if l3 is not None else float(b); _l24=l24 if l24 is not None else float(b)
    return {
        "temperature_2m":weather.get("temperature_2m",28),"relativehumidity_2m":weather.get("relativehumidity_2m",60),
        "windspeed_10m":weather.get("windspeed_10m",10),"precipitation":weather.get("precipitation",0),
        "traffic_density":traf,"hour":h,"dayofweek":dow,"dayofyear":dt.timetuple().tm_yday,"month":dt.month,
        "pm25_lag_1":_l1,"pm25_lag_2":_l2,"pm25_lag_3":_l3,"pm25_lag_24":_l24,
        "city_Delhi":1 if city=="Delhi" else 0,"city_Mumbai":1 if city=="Mumbai" else 0,
        "co":p["co"],"no":p["no"],"no2":p["no2"],"nox":p["nox"],"o3":p["o3"],"pm10":p["pm10"],
        "relativehumidity":weather.get("relativehumidity_2m",60),"so2":p["so2"],
        "temperature":weather.get("temperature_2m",28),"wind_direction":weather.get("wind_direction",180),
        "wind_speed":weather.get("windspeed_10m",10),
    }

def predict_one(city,dt,weather,l1=None,l2=None,l3=None,l24=None):
    row=build_row(city,dt,weather,l1,l2,l3,l24)
    if ModelStore.loaded:
        try:
            X=pd.DataFrame([row])[ModelStore.FEATURE_COLS]
            return float(np.clip(ModelStore.model.predict(ModelStore.scaler.transform(X))[0],0,500))
        except Exception as e: logger.error(f"Predict error: {e}")
    b=BASELINES[city][get_season(dt.month)]
    if weather.get("precipitation",0)>5: b*=0.75
    if weather.get("windspeed_10m",0)>20: b*=0.85
    if weather.get("relativehumidity_2m",0)>80: b*=1.10
    return float(np.clip(b+np.random.normal(0,b*0.07),0,500))

class ForecastRequest(BaseModel):
    city: str; hours: int=24; start_time: Optional[str]=None

class HourlyPoint(BaseModel):
    datetime:str; hour_label:str; hour_num:int; aqi:float
    level:str; color:str; bg:str; safe:bool; emoji:str

class ForecastResponse(BaseModel):
    city:str; station:str; state:str; city_color:str; generated_at:str; hours:int
    model_active:bool; current_aqi:float; current_level:str; current_color:str
    current_bg:str; safe:bool; emoji:str; message:str; advice:List[str]; mask:str
    outdoor:str; weather:dict; forecast:List[HourlyPoint]; peak_aqi:float
    peak_time:str; avg_aqi:float; good_hours:int; bad_hours:int

@app.get("/")
def root():
    return {"service":"AirCast Engine","version":"2.0.0","status":"running","model_loaded":ModelStore.loaded,"cities":list(CITY_CONFIG.keys()),"docs":"http://localhost:8000/docs"}

@app.get("/health")
def health():
    return {"status":"ok","model_loaded":ModelStore.loaded,"timestamp":datetime.now().isoformat()}

@app.get("/cities")
def get_cities():
    return {"cities":[{"name":n,"station":c["station"],"state":c["state"],"population":c["population"],"description":c["description"],"color":c["color"],"lat":c["lat"],"lon":c["lon"]} for n,c in CITY_CONFIG.items()]}

@app.post("/forecast",response_model=ForecastResponse)
def forecast(req:ForecastRequest):
    if req.city not in CITY_CONFIG: raise HTTPException(400,f"City must be: {list(CITY_CONFIG.keys())}")
    if not (1<=req.hours<=48): raise HTTPException(400,"hours must be 1-48")
    start=datetime.fromisoformat(req.start_time) if req.start_time else datetime.now()
    weather=fetch_weather(req.city); cfg=CITY_CONFIG[req.city]; buf=[]; pts=[]
    sep = "%-I %p" if os.name!="nt" else "%#I %p"
    for h in range(req.hours):
        dt=start+timedelta(hours=h)
        l1=buf[-1] if len(buf)>=1 else None; l2=buf[-2] if len(buf)>=2 else None
        l3=buf[-3] if len(buf)>=3 else None; l24=buf[-24] if len(buf)>=24 else None
        aqi=predict_one(req.city,dt,weather,l1,l2,l3,l24); buf.append(aqi)
        adv=get_advisory(aqi)
        pts.append(HourlyPoint(datetime=dt.isoformat(),hour_label=dt.strftime(sep),
            hour_num=h,aqi=round(aqi,1),level=adv["level"],color=adv["color"],
            bg=adv["bg"],safe=adv["safe"],emoji=adv["emoji"]))
    adv0=get_advisory(pts[0].aqi); peak=max(pts,key=lambda x:x.aqi)
    peak_dt=datetime.fromisoformat(peak.datetime); vals=[p.aqi for p in pts]
    return ForecastResponse(
        city=req.city,station=cfg["station"],state=cfg["state"],city_color=cfg["color"],
        generated_at=datetime.now().isoformat(),hours=req.hours,model_active=ModelStore.loaded,
        current_aqi=pts[0].aqi,current_level=adv0["level"],current_color=adv0["color"],
        current_bg=adv0["bg"],safe=adv0["safe"],emoji=adv0["emoji"],message=adv0["message"],
        advice=adv0["advice"],mask=adv0["mask"],outdoor=adv0["outdoor"],
        weather={"temp":round(weather.get("temperature_2m",28),1),"humidity":round(weather.get("relativehumidity_2m",60),1),"wind":round(weather.get("windspeed_10m",10),1),"rain":round(weather.get("precipitation",0),1),"wind_dir":round(weather.get("wind_direction",180),0)},
        forecast=pts,peak_aqi=round(peak.aqi,1),peak_time=peak_dt.strftime(sep+", %b %d"),
        avg_aqi=round(float(np.mean(vals)),1),good_hours=sum(1 for p in pts if p.safe),bad_hours=sum(1 for p in pts if not p.safe))

@app.get("/forecast/{city}")
def forecast_get(city:str,hours:int=24):
    return forecast(ForecastRequest(city=city,hours=hours))
