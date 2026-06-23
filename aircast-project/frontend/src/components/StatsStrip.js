// ─────────────────────────────────────────────────────────────
// StatsStrip.js — 4-card summary stats row
// Props: data (ForecastResponse)
// ─────────────────────────────────────────────────────────────
import React from 'react';

function aqiColor(v) {
  if (v <= 50)  return '#22c55e';
  if (v <= 100) return '#84cc16';
  if (v <= 200) return '#eab308';
  if (v <= 300) return '#f97316';
  if (v <= 400) return '#ef4444';
  return '#9f1239';
}

function StatCard({ icon, label, value, unit, sub, color }) {
  return (
    <div style={{
      background: '#060f1e',
      border: '1px solid #1e2d47',
      borderRadius: 16,
      padding: '18px 20px',
      flex: 1,
    }}>
      <div style={{
        color: '#475569', fontSize: 10,
        fontFamily: "'DM Mono', monospace",
        letterSpacing: 1.5, marginBottom: 8,
      }}>
        {label}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <span style={{ fontSize: 18 }}>{icon}</span>
        <span style={{
          fontSize: 32, fontWeight: 800, color,
          fontFamily: "'Syne', sans-serif",
          textShadow: `0 0 20px ${color}60`,
        }}>
          {value}
        </span>
        {unit && (
          <span style={{
            color: '#475569',
            fontFamily: "'DM Mono', monospace", fontSize: 13,
          }}>
            {unit}
          </span>
        )}
      </div>
      {sub && (
        <div style={{
          color: '#475569', fontSize: 10,
          fontFamily: "'DM Mono', monospace", marginTop: 4,
        }}>
          {sub}
        </div>
      )}
    </div>
  );
}

export default function StatsStrip({ data }) {
  if (!data) return null;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
      <StatCard
        icon="📊" label="AVERAGE AQI"
        value={data.avg_aqi} color={aqiColor(data.avg_aqi)}
      />
      <StatCard
        icon="🔺" label="PEAK AQI"
        value={data.peak_aqi} color={aqiColor(data.peak_aqi)}
        sub={`at ${data.peak_time}`}
      />
      <StatCard
        icon="✅" label="SAFE HOURS"
        value={data.good_hours} unit="h" color="#22c55e"
      />
      <StatCard
        icon="⚠️" label="RISKY HOURS"
        value={data.bad_hours} unit="h" color="#f97316"
      />
    </div>
  );
}
