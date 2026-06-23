import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AqiGauge      from './components/AqiGauge';
import WeatherStrip  from './components/WeatherStrip';
import ForecastChart from './components/ForecastChart';
import HourlyBars    from './components/HourlyBars';
import StatsStrip    from './components/StatsStrip';
import AdvisoryPanel from './components/AdvisoryPanel';

const API = 'http://localhost:8000';
const CITIES = [
  { name:'Delhi',     icon:'🏛️', station:'ITO',       color:'#ef4444' },
  { name:'Mumbai',    icon:'🌊', station:'Bandra',     color:'#3b82f6' },
  { name:'Bengaluru', icon:'💻', station:'Silk Board', color:'#22c55e' },
];
const HOUR_OPTIONS = [6, 12, 24, 36, 48];

function aqiColor(v) {
  if (v<=50) return '#22c55e'; if (v<=100) return '#84cc16';
  if (v<=200) return '#eab308'; if (v<=300) return '#f97316';
  if (v<=400) return '#ef4444'; return '#9f1239';
}

export default function App() {
  const [city,  setCity]  = useState('Delhi');
  const [hours, setHours] = useState(24);
  const [data,  setData]  = useState(null);
  const [load,  setLoad]  = useState(false);
  const [error, setError] = useState('');

  const fetchForecast = async (c, h) => {
    setLoad(true); setError('');
    try {
      const res = await axios.post(`${API}/forecast`, { city: c, hours: h });
      setData(res.data);
    } catch (e) {
      setError(e.response?.data?.detail ||
        'Cannot reach backend. Run:  cd backend  →  uvicorn main:app --reload');
    } finally { setLoad(false); }
  };

  useEffect(() => { fetchForecast(city, hours); }, [city, hours]);

  const glow = data ? aqiColor(data.current_aqi) : '#3b82f6';

  return (
    <div style={{ minHeight:'100vh',background:'#030912',color:'#e2e8f0',
      fontFamily:"'DM Sans',sans-serif",position:'relative',overflowX:'hidden' }}>

      {/* Grid bg */}
      <div style={{ position:'fixed',inset:0,zIndex:0,pointerEvents:'none',
        backgroundImage:'linear-gradient(rgba(255,255,255,0.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.018) 1px,transparent 1px)',
        backgroundSize:'60px 60px' }} />

      {/* Ambient glow top-left */}
      <div style={{ position:'fixed',top:'-25%',left:'5%',width:700,height:700,borderRadius:'50%',
        background:`radial-gradient(circle,${glow}14 0%,transparent 68%)`,filter:'blur(50px)',
        pointerEvents:'none',zIndex:0,transition:'background 1.2s ease' }} />

      {/* Ambient glow bottom-right */}
      <div style={{ position:'fixed',bottom:'-20%',right:'0%',width:500,height:500,borderRadius:'50%',
        background:'radial-gradient(circle,#1d4ed814 0%,transparent 68%)',filter:'blur(50px)',
        pointerEvents:'none',zIndex:0 }} />

      {/* Floating particles */}
      <svg style={{ position:'fixed',inset:0,width:'100%',height:'100%',pointerEvents:'none',zIndex:0 }}>
        {Array.from({length:22},(_,i)=>(
          <circle key={i} cx={`${(i*4.5+3)%100}%`} cy={`${(i*7+5)%100}%`}
            r={0.8+(i%3)*0.6}
            fill={['#22c55e','#3b82f6','#f97316','#eab308','#ef4444'][i%5]}
            opacity={0.06+(i%4)*0.04}>
            <animate attributeName="cy"
              values={`${(i*7+5)%100}%;${((i*7+5)%100)-12}%;${(i*7+5)%100}%`}
              dur={`${9+i*0.5}s`} repeatCount="indefinite" />
          </circle>
        ))}
      </svg>

      {/* ─── PAGE CONTENT ─────────────────────────────────── */}
      <div style={{ position:'relative',zIndex:1,maxWidth:1120,margin:'0 auto',padding:'0 24px 80px' }}>

        {/* ═══ HEADER ════════════════════════════════════════ */}
        <header style={{ paddingTop:36,paddingBottom:28,display:'flex',
          alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:16 }}>
          <div>
            <div style={{ display:'flex',alignItems:'center',gap:12 }}>
              <div style={{ width:44,height:44,borderRadius:12,
                background:'linear-gradient(135deg,#1d4ed8,#059669)',
                display:'flex',alignItems:'center',justifyContent:'center',
                fontSize:22,boxShadow:'0 0 24px #1d4ed840' }}>🌬️</div>
              <h1 style={{ margin:0,fontSize:30,fontWeight:800,
                fontFamily:"'Syne',sans-serif",letterSpacing:'-0.5px',
                background:'linear-gradient(135deg,#f1f5f9 30%,#94a3b8)',
                WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent' }}>AirCast</h1>
            </div>
            <p style={{ margin:'5px 0 0 56px',color:'#475569',fontSize:11,
              fontFamily:"'DM Mono',monospace",letterSpacing:1.5 }}>
              AI · AQI FORECASTING · INDIA
            </p>
          </div>

          {/* Model status */}
          <div style={{ display:'flex',alignItems:'center',gap:7,padding:'7px 16px',borderRadius:999,
            background:data?.model_active?'#052e16':'#1c1917',
            border:`1px solid ${data?.model_active?'#166534':'#292524'}`,
            fontFamily:"'DM Mono',monospace",fontSize:11,
            color:data?.model_active?'#4ade80':'#78716c' }}>
            <span style={{ width:7,height:7,borderRadius:'50%',display:'inline-block',
              background:data?.model_active?'#4ade80':'#78716c',
              boxShadow:data?.model_active?'0 0 8px #4ade80':'none',
              animation:data?.model_active?'pulse 2s infinite':'none' }} />
            {data?.model_active ? 'XGBoost Active' : 'Fallback Mode'}
          </div>
        </header>

        {/* ═══ CONTROLS ══════════════════════════════════════ */}
        <div style={{ display:'flex',gap:18,flexWrap:'wrap',marginBottom:28 }}>

          {/* City buttons */}
          <div style={{ flex:1,minWidth:260 }}>
            <div style={{ color:'#475569',fontSize:10,letterSpacing:2,
              fontFamily:"'DM Mono',monospace",marginBottom:10 }}>SELECT CITY</div>
            <div style={{ display:'flex',gap:10 }}>
              {CITIES.map(c=>(
                <button key={c.name} onClick={()=>setCity(c.name)} style={{
                  flex:1,padding:'14px 8px',borderRadius:16,cursor:'pointer',
                  border:`1px solid ${city===c.name?c.color:'#1e2d47'}`,
                  background:city===c.name?`${c.color}18`:'#060f1e',
                  color:city===c.name?c.color:'#64748b',
                  fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,
                  transition:'all 0.22s ease',
                  boxShadow:city===c.name?`0 0 22px ${c.color}28`:'none',
                  transform:city===c.name?'translateY(-2px)':'none',outline:'none' }}>
                  <div style={{ fontSize:22,marginBottom:5 }}>{c.icon}</div>
                  <div>{c.name}</div>
                  <div style={{ fontSize:10,fontWeight:400,marginTop:3,
                    fontFamily:"'DM Sans',sans-serif",opacity:0.65 }}>{c.station}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Hours buttons */}
          <div>
            <div style={{ color:'#475569',fontSize:10,letterSpacing:2,
              fontFamily:"'DM Mono',monospace",marginBottom:10 }}>FORECAST WINDOW</div>
            <div style={{ display:'flex',gap:8 }}>
              {HOUR_OPTIONS.map(h=>(
                <button key={h} onClick={()=>setHours(h)} style={{
                  width:54,height:54,borderRadius:14,cursor:'pointer',
                  border:`1px solid ${hours===h?'#3b82f6':'#1e2d47'}`,
                  background:hours===h?'#1e3a8a':'#060f1e',
                  color:hours===h?'#93c5fd':'#475569',
                  fontFamily:"'DM Mono',monospace",fontWeight:700,fontSize:13,
                  transition:'all 0.22s ease',
                  boxShadow:hours===h?'0 0 18px #3b82f640':'none',outline:'none' }}>
                  {h}h
                </button>
              ))}
            </div>
          </div>

          {/* Refresh */}
          <div style={{ display:'flex',alignItems:'flex-end' }}>
            <button onClick={()=>fetchForecast(city,hours)} disabled={load} style={{
              height:54,padding:'0 22px',borderRadius:14,cursor:load?'wait':'pointer',
              border:'1px solid #1e40af',background:load?'#1e3a8a':'#1d4ed8',color:'#bfdbfe',
              fontFamily:"'DM Mono',monospace",fontSize:13,fontWeight:700,
              transition:'all 0.22s',opacity:load?0.65:1,
              boxShadow:'0 0 22px #1d4ed845',outline:'none' }}>
              {load ? '⏳ Loading...' : '⟳ Refresh'}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{ background:'#1c0a0a',border:'1px solid #7f1d1d',borderRadius:14,
            padding:'14px 20px',marginBottom:24,fontFamily:"'DM Mono',monospace",
            fontSize:13,color:'#fca5a5' }}>⚠️ {error}</div>
        )}

        {/* Loading */}
        {load && !data && (
          <div style={{ textAlign:'center',padding:'100px 0' }}>
            <div style={{ fontSize:52,marginBottom:16,animation:'spin 2.2s linear infinite' }}>🌬️</div>
            <div style={{ color:'#475569',fontFamily:"'DM Mono',monospace",fontSize:13 }}>
              Fetching AI forecast for {city}…
            </div>
          </div>
        )}

        {/* ═══ DASHBOARD ══════════════════════════════════════ */}
        {data && (
          <div style={{ display:'flex',flexDirection:'column',gap:20 }}>

            {/* ROW 1 — Gauge + Advisory */}
            <div style={{ display:'grid',gridTemplateColumns:'240px 1fr',gap:20 }}>
              {/* Gauge */}
              <div style={{ background:'#060f1e',border:`1px solid ${data.current_color}40`,
                borderRadius:20,padding:'28px 16px',display:'flex',flexDirection:'column',
                alignItems:'center',gap:14,boxShadow:`0 0 44px ${data.current_color}14`,
                position:'relative',overflow:'hidden' }}>
                <div style={{ color:'#475569',fontSize:9,letterSpacing:2.5,
                  fontFamily:"'DM Mono',monospace" }}>CURRENT · {data.city.toUpperCase()}</div>
                <AqiGauge aqi={data.current_aqi} level={data.current_level}
                  color={data.current_color} emoji={data.emoji} size={190} />
                <div style={{ textAlign:'center' }}>
                  <div style={{ fontSize:11,color:'#475569',fontFamily:"'DM Mono',monospace" }}>
                    {data.station} Station · {data.state}
                  </div>
                </div>
                <div style={{ position:'absolute',bottom:-50,right:-50,width:140,height:140,
                  borderRadius:'50%',background:`radial-gradient(circle,${data.current_color}18,transparent 70%)`,
                  pointerEvents:'none' }} />
              </div>
              {/* Advisory */}
              <AdvisoryPanel data={data} />
            </div>

            {/* ROW 2 — Weather */}
            <div style={{ background:'#060f1e',border:'1px solid #1e2d47',borderRadius:20,padding:'20px 24px' }}>
              <div style={{ color:'#475569',fontSize:10,letterSpacing:2,
                fontFamily:"'DM Mono',monospace",marginBottom:14 }}>
                LIVE WEATHER · {data.city.toUpperCase()} (via Open-Meteo)
              </div>
              <WeatherStrip weather={data.weather} />
            </div>

            {/* ROW 3 — Stats */}
            <StatsStrip data={data} />

            {/* ROW 4 — Area chart */}
            <ForecastChart data={data.forecast} avgAqi={data.avg_aqi}
              hours={hours} generatedAt={data.generated_at} />

            {/* ROW 5 — Hourly bars */}
            <HourlyBars data={data.forecast} />

            {/* Footer */}
            <div style={{ textAlign:'center',paddingTop:8,paddingBottom:12 }}>
              <div style={{ color:'#1e3a5f',fontSize:11,fontFamily:"'DM Mono',monospace" }}>
                AIRCAST ENGINE · AURELION 2026 · OpenAQ + Open-Meteo · XGBoost + StandardScaler
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin  { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.35} }
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-track{background:#060f1e}
        ::-webkit-scrollbar-thumb{background:#1e2d47;border-radius:4px}
        button{font-family:inherit}
      `}</style>
    </div>
  );
}
