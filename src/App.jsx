import { useState, useEffect, useRef, createContext, useContext } from "react";

// ─── THEME CONTEXT ────────────────────────────────────────────────
const ThemeCtx = createContext(null);
const useTheme = () => useContext(ThemeCtx);

const lightColors = {
  bg:"#f5f5f7", surface:"rgba(255,255,255,0.85)", surfaceSolid:"#ffffff",
  border:"rgba(0,0,0,0.08)", text:"#1d1d1f", subtext:"#6e6e73",
  accent:"#0071e3", accentHover:"#0077ed", green:"#34c759",
  yellow:"#ff9f0a", red:"#ff3b30",
  dock:"rgba(255,255,255,0.72)", menubar:"rgba(245,245,247,0.88)",
  skeleton:"#e5e5ea", skeletonShine:"#f0f0f5", inputBg:"#f5f5f7",
};
const darkColors = {
  bg:"#1c1c1e", surface:"rgba(44,44,46,0.88)", surfaceSolid:"#2c2c2e",
  border:"rgba(255,255,255,0.09)", text:"#f5f5f7", subtext:"#aeaeb2",
  accent:"#0a84ff", accentHover:"#409cff", green:"#30d158",
  yellow:"#ffd60a", red:"#ff453a",
  dock:"rgba(44,44,46,0.88)", menubar:"rgba(28,28,30,0.92)",
  skeleton:"#3a3a3c", skeletonShine:"#48484a", inputBg:"#3a3a3c",
};

const font = "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif";

const getGlobalStyle = (dark, c) => `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
  body { background:${c.bg}; font-family:${font}; transition:background 0.3s ease; }
  ::-webkit-scrollbar { width:6px; }
  ::-webkit-scrollbar-track { background:transparent; }
  ::-webkit-scrollbar-thumb { background:rgba(128,128,128,0.25); border-radius:10px; }

  @keyframes fadeUp  { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
  @keyframes slideUp { from{opacity:0;transform:translateY(26px) scale(0.98)} to{opacity:1;transform:translateY(0) scale(1)} }
  @keyframes scaleIn { from{opacity:0;transform:scale(0.95)} to{opacity:1;transform:scale(1)} }
  @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:0.45} }
  @keyframes shimmer { 0%{background-position:-600px 0} 100%{background-position:600px 0} }

  .fadeUp   { animation:fadeUp   0.5s ease both; }
  .fadeIn   { animation:fadeIn   0.35s ease both; }
  .slideUp  { animation:slideUp  0.42s cubic-bezier(.22,.68,0,1.15) both; }
  .scaleIn  { animation:scaleIn  0.35s cubic-bezier(.22,.68,0,1.2) both; }
  .section-enter { animation:slideUp 0.42s cubic-bezier(.22,.68,0,1.15) both; }

  .dock-icon { transition:transform 0.2s cubic-bezier(.22,.68,0,1.2); cursor:pointer; }
  .dock-icon:hover { transform:scale(1.24) translateY(-7px) !important; }

  .card { transition:all 0.2s ease; cursor:pointer; }
  .card:hover { transform:translateY(-2px); box-shadow:0 10px 36px rgba(0,0,0,${dark?'0.28':'0.09'}); }

  .btn-primary { transition:all 0.15s ease; }
  .btn-primary:hover { filter:brightness(1.08); transform:scale(1.02); }

  .mini-app { transition:all 0.2s ease; cursor:pointer; }
  .mini-app:hover { box-shadow:0 4px 20px ${c.accent}18 !important; border-color:${c.accent}40 !important; }

  .nav-pill { transition:background 0.15s ease; border-radius:6px; cursor:pointer; }
  .nav-pill:hover { background:rgba(128,128,128,0.1) !important; }

  .blog-card { transition:all 0.2s ease; cursor:pointer; }
  .blog-card:hover { transform:translateY(-2px); box-shadow:0 8px 28px rgba(0,0,0,${dark?'0.22':'0.08'}); }

  .skeleton-line {
    background:linear-gradient(90deg, ${c.skeleton} 25%, ${c.skeletonShine} 50%, ${c.skeleton} 75%);
    background-size:600px 100%;
    animation:shimmer 1.5s ease infinite;
    border-radius:8px;
  }

  @media (max-width:768px) {
    .desktop-grid-6  { grid-template-columns:repeat(3,1fr) !important; gap:10px !important; }
    .desktop-grid-5  { grid-template-columns:repeat(3,1fr) !important; }
    .desktop-grid-3  { grid-template-columns:1fr 1fr !important; }
    .desktop-grid-skills { grid-template-columns:1fr 1fr !important; }
    .desktop-two-col { grid-template-columns:1fr !important; }
    .mini-apps-grid  { grid-template-columns:1fr !important; }
    .hero-title { font-size:34px !important; }
    .hero-sub   { font-size:16px !important; }
    .section-pad { padding:18px !important; }
    .hide-mobile { display:none !important; }
  }
  @media (max-width:480px) {
    .desktop-grid-6 { grid-template-columns:repeat(3,1fr) !important; gap:8px !important; }
    .desktop-grid-5 { grid-template-columns:repeat(2,1fr) !important; gap:10px !important; }
    .desktop-grid-3 { grid-template-columns:1fr !important; }
    .hero-title { font-size:28px !important; }
    .stats-bar  { gap:14px !important; flex-wrap:wrap !important; }
  }
`;

// ─── SKELETON ────────────────────────────────────────────────────
const SkeletonSection = () => {
  const { colors } = useTheme();
  return (
    <div style={{ background:colors.surfaceSolid, borderRadius:18, padding:32, border:`1px solid ${colors.border}`, boxShadow:"0 4px 24px rgba(0,0,0,0.06)" }}>
      <div style={{ display:"flex", gap:6, marginBottom:24 }}>
        {["#ff3b30","#ff9f0a","#34c759"].map(c=><div key={c} style={{ width:12,height:12,borderRadius:"50%",background:c }}/>)}
      </div>
      <div className="skeleton-line" style={{ height:28, width:"40%", marginBottom:12 }}/>
      <div className="skeleton-line" style={{ height:15, width:"65%", marginBottom:8 }}/>
      <div className="skeleton-line" style={{ height:15, width:"50%", marginBottom:32 }}/>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }}>
        {[0,1,2,3,4,5].map(i=>(
          <div key={i} style={{ borderRadius:14, padding:16, border:`1px solid ${colors.border}`, background:colors.bg }}>
            <div className="skeleton-line" style={{ height:80, marginBottom:12 }}/>
            <div className="skeleton-line" style={{ height:14, width:"80%", marginBottom:8 }}/>
            <div className="skeleton-line" style={{ height:12, width:"60%" }}/>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── SHARED COMPONENTS ────────────────────────────────────────────
const Tag = ({ label, color }) => {
  const { colors } = useTheme();
  const c = color || colors.accent;
  return <span style={{ display:"inline-block", padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:500, background:`${c}16`, color:c, letterSpacing:"0.02em" }}>{label}</span>;
};

const WindowDots = () => (
  <div style={{ display:"flex", gap:6, marginBottom:20 }}>
    {["#ff3b30","#ff9f0a","#34c759"].map(c=><div key={c} style={{ width:12,height:12,borderRadius:"50%",background:c }}/>)}
  </div>
);

const SectionShell = ({ children, style={} }) => {
  const { colors } = useTheme();
  return (
    <div className="scaleIn section-pad" style={{ background:colors.surfaceSolid, borderRadius:18, padding:32, border:`1px solid ${colors.border}`, boxShadow:"0 4px 24px rgba(0,0,0,0.06)", ...style }}>
      <WindowDots/>{children}
    </div>
  );
};

// ─── HOME ─────────────────────────────────────────────────────────
const HomeSection = ({ onNav }) => {
  const { colors } = useTheme();
  const cards = [
    {id:"about",    icon:"◉", label:"About Me",  color:"#0071e3", desc:"Who I am & what I do"},
    {id:"projects", icon:"⬡", label:"Projects",  color:"#34c759", desc:"Things I've shipped"},
    {id:"miniapps", icon:"✦", label:"Mini Apps", color:"#ff9f0a", desc:"Games, tools & AI"},
    {id:"resume",   icon:"▤", label:"Résumé",    color:"#ff3b30", desc:"Experience & skills"},
    {id:"blog",     icon:"📝", label:"Build Log", color:"#0071e3", desc:"Thoughts & updates"},
    {id:"contact",  icon:"◎", label:"Contact",   color:"#bf5af2", desc:"Let's work together"},
  ];
  return (
    <div style={{ maxWidth:900, margin:"0 auto" }}>
      <div className="fadeUp" style={{ textAlign:"center", padding:"40px 0 36px" }}>
        <div style={{ width:96,height:96,borderRadius:"50%",margin:"0 auto 24px",overflow:"hidden", boxShadow:`0 0 0 3px ${colors.surfaceSolid}, 0 0 0 5px ${colors.accent}40, 0 12px 40px rgba(0,0,0,0.18)` }}>
          <img src="/profile.png" alt="Dheeraj Yampati" style={{ width:"100%",height:"100%",objectFit:"cover",objectPosition:"center top" }}/>
        </div>
        <h1 className="hero-title" style={{ fontSize:52,fontWeight:700,color:colors.text,letterSpacing:"-0.03em",lineHeight:1.1 }}>Dheeraj Yampati</h1>
        <p className="hero-sub" style={{ fontSize:20,color:colors.subtext,marginTop:10,fontWeight:400 }}>Software Engineer · AI/ML · Cloud · Full-Stack</p>
        <div style={{ display:"flex",gap:8,justifyContent:"center",marginTop:16,flexWrap:"wrap" }}>
          {["Python","C/C++","Java","SQL","JavaScript"].map(t=><Tag key={t} label={t}/>)}
        </div>
        <div style={{ display:"flex",gap:12,justifyContent:"center",marginTop:28 }}>
          <button className="btn-primary" onClick={()=>onNav("projects")} style={{ background:colors.accent,color:"#fff",border:"none",padding:"12px 28px",borderRadius:980,fontSize:15,fontWeight:500 }}>View Projects</button>
          <button onClick={()=>onNav("contact")} style={{ background:"transparent",color:colors.text,border:`1px solid ${colors.border}`,padding:"12px 28px",borderRadius:980,fontSize:15,fontWeight:500 }}>Contact Me</button>
        </div>
      </div>
      <div className="desktop-grid-6" style={{ display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:12,animation:"fadeUp 0.5s 0.15s ease both",opacity:0,animationFillMode:"forwards" }}>
        {cards.map((c,i)=>(
          <div key={c.id} className="card" onClick={()=>onNav(c.id)} style={{ background:colors.surfaceSolid,borderRadius:16,border:`1px solid ${colors.border}`,padding:"20px 16px",textAlign:"center",boxShadow:"0 2px 12px rgba(0,0,0,0.05)" }}>
            <div style={{ width:48,height:48,borderRadius:14,background:`${c.color}15`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px",fontSize:22,color:c.color }}>{c.icon}</div>
            <div style={{ fontWeight:600,fontSize:13,color:colors.text }}>{c.label}</div>
            <div style={{ fontSize:11,color:colors.subtext,marginTop:4 }}>{c.desc}</div>
          </div>
        ))}
      </div>
      <HomeBlogPreview onNav={onNav}/>
    </div>
  );
};

// ─── ABOUT ────────────────────────────────────────────────────────
const AboutSection = () => {
  const { colors } = useTheme();
  return (
    <SectionShell>
      <div className="desktop-two-col" style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:40,maxWidth:860,margin:"0 auto" }}>
        <div>
          <p style={{ fontSize:12,fontWeight:600,color:colors.accent,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:8 }}>About Me</p>
          <h2 style={{ fontSize:36,fontWeight:700,color:colors.text,letterSpacing:"-0.025em",lineHeight:1.15 }}>Building things<br/>that matter.</h2>
          <p style={{ marginTop:16,fontSize:15,color:colors.subtext,lineHeight:1.7 }}>I'm a CS grad from George Mason University with a passion for building full-stack products and AI-powered systems. I love turning complex problems into clean, working software — from RAG pipelines to real-time web apps.</p>
          <p style={{ marginTop:12,fontSize:15,color:colors.subtext,lineHeight:1.7 }}>I love going deep — whether it's designing a database schema, building a RAG pipeline, or shipping a full-stack app from scratch. I pick things up fast and care about writing software that actually works in production.</p>
          <div style={{ marginTop:24,display:"flex",gap:8,flexWrap:"wrap" }}>
            {["Java","Python","React/Next.js","FastAPI","Spring Boot","AWS","RAG / LLMs","MySQL"].map(s=><Tag key={s} label={s}/>)}
          </div>

          {/* Personal facts */}
          <div style={{ marginTop:28 }}>
            <p style={{ fontSize:12,fontWeight:600,color:colors.subtext,letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:12 }}>Outside of work</p>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10 }}>
              {[
                {icon:"🏉", label:"Rugby",   sub:"Competitive team sport"},
                {icon:"🎸", label:"Music",   sub:"Guitar & discovering new sounds"},
                {icon:"✈️", label:"Travel",  sub:"Always planning the next trip"},
                {icon:"🛠️", label:"Builder", sub:"Always tinkering on side projects"},
              ].map(f=>(
                <div key={f.label} style={{ display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:10,background:colors.bg,border:`1px solid ${colors.border}` }}>
                  <span style={{ fontSize:18 }}>{f.icon}</span>
                  <div>
                    <div style={{ fontSize:12,fontWeight:600,color:colors.text }}>{f.label}</div>
                    <div style={{ fontSize:11,color:colors.subtext }}>{f.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display:"flex",flexDirection:"column",gap:14 }}>
          {[
            {icon:"🎓",title:"Education",    sub:"B.S. Computer Science · George Mason University · Dec 2025"},
            {icon:"💼",title:"Current Role", sub:"Software Engineering Intern @ ELINT PRO"},
            {icon:"📍",title:"Location",     sub:"Fairfax, VA · Open to Remote"},
            {icon:"📧",title:"Contact",      sub:"dheerajyampati@gmail.com"},
          ].map(item=>(
            <div key={item.title} style={{ display:"flex",alignItems:"center",gap:14,padding:"14px 18px",borderRadius:12,background:colors.bg,border:`1px solid ${colors.border}` }}>
              <span style={{ fontSize:22 }}>{item.icon}</span>
              <div>
                <div style={{ fontSize:13,fontWeight:600,color:colors.text }}>{item.title}</div>
                <div style={{ fontSize:12,color:colors.subtext }}>{item.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionShell>
  );
};

// ─── PROJECTS ─────────────────────────────────────────────────────
const ProjectsSection = () => {
  const { colors } = useTheme();
  const [expanded, setExpanded] = useState(null);
  const GH = "https://github.com/Dheeraj-Rex";

  const projects = [
    {
      title:"Portfolio OS", icon:"🖥️", color:"#ff6b35",
      tags:["React","Canvas API","AI","Design"],
      builtAt: null,
      github: GH,
      desc:"My personal portfolio, designed to be an experience — not just a page.",
      detail:"I built this because I wanted my portfolio to show what I can build, not just describe it. It's a macOS-inspired personal OS with a real dock, menu bar, dark mode, and embedded live demos of projects I've shipped. The goal was to make something unique that any recruiter or engineer would remember after visiting."
    },
    {
      title:"Microsoft ChatBot App", icon:"🤖", color:"#0071e3",
      tags:["FastAPI","RAG","MS Graph","LLMs"],
      builtAt:"@ VSoft Consulting",
      github: null,
      desc:"Natural language search across Outlook & OneDrive using RAG.",
      detail:"Built during my ML internship at VSoft. The app connects to Outlook and OneDrive via Microsoft Graph API and lets users search emails and documents using natural language. Powered by a RAG pipeline with Weaviate, bge-m3 embeddings, and Llama 3/Mistral for context-aware answer generation."
    },
    {
      title:"TaskFlow", icon:"✅", color:"#34c759",
      tags:["React","FastAPI","PostgreSQL","AWS"],
      builtAt: null,
      github: null,
      desc:"Full-stack team task manager with real-time WebSocket updates.",
      detail:"A full-stack team productivity app with real-time task updates via WebSockets, JWT authentication, and a clean React frontend. Backend runs on FastAPI with PostgreSQL, containerized with Docker and deployed to AWS. Built to handle collaborative workflows without page refreshes."
    },
    {
      title:"Immigration Processing System", icon:"🏛️", color:"#ff9f0a",
      tags:["JavaFX","MySQL","MVC","Spring"],
      builtAt:"@ George Mason University",
      github: GH,
      desc:"Desktop app for managing immigration petition workflows end to end.",
      detail:"A desktop application built to manage immigration petition workflows as a semester-long software engineering project at GMU. Features role-based approver dashboards, a clean DAO data layer, and MVC architecture using JavaFX and MySQL — built in sprints with a full team."
    },
    {
      title:"AWS Data Pipelines", icon:"☁️", color:"#bf5af2",
      tags:["AWS","ETL","QuickSight","Athena"],
      builtAt:"@ VSoft Consulting",
      github: null,
      desc:"ETL pipelines on AWS transforming client datasets into live dashboards.",
      detail:"Built ETL pipelines using S3, Glue, and Athena to process and transform client datasets, connected to QuickSight dashboards for visual reporting and analysis. Part of a larger data infrastructure project at VSoft — designed to run on a schedule and handle variable-format input files."
    },
    {
      title:"HRMS Modules", icon:"🏢", color:"#ff3b30",
      tags:["Spring Boot","MySQL","JWT","REST"],
      builtAt:"@ ELINT PRO",
      github: null,
      desc:"Production HR modules for onboarding, payroll, and leave tracking.",
      detail:"Enterprise HR modules covering onboarding, payroll automation, and leave tracking — currently in production at ELINT PRO. Built with Java Spring Boot and MySQL, with secure REST APIs using JWT role-based access control. Optimized SQL queries and added lightweight caching to reduce response times."
    },
  ];

  return (
    <SectionShell>
      <div style={{ maxWidth:900, margin:"0 auto" }}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:28 }}>
          <div>
            <p style={{ fontSize:12,fontWeight:600,color:colors.accent,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:6 }}>My Work</p>
            <h2 style={{ fontSize:32,fontWeight:700,color:colors.text,letterSpacing:"-0.025em" }}>Projects</h2>
          </div>
          <a href={GH} target="_blank" rel="noopener noreferrer" style={{ fontSize:13,color:colors.accent,textDecoration:"none",fontWeight:500 }}>View GitHub →</a>
        </div>
        <div className="desktop-grid-3" style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16 }}>
          {projects.map((p,i)=>{
            const isOpen = expanded === i;
            return (
              <div key={i} style={{ display:"flex", flexDirection:"column" }}>
                <div className="card" onClick={()=>setExpanded(isOpen ? null : i)}
                  style={{ borderRadius:16,padding:20,border:`1px solid ${isOpen ? p.color+"50" : colors.border}`,background: isOpen ? `${p.color}06` : colors.surfaceSolid,boxShadow:"0 2px 12px rgba(0,0,0,0.04)",display:"flex",flexDirection:"column",flex:1 }}>
                  <div style={{ height:80,borderRadius:10,marginBottom:14,background:`linear-gradient(135deg,${p.color}18,${p.color}06)`,border:`1px solid ${p.color}20`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:32 }}>{p.icon}</div>
                  <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6,gap:6 }}>
                    <h3 style={{ fontSize:13,fontWeight:600,color:colors.text,flex:1 }}>{p.title}</h3>
                    <div style={{ fontSize:18,color:colors.subtext,transition:"transform 0.2s ease",transform:isOpen?"rotate(90deg)":"rotate(0deg)",flexShrink:0 }}>›</div>
                  </div>
                  {p.builtAt && (
                    <div style={{ fontSize:11,fontWeight:500,color:p.color,marginBottom:6 }}>{p.builtAt}</div>
                  )}
                  <p style={{ fontSize:12,color:colors.subtext,lineHeight:1.6,marginBottom:12,flex:1 }}>{p.desc}</p>
                  <div style={{ display:"flex",gap:4,flexWrap:"wrap",marginBottom: p.github ? 12 : 0 }}>
                    {p.tags.map(t=><Tag key={t} label={t} color={p.color}/>)}
                  </div>
                  {p.github && (
                    <a href={p.github} target="_blank" rel="noopener noreferrer"
                      onClick={e=>e.stopPropagation()}
                      style={{ marginTop:12,display:"flex",alignItems:"center",justifyContent:"center",gap:6,padding:"8px 0",borderRadius:10,border:`1px solid ${colors.border}`,background:colors.bg,color:colors.subtext,textDecoration:"none",fontSize:12,fontWeight:500,transition:"all 0.15s ease" }}
                      onMouseEnter={e=>{e.currentTarget.style.borderColor=p.color;e.currentTarget.style.color=p.color;e.currentTarget.style.background=`${p.color}08`;}}
                      onMouseLeave={e=>{e.currentTarget.style.borderColor=colors.border;e.currentTarget.style.color=colors.subtext;e.currentTarget.style.background=colors.bg;}}>
                      ⌥ View on GitHub
                    </a>
                  )}
                </div>
                {/* Expanded detail */}
                {isOpen && (
                  <div className="slideUp" style={{ marginTop:6,borderRadius:14,padding:"18px 20px",background:colors.bg,border:`1px solid ${p.color}30` }}>
                    <p style={{ fontSize:13,color:colors.text,lineHeight:1.75 }}>{p.detail}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </SectionShell>
  );
};

// ─── SNAKE ────────────────────────────────────────────────────────
const CELL=20, COLS=18, ROWS=16, SW=CELL*COLS, SH=CELL*ROWS;
const initSnake=()=>[{x:8,y:8},{x:7,y:8},{x:6,y:8}];
const randomFood=snake=>{ let p; do{p={x:Math.floor(Math.random()*COLS),y:Math.floor(Math.random()*ROWS)}}while(snake.some(s=>s.x===p.x&&s.y===p.y)); return p; };

const SnakeGame=()=>{
  const cvs=useRef(null), st=useRef({snake:initSnake(),dir:{x:1,y:0},nextDir:{x:1,y:0},food:{x:14,y:8},score:0,phase:"idle",hi:0,particles:[],flash:0}), raf=useRef(null), lastTick=useRef(0);
  const [disp,setDisp]=useState({score:0,hi:0,phase:"idle"});
  const speed=()=>{const s=st.current.score;return s>=20?90:s>=10?110:140;};
  const rr=(ctx,x,y,w,h,r)=>{ctx.beginPath();ctx.moveTo(x+r,y);ctx.lineTo(x+w-r,y);ctx.arcTo(x+w,y,x+w,y+r,r);ctx.lineTo(x+w,y+h-r);ctx.arcTo(x+w,y+h,x+w-r,y+h,r);ctx.lineTo(x+r,y+h);ctx.arcTo(x,y+h,x,y+h-r,r);ctx.lineTo(x,y+r);ctx.arcTo(x,y,x+r,y,r);ctx.closePath();};

  const draw=ts=>{
    const c=cvs.current;if(!c)return;const ctx=c.getContext("2d"),s=st.current;
    if(s.phase==="running"&&ts-lastTick.current>speed()){lastTick.current=ts;tick();}
    s.particles=s.particles.map(p=>({...p,x:p.x+p.vx,y:p.y+p.vy,life:p.life-1,vy:p.vy+0.1})).filter(p=>p.life>0);
    s.flash=Math.max(0,s.flash-1);
    ctx.fillStyle="#1a1a1a";ctx.fillRect(0,0,SW,SH);
    ctx.strokeStyle="rgba(255,255,255,0.03)";ctx.lineWidth=0.5;
    for(let x=0;x<=COLS;x++){ctx.beginPath();ctx.moveTo(x*CELL,0);ctx.lineTo(x*CELL,SH);ctx.stroke();}
    for(let y=0;y<=ROWS;y++){ctx.beginPath();ctx.moveTo(0,y*CELL);ctx.lineTo(SW,y*CELL);ctx.stroke();}
    const fx=s.food.x*CELL+CELL/2,fy=s.food.y*CELL+CELL/2,pulse=0.5+0.5*Math.sin(ts/300);
    const grd=ctx.createRadialGradient(fx,fy,0,fx,fy,CELL*1.4);grd.addColorStop(0,`rgba(255,59,48,${0.35+0.15*pulse})`);grd.addColorStop(1,"rgba(255,59,48,0)");ctx.fillStyle=grd;ctx.beginPath();ctx.arc(fx,fy,CELL*1.4,0,Math.PI*2);ctx.fill();
    const fs=s.flash>0?1+0.3*(s.flash/10):1;ctx.save();ctx.translate(fx,fy);ctx.scale(fs,fs);ctx.fillStyle="#ff3b30";ctx.shadowColor="#ff3b30";ctx.shadowBlur=12;rr(ctx,-CELL/2+3,-CELL/2+3,CELL-6,CELL-6,5);ctx.fill();ctx.restore();ctx.shadowBlur=0;
    s.snake.forEach((seg,i)=>{const t=i/s.snake.length,a=1-t*0.4;ctx.fillStyle=i===0?`rgba(52,199,89,${a})`:`rgba(52,199,89,${a*0.85})`;ctx.shadowColor=i===0?"rgba(52,199,89,0.6)":"transparent";ctx.shadowBlur=i===0?16:0;rr(ctx,seg.x*CELL+2,seg.y*CELL+2,CELL-4,CELL-4,i===0?7:5);ctx.fill();ctx.shadowBlur=0;});
    if(s.snake.length>0&&s.phase!=="dead"){const h=s.snake[0],d=s.dir,cx=h.x*CELL+CELL/2,cy=h.y*CELL+CELL/2,px=-d.y,py=d.x;[1,-1].forEach(side=>{const ex=cx+d.x*4+px*3*side,ey=cy+d.y*4+py*3*side;ctx.fillStyle="#fff";ctx.beginPath();ctx.arc(ex,ey,2.2,0,Math.PI*2);ctx.fill();ctx.fillStyle="#1a1a1a";ctx.beginPath();ctx.arc(ex+d.x*0.8,ey+d.y*0.8,1.2,0,Math.PI*2);ctx.fill();});}
    s.particles.forEach(p=>{ctx.globalAlpha=p.life/20;ctx.fillStyle=p.color;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();});ctx.globalAlpha=1;
    if(s.phase==="idle")ovl(ctx,"🐍  SNAKE","Press Space or tap Play","#34c759");
    else if(s.phase==="dead")ovl(ctx,`Score: ${s.score}`,s.score>=s.hi&&s.score>0?"🏆 New High Score!":`Best: ${s.hi} — Tap to Restart`,"#ff3b30");
    raf.current=requestAnimationFrame(draw);
  };
  const ovl=(ctx,t,sub,acc)=>{ctx.fillStyle="rgba(0,0,0,0.65)";ctx.fillRect(0,0,SW,SH);ctx.fillStyle=acc;ctx.font="bold 22px -apple-system";ctx.textAlign="center";ctx.shadowColor=acc;ctx.shadowBlur=20;ctx.fillText(t,SW/2,SH/2-12);ctx.shadowBlur=0;ctx.fillStyle="rgba(255,255,255,0.6)";ctx.font="13px -apple-system";ctx.fillText(sub,SW/2,SH/2+14);ctx.textAlign="left";};
  const tick=()=>{const s=st.current;s.dir=s.nextDir;const head={x:s.snake[0].x+s.dir.x,y:s.snake[0].y+s.dir.y};if(head.x<0||head.x>=COLS||head.y<0||head.y>=ROWS||s.snake.some(seg=>seg.x===head.x&&seg.y===head.y)){if(s.score>s.hi)s.hi=s.score;s.phase="dead";setDisp({score:s.score,hi:s.hi,phase:"dead"});return;}const ate=head.x===s.food.x&&head.y===s.food.y;s.snake=[head,...s.snake];if(!ate)s.snake.pop();if(ate){s.score+=1;s.flash=10;s.particles.push(...Array.from({length:14},()=>({x:s.food.x*CELL+CELL/2,y:s.food.y*CELL+CELL/2,vx:(Math.random()-0.5)*4,vy:(Math.random()-0.5)*4,r:Math.random()*3+1.5,life:20,color:["#ff3b30","#ff6b6b","#ffcc00"][Math.floor(Math.random()*3)]})));s.food=randomFood(s.snake);setDisp(d=>({...d,score:s.score}));}};
  const start=()=>{const hi=st.current.hi;st.current={snake:initSnake(),dir:{x:1,y:0},nextDir:{x:1,y:0},food:{x:14,y:8},score:0,phase:"running",hi,particles:[],flash:0};lastTick.current=0;setDisp({score:0,hi,phase:"running"});};
  const handleKey=e=>{const s=st.current;if(s.phase!=="running"){if(e.key===" ")start();return;}const m={ArrowUp:{x:0,y:-1},ArrowDown:{x:0,y:1},ArrowLeft:{x:-1,y:0},ArrowRight:{x:1,y:0},w:{x:0,y:-1},s:{x:0,y:1},a:{x:-1,y:0},d:{x:1,y:0}};const nd=m[e.key];if(nd&&!(nd.x===-s.dir.x&&nd.y===-s.dir.y)){s.nextDir=nd;e.preventDefault();}};
  useEffect(()=>{raf.current=requestAnimationFrame(draw);window.addEventListener("keydown",handleKey);return()=>{cancelAnimationFrame(raf.current);window.removeEventListener("keydown",handleKey);};},[]);
  const press=dir=>{const s=st.current;if(s.phase!=="running")return;if(!(dir.x===-s.dir.x&&dir.y===-s.dir.y))s.nextDir=dir;};
  const bs={width:44,height:44,borderRadius:10,border:"none",background:"rgba(255,255,255,0.1)",color:"#fff",fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",userSelect:"none"};
  return(
    <div style={{background:"#1a1a1a",borderRadius:14,overflow:"hidden"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 16px",background:"rgba(0,0,0,0.4)"}}>
        <div style={{display:"flex",gap:20}}>{[["Score",disp.score,"#34c759"],["Best",disp.hi,"rgba(255,255,255,0.5)"]].map(([l,v,c])=><div key={l} style={{textAlign:"center"}}><div style={{fontSize:10,color:"rgba(255,255,255,0.4)",letterSpacing:"0.08em",textTransform:"uppercase"}}>{l}</div><div style={{fontSize:22,fontWeight:700,color:c,letterSpacing:"-0.03em"}}>{v}</div></div>)}</div>
        <button onPointerDown={start} style={{padding:"7px 18px",borderRadius:980,border:"none",background:disp.phase==="running"?"rgba(255,59,48,0.2)":"#34c759",color:disp.phase==="running"?"#ff3b30":"#fff",fontSize:12,fontWeight:600,cursor:"pointer"}}>{disp.phase==="running"?"Restart":disp.phase==="dead"?"Play Again":"Play"}</button>
      </div>
      <div style={{lineHeight:0}}><canvas ref={cvs} width={SW} height={SH} style={{display:"block",width:"100%",maxWidth:SW}}/></div>
      <div style={{display:"flex",justifyContent:"center",padding:"12px 0 14px",background:"rgba(0,0,0,0.3)"}}>
        <div style={{display:"grid",gridTemplateColumns:"44px 44px 44px",gridTemplateRows:"44px 44px 44px",gap:4}}>
          <div/><button style={bs} onPointerDown={()=>press({x:0,y:-1})}>▲</button><div/>
          <button style={bs} onPointerDown={()=>press({x:-1,y:0})}>◀</button><div style={{...bs,background:"rgba(255,255,255,0.04)",color:"rgba(255,255,255,0.2)",fontSize:10,cursor:"default"}}>D</div><button style={bs} onPointerDown={()=>press({x:1,y:0})}>▶</button>
          <div/><button style={bs} onPointerDown={()=>press({x:0,y:1})}>▼</button><div/>
        </div>
      </div>
    </div>
  );
};

// ─── BREAKOUT ─────────────────────────────────────────────────────
const BW=360,BH=400,BR=5,BC=9,BRKW=34,BRKH=14,BRKP=4,PW=70,PH=10,BALLR=7;
const BCOLORS=["#ff3b30","#ff9f0a","#ffd60a","#34c759","#0a84ff"];

const BreakoutGame=()=>{
  const cvs=useRef(null),game=useRef(null),raf=useRef(null);
  const [disp,setDisp]=useState({score:0,lives:3,phase:"idle"});
  const mkGame=()=>({ball:{x:BW/2,y:BH-80,vx:2.8,vy:-3.2},paddle:{x:BW/2-PW/2,y:BH-30},bricks:Array.from({length:BR},(_,r)=>Array.from({length:BC},(_,c)=>({alive:true,x:c*(BRKW+BRKP)+22,y:r*(BRKH+BRKP)+50,color:BCOLORS[r]}))).flat(),score:0,lives:3,phase:"idle",particles:[]});
  useEffect(()=>{game.current=mkGame();},[]);

  const draw=()=>{
    const c=cvs.current;if(!c)return;const ctx=c.getContext("2d"),g=game.current;if(!g)return;
    if(g.phase==="running"){
      const b=g.ball,pad=g.paddle;b.x+=b.vx;b.y+=b.vy;
      if(b.x-BALLR<0){b.x=BALLR;b.vx*=-1;}if(b.x+BALLR>BW){b.x=BW-BALLR;b.vx*=-1;}if(b.y-BALLR<0){b.y=BALLR;b.vy*=-1;}
      if(b.y+BALLR>BH){g.lives-=1;if(g.lives<=0){g.phase="dead";setDisp(d=>({...d,lives:0,phase:"dead"}))}else{b.x=BW/2;b.y=BH-80;b.vx=2.8;b.vy=-3.2;setDisp(d=>({...d,lives:g.lives}));}}
      if(b.y+BALLR>=pad.y&&b.y-BALLR<=pad.y+PH&&b.x>=pad.x&&b.x<=pad.x+PW){b.vy=-Math.abs(b.vy);b.vx=((b.x-(pad.x+PW/2))/(PW/2))*4.5;}
      g.bricks.forEach(br=>{if(!br.alive)return;if(b.x+BALLR>br.x&&b.x-BALLR<br.x+BRKW&&b.y+BALLR>br.y&&b.y-BALLR<br.y+BRKH){br.alive=false;b.vy*=-1;g.score+=10;for(let i=0;i<8;i++)g.particles.push({x:br.x+BRKW/2,y:br.y+BRKH/2,vx:(Math.random()-0.5)*5,vy:(Math.random()-0.5)*5,life:20,r:Math.random()*3+1,color:br.color});setDisp(d=>({...d,score:g.score}));}});
      if(g.bricks.every(b=>!b.alive)){g.phase="win";setDisp(d=>({...d,phase:"win"}));}
      g.particles=g.particles.map(p=>({...p,x:p.x+p.vx,y:p.y+p.vy,life:p.life-1,vy:p.vy+0.15})).filter(p=>p.life>0);
    }
    ctx.fillStyle="#111";ctx.fillRect(0,0,BW,BH);
    ctx.strokeStyle="rgba(255,255,255,0.025)";ctx.lineWidth=1;for(let x=0;x<BW;x+=30){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,BH);ctx.stroke();}for(let y=0;y<BH;y+=30){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(BW,y);ctx.stroke();}
    g.bricks.forEach(br=>{if(!br.alive)return;const grd=ctx.createLinearGradient(br.x,br.y,br.x,br.y+BRKH);grd.addColorStop(0,br.color);grd.addColorStop(1,`${br.color}aa`);ctx.fillStyle=grd;ctx.shadowColor=br.color;ctx.shadowBlur=6;ctx.beginPath();ctx.roundRect(br.x,br.y,BRKW,BRKH,4);ctx.fill();ctx.shadowBlur=0;});
    const pg=ctx.createLinearGradient(g.paddle.x,g.paddle.y,g.paddle.x,g.paddle.y+PH);pg.addColorStop(0,"#fff");pg.addColorStop(1,"rgba(255,255,255,0.7)");ctx.fillStyle=pg;ctx.shadowColor="rgba(255,255,255,0.4)";ctx.shadowBlur=10;ctx.beginPath();ctx.roundRect(g.paddle.x,g.paddle.y,PW,PH,6);ctx.fill();ctx.shadowBlur=0;
    const bg=ctx.createRadialGradient(g.ball.x-2,g.ball.y-2,1,g.ball.x,g.ball.y,BALLR);bg.addColorStop(0,"#fff");bg.addColorStop(1,"#a0d0ff");ctx.fillStyle=bg;ctx.shadowColor="rgba(160,208,255,0.8)";ctx.shadowBlur=15;ctx.beginPath();ctx.arc(g.ball.x,g.ball.y,BALLR,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
    g.particles.forEach(p=>{ctx.globalAlpha=p.life/20;ctx.fillStyle=p.color;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();});ctx.globalAlpha=1;
    if(g.phase!=="running"){ctx.fillStyle="rgba(0,0,0,0.7)";ctx.fillRect(0,0,BW,BH);ctx.textAlign="center";if(g.phase==="win"){ctx.fillStyle="#ffd60a";ctx.font="bold 24px -apple-system";ctx.shadowColor="#ffd60a";ctx.shadowBlur=20;ctx.fillText("🏆 YOU WIN!",BW/2,BH/2-12);ctx.shadowBlur=0;}else{ctx.fillStyle=g.phase==="dead"?"#ff453a":"#fff";ctx.font="bold 22px -apple-system";ctx.fillText(g.phase==="dead"?"GAME OVER":"BREAKOUT",BW/2,BH/2-12);}ctx.fillStyle="rgba(255,255,255,0.55)";ctx.font="13px -apple-system";ctx.fillText(g.phase==="idle"?"Move mouse · tap Play to start":"Tap Play Again to retry",BW/2,BH/2+14);ctx.textAlign="left";}
    raf.current=requestAnimationFrame(draw);
  };
  const startGame=()=>{game.current={...mkGame(),phase:"running"};setDisp({score:0,lives:3,phase:"running"});};
  const movePad=x=>{if(!game.current||game.current.phase!=="running")return;game.current.paddle.x=Math.max(0,Math.min(BW-PW,x-PW/2));};
  useEffect(()=>{raf.current=requestAnimationFrame(draw);return()=>cancelAnimationFrame(raf.current);},[]);
  return(
    <div style={{background:"#111",borderRadius:14,overflow:"hidden"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 16px",background:"rgba(0,0,0,0.4)"}}>
        <div style={{display:"flex",gap:20}}>{[["Score",disp.score,"#ffd60a"],["Lives","❤️".repeat(Math.max(0,disp.lives))||"💀","#ff453a"]].map(([l,v,c])=><div key={l} style={{textAlign:"center"}}><div style={{fontSize:10,color:"rgba(255,255,255,0.4)",letterSpacing:"0.08em",textTransform:"uppercase"}}>{l}</div><div style={{fontSize:l==="Lives"&&disp.phase!=="idle"?16:22,fontWeight:700,color:c,letterSpacing:"-0.02em",paddingTop:2}}>{v}</div></div>)}</div>
        <button onPointerDown={startGame} style={{padding:"7px 18px",borderRadius:980,border:"none",background:disp.phase==="running"?"rgba(255,59,48,0.2)":"#ffd60a",color:disp.phase==="running"?"#ff3b30":"#111",fontSize:12,fontWeight:700,cursor:"pointer"}}>{disp.phase==="running"?"Restart":disp.phase==="win"||disp.phase==="dead"?"Play Again":"Play"}</button>
      </div>
      <canvas ref={cvs} width={BW} height={BH} style={{display:"block",width:"100%",maxWidth:BW,lineHeight:0}} onMouseMove={e=>{const r=cvs.current?.getBoundingClientRect();if(r)movePad(e.clientX-r.left);}} onTouchMove={e=>{const r=cvs.current?.getBoundingClientRect();if(r)movePad(e.touches[0].clientX-r.left);}}/>
      <div style={{padding:"8px",background:"rgba(0,0,0,0.3)",textAlign:"center",fontSize:11,color:"rgba(255,255,255,0.3)"}}>Move mouse or drag to control the paddle</div>
    </div>
  );
};

// ─── AI CHAT ──────────────────────────────────────────────────────
const AIChatPreview=()=>{
  const {colors}=useTheme();
  const [msgs,setMsgs]=useState([{role:"ai",text:"Hey! I'm an AI built to tell you all about Dheeraj — his projects, skills, experience at ELINT PRO & VSoft, or his startup Apex Sky. What would you like to know? 👋"}]);
  const [input,setInput]=useState(""); const [loading,setLoading]=useState(false); const bottomRef=useRef(null);
  useEffect(()=>{bottomRef.current?.scrollIntoView({behavior:"smooth"});},[msgs]);
  const send=async()=>{
    if(!input.trim()||loading)return;
    const msg=input.trim();setInput("");setMsgs(m=>[...m,{role:"user",text:msg}]);setLoading(true);
    try{
      const res=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,
        system:`You are a friendly AI assistant embedded in Dheeraj Yampati's personal portfolio. Answer questions about him warmly and concisely (2-3 sentences max).

IMPORTANT: For greetings like "hi", "hello", "hey", "what's up", "how are you" — respond warmly, introduce yourself briefly, and invite them to ask about Dheeraj. Never say "I'm not sure about that" to a greeting.

NAME: Dheeraj Yampati | LOCATION: Fairfax, VA | EMAIL: dheerajyampati@gmail.com
EDUCATION: B.S. Computer Science, George Mason University, Dec 2025.
CURRENT: SWE Intern at ELINT PRO (Sep 2025–Present, Java Spring Boot, MySQL, JWT, HRMS). Co-Founder at Apex Sky (Jan 2023–Present, startup, pitched investors).
PAST: ML Intern VSoft Consulting (Jun–Aug 2025, AWS pipelines, RAG, Weaviate, bge-m3, Llama3, Mistral). SWE Intern Think Analytix (Jun–Aug 2024, React, FastAPI, PostgreSQL).
PROJECTS: Microsoft ChatBot (MS Graph, FastAPI, RAG, Weaviate), TaskFlow (React, FastAPI, PostgreSQL, Docker, AWS, JWT), Immigration System (JavaFX, MySQL, MVC).
SKILLS: Java, Python, C/C++, JS/React/Next.js, SQL, Spring Boot, FastAPI, AWS, RAG, Docker, Git.
GITHUB: https://github.com/Dheeraj-Rex | LINKEDIN: https://linkedin.com/in/dheerajyampati

Always respond in a warm, helpful, conversational tone. Keep answers to 2-3 sentences.`,
        messages:[{role:"user",content:msg}]})});
      const data=await res.json();setMsgs(m=>[...m,{role:"ai",text:data.content?.[0]?.text||"Not sure about that!"}]);
    }catch{setMsgs(m=>[...m,{role:"ai",text:"Something went wrong — try again!"}]);}
    setLoading(false);
  };
  return(
    <div style={{padding:16,height:320,display:"flex",flexDirection:"column",background:colors.bg}}>
      <div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:10}}>
        {msgs.map((m,i)=><div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start"}}><div style={{maxWidth:"78%",padding:"10px 14px",borderRadius:m.role==="user"?"16px 16px 4px 16px":"16px 16px 16px 4px",background:m.role==="user"?colors.accent:colors.surfaceSolid,color:m.role==="user"?"#fff":colors.text,fontSize:13,lineHeight:1.5,boxShadow:"0 1px 4px rgba(0,0,0,0.08)"}}>{m.text}</div></div>)}
        {loading&&<div style={{display:"flex",gap:4,padding:"10px 14px",width:"fit-content",background:colors.surfaceSolid,borderRadius:"16px 16px 16px 4px"}}>{[0,1,2].map(i=><div key={i} style={{width:6,height:6,borderRadius:"50%",background:colors.subtext,animation:`pulse 1.2s ${i*0.2}s infinite`}}/>)}</div>}
        <div ref={bottomRef}/>
      </div>
      <div style={{display:"flex",gap:8,marginTop:12}}>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Ask me anything..." style={{flex:1,padding:"10px 14px",borderRadius:980,border:`1px solid ${colors.border}`,outline:"none",fontSize:13,background:colors.surfaceSolid,color:colors.text}}/>
        <button onClick={send} style={{padding:"10px 18px",borderRadius:980,border:"none",background:colors.accent,color:"#fff",fontSize:13,fontWeight:500}}>Send</button>
      </div>
    </div>
  );
};

// ─── CALCULATOR ───────────────────────────────────────────────────
const CalcPreview=()=>{
  const {colors}=useTheme();
  const [display,setDisplay]=useState("0"),[history,setHistory]=useState([]);
  const press=v=>{if(v==="C"){setDisplay("0");return;}if(v==="="){try{const r=String(eval(display.replace("×","*").replace("÷","/")));setHistory(h=>[`${display} = ${r}`,...h.slice(0,3)]);setDisplay(r);}catch{setDisplay("Error");}return;}setDisplay(d=>d==="0"?v:d+v);};
  const btns=["C","(",")","%","7","8","9","÷","4","5","6","×","1","2","3","-","0",".","=","+"];
  return(
    <div style={{padding:16,background:colors.bg}}>
      {history.length>0&&<div style={{marginBottom:8,fontSize:11,color:colors.subtext}}>{history[0]}</div>}
      <div style={{textAlign:"right",fontSize:28,fontWeight:300,padding:"8px 4px 12px",color:colors.text,letterSpacing:"-0.02em"}}>{display}</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
        {btns.map(b=><button key={b} onClick={()=>press(b)} style={{padding:"12px",borderRadius:10,border:"none",fontSize:15,fontWeight:500,background:b==="="?colors.accent:["C","(",")","%"].includes(b)?colors.border:["÷","×","-","+"].includes(b)?`${colors.accent}18`:colors.surfaceSolid,color:b==="="?"#fff":["÷","×","-","+"].includes(b)?colors.accent:colors.text,boxShadow:"0 1px 3px rgba(0,0,0,0.08)"}}>{b}</button>)}
      </div>
    </div>
  );
};

// ─── FOCUS BOARD ──────────────────────────────────────────────────
const TodoPreview=()=>{
  const {colors}=useTheme();
  const [todos,setTodos]=useState([{id:1,text:"Finish portfolio homepage",done:false,priority:"high"},{id:2,text:"Deploy mini apps",done:true,priority:"medium"},{id:3,text:"Add project previews",done:false,priority:"high"}]);
  const [input,setInput]=useState("");
  const toggle=id=>setTodos(t=>t.map(x=>x.id===id?{...x,done:!x.done}:x));
  const add=()=>{if(!input.trim())return;setTodos(t=>[...t,{id:Date.now(),text:input,done:false,priority:"medium"}]);setInput("");};
  const pColor={high:colors.red,medium:colors.yellow,low:colors.green};
  return(
    <div style={{padding:16,background:colors.bg}}>
      <div style={{display:"flex",gap:8,marginBottom:14}}>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&add()} placeholder="Add a task..." style={{flex:1,padding:"9px 14px",borderRadius:980,border:`1px solid ${colors.border}`,outline:"none",fontSize:13,background:colors.surfaceSolid,color:colors.text}}/>
        <button onClick={add} style={{padding:"9px 16px",borderRadius:980,border:"none",background:colors.accent,color:"#fff",fontSize:13}}>+</button>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {todos.map(t=><div key={t.id} onClick={()=>toggle(t.id)} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:10,background:colors.surfaceSolid,border:`1px solid ${colors.border}`,opacity:t.done?0.5:1}}>
          <div style={{width:18,height:18,borderRadius:"50%",border:`2px solid ${t.done?colors.green:colors.border}`,background:t.done?colors.green:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{t.done&&<span style={{color:"#fff",fontSize:10}}>✓</span>}</div>
          <span style={{flex:1,fontSize:13,color:colors.text,textDecoration:t.done?"line-through":"none"}}>{t.text}</span>
          <div style={{width:6,height:6,borderRadius:"50%",background:pColor[t.priority]}}/>
        </div>)}
      </div>
    </div>
  );
};

// ─── MINI APPS SECTION ────────────────────────────────────────────
const MiniAppsSection=()=>{
  const {colors}=useTheme(); const [active,setActive]=useState(null);
  const apps=[
    {id:"ai-chat",   icon:"🤖",title:"AI Assistant",   desc:"A personal AI chatbot that knows everything about me — ask it anything.",           tag:"AI-Powered",  color:"#0071e3",preview:<AIChatPreview/>},
    {id:"calculator",icon:"🔢",title:"Smart Calculator",desc:"A calculator with history, unit conversions, and expression parsing.",              tag:"Utility",     color:"#34c759",preview:<CalcPreview/>},
    {id:"todo",      icon:"✅",title:"Focus Board",     desc:"A minimal task manager with priority levels and a daily focus view.",                tag:"Productivity",color:"#ff9f0a",preview:<TodoPreview/>},
    {id:"snake",     icon:"🐍",title:"Snake",           desc:"Classic snake rebuilt from scratch. Keyboard or tap to play. Beat the high score.", tag:"Game",        color:"#ff3b30",preview:<SnakeGame/>},
    {id:"breakout",  icon:"🧱",title:"Breakout",        desc:"Smash colorful bricks with a bouncing ball. Move mouse or drag to play.",           tag:"Game",        color:"#bf5af2",preview:<BreakoutGame/>},
  ];
  return(
    <SectionShell>
      <div style={{maxWidth:900,margin:"0 auto"}}>
        <p style={{fontSize:12,fontWeight:600,color:colors.accent,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:6}}>Built & Embedded</p>
        <h2 style={{fontSize:32,fontWeight:700,color:colors.text,letterSpacing:"-0.025em",marginBottom:6}}>Mini Apps</h2>
        <p style={{fontSize:14,color:colors.subtext,marginBottom:28}}>Real apps — right here, no links needed. Click to launch.</p>
        <div className="mini-apps-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
          {apps.map(app=>(
            <div key={app.id}>
              <div className="mini-app card" onClick={()=>setActive(active===app.id?null:app.id)} style={{borderRadius:16,padding:20,border:`1px solid ${active===app.id?app.color+"40":colors.border}`,background:active===app.id?`${app.color}06`:colors.surfaceSolid}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                  <div style={{display:"flex",gap:12,alignItems:"center"}}>
                    <div style={{width:44,height:44,borderRadius:12,background:`${app.color}15`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>{app.icon}</div>
                    <div><div style={{fontWeight:600,fontSize:14,color:colors.text}}>{app.title}</div><Tag label={app.tag} color={app.color}/></div>
                  </div>
                  <div style={{fontSize:11,padding:"5px 12px",borderRadius:980,background:active===app.id?app.color:colors.bg,color:active===app.id?"#fff":colors.subtext,fontWeight:500,transition:"all 0.2s ease"}}>{active===app.id?"Close":"Launch"}</div>
                </div>
                <p style={{fontSize:12,color:colors.subtext,marginTop:10,lineHeight:1.6}}>{app.desc}</p>
              </div>
              {active===app.id&&app.preview&&<div className="scaleIn" style={{marginTop:8,borderRadius:14,border:`1px solid ${app.color}30`,overflow:"hidden",background:colors.bg}}>{app.preview}</div>}
            </div>
          ))}
        </div>
      </div>
    </SectionShell>
  );
};

// ─── RESUME ───────────────────────────────────────────────────────
const ResumeSection=()=>{
  const {colors}=useTheme();
  return(
    <SectionShell>
      <div style={{maxWidth:760,margin:"0 auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:32,flexWrap:"wrap",gap:12}}>
          <div>
            <p style={{fontSize:12,fontWeight:600,color:colors.accent,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:6}}>Experience</p>
            <h2 style={{fontSize:32,fontWeight:700,color:colors.text,letterSpacing:"-0.025em"}}>Résumé</h2>
          </div>
          <a href="/resume.pdf" download="Dheeraj_Yampati_Resume.pdf" className="btn-primary" style={{background:colors.accent,color:"#fff",border:"none",padding:"10px 20px",borderRadius:980,fontSize:13,fontWeight:500,textDecoration:"none",display:"flex",alignItems:"center",gap:6}}>↓ Download PDF</a>
        </div>
        <div style={{marginBottom:32}}>
          <h3 style={{fontSize:13,fontWeight:600,color:colors.subtext,letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:16}}>Work Experience</h3>
          {[
            {role:"Software Engineering Intern",co:"ELINT PRO Solutions · Waxhaw, NC (Remote)",period:"Sep 2025–Present",bullets:["Built HRMS modules for onboarding, payroll automation, and leave tracking using Java Spring Boot and MySQL","Implemented secure REST APIs with JWT role-based access, improving data consistency across HR dashboards","Optimized SQL queries and added caching to reduce response times on frequently accessed endpoints"]},
            {role:"Machine Learning Intern",co:"VSoft Consulting · Hyderabad, IND",period:"Jun–Aug 2025",bullets:["Built AWS data pipelines (S3, Glue, Athena, QuickSight) to process and visualize client datasets","Created RAG pipelines with Weaviate, bge-m3 embeddings, and Mistral/Llama 3 for document search & summarization","Led daily scrums and presented sprint progress to managers and investors, ensuring on-time delivery"]},
            {role:"Software Engineering Intern",co:"Think Analytix · Irving, TX (Remote)",period:"Jun–Aug 2024",bullets:["Built full-stack features for internal dashboards using React, FastAPI, and PostgreSQL","Developed and improved REST APIs for profile management, search, and filtering","Added validation, error handling, and UI improvements to streamline recruiter workflows"]},
            {role:"Co-Founder",co:"Apex Sky · Fairfax, VA",period:"Jan 2023–Present",bullets:["Co-founded the company; defined product vision and business strategy while validating market opportunities","Engaged with professors, CEOs, and senior leaders for expert feedback; iterated on go-to-market plans","Pitched roadmap to potential investors and managed stakeholder communications"]},
          ].map((exp,i)=>(
            <div key={i} style={{paddingLeft:20,borderLeft:`2px solid ${colors.border}`,marginBottom:20,position:"relative"}}>
              <div style={{width:8,height:8,borderRadius:"50%",background:colors.accent,position:"absolute",left:-5,top:5}}/>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8,flexWrap:"wrap"}}>
                <div><div style={{fontWeight:600,fontSize:15,color:colors.text}}>{exp.role}</div><div style={{fontSize:13,color:colors.subtext}}>{exp.co}</div></div>
                <Tag label={exp.period}/>
              </div>
              <ul className="resume-bullets" style={{marginTop:10,paddingLeft:16}}>
                {exp.bullets.map((b,j)=><li key={j} style={{fontSize:13,color:colors.subtext,lineHeight:1.7}}>{b}</li>)}
              </ul>
            </div>
          ))}
        </div>
        <div>
          <h3 style={{fontSize:13,fontWeight:600,color:colors.subtext,letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:16}}>Skills</h3>
          <div className="desktop-grid-skills" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
            {[
              {cat:"Languages",   skills:"Java, Python, C/C++, JavaScript, SQL, Bash"},
              {cat:"Frontend",    skills:"React, Next.js, JavaFX, REST APIs"},
              {cat:"Backend",     skills:"Spring Boot, FastAPI, Node.js, Maven"},
              {cat:"AI / ML",     skills:"RAG, Weaviate, bge-m3, Llama 3, Mistral, Scikit-learn"},
              {cat:"Cloud & Data",skills:"AWS (EC2, S3, Glue, Athena), MySQL, PostgreSQL, ETL"},
              {cat:"Tools",       skills:"Git/GitHub, Docker, Postman, MS Graph API, Apache POI"},
            ].map(s=>(
              <div key={s.cat} style={{padding:"14px 16px",borderRadius:12,background:colors.bg,border:`1px solid ${colors.border}`}}>
                <div style={{fontSize:12,fontWeight:600,color:colors.accent,marginBottom:4}}>{s.cat}</div>
                <div style={{fontSize:12,color:colors.subtext,lineHeight:1.6}}>{s.skills}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionShell>
  );
};

// ─── CONTACT ──────────────────────────────────────────────────────
const ContactSection=()=>{
  const {colors}=useTheme();
  const [form,setForm]=useState({name:"",email:"",msg:""});
  const [status,setStatus]=useState("idle");
  const send=async()=>{
    if(!form.name||!form.email||!form.msg)return;
    setStatus("sending");
    try{const res=await fetch("/api/contact",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(form)});setStatus(res.ok?"sent":"error");}
    catch{setStatus("error");}
  };
  return(
    <SectionShell>
      <div style={{maxWidth:620,margin:"0 auto",textAlign:"center"}}>
        <div style={{fontSize:48,marginBottom:16}}>👋</div>
        <p style={{fontSize:12,fontWeight:600,color:colors.accent,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:8}}>Get In Touch</p>
        <h2 style={{fontSize:36,fontWeight:700,color:colors.text,letterSpacing:"-0.025em"}}>Let's Work Together</h2>
        <p style={{fontSize:15,color:colors.subtext,marginTop:10,marginBottom:32,lineHeight:1.7}}>I'm open to new projects, collaborations, and conversations. Drop me a message and I'll get back within 24 hours.</p>
        {status==="sent"?(
          <div style={{padding:32,borderRadius:16,background:`${colors.green}12`,border:`1px solid ${colors.green}30`}}>
            <div style={{fontSize:36,marginBottom:12}}>✅</div>
            <div style={{fontWeight:600,color:colors.text}}>Message sent!</div>
            <div style={{fontSize:13,color:colors.subtext,marginTop:6}}>I'll reply within 24 hours.</div>
          </div>
        ):(
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {[["name","Your name","text"],["email","your@email.com","email"]].map(([k,ph,type])=>(
              <input key={k} type={type} placeholder={ph} value={form[k]} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))} style={{width:"100%",padding:"13px 16px",borderRadius:12,border:`1px solid ${colors.border}`,outline:"none",fontSize:14,background:colors.inputBg,color:colors.text}}/>
            ))}
            <textarea placeholder="What's on your mind?" rows={4} value={form.msg} onChange={e=>setForm(f=>({...f,msg:e.target.value}))} style={{width:"100%",padding:"13px 16px",borderRadius:12,border:`1px solid ${colors.border}`,outline:"none",fontSize:14,background:colors.inputBg,color:colors.text,resize:"vertical"}}/>
            {status==="error"&&<p style={{fontSize:13,color:colors.red}}>Something went wrong — email me directly at dheerajyampati@gmail.com</p>}
            <button className="btn-primary" onClick={send} disabled={status==="sending"} style={{background:colors.accent,color:"#fff",border:"none",padding:14,borderRadius:980,fontSize:15,fontWeight:500,opacity:status==="sending"?0.7:1}}>
              {status==="sending"?"Sending…":"Send Message →"}
            </button>
          </div>
        )}
        <div style={{display:"flex",justifyContent:"center",gap:10,marginTop:28,flexWrap:"wrap"}}>
          {[{label:"GitHub",icon:"⌥",href:"https://github.com/Dheeraj-Rex"},{label:"LinkedIn",icon:"in",href:"https://linkedin.com/in/dheerajyampati"},{label:"Email",icon:"✉",href:"mailto:dheerajyampati@gmail.com"}].map(({label,icon,href})=>(
            <a key={label} href={href} target="_blank" rel="noopener noreferrer"
              style={{display:"flex",alignItems:"center",gap:6,fontSize:13,color:colors.subtext,padding:"8px 16px",borderRadius:980,border:`1px solid ${colors.border}`,background:colors.bg,textDecoration:"none",transition:"all 0.15s ease"}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=colors.accent;e.currentTarget.style.color=colors.accent;}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=colors.border;e.currentTarget.style.color=colors.subtext;}}>
              <span style={{fontWeight:600}}>{icon}</span><span>{label}</span>
            </a>
          ))}
        </div>
      </div>
    </SectionShell>
  );
};

// ─── BUILD LOG DATA ───────────────────────────────────────────────
// To add a new post: copy one object, change the fields, push to GitHub.
const POSTS = [
  {
    id: 1,
    type: "deep-dive",
    title: "Building a RAG Pipeline from Scratch at VSoft",
    date: "Aug 2025",
    tags: ["AI", "RAG", "Python", "AWS"],
    summary: "My internship project: turning a pile of company documents into a searchable AI brain using Weaviate, bge-m3 embeddings, and Mistral.",
    body: `At VSoft Consulting I was handed a challenge: make 3 years of internal documents searchable using AI — in 8 weeks.

The stack I ended up with: FastAPI as the backend, Weaviate as the vector database, bge-m3 for generating embeddings, and Mistral/Llama 3 for generating natural language answers.

The hardest part wasn't the ML — it was chunking. How you split documents before embedding them completely changes retrieval quality. Too small and you lose context. Too big and the embedding is noisy. I landed on 512-token chunks with 64-token overlap after a lot of trial and error.

The result was a tool that let employees ask questions like "what was the Q3 client onboarding process for healthcare?" and get back a cited, accurate answer in under 2 seconds. Presented it to managers and investors at the sprint review — shipped on time.

Big takeaway: RAG is 20% models and 80% data pipeline. The chunking, cleaning, and indexing strategy matters way more than which LLM you pick.`,
  },
  {
    id: 2,
    type: "short",
    title: "TaskFlow: What I'd do differently",
    date: "Jul 2025",
    tags: ["React", "FastAPI", "Lessons"],
    summary: "Built a full-stack team task manager with WebSockets and Docker. Here's the one thing I'd redesign if I started over.",
    body: `TaskFlow was my most complete full-stack project — React frontend, FastAPI backend, PostgreSQL, JWT auth, WebSocket real-time updates, Docker, deployed on AWS.

If I rebuilt it today I'd replace the custom WebSocket layer with Supabase Realtime. I spent 2 weeks building and debugging the WebSocket connection management that Supabase gives you for free in 10 minutes. Classic "build vs buy" lesson learned the hard way.

The Docker + AWS deployment was actually the smoothest part — turns out containerizing from day one saves you enormous pain later.`,
  },
  {
    id: 3,
    type: "short",
    title: "Co-founding Apex Sky — what 2 years taught me",
    date: "Jan 2025",
    tags: ["Startup", "Entrepreneurship", "Lessons"],
    summary: "Two years in on Apex Sky. The most surprising thing I learned had nothing to do with code.",
    body: `When I co-founded Apex Sky in 2023 I thought the hardest part would be building the product. I was wrong — the hardest part is deciding what NOT to build.

We talked to professors, CEOs, and industry leaders. Every conversation added a new "must-have" feature to the list. Learning to say no — and to validate before building — is the most valuable skill I've developed outside of engineering.

Pitching to investors is also nothing like you imagine. They care less about features than you think. They care about: do you understand the problem deeply, and why are you the right person to solve it?

Still building. More updates soon.`,
  },
  {
    id: 4,
    type: "deep-dive",
    title: "How I built this Portfolio OS",
    date: "Mar 2026",
    tags: ["React", "Design", "Canvas API"],
    summary: "A portfolio that IS a product. How I designed and built an OS-style personal site with embedded games, an AI chatbot, and a live build log.",
    body: `Most developer portfolios are glorified resumes with a projects section. I wanted mine to be a product you actually experience — not just read.

The concept: a macOS-inspired operating system. Fixed menu bar with live clock. An animated dock for navigation. Each section opens like an app window with window control dots.

The most fun part was the mini apps — real, working apps embedded directly in the page. Snake and Breakout built on HTML Canvas with a full game loop running at 60fps via requestAnimationFrame. The AI Assistant calls a Vercel serverless function that proxies to the Anthropic API — no CORS issues, no exposed keys.

Dark mode was straightforward: a React Context that swaps two complete color token objects. Every component reads from the context so the whole UI responds instantly.

The build log you're reading right now is just a static array in the source code. No CMS, no database. Adding a post = adding one object and pushing to GitHub. Simple wins.

Stack: React + Vite, deployed on Vercel, custom serverless API routes for AI and email.`,
  },
];

// ─── BLOG SECTION ─────────────────────────────────────────────────
const BlogSection = () => {
  const { colors } = useTheme();
  const [expanded, setExpanded] = useState(null);

  return (
    <SectionShell>
      <div style={{ maxWidth:860, margin:"0 auto" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:28 }}>
          <div>
            <p style={{ fontSize:12, fontWeight:600, color:colors.accent, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:6 }}>Thoughts & Work</p>
            <h2 style={{ fontSize:32, fontWeight:700, color:colors.text, letterSpacing:"-0.025em" }}>Build Log</h2>
          </div>
          <span style={{ fontSize:13, color:colors.subtext }}>{POSTS.length} posts</span>
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          {POSTS.map(post => {
            const isOpen = expanded === post.id;
            const isDeepDive = post.type === "deep-dive";
            return (
              <div key={post.id}>
                <div className="blog-card" onClick={() => setExpanded(isOpen ? null : post.id)}
                  style={{ borderRadius:16, padding:22, border:`1px solid ${isOpen ? colors.accent+"40" : colors.border}`, background: isOpen ? `${colors.accent}05` : colors.surfaceSolid, boxShadow:"0 2px 12px rgba(0,0,0,0.04)" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:12 }}>
                    <div style={{ flex:1 }}>
                      <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:8, flexWrap:"wrap" }}>
                        <span style={{ fontSize:11, fontWeight:600, padding:"2px 10px", borderRadius:20,
                          background: isDeepDive ? `${colors.accent}15` : `${colors.green}15`,
                          color: isDeepDive ? colors.accent : colors.green }}>
                          {isDeepDive ? "Deep Dive" : "Quick Take"}
                        </span>
                        {post.tags.map(t => <Tag key={t} label={t} />)}
                        <span style={{ fontSize:11, color:colors.subtext, marginLeft:"auto" }}>{post.date}</span>
                      </div>
                      <h3 style={{ fontSize:16, fontWeight:600, color:colors.text, lineHeight:1.3, marginBottom:6 }}>{post.title}</h3>
                      <p style={{ fontSize:13, color:colors.subtext, lineHeight:1.6 }}>{post.summary}</p>
                    </div>
                    <div style={{ fontSize:18, color:colors.subtext, transition:"transform 0.2s ease", transform: isOpen ? "rotate(90deg)" : "rotate(0deg)", flexShrink:0, marginTop:2 }}>›</div>
                  </div>
                </div>

                {/* Expanded body */}
                {isOpen && (
                  <div className="slideUp" style={{ marginTop:4, borderRadius:14, padding:"24px 26px", background:colors.bg, border:`1px solid ${colors.border}` }}>
                    {post.body.split("\n\n").map((para, i) => (
                      <p key={i} style={{ fontSize:14, color:colors.text, lineHeight:1.8, marginBottom: i < post.body.split("\n\n").length - 1 ? 16 : 0 }}>{para}</p>
                    ))}
                    <div style={{ marginTop:20, paddingTop:16, borderTop:`1px solid ${colors.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                        {post.tags.map(t => <Tag key={t} label={t} />)}
                      </div>
                      <span style={{ fontSize:12, color:colors.subtext }}>{post.date}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </SectionShell>
  );
};

// ─── HOME BLOG PREVIEW ────────────────────────────────────────────
const HomeBlogPreview = ({ onNav }) => {
  const { colors } = useTheme();
  const latest = POSTS.slice(0, 3);
  return (
    <div style={{ marginTop:28, animation:"fadeUp 0.5s 0.35s ease both", opacity:0, animationFillMode:"forwards" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
        <span style={{ fontSize:13, fontWeight:600, color:colors.text }}>📝 Latest from Build Log</span>
        <button onClick={() => onNav("blog")} style={{ fontSize:12, color:colors.accent, background:"none", border:"none", cursor:"pointer", fontWeight:500 }}>View all →</button>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        {latest.map(post => (
          <div key={post.id} className="blog-card" onClick={() => onNav("blog")}
            style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 16px", borderRadius:12, background:colors.surfaceSolid, border:`1px solid ${colors.border}`, boxShadow:"0 1px 6px rgba(0,0,0,0.04)" }}>
            <div style={{ width:36, height:36, borderRadius:10, background: post.type==="deep-dive" ? `${colors.accent}15` : `${colors.green}15`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>
              {post.type === "deep-dive" ? "📖" : "⚡"}
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:13, fontWeight:600, color:colors.text, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{post.title}</div>
              <div style={{ fontSize:11, color:colors.subtext, marginTop:2 }}>{post.date} · {post.type === "deep-dive" ? "Deep Dive" : "Quick Take"}</div>
            </div>
            <div style={{ fontSize:16, color:colors.subtext, flexShrink:0 }}>›</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── DOCK ─────────────────────────────────────────────────────────
const dockItems=[{id:"home",icon:"🏠"},{id:"about",icon:"👤"},{id:"projects",icon:"🗂️"},{id:"miniapps",icon:"✦"},{id:"resume",icon:"📄"},{id:"blog",icon:"📝"},{id:"contact",icon:"📬"}];

const Dock=({active,onNav})=>{
  const {colors}=useTheme();
  return(
    <div style={{position:"fixed",bottom:16,left:"50%",transform:"translateX(-50%)",background:colors.dock,backdropFilter:"blur(24px)",WebkitBackdropFilter:"blur(24px)",borderRadius:22,padding:"8px 14px",border:`1px solid rgba(255,255,255,0.18)`,boxShadow:"0 8px 32px rgba(0,0,0,0.14)",display:"flex",alignItems:"flex-end",gap:4,zIndex:100,maxWidth:"calc(100vw - 32px)"}}>
      {dockItems.map(item=>(
        <div key={item.id} className="dock-icon" onClick={()=>onNav(item.id)} style={{position:"relative",display:"flex",flexDirection:"column",alignItems:"center"}}>
          <div style={{width:46,height:46,borderRadius:13,background:active===item.id?`${colors.accent}18`:"transparent",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,border:active===item.id?`1.5px solid ${colors.accent}30`:"1.5px solid transparent"}}>{item.icon}</div>
          {active===item.id&&<div style={{width:4,height:4,borderRadius:"50%",background:colors.accent,marginTop:3}}/>}
        </div>
      ))}
    </div>
  );
};

// ─── MENU BAR ─────────────────────────────────────────────────────
const MenuBar=({section,dark,setDark})=>{
  const {colors}=useTheme();
  const [time,setTime]=useState(new Date());
  useEffect(()=>{const t=setInterval(()=>setTime(new Date()),1000);return()=>clearInterval(t);},[]);
  const labels={home:"Home",about:"About Me",projects:"Projects",miniapps:"Mini Apps",resume:"Résumé",blog:"Build Log",contact:"Contact"};
  return(
    <div style={{position:"fixed",top:0,left:0,right:0,zIndex:200,background:colors.menubar,backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",borderBottom:`1px solid ${colors.border}`,display:"flex",justifyContent:"space-between",alignItems:"center",padding:"0 16px",height:44}}>
      <div style={{display:"flex",gap:16,alignItems:"center"}}>
        <span style={{fontSize:17,fontWeight:700,letterSpacing:"-0.03em",color:colors.text}}>DY · Portfolio</span>
        <span className="nav-pill" style={{fontSize:13,fontWeight:500,color:colors.text,padding:"4px 8px"}}>{labels[section]}</span>
      </div>
      <div style={{display:"flex",gap:10,alignItems:"center"}}>
        <span className="hide-mobile" style={{fontSize:12,color:colors.subtext}}>{time.toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"})} · {time.toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"})}</span>
        <button onClick={()=>setDark(d=>!d)} style={{background:"transparent",border:`1px solid ${colors.border}`,borderRadius:980,padding:"4px 10px",fontSize:15,color:colors.text,lineHeight:1}} title="Toggle dark mode">{dark?"☀️":"🌙"}</button>
      </div>
    </div>
  );
};

// ─── APP ROOT ─────────────────────────────────────────────────────
export default function PortfolioOS() {
  const [section,setSection]=useState("home");
  const [dark,setDark]=useState(false);
  const [loading,setLoading]=useState(false);
  const [key,setKey]=useState(0);
  const colors=dark?darkColors:lightColors;

  const navTo=id=>{
    if(id===section)return;
    setLoading(true);
    setTimeout(()=>{setSection(id);setKey(k=>k+1);setLoading(false);},300);
  };

  const sections={
    home:<HomeSection onNav={navTo}/>,
    about:<AboutSection/>,
    projects:<ProjectsSection/>,
    miniapps:<MiniAppsSection/>,
    resume:<ResumeSection/>,
    blog:<BlogSection/>,
    contact:<ContactSection/>,
  };

  return(
    <ThemeCtx.Provider value={{colors,dark,setDark}}>
      <div style={{minHeight:"100vh",background:colors.bg,fontFamily:font,transition:"background 0.3s ease"}}>
        <style>{getGlobalStyle(dark,colors)}</style>
        <MenuBar section={section} dark={dark} setDark={setDark}/>
        <div key={key} className="section-enter" style={{paddingTop:64,paddingBottom:110,paddingLeft:16,paddingRight:16,maxWidth:1000,margin:"0 auto"}}>
          {loading?<SkeletonSection/>:sections[section]}
        </div>
        <Dock active={section} onNav={navTo}/>
      </div>
    </ThemeCtx.Provider>
  );
}
