import React from 'react';

export default function AqiGauge({ aqi, level, color, emoji, size = 200 }) {
  const pct  = Math.min(aqi / 500, 1);
  const r    = (size / 2) * 0.72;
  const cx   = size / 2;
  const cy   = size / 2;
  const circ = 2 * Math.PI * r;
  const arc  = circ * 0.75;
  const dash = arc * pct;

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(135deg)' }}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1e2d47"
          strokeWidth={size * 0.048} strokeDasharray={`${arc} ${circ}`} strokeLinecap="round" />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={color}
          strokeWidth={size * 0.048} strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{ filter:`drop-shadow(0 0 ${size*0.04}px ${color})`,
            transition:'stroke-dasharray 1.4s cubic-bezier(0.4,0,0.2,1)' }} />
      </svg>
      <div style={{ position:'absolute',inset:0,display:'flex',flexDirection:'column',
        alignItems:'center',justifyContent:'center',pointerEvents:'none' }}>
        <div style={{ fontSize:size*0.09,marginBottom:2 }}>{emoji}</div>
        <div style={{ fontSize:size*0.23,fontWeight:800,color,fontFamily:"'Syne',sans-serif",
          lineHeight:1,textShadow:`0 0 30px ${color}90` }}>{Math.round(aqi)}</div>
        <div style={{ fontSize:size*0.075,color:'#64748b',fontFamily:"'DM Mono',monospace",
          marginTop:6,letterSpacing:0.5 }}>{level}</div>
      </div>
    </div>
  );
}
