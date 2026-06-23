import React from 'react';

function Chip({ icon, label, value }) {
  return (
    <div style={{ background:'#0a1628',border:'1px solid #1e2d47',borderRadius:12,
      padding:'10px 16px',textAlign:'center',minWidth:76 }}>
      <div style={{ fontSize:22,marginBottom:4 }}>{icon}</div>
      <div style={{ color:'#e2e8f0',fontFamily:"'DM Mono',monospace",fontSize:14,fontWeight:600 }}>{value}</div>
      <div style={{ color:'#475569',fontFamily:"'DM Sans',sans-serif",fontSize:10,marginTop:3,letterSpacing:0.5 }}>{label}</div>
    </div>
  );
}

export default function WeatherStrip({ weather }) {
  if (!weather) return null;
  return (
    <div style={{ display:'flex',gap:10,flexWrap:'wrap' }}>
      <Chip icon="🌡️" label="Temperature" value={`${weather.temp}°C`} />
      <Chip icon="💧" label="Humidity"    value={`${weather.humidity}%`} />
      <Chip icon="💨" label="Wind Speed"  value={`${weather.wind} km/h`} />
      <Chip icon="🌧️" label="Rainfall"    value={`${weather.rain} mm`} />
      <Chip icon="🧭" label="Wind Dir"    value={`${weather.wind_dir}°`} />
    </div>
  );
}
