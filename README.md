# 🖥️ Dheeraj Yampati — Portfolio OS

A personal portfolio designed as an operating system. Built with React + Vite, deployed on Vercel.

---

## 🚀 Deploy in 10 Minutes

### Step 1 — Install Node.js (if you haven't)
Download from https://nodejs.org (LTS version recommended)

---

### Step 2 — Set up the project locally

```bash
# Navigate into the folder
cd portfolio-os

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open http://localhost:5173 — you should see your Portfolio OS running live. ✅

---

### Step 3 — Push to GitHub

1. Go to https://github.com and create a **new repository** called `portfolio-os`
2. Make it **Public** (required for free Vercel deployments)
3. Then run these commands in your terminal:

```bash
git init
git add .
git commit -m "🚀 Initial Portfolio OS"
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/portfolio-os.git
git push -u origin main
```

> Replace `YOUR_GITHUB_USERNAME` with your actual GitHub username.

---

### Step 4 — Deploy to Vercel

1. Go to https://vercel.com and sign in with GitHub
2. Click **"Add New Project"**
3. Select your `portfolio-os` repository
4. Vercel auto-detects Vite — just click **"Deploy"**
5. Done! You'll get a live URL like `dheeraj-portfolio-os.vercel.app`

---

### Step 5 — Set up your API key (for AI Chatbot)

The AI assistant in Mini Apps needs your Anthropic API key.

**Get your key:**
1. Go to https://console.anthropic.com
2. Create an account → API Keys → Create Key
3. Copy the key (starts with `sk-ant-...`)

**Add it to Vercel:**
1. In your Vercel project → **Settings** → **Environment Variables**
2. Add:
   - Name: `VITE_ANTHROPIC_API_KEY`
   - Value: `sk-ant-your-key-here`
3. Click **Save** → go to **Deployments** → **Redeploy**

---

### Step 6 — Custom Domain (Optional but 🔥)

1. Buy a domain on Namecheap or Google Domains (e.g. `dheerajyampati.dev`)
2. In Vercel → your project → **Settings** → **Domains**
3. Add your domain and follow the DNS instructions
4. Takes ~5 minutes to go live

---

## 📁 Project Structure

```
portfolio-os/
├── public/
│   └── favicon.svg          # DY branded favicon
├── src/
│   ├── main.jsx             # React entry point
│   └── App.jsx              # Full Portfolio OS (all sections + mini apps)
├── index.html               # HTML shell
├── vite.config.js           # Vite config
├── vercel.json              # Vercel SPA routing
├── .env.example             # Environment variable template
├── .gitignore
└── package.json
```

---

## 🛠️ Making Changes

All your content lives in `src/App.jsx`. Here's where to find each section:

| Section | Search for in App.jsx |
|---|---|
| Your name / hero | `const HomeSection` |
| Bio & quick facts | `const AboutSection` |
| Projects | `const ProjectsSection` → `const projects` array |
| Mini Apps | `const MiniAppsSection` |
| AI Chatbot knowledge | `system:` inside `AIChatPreview` |
| Resume / Experience | `const ResumeSection` |
| Contact | `const ContactSection` |

After making changes:
```bash
git add .
git commit -m "update: your message here"
git push
```
Vercel automatically redeploys on every push. ⚡

---

## ✨ Coming Next (Ideas)

- [ ] Add a profile photo (replace the 👤 emoji in HomeSection)
- [ ] Add Breakout or 2048 as a second game
- [ ] Add scroll animations with Framer Motion
- [ ] Add a blog section (MDX or Notion API)
- [ ] Add dark/light mode toggle

---

Built with React · Vite · Deployed on Vercel
