import { useState, useEffect, useCallback } from "react";

/* ─── DESIGN TOKENS ─── */
const T = {
  or: "#F4580A", orl: "#FF7A35", orp: "#FFF3ED", orb: "rgba(244,88,10,0.1)",
  gr: "#16A34A", grp: "#F0FDF4", grb: "rgba(22,163,74,0.1)",
  ye: "#D97706", yep: "#FFFBEB",
  re: "#DC2626", rep: "#FFF5F5",
  bl: "#2563EB", blp: "#EFF6FF",
  ink: "#0F1117", ink2: "#1F2937", ink3: "#374151",
  mu: "#6B7280", mu2: "#9CA3AF",
  line: "#E5E7EB", line2: "#F3F4F6",
  surf: "#F9FAFB", white: "#FFFFFF", bg: "#F1F3F5",
};

/* ─── GLOBAL STYLES ─── */
const G = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Satoshi:wght@400;500;700;900&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Satoshi',system-ui,sans-serif;background:${T.bg};color:${T.ink};overflow-x:hidden}
  ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:${T.or};border-radius:2px}
  input,select,textarea{font-family:'Satoshi',system-ui,sans-serif}
  @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
  @keyframes livePulse{0%,100%{opacity:1;box-shadow:0 0 0 0 rgba(22,163,74,0.45)}70%{opacity:.8;box-shadow:0 0 0 7px rgba(22,163,74,0)}}
  @keyframes alertPulse{0%,100%{opacity:1}50%{opacity:.35}}
  @keyframes cardGlow{0%,100%{box-shadow:0 0 0 0 rgba(244,88,10,0)}50%{box-shadow:0 0 0 6px rgba(244,88,10,0.15)}}
  @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes popIn{from{transform:scale(.78);opacity:0}to{transform:scale(1);opacity:1}}
  .fadeUp{animation:fadeUp .35s ease both}
  .fadeUp1{animation:fadeUp .35s .05s ease both}
  .fadeUp2{animation:fadeUp .35s .1s ease both}
  .fadeUp3{animation:fadeUp .35s .15s ease both}
  .fadeUp4{animation:fadeUp .35s .2s ease both}
`;

/* ─── HELPERS ─── */
const css = (obj) => Object.entries(obj).reduce((a,[k,v])=>{
  const key = k.replace(/([A-Z])/g,m=>'-'+m.toLowerCase());
  return a+key+':'+v+';';
},'');

const Badge = ({children,color='orange',style={}})=>{
  const colors={
    orange:{bg:T.orp,color:T.or,border:'rgba(244,88,10,0.18)'},
    green:{bg:T.grp,color:T.gr,border:'rgba(22,163,74,0.18)'},
    yellow:{bg:T.yep,color:T.ye,border:'rgba(217,119,6,0.18)'},
    red:{bg:T.rep,color:T.re,border:'rgba(220,38,38,0.18)'},
    blue:{bg:T.blp,color:T.bl,border:'rgba(37,99,235,0.18)'},
    dark:{bg:T.ink,color:'#fff',border:T.ink},
  };
  const c=colors[color]||colors.orange;
  return <span style={{display:'inline-flex',alignItems:'center',gap:4,padding:'3px 10px',borderRadius:20,fontSize:11,fontWeight:700,background:c.bg,color:c.color,border:`1px solid ${c.border}`,...style}}>{children}</span>;
};

const Btn = ({children,variant='primary',onClick,style={},disabled=false})=>{
  const base={display:'inline-flex',alignItems:'center',justifyContent:'center',gap:8,padding:'10px 20px',borderRadius:10,fontFamily:"'Satoshi',sans-serif",fontSize:14,fontWeight:700,cursor:disabled?'not-allowed':'pointer',border:'none',transition:'all .18s',opacity:disabled?.6:1,...style};
  const v={
    primary:{...base,background:T.or,color:'#fff',boxShadow:`0 4px 14px rgba(244,88,10,.28)`},
    secondary:{...base,background:T.ink,color:'#fff'},
    ghost:{...base,background:'transparent',color:T.ink,border:`1.5px solid ${T.line}`},
    danger:{...base,background:T.re,color:'#fff'},
  };
  return <button style={v[variant]||v.primary} onClick={onClick} disabled={disabled}>{children}</button>;
};

const Card = ({children,style={}})=>(
  <div style={{background:T.white,border:`1px solid ${T.line}`,borderRadius:16,padding:24,...style}}>{children}</div>
);

const Label = ({children})=>(
  <div style={{fontSize:11,fontWeight:700,letterSpacing:'1.5px',textTransform:'uppercase',color:T.mu,marginBottom:10}}>{children}</div>
);

const Input = ({label,id,placeholder,type='text',value,onChange,maxLength})=>(
  <div style={{marginBottom:16}}>
    {label&&<label style={{display:'block',fontSize:12,fontWeight:700,letterSpacing:'.5px',textTransform:'uppercase',color:T.mu,marginBottom:6}}>{label}</label>}
    <input id={id} type={type} placeholder={placeholder} value={value} onChange={onChange} maxLength={maxLength}
      style={{width:'100%',padding:'11px 14px',background:T.white,border:`1.5px solid ${T.line}`,borderRadius:10,fontSize:14,color:T.ink,outline:'none',transition:'border-color .15s'}}
      onFocus={e=>e.target.style.borderColor=T.or}
      onBlur={e=>e.target.style.borderColor=T.line}/>
  </div>
);

const Select = ({label,value,onChange,options})=>(
  <div style={{marginBottom:16}}>
    {label&&<label style={{display:'block',fontSize:12,fontWeight:700,letterSpacing:'.5px',textTransform:'uppercase',color:T.mu,marginBottom:6}}>{label}</label>}
    <select value={value} onChange={onChange}
      style={{width:'100%',padding:'11px 14px',background:T.white,border:`1.5px solid ${T.line}`,borderRadius:10,fontSize:14,color:T.ink,outline:'none',appearance:'none'}}>
      {options.map(o=><option key={o.v||o} value={o.v||o}>{o.l||o}</option>)}
    </select>
  </div>
);

const ProgressBar = ({value,color=T.or,height=6})=>(
  <div style={{height,background:T.line2,borderRadius:3,overflow:'hidden'}}>
    <div style={{height:'100%',width:`${value}%`,background:color,borderRadius:3,transition:'width .6s ease'}}/>
  </div>
);

const StatCard = ({label,value,sub,accent=false,style={}})=>(
  <div style={{background:accent?T.ink:T.white,border:`1px solid ${accent?T.ink:T.line}`,borderRadius:14,padding:18,...style}}>
    <div style={{fontSize:11,fontWeight:700,letterSpacing:'1px',textTransform:'uppercase',color:accent?'rgba(255,255,255,.4)':T.mu,marginBottom:6}}>{label}</div>
    <div style={{fontFamily:"'Instrument Serif',serif",fontSize:28,color:accent?'#FF9A5C':T.or,lineHeight:1}}>{value}</div>
    {sub&&<div style={{fontSize:12,color:accent?'rgba(255,255,255,.35)':T.mu,marginTop:4}}>{sub}</div>}
  </div>
);

/* ════════════════════════════════════════
   PAGE 1 — REGISTRATION
════════════════════════════════════════ */
const Registration = ({onComplete})=>{
  const [step,setStep]=useState(1);
  const [form,setForm]=useState({name:'',phone:'',platform:'Swiggy',pid:'',aadhaar:'',city:'Bengaluru',zone:'',earn:'',hrs:'',upi:''});
  const [otp,setOtp]=useState(['','','','','','']);
  const [plan,setPlan]=useState('plus');
  const [policy,setPolicy]=useState(null);
  const [animKey,setAnimKey]=useState(0);

  const plans={
    basic:{name:'Kavach Basic',price:29,cover:300,desc:'₹300/disruption day · Low-risk zones'},
    plus:{name:'Kavach Plus',price:49,cover:500,desc:'₹500/disruption day · AI-adjusted'},
    pro:{name:'Kavach Pro',price:79,cover:800,desc:'₹800/disruption day · Max protection'},
  };

  const goStep=(n)=>{setAnimKey(k=>k+1);setStep(n);};

  const handleOtp=(i,v)=>{
    const n=[...otp];n[i]=v.slice(-1);setOtp(n);
    if(v&&i<5)document.getElementById('otp'+(i+1))?.focus();
  };
  const otpBack=(e,i)=>{if(e.key==='Backspace'&&!otp[i]&&i>0)document.getElementById('otp'+(i-1))?.focus();};

  const activate=()=>{
    const p=plans[plan];
    const pol={id:'GS-BLR-2026-'+Math.floor(10000+Math.random()*89999),plan:p.name,price:p.price,cover:p.cover,upi:form.upi||'ravi@okicici',zone:form.zone||'HSR Layout, Bengaluru'};
    setPolicy(pol);
    goStep(6);
    onComplete&&onComplete(pol);
  };

  const stepLabels=['Identity','Verify OTP','Profile','AI Risk','Choose Plan','Done'];
  const riskFactors=[
    {label:'Zone flood history',val:7.2,color:T.or,pct:72},
    {label:'Seasonal multiplier',val:'1.15×',color:T.ye,pct:65},
    {label:'Platform outage rate',val:4.0,color:T.bl,pct:40},
    {label:'Civic disruption freq.',val:5.5,color:T.gr,pct:55},
  ];

  return (
    <div style={{maxWidth:560,margin:'0 auto',padding:'32px 24px'}}>
      {/* Step progress */}
      <div style={{display:'flex',gap:0,marginBottom:32,position:'relative'}}>
        <div style={{position:'absolute',top:15,left:15,right:15,height:2,background:T.line,zIndex:0}}/>
        {stepLabels.map((l,i)=>{
          const n=i+1;
          const done=n<step,active=n===step;
          return (
            <div key={n} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:6,flex:1,position:'relative',zIndex:1}}>
              <div style={{width:30,height:30,borderRadius:'50%',border:`2px solid ${done?T.or:active?T.ink:T.line}`,background:done?T.or:active?T.ink:T.white,display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700,color:done||active?'#fff':T.mu,transition:'all .3s'}}>
                {done?'✓':n}
              </div>
              <div style={{fontSize:10,color:active?T.ink:T.mu,fontWeight:active?700:500,textAlign:'center',whiteSpace:'nowrap'}}>{l}</div>
            </div>
          );
        })}
      </div>

      <div key={animKey} className="fadeUp">
      {step===1&&(
        <>
          <div style={{fontFamily:"'Instrument Serif',serif",fontSize:28,marginBottom:6}}>Welcome to GigShield 🛵</div>
          <div style={{fontSize:14,color:T.mu,marginBottom:24,lineHeight:1.6}}>Income protection in under 3 minutes. We verify your delivery partner ID instantly.</div>
          <Input label="Full Name" placeholder="e.g. Ravi Kumar" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
            <Input label="Mobile Number" type="tel" placeholder="10-digit mobile" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/>
            <Select label="Platform" value={form.platform} onChange={e=>setForm({...form,platform:e.target.value})} options={['Swiggy','Zomato','Amazon','Zepto','Blinkit']}/>
          </div>
          <Input label="Partner ID" placeholder="e.g. SWG-BLR-48291" value={form.pid} onChange={e=>setForm({...form,pid:e.target.value})}/>
          <Input label="Aadhaar (last 4 digits)" placeholder="XXXX" maxLength={4} value={form.aadhaar} onChange={e=>setForm({...form,aadhaar:e.target.value})}/>
          <Btn style={{width:'100%',marginTop:4}} onClick={()=>goStep(2)}>Send OTP →</Btn>
        </>
      )}
      {step===2&&(
        <>
          <div style={{fontFamily:"'Instrument Serif',serif",fontSize:28,marginBottom:6}}>Verify your mobile 📱</div>
          <div style={{fontSize:14,color:T.mu,marginBottom:20,lineHeight:1.6}}>We sent a 6-digit OTP to <strong>+91 {form.phone||'98765 43210'}</strong>. Enter it below.</div>
          <div style={{display:'flex',gap:10,marginBottom:12}}>
            {otp.map((v,i)=>(
              <input key={i} id={'otp'+i} maxLength={1} value={v}
                onChange={e=>handleOtp(i,e.target.value)}
                onKeyDown={e=>otpBack(e,i)}
                style={{width:52,height:52,textAlign:'center',fontSize:22,fontWeight:700,border:`1.5px solid ${T.line}`,borderRadius:10,outline:'none',color:T.ink,fontFamily:"'Satoshi',sans-serif"}}
                onFocus={e=>e.target.style.borderColor=T.or}
                onBlur={e=>e.target.style.borderColor=T.line}/>
            ))}
          </div>
          <div style={{fontSize:13,color:T.mu,marginBottom:16}}>Demo: enter any 6 digits · <span style={{color:T.or,cursor:'pointer',fontWeight:600}}>Resend OTP</span></div>
          <Btn style={{width:'100%'}} onClick={()=>goStep(3)}>Verify & Continue →</Btn>
          <Btn variant="ghost" style={{width:'100%',marginTop:8}} onClick={()=>goStep(1)}>← Back</Btn>
        </>
      )}
      {step===3&&(
        <>
          <div style={{fontFamily:"'Instrument Serif',serif",fontSize:28,marginBottom:6}}>Your delivery profile</div>
          <div style={{fontSize:14,color:T.mu,marginBottom:24,lineHeight:1.6}}>Used to calculate your hyper-local risk score and personalised premium.</div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
            <Select label="City" value={form.city} onChange={e=>setForm({...form,city:e.target.value})} options={['Bengaluru','Mumbai','Delhi NCR','Hyderabad','Chennai','Pune']}/>
            <Input label="Operating Zone" placeholder="e.g. HSR Layout" value={form.zone} onChange={e=>setForm({...form,zone:e.target.value})}/>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
            <Input label="Avg Daily Earnings (₹)" type="number" placeholder="750" value={form.earn} onChange={e=>setForm({...form,earn:e.target.value})}/>
            <Input label="Active Hours/Day" type="number" placeholder="8" value={form.hrs} onChange={e=>setForm({...form,hrs:e.target.value})}/>
          </div>
          <Input label="UPI ID for Payouts" placeholder="e.g. ravi@okicici" value={form.upi} onChange={e=>setForm({...form,upi:e.target.value})}/>
          <Btn style={{width:'100%'}} onClick={()=>goStep(4)}>Calculate My Risk →</Btn>
          <Btn variant="ghost" style={{width:'100%',marginTop:8}} onClick={()=>goStep(2)}>← Back</Btn>
        </>
      )}
      {step===4&&(
        <>
          <div style={{fontFamily:"'Instrument Serif',serif",fontSize:28,marginBottom:6}}>AI Risk Assessment 🤖</div>
          <div style={{fontSize:14,color:T.mu,marginBottom:20,lineHeight:1.6}}>XGBoost model scored your zone using 14 hyper-local features.</div>
          <div style={{background:T.surf,border:`1px solid ${T.line}`,borderRadius:14,padding:20,marginBottom:16}}>
            <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:14}}>
              <div>
                <div style={{fontSize:12,color:T.mu,fontWeight:700,letterSpacing:'1px',textTransform:'uppercase',marginBottom:4}}>Risk Score</div>
                <div style={{fontFamily:"'Instrument Serif',serif",fontSize:52,color:T.or,lineHeight:1}}>6.8</div>
              </div>
              <div style={{textAlign:'right'}}>
                <div style={{fontSize:13,fontWeight:700,color:T.ye,marginBottom:4}}>⚡ Medium Risk</div>
                <div style={{fontSize:11,color:T.mu}}>Monsoon season active</div>
                <Badge color="orange" style={{marginTop:8}}>HSR Layout · BLR</Badge>
              </div>
            </div>
            <ProgressBar value={68} color={`linear-gradient(90deg,${T.gr},${T.ye})`}/>
            <div style={{display:'flex',flexDirection:'column',gap:10,marginTop:16}}>
              {riskFactors.map(f=>(
                <div key={f.label} style={{display:'flex',alignItems:'center',gap:10,fontSize:13}}>
                  <span style={{flex:1,color:T.mu}}>{f.label}</span>
                  <div style={{flex:2,height:5,background:T.line,borderRadius:3,overflow:'hidden'}}>
                    <div style={{height:'100%',width:`${f.pct}%`,background:f.color,borderRadius:3,transition:'width .8s ease'}}/>
                  </div>
                  <span style={{width:40,textAlign:'right',fontWeight:600,fontSize:12,color:f.color}}>{f.val}</span>
                </div>
              ))}
            </div>
          </div>
          <Btn style={{width:'100%'}} onClick={()=>goStep(5)}>Choose My Plan →</Btn>
          <Btn variant="ghost" style={{width:'100%',marginTop:8}} onClick={()=>goStep(3)}>← Back</Btn>
        </>
      )}
      {step===5&&(
        <>
          <div style={{fontFamily:"'Instrument Serif',serif",fontSize:28,marginBottom:6}}>Choose your coverage</div>
          <div style={{fontSize:14,color:T.mu,marginBottom:20,lineHeight:1.6}}>AI-adjusted premium highlighted. Auto-renews every Monday with your Swiggy payout.</div>
          <div style={{display:'flex',flexDirection:'column',gap:8,marginBottom:16}}>
            {Object.entries(plans).map(([k,p])=>(
              <div key={k} onClick={()=>setPlan(k)}
                style={{display:'flex',alignItems:'center',gap:14,padding:'14px 16px',border:`1.5px solid ${plan===k?T.or:T.line}`,borderRadius:12,cursor:'pointer',background:plan===k?T.orp:T.white,transition:'all .15s'}}>
                <div style={{width:18,height:18,borderRadius:'50%',border:`2px solid ${plan===k?T.or:T.line}`,background:plan===k?T.or:'transparent',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                  {plan===k&&<div style={{width:8,height:8,borderRadius:'50%',background:'#fff'}}/>}
                </div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700,fontSize:14}}>{p.name}{k==='plus'&&<Badge color="orange" style={{marginLeft:8,fontSize:9}}>Recommended</Badge>}</div>
                  <div style={{fontSize:12,color:T.mu,marginTop:2}}>{p.desc}</div>
                </div>
                <div style={{fontFamily:"'Instrument Serif',serif",fontSize:22,color:T.or}}>₹{p.price}<span style={{fontFamily:"'Satoshi',sans-serif",fontSize:12,color:T.mu}}>/wk</span></div>
              </div>
            ))}
          </div>
          <div style={{background:T.orp,border:`1px solid rgba(244,88,10,.2)`,borderRadius:12,padding:'14px 16px',marginBottom:16}}>
            <div style={{fontSize:11,color:T.or,fontWeight:700,letterSpacing:'1px',textTransform:'uppercase',marginBottom:4}}>AI-Adjusted Weekly Premium</div>
            <div style={{display:'flex',alignItems:'baseline',gap:4}}>
              <span style={{fontFamily:"'Instrument Serif',serif",fontSize:42,color:T.or}}>₹{plans[plan].price}</span>
              <span style={{fontSize:13,color:T.mu}}>/week · auto-deducted from Swiggy payout</span>
            </div>
          </div>
          <Btn style={{width:'100%'}} onClick={activate}>Activate Coverage 🛡️</Btn>
          <Btn variant="ghost" style={{width:'100%',marginTop:8}} onClick={()=>goStep(4)}>← Back</Btn>
        </>
      )}
      {step===6&&policy&&(
        <div style={{textAlign:'center',paddingTop:8}} className="fadeUp">
          <div style={{fontSize:56,marginBottom:14}}>🎉</div>
          <div style={{fontFamily:"'Instrument Serif',serif",fontSize:32,marginBottom:8}}>You're Protected!</div>
          <div style={{fontSize:14,color:T.mu,marginBottom:20,lineHeight:1.6}}>GigShield monitors your zone 24/7. Payouts hit your UPI automatically — no action needed.</div>
          <div style={{background:T.ink,borderRadius:18,padding:24,textAlign:'left',marginBottom:20}}>
            <div style={{fontSize:10,color:'rgba(255,255,255,.4)',letterSpacing:2,textTransform:'uppercase',marginBottom:4}}>Policy Certificate</div>
            <div style={{fontFamily:"'Instrument Serif',serif",fontSize:22,color:'#fff',marginBottom:18}}>{policy.id}</div>
            {[['Plan',policy.plan,'#FF9A5C'],['Weekly Premium','₹'+policy.price+'/week','#fff'],['Coverage / Day','₹'+policy.cover+'/disruption','#fff'],['UPI Payout',policy.upi,'#fff'],['Status','🟢 Active — Coverage starts now','#4ADE80']].map(([k,v,c])=>(
              <div key={k} style={{display:'flex',justifyContent:'space-between',padding:'7px 0',borderBottom:'1px solid rgba(255,255,255,.08)'}}>
                <span style={{fontSize:12,color:'rgba(255,255,255,.45)'}}>{k}</span>
                <span style={{fontSize:13,fontWeight:600,color:c}}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

/* ════════════════════════════════════════
   PAGE 2 — POLICY MANAGEMENT
════════════════════════════════════════ */
const PolicyManagement = ()=>{
  const triggers=[
    {icon:'🌧️',name:'Heavy Rainfall',desc:'Threshold: >50mm/6hrs or Red Alert',reading:'12mm/hr',status:'safe'},
    {icon:'🌡️',name:'Extreme Heat',desc:'Threshold: >43°C sustained 4hrs',reading:'34°C',status:'safe'},
    {icon:'🌫️',name:'Air Quality (AQI)',desc:'Threshold: AQI >350 Hazardous',reading:'AQI 142',status:'warn'},
    {icon:'🚫',name:'Curfew / Bandh',desc:'Govt alert APIs + NLP monitor',reading:'No alerts',status:'safe'},
    {icon:'📵',name:'Platform Outage',desc:'Swiggy/Zomato API health check',reading:'Online',status:'safe'},
  ];
  const statusColors={safe:T.gr,warn:T.ye,alert:T.re};
  const statusBg={safe:T.grp,warn:T.yep,alert:T.rep};
  const statusLabel={safe:'Safe',warn:'Moderate',alert:'Alert'};

  const calendar=[];
  const claimed=[2,6,10,15];
  for(let d=1;d<=31;d++){
    let type=d===23?'today':claimed.includes(d)?'claimed':d<23?'covered':'future';
    calendar.push({d,type});
  }
  const calColors={covered:{bg:T.grp,color:T.gr},claimed:{bg:T.orp,color:T.or},today:{bg:T.ink,color:'#fff'},future:{bg:T.line2,color:T.mu2}};

  const premiumRows=[
    {k:'Base premium (Kavach Plus)',v:'₹49.00',c:T.ink},
    {k:'Zone risk multiplier (HSR Layout)',v:'+₹4.50',c:T.re},
    {k:'Monsoon season factor (1.15×)',v:'+₹7.35',c:T.re},
    {k:'Tenure loyalty (35 days)',v:'−₹3.20',c:T.gr},
    {k:'Clean claim bonus',v:'−₹2.00',c:T.gr},
    {k:'AI-Adjusted Total',v:'₹55.65/week',c:T.or,bold:true},
  ];

  return (
    <div style={{maxWidth:1100,margin:'0 auto',padding:'28px 28px'}}>
      {/* Header card */}
      <div className="fadeUp" style={{background:T.ink,borderRadius:20,padding:28,marginBottom:20,position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:-30,right:-30,width:160,height:160,borderRadius:'50%',background:'rgba(244,88,10,.12)'}}/>
        <div style={{position:'absolute',bottom:-20,right:40,width:80,height:80,borderRadius:'50%',background:'rgba(244,88,10,.07)'}}/>
        <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:22,position:'relative',zIndex:1}}>
          <div>
            <div style={{fontFamily:"'Instrument Serif',serif",fontSize:28,color:'#fff'}}>Ravi Kumar</div>
            <div style={{fontSize:13,color:'rgba(255,255,255,.45)',marginTop:3}}>GS-BLR-2026-48291 · Kavach Plus · HSR Layout</div>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:6,background:'rgba(22,163,74,.18)',color:'#4ADE80',padding:'6px 14px',borderRadius:20,fontSize:12,fontWeight:700}}>
            <div style={{width:8,height:8,borderRadius:'50%',background:'#4ADE80',animation:'livePulse 2s infinite'}}/>
            Active
          </div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',position:'relative',zIndex:1}}>
          {[['Earnings Protected','₹2,350','This month · 4 claims'],['Weekly Premium','₹49','AI-adjusted · Medium risk'],['Coverage / Day','₹500','Full trigger events'],['Policy Since',"Mar '26",'35 days · Loyalty: 35%']].map(([l,v,s],i)=>(
            <div key={l} style={{padding:'0 18px',borderRight:i<3?'1px solid rgba(255,255,255,.1)':undefined}}>
              <div style={{fontSize:10,color:'rgba(255,255,255,.4)',textTransform:'uppercase',letterSpacing:'1px',marginBottom:4}}>{l}</div>
              <div style={{fontFamily:"'Instrument Serif',serif",fontSize:24,color:'#FF9A5C'}}>{v}</div>
              <div style={{fontSize:11,color:'rgba(255,255,255,.32)',marginTop:2}}>{s}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14,marginBottom:20}}>
        <StatCard accent label="Total Payouts" value="₹2,350" sub="4 events this month" className="fadeUp1"/>
        <StatCard label="Premiums Paid" value="₹196" sub="4 weeks × ₹49" className="fadeUp2"/>
        <StatCard label="Net Benefit" value="₹2,154" sub="11× return on premium" style={{}} className="fadeUp3"/>
        <StatCard label="Loyalty Discount" value="35 days" sub="15% discount at 90 days" className="fadeUp4"/>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>
        <div>
          <Card style={{marginBottom:20}} className="fadeUp1">
            <Label>March 2026 Coverage Calendar</Label>
            <div style={{display:'flex',gap:4,marginBottom:10,flexWrap:'wrap'}}>
              {[['Covered',T.grp,T.gr],['Claimed',T.orp,T.or],['Today',T.ink,'#fff'],['Future',T.line2,T.mu2]].map(([l,bg,c])=>(
                <span key={l} style={{background:bg,color:c,padding:'2px 10px',borderRadius:20,fontSize:11,fontWeight:600}}>{l}</span>
              ))}
            </div>
            <div style={{display:'flex',gap:3,flexWrap:'wrap'}}>
              {calendar.map(({d,type})=>{
                const {bg,color}=calColors[type];
                return <div key={d} style={{width:30,height:28,borderRadius:5,background:bg,color,fontSize:10,fontWeight:600,display:'flex',alignItems:'center',justifyContent:'center'}}>{d}</div>;
              })}
            </div>
            <div style={{marginTop:12,fontSize:12,color:T.mu}}>Coverage starts <strong>Mon Mar 4</strong> · Next renewal: <span style={{color:T.or,fontWeight:600}}>Mar 25</span></div>
          </Card>
          <Card className="fadeUp2">
            <Label>This Week's Premium Breakdown</Label>
            <div style={{background:T.surf,border:`1px solid ${T.line}`,borderRadius:12,padding:16}}>
              {premiumRows.map(({k,v,c,bold})=>(
                <div key={k} style={{display:'flex',justifyContent:'space-between',fontSize:13,padding:'6px 0',borderBottom:`1px solid ${T.line}`}}>
                  <span style={{color:bold?T.ink:T.mu,fontWeight:bold?700:400}}>{k}</span>
                  <span style={{fontWeight:bold?700:600,color:c}}>{v}</span>
                </div>
              ))}
            </div>
            <div style={{marginTop:10,fontSize:12,color:T.mu}}>🤖 AI model uses XGBoost with 14 features. Recalculates every Sunday night.</div>
          </Card>
        </div>
        <div>
          <Card style={{marginBottom:20}} className="fadeUp3">
            <Label>Live Parametric Triggers</Label>
            <div style={{display:'flex',flexDirection:'column',gap:10}}>
              {triggers.map(t=>(
                <div key={t.name} style={{display:'flex',alignItems:'center',gap:12,padding:'12px 14px',background:t.status==='warn'?T.yep:T.white,border:`1px solid ${t.status==='warn'?'rgba(217,119,6,.25)':T.line}`,borderRadius:12,transition:'all .18s'}}>
                  <span style={{fontSize:20,width:36,textAlign:'center'}}>{t.icon}</span>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:700,fontSize:13}}>{t.name}</div>
                    <div style={{fontSize:11,color:T.mu,marginTop:2}}>{t.desc}</div>
                  </div>
                  <div style={{textAlign:'right'}}>
                    <div style={{fontSize:12,fontWeight:600,color:statusColors[t.status],marginBottom:4}}>{t.reading}</div>
                    <div style={{width:8,height:8,borderRadius:'50%',background:statusColors[t.status],marginLeft:'auto',animation:t.status==='alert'?'alertPulse 1s infinite':undefined}}/>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          <Card className="fadeUp4">
            <Label>Policy Actions</Label>
            <div style={{display:'flex',flexDirection:'column',gap:8}}>
              <Btn style={{width:'100%'}} onClick={()=>{}}>🤖 Recalculate AI Premium</Btn>
              <Btn variant="secondary" style={{width:'100%'}} onClick={()=>{}}>📋 View Claims History</Btn>
              <Btn variant="ghost" style={{width:'100%'}} onClick={()=>{}}>⬆️ Upgrade to Kavach Pro</Btn>
              <Btn variant="ghost" style={{width:'100%',color:T.re,borderColor:'rgba(220,38,38,.3)'}} onClick={()=>{}}>⏸ Pause Coverage</Btn>
            </div>
            <div style={{marginTop:14,paddingTop:14,borderTop:`1px solid ${T.line}`,fontSize:12,color:T.mu}}>📞 Support: <strong>1800-GIG-SHIELD</strong> · Chat available 24/7</div>
          </Card>
        </div>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════
   PAGE 3 — AI PREMIUM ENGINE
════════════════════════════════════════ */
const AIPremium = ()=>{
  const [inputs,setInputs]=useState({plan:49,zone:6.8,season:1.15,tenure:35,claims:4,activity:1.0});

  const calc=useCallback(()=>{
    const {plan:base,zone,season,tenure,claims,activity}=inputs;
    const zoneAdj=((zone-5)/10)*base*0.15;
    const seasonAdj=(season-1.0)*base;
    const tenureDisc=-(Math.min(tenure,365)/365)*base*0.15;
    const claimsAdj=claims>6?(claims-6)*0.3:0;
    const actAdj=(activity-1.0)*base;
    const total=Math.max(base*.7,Math.min(base*1.5,base+zoneAdj+seasonAdj+tenureDisc+claimsAdj+actAdj));
    return {total:Math.round(total),base,adj:total-base,zoneAdj,seasonAdj,tenureDisc,claimsAdj,actAdj};
  },[inputs]);

  const res=calc();

  const factors=[
    {icon:'🗺️',name:'Zone Flood Risk',val:inputs.zone.toFixed(1),impact:res.zoneAdj},
    {icon:'🌧️',name:'Seasonal Factor',val:inputs.season+'×',impact:res.seasonAdj},
    {icon:'⏳',name:'Tenure Loyalty',val:Math.round(inputs.tenure)+' days',impact:res.tenureDisc},
    {icon:'📊',name:'Claim Frequency',val:Math.round(inputs.claims)+'/mo',impact:res.claimsAdj},
    {icon:'📱',name:'Platform Activity',val:inputs.activity<=1.0?'Active':'Moderate',impact:res.actAdj},
    {icon:'🎯',name:'Model Confidence',val:'92%',impact:0,neutral:true},
  ];

  const shapFeats=[
    {name:'Zone historical flood frequency',w:0.88},
    {name:'Rainfall seasonality index',w:0.76},
    {name:'Worker tenure (loyalty)',w:0.62},
    {name:'Monthly claim rate',w:0.55},
    {name:'Platform activity score',w:0.42},
    {name:'Civic disruption history (3mo)',w:0.38},
    {name:'AQI trend (7-day avg)',w:0.30},
  ];

  const Slider = ({label,id,min,max,step=1,value,onChange,display})=>(
    <div style={{display:'flex',flexDirection:'column',gap:4}}>
      <div style={{fontSize:11,color:'rgba(255,255,255,.45)',fontWeight:700,letterSpacing:'1px',textTransform:'uppercase'}}>{label}</div>
      <div style={{fontSize:14,fontWeight:600,color:'#fff'}}>{display||value}</div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={onChange}
        style={{WebkitAppearance:'none',width:'100%',height:4,borderRadius:2,background:'rgba(255,255,255,.15)',outline:'none',cursor:'pointer'}}/>
    </div>
  );

  return (
    <div style={{maxWidth:1100,margin:'0 auto',padding:'28px 28px'}}>
      <div className="fadeUp" style={{marginBottom:20}}>
        <div style={{fontSize:11,fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',color:T.or,marginBottom:6}}>AI Engine · XGBoost v2.1</div>
        <div style={{fontFamily:"'Instrument Serif',serif",fontSize:32,color:T.ink}}>Dynamic Premium Calculator</div>
        <div style={{fontSize:14,color:T.mu,marginTop:4}}>Drag sliders — watch the ML model recalculate your weekly premium in real-time.</div>
      </div>

      <div className="fadeUp1" style={{background:T.ink,borderRadius:20,padding:28,marginBottom:20}}>
        <div style={{fontFamily:"'Instrument Serif',serif",fontSize:22,color:'#fff',marginBottom:6}}>🤖 Live Premium Modeller</div>
        <div style={{fontSize:13,color:'rgba(255,255,255,.45)',marginBottom:22,lineHeight:1.6}}>Adjust the inputs to simulate different worker profiles. XGBoost uses 14 hyper-local risk features.</div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:20,marginBottom:20}}>
          <div style={{display:'flex',flexDirection:'column',gap:6}}>
            <div style={{fontSize:11,color:'rgba(255,255,255,.45)',fontWeight:700,letterSpacing:'1px',textTransform:'uppercase'}}>Base Plan</div>
            <select value={inputs.plan} onChange={e=>setInputs({...inputs,plan:parseFloat(e.target.value)})}
              style={{background:'rgba(255,255,255,.08)',border:'1px solid rgba(255,255,255,.15)',borderRadius:8,padding:'8px 12px',color:'#fff',fontFamily:"'Satoshi',sans-serif",fontSize:13,outline:'none'}}>
              <option value={29}>Kavach Basic (₹29)</option>
              <option value={49}>Kavach Plus (₹49)</option>
              <option value={79}>Kavach Pro (₹79)</option>
            </select>
          </div>
          <Slider label="Zone Risk Score" min={1} max={10} step={0.1} value={inputs.zone} display={inputs.zone.toFixed(1)+' / 10'} onChange={e=>setInputs({...inputs,zone:parseFloat(e.target.value)})}/>
          <div style={{display:'flex',flexDirection:'column',gap:6}}>
            <div style={{fontSize:11,color:'rgba(255,255,255,.45)',fontWeight:700,letterSpacing:'1px',textTransform:'uppercase'}}>Season</div>
            <select value={inputs.season} onChange={e=>setInputs({...inputs,season:parseFloat(e.target.value)})}
              style={{background:'rgba(255,255,255,.08)',border:'1px solid rgba(255,255,255,.15)',borderRadius:8,padding:'8px 12px',color:'#fff',fontFamily:"'Satoshi',sans-serif",fontSize:13,outline:'none'}}>
              <option value={1.0}>Normal (1.0×)</option>
              <option value={1.15}>Monsoon (1.15×)</option>
              <option value={1.25}>Peak Monsoon (1.25×)</option>
              <option value={0.9}>Winter (0.9×)</option>
              <option value={1.1}>Summer Heat (1.1×)</option>
            </select>
          </div>
          <Slider label="Tenure (Days)" min={0} max={365} value={inputs.tenure} display={Math.round(inputs.tenure)+' days'} onChange={e=>setInputs({...inputs,tenure:parseFloat(e.target.value)})}/>
          <Slider label="Claim Frequency" min={0} max={15} value={inputs.claims} display={Math.round(inputs.claims)+' / month'} onChange={e=>setInputs({...inputs,claims:parseFloat(e.target.value)})}/>
          <div style={{display:'flex',flexDirection:'column',gap:6}}>
            <div style={{fontSize:11,color:'rgba(255,255,255,.45)',fontWeight:700,letterSpacing:'1px',textTransform:'uppercase'}}>Platform Activity</div>
            <select value={inputs.activity} onChange={e=>setInputs({...inputs,activity:parseFloat(e.target.value)})}
              style={{background:'rgba(255,255,255,.08)',border:'1px solid rgba(255,255,255,.15)',borderRadius:8,padding:'8px 12px',color:'#fff',fontFamily:"'Satoshi',sans-serif",fontSize:13,outline:'none'}}>
              <option value={1.0}>Active (1.0×)</option>
              <option value={0.95}>Very Active (0.95×)</option>
              <option value={1.05}>Moderate (1.05×)</option>
              <option value={1.1}>Low Activity (1.1×)</option>
            </select>
          </div>
        </div>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',background:'rgba(244,88,10,.15)',border:'1px solid rgba(244,88,10,.3)',borderRadius:14,padding:'18px 22px'}}>
          <div>
            <div style={{fontSize:12,color:'rgba(255,255,255,.45)',textTransform:'uppercase',letterSpacing:'1px',marginBottom:4}}>AI-Adjusted Weekly Premium</div>
            <div style={{fontFamily:"'Instrument Serif',serif",fontSize:52,color:'#FF9A5C',lineHeight:1,transition:'all .3s'}}>₹{res.total}</div>
          </div>
          <div style={{textAlign:'right'}}>
            <div style={{fontSize:13,color:'rgba(255,255,255,.4)',marginBottom:6}}>Base: ₹{res.base}.00</div>
            <div style={{fontSize:14,fontWeight:600,color:res.adj<=0?'#4ADE80':'#FCA5A5'}}>Adjustments: {res.adj>=0?'+':''}₹{res.adj.toFixed(2)}</div>
          </div>
        </div>
      </div>

      <Label>Real-Time Risk Factors</Label>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14,marginBottom:20}} className="fadeUp2">
        {factors.map(f=>(
          <Card key={f.name} style={{padding:16}}>
            <div style={{fontSize:24,marginBottom:8}}>{f.icon}</div>
            <div style={{fontWeight:700,fontSize:13,marginBottom:4}}>{f.name}</div>
            <div style={{fontFamily:"'Instrument Serif',serif",fontSize:22,color:T.or,marginBottom:4}}>{f.val}</div>
            <div style={{fontSize:11,fontWeight:700,color:f.neutral?T.mu:f.impact>0?T.re:T.gr}}>
              {f.neutral?'Neutral (stable)':f.impact>=0?`+₹${f.impact.toFixed(2)} impact`:`−₹${Math.abs(f.impact).toFixed(2)} discount`}
            </div>
          </Card>
        ))}
      </div>

      <div className="fadeUp3" style={{background:T.blp,border:`1px solid rgba(37,99,235,.18)`,borderRadius:14,padding:20}}>
        <div style={{fontWeight:700,fontSize:14,color:T.bl,marginBottom:12,display:'flex',alignItems:'center',gap:6}}>🔍 Model Explainability (SHAP Values)</div>
        {shapFeats.map(f=>(
          <div key={f.name} style={{display:'flex',alignItems:'center',gap:12,padding:'8px 0',borderBottom:`1px solid rgba(37,99,235,.1)`,fontSize:13}}>
            <span style={{flex:1,color:T.ink2}}>{f.name}</span>
            <div style={{flex:2,height:6,background:'rgba(37,99,235,.12)',borderRadius:3,overflow:'hidden'}}>
              <div style={{height:'100%',width:`${f.w*100}%`,background:T.bl,borderRadius:3,transition:'width .6s ease'}}/>
            </div>
            <span style={{width:36,textAlign:'right',fontWeight:700,fontSize:12,color:T.bl}}>{f.w.toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ════════════════════════════════════════
   PAGE 4 — CLAIMS MANAGEMENT
════════════════════════════════════════ */
const Claims = ()=>{
  const [monitor,setMonitor]=useState({
    rain:{icon:'🌧️',name:'Rainfall',reading:'12mm/hr',thresh:'Trigger: 50mm/6hr',status:'safe'},
    heat:{icon:'🌡️',name:'Heat',reading:'34°C',thresh:'Trigger: 43°C/4hr',status:'safe'},
    aqi:{icon:'🌫️',name:'AQI',reading:'142',thresh:'Trigger: 350+',status:'warn'},
    bandh:{icon:'🚫',name:'Bandh',reading:'No alerts',thresh:'Govt alert NLP',status:'safe'},
    platform:{icon:'📱',name:'Platform',reading:'Operational',thresh:'Trigger: 3hr down',status:'safe'},
  });
  const [pipeline,setPipeline]=useState({triggered:[],validating:[],processing:[],paid:[
    {id:1,event:'🌧️ Rain · Mar 15',worker:'GS-BLR-48291',time:'Auto-approved 47min',amt:'₹500'},
    {id:2,event:'🚫 Bandh · Mar 10',worker:'GS-BLR-48291',time:'Auto-approved 1h12m',amt:'₹500'},
    {id:3,event:'📵 Outage · Mar 6',worker:'GS-BLR-48291',time:'Auto-approved 23min',amt:'₹350'},
    {id:4,event:'🌧️ Rain · Mar 2',worker:'GS-BLR-48291',time:'Auto-approved 38min',amt:'₹500'},
  ]});
  const [modal,setModal]=useState(null);
  const [modalStep,setModalStep]=useState(0);

  const triggerCfgs={
    rain:{icon:'🌧️',title:'Heavy Rain Alert!',desc:'68mm in HSR Layout. IMD Red Alert issued. Processing auto-claim for Ravi Kumar.',payout:'₹500',card:'🌧️ Rain Alert · HSR',monKey:'rain',reading:'68mm/hr ⚠️',status:'alert'},
    bandh:{icon:'🚫',title:'Bandh Detected!',desc:'Unplanned city-wide bandh confirmed. All zone access blocked.',payout:'₹500',card:'🚫 Bandh · Bengaluru',monKey:'bandh',reading:'ACTIVE ⚠️',status:'alert'},
    aqi:{icon:'🌫️',title:'AQI Hazard Alert!',desc:'Air Quality Index crossed 380 (Hazardous). 50% payout triggered.',payout:'₹250',card:'🌫️ AQI 380 · HSR',monKey:'aqi',reading:'AQI 380 ⚠️',status:'alert'},
    heat:{icon:'🌡️',title:'Extreme Heat!',desc:'Temperature reached 44.5°C for 5 hours. 50% payout triggered.',payout:'₹250',card:'🌡️ Heat 44.5°C',monKey:'heat',reading:'44.5°C ⚠️',status:'alert'},
    platform:{icon:'📵',title:'Platform Outage!',desc:'Swiggy app has been down for 3.5 hours. 40% payout triggered.',payout:'₹200',card:'📵 Swiggy Down 3.5hr',monKey:'platform',reading:'DOWN ⚠️',status:'alert'},
  };

  const simulate=(type)=>{
    const cfg=triggerCfgs[type];
    setMonitor(m=>({...m,[cfg.monKey]:{...m[cfg.monKey],reading:cfg.reading,status:'alert'}}));
    const newCard={id:Date.now(),event:cfg.card,worker:'GS-BLR-48291 · Ravi K.',time:'Just now',amt:cfg.payout};
    setPipeline(p=>({...p,triggered:[newCard,...p.triggered]}));
    setModal(cfg);
    setModalStep(1);
    setTimeout(()=>{
      setModalStep(2);
      setPipeline(p=>{
        const [c,...rest]=p.triggered;
        return c?{...p,triggered:rest,validating:[c,...p.validating]}:p;
      });
    },1200);
    setTimeout(()=>{
      setModalStep(3);
      setPipeline(p=>{
        const [c,...rest]=p.validating;
        return c?{...p,validating:rest,processing:[c,...p.processing]}:p;
      });
    },2800);
    setTimeout(()=>{
      setModalStep(4);
      setPipeline(p=>{
        const [c,...rest]=p.processing;
        return c?{...p,processing:rest,paid:[{...c,time:'Auto-approved just now'},...p.paid]}:p;
      });
      setTimeout(()=>{
        setMonitor(m=>({...m,[cfg.monKey]:{...m[cfg.monKey],reading:type==='rain'?'12mm/hr':type==='heat'?'34°C':type==='aqi'?'142':type==='bandh'?'No alerts':'Operational',status:type==='aqi'?'warn':'safe'}}));
      },3000);
    },4500);
  };

  const claimsHistory=[
    {event:'🌧️ Heavy Rain · HSR',worker:'GS-BLR-48291',date:'Mar 15',score:0.12,scoreColor:T.gr,status:'Auto-Approved',statusColor:'green',amt:'+₹500',amtColor:T.gr},
    {event:'🚫 Bandh · City',worker:'GS-MUM-33201',date:'Mar 10',score:0.54,scoreColor:T.ye,status:'Review',statusColor:'yellow',amt:'Pending',amtColor:T.ye},
    {event:'📵 Outage · Swiggy',worker:'GS-BLR-48291',date:'Mar 6',score:0.08,scoreColor:T.gr,status:'Auto-Approved',statusColor:'green',amt:'+₹350',amtColor:T.gr},
    {event:'🌫️ AQI · Delhi',worker:'GS-DEL-91102',date:'Mar 4',score:0.80,scoreColor:T.re,status:'Rejected',statusColor:'red',amt:'₹0',amtColor:T.re},
    {event:'🌧️ Rain · Korama.',worker:'GS-BLR-48291',date:'Mar 2',score:0.15,scoreColor:T.gr,status:'Auto-Approved',statusColor:'green',amt:'+₹500',amtColor:T.gr},
  ];

  const statusColor={safe:T.gr,warn:T.ye,alert:T.re};
  const statusBgColor={safe:T.grp,warn:T.yep,alert:T.rep};
  const statusLabel={safe:'Safe',warn:'Moderate',alert:'ALERT'};

  const pipeSteps=[
    {icon:'✅',text:'Disruption threshold confirmed via API',state:'done'},
    {icon:modalStep>=2?'✅':'⏳',text:modalStep>=2?'Fraud check passed — Score: 0.14 (Clean)':'Running fraud detection (Isolation Forest)…',state:modalStep>=2?'done':modalStep===1?'active':'idle'},
    {icon:modalStep>=3?'✅':'○',text:modalStep>=3?`Payout: ${modal?.payout} approved`:'Calculating payout amount',state:modalStep>=3?'done':modalStep===2?'active':'idle'},
    {icon:modalStep>=4?'✅':'○',text:modalStep>=4?`${modal?.payout} credited to ravi@okicici`:'Initiating UPI transfer to ravi@okicici',state:modalStep>=4?'done':modalStep===3?'active':'idle'},
  ];

  const PipeCol = ({title,items,count,countColor=T.ink})=>(
    <div style={{flex:1,background:T.surf,border:`1px solid ${T.line}`,borderRadius:14,overflow:'hidden'}}>
      <div style={{padding:'10px 14px',borderBottom:`1px solid ${T.line}`,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <span style={{fontSize:11,fontWeight:700,textTransform:'uppercase',letterSpacing:'1px',color:T.mu}}>{title}</span>
        <span style={{background:countColor,color:'#fff',width:20,height:20,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:700}}>{count||items.length}</span>
      </div>
      <div style={{padding:8,display:'flex',flexDirection:'column',gap:6,minHeight:100}}>
        {items.map(c=>(
          <div key={c.id} style={{background:T.white,border:`1px solid ${T.line}`,borderRadius:10,padding:12}}>
            <div style={{fontWeight:700,fontSize:12,marginBottom:2}}>{c.event}</div>
            <div style={{fontSize:11,color:T.mu}}>{c.worker}</div>
            <div style={{fontSize:10,color:T.mu2,marginTop:4}}>{c.time}</div>
            <div style={{fontFamily:"'Instrument Serif',serif",fontSize:15,color:T.gr,marginTop:2}}>{c.amt}</div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{maxWidth:1100,margin:'0 auto',padding:'28px 28px'}}>
      <div className="fadeUp" style={{marginBottom:20}}>
        <div style={{fontSize:11,fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',color:T.or,marginBottom:6}}>Parametric Claims Engine</div>
        <div style={{fontFamily:"'Instrument Serif',serif",fontSize:32,color:T.ink}}>Zero-Touch Claims Management</div>
        <div style={{fontSize:14,color:T.mu,marginTop:4}}>Real-time disruption monitoring → auto-triggered claims → instant UPI payouts. No manual filing ever.</div>
      </div>

      {/* Live Monitor */}
      <div className="fadeUp1" style={{background:T.ink,borderRadius:18,padding:24,marginBottom:18}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16}}>
          <div style={{fontFamily:"'Instrument Serif',serif",fontSize:20,color:'#fff'}}>Live Disruption Monitor — HSR Layout, Bengaluru</div>
          <div style={{fontSize:12,color:'rgba(255,255,255,.35)'}}>🔄 Updated 30s ago</div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:10}}>
          {Object.entries(monitor).map(([key,m])=>(
            <div key={key} style={{background:m.status==='alert'?'rgba(244,88,10,.15)':'rgba(255,255,255,.06)',border:`1px solid ${m.status==='alert'?'rgba(244,88,10,.4)':'rgba(255,255,255,.1)'}`,borderRadius:12,padding:14,textAlign:'center',transition:'all .3s',animation:m.status==='alert'?'cardGlow 2s infinite':undefined}}>
              <div style={{fontSize:24,marginBottom:6}}>{m.icon}</div>
              <div style={{fontSize:12,fontWeight:600,color:'#fff',marginBottom:3}}>{m.name}</div>
              <div style={{fontSize:11,color:'rgba(255,255,255,.4)',marginBottom:6}}>{m.reading}</div>
              <div style={{fontSize:10,color:'rgba(255,255,255,.25)',marginBottom:8}}>{m.thresh}</div>
              <div style={{display:'inline-flex',alignItems:'center',gap:3,padding:'3px 10px',borderRadius:20,fontSize:10,fontWeight:700,background:m.status==='safe'?'rgba(22,163,74,.15)':m.status==='warn'?'rgba(217,119,6,.15)':'rgba(220,38,38,.2)',color:m.status==='safe'?'#4ADE80':m.status==='warn'?'#FCD34D':'#FCA5A5'}}>
                {statusLabel[m.status]}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Simulate */}
      <div className="fadeUp2" style={{background:T.orp,border:`1.5px solid rgba(244,88,10,.2)`,borderRadius:14,padding:18,marginBottom:18}}>
        <div style={{fontWeight:700,fontSize:14,color:T.or,marginBottom:10,display:'flex',alignItems:'center',gap:6}}>⚡ Simulate Disruption (Demo)</div>
        <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
          {[['rain','🌧️ Heavy Rainfall'],['bandh','🚫 Sudden Bandh'],['aqi','🌫️ AQI Spike'],['heat','🌡️ Extreme Heat'],['platform','📵 Platform Outage']].map(([k,l])=>(
            <button key={k} onClick={()=>simulate(k)}
              style={{display:'flex',alignItems:'center',gap:6,padding:'8px 16px',background:T.white,border:`1.5px solid rgba(244,88,10,.3)`,borderRadius:10,fontSize:13,fontWeight:600,color:T.or,cursor:'pointer',transition:'all .15s'}}>
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Pipeline */}
      <Label>Live Claim Pipeline</Label>
      <div style={{display:'flex',gap:14,marginBottom:20}} className="fadeUp3">
        <PipeCol title="Triggered" items={pipeline.triggered}/>
        <PipeCol title="Validating" items={pipeline.validating}/>
        <PipeCol title="Processing" items={pipeline.processing}/>
        <PipeCol title="Paid Out" items={pipeline.paid} countColor={T.gr}/>
      </div>

      {/* History table */}
      <Label>Claims History (Admin View)</Label>
      <div className="fadeUp4" style={{background:T.white,border:`1px solid ${T.line}`,borderRadius:14,overflow:'hidden'}}>
        <div style={{display:'grid',gridTemplateColumns:'1.5fr 1.2fr 0.8fr 1fr 1fr 0.8fr',gap:10,padding:'10px 16px',background:T.surf,borderBottom:`1px solid ${T.line}`,fontSize:11,fontWeight:700,letterSpacing:'1px',textTransform:'uppercase',color:T.mu}}>
          {['Event','Worker ID','Date','Fraud Score','Status','Amount'].map(h=><div key={h}>{h}</div>)}
        </div>
        {claimsHistory.map((c,i)=>(
          <div key={i} style={{display:'grid',gridTemplateColumns:'1.5fr 1.2fr 0.8fr 1fr 1fr 0.8fr',gap:10,padding:'12px 16px',borderBottom:`1px solid ${T.line}`,fontSize:13,alignItems:'center',transition:'background .12s'}}>
            <div>{c.event}</div>
            <div style={{fontSize:12}}>{c.worker}</div>
            <div>{c.date}</div>
            <div style={{display:'flex',alignItems:'center',gap:6}}>
              <div style={{width:48,height:4,background:T.line,borderRadius:2,overflow:'hidden'}}>
                <div style={{height:'100%',width:`${c.score*100}%`,background:c.scoreColor,borderRadius:2}}/>
              </div>
              <span style={{fontSize:11,fontWeight:700,color:c.scoreColor}}>{c.score}</span>
            </div>
            <div><Badge color={c.statusColor}>{c.status}</Badge></div>
            <div style={{fontWeight:700,color:c.amtColor}}>{c.amt}</div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modal&&(
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.55)',backdropFilter:'blur(4px)',zIndex:999,display:'flex',alignItems:'center',justifyContent:'center'}} onClick={e=>{if(e.target===e.currentTarget&&modalStep>=4)setModal(null)}}>
          <div style={{background:T.white,borderRadius:24,padding:32,maxWidth:420,width:'90%',animation:'popIn .3s cubic-bezier(.34,1.56,.64,1)'}}>
            <div style={{textAlign:'center',fontSize:52,marginBottom:10}}>{modal.icon}</div>
            <div style={{textAlign:'center',fontFamily:"'Instrument Serif',serif",fontSize:24,color:T.re,marginBottom:6}}>{modal.title}</div>
            <div style={{textAlign:'center',fontSize:13,color:T.mu,marginBottom:22,lineHeight:1.6}}>{modal.desc}</div>
            <div style={{display:'flex',flexDirection:'column',gap:8,marginBottom:16}}>
              {pipeSteps.map((s,i)=>(
                <div key={i} style={{display:'flex',alignItems:'center',gap:10,padding:'10px 14px',borderRadius:10,fontSize:13,background:s.state==='done'?T.grp:s.state==='active'?T.orp:T.surf,color:s.state==='done'?T.gr:s.state==='active'?T.or:T.mu,fontWeight:s.state!=='idle'?600:400,transition:'all .4s'}}>
                  <span style={{fontSize:16,width:20,textAlign:'center'}}>{s.icon}</span>
                  {s.text}
                </div>
              ))}
            </div>
            {modalStep>=4&&(
              <>
                <div style={{background:T.grp,border:`1.5px solid rgba(22,163,74,.22)`,borderRadius:14,padding:18,textAlign:'center',marginBottom:16,animation:'fadeUp .35s ease'}}>
                  <div style={{fontSize:11,color:T.gr,fontWeight:700,letterSpacing:'1px',textTransform:'uppercase',marginBottom:6}}>✅ Payout Processed</div>
                  <div style={{fontFamily:"'Instrument Serif',serif",fontSize:52,color:T.gr,lineHeight:1}}>{modal.payout}</div>
                  <div style={{fontSize:12,color:T.mu,marginTop:4}}>Credited to ravi@okicici · Processed automatically</div>
                </div>
                <Btn style={{width:'100%'}} onClick={()=>setModal(null)}>View in Dashboard →</Btn>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

/* ════════════════════════════════════════
   ROOT APP
════════════════════════════════════════ */
export default function App(){
  const [page,setPage]=useState('register');
  const [policyData,setPolicyData]=useState(null);
  const tabs=[
    {id:'register',label:'Registration',num:'1'},
    {id:'policy',label:'Policy Mgmt',num:'2'},
    {id:'premium',label:'AI Premium',num:'3'},
    {id:'claims',label:'Claims',num:'4'},
  ];
  return (
    <>
      <style>{G}</style>
      <style>{`
        input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:16px;height:16px;border-radius:50%;background:${T.or};cursor:pointer}
        input[type=range]::-moz-range-thumb{width:16px;height:16px;border-radius:50%;background:${T.or};cursor:pointer;border:none}
        button:hover{filter:brightness(1.05)}
      `}</style>
      {/* NAV */}
      <nav style={{position:'fixed',top:0,left:0,right:0,zIndex:500,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 28px',height:58,background:T.white,borderBottom:`1px solid ${T.line}`,boxShadow:'0 1px 8px rgba(0,0,0,.06)'}}>
        <div onClick={()=>setPage('register')} style={{display:'flex',alignItems:'center',gap:8,fontFamily:"'Instrument Serif',serif",fontSize:20,color:T.ink,cursor:'pointer'}}>
          <span>🛵</span> GigShield
          <div style={{width:8,height:8,borderRadius:'50%',background:T.gr,animation:'livePulse 2s infinite',marginLeft:2}}/>
        </div>
        <div style={{display:'flex',gap:3}}>
          {tabs.map(t=>(
            <button key={t.id} onClick={()=>setPage(t.id)}
              style={{display:'flex',alignItems:'center',gap:6,padding:'6px 14px',borderRadius:8,fontSize:13,fontWeight:500,cursor:'pointer',border:'none',background:page===t.id?T.ink:'transparent',color:page===t.id?'#fff':T.mu,transition:'all .15s'}}>
              <span style={{fontSize:10,background:T.or,color:'#fff',width:16,height:16,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700}}>{t.num}</span>
              {t.label}
            </button>
          ))}
        </div>
        <div style={{display:'flex',alignItems:'center',gap:6,background:T.grp,color:T.gr,border:`1px solid rgba(22,163,74,.18)`,padding:'5px 14px',borderRadius:20,fontSize:12,fontWeight:700}}>
          <div style={{width:7,height:7,borderRadius:'50%',background:T.gr,animation:'livePulse 2s infinite'}}/>
          Phase 2 Live
        </div>
      </nav>
      {/* PAGES */}
      <div style={{paddingTop:58,minHeight:'100vh'}}>
        {page==='register'&&<Registration onComplete={p=>{setPolicyData(p);}}/>}
        {page==='policy'&&<PolicyManagement policy={policyData}/>}
        {page==='premium'&&<AIPremium/>}
        {page==='claims'&&<Claims/>}
      </div>
    </>
  );
}
