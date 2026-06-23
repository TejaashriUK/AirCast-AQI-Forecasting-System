import React from 'react';
import { AreaChart,Area,XAxis,YAxis,CartesianGrid,Tooltip,ResponsiveContainer,ReferenceLine } from 'recharts';

function aqiColor(v) {
  if (v<=50) return '#22c55e'; if (v<=100) return '#84cc16';
  if (v<=200) return '#eab308'; if (v<=300) return '#f97316';
  if (v<=400) return '#ef4444'; return '#9f1239';
}

function CustomTooltip({ active, payload }) {
  if (!active||!payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div style={{ background:'#0d1526',border:`1px solid ${aqiColor(d.aqi)}55`,
      borderRadius:12,padding:'10px 16px',fontFamily:"'DM Mono',monospace" }}>
      <div style={{ color:'#94a3b8',fontSize:11,marginBottom:4 }}>{d.hour_label}</div>
      <div style={{ color:aqiColor(d.aqi),fontSize:22,fontWeight:700 }}>{d.aqi}</div>
      <div style={{ color:'#64748b',fontSize:11,marginTop:2 }}>{d.emoji} {d.level}</div>
    </div>
  );
}

export default function ForecastChart({ data, avgAqi, hours, generatedAt }) {
  if (!data?.length) return null;
  const maxVal = Math.max(...data.map(p=>p.aqi),150);
  const col    = aqiColor(avgAqi);
  const skip   = hours>12 ? Math.floor(hours/6)-1 : 1;
  return (
    <div style={{ background:'#060f1e',border:'1px solid #1e2d47',borderRadius:20,padding:'24px 24px 16px' }}>
      <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:20,flexWrap:'wrap',gap:12 }}>
        <div>
          <div style={{ fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:15,color:'#e2e8f0' }}>{hours}-Hour AQI Forecast</div>
          <div style={{ color:'#475569',fontSize:11,fontFamily:"'DM Mono',monospace",marginTop:3 }}>Generated {new Date(generatedAt).toLocaleTimeString()}</div>
        </div>
        <div style={{ display:'flex',gap:14,flexWrap:'wrap' }}>
          {[['Good ≤50','#22c55e'],['Moderate ≤200','#eab308'],['Poor ≤400','#ef4444']].map(([l,c])=>(
            <div key={l} style={{ display:'flex',alignItems:'center',gap:5,fontSize:10,color:'#475569',fontFamily:"'DM Mono',monospace" }}>
              <div style={{ width:8,height:8,borderRadius:2,background:c }} />{l}
            </div>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={230}>
        <AreaChart data={data} margin={{ top:10,right:10,left:-20,bottom:0 }}>
          <defs>
            <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor={col} stopOpacity={0.35} />
              <stop offset="95%" stopColor={col} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e2d47" />
          <XAxis dataKey="hour_label" tick={{ fill:'#475569',fontSize:10,fontFamily:"'DM Mono',monospace" }} interval={skip} />
          <YAxis tick={{ fill:'#475569',fontSize:10 }} domain={[0,maxVal+30]} />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={50}  stroke="#22c55e" strokeDasharray="4 3" strokeOpacity={0.35} />
          <ReferenceLine y={100} stroke="#84cc16" strokeDasharray="4 3" strokeOpacity={0.35} />
          <ReferenceLine y={200} stroke="#eab308" strokeDasharray="4 3" strokeOpacity={0.35} />
          <ReferenceLine y={300} stroke="#f97316" strokeDasharray="4 3" strokeOpacity={0.35} />
          <Area type="monotone" dataKey="aqi" stroke={col} strokeWidth={2.5} fill="url(#grad)"
            dot={false} activeDot={{ r:5,fill:col,stroke:'#030912',strokeWidth:2 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
