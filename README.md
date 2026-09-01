# ⚡ PulseGuard AI — Autonomous Observability, API Monitoring & Status Pages

[![Uptime](https://img.shields.io/badge/Uptime-99.99%25-emerald?style=flat-square&logo=statuspage)](https://pulseguard-ai.vercel.app/status/demo)
[![Next.js 15](https://img.shields.io/badge/Next.js-15.2-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Deployment](https://img.shields.io/badge/Vercel-Production%20Ready-black?style=flat-square&logo=vercel)](https://pulseguard-ai.vercel.app)
[![Cost](https://img.shields.io/badge/Hosting%20Cost-%240%2Fmonth-brightgreen?style=flat-square)]()

> **PulseGuard AI** is a $1M ARR-ready, enterprise-grade B2B SaaS platform for modern engineering teams. It provides automated synthetic uptime and API health monitoring, SSL certificate expiration tracking, autonomous AI incident post-mortems, white-labeled public status pages, webhook alerts (Slack, Discord, MS Teams), and a developer REST API hub — engineered for **$0 spend** on Vercel's global edge network.

---

## 🚀 Key Features

### 1. 🌐 Multi-Protocol Synthetic Probes
- **HTTP / HTTPS / REST**: Measure TTFB, HTTP status codes, response headers, and keyword assertions.
- **SSL Certificate Inspector**: Monitor certificate expiration countdown, issuer verification, and validity periods.
- **Sub-30s Check Frequencies**: Instant anomaly detection with multi-region consensus verification.

### 2. 🤖 Autonomous AI Post-Mortems
- Synthesizes telemetry anomalies, incident update logs, and error trends into complete executive Root-Cause Analysis (RCA) documents with mitigation checklists and timelines.

### 3. 📊 Hosted Public Status Pages & Badge Embeds
- Instant white-labeled public status page (`/status/demo`) with 90-day SLA uptime bars and component grouping.
- Dynamic SVG status and uptime badges (`/api/badge/[id]`) for GitHub READMEs and documentation.

### 4. 🚨 Multi-Channel Alerting
- Real-time incident dispatching to Slack Incoming Webhooks, Discord Webhooks, Microsoft Teams, and custom JSON webhook endpoints.

### 5. 🔌 Developer REST API & Multi-Language SDKs
- Scoped API key generator (`pg_live_...`).
- Interactive live REST API Sandbox for immediate edge probe execution.
- Ready-to-copy integration code in **cURL**, **TypeScript**, **Python**, and **Go**.

### 6. 💼 Multi-Tenant Workspaces & RBAC
- Role-based access control (`Owner`, `Admin`, `Engineer`, `Viewer`).
- Simulated Stripe / LemonSqueezy subscription upgrade flow with instant capability expansion.

---

## 🛠️ Architecture & $0 Spend Stack

- **Framework**: Next.js 15 (App Router, Server & Edge Route Handlers)
- **Language**: TypeScript 5.7+
- **Styling**: Tailwind CSS, Glassmorphism, CSS Keyframe Animations
- **Icons**: Lucide React
- **Client State**: Persistent localStorage state manager with realistic enterprise seeded telemetry
- **Edge Functions**: Serverless probe executors for zero-cost global multi-region health checks

---

## 🏃 Local Development

```bash
# Clone repository
git clone https://github.com/clemensjl/pulseguard-ai.git
cd pulseguard-ai

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

---

## 📦 Deployment to Vercel

```bash
vercel deploy --prod
```

---

## 📄 License

MIT © 2026 PulseGuard AI Systems.
