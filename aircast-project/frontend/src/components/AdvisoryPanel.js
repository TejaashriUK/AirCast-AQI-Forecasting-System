import React from 'react';

export default function AdvisoryPanel({ data }) {
  if (!data) return null;
  const { safe, current_color, emoji, message, advice, mask, outdoor } = data;
  return (
    <div style={{ background:'#060f1e',border:'1px solid #1e2d47',borderRadius:20,
      padding:'24px 28px',display:'flex',flexDirection:'column',gap:16 }}>
      <div>
        <div style={{ display:'flex',alignItems:'center',gap:10,marginBottom:10 }}>
          <div style={{ display:'inline-flex',alignItems:'center',gap:6,padding:'5px 14px',
            borderRadius:999,background:safe?'#052e16':'#450a0a',
            border:`1px solid ${safe?'#166534':'#991b1b'}`,color:safe?'#22c55e':'#ef4444',
            fontFamily:"'DM Mono',monospace",fontSize:12,fontWeight:700 }}>
            <span style={{ width:6,height:6,borderRadius:'50%',display:'inline-block',
              background:safe?'#22c55e':'#ef4444',boxShadow:`0 0 6px ${safe?'#22c55e':'#ef4444'}` }} />
            {safe ? '✓  AIR IS SAFE' : '✗  AIR IS UNSAFE'}
          </div>
        </div>
        <div style={{ fontSize:15,fontWeight:600,color:'#e2e8f0',fontFamily:"'Syne',sans-serif",lineHeight:1.5 }}>
          {emoji} {message}
        </div>
      </div>
      <div style={{ display:'flex',flexDirection:'column',gap:7 }}>
        {advice.map((a,i) => (
          <div key={i} style={{ display:'flex',gap:10,alignItems:'flex-start' }}>
            <span style={{ color:current_color,fontSize:12,marginTop:2,flexShrink:0 }}>▸</span>
            <span style={{ color:'#94a3b8',fontSize:13,lineHeight:1.5 }}>{a}</span>
          </div>
        ))}
      </div>
      <div style={{ display:'flex',gap:8,flexWrap:'wrap',paddingTop:12,borderTop:'1px solid #1e2d47' }}>
        <div style={{ fontSize:11,fontFamily:"'DM Mono',monospace",color:'#94a3b8',background:'#0d1526',
          padding:'5px 12px',borderRadius:8,border:'1px solid #1e2d47' }}>😷 Mask — {mask}</div>
        <div style={{ fontSize:11,fontFamily:"'DM Mono',monospace",color:'#94a3b8',background:'#0d1526',
          padding:'5px 12px',borderRadius:8,border:'1px solid #1e2d47' }}>🏃 Outdoor — {outdoor}</div>
      </div>
    </div>
  );
}
