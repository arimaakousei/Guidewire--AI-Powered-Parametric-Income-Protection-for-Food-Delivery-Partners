import { useState, useEffect, useCallback, useRef } from "react";

/* ─── TOKENS ─── */
const C = {
  or:"#F4580A",orl:"#FF7A35",orp:"#FFF3ED",orb:"rgba(244,88,10,0.1)",
  gr:"#16A34A",grp:"#F0FDF4",
  ye:"#D97706",yep:"#FFFBEB",
  re:"#DC2626",rep:"#FFF5F5",
  bl:"#2563EB",blp:"#EFF6FF",
  pu:"#7C3AED",pup:"#F5F3FF",
  ink:"#0F1117",ink2:"#1F2937",ink3:"#374151",
  mu:"#6B7280",mu2:"#9CA3AF",
  line:"#E5E7EB",line2:"#F3F4F6",
  surf:"#F9FAFB",white:"#FFFFFF",bg:"#F0F2F5",
};

const GS = `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Satoshi:wght@400;500;700;900&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Satoshi',system-ui,sans-serif;background:${C.bg};color:${C.ink};overflow-x:hidden}
::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:${C.or};border-radius:2px}
@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
@keyframes pulse{0%,100%{opacity:1;box-shadow:0 0 0 0 rgba(22,163,74,.4)}70%{opacity:.8;box-shadow:0 0 0 7px rgba(22,163,74,0)}}
@keyframes alertPing{0%,100%{opacity:1}50%{opacity:.3}}
@keyframes glow{0%,100%{box-shadow:0 0 0 0 rgba(244,88,10,0)}50%{box-shadow:0 0 18px 4px rgba(244,88,10,.22)}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes popIn{from{transform:scale(.78);opacity:0}to{transform:scale(1);opacity:1}}
@keyframes slideIn{from{transform:translateX(40px);opacity:0}to{transform:translateX(0);opacity:1}}
@keyframes countUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
.fu{animation:fadeUp .32s ease both}
.fu1{animation:fadeUp .32s .06s ease both}
.fu2{animation:fadeUp .32s .12s ease both}
.fu3{animation:fadeUp .32s .18s ease both}
.fu4{animation:fadeUp .32s .24s ease both}
input[type=range]{-webkit-appearance:none;width:100%;height:4px;border-radius:2px;background:rgba(255,255,255,.15);outline:none;cursor:pointer}
input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:16px;height:16px;border-radius:50%;background:${C.or};cursor:pointer}
`;

/* ─── SHARED ─── */
const serif = "'Instrument Serif',serif";
const sans  = "'Satoshi',sans-serif";

const Badge = ({c='orange',children,style={}})=>{
  const m={orange:{bg:C.orp,color:C.or},green:{bg:C.grp,color:C.gr},yellow:{bg:C.yep,color:C.ye},red:{bg:C.rep,color:C.re},blue:{bg:C.blp,color:C.bl},purple:{bg:C.pup,color:C.pu},dark:{bg:C.ink,color:'#fff'}};
  const s=m[c]||m.orange;
  return <span style={{display:'inline-flex',alignItems:'center',gap:4,padding:'3px 10px',borderRadius:20,fontSize:11,fontWeight:700,background:s.bg,color:s.color,...style}}>{children}</span>;
};

const Btn=({children,v='primary',onClick,full,style={},disabled})=>{
  const base={display:'inline-flex',alignItems:'center',justifyContent:'center',gap:7,padding:'10px 20px',borderRadius:10,fontFamily:sans,fontSize:14,fontWeight:700,cursor:disabled?'not-allowed':'pointer',border:'none',transition:'all .18s',opacity:disabled?.55:1,width:full?'100%':undefined,...style};
  const vs={primary:{...base,background:C.or,color:'#fff',boxShadow:'0 4px 14px rgba(244,88,10,.28)'},secondary:{...base,background:C.ink,color:'#fff'},ghost:{...base,background:'transparent',color:C.ink,border:`1.5px solid ${C.line}`},green:{...base,background:C.gr,color:'#fff',boxShadow:'0 4px 14px rgba(22,163,74,.28)'},purple:{...base,background:C.pu,color:'#fff'}};
  return <button style={vs[v]||vs.primary} onClick={onClick} disabled={disabled}>{children}</button>;
};

const Card=({children,style={}})=><div style={{background:C.white,border:`1px solid ${C.line}`,borderRadius:16,padding:22,...style}}>{children}</div>;
const Lbl=({children})=><div style={{fontSize:11,fontWeight:700,letterSpacing:'1.5px',textTransform:'uppercase',color:C.mu,marginBottom:10}}>{children}</div>;
const Bar=({v,color=C.or,h=5})=><div style={{height:h,background:C.line2,borderRadius:h/2,overflow:'hidden'}}><div style={{height:'100%',width:`${v}%`,background:color,borderRadius:h/2,transition:'width .6s ease'}}/></div>;

const StatCard=({label,value,sub,accent,color,style={}})=>(
  <div style={{background:accent?C.ink:C.white,border:`1px solid ${accent?C.ink:C.line}`,borderRadius:14,padding:18,...style}}>
    <div style={{fontSize:11,fontWeight:700,letterSpacing:'1px',textTransform:'uppercase',color:accent?'rgba(255,255,255,.4)':C.mu,marginBottom:6}}>{label}</div>
    <div style={{fontFamily:serif,fontSize:28,color:color||(accent?'#FF9A5C':C.or),lineHeight:1}}>{value}</div>
    {sub&&<div style={{fontSize:12,color:accent?'rgba(255,255,255,.35)':C.mu,marginTop:4}}>{sub}</div>}
  </div>
);

/* ════════════════════════════════════
   TAB 1 — ADVANCED FRAUD DETECTION
════════════════════════════════════ */
const FraudDetection=()=>{
  const [selected,setSelected]=useState(null);
  const [running,setRunning]=useState(false);
  const [scores,setScores]=useState({});

  const cases=[
    {id:'C001',worker:'ZOM-DEL-9921',event:'🌧️ Rain · Delhi NCR',date:'Apr 8',amount:'₹500',
     flags:['GPS 2.3km outside claimed zone','Ordered 12 times during "outage"','5th claim this month (avg: 1.2)'],
     gps:{claimed:'28.6139°N 77.2090°E',actual:'28.5355°N 77.3910°E',dist:'2.3km'},
     activity:{orders:12,expected:0,during:'claim window'},
     history:{claimsMonth:5,avgMonth:1.2,fraudPrior:1},
     weather:{claimed:'Red Alert',actual:'Yellow Alert',match:false},
     score:0.87,decision:'REJECT'},
    {id:'C002',worker:'SWG-MUM-3341',event:'🚫 Bandh · Mumbai',date:'Apr 7',amount:'₹500',
     flags:['Claims every single trigger event','Location valid but suspicious timing'],
     gps:{claimed:'19.0760°N 72.8777°E',actual:'19.0810°N 72.8820°E',dist:'0.6km'},
     activity:{orders:0,expected:0,during:'claim window'},
     history:{claimsMonth:8,avgMonth:1.5,fraudPrior:0},
     weather:{claimed:'Bandh Confirmed',actual:'Partial Bandh',match:true},
     score:0.61,decision:'REVIEW'},
    {id:'C003',worker:'SWG-BLR-7712',event:'🌡️ Heat · Bengaluru',date:'Apr 7',amount:'₹250',
     flags:['Platform shows 3 orders during heat alert'],
     gps:{claimed:'12.9716°N 77.5946°E',actual:'12.9755°N 77.5901°E',dist:'0.5km'},
     activity:{orders:3,expected:0,during:'claim window'},
     history:{claimsMonth:2,avgMonth:1.8,fraudPrior:0},
     weather:{claimed:'44°C sustained',actual:'43.2°C for 3.5hr',match:false},
     score:0.48,decision:'REVIEW'},
    {id:'C004',worker:'AMZ-HYD-5502',event:'🌫️ AQI · Hyderabad',date:'Apr 6',amount:'₹250',
     flags:['Minor GPS drift within 400m'],
     gps:{claimed:'17.3850°N 78.4867°E',actual:'17.3884°N 78.4901°E',dist:'0.4km'},
     activity:{orders:0,expected:0,during:'claim window'},
     history:{claimsMonth:1,avgMonth:1.1,fraudPrior:0},
     weather:{claimed:'AQI 382',actual:'AQI 375',match:true},
     score:0.14,decision:'APPROVE'},
    {id:'C005',worker:'ZPT-PUN-1198',event:'📵 Outage · Pune',date:'Apr 6',amount:'₹200',
     flags:['Claim origin: Mumbai IP','GPS: Pune claimed but device in Mumbai','Different city entirely'],
     gps:{claimed:'18.5204°N 73.8567°E',actual:'19.0760°N 72.8777°E',dist:'149km'},
     activity:{orders:0,expected:0,during:'claim window'},
     history:{claimsMonth:3,avgMonth:0.9,fraudPrior:2},
     weather:{claimed:'Platform Down',actual:'Not verified in zone',match:false},
     score:0.94,decision:'REJECT'},
  ];

  const scoreColor=s=>s>=0.7?C.re:s>=0.4?C.ye:C.gr;
  const decisionBadge={APPROVE:'green',REVIEW:'yellow',REJECT:'red'};

  const runAnalysis=(c)=>{
    setSelected(c);setRunning(true);setScores({});
    const checks=['gps','activity','history','weather','network'];
    checks.forEach((k,i)=>setTimeout(()=>{
      setScores(s=>({...s,[k]:true}));
      if(i===checks.length-1)setRunning(false);
    },(i+1)*600));
  };

  const fraudTypes=[
    {icon:'📍',title:'GPS Spoofing',desc:'Device GPS manipulated to appear inside trigger zone while physically outside. Detected via cell tower triangulation cross-check.',detected:23},
    {icon:'🌦️',title:'Fake Weather Claims',desc:'Historical AQI/rainfall data cross-checked against claimed trigger. Mismatches flagged when claimed severity > actual recorded data.',detected:11},
    {icon:'📱',title:'Platform Activity Fraud',desc:'Delivery app shows active orders during claimed downtime. Zero-order expectation model flags continued activity during disruptions.',detected:8},
    {icon:'🔁',title:'Duplicate Claim Rings',desc:'Mass simultaneous claims from same apartment complex or IP subnet — statistically impossible without coordination.',detected:4},
    {icon:'⏱️',title:'Temporal Anomalies',desc:'Claim filed before disruption officially started, or after it ended. Time-window validation against official API timestamps.',detected:6},
    {icon:'📊',title:'Frequency Outliers',desc:'Isolation Forest flags workers claiming 3× population average. Legitimate workers average 1–2 claims/month.',detected:17},
  ];

  return (
    <div style={{maxWidth:1100,margin:'0 auto',padding:'28px 28px'}}>
      <div className="fu" style={{marginBottom:22}}>
        <div style={{fontSize:11,fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',color:C.or,marginBottom:6}}>Isolation Forest · Neural Anomaly Detection</div>
        <div style={{fontFamily:serif,fontSize:32,color:C.ink}}>Advanced Fraud Detection Engine</div>
        <div style={{fontSize:14,color:C.mu,marginTop:4}}>Multi-layer fraud signals: GPS spoofing · Activity validation · Historical cross-check · Network fingerprinting</div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14,marginBottom:22}}>
        <StatCard accent label="Claims Today" value="247" sub="+18% vs yesterday"/>
        <StatCard label="Auto-Approved" value="218" sub="88.3% clean rate" color={C.gr}/>
        <StatCard label="Flagged" value="21" sub="8.5% review rate" color={C.ye}/>
        <StatCard label="Rejected" value="8" sub="3.2% fraud rate" color={C.re}/>
      </div>

      {/* Fraud type cards */}
      <div className="fu1" style={{marginBottom:22}}>
        <Lbl>Fraud Detection Modules</Lbl>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12}}>
          {fraudTypes.map(f=>(
            <Card key={f.title} style={{padding:16}}>
              <div style={{fontSize:22,marginBottom:8}}>{f.icon}</div>
              <div style={{fontWeight:700,fontSize:13,marginBottom:5}}>{f.title}</div>
              <div style={{fontSize:12,color:C.mu,lineHeight:1.55,marginBottom:10}}>{f.desc}</div>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                <Badge c="red">Caught this week: {f.detected}</Badge>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Review queue + detail panel */}
      <div className="fu2" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:18}}>
        <div>
          <Lbl>Fraud Review Queue</Lbl>
          <div style={{display:'flex',flexDirection:'column',gap:8}}>
            {cases.map(c=>(
              <div key={c.id} onClick={()=>runAnalysis(c)}
                style={{display:'flex',alignItems:'center',gap:12,padding:'12px 14px',background:selected?.id===c.id?C.orp:C.white,border:`1.5px solid ${selected?.id===c.id?C.or:C.line}`,borderRadius:12,cursor:'pointer',transition:'all .15s'}}>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700,fontSize:13,marginBottom:2}}>{c.event}</div>
                  <div style={{fontSize:11,color:C.mu}}>{c.worker} · {c.date} · {c.amount}</div>
                  <div style={{display:'flex',gap:4,marginTop:6,flexWrap:'wrap'}}>
                    {c.flags.slice(0,1).map(f=><Badge key={f} c="red" style={{fontSize:10}}>{f}</Badge>)}
                    {c.flags.length>1&&<Badge c="yellow" style={{fontSize:10}}>+{c.flags.length-1} more</Badge>}
                  </div>
                </div>
                <div style={{textAlign:'right'}}>
                  <div style={{fontFamily:serif,fontSize:20,color:scoreColor(c.score),fontWeight:700}}>{c.score}</div>
                  <Badge c={decisionBadge[c.decision]}>{c.decision}</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          {selected?(
            <div>
              <Lbl>AI Analysis — {selected.id}</Lbl>
              <Card style={{marginBottom:12}}>
                <div style={{fontWeight:700,fontSize:15,marginBottom:12,display:'flex',alignItems:'center',gap:8}}>
                  {selected.event}
                  <Badge c={decisionBadge[selected.decision]}>{selected.decision}</Badge>
                </div>
                {/* Fraud score meter */}
                <div style={{background:C.surf,borderRadius:10,padding:14,marginBottom:12}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
                    <span style={{fontSize:12,color:C.mu,fontWeight:600}}>Fraud Score</span>
                    <span style={{fontFamily:serif,fontSize:20,color:scoreColor(selected.score)}}>{selected.score}</span>
                  </div>
                  <Bar v={selected.score*100} color={scoreColor(selected.score)} h={8}/>
                  <div style={{display:'flex',justifyContent:'space-between',marginTop:4,fontSize:10,color:C.mu2}}>
                    <span>0.0 Clean</span><span>0.4 Review</span><span>0.7 Reject</span><span>1.0</span>
                  </div>
                </div>
                {/* Check results */}
                {[
                  {k:'gps',label:'📍 GPS Validation',pass:selected.gps.dist<'1km',detail:`Claimed: ${selected.gps.claimed} | Actual: ${selected.gps.dist} away`},
                  {k:'activity',label:'📱 Platform Activity',pass:selected.activity.orders===0,detail:`${selected.activity.orders} orders during ${selected.activity.during}`},
                  {k:'history',label:'📊 Claim History',pass:selected.history.claimsMonth<=2,detail:`${selected.history.claimsMonth} claims this month (avg ${selected.history.avgMonth})`},
                  {k:'weather',label:'🌦️ Weather Cross-Check',pass:selected.weather.match,detail:`Claimed: ${selected.weather.claimed} | Actual: ${selected.weather.actual}`},
                  {k:'network',label:'🌐 Network Fingerprint',pass:selected.history.fraudPrior===0,detail:`Prior fraud flags: ${selected.history.fraudPrior}`},
                ].map(ch=>(
                  <div key={ch.k} style={{display:'flex',alignItems:'flex-start',gap:10,padding:'9px 0',borderBottom:`1px solid ${C.line}`}}>
                    <div style={{width:20,height:20,borderRadius:'50%',background:scores[ch.k]?(ch.pass?C.grp:C.rep):C.line2,display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,flexShrink:0,transition:'all .3s',marginTop:1}}>
                      {scores[ch.k]?(ch.pass?'✓':'✗'):(running?<div style={{width:8,height:8,borderRadius:'50%',background:C.mu2,animation:'alertPing 1s infinite'}}/>:'○')}
                    </div>
                    <div>
                      <div style={{fontSize:13,fontWeight:600,color:scores[ch.k]?(ch.pass?C.gr:C.re):C.mu}}>{ch.label}</div>
                      <div style={{fontSize:11,color:C.mu,marginTop:2}}>{ch.detail}</div>
                    </div>
                  </div>
                ))}
                <div style={{display:'flex',gap:8,marginTop:14}}>
                  <Btn v="green" full onClick={()=>alert('Approved — payout queued')} style={{flex:1,padding:'9px'}}>✓ Approve</Btn>
                  <Btn v="ghost" onClick={()=>alert('Sent for manual review')} style={{flex:1,padding:'9px'}}>Review</Btn>
                  <Btn v="primary" style={{flex:1,padding:'9px',background:C.re,boxShadow:'none'}} onClick={()=>alert('Claim rejected — worker notified')}>✗ Reject</Btn>
                </div>
              </Card>
              {/* Flags */}
              <Card style={{background:C.rep,borderColor:'rgba(220,38,38,.2)',padding:14}}>
                <div style={{fontWeight:700,fontSize:13,color:C.re,marginBottom:8}}>🚨 Fraud Signals Detected</div>
                {selected.flags.map(f=>(
                  <div key={f} style={{display:'flex',alignItems:'center',gap:6,fontSize:12,color:C.re,marginBottom:4}}>
                    <span>→</span>{f}
                  </div>
                ))}
              </Card>
            </div>
          ):(
            <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',height:'100%',color:C.mu,textAlign:'center',padding:40}}>
              <div style={{fontSize:40,marginBottom:12}}>🔍</div>
              <div style={{fontFamily:serif,fontSize:20,marginBottom:8}}>Select a case to analyse</div>
              <div style={{fontSize:13,lineHeight:1.6}}>Click any claim in the queue to run the multi-layer fraud analysis pipeline</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ════════════════════════════════════
   TAB 2 — INSTANT PAYOUT SYSTEM
════════════════════════════════════ */
const PayoutSystem=()=>{
  const [gateway,setGateway]=useState('razorpay');
  const [trigger,setTrigger]=useState(null);
  const [step,setStep]=useState(0);
  const [done,setDone]=useState(false);
  const [history,setHistory]=useState([
    {id:'PAY-001',worker:'Ravi Kumar',event:'🌧️ Rain · Mar 15',method:'UPI',amount:'₹500',time:'47 min',status:'SUCCESS',txn:'rzp_live_xK2mP9'},
    {id:'PAY-002',worker:'Amit Singh',event:'🚫 Bandh · Mar 10',method:'UPI',amount:'₹500',time:'1h 12m',status:'SUCCESS',txn:'rzp_live_aB3nQ1'},
    {id:'PAY-003',worker:'Priya Nair',event:'📵 Outage · Mar 6',method:'Bank',amount:'₹350',time:'23 min',status:'SUCCESS',txn:'rzp_live_cC4oR2'},
    {id:'PAY-004',worker:'Ravi Kumar',event:'🌧️ Rain · Mar 2',method:'UPI',amount:'₹500',time:'38 min',status:'SUCCESS',txn:'rzp_live_dD5pS3'},
    {id:'PAY-005',worker:'Suresh B.',event:'🌡️ Heat · Feb 28',method:'UPI',amount:'₹250',time:'2h 5m',status:'PENDING',txn:'rzp_live_eE6qT4'},
  ]);

  const gateways={
    razorpay:{name:'Razorpay',logo:'💳',mode:'Test Mode',color:'#3395FF',tag:'SANDBOX'},
    stripe:{name:'Stripe',logo:'💜',mode:'Sandbox',color:'#6772E5',tag:'SANDBOX'},
    upi:{name:'UPI Simulator',logo:'🇮🇳',mode:'Mock Mode',color:C.or,tag:'MOCK'},
  };

  const triggers=[
    {type:'rain',icon:'🌧️',label:'Heavy Rainfall Alert',payout:500,worker:'Ravi Kumar',upi:'ravi@okicici',zone:'HSR Layout'},
    {type:'bandh',icon:'🚫',label:'Unplanned Bandh',payout:500,worker:'Ravi Kumar',upi:'ravi@okicici',zone:'HSR Layout'},
    {type:'aqi',icon:'🌫️',label:'AQI Hazard Spike',payout:250,worker:'Ravi Kumar',upi:'ravi@okicici',zone:'HSR Layout'},
    {type:'heat',icon:'🌡️',label:'Extreme Heat',payout:250,worker:'Ravi Kumar',upi:'ravi@okicici',zone:'HSR Layout'},
    {type:'platform',icon:'📵',label:'Platform Outage',payout:200,worker:'Ravi Kumar',upi:'ravi@okicici',zone:'HSR Layout'},
  ];

  const paySteps=[
    {label:'Disruption confirmed via API',detail:'OpenWeatherMap Red Alert verified'},
    {label:'Fraud check passed',detail:'Isolation Forest score: 0.12 — Clean'},
    {label:'Policy coverage validated',detail:'Kavach Plus · GS-BLR-2026-48291'},
    {label:'Payout amount calculated',detail:'Full day trigger: ₹500 approved'},
    {label:`${gateways[gateway]?.name} API called`,detail:`POST /v1/payments · ${gateways[gateway]?.mode}`},
    {label:'UPI transfer initiated',detail:'ravi@okicici · IMPS instant transfer'},
    {label:'Confirmation received',detail:'Transaction ID generated · Worker notified via SMS'},
  ];

  const runPayout=(t)=>{
    setTrigger(t);setStep(0);setDone(false);
    let s=0;
    const iv=setInterval(()=>{
      s++;setStep(s);
      if(s>=paySteps.length){
        clearInterval(iv);setDone(true);
        const txn=`rzp_test_${Math.random().toString(36).slice(2,10)}`;
        setHistory(h=>[{id:'PAY-'+String(h.length+1).padStart(3,'0'),worker:t.worker,event:t.icon+' '+t.label,method:'UPI',amount:'₹'+t.payout,time:'< 2 min',status:'SUCCESS',txn},h]);
      }
    },800);
  };

  const totalPaid=history.filter(h=>h.status==='SUCCESS').reduce((a,h)=>a+parseInt(h.amount.replace('₹','')),0);

  return (
    <div style={{maxWidth:1100,margin:'0 auto',padding:'28px 28px'}}>
      <div className="fu" style={{marginBottom:22}}>
        <div style={{fontSize:11,fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',color:C.or,marginBottom:6}}>Razorpay · Stripe · UPI Simulator</div>
        <div style={{fontFamily:serif,fontSize:32,color:C.ink}}>Instant Payout System</div>
        <div style={{fontSize:14,color:C.mu,marginTop:4}}>Simulated payment gateway integration — demonstrating sub-2-minute UPI payouts to delivery partners.</div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14,marginBottom:22}}>
        <StatCard accent label="Total Paid Out" value={`₹${totalPaid.toLocaleString()}`} sub="All time"/>
        <StatCard label="Avg Payout Time" value="47 min" sub="From trigger to UPI" color={C.gr}/>
        <StatCard label="Success Rate" value="97.8%" sub="2 gateway retries" color={C.bl}/>
        <StatCard label="Active Gateway" value={gateways[gateway]?.name} sub={gateways[gateway]?.mode} color={C.pu}/>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:18,marginBottom:22}}>
        {/* Gateway selector */}
        <Card>
          <Lbl>Payment Gateway (Sandbox Mode)</Lbl>
          <div style={{display:'flex',flexDirection:'column',gap:8,marginBottom:16}}>
            {Object.entries(gateways).map(([k,g])=>(
              <div key={k} onClick={()=>setGateway(k)}
                style={{display:'flex',alignItems:'center',gap:12,padding:'12px 14px',border:`1.5px solid ${gateway===k?g.color:C.line}`,borderRadius:12,cursor:'pointer',background:gateway===k?`${g.color}12`:C.white,transition:'all .15s'}}>
                <span style={{fontSize:24}}>{g.logo}</span>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700,fontSize:14}}>{g.name}</div>
                  <div style={{fontSize:11,color:C.mu,marginTop:1}}>{g.mode}</div>
                </div>
                <Badge c={k==='razorpay'?'blue':k==='stripe'?'purple':'orange'}>{g.tag}</Badge>
              </div>
            ))}
          </div>
          <div style={{background:C.surf,borderRadius:10,padding:12,fontSize:12,color:C.mu,lineHeight:1.6}}>
            <strong style={{color:C.ink}}>Integration note:</strong> All gateways run in sandbox/test mode. Replace API keys with production credentials to go live. UPI transfers use IMPS for instant settlement.
          </div>
        </Card>

        {/* Payout pipeline */}
        <Card>
          <Lbl>Payout Processing Pipeline</Lbl>
          {trigger?(
            <div style={{display:'flex',flexDirection:'column',gap:6}}>
              <div style={{background:C.orp,borderRadius:10,padding:'10px 12px',marginBottom:6,display:'flex',alignItems:'center',gap:8}}>
                <span style={{fontSize:20}}>{trigger.icon}</span>
                <div>
                  <div style={{fontWeight:700,fontSize:13,color:C.or}}>{trigger.label}</div>
                  <div style={{fontSize:11,color:C.mu}}>{trigger.worker} · ₹{trigger.payout} · {trigger.upi}</div>
                </div>
              </div>
              {paySteps.map((s,i)=>(
                <div key={i} style={{display:'flex',gap:10,padding:'8px 0',borderBottom:`1px solid ${C.line}`,alignItems:'flex-start'}}>
                  <div style={{width:22,height:22,borderRadius:'50%',background:step>i?C.grp:step===i?C.orp:C.line2,border:`1.5px solid ${step>i?C.gr:step===i?C.or:C.line}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700,color:step>i?C.gr:step===i?C.or:C.mu2,flexShrink:0,transition:'all .4s'}}>
                    {step>i?'✓':step===i?<div style={{width:8,height:8,borderRadius:'50%',background:C.or,animation:'alertPing 1s infinite'}}/>:i+1}
                  </div>
                  <div>
                    <div style={{fontSize:13,fontWeight:600,color:step>i?C.gr:step===i?C.or:C.mu}}>{s.label}</div>
                    <div style={{fontSize:11,color:C.mu2,marginTop:1}}>{s.detail}</div>
                  </div>
                </div>
              ))}
              {done&&(
                <div style={{background:C.grp,border:`1.5px solid rgba(22,163,74,.22)`,borderRadius:12,padding:14,textAlign:'center',marginTop:8,animation:'fadeUp .35s ease'}}>
                  <div style={{fontSize:11,color:C.gr,fontWeight:700,letterSpacing:'1px',textTransform:'uppercase',marginBottom:4}}>✅ Payment Successful</div>
                  <div style={{fontFamily:serif,fontSize:44,color:C.gr,lineHeight:1}}>₹{trigger.payout}</div>
                  <div style={{fontSize:12,color:C.mu,marginTop:4}}>Credited to {trigger.upi} · {gateways[gateway]?.name} {gateways[gateway]?.mode}</div>
                </div>
              )}
            </div>
          ):(
            <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',minHeight:200,color:C.mu,textAlign:'center'}}>
              <div style={{fontSize:36,marginBottom:10}}>💸</div>
              <div style={{fontFamily:serif,fontSize:18,marginBottom:6}}>Select a trigger below</div>
              <div style={{fontSize:13}}>Watch the full payout pipeline in real-time</div>
            </div>
          )}
        </Card>
      </div>

      {/* Trigger buttons */}
      <Card style={{marginBottom:22}}>
        <Lbl>Simulate Disruption → Instant Payout</Lbl>
        <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
          {triggers.map(t=>(
            <button key={t.type} onClick={()=>runPayout(t)}
              style={{display:'flex',alignItems:'center',gap:7,padding:'10px 18px',background:C.white,border:`1.5px solid ${C.line}`,borderRadius:10,fontSize:13,fontWeight:600,color:C.ink,cursor:'pointer',transition:'all .18s'}}
              onMouseEnter={e=>{e.target.style.borderColor=C.or;e.target.style.color=C.or;}}
              onMouseLeave={e=>{e.target.style.borderColor=C.line;e.target.style.color=C.ink;}}>
              {t.icon} {t.label} <span style={{marginLeft:4,fontFamily:serif,color:C.or}}>₹{t.payout}</span>
            </button>
          ))}
        </div>
      </Card>

      {/* Transaction history */}
      <Lbl>Transaction History</Lbl>
      <div style={{background:C.white,border:`1px solid ${C.line}`,borderRadius:14,overflow:'hidden'}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1.2fr 1fr 0.7fr 0.7fr 1.2fr 0.8fr',gap:10,padding:'10px 16px',background:C.surf,borderBottom:`1px solid ${C.line}`,fontSize:11,fontWeight:700,letterSpacing:'1px',textTransform:'uppercase',color:C.mu}}>
          {['Pay ID','Worker','Event','Method','Amount','Txn ID','Status'].map(h=><div key={h}>{h}</div>)}
        </div>
        {history.map((h,i)=>(
          <div key={h.id} style={{display:'grid',gridTemplateColumns:'1fr 1.2fr 1fr 0.7fr 0.7fr 1.2fr 0.8fr',gap:10,padding:'11px 16px',borderBottom:`1px solid ${C.line}`,fontSize:13,alignItems:'center',background:i===0&&done?'#f0fdf4':undefined,transition:'background .5s'}}>
            <div style={{fontSize:12,fontWeight:600}}>{h.id}</div>
            <div>{h.worker}</div>
            <div style={{fontSize:12}}>{h.event}</div>
            <div><Badge c="blue" style={{fontSize:10}}>{h.method}</Badge></div>
            <div style={{fontWeight:700,color:C.gr}}>{h.amount}</div>
            <div style={{fontSize:10,color:C.mu,fontFamily:'monospace'}}>{h.txn}</div>
            <div><Badge c={h.status==='SUCCESS'?'green':'yellow'}>{h.status}</Badge></div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ════════════════════════════════════
   TAB 3 — WORKER DASHBOARD
════════════════════════════════════ */
const WorkerDashboard=()=>{
  const weeks=['Week 1','Week 2','Week 3','Week 4','Week 5','Week 6','Week 7','Week 8'];
  const earnings=[850,720,900,0,880,650,500,810];
  const protected_=[0,0,0,500,0,0,500,0];

  const timeline=[
    {date:'Mar 15',event:'🌧️ Heavy Rain — HSR Layout',status:'paid',amount:500,time:'47 min'},
    {date:'Mar 10',event:'🚫 City Bandh',status:'paid',amount:500,time:'1h 12m'},
    {date:'Mar 6',event:'📵 Swiggy Outage',status:'paid',amount:350,time:'23 min'},
    {date:'Mar 2',event:'🌧️ Heavy Rain — Koramangala',status:'paid',amount:500,time:'38 min'},
    {date:'Feb 28',event:'🌫️ AQI 380 Alert',status:'pending',amount:250,time:'Processing'},
  ];

  const maxE=Math.max(...earnings,...protected_);

  return (
    <div style={{maxWidth:1100,margin:'0 auto',padding:'28px 28px'}}>
      {/* Worker header */}
      <div className="fu" style={{background:C.ink,borderRadius:20,padding:28,marginBottom:20,position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:-40,right:-40,width:200,height:200,borderRadius:'50%',background:'rgba(244,88,10,.1)'}}/>
        <div style={{position:'absolute',bottom:-30,right:60,width:100,height:100,borderRadius:'50%',background:'rgba(244,88,10,.06)'}}/>
        <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:20,position:'relative',zIndex:1}}>
          <div style={{display:'flex',alignItems:'center',gap:14}}>
            <div style={{width:52,height:52,borderRadius:'50%',background:C.or,display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,fontWeight:700,color:'#fff',fontFamily:serif}}>RK</div>
            <div>
              <div style={{fontFamily:serif,fontSize:26,color:'#fff'}}>Ravi Kumar</div>
              <div style={{fontSize:13,color:'rgba(255,255,255,.45)',marginTop:2}}>Swiggy · GS-BLR-2026-48291 · HSR Layout, Bengaluru</div>
            </div>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:6,background:'rgba(22,163,74,.2)',color:'#4ADE80',padding:'7px 16px',borderRadius:20,fontSize:13,fontWeight:700}}>
            <div style={{width:8,height:8,borderRadius:'50%',background:'#4ADE80',animation:'pulse 2s infinite'}}/>
            Coverage Active
          </div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',position:'relative',zIndex:1}}>
          {[['Earnings Protected','₹2,350','This month'],['Weekly Premium','₹49','Kavach Plus'],['Active Coverage','₹500/day','Full triggers'],['Policy Streak','35 days','→ 15% discount at 90'],['Claim Success','100%','5/5 approved']].map(([l,v,s],i)=>(
            <div key={l} style={{padding:'0 16px',borderRight:i<4?'1px solid rgba(255,255,255,.08)':undefined}}>
              <div style={{fontSize:10,color:'rgba(255,255,255,.38)',textTransform:'uppercase',letterSpacing:'1px',marginBottom:3}}>{l}</div>
              <div style={{fontFamily:serif,fontSize:22,color:'#FF9A5C'}}>{v}</div>
              <div style={{fontSize:11,color:'rgba(255,255,255,.3)',marginTop:2}}>{s}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1.4fr 1fr',gap:18,marginBottom:18}}>
        {/* Earnings chart */}
        <Card className="fu1">
          <Lbl>8-Week Earnings vs Protected Income</Lbl>
          <div style={{display:'flex',alignItems:'flex-end',gap:6,height:140,marginBottom:8}}>
            {weeks.map((w,i)=>(
              <div key={w} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:2,height:'100%',justifyContent:'flex-end'}}>
                {protected_[i]>0&&(
                  <div style={{width:'100%',background:C.or,borderRadius:'4px 4px 0 0',height:`${(protected_[i]/maxE)*100}%`,opacity:.9,minHeight:4,transition:'height .6s ease'}}/>
                )}
                <div style={{width:'100%',background:earnings[i]>0?C.ink:C.line2,borderRadius:protected_[i]>0?0:'4px 4px 0 0',height:`${(earnings[i]/maxE)*100}%`,minHeight:earnings[i]>0?8:4,transition:'height .6s ease'}}/>
              </div>
            ))}
          </div>
          <div style={{display:'flex',gap:6,marginBottom:6}}>
            {weeks.map((w,i)=><div key={w} style={{flex:1,fontSize:9,color:C.mu,textAlign:'center'}}>{w.replace('Week ','W')}</div>)}
          </div>
          <div style={{display:'flex',gap:14,marginTop:6}}>
            <span style={{display:'flex',alignItems:'center',gap:4,fontSize:12,color:C.mu}}><div style={{width:10,height:10,background:C.ink,borderRadius:2}}/> Earnings</span>
            <span style={{display:'flex',alignItems:'center',gap:4,fontSize:12,color:C.mu}}><div style={{width:10,height:10,background:C.or,borderRadius:2}}/> Protected Payout</span>
          </div>
        </Card>

        {/* Coverage status */}
        <Card className="fu2">
          <Lbl>Active Coverage Status</Lbl>
          <div style={{display:'flex',flexDirection:'column',gap:10}}>
            {[
              {icon:'🌧️',name:'Heavy Rain',status:'Monitoring',safe:true},
              {icon:'🌡️',name:'Extreme Heat',status:'Safe · 34°C',safe:true},
              {icon:'🌫️',name:'Air Quality',status:'Moderate · AQI 142',safe:false},
              {icon:'🚫',name:'Bandh/Curfew',status:'Clear',safe:true},
              {icon:'📵',name:'Platform',status:'Online',safe:true},
            ].map(t=>(
              <div key={t.name} style={{display:'flex',alignItems:'center',gap:10,padding:'9px 12px',background:!t.safe?C.yep:C.surf,borderRadius:10,border:`1px solid ${!t.safe?'rgba(217,119,6,.2)':C.line}`}}>
                <span style={{fontSize:18}}>{t.icon}</span>
                <span style={{flex:1,fontWeight:600,fontSize:13}}>{t.name}</span>
                <span style={{fontSize:12,color:!t.safe?C.ye:C.mu}}>{t.status}</span>
                <div style={{width:8,height:8,borderRadius:'50%',background:!t.safe?C.ye:C.gr}}/>
              </div>
            ))}
          </div>
          <div style={{marginTop:14,padding:'10px 12px',background:C.orp,borderRadius:10,fontSize:12,color:C.or,fontWeight:600}}>
            💡 Next renewal: Monday Apr 14 · ₹49 auto-deducted from Swiggy payout
          </div>
        </Card>
      </div>

      {/* Payout timeline */}
      <Card className="fu3">
        <Lbl>Payout Timeline</Lbl>
        <div style={{display:'flex',flexDirection:'column',gap:0}}>
          {timeline.map((t,i)=>(
            <div key={i} style={{display:'flex',gap:14,padding:'14px 0',borderBottom:i<timeline.length-1?`1px solid ${C.line}`:undefined}}>
              <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:0}}>
                <div style={{width:12,height:12,borderRadius:'50%',background:t.status==='paid'?C.gr:C.ye,marginTop:3}}/>
                {i<timeline.length-1&&<div style={{width:2,height:'100%',background:C.line2,marginTop:4,flex:1}}/>}
              </div>
              <div style={{flex:1}}>
                <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:2}}>
                  <span style={{fontWeight:700,fontSize:14}}>{t.event}</span>
                  <Badge c={t.status==='paid'?'green':'yellow'}>{t.status==='paid'?'Paid':'Processing'}</Badge>
                </div>
                <div style={{fontSize:12,color:C.mu}}>{t.date} · Auto-processed in {t.time} · ravi@okicici</div>
              </div>
              <div style={{fontFamily:serif,fontSize:20,color:t.status==='paid'?C.gr:C.ye}}>+₹{t.amount}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

/* ════════════════════════════════════
   TAB 4 — INSURER DASHBOARD
════════════════════════════════════ */
const InsurerDashboard=()=>{
  const [forecast,setForecast]=useState(false);

  const lossData=[
    {zone:'HSR Layout',premium:4900,claims:3500,ratio:71.4,risk:'medium'},
    {zone:'Koramangala',premium:6370,claims:3800,ratio:59.7,risk:'low'},
    {zone:'Whitefield',premium:3430,claims:2800,ratio:81.6,risk:'high'},
    {zone:'Indiranagar',premium:5390,claims:2100,ratio:38.9,risk:'low'},
    {zone:'Electronic City',premium:4410,claims:3200,ratio:72.6,risk:'medium'},
    {zone:'JP Nagar',premium:2940,claims:1400,ratio:47.6,risk:'low'},
  ];

  const weeklyPremiums=[49,52,51,55,48,53,56,49];
  const weeklyClaims=[22,38,19,45,15,28,52,21];
  const weeks=['W1','W2','W3','W4','W5','W6','W7','W8'];

  const predictedRisk=[
    {week:'Apr 14–20',rain:78,heat:12,aqi:35,bandh:8,predicted:'HIGH',coverage:'₹4.2L'},
    {week:'Apr 21–27',rain:45,heat:28,aqi:42,bandh:5,predicted:'MEDIUM',coverage:'₹2.8L'},
    {week:'Apr 28–May 4',rain:22,heat:55,aqi:30,bandh:3,predicted:'MEDIUM',coverage:'₹2.1L'},
    {week:'May 5–11',rain:15,heat:72,aqi:25,bandh:6,predicted:'HIGH',coverage:'₹3.9L'},
  ];

  const riskColor={HIGH:C.re,MEDIUM:C.ye,LOW:C.gr};
  const riskBg={HIGH:'red',MEDIUM:'yellow',LOW:'green'};
  const maxPrem=Math.max(...weeklyPremiums);
  const maxClaim=Math.max(...weeklyClaims);

  return (
    <div style={{maxWidth:1100,margin:'0 auto',padding:'28px 28px'}}>
      <div className="fu" style={{marginBottom:22}}>
        <div style={{fontSize:11,fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',color:C.or,marginBottom:6}}>Admin View · Insurer Analytics</div>
        <div style={{fontFamily:serif,fontSize:32,color:C.ink}}>Intelligent Insurer Dashboard</div>
        <div style={{fontSize:14,color:C.mu,marginTop:4}}>Loss ratios · Predictive analytics · Next-week disruption forecasting · Zone risk heatmap</div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14,marginBottom:22}}>
        <StatCard accent label="Premium Collected" value="₹2.94L" sub="This month"/>
        <StatCard label="Claims Paid" value="₹1.96L" sub="67% loss ratio" color={C.ye}/>
        <StatCard label="Net Margin" value="₹0.98L" sub="33.3% margin" color={C.gr}/>
        <StatCard label="Active Policies" value="1,847" sub="+124 this week" color={C.bl}/>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1.2fr 1fr',gap:18,marginBottom:18}}>
        {/* Loss ratio by zone */}
        <Card className="fu1">
          <Lbl>Loss Ratio by Zone — Bengaluru</Lbl>
          <div style={{display:'flex',flexDirection:'column',gap:10}}>
            {lossData.map(z=>(
              <div key={z.zone}>
                <div style={{display:'flex',justifyContent:'space-between',fontSize:13,marginBottom:4}}>
                  <span style={{fontWeight:600}}>{z.zone}</span>
                  <div style={{display:'flex',alignItems:'center',gap:8}}>
                    <span style={{fontSize:12,color:C.mu}}>₹{z.premium.toLocaleString()} premium · ₹{z.claims.toLocaleString()} claims</span>
                    <span style={{fontWeight:700,color:z.ratio>75?C.re:z.ratio>55?C.ye:C.gr}}>{z.ratio}%</span>
                  </div>
                </div>
                <Bar v={z.ratio} color={z.ratio>75?C.re:z.ratio>55?C.ye:C.gr} h={7}/>
              </div>
            ))}
          </div>
          <div style={{marginTop:14,display:'flex',gap:10}}>
            <span style={{display:'flex',alignItems:'center',gap:4,fontSize:12,color:C.mu}}><div style={{width:10,height:6,background:C.gr,borderRadius:1}}/>&lt;55% Healthy</span>
            <span style={{display:'flex',alignItems:'center',gap:4,fontSize:12,color:C.mu}}><div style={{width:10,height:6,background:C.ye,borderRadius:1}}/> 55–75% Watch</span>
            <span style={{display:'flex',alignItems:'center',gap:4,fontSize:12,color:C.mu}}><div style={{width:10,height:6,background:C.re,borderRadius:1}}/>&gt;75% Reprice</span>
          </div>
        </Card>

        {/* Weekly premium vs claims chart */}
        <Card className="fu2">
          <Lbl>8-Week Premium vs Claims Volume</Lbl>
          <div style={{display:'flex',alignItems:'flex-end',gap:5,height:130,marginBottom:6}}>
            {weeks.map((w,i)=>(
              <div key={w} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:2,height:'100%',justifyContent:'flex-end'}}>
                <div style={{width:'45%',background:C.bl,borderRadius:'3px 3px 0 0',height:`${(weeklyPremiums[i]/maxPrem)*100}%`,minHeight:4}}/>
                <div style={{width:'45%',background:C.or,borderRadius:'3px 3px 0 0',height:`${(weeklyClaims[i]/maxClaim)*100}%`,minHeight:4,marginLeft:'10%'}}/>
              </div>
            ))}
          </div>
          <div style={{display:'flex',gap:4,marginBottom:8}}>
            {weeks.map(w=><div key={w} style={{flex:1,fontSize:10,color:C.mu,textAlign:'center'}}>{w}</div>)}
          </div>
          <div style={{display:'flex',gap:14}}>
            <span style={{display:'flex',alignItems:'center',gap:4,fontSize:12,color:C.mu}}><div style={{width:10,height:10,background:C.bl,borderRadius:2}}/> Premiums</span>
            <span style={{display:'flex',alignItems:'center',gap:4,fontSize:12,color:C.mu}}><div style={{width:10,height:10,background:C.or,borderRadius:2}}/> Claims</span>
          </div>
        </Card>
      </div>

      {/* Predictive forecast */}
      <Card className="fu3" style={{marginBottom:18}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14}}>
          <div>
            <Lbl>AI Disruption Forecast — Next 4 Weeks</Lbl>
            <div style={{fontSize:12,color:C.mu,marginTop:-6}}>Prophet + IMD seasonal model · 87% historical accuracy</div>
          </div>
          <Btn v="purple" onClick={()=>setForecast(f=>!f)} style={{padding:'8px 16px',fontSize:13}}>
            {forecast?'Hide':'Show'} Detailed Forecast
          </Btn>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12}}>
          {predictedRisk.map(p=>(
            <div key={p.week} style={{background:C.surf,borderRadius:12,padding:14,border:`1px solid ${C.line}`}}>
              <div style={{fontSize:11,color:C.mu,marginBottom:6,fontWeight:600}}>{p.week}</div>
              <Badge c={riskBg[p.predicted]} style={{marginBottom:10}}>{p.predicted} RISK</Badge>
              {forecast&&(
                <div style={{display:'flex',flexDirection:'column',gap:5,marginBottom:8}}>
                  {[['🌧️ Rain',p.rain],['🌡️ Heat',p.heat],['🌫️ AQI',p.aqi],['🚫 Bandh',p.bandh]].map(([l,v])=>(
                    <div key={l} style={{display:'flex',alignItems:'center',gap:6}}>
                      <span style={{fontSize:11,width:60}}>{l}</span>
                      <div style={{flex:1,height:4,background:C.line,borderRadius:2,overflow:'hidden'}}>
                        <div style={{height:'100%',width:`${v}%`,background:v>60?C.re:v>35?C.ye:C.bl,borderRadius:2}}/>
                      </div>
                      <span style={{fontSize:10,fontWeight:700,color:C.mu,width:28,textAlign:'right'}}>{v}%</span>
                    </div>
                  ))}
                </div>
              )}
              <div style={{fontSize:12,color:C.mu}}>Expected claims:</div>
              <div style={{fontFamily:serif,fontSize:18,color:riskColor[p.predicted]}}>{p.coverage}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Key metrics */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14}} className="fu4">
        <Card>
          <Lbl>Portfolio Health</Lbl>
          {[['Combined Loss Ratio','67.0%',C.ye],['Premium Growth (MoM)','+18.4%',C.gr],['Fraud Rate','3.2%',C.gr],['Avg Claim Size','₹412',C.ink],['Policy Retention','94.2%',C.gr]].map(([k,v,c])=>(
            <div key={k} style={{display:'flex',justifyContent:'space-between',padding:'6px 0',borderBottom:`1px solid ${C.line}`,fontSize:13}}>
              <span style={{color:C.mu}}>{k}</span>
              <span style={{fontWeight:700,color:c}}>{v}</span>
            </div>
          ))}
        </Card>
        <Card>
          <Lbl>Top Risk Zones (Reprice Alert)</Lbl>
          {[['Whitefield, BLR','81.6% LR','red'],['HSR Layout, BLR','71.4% LR','yellow'],['Electronic City','72.6% LR','yellow'],['Andheri East, MUM','78.2% LR','red'],['Connaught Place, DEL','74.1% LR','yellow']].map(([z,r,c])=>(
            <div key={z} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'6px 0',borderBottom:`1px solid ${C.line}`,fontSize:13}}>
              <span>{z}</span>
              <Badge c={c}>{r}</Badge>
            </div>
          ))}
        </Card>
        <Card>
          <Lbl>This Week's Action Items</Lbl>
          {[['⬆️ Reprice Whitefield zone','High priority','red'],['🔍 Review 12 fraud flags','Pending','yellow'],['📊 Renew 847 policies Mon','Scheduled','green'],['📈 Raise HSR coverage cap','Recommended','blue'],['🤖 Retrain XGBoost model','Due Apr 15','purple']].map(([a,s,c])=>(
            <div key={a} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'6px 0',borderBottom:`1px solid ${C.line}`,fontSize:12}}>
              <span style={{flex:1}}>{a}</span>
              <Badge c={c} style={{fontSize:10}}>{s}</Badge>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
};

/* ════════════════════════════════════
   ROOT APP
════════════════════════════════════ */
export default function App(){
  const [page,setPage]=useState('fraud');
  const tabs=[
    {id:'fraud',label:'Fraud Detection',num:'1',icon:'🔍'},
    {id:'payout',label:'Instant Payout',num:'2',icon:'💸'},
    {id:'worker',label:'Worker Dashboard',num:'3',icon:'🛵'},
    {id:'insurer',label:'Insurer Dashboard',num:'4',icon:'📊'},
  ];
  return(
    <>
      <style>{GS}</style>
      <style>{`
        button:not([disabled]):hover{filter:brightness(1.06)}
        .zone-card:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,.08)}
      `}</style>
      {/* NAV */}
      <nav style={{position:'fixed',top:0,left:0,right:0,zIndex:500,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 28px',height:58,background:C.white,borderBottom:`1px solid ${C.line}`,boxShadow:'0 1px 8px rgba(0,0,0,.05)'}}>
        <div style={{display:'flex',alignItems:'center',gap:8,fontFamily:serif,fontSize:20,color:C.ink,cursor:'pointer'}} onClick={()=>setPage('fraud')}>
          <span>🛵</span> GigShield
          <div style={{width:8,height:8,borderRadius:'50%',background:C.gr,animation:'pulse 2s infinite',marginLeft:2}}/>
          <span style={{fontSize:10,background:C.or,color:'#fff',padding:'2px 8px',borderRadius:10,fontFamily:sans,fontWeight:700,marginLeft:4}}>PHASE 3</span>
        </div>
        <div style={{display:'flex',gap:2}}>
          {tabs.map(t=>(
            <button key={t.id} onClick={()=>setPage(t.id)}
              style={{display:'flex',alignItems:'center',gap:6,padding:'6px 14px',borderRadius:8,fontSize:13,fontWeight:500,cursor:'pointer',border:'none',background:page===t.id?C.ink:'transparent',color:page===t.id?'#fff':C.mu,transition:'all .15s'}}>
              <span style={{fontSize:11,background:page===t.id?C.or:'rgba(244,88,10,.15)',color:page===t.id?'#fff':C.or,width:16,height:16,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700}}>{t.num}</span>
              {t.icon} {t.label}
            </button>
          ))}
        </div>
        <div style={{display:'flex',alignItems:'center',gap:6,background:C.grp,color:C.gr,border:`1px solid rgba(22,163,74,.18)`,padding:'5px 14px',borderRadius:20,fontSize:12,fontWeight:700}}>
          <div style={{width:7,height:7,borderRadius:'50%',background:C.gr,animation:'pulse 2s infinite'}}/>
          Phase 3 · Scale & Optimise
        </div>
      </nav>
      <div style={{paddingTop:58,minHeight:'100vh'}}>
        {page==='fraud'  && <FraudDetection/>}
        {page==='payout' && <PayoutSystem/>}
        {page==='worker' && <WorkerDashboard/>}
        {page==='insurer'&& <InsurerDashboard/>}
      </div>
    </>
  );
}
