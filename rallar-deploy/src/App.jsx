import { useState } from "react"

const C = {
  bg:"#ffffff",bg2:"#f0f5fb",bg3:"#e3ecf7",
  b:"rgba(21,101,192,.12)",b2:"rgba(21,101,192,.22)",
  tx:"#0d1f35",mu:"#5a7089",ac:"#1565c0",da:"#c62828",ok:"#2e7d32"
}

const AVROP = [
  {id:"1",best:"Trafikverket",proj:"Botniabanans förstärkning etapp 3",plats:"Härnösand–Kramfors",tider:"Mån–Fre 06:00–16:00",omf:"8 veckor · 15 man",uppg:"Rälsbyte, ballastarbeten, spårjustering",behov:"Söker erfaret team med termit-svetsare och bangubbar. Erfarenhet av Banverket-projekt ett krav.",verktyg:["Termit svetsset","Rälslyftar","Grävmaskin"],deadline:"2026-06-15"},
  {id:"2",best:"Jernhusen AB",proj:"Underhåll Stockholm Central",plats:"Stockholm C",tider:"Nattarbete 22:00–05:00",omf:"3 veckor · 6 man",uppg:"Växelunderhåll, spårinspektion",behov:"Nattjobb med nattillägg. Väljer helst lokala leverantörer med kort inställelsetid.",verktyg:["Svetsutrustning","Mätutrustning"],deadline:"2026-06-01"},
  {id:"3",best:"Region Norrbotten",proj:"Malmbanan etapp 7",plats:"Kiruna–Riksgränsen",tider:"Dag- och nattskift",omf:"12 veckor · 20 man",uppg:"Spårförstärkning, dränering, ballasttamping",behov:"Stort projekt med förlängningsmöjlighet. Söker stabil underleverantör med egen utrustning.",verktyg:["Grävmaskin","Hjullastare","Dumper","Kompressor"],deadline:"2026-07-01"},
]

const ANSTALLDA = [
  {id:"1",name:"Erik Lindqvist",roll:"Termit svetsare",tel:"070-111 22 33"},
  {id:"2",name:"Sara Johansson",roll:"Hudik förare",tel:"070-222 33 44"},
  {id:"3",name:"Marcus Berg",roll:"Bangubbar",tel:"070-333 44 55"},
  {id:"4",name:"Anna Nilsson",roll:"Maskinist",tel:"070-444 55 66"},
]

const ARBETEN = [
  {id:"1",plats:"Härnösand station",uppg:"Termitsvetsning spår 3",tid:"06:00–16:00",mat:"Termitpatroner x4, skyddshandskar",status:"pagaende"},
  {id:"2",plats:"Kramfors depot",uppg:"Rälsbyte nordvästra spåret",tid:"07:00–15:00",mat:"Räls 60E1, klammer x20",status:"kommande"},
  {id:"3",plats:"Sundsvall C",uppg:"Spårjustering perrong 2",tid:"06:00–14:00",mat:"Ballast 2t, stampar",status:"klar"},
]

const DAGORDER = {proj:"Botniabanan etapp 3",plats:"Härnösand station, spår 3",uppg:"Termitsvetsning av rälsskarv vid km 142+450",tid:"06:00–16:00 (lunch 10:00–10:30)",mat:"Termitpatroner x4, formar 60E1, tändare, propan",andringar:"Ny säkerhetszon gäller från idag — 25m istf 15m",coords:"62.6324,17.9395",datum:"2026-05-25"}

const INIT_AVVIKELSER = [
  {id:"1",text:"Sprickbildning i räls vid km 142+120, behöver åtgärdas inom 48h",av:"Marcus Berg",datum:"2026-05-24",status:"open"},
  {id:"2",text:"Saknad skyddsutrustning (hjälm) hos extern leverantör",av:"Erik Lindqvist",datum:"2026-05-25",status:"open"},
  {id:"3",text:"Vattenskada i förrådscontainer, material blött",av:"Sara Johansson",datum:"2026-05-22",status:"closed"},
]

const DEMO_USERS = {
  foretag:         {name:"Anna Bergström", role:"foretag",       company:"Lindqvist Rail AB"},
  arbetsledare:    {name:"Magnus Holm",    role:"arbetsledare",  company:"NordRail AB"},
  arbetare:        {name:"Marcus Berg",    role:"arbetare",      company:"NordRail AB"},
}

const DEFAULT_SCREEN = {foretag:"marketplace",arbetsledare:"dagorder",arbetare:"dagorder"}

// ── Styles ──────────────────────────────────────────────────
const card = {background:C.bg2,border:`1px solid ${C.b}`,borderRadius:14,padding:"16px 18px"}
const inp = {background:C.bg3,border:`1px solid ${C.b}`,borderRadius:8,color:C.tx,padding:"13px 15px",width:"100%",fontSize:15,outline:"none",fontFamily:"inherit"}
const btnP = {display:"flex",alignItems:"center",justifyContent:"center",gap:8,width:"100%",padding:"15px",borderRadius:8,fontSize:15,fontWeight:500,cursor:"pointer",border:"none",background:C.ac,color:"#ffffff",fontFamily:"inherit"}
const btnG = {display:"flex",alignItems:"center",justifyContent:"center",gap:8,width:"100%",padding:"14px",borderRadius:8,fontSize:15,cursor:"pointer",border:`1px solid ${C.b}`,background:"transparent",color:C.mu,fontFamily:"inherit"}
const lbl = {fontSize:13,color:C.mu,display:"block",marginBottom:6}
const hdr = {padding:"14px 20px 12px",display:"flex",alignItems:"center",gap:12,borderBottom:`1px solid ${C.b}`,background:C.bg,position:"sticky",top:0,zIndex:10}

// ── Badge ────────────────────────────────────────────────────
function Badge({status}) {
  const m={publicerad:["#1D9E75","rgba(29,158,117,.15)","Publicerad"],tillsatt:["#5b9cf6","rgba(91,156,246,.15)","Tillsatt"],pagaende:[C.ac,"rgba(232,184,75,.15)","Pågående"],kommande:[C.mu,"rgba(255,255,255,.08)","Kommande"],klar:["#1D9E75","rgba(29,158,117,.15)","Klar"],open:[C.da,"rgba(224,82,82,.15)","Öppen"],closed:[C.mu,"rgba(255,255,255,.08)","Stängd"]}
  const [col,bg,lbl] = m[status]||[C.mu,"rgba(255,255,255,.08)",status]
  return <span style={{fontSize:11,fontWeight:500,padding:"3px 9px",borderRadius:20,background:bg,color:col}}>{lbl}</span>
}

// ── Login ────────────────────────────────────────────────────
function LoginScreen({onLogin}) {
  const [cat, setCat] = useState(null)

  const Logo = () => (
    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:40}}>
      <div style={{width:36,height:36,background:C.ac,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,fontWeight:700,color:"#ffffff",lineHeight:1}}>R</div>
      <span style={{fontSize:22,fontWeight:600,letterSpacing:"-.3px"}}>Rallar</span>
    </div>
  )

  if (cat === "spar") {
    const roles = [
      {v:"arbetsledare", l:"Arbetsledare", d:"Full tillgång — dagorder, projektkoll, avvikelser"},
      {v:"arbetare",     l:"Arbetare",     d:"Dagorder, mina arbeten, rapportera avvikelser"},
    ]
    return (
      <div style={{padding:"52px 24px 40px",display:"flex",flexDirection:"column",minHeight:"100%"}}>
        <Logo/>
        <button onClick={()=>setCat(null)} style={{display:"flex",alignItems:"center",gap:6,background:"none",border:"none",cursor:"pointer",color:C.mu,fontSize:14,padding:0,marginBottom:20}}>← Tillbaka</button>
        <div style={{background:"#0d47a1",borderRadius:12,padding:"14px 18px",marginBottom:24}}>
          <div style={{fontSize:13,fontWeight:600,color:"#ffffff",marginBottom:2}}>Ute på spåret</div>
          <div style={{fontSize:12,color:"rgba(255,255,255,.75)"}}>Dagorder, avvikelser och projektöversikt</div>
        </div>
        <p style={{color:C.mu,fontSize:14,marginBottom:16}}>Vem är du?</p>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {roles.map(r => (
            <button key={r.v} onClick={() => onLogin(r.v)} style={{background:C.bg2,border:`1px solid ${C.b}`,borderRadius:12,padding:"16px 18px",textAlign:"left",cursor:"pointer",color:C.tx,transition:"border-color .15s"}}
              onMouseOver={e=>e.currentTarget.style.borderColor=C.ac}
              onMouseOut={e=>e.currentTarget.style.borderColor=C.b}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <div style={{fontWeight:500,fontSize:15}}>{r.l}</div>
                {r.v==="arbetsledare" && <span style={{fontSize:11,background:"rgba(21,101,192,.1)",color:C.ac,padding:"2px 8px",borderRadius:10,border:`1px solid ${C.b2}`}}>Full behörighet</span>}
              </div>
              <div style={{color:C.mu,fontSize:13,marginTop:3}}>{r.d}</div>
            </button>
          ))}
        </div>
        <div style={{marginTop:20,background:C.bg2,border:`1px solid ${C.b}`,borderRadius:10,padding:"12px 14px",fontSize:13,color:C.mu}}>
          🔒 Arbetsledarens funktioner är låsta för vanliga arbetare
        </div>
        <p style={{textAlign:"center",color:C.mu,fontSize:12,marginTop:"auto",paddingTop:40}}>Demo — ingen inloggning krävs</p>
      </div>
    )
  }

  return (
    <div style={{padding:"64px 24px 40px",display:"flex",flexDirection:"column",minHeight:"100%"}}>
      <Logo/>
      <h1 style={{fontSize:26,fontWeight:600,letterSpacing:"-.4px",marginBottom:8}}>Välkommen till Rallar</h1>
      <p style={{color:C.mu,fontSize:15,marginBottom:32}}>Välj din kategori för att fortsätta</p>
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        <button onClick={()=>onLogin("foretag")} style={{background:C.bg2,border:`1px solid ${C.b}`,borderRadius:14,padding:"22px 20px",textAlign:"left",cursor:"pointer",color:C.tx,transition:"all .15s"}}
          onMouseOver={e=>{e.currentTarget.style.borderColor=C.ac;e.currentTarget.style.background=C.bg3}}
          onMouseOut={e=>{e.currentTarget.style.borderColor=C.b;e.currentTarget.style.background=C.bg2}}>
          <div style={{fontSize:24,marginBottom:10}}>🏢</div>
          <div style={{fontWeight:600,fontSize:17,marginBottom:6}}>Företag & Beställare</div>
          <div style={{color:C.mu,fontSize:13,lineHeight:1.5}}>Beställare · Projektledare · Underleverantör</div>
          <div style={{marginTop:12,fontSize:12,color:C.ac,fontWeight:500}}>Marketplace · Avrop · Projekthantering →</div>
        </button>
        <button onClick={()=>setCat("spar")} style={{background:C.bg2,border:`1px solid ${C.b}`,borderRadius:14,padding:"22px 20px",textAlign:"left",cursor:"pointer",color:C.tx,transition:"all .15s"}}
          onMouseOver={e=>{e.currentTarget.style.borderColor=C.ac;e.currentTarget.style.background=C.bg3}}
          onMouseOut={e=>{e.currentTarget.style.borderColor=C.b;e.currentTarget.style.background=C.bg2}}>
          <div style={{fontSize:24,marginBottom:10}}>🚦</div>
          <div style={{fontWeight:600,fontSize:17,marginBottom:6}}>Ute på spåret</div>
          <div style={{color:C.mu,fontSize:13,lineHeight:1.5}}>Arbetsledare · Arbetare</div>
          <div style={{marginTop:12,fontSize:12,color:C.ac,fontWeight:500}}>Dagorder · Avvikelser · Projektkoll →</div>
        </button>
      </div>
      <p style={{textAlign:"center",color:C.mu,fontSize:12,marginTop:"auto",paddingTop:40}}>Demo — ingen inloggning krävs</p>
    </div>
  )
}

// ── Marketplace ──────────────────────────────────────────────
function Marketplace({navigate}) {
  return (
    <div>
      <div style={{padding:"20px 20px 0"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
          <h1 style={{fontSize:22,fontWeight:600,letterSpacing:"-.3px"}}>Marketplace</h1>
          <span style={{fontSize:11,fontWeight:500,padding:"3px 9px",borderRadius:20,color:C.ac,background:"rgba(232,184,75,.15)"}}>{AVROP.length} avrop</span>
        </div>
      </div>
      <div style={{padding:"0 20px",display:"flex",flexDirection:"column",gap:12}}>
        {AVROP.map(a => (
          <button key={a.id} onClick={() => navigate("avrop",a)} style={{...card,textAlign:"left",cursor:"pointer",width:"100%",transition:"border-color .15s"}}
            onMouseOver={e=>e.currentTarget.style.borderColor=C.b2}
            onMouseOut={e=>e.currentTarget.style.borderColor=C.b}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
              <span style={{fontSize:11,color:C.mu,fontWeight:500,letterSpacing:".5px"}}>{a.best.toUpperCase()}</span>
              <Badge status="publicerad"/>
            </div>
            <div style={{fontWeight:600,fontSize:16,marginBottom:6,letterSpacing:"-.2px"}}>{a.proj}</div>
            <div style={{color:C.mu,fontSize:13,marginBottom:10}}>📍 {a.plats}</div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {a.verktyg.slice(0,3).map(v => <span key={v} style={{fontSize:11,background:"rgba(255,255,255,.06)",color:C.mu,padding:"3px 8px",borderRadius:6}}>{v}</span>)}
            </div>
            <div style={{marginTop:12,display:"flex",justifyContent:"space-between"}}>
              <span style={{fontSize:12,color:C.mu}}>{a.tider}</span>
              <span style={{fontSize:12,color:C.da}}>Deadline {a.deadline}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

// ── Avrop detail ─────────────────────────────────────────────
function AvropDetail({avrop, navigate, role}) {
  const [ansokSent, setAnsokSent] = useState(false)
  const [showAnsok, setShowAnsok] = useState(false)
  const [selected, setSelected] = useState([])
  const [msg, setMsg] = useState("")

  if (ansokSent) return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:500,padding:"0 24px",textAlign:"center"}}>
      <div style={{fontSize:52,marginBottom:20}}>✅</div>
      <h2 style={{fontSize:22,fontWeight:600,marginBottom:8}}>Ansökan skickad!</h2>
      <p style={{color:C.mu,fontSize:15}}>Beställaren granskar och återkommer.</p>
      <button style={{...btnP,maxWidth:280,marginTop:32}} onClick={() => navigate("marketplace")}>Tillbaka till marketplace</button>
    </div>
  )

  if (showAnsok) return (
    <div>
      <div style={hdr}>
        <button onClick={() => setShowAnsok(false)} style={{background:"none",border:"none",cursor:"pointer",color:C.tx,fontSize:22,lineHeight:1}}>←</button>
        <div style={{fontWeight:600,fontSize:15}}>Ansök om avrop</div>
      </div>
      <div style={{padding:"20px",display:"flex",flexDirection:"column",gap:14}}>
        <div>
          <label style={lbl}>Meddelande till beställaren</label>
          <textarea style={{...inp,height:90,resize:"none"}} placeholder="Berätta om ert team..." value={msg} onChange={e=>setMsg(e.target.value)}/>
        </div>
        <div>
          <label style={lbl}>Anställda ni tar med</label>
          {ANSTALLDA.map(a => {
            const sel = selected.includes(a.id)
            return (
              <button key={a.id} onClick={() => setSelected(s => sel ? s.filter(x=>x!==a.id) : [...s,a.id])}
                style={{display:"flex",alignItems:"center",gap:12,width:"100%",background:sel?"rgba(232,184,75,.07)":C.bg2,border:`1px solid ${sel?C.ac:C.b}`,borderRadius:10,padding:"12px 14px",marginBottom:8,cursor:"pointer"}}>
                <div style={{width:20,height:20,borderRadius:4,border:`1.5px solid ${sel?C.ac:C.b2}`,background:sel?C.ac:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  {sel && <span style={{fontSize:11,color:"#ffffff",fontWeight:700}}>✓</span>}
                </div>
                <div style={{textAlign:"left"}}>
                  <div style={{fontSize:14,fontWeight:500,color:C.tx}}>{a.name}</div>
                  <div style={{fontSize:12,color:C.mu}}>{a.roll}</div>
                </div>
              </button>
            )
          })}
        </div>
        <button style={btnP} onClick={() => setAnsokSent(true)}>Skicka ansökan</button>
      </div>
    </div>
  )

  return (
    <div>
      <div style={hdr}>
        <button onClick={() => navigate("marketplace")} style={{background:"none",border:"none",cursor:"pointer",color:C.tx,fontSize:22,lineHeight:1}}>←</button>
        <div>
          <div style={{fontSize:11,color:C.mu}}>{avrop.best}</div>
          <div style={{fontWeight:600,fontSize:15,letterSpacing:"-.2px"}}>{avrop.proj}</div>
        </div>
      </div>
      <div style={{padding:"18px 20px",display:"flex",flexDirection:"column",gap:12}}>
        {[["Arbetsplats",avrop.plats],["Arbetstider",avrop.tider],["Omfattning",avrop.omf],["Arbetsuppgifter",avrop.uppg]].map(([l,v]) => (
          <div key={l} style={card}><div style={{fontSize:11,color:C.mu,marginBottom:4,textTransform:"uppercase",letterSpacing:".5px"}}>{l}</div><div style={{fontSize:14}}>{v}</div></div>
        ))}
        <div style={card}><div style={{fontSize:11,color:C.mu,marginBottom:8,textTransform:"uppercase",letterSpacing:".5px"}}>Vad vi söker</div><div style={{fontSize:14,lineHeight:1.6}}>{avrop.behov}</div></div>
        <div style={card}>
          <div style={{fontSize:11,color:C.mu,marginBottom:8,textTransform:"uppercase",letterSpacing:".5px"}}>Verktyg som krävs</div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {avrop.verktyg.map(v => <span key={v} style={{fontSize:13,background:"rgba(232,184,75,.12)",color:C.ac,padding:"5px 10px",borderRadius:8,border:"1px solid rgba(232,184,75,.2)"}}>{v}</span>)}
          </div>
        </div>
        <div style={{fontSize:13,color:C.da,textAlign:"center"}}>Deadline: {avrop.deadline}</div>
        {role === "projektledare" && <button style={btnP} onClick={() => setShowAnsok(true)}>Ansök på detta avrop</button>}
      </div>
    </div>
  )
}

// ── Skapa avrop ──────────────────────────────────────────────
function SkapaAvrop({navigate}) {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [published, setPublished] = useState(false)
  const [data, setData] = useState({proj:"",plats:"",tider:"",omf:"",uppg:"",behov:"",deadline:"",verktyg:[]})

  function runAI() {
    setLoading(true)
    setTimeout(() => {
      setData({proj:"Förstärkning bangård Sundsvall C",plats:"Sundsvall Central",tider:"Mån–Fre 06:00–16:00",omf:"6 veckor · 10 man",uppg:"Spårjustering, ballastrensning, skarvsvetsning",behov:"",deadline:"2026-06-20",verktyg:[]})
      setLoading(false)
      setStep(2)
    }, 2000)
  }

  function toggleVerktyg(v) {
    setData(d => ({...d, verktyg: d.verktyg.includes(v) ? d.verktyg.filter(x=>x!==v) : [...d.verktyg,v]}))
  }

  if (published) return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:500,padding:"0 24px",textAlign:"center"}}>
      <div style={{fontSize:52,marginBottom:20}}>🚀</div>
      <h2 style={{fontSize:22,fontWeight:600,marginBottom:8}}>Avrop publicerat!</h2>
      <p style={{color:C.mu,fontSize:15}}>Underleverantörer kan nu se och ansöka.</p>
      <button style={{...btnP,maxWidth:280,marginTop:32}} onClick={() => {setPublished(false);setStep(1);navigate("marketplace")}}>Visa i marketplace</button>
    </div>
  )

  return (
    <div>
      <div style={hdr}>
        <div style={{fontWeight:600,fontSize:16}}>Nytt avrop</div>
        <div style={{marginLeft:"auto",display:"flex",gap:6}}>
          {[1,2,3].map(n => <div key={n} style={{width:24,height:3,borderRadius:2,background:n<=step?C.ac:C.b}}/>)}
        </div>
      </div>
      {step===1 && (
        <div style={{padding:"32px 20px",display:"flex",flexDirection:"column",alignItems:"center",gap:16}}>
          <div style={{width:80,height:80,background:C.bg3,borderRadius:20,border:`2px dashed ${C.b2}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:32}}>📄</div>
          <div style={{textAlign:"center"}}>
            <h2 style={{fontSize:20,fontWeight:600,marginBottom:8}}>Ladda upp avropsbild</h2>
            <p style={{color:C.mu,fontSize:14}}>AI läser bilden och fyller i projektet automatiskt</p>
          </div>
          <button style={{...btnP,maxWidth:280}} onClick={runAI} disabled={loading}>
            {loading ? "AI läser bilden..." : "Simulera AI-läsning"}
          </button>
          <p style={{fontSize:12,color:C.mu}}>I produktionen: ta foto eller välj från galleri</p>
        </div>
      )}
      {step===2 && (
        <div style={{padding:"20px",display:"flex",flexDirection:"column",gap:12}}>
          <div style={{background:"rgba(46,125,50,.08)",border:"1px solid rgba(46,125,50,.25)",borderRadius:10,padding:"10px 14px",fontSize:13,color:C.ok}}>✓ AI fyllde i fälten — kontrollera och justera</div>
          {[["Projekt","proj"],["Arbetsplats","plats"],["Arbetstider","tider"],["Omfattning","omf"],["Arbetsuppgifter","uppg"]].map(([l,k]) => (
            <div key={k}><label style={lbl}>{l}</label><input style={inp} value={data[k]} onChange={e=>setData(d=>({...d,[k]:e.target.value}))}/></div>
          ))}
          <div><label style={lbl}>Deadline</label><input style={{...inp,colorScheme:"light"}} type="date" value={data.deadline} onChange={e=>setData(d=>({...d,deadline:e.target.value}))}/></div>
          <button style={btnP} onClick={() => setStep(3)}>Fortsätt</button>
        </div>
      )}
      {step===3 && (
        <div style={{padding:"20px",display:"flex",flexDirection:"column",gap:14}}>
          <div><label style={lbl}>Behovsbeskrivning</label><textarea style={{...inp,height:110,resize:"none"}} placeholder="Vad söker ni hos underleverantören?" value={data.behov} onChange={e=>setData(d=>({...d,behov:e.target.value}))}/></div>
          <div>
            <label style={lbl}>Verktyg som krävs</label>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {["Grävmaskin","Svetsutrustning","Termit svetsset","Rälslyftar","Lastbil","Mätutrustning","Dumper","Kompressor"].map(v => (
                <button key={v} onClick={() => toggleVerktyg(v)} style={{fontSize:13,padding:"6px 12px",borderRadius:8,border:`1px solid ${data.verktyg.includes(v)?C.ac:C.b}`,background:data.verktyg.includes(v)?"rgba(232,184,75,.12)":C.bg3,color:data.verktyg.includes(v)?C.ac:C.mu,cursor:"pointer"}}>{v}</button>
              ))}
            </div>
          </div>
          <button style={{...btnP,marginTop:8}} onClick={() => setPublished(true)}>Publicera avrop</button>
          <button style={btnG} onClick={() => setStep(2)}>Tillbaka</button>
        </div>
      )}
    </div>
  )
}

// ── Mina arbeten ─────────────────────────────────────────────
function MinaArbeten() {
  return (
    <div>
      <div style={{padding:"20px 20px 0"}}><h1 style={{fontSize:22,fontWeight:600,letterSpacing:"-.3px",marginBottom:18}}>Mina arbeten</h1></div>
      <div style={{padding:"0 20px",display:"flex",flexDirection:"column",gap:10}}>
        {ARBETEN.map(j => (
          <div key={j.id} style={card}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
              <div style={{fontWeight:600,fontSize:15,flex:1,paddingRight:10}}>{j.uppg}</div>
              <Badge status={j.status}/>
            </div>
            <div style={{color:C.mu,fontSize:13,marginBottom:5}}>📍 {j.plats}</div>
            <div style={{color:C.mu,fontSize:13,marginBottom:10}}>🕐 {j.tid}</div>
            <div style={{fontSize:12,color:C.mu,background:"rgba(255,255,255,.04)",padding:"8px 10px",borderRadius:6}}><span style={{color:C.tx}}>Material: </span>{j.mat}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Dagorder ─────────────────────────────────────────────────
function Dagorder() {
  const d = DAGORDER
  const [sedd, setSedd] = useState(false)
  return (
    <div>
      <div style={{padding:"20px 20px 0"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
          <h1 style={{fontSize:22,fontWeight:600,letterSpacing:"-.3px"}}>Dagorder</h1>
          <span style={{fontSize:12,color:C.mu}}>{d.datum}</span>
        </div>
        <div style={{fontSize:13,color:C.mu,marginBottom:16}}>{d.proj}</div>
      </div>
      {!sedd && (
        <div style={{margin:"0 20px 14px",background:"rgba(232,184,75,.1)",border:"1px solid rgba(232,184,75,.3)",borderRadius:12,padding:"14px 16px"}}>
          <div style={{fontSize:11,color:C.ac,fontWeight:600,marginBottom:4,textTransform:"uppercase",letterSpacing:".5px"}}>⚠ Ändring sedan igår</div>
          <div style={{fontSize:14}}>{d.andringar}</div>
          <button onClick={() => setSedd(true)} style={{fontSize:12,color:C.mu,marginTop:8,background:"none",border:"none",cursor:"pointer",padding:0}}>Markera som sedd ✓</button>
        </div>
      )}
      <div style={{padding:"0 20px",display:"flex",flexDirection:"column",gap:12}}>
        {[["Plats",d.plats],["Uppgift",d.uppg],["Arbetstid",d.tid],["Material",d.mat]].map(([l,v]) => (
          <div key={l} style={card}><div style={{fontSize:11,color:C.mu,marginBottom:4,textTransform:"uppercase",letterSpacing:".5px"}}>{l}</div><div style={{fontSize:14,lineHeight:1.6}}>{v}</div></div>
        ))}
        <div style={card}>
          <div style={{fontSize:11,color:C.mu,marginBottom:10,textTransform:"uppercase",letterSpacing:".5px"}}>Karta</div>
          <div style={{background:C.bg3,borderRadius:8,height:100,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:10}}>
            <div style={{textAlign:"center",color:C.mu,fontSize:13}}>📍 {d.coords}</div>
          </div>
          <a href={`https://www.google.com/maps?q=${d.coords}`} target="_blank" rel="noreferrer" style={{...btnP,textDecoration:"none",display:"flex"}}>📍 Öppna i Google Maps</a>
        </div>
      </div>
    </div>
  )
}

// ── Avvikelser ────────────────────────────────────────────────
function Avvikelser({role, user}) {
  const [avvikelser, setAvvikelser] = useState(INIT_AVVIKELSER)
  const [showForm, setShowForm] = useState(false)
  const [text, setText] = useState("")

  const open = avvikelser.filter(a=>a.status==="open")
  const closed = avvikelser.filter(a=>a.status==="closed")

  function stang(id) { setAvvikelser(prev => prev.map(a => a.id===id?{...a,status:"closed"}:a)) }

  function submit() {
    if(!text.trim()) return
    setAvvikelser(prev => [...prev,{id:String(Date.now()),text,av:user.name,datum:"2026-05-25",status:"open"}])
    setText("")
    setShowForm(false)
  }

  return (
    <div>
      <div style={{padding:"20px 20px 0"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
          <h1 style={{fontSize:22,fontWeight:600,letterSpacing:"-.3px"}}>Avvikelser</h1>
          <button onClick={() => setShowForm(!showForm)} style={{background:C.ac,border:"none",borderRadius:8,width:34,height:34,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:20,color:"#ffffff",lineHeight:1}}>+</button>
        </div>
        {showForm && (
          <div style={{...card,marginBottom:14}}>
            <label style={lbl}>Beskriv avvikelsen</label>
            <textarea style={{...inp,height:80,resize:"none",marginBottom:10}} placeholder="Vad hände? Var? Kostnad?" value={text} onChange={e=>setText(e.target.value)}/>
            <div style={{display:"flex",gap:8}}>
              <button style={{...btnP,flex:1}} onClick={submit}>Rapportera</button>
              <button style={{...btnG,flex:1}} onClick={() => setShowForm(false)}>Avbryt</button>
            </div>
          </div>
        )}
      </div>
      <div style={{padding:"0 20px",display:"flex",flexDirection:"column",gap:8}}>
        {open.length>0 && <div style={{fontSize:11,fontWeight:500,letterSpacing:".6px",color:C.mu,margin:"4px 0 6px"}}>ÖPPNA ({open.length})</div>}
        {open.map(a => (
          <div key={a.id} style={{...card,borderColor:"rgba(224,82,82,.22)"}}>
            <div style={{fontSize:14,lineHeight:1.6,marginBottom:10}}>{a.text}</div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontSize:12,color:C.mu}}>{a.av} · {a.datum}</span>
              {(role==="arbetsledare"||role==="projektledare") && <button onClick={()=>stang(a.id)} style={{fontSize:12,background:"rgba(46,125,50,.08)",border:"1px solid rgba(46,125,50,.25)",color:C.ok,padding:"4px 10px",borderRadius:6,cursor:"pointer"}}>Stäng avvik</button>}
            </div>
          </div>
        ))}
        {closed.length>0 && <div style={{fontSize:11,fontWeight:500,letterSpacing:".6px",color:C.mu,margin:"10px 0 6px"}}>STÄNGDA ({closed.length})</div>}
        {closed.map(a => (
          <div key={a.id} style={{...card,opacity:.6}}>
            <div style={{fontSize:14,lineHeight:1.5,marginBottom:6}}>{a.text}</div>
            <div style={{fontSize:12,color:C.mu}}>{a.av} · {a.datum}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Projektkoll ───────────────────────────────────────────────
function Projektkoll({navigate}) {
  const open = INIT_AVVIKELSER.filter(a=>a.status==="open")
  return (
    <div>
      <div style={{padding:"20px 20px 0"}}>
        <h1 style={{fontSize:22,fontWeight:600,letterSpacing:"-.3px",marginBottom:4}}>Projektkoll</h1>
        <div style={{fontSize:13,color:C.mu,marginBottom:18}}>Botniabanan etapp 3</div>
      </div>
      <div style={{padding:"0 20px",display:"flex",flexDirection:"column",gap:12}}>
        <div style={{display:"flex",gap:10}}>
          <button onClick={()=>navigate("dagorder")} style={{...card,flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:8,cursor:"pointer"}}>
            <span style={{fontSize:24}}>📋</span>
            <span style={{fontSize:13,fontWeight:500,color:C.tx}}>Skapa dagorder</span>
          </button>
          <button style={{...card,flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:8,cursor:"pointer"}}>
            <span style={{fontSize:24}}>🔔</span>
            <span style={{fontSize:13,fontWeight:500,color:C.tx}}>Lägg till ändring</span>
          </button>
        </div>
        <div style={card}>
          <div style={{fontSize:11,fontWeight:500,letterSpacing:".6px",color:C.mu,marginBottom:12}}>ÖPPNA AVVIKELSER ({open.length})</div>
          {open.map(a => (
            <div key={a.id} style={{display:"flex",gap:10,marginBottom:12,paddingBottom:12,borderBottom:`1px solid ${C.b}`}}>
              <div style={{width:8,height:8,borderRadius:"50%",background:C.da,flexShrink:0,marginTop:5}}/>
              <div><div style={{fontSize:13,lineHeight:1.5}}>{a.text}</div><div style={{fontSize:11,color:C.mu,marginTop:3}}>{a.av} · {a.datum}</div></div>
            </div>
          ))}
        </div>
        <div style={card}>
          <div style={{fontSize:11,fontWeight:500,letterSpacing:".6px",color:C.mu,marginBottom:12}}>VEM ÄR PÅ PROJEKTET</div>
          {ANSTALLDA.map(a => (
            <div key={a.id} style={{display:"flex",alignItems:"center",gap:12,marginBottom:10}}>
              <div style={{width:38,height:38,borderRadius:"50%",background:"rgba(232,184,75,.18)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:600,color:C.ac,flexShrink:0}}>{a.name.split(" ").map(n=>n[0]).join("")}</div>
              <div><div style={{fontSize:14,fontWeight:500}}>{a.name}</div><div style={{fontSize:12,color:C.mu}}>{a.roll}</div></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Profil ────────────────────────────────────────────────────
function Profil({user, onLogout}) {
  return (
    <div>
      <div style={{padding:"20px 20px 0"}}>
        <h1 style={{fontSize:22,fontWeight:600,letterSpacing:"-.3px",marginBottom:24}}>Profil</h1>
        <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:28}}>
          <div style={{width:60,height:60,borderRadius:"50%",background:"rgba(232,184,75,.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,fontWeight:600,color:C.ac}}>{user.name[0]}</div>
          <div><div style={{fontWeight:600,fontSize:18}}>{user.name}</div><div style={{fontSize:13,color:C.mu,marginTop:2}}>{user.company}</div></div>
        </div>
      </div>
      <div style={{padding:"0 20px",display:"flex",flexDirection:"column",gap:10}}>
        <div style={card}><div style={{fontSize:11,color:C.mu,marginBottom:4,textTransform:"uppercase",letterSpacing:".5px"}}>Roll</div><div style={{fontSize:15,textTransform:"capitalize"}}>{user.role}</div></div>
        <div style={card}><div style={{fontSize:11,color:C.mu,marginBottom:4,textTransform:"uppercase",letterSpacing:".5px"}}>Företag</div><div style={{fontSize:15}}>{user.company}</div></div>
        <button style={{...btnG,marginTop:8}} onClick={onLogout}>Logga ut</button>
      </div>
    </div>
  )
}

// ── Bottom Nav ─────────────────────────────────────────────────
function BottomNav({role, screen, navigate}) {
  const navMap = {
    foretag:       [{id:"marketplace",e:"🏠",l:"Marketplace"},{id:"skapa-avrop",e:"➕",l:"Nytt avrop"},{id:"mina-arbeten",e:"💼",l:"Mina jobb"},{id:"avvikelser",e:"⚠️",l:"Avvikelser"},{id:"profil",e:"👤",l:"Profil"}],
    arbetsledare:  [{id:"dagorder",e:"📋",l:"Dagorder"},{id:"projektkoll",e:"📊",l:"Projektkoll"},{id:"avvikelser",e:"⚠️",l:"Avvikelser"},{id:"profil",e:"👤",l:"Profil"}],
    arbetare:      [{id:"dagorder",e:"📋",l:"Dagorder"},{id:"mina-arbeten",e:"💼",l:"Arbeten"},{id:"avvikelser",e:"⚠️",l:"Avvikelser"},{id:"profil",e:"👤",l:"Profil"}],
  }
  const items = navMap[role] || navMap.arbetare
  const activeId = ["avrop","ansok"].includes(screen) ? "marketplace" : screen

  return (
    <div style={{display:"flex",background:C.bg2,borderTop:`1px solid ${C.b}`,padding:"8px 0 16px"}}>
      {items.map(item => {
        const active = item.id === activeId
        return (
          <button key={item.id} onClick={() => navigate(item.id)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3,background:"none",border:"none",cursor:"pointer",padding:"6px 0"}}>
            <span style={{fontSize:20,lineHeight:1,filter:active?"none":"grayscale(1) opacity(.5)"}}>{item.e}</span>
            <span style={{fontSize:10,color:active?C.ac:C.mu,fontWeight:active?500:400}}>{item.l}</span>
          </button>
        )
      })}
    </div>
  )
}

// ── App ────────────────────────────────────────────────────────
export default function RallarApp() {
  const [user, setUser] = useState(null)
  const [screen, setScreen] = useState("login")
  const [screenData, setScreenData] = useState(null)

  function login(role) {
    setUser(DEMO_USERS[role])
    setScreen(DEFAULT_SCREEN[role])
  }

  function navigate(to, data=null) {
    setScreen(to)
    if (data) setScreenData(data)
  }

  const appStyle = {
    background: C.bg,
    color: C.tx,
    fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif",
    fontSize: 16,
    maxWidth: 430,
    margin: "0 auto",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    WebkitFontSmoothing: "antialiased",
  }

  if (!user) return (
    <div style={appStyle}>
      <LoginScreen onLogin={login}/>
    </div>
  )

  const renderScreen = () => {
    switch(screen) {
      case "marketplace":  return <Marketplace navigate={navigate}/>
      case "avrop":        return <AvropDetail avrop={screenData||AVROP[0]} navigate={navigate} role={user.role}/>
      case "skapa-avrop":  return <SkapaAvrop navigate={navigate}/>
      case "mina-arbeten": return <MinaArbeten/>
      case "dagorder":     return <Dagorder/>
      case "avvikelser":   return <Avvikelser role={user.role} user={user}/>
      case "projektkoll":  return <Projektkoll navigate={navigate}/>
      case "profil":       return <Profil user={user} onLogout={() => {setUser(null);setScreen("login")}}/>
      default:             return <Marketplace navigate={navigate}/>
    }
  }

  return (
    <div style={appStyle}>
      <div style={{flex:1}}>{renderScreen()}</div>
      <BottomNav role={user.role} screen={screen} navigate={navigate}/>
    </div>
  )
}
