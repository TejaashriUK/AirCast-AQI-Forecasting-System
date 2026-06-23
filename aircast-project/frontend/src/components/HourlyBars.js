import React from 'react';

function aqiColor(v) {
  if (v<=50) return '#22c55e'; if (v<=100) return '#84cc16';
  if (v<=200) return '#eab308'; if (v<=300) return '#f97316';
  if (v<=400) return '#ef4444'; return '#9f1239';
}

function Bar({ point, maxAqi, isNow }) {
  const h = Math.max(10,(point.aqi/maxAqi)*90);
  const c = aqiColor(point.aqi);
  return (
    <div style={{ display:'flex',flexDirection:'column',alignItems:'center',gap:4,minWidth:40,opacity:isNow?1:0.72 }}>
      <div style={{ fontFamily:"'DM Mono',monospace",fontSize:9,color:c,fontWeight:700 }}>{Math.round(point.aqi)}</div>
      <div style={{ width:28,height:h,borderRadius:'4px 4px 2px 2px',background:c,
        boxShadow:isNow?`0 0 14px ${c}`:`0 0 4px ${c}50`,transition:'height 0.6s ease',position:'relative' }}>
        {isNow&&<div style={{ position:'absolute',top:-8,left:'50%',transform:'translateX(-50%)',
          width:6,height:6,borderRadius:'50%',background:'#fff',boxShadow:'0 0 8px #fff' }} />}
      </div>
      <div style={{ fontFamily:"'DM Sans',sans-serif",fontSize:9,color:isNow?'#e2e8f0':'#475569',
        textAlign:'center',whiteSpace:'nowrap' }}>{point.hour_label}</div>
    </div>
  );
}

export default function HourlyBars({ data }) {
  if (!data?.length) return null;
  const maxAqi = Math.max(...data.map(p=>p.aqi),100);
  return (
    <div style={{ background:'#060f1e',border:'1px solid #1e2d47',borderRadius:20,padding:'24px 24px 20px' }}>
      <div style={{ fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:15,color:'#e2e8f0',marginBottom:20 }}>Hour-by-Hour Breakdown</div>
      <div style={{ display:'flex',gap:5,overflowX:'auto',paddingBottom:8,alignItems:'flex-end',minHeight:130 }}>
        {data.map((p,i)=><Bar key={i} point={p} maxAqi={maxAqi} isNow={i===0} />)}
      </div>
      <div style={{ display:'flex',gap:10,marginTop:16,flexWrap:'wrap',paddingTop:14,borderTop:'1px solid #1e2d47' }}>
        {[['Good','#22c55e','0–50'],['Satisfactory','#84cc16','51–100'],['Moderate','#eab308','101–200'],
          ['Poor','#f97316','201–300'],['Very Poor','#ef4444','301–400'],['Severe','#9f1239','401–500']
        ].map(([l,c,r])=>(
          <div key={l} style={{ display:'flex',alignItems:'center',gap:5,fontSize:10,color:'#475569',fontFamily:"'DM Mono',monospace" }}>
            <div style={{ width:10,height:10,borderRadius:3,background:c }} />{l} ({r})
          </div>
        ))}
      </div>
    </div>
  );
}
