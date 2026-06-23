// ─────────────────────────────────────────────────────────────
// AdvisoryCard.js — Health advice, mask & outdoor guidance
// Props: data (full ForecastResponse from backend)
// ─────────────────────────────────────────────────────────────
import React from 'react';

export default function AdvisoryCard({ data }) {
  if (!data) return null;

  return (
    <div style={{
      background: '#060f1e',
      border: '1px solid #1e2d47',
      borderRadius: 20,
      padding: '24px 28px',
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
    }}>
      {/* Main message */}
      <div>
        <div style={{
          color: '#475569', fontSize: 10,
          fontFamily: "'DM Mono', monospace",
          letterSpacing: 1.5, marginBottom: 8,
        }}>
          HEALTH ADVISORY
        </div>
        <div style={{
          fontSize: 15, fontWeight: 600,
          color: '#e2e8f0',
          fontFamily: "'Syne', sans-serif",
          lineHeight: 1.5,
        }}>
          {data.emoji} {data.message}
        </div>
      </div>

      {/* Mask + Outdoor badges */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <div style={{
          fontSize: 11,
          fontFamily: "'DM Mono', monospace",
          color: '#94a3b8',
          background: '#0d1526',
          padding: '6px 12px',
          borderRadius: 8,
          border: '1px solid #1e2d47',
        }}>
          😷 {data.mask}
        </div>
        <div style={{
          fontSize: 11,
          fontFamily: "'DM Mono', monospace",
          color: '#94a3b8',
          background: '#0d1526',
          padding: '6px 12px',
          borderRadius: 8,
          border: '1px solid #1e2d47',
        }}>
          🏃 {data.outdoor}
        </div>
      </div>

      {/* Advice bullets */}
      <div style={{
        display: 'flex', flexDirection: 'column', gap: 8,
        paddingTop: 4,
      }}>
        {data.advice.map((tip, i) => (
          <div key={i} style={{
            display: 'flex', gap: 10, alignItems: 'flex-start',
          }}>
            <span style={{
              color: data.current_color,
              fontSize: 12, marginTop: 2, flexShrink: 0,
            }}>
              ▸
            </span>
            <span style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.5 }}>
              {tip}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
