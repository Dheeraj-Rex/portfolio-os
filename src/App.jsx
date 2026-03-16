import { useState, useEffect, useRef } from "react";

// ─── DESIGN TOKENS ────────────────────────────────────────────────
const colors = {
  bg: "#f5f5f7",
  surface: "rgba(255,255,255,0.85)",
  surfaceSolid: "#ffffff",
  border: "rgba(0,0,0,0.08)",
  text: "#1d1d1f",
  subtext: "#6e6e73",
  accent: "#0071e3",
  accentHover: "#0077ed",
  green: "#34c759",
  yellow: "#ff9f0a",
  red: "#ff3b30",
  dock: "rgba(255,255,255,0.72)",
};

const font = "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif";

// ─── STYLES ───────────────────────────────────────────────────────
const globalStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: ${colors.bg}; font-family: ${font}; }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.15); border-radius: 10px; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.96); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  .fadeUp { animation: fadeUp 0.5s ease both; }
  .fadeIn { animation: fadeIn 0.4s ease both; }
  .scaleIn { animation: scaleIn 0.35s cubic-bezier(.22,.68,0,1.2) both; }

  .dock-icon:hover { transform: scale(1.22) translateY(-6px); }
  .dock-icon { transition: transform 0.2s cubic-bezier(.22,.68,0,1.2); cursor: pointer; }

  .card:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(0,0,0,0.1); }
  .card { transition: all 0.2s ease; }

  .btn-primary:hover { background: ${colors.accentHover}; transform: scale(1.02); }
  .btn-primary { transition: all 0.15s ease; }

  .mini-app:hover { border-color: rgba(0,113,227,0.3); box-shadow: 0 4px 20px rgba(0,113,227,0.08); }
  .mini-app { transition: all 0.2s ease; }

  .nav-pill:hover { background: rgba(0,0,0,0.06); }
  .nav-pill { transition: background 0.15s ease; }

  /* ── MOBILE RESPONSIVE ───────────────────────────────────── */
  @media (max-width: 768px) {
    .desktop-grid-5 { grid-template-columns: repeat(3, 1fr) !important; }
    .desktop-grid-3 { grid-template-columns: 1fr 1fr !important; }
    .desktop-grid-2 { grid-template-columns: 1fr !important; }
    .desktop-grid-skills { grid-template-columns: 1fr 1fr !important; }
    .desktop-two-col { grid-template-columns: 1fr !important; }
    .hero-title { font-size: 36px !important; }
    .hero-sub { font-size: 16px !important; }
    .section-title { font-size: 26px !important; }
    .section-pad { padding: 20px !important; }
    .hide-mobile { display: none !important; }
    .dock-label { display: none !important; }
    .resume-bullets { padding-left: 12px !important; }
  }
  @media (max-width: 480px) {
    .desktop-grid-5 { grid-template-columns: repeat(2, 1fr) !important; gap: 10px !important; }
    .desktop-grid-3 { grid-template-columns: 1fr !important; }
    .mini-apps-grid { grid-template-columns: 1fr !important; }
    .hero-title { font-size: 30px !important; }
    .stats-bar { gap: 16px !important; }
  }
`;

// ─── COMPONENTS ───────────────────────────────────────────────────

const Tag = ({ label, color = colors.accent }) => (
  <span style={{
    display: "inline-block",
    padding: "3px 10px",
    borderRadius: 20,
    fontSize: 11,
    fontWeight: 500,
    background: `${color}14`,
    color: color,
    letterSpacing: "0.02em",
  }}>{label}</span>
);

const WindowDots = () => (
  <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
    {[colors.red, colors.yellow, colors.green].map((c, i) => (
      <div key={i} style={{ width: 12, height: 12, borderRadius: "50%", background: c }} />
    ))}
  </div>
);

const SectionShell = ({ children, style = {} }) => (
  <div className="scaleIn section-pad" style={{
    background: colors.surfaceSolid,
    borderRadius: 18,
    padding: 32,
    border: `1px solid ${colors.border}`,
    boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
    ...style
  }}>
    <WindowDots />
    {children}
  </div>
);

// ─── SECTIONS ─────────────────────────────────────────────────────

// HOME
const HomeSection = ({ onNav }) => {
  const cards = [
    { id: "about",    icon: "◉", label: "About Me",   color: "#0071e3", desc: "Who I am & what I do" },
    { id: "projects", icon: "⬡", label: "Projects",   color: "#34c759", desc: "Things I've shipped" },
    { id: "miniapps", icon: "✦", label: "Mini Apps",  color: "#ff9f0a", desc: "Games, tools & AI" },
    { id: "resume",   icon: "▤", label: "Resume",     color: "#ff3b30", desc: "Experience & skills" },
    { id: "contact",  icon: "◎", label: "Contact",    color: "#bf5af2", desc: "Let's work together" },
  ];

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      {/* Hero */}
      <div className="fadeUp" style={{ textAlign: "center", padding: "40px 0 36px" }}>
        <div style={{
          width: 96, height: 96, borderRadius: "50%", margin: "0 auto 24px",
          overflow: "hidden",
          boxShadow: "0 0 0 3px #fff, 0 0 0 5px rgba(0,113,227,0.3), 0 12px 40px rgba(0,0,0,0.18)"
        }}>
          <img
            src="/profile.png"
            alt="Dheeraj Yampati"
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }}
          />
        </div>
        <h1 className="hero-title" style={{ fontSize: 52, fontWeight: 700, color: colors.text, letterSpacing: "-0.03em", lineHeight: 1.1 }}>
          Dheeraj Yampati
        </h1>
        <p className="hero-sub" style={{ fontSize: 20, color: colors.subtext, marginTop: 10, fontWeight: 400 }}>
          Full-Stack Dev · AI Builder · Co-Founder
        </p>
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 16 }}>
          {["Java", "Python", "React", "AWS", "AI/ML"].map(t => <Tag key={t} label={t} />)}
        </div>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 28 }}>
          <button className="btn-primary" onClick={() => onNav("projects")} style={{
            background: colors.accent, color: "#fff", border: "none",
            padding: "12px 28px", borderRadius: 980, fontSize: 15, fontWeight: 500, cursor: "pointer"
          }}>View Projects</button>
          <button onClick={() => onNav("contact")} style={{
            background: "transparent", color: colors.text, border: `1px solid ${colors.border}`,
            padding: "12px 28px", borderRadius: 980, fontSize: 15, fontWeight: 500, cursor: "pointer"
          }}>Contact Me</button>
        </div>
      </div>

      {/* App Grid */}
      <div className="desktop-grid-5" style={{
        display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 14,
        animation: "fadeUp 0.5s 0.15s ease both", opacity: 0,
        animationFillMode: "forwards"
      }}>
        {cards.map((c, i) => (
          <div key={c.id} className="card" onClick={() => onNav(c.id)} style={{
            background: colors.surfaceSolid, borderRadius: 16,
            border: `1px solid ${colors.border}`,
            padding: "20px 16px", textAlign: "center", cursor: "pointer",
            boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
            animationDelay: `${i * 0.06}s`
          }}>
            <div style={{
              width: 48, height: 48, borderRadius: 14, background: `${c.color}15`,
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 12px", fontSize: 22, color: c.color
            }}>{c.icon}</div>
            <div style={{ fontWeight: 600, fontSize: 13, color: colors.text }}>{c.label}</div>
            <div style={{ fontSize: 11, color: colors.subtext, marginTop: 4 }}>{c.desc}</div>
          </div>
        ))}
      </div>

      {/* Status Bar */}
      <div style={{
        marginTop: 32, padding: "16px 20px", borderRadius: 14,
        background: "rgba(0,0,0,0.03)", border: `1px solid ${colors.border}`,
        display: "flex", gap: 24, justifyContent: "center",
        animation: "fadeUp 0.5s 0.3s ease both", opacity: 0, animationFillMode: "forwards"
      }} className="stats-bar">
        {[["3+", "Projects"], ["3", "Mini Apps"], ["2+ yrs", "Experience"], ["Open", "to Work"]].map(([v, l]) => (
          <div key={l} style={{ textAlign: "center" }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: colors.text }}>{v}</div>
            <div style={{ fontSize: 11, color: colors.subtext, marginTop: 2 }}>{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ABOUT
const AboutSection = () => (
  <SectionShell>
    <div className="desktop-two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, maxWidth: 860, margin: "0 auto" }}>
      <div>
        <p style={{ fontSize: 12, fontWeight: 600, color: colors.accent, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>About Me</p>
        <h2 style={{ fontSize: 36, fontWeight: 700, color: colors.text, letterSpacing: "-0.025em", lineHeight: 1.15 }}>
          Building things<br/>that matter.
        </h2>
        <p style={{ marginTop: 16, fontSize: 15, color: colors.subtext, lineHeight: 1.7 }}>
          I'm a CS grad from George Mason University with a passion for building full-stack products and AI-powered systems. 
          I love turning complex problems into clean, working software — from RAG pipelines to real-time web apps.
        </p>
        <p style={{ marginTop: 12, fontSize: 15, color: colors.subtext, lineHeight: 1.7 }}>
          Currently interning as a Software Engineer while co-founding Apex Sky, a startup I've been building since 2023. 
          I thrive at the intersection of backend engineering, machine learning, and product thinking.
        </p>
        <div style={{ marginTop: 24, display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["Java", "Python", "React/Next.js", "FastAPI", "Spring Boot", "AWS", "RAG / LLMs", "MySQL"].map(s => (
            <Tag key={s} label={s} />
          ))}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {[
          { icon: "🎓", title: "Education", sub: "B.S. Computer Science · George Mason University · Dec 2025" },
          { icon: "💼", title: "Current Role", sub: "SWE Intern @ ELINT PRO · Co-Founder @ Apex Sky" },
          { icon: "📍", title: "Location", sub: "Fairfax, VA · Open to Remote" },
          { icon: "📧", title: "Contact", sub: "dheerajyampati@gmail.com" },
        ].map(item => (
          <div key={item.title} style={{
            display: "flex", alignItems: "center", gap: 14,
            padding: "14px 18px", borderRadius: 12,
            background: colors.bg, border: `1px solid ${colors.border}`
          }}>
            <span style={{ fontSize: 22 }}>{item.icon}</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: colors.text }}>{item.title}</div>
              <div style={{ fontSize: 12, color: colors.subtext }}>{item.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </SectionShell>
);

// PROJECTS
const ProjectsSection = () => {
  const projects = [
    { title: "Microsoft ChatBot App", desc: "Connects to Outlook & OneDrive via MS Graph API. Uses bge-m3 embeddings, Weaviate, and Llama 3/Mistral for semantic email & doc search.", tags: ["FastAPI", "RAG", "MS Graph", "LLMs"], color: "#0071e3", icon: "🤖", status: "Live" },
    { title: "TaskFlow", desc: "Full-stack team productivity app with JWT auth, real-time WebSocket task updates, and Docker deployment on AWS.", tags: ["React", "FastAPI", "PostgreSQL", "AWS"], color: "#34c759", icon: "✅", status: "Live" },
    { title: "Immigration Processing System", desc: "JavaFX + MySQL desktop app for managing petition workflows with approver dashboards, DAO layers, and MVC architecture.", tags: ["JavaFX", "MySQL", "MVC", "Spring"], color: "#ff9f0a", icon: "🏛️", status: "Live" },
    { title: "HRMS Modules", desc: "Onboarding, payroll automation, and leave tracking modules built with Spring Boot and MySQL, secured with JWT role-based access.", tags: ["Spring Boot", "MySQL", "JWT", "REST"], color: "#ff3b30", icon: "🏢", status: "In Progress" },
    { title: "AWS Data Pipelines", desc: "Built ETL pipelines using S3, Glue, and Athena with QuickSight dashboards to visualize and process client datasets.", tags: ["AWS", "ETL", "QuickSight", "Athena"], color: "#bf5af2", icon: "☁️", status: "Live" },
    { title: "Portfolio OS", desc: "The app you're in right now — a personal OS-style portfolio with embedded mini apps, AI chatbot, and live projects.", tags: ["React", "Canvas API", "AI", "Design"], color: "#ff6b35", icon: "🖥️", status: "In Progress" },
  ];

  return (
    <SectionShell>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28 }}>
          <div>
            <p style={{ fontSize: 12, fontWeight: 600, color: colors.accent, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>My Work</p>
            <h2 style={{ fontSize: 32, fontWeight: 700, color: colors.text, letterSpacing: "-0.025em" }}>Projects</h2>
          </div>
          <span style={{ fontSize: 13, color: colors.subtext }}>6 projects</span>
        </div>
        <div className="desktop-grid-3" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
          {projects.map((p, i) => (
            <div key={i} className="card" style={{
              borderRadius: 16, padding: "20px",
              border: `1px solid ${colors.border}`,
              background: colors.surfaceSolid,
              boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
              cursor: "pointer"
            }}>
              {/* Preview area */}
              <div style={{
                height: 100, borderRadius: 10, marginBottom: 16,
                background: `linear-gradient(135deg, ${p.color}18, ${p.color}08)`,
                border: `1px solid ${p.color}20`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 36
              }}>{p.icon}</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: colors.text }}>{p.title}</h3>
                <span style={{
                  fontSize: 10, padding: "2px 8px", borderRadius: 20,
                  background: p.status === "Live" ? "#34c75915" : p.status === "Open Source" ? "#0071e315" : "#ff9f0a15",
                  color: p.status === "Live" ? "#34c759" : p.status === "Open Source" ? "#0071e3" : "#ff9f0a",
                  fontWeight: 600, whiteSpace: "nowrap"
                }}>{p.status}</span>
              </div>
              <p style={{ fontSize: 12, color: colors.subtext, lineHeight: 1.6, marginBottom: 12 }}>{p.desc}</p>
              <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                {p.tags.map(t => <Tag key={t} label={t} color={p.color} />)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionShell>
  );
};

// MINI APPS
const MiniAppsSection = () => {
  const [active, setActive] = useState(null);

  const apps = [
    {
      id: "ai-chat",
      icon: "🤖", title: "AI Assistant",
      desc: "A personal AI chatbot that knows everything about me — ask it anything.",
      tag: "AI-Powered", color: "#0071e3",
      preview: <AIChatPreview />
    },
    {
      id: "calculator",
      icon: "🔢", title: "Smart Calculator",
      desc: "A calculator with history, unit conversions, and expression parsing.",
      tag: "Utility", color: "#34c759",
      preview: <CalcPreview />
    },
    {
      id: "todo",
      icon: "✅", title: "Focus Board",
      desc: "A minimal task manager with priority levels and a daily focus view.",
      tag: "Productivity", color: "#ff9f0a",
      preview: <TodoPreview />
    },
    {
      id: "snake",
      icon: "🐍", title: "Snake",
      desc: "Classic snake, rebuilt from scratch. Keyboard or tap to play. Beat the high score.",
      tag: "Game", color: "#ff3b30",
      preview: <SnakeGame />
    },
  ];

  return (
    <SectionShell>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: colors.accent, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>Built & Embedded</p>
        <h2 style={{ fontSize: 32, fontWeight: 700, color: colors.text, letterSpacing: "-0.025em", marginBottom: 6 }}>Mini Apps</h2>
        <p style={{ fontSize: 14, color: colors.subtext, marginBottom: 28 }}>Real apps — right here, no links needed. Click to launch.</p>

        <div className="mini-apps-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {apps.map(app => (
            <div key={app.id}>
              <div className="mini-app card" onClick={() => setActive(active === app.id ? null : app.id)} style={{
                borderRadius: 16, padding: "20px",
                border: `1px solid ${active === app.id ? app.color + "40" : colors.border}`,
                background: active === app.id ? `${app.color}06` : colors.surfaceSolid,
                cursor: "pointer",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 12,
                      background: `${app.color}15`, display: "flex",
                      alignItems: "center", justifyContent: "center", fontSize: 22
                    }}>{app.icon}</div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14, color: colors.text }}>{app.title}</div>
                      <Tag label={app.tag} color={app.color} />
                    </div>
                  </div>
                  <div style={{
                    fontSize: 11, padding: "5px 12px", borderRadius: 980,
                    background: active === app.id ? app.color : colors.bg,
                    color: active === app.id ? "#fff" : colors.subtext,
                    fontWeight: 500, transition: "all 0.2s ease"
                  }}>{active === app.id ? "Close" : "Launch"}</div>
                </div>
                <p style={{ fontSize: 12, color: colors.subtext, marginTop: 10, lineHeight: 1.6 }}>{app.desc}</p>
              </div>

              {/* Expanded Preview */}
              {active === app.id && app.preview && (
                <div className="scaleIn" style={{
                  marginTop: 8, borderRadius: 14,
                  border: `1px solid ${app.color}30`,
                  overflow: "hidden", background: colors.bg,
                }}>
                  {app.preview}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </SectionShell>
  );
};

// ─── SNAKE GAME ───────────────────────────────────────────────────
const CELL = 20;
const COLS = 18;
const ROWS = 16;
const W = CELL * COLS;
const H = CELL * ROWS;

function initSnake() {
  return [{ x: 8, y: 8 }, { x: 7, y: 8 }, { x: 6, y: 8 }];
}
function randomFood(snake) {
  let pos;
  do {
    pos = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
  } while (snake.some(s => s.x === pos.x && s.y === pos.y));
  return pos;
}

const SnakeGame = () => {
  const canvasRef = useRef(null);
  const stateRef = useRef({
    snake: initSnake(),
    dir: { x: 1, y: 0 },
    nextDir: { x: 1, y: 0 },
    food: { x: 14, y: 8 },
    score: 0,
    phase: "idle", // idle | running | dead
    hiScore: 0,
    particles: [],
    flashFood: 0,
  });
  const [display, setDisplay] = useState({ score: 0, hi: 0, phase: "idle" });
  const rafRef = useRef(null);
  const lastTickRef = useRef(0);

  const SPEED = () => {
    const s = stateRef.current.score;
    if (s >= 20) return 90;
    if (s >= 10) return 110;
    return 140;
  };

  // Draw
  const draw = (ts) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const st = stateRef.current;

    // Tick
    if (st.phase === "running" && ts - lastTickRef.current > SPEED()) {
      lastTickRef.current = ts;
      tick();
    }

    // Update particles
    st.particles = st.particles
      .map(p => ({ ...p, x: p.x + p.vx, y: p.y + p.vy, life: p.life - 1, vy: p.vy + 0.1 }))
      .filter(p => p.life > 0);

    st.flashFood = Math.max(0, st.flashFood - 1);

    // BG
    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = "rgba(255,255,255,0.03)";
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= COLS; x++) { ctx.beginPath(); ctx.moveTo(x * CELL, 0); ctx.lineTo(x * CELL, H); ctx.stroke(); }
    for (let y = 0; y <= ROWS; y++) { ctx.beginPath(); ctx.moveTo(0, y * CELL); ctx.lineTo(W, y * CELL); ctx.stroke(); }

    // Food glow
    const fx = st.food.x * CELL + CELL / 2;
    const fy = st.food.y * CELL + CELL / 2;
    const pulse = 0.5 + 0.5 * Math.sin(ts / 300);
    const grd = ctx.createRadialGradient(fx, fy, 0, fx, fy, CELL * 1.4);
    grd.addColorStop(0, `rgba(255,59,48,${0.35 + 0.15 * pulse})`);
    grd.addColorStop(1, "rgba(255,59,48,0)");
    ctx.fillStyle = grd;
    ctx.beginPath(); ctx.arc(fx, fy, CELL * 1.4, 0, Math.PI * 2); ctx.fill();

    // Food
    const foodScale = st.flashFood > 0 ? 1 + 0.3 * (st.flashFood / 10) : 1;
    ctx.save();
    ctx.translate(fx, fy);
    ctx.scale(foodScale, foodScale);
    ctx.fillStyle = "#ff3b30";
    ctx.shadowColor = "#ff3b30";
    ctx.shadowBlur = 12;
    roundRect(ctx, -CELL / 2 + 3, -CELL / 2 + 3, CELL - 6, CELL - 6, 5);
    ctx.fill();
    ctx.restore();
    ctx.shadowBlur = 0;

    // Snake
    st.snake.forEach((seg, i) => {
      const isHead = i === 0;
      const t = i / st.snake.length;
      const alpha = 1 - t * 0.4;
      const r = isHead ? 7 : 5;
      ctx.fillStyle = isHead
        ? `rgba(52,199,89,${alpha})`
        : `rgba(52,199,89,${alpha * 0.85})`;
      ctx.shadowColor = isHead ? "rgba(52,199,89,0.6)" : "transparent";
      ctx.shadowBlur = isHead ? 16 : 0;
      roundRect(ctx, seg.x * CELL + 2, seg.y * CELL + 2, CELL - 4, CELL - 4, r);
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    // Eyes on head
    if (st.snake.length > 0 && st.phase !== "dead") {
      const h = st.snake[0];
      const d = st.dir;
      const cx = h.x * CELL + CELL / 2;
      const cy = h.y * CELL + CELL / 2;
      const perp = { x: -d.y, y: d.x };
      [1, -1].forEach(side => {
        const ex = cx + d.x * 4 + perp.x * 3 * side;
        const ey = cy + d.y * 4 + perp.y * 3 * side;
        ctx.fillStyle = "#fff";
        ctx.beginPath(); ctx.arc(ex, ey, 2.2, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#1a1a1a";
        ctx.beginPath(); ctx.arc(ex + d.x * 0.8, ey + d.y * 0.8, 1.2, 0, Math.PI * 2); ctx.fill();
      });
    }

    // Particles
    st.particles.forEach(p => {
      ctx.globalAlpha = p.life / 20;
      ctx.fillStyle = p.color;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
    });
    ctx.globalAlpha = 1;

    // Overlays
    if (st.phase === "idle") {
      drawOverlay(ctx, "🐍 SNAKE", "Press Space or tap Play", "#34c759");
    } else if (st.phase === "dead") {
      drawOverlay(ctx, `Score: ${st.score}`, st.score >= st.hiScore && st.score > 0 ? "🏆 New High Score!" : `Best: ${st.hiScore} — Tap to Restart`, "#ff3b30");
    }

    rafRef.current = requestAnimationFrame(draw);
  };

  const drawOverlay = (ctx, title, sub, accent) => {
    ctx.fillStyle = "rgba(0,0,0,0.65)";
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = accent;
    ctx.font = "bold 22px -apple-system, BlinkMacSystemFont";
    ctx.textAlign = "center";
    ctx.shadowColor = accent;
    ctx.shadowBlur = 20;
    ctx.fillText(title, W / 2, H / 2 - 12);
    ctx.shadowBlur = 0;
    ctx.fillStyle = "rgba(255,255,255,0.6)";
    ctx.font = "13px -apple-system, BlinkMacSystemFont";
    ctx.fillText(sub, W / 2, H / 2 + 14);
    ctx.textAlign = "left";
  };

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y); ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h - r); ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h); ctx.arcTo(x, y + h, x, y + h - r, r);
    ctx.lineTo(x, y + r); ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();
  }

  const spawnParticles = (x, y) => {
    const pcs = Array.from({ length: 14 }, () => ({
      x: x * CELL + CELL / 2, y: y * CELL + CELL / 2,
      vx: (Math.random() - 0.5) * 4, vy: (Math.random() - 0.5) * 4,
      r: Math.random() * 3 + 1.5, life: 20,
      color: ["#ff3b30", "#ff6b6b", "#ffcc00"][Math.floor(Math.random() * 3)]
    }));
    stateRef.current.particles.push(...pcs);
  };

  const tick = () => {
    const st = stateRef.current;
    st.dir = st.nextDir;
    const head = { x: st.snake[0].x + st.dir.x, y: st.snake[0].y + st.dir.y };

    // Wall collision
    if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) {
      die(); return;
    }
    // Self collision
    if (st.snake.some(s => s.x === head.x && s.y === head.y)) {
      die(); return;
    }

    const ate = head.x === st.food.x && head.y === st.food.y;
    const newSnake = [head, ...st.snake];
    if (!ate) newSnake.pop();

    st.snake = newSnake;

    if (ate) {
      st.score += 1;
      st.flashFood = 10;
      spawnParticles(st.food.x, st.food.y);
      st.food = randomFood(st.snake);
      setDisplay(d => ({ ...d, score: st.score }));
    }
  };

  const die = () => {
    const st = stateRef.current;
    if (st.score > st.hiScore) st.hiScore = st.score;
    st.phase = "dead";
    setDisplay({ score: st.score, hi: st.hiScore, phase: "dead" });
  };

  const startGame = () => {
    const st = stateRef.current;
    const hi = st.hiScore;
    stateRef.current = {
      snake: initSnake(), dir: { x: 1, y: 0 }, nextDir: { x: 1, y: 0 },
      food: { x: 14, y: 8 }, score: 0, phase: "running",
      hiScore: hi, particles: [], flashFood: 0
    };
    lastTickRef.current = 0;
    setDisplay({ score: 0, hi, phase: "running" });
  };

  const handleKey = (e) => {
    const st = stateRef.current;
    if (st.phase !== "running") { if (e.key === " ") startGame(); return; }
    const map = { ArrowUp: { x:0,y:-1 }, ArrowDown: { x:0,y:1 }, ArrowLeft: { x:-1,y:0 }, ArrowRight: { x:1,y:0 }, w: { x:0,y:-1 }, s: { x:0,y:1 }, a: { x:-1,y:0 }, d: { x:1,y:0 } };
    const nd = map[e.key];
    if (nd && !(nd.x === -st.dir.x && nd.y === -st.dir.y)) {
      st.nextDir = nd;
      e.preventDefault();
    }
  };

  useEffect(() => {
    rafRef.current = requestAnimationFrame(draw);
    window.addEventListener("keydown", handleKey);
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener("keydown", handleKey); };
  }, []);

  const DPad = () => {
    const press = (dir) => {
      const st = stateRef.current;
      if (st.phase !== "running") return;
      if (!(dir.x === -st.dir.x && dir.y === -st.dir.y)) st.nextDir = dir;
    };
    const btnStyle = (active) => ({
      width: 44, height: 44, borderRadius: 10, border: "none",
      background: "rgba(255,255,255,0.1)", color: "#fff",
      fontSize: 18, cursor: "pointer", display: "flex",
      alignItems: "center", justifyContent: "center",
      userSelect: "none", WebkitUserSelect: "none"
    });
    return (
      <div style={{ display: "grid", gridTemplateColumns: "44px 44px 44px", gridTemplateRows: "44px 44px 44px", gap: 4 }}>
        <div />
        <button style={btnStyle()} onPointerDown={() => press({ x:0, y:-1 })}>▲</button>
        <div />
        <button style={btnStyle()} onPointerDown={() => press({ x:-1, y:0 })}>◀</button>
        <div style={{ width:44,height:44,borderRadius:10,background:"rgba(255,255,255,0.05)", display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:"rgba(255,255,255,0.3)" }}>D</div>
        <button style={btnStyle()} onPointerDown={() => press({ x:1, y:0 })}>▶</button>
        <div />
        <button style={btnStyle()} onPointerDown={() => press({ x:0, y:1 })}>▼</button>
        <div />
      </div>
    );
  };

  return (
    <div style={{ background: "#1a1a1a", borderRadius: 14, overflow: "hidden" }}>
      {/* HUD */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 16px", background: "rgba(0,0,0,0.4)" }}>
        <div style={{ display: "flex", gap: 20 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Score</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#34c759", letterSpacing: "-0.03em" }}>{display.score}</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Best</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "rgba(255,255,255,0.5)", letterSpacing: "-0.03em" }}>{display.hi}</div>
          </div>
        </div>
        <button
          onPointerDown={startGame}
          style={{
            padding: "7px 18px", borderRadius: 980, border: "none",
            background: display.phase === "running" ? "rgba(255,59,48,0.2)" : "#34c759",
            color: display.phase === "running" ? "#ff3b30" : "#fff",
            fontSize: 12, fontWeight: 600, cursor: "pointer",
            letterSpacing: "0.02em"
          }}>
          {display.phase === "running" ? "Restart" : display.phase === "dead" ? "Play Again" : "Play"}
        </button>
      </div>

      {/* Canvas */}
      <div style={{ position: "relative", lineHeight: 0 }}>
        <canvas ref={canvasRef} width={W} height={H} style={{ display: "block", width: "100%", maxWidth: W }} />
      </div>

      {/* D-Pad */}
      <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 16px", background: "rgba(0,0,0,0.3)" }}>
        <DPad />
      </div>
    </div>
  );
};

// Mini App Previews
const AIChatPreview = () => {
  const [msgs, setMsgs] = useState([
    { role: "ai", text: "Hey! I'm an AI built to tell you all about Dheeraj — his projects, skills, experience at ELINT PRO & VSoft, or his startup Apex Sky. What would you like to know? 👋" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMsgs(m => [...m, { role: "user", text: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: `You are a friendly AI assistant embedded in Dheeraj Yampati's personal portfolio website. You know everything about Dheeraj and answer questions about him warmly and concisely (2-3 sentences max).

Here is everything about Dheeraj:

NAME: Dheeraj Yampati
LOCATION: Fairfax, VA
EMAIL: dheerajyampati@gmail.com
PHONE: +1 (571) 373-6664

EDUCATION: Bachelor of Science in Computer Science from George Mason University, Fairfax VA. Graduated December 2025. Relevant coursework includes OS, Software Engineering, Secure Programming, Computer Graphics, Autonomous Robotics, AI, Machine Learning, Cloud Computing (AWS), DSA.

CURRENT ROLES:
- Software Engineering Intern at ELINT PRO Solutions (Sep 2025–Present, Remote): Building HRMS modules for onboarding, payroll automation, and leave tracking using Java Spring Boot and MySQL. Implemented JWT-secured REST APIs and optimized SQL queries.
- Co-Founder at Apex Sky (Jan 2023–Present, Fairfax VA): Co-founded a startup, defined product vision and business strategy, pitched to investors, engaged with CEOs and professors for feedback.

PAST EXPERIENCE:
- Machine Learning Intern at VSoft Consulting, Hyderabad (Jun–Aug 2025): Built AWS data pipelines (S3, Glue, Athena, QuickSight), created RAG pipelines with Weaviate, bge-m3 embeddings, Mistral and Llama 3 for document search and summarization. Led daily scrums.
- Software Engineering Intern at Think Analytix, Irving TX Remote (Jun–Aug 2024): Built full-stack features for dashboards using React, FastAPI, PostgreSQL. Developed REST APIs for profile management and search.

PROJECTS:
1. Microsoft ChatBot App — connects to Outlook and OneDrive via Microsoft Graph API, uses bge-m3 embeddings and Weaviate for semantic search, Mistral and Llama 3 for natural language answers. Backend in FastAPI.
2. TaskFlow — full-stack team productivity app with React, FastAPI, PostgreSQL, JWT auth, WebSocket real-time updates, containerized with Docker and deployed on AWS.
3. Immigration Processing System — full-stack JavaFX + MySQL desktop application for managing petition workflows, approver dashboards, DAO layers, MVC architecture, built as a semester-long software engineering project.

SKILLS:
- Languages: Java, Python, C/C++, SQL, JavaScript (React/Next.js), Bash
- Data: MySQL, ETL pipelines, Apache POI, Pandas, Weaviate (Vector DB)
- Cloud: AWS (EC2, S3, Glue, Athena, QuickSight), MS Graph API
- ML/AI: Scikit-learn, RAG Architectures, bge-m3, Llama 3, Mistral embeddings
- Tools: Spring Boot, FastAPI, JavaFX, Git/GitHub, Maven, Postman, Docker

PERSONALITY: Dheeraj is ambitious, entrepreneurial, and deeply technical. He's a recent CS grad who has already worked across full-stack development, machine learning, cloud infrastructure, and entrepreneurship. He cares about building real things that work.

Always answer in a warm, confident, first-person style on Dheeraj's behalf. Keep responses to 2-3 sentences. If asked something not covered above, give a reasonable and enthusiastic answer that fits Dheeraj's profile.`,
          messages: [{ role: "user", content: userMsg }]
        })
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || "I'm not sure about that!";
      setMsgs(m => [...m, { role: "ai", text: reply }]);
    } catch {
      setMsgs(m => [...m, { role: "ai", text: "Hmm, something went wrong. Try again!" }]);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: 16, height: 320, display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10 }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
            <div style={{
              maxWidth: "78%", padding: "10px 14px", borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
              background: m.role === "user" ? colors.accent : "#fff",
              color: m.role === "user" ? "#fff" : colors.text,
              fontSize: 13, lineHeight: 1.5,
              boxShadow: "0 1px 4px rgba(0,0,0,0.08)"
            }}>{m.text}</div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", gap: 4, padding: "10px 14px", width: "fit-content", background: "#fff", borderRadius: "16px 16px 16px 4px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
            {[0,1,2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: colors.subtext, animation: `pulse 1.2s ${i*0.2}s infinite` }} />)}
          </div>
        )}
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()}
          placeholder="Ask me anything..." style={{
            flex: 1, padding: "10px 14px", borderRadius: 980,
            border: `1px solid ${colors.border}`, outline: "none",
            fontSize: 13, background: "#fff", color: colors.text
          }} />
        <button onClick={send} style={{
          padding: "10px 18px", borderRadius: 980, border: "none",
          background: colors.accent, color: "#fff", fontSize: 13, fontWeight: 500, cursor: "pointer"
        }}>Send</button>
      </div>
    </div>
  );
};

const CalcPreview = () => {
  const [display, setDisplay] = useState("0");
  const [history, setHistory] = useState([]);
  const press = (v) => {
    if (v === "C") { setDisplay("0"); return; }
    if (v === "=") {
      try {
        const result = String(eval(display.replace("×","*").replace("÷","/")));
        setHistory(h => [`${display} = ${result}`, ...h.slice(0,3)]);
        setDisplay(result);
      } catch { setDisplay("Error"); }
      return;
    }
    setDisplay(d => d === "0" ? v : d + v);
  };
  const btns = ["C","(",")","%","7","8","9","÷","4","5","6","×","1","2","3","-","0",".","=","+"];
  return (
    <div style={{ padding: 16 }}>
      {history.length > 0 && <div style={{ marginBottom: 8, fontSize: 11, color: colors.subtext }}>{history[0]}</div>}
      <div style={{ textAlign: "right", fontSize: 28, fontWeight: 300, padding: "8px 4px 12px", color: colors.text, letterSpacing: "-0.02em" }}>{display}</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
        {btns.map(b => (
          <button key={b} onClick={() => press(b)} style={{
            padding: "12px", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 15, fontWeight: 500,
            background: b === "=" ? colors.accent : ["C","(",")","%"].includes(b) ? "#f0f0f0" : ["÷","×","-","+"].includes(b) ? "#e8f0fe" : "#fff",
            color: b === "=" ? "#fff" : ["÷","×","-","+"].includes(b) ? colors.accent : colors.text,
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)"
          }}>{b}</button>
        ))}
      </div>
    </div>
  );
};

const TodoPreview = () => {
  const [todos, setTodos] = useState([
    { id: 1, text: "Finish portfolio homepage", done: false, priority: "high" },
    { id: 2, text: "Deploy mini apps", done: true, priority: "medium" },
    { id: 3, text: "Add project previews", done: false, priority: "high" },
  ]);
  const [input, setInput] = useState("");
  const toggle = (id) => setTodos(t => t.map(x => x.id === id ? {...x, done: !x.done} : x));
  const add = () => { if (!input.trim()) return; setTodos(t => [...t, { id: Date.now(), text: input, done: false, priority: "medium" }]); setInput(""); };
  const pColor = { high: "#ff3b30", medium: "#ff9f0a", low: "#34c759" };

  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && add()}
          placeholder="Add a task..." style={{
            flex: 1, padding: "9px 14px", borderRadius: 980,
            border: `1px solid ${colors.border}`, outline: "none", fontSize: 13, background: "#fff"
          }} />
        <button onClick={add} style={{ padding: "9px 16px", borderRadius: 980, border: "none", background: colors.accent, color: "#fff", fontSize: 13, cursor: "pointer" }}>+</button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {todos.map(t => (
          <div key={t.id} onClick={() => toggle(t.id)} style={{
            display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
            borderRadius: 10, background: "#fff", cursor: "pointer",
            border: `1px solid ${colors.border}`, opacity: t.done ? 0.5 : 1
          }}>
            <div style={{
              width: 18, height: 18, borderRadius: "50%",
              border: `2px solid ${t.done ? colors.green : colors.border}`,
              background: t.done ? colors.green : "transparent",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
            }}>{t.done && <span style={{ color: "#fff", fontSize: 10 }}>✓</span>}</div>
            <span style={{ flex: 1, fontSize: 13, color: colors.text, textDecoration: t.done ? "line-through" : "none" }}>{t.text}</span>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: pColor[t.priority] }} />
          </div>
        ))}
      </div>
    </div>
  );
};

// RESUME
const ResumeSection = () => (
  <SectionShell>
    <div style={{ maxWidth: 760, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32 }}>
        <div>
          <p style={{ fontSize: 12, fontWeight: 600, color: colors.accent, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>Experience</p>
          <h2 style={{ fontSize: 32, fontWeight: 700, color: colors.text, letterSpacing: "-0.025em" }}>Résumé</h2>
        </div>
        <button className="btn-primary" style={{
          background: colors.accent, color: "#fff", border: "none",
          padding: "10px 20px", borderRadius: 980, fontSize: 13, fontWeight: 500, cursor: "pointer",
          display: "flex", alignItems: "center", gap: 6
        }}>↓ Download PDF</button>
      </div>

      {/* Experience */}
      <div style={{ marginBottom: 32 }}>
        <h3 style={{ fontSize: 13, fontWeight: 600, color: colors.subtext, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 16 }}>Work Experience</h3>
        {[
          { role: "Software Engineering Intern", co: "ELINT PRO Solutions · Waxhaw, NC (Remote)", period: "Sep 2025–Present", bullets: ["Built HRMS modules for onboarding, payroll automation, and leave tracking using Java Spring Boot and MySQL", "Implemented secure REST APIs with JWT role-based access, improving data consistency across HR dashboards", "Optimized SQL queries and added caching to reduce response times on frequently accessed endpoints"] },
          { role: "Machine Learning Intern", co: "VSoft Consulting · Hyderabad, IND", period: "Jun–Aug 2025", bullets: ["Built AWS data pipelines (S3, Glue, Athena, QuickSight) to process and visualize client datasets", "Created RAG pipelines with Weaviate, bge-m3 embeddings, and Mistral/Llama 3 for document search & summarization", "Led daily scrums and presented sprint progress to managers and investors, ensuring on-time delivery"] },
          { role: "Software Engineering Intern", co: "Think Analytix · Irving, TX (Remote)", period: "Jun–Aug 2024", bullets: ["Built full-stack features for internal dashboards using React, FastAPI, and PostgreSQL", "Developed and improved REST APIs for profile management, search, and filtering", "Added validation, error handling, and UI improvements to streamline recruiter workflows"] },
          { role: "Co-Founder", co: "Apex Sky · Fairfax, VA", period: "Jan 2023–Present", bullets: ["Co-founded the company; defined product vision and business strategy while validating market opportunities", "Engaged with professors, CEOs, and senior leaders for expert feedback; iterated on go-to-market plans", "Pitched roadmap to potential investors and managed stakeholder communications"] },
        ].map((exp, i) => (
          <div key={i} style={{ paddingLeft: 20, borderLeft: `2px solid ${colors.border}`, marginBottom: 20, position: "relative" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: colors.accent, position: "absolute", left: -5, top: 5 }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 15, color: colors.text }}>{exp.role}</div>
                <div style={{ fontSize: 13, color: colors.subtext }}>{exp.co}</div>
              </div>
              <Tag label={exp.period} />
            </div>
            <ul style={{ marginTop: 10, paddingLeft: 16 }}>
              {exp.bullets.map((b, j) => <li key={j} style={{ fontSize: 13, color: colors.subtext, lineHeight: 1.7 }}>{b}</li>)}
            </ul>
          </div>
        ))}
      </div>

      {/* Skills Grid */}
      <div>
        <h3 style={{ fontSize: 13, fontWeight: 600, color: colors.subtext, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 16 }}>Skills</h3>
        <div className="desktop-grid-skills" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {[
            { cat: "Languages", skills: "Java, Python, C/C++, JavaScript, SQL, Bash" },
            { cat: "Frontend", skills: "React, Next.js, JavaFX, REST APIs" },
            { cat: "Backend", skills: "Spring Boot, FastAPI, Node.js, Maven" },
            { cat: "AI / ML", skills: "RAG, Weaviate, bge-m3, Llama 3, Mistral, Scikit-learn" },
            { cat: "Cloud & Data", skills: "AWS (EC2, S3, Glue, Athena), MySQL, PostgreSQL, ETL" },
            { cat: "Tools", skills: "Git/GitHub, Docker, Postman, MS Graph API, Apache POI" },
          ].map(s => (
            <div key={s.cat} style={{ padding: "14px 16px", borderRadius: 12, background: colors.bg, border: `1px solid ${colors.border}` }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: colors.accent, marginBottom: 4 }}>{s.cat}</div>
              <div style={{ fontSize: 12, color: colors.subtext, lineHeight: 1.6 }}>{s.skills}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </SectionShell>
);

// CONTACT
const ContactSection = () => {
  const [form, setForm] = useState({ name: "", email: "", msg: "" });
  const [sent, setSent] = useState(false);

  return (
    <SectionShell>
      <div style={{ maxWidth: 620, margin: "0 auto", textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>👋</div>
        <p style={{ fontSize: 12, fontWeight: 600, color: colors.accent, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>Get In Touch</p>
        <h2 style={{ fontSize: 36, fontWeight: 700, color: colors.text, letterSpacing: "-0.025em" }}>Let's Work Together</h2>
        <p style={{ fontSize: 15, color: colors.subtext, marginTop: 10, marginBottom: 32, lineHeight: 1.7 }}>
          I'm open to new projects, collaborations, and conversations. Drop me a message and I'll get back within 24 hours.
        </p>

        {sent ? (
          <div style={{ padding: 32, borderRadius: 16, background: "#34c75910", border: "1px solid #34c75930" }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>✅</div>
            <div style={{ fontWeight: 600, color: colors.text }}>Message sent!</div>
            <div style={{ fontSize: 13, color: colors.subtext, marginTop: 6 }}>I'll reply within 24 hours.</div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[["name","Your name","text"],["email","your@email.com","email"]].map(([k, ph, type]) => (
              <input key={k} type={type} placeholder={ph} value={form[k]} onChange={e => setForm(f => ({...f, [k]: e.target.value}))} style={{
                width: "100%", padding: "13px 16px", borderRadius: 12,
                border: `1px solid ${colors.border}`, outline: "none",
                fontSize: 14, background: colors.bg, color: colors.text
              }} />
            ))}
            <textarea placeholder="What's on your mind?" rows={4} value={form.msg} onChange={e => setForm(f => ({...f, msg: e.target.value}))} style={{
              width: "100%", padding: "13px 16px", borderRadius: 12,
              border: `1px solid ${colors.border}`, outline: "none",
              fontSize: 14, background: colors.bg, color: colors.text, resize: "vertical"
            }} />
            <button className="btn-primary" onClick={() => setSent(true)} style={{
              background: colors.accent, color: "#fff", border: "none",
              padding: "14px", borderRadius: 980, fontSize: 15, fontWeight: 500, cursor: "pointer"
            }}>Send Message →</button>
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 28, flexWrap: "wrap" }}>
          {[
            { label: "GitHub",   icon: "⌥", href: "https://github.com/Dheeraj-Rex" },
            { label: "LinkedIn", icon: "in", href: "https://linkedin.com/in/dheerajyampati" },
            { label: "Email",    icon: "✉",  href: "mailto:dheerajyampati@gmail.com" },
          ].map(({ label, icon, href }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer"
              style={{
                display: "flex", alignItems: "center", gap: 6, fontSize: 13,
                color: colors.subtext, padding: "8px 16px", borderRadius: 980,
                border: `1px solid ${colors.border}`, background: colors.bg,
                textDecoration: "none", transition: "all 0.15s ease",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = colors.accent; e.currentTarget.style.color = colors.accent; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = colors.border; e.currentTarget.style.color = colors.subtext; }}
            >
              <span style={{ fontWeight: 600 }}>{icon}</span>
              <span>{label}</span>
            </a>
          ))}
        </div>
      </div>
    </SectionShell>
  );
};

// ─── DOCK ─────────────────────────────────────────────────────────
const dockItems = [
  { id: "home",     icon: "🏠", label: "Home" },
  { id: "about",    icon: "👤", label: "About" },
  { id: "projects", icon: "🗂️", label: "Projects" },
  { id: "miniapps", icon: "✦",  label: "Mini Apps" },
  { id: "resume",   icon: "📄", label: "Résumé" },
  { id: "contact",  icon: "📬", label: "Contact" },
];

const Dock = ({ active, onNav }) => (
  <div style={{
    position: "fixed", bottom: 16, left: "50%", transform: "translateX(-50%)",
    background: colors.dock,
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    borderRadius: 22,
    padding: "8px 14px",
    border: `1px solid rgba(255,255,255,0.6)`,
    boxShadow: "0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)",
    display: "flex",
    alignItems: "flex-end",
    gap: 4,
    zIndex: 100,
    maxWidth: "calc(100vw - 32px)",
  }}>
    {dockItems.map(item => (
      <div key={item.id} className="dock-icon" onClick={() => onNav(item.id)} style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{
          width: 48, height: 48, borderRadius: 13,
          background: active === item.id ? `${colors.accent}18` : "transparent",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 26,
          border: active === item.id ? `1.5px solid ${colors.accent}30` : "1.5px solid transparent",
        }}>{item.icon}</div>
        {active === item.id && (
          <div style={{ width: 4, height: 4, borderRadius: "50%", background: colors.accent, marginTop: 4 }} />
        )}
      </div>
    ))}
  </div>
);

// ─── MENU BAR ──────────────────────────────────────────────────────
const MenuBar = ({ section }) => {
  const [time, setTime] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t); }, []);
  const labels = { home:"Home", about:"About Me", projects:"Projects", miniapps:"Mini Apps", resume:"Résumé", contact:"Contact" };

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: "rgba(245,245,247,0.85)", backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      borderBottom: `1px solid ${colors.border}`,
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "0 20px", height: 44
    }}>
      <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
        <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.03em", color: colors.text }}>DY · Portfolio</span>
        <span className="nav-pill" style={{ fontSize: 13, fontWeight: 500, color: colors.text, padding: "4px 8px", borderRadius: 6 }}>{labels[section]}</span>
      </div>
      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <span style={{ fontSize: 13, color: colors.subtext }}>
          {time.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })} · {time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>
    </div>
  );
};

// ─── APP ROOT ──────────────────────────────────────────────────────
export default function PortfolioOS() {
  const [section, setSection] = useState("home");

  const sectionMap = {
    home:     <HomeSection onNav={setSection} />,
    about:    <AboutSection />,
    projects: <ProjectsSection />,
    miniapps: <MiniAppsSection />,
    resume:   <ResumeSection />,
    contact:  <ContactSection />,
  };

  return (
    <div style={{ minHeight: "100vh", background: colors.bg, fontFamily: font }}>
      <style>{globalStyle}</style>
      <MenuBar section={section} />
      <div key={section} style={{
        paddingTop: 64, paddingBottom: 110, paddingLeft: 16, paddingRight: 16,
        maxWidth: 1000, margin: "0 auto",
        animation: "fadeIn 0.3s ease both"
      }}>
        {sectionMap[section]}
      </div>
      <Dock active={section} onNav={setSection} />
    </div>
  );
}
