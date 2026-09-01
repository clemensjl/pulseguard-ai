import { Monitor, Incident, StatusPageConfig, Integration, ApiKey, Organization } from "./types";

export function generateDailyUptime(days = 90, baseUptime = 99.98) {
  const result = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    // Occasional small dip
    const rand = Math.random();
    let uptime = 100;
    if (rand < 0.05) {
      uptime = 98.4 + Math.random() * 1.5;
    } else if (rand < 0.01) {
      uptime = 92.1 + Math.random() * 5.0;
    }
    result.push({
      date: dateStr,
      uptime: Number(uptime.toFixed(2)),
      count: 1440,
    });
  }
  return result;
}

export function generateLatencyHistory(count = 24, baseMs = 38) {
  const points = [];
  const now = Date.now();
  for (let i = count - 1; i >= 0; i--) {
    const ts = new Date(now - i * 3600 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const jitter = (Math.random() - 0.5) * 16;
    points.push({
      timestamp: ts,
      latencyMs: Math.max(12, Math.round(baseMs + jitter)),
      status: 200,
    });
  }
  return points;
}

export const initialMonitors: Monitor[] = [
  {
    id: "mon-1",
    name: "Production API Gateway",
    url: "https://api.pulseguard.io/v1/health",
    type: "http",
    method: "GET",
    intervalSeconds: 30,
    timeoutSeconds: 5,
    status: "operational",
    uptime90d: 99.99,
    currentLatencyMs: 24,
    avgLatency24h: 28,
    lastChecked: new Date().toISOString(),
    sslExpiryDays: 248,
    sslIssuer: "Let's Encrypt Authority X3",
    expectedStatusCode: 200,
    group: "Core Infrastructure",
    latencyHistory: generateLatencyHistory(24, 26),
    dailyUptime: generateDailyUptime(90, 99.99),
    tags: ["prod", "critical", "api"],
  },
  {
    id: "mon-2",
    name: "User Authentication Service",
    url: "https://auth.pulseguard.io/.well-known/openid-configuration",
    type: "http",
    method: "GET",
    intervalSeconds: 60,
    timeoutSeconds: 5,
    status: "operational",
    uptime90d: 99.95,
    currentLatencyMs: 42,
    avgLatency24h: 46,
    lastChecked: new Date().toISOString(),
    sslExpiryDays: 180,
    sslIssuer: "DigiCert Global Root CA",
    expectedStatusCode: 200,
    group: "Authentication",
    latencyHistory: generateLatencyHistory(24, 44),
    dailyUptime: generateDailyUptime(90, 99.95),
    tags: ["prod", "auth"],
  },
  {
    id: "mon-3",
    name: "Stripe Webhook Ingestion Engine",
    url: "https://billing.pulseguard.io/webhooks/stripe/ping",
    type: "http",
    method: "POST",
    intervalSeconds: 60,
    timeoutSeconds: 10,
    status: "operational",
    uptime90d: 100.0,
    currentLatencyMs: 65,
    avgLatency24h: 68,
    lastChecked: new Date().toISOString(),
    sslExpiryDays: 312,
    sslIssuer: "Cloudflare Inc ECC CA-3",
    expectedStatusCode: 200,
    group: "Billing & Payments",
    latencyHistory: generateLatencyHistory(24, 65),
    dailyUptime: generateDailyUptime(90, 100.0),
    tags: ["payments", "webhooks"],
  },
  {
    id: "mon-4",
    name: "Global Edge CDN & Assets",
    url: "https://cdn.pulseguard.io/assets/favicon.ico",
    type: "http",
    method: "GET",
    intervalSeconds: 30,
    timeoutSeconds: 3,
    status: "operational",
    uptime90d: 99.99,
    currentLatencyMs: 14,
    avgLatency24h: 16,
    lastChecked: new Date().toISOString(),
    sslExpiryDays: 89,
    sslIssuer: "Google Trust Services LLC",
    expectedStatusCode: 200,
    group: "Frontend & CDN",
    latencyHistory: generateLatencyHistory(24, 15),
    dailyUptime: generateDailyUptime(90, 99.99),
    tags: ["cdn", "static"],
  },
  {
    id: "mon-5",
    name: "Vector Search & Embeddings Engine",
    url: "https://ai-cluster.pulseguard.io/healthz",
    type: "http",
    method: "GET",
    intervalSeconds: 60,
    timeoutSeconds: 8,
    status: "degraded",
    uptime90d: 98.84,
    currentLatencyMs: 380,
    avgLatency24h: 145,
    lastChecked: new Date().toISOString(),
    sslExpiryDays: 45,
    sslIssuer: "Let's Encrypt Authority X3",
    expectedStatusCode: 200,
    group: "AI Pipelines",
    latencyHistory: generateLatencyHistory(24, 180),
    dailyUptime: generateDailyUptime(90, 98.84),
    tags: ["ai", "vectors", "gpu"],
  },
  {
    id: "mon-6",
    name: "Primary Database Replica (US-East)",
    url: "https://db-replica-us-east.pulseguard.internal",
    type: "ssl",
    intervalSeconds: 120,
    timeoutSeconds: 5,
    status: "operational",
    uptime90d: 99.99,
    currentLatencyMs: 18,
    avgLatency24h: 19,
    lastChecked: new Date().toISOString(),
    sslExpiryDays: 14, // Alert trigger
    sslIssuer: "Amazon RSA 2048 M02",
    group: "Database Tier",
    latencyHistory: generateLatencyHistory(24, 18),
    dailyUptime: generateDailyUptime(90, 99.99),
    tags: ["db", "replica", "ssl-watch"],
  },
];

export const initialIncidents: Incident[] = [
  {
    id: "inc-101",
    title: "Elevated latency on Vector Search & Embeddings Engine",
    monitorId: "mon-5",
    monitorName: "Vector Search & Embeddings Engine",
    severity: "minor",
    status: "monitoring",
    createdAt: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
    impact: "Query response times increased by ~220ms due to high GPU memory cache pressure.",
    updates: [
      {
        id: "up-1",
        status: "investigating",
        message: "Telemetry alarms flagged P99 query latency climbing above 350ms in us-east region.",
        timestamp: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
      },
      {
        id: "up-2",
        status: "identified",
        message: "Identified high batch concurrency lock on HNSW indexing nodes during scheduled embeddings re-sync.",
        timestamp: new Date(Date.now() - 3600 * 1000 * 1.2).toISOString(),
      },
      {
        id: "up-3",
        status: "monitoring",
        message: "Dynamic pod autoscaling deployed 4 additional vector compute nodes. Latency is recovering back toward baseline.",
        timestamp: new Date(Date.now() - 3600 * 1000 * 0.4).toISOString(),
      },
    ],
    aiPostMortem: `### 🤖 PulseGuard AI Autonomous Post-Mortem

**Root Cause:**
At 14:45 UTC, an automated batch embedding pipeline initiated high-concurrency write operations against the primary vector indices. This exceeded the configured memory write-buffer threshold on HNSW nodes, triggering temporary thread starvation and elevating P99 latencies from 45ms to 380ms.

**Impact Analysis:**
- 4.2% of downstream AI search queries experienced latency degradation >300ms.
- 0% HTTP 5xx error rate (all requests succeeded with degraded response speed).

**Remediation Steps Taken:**
1. Horizontal pod autoscaler (HPA) provisioned 4 additional vector compute pods.
2. Indexing write batches throttled to max 250 records/sec during peak traffic windows.

**Action Items:**
- [x] Configure dedicated read-replica vector pods for real-time customer lookups.
- [ ] Implement query queue circuit breaker when GPU VRAM exceeds 88%.`,
  },
  {
    id: "inc-100",
    title: "Regional Network Provider DNS Resolution Timeout",
    monitorId: "mon-1",
    monitorName: "Production API Gateway",
    severity: "major",
    status: "resolved",
    createdAt: new Date(Date.now() - 86400 * 1000 * 3).toISOString(),
    resolvedAt: new Date(Date.now() - 86400 * 1000 * 3 + 1800 * 1000).toISOString(),
    impact: "Intermittent connection timeouts for EU-Central clients for approximately 28 minutes.",
    updates: [
      {
        id: "up-10",
        status: "investigating",
        message: "Multiple synthetic probes from Frankfurt and London reported DNS lookup failures.",
        timestamp: new Date(Date.now() - 86400 * 1000 * 3).toISOString(),
      },
      {
        id: "up-11",
        status: "identified",
        message: "Upstream Anycast DNS provider experienced BGP route flap in Frankfurt IXP.",
        timestamp: new Date(Date.now() - 86400 * 1000 * 3 + 600 * 1000).toISOString(),
      },
      {
        id: "up-12",
        status: "resolved",
        message: "Traffic successfully re-routed through alternate Stockholm and Paris edge nodes. All systems fully operational.",
        timestamp: new Date(Date.now() - 86400 * 1000 * 3 + 1800 * 1000).toISOString(),
      },
    ],
    aiPostMortem: `### 🤖 PulseGuard AI Autonomous Post-Mortem

**Root Cause:**
BGP route withdrawal by upstream transit provider at DE-CIX Frankfurt caused 1.2% packet drops and DNS query timeouts for European edge resolvers.

**Resolution:**
Automated Anycast failover switched primary name server resolution to secondary Tier-1 DNS provider within 4 minutes. System stabilized at 100% resolution rate.`,
  },
];

export const initialStatusPage: StatusPageConfig = {
  id: "sp-1",
  slug: "demo",
  title: "PulseGuard Cloud Platform Status",
  companyName: "PulseGuard Systems Inc.",
  description: "Real-time health, uptime analytics, and scheduled maintenance bulletins for all PulseGuard cloud services.",
  isPublic: true,
  components: [
    {
      id: "c-1",
      name: "REST API & Edge Ingestion",
      description: "Public API endpoints, JSON webhooks, and ingest queues",
      monitorId: "mon-1",
      status: "operational",
      group: "Core Services",
    },
    {
      id: "c-2",
      name: "Authentication & Identity (SSO)",
      description: "OAuth2, SAML, and user session management",
      monitorId: "mon-2",
      status: "operational",
      group: "Core Services",
    },
    {
      id: "c-3",
      name: "Billing & Subscriptions Gateway",
      description: "Stripe checkout, usage metering, and invoice automation",
      monitorId: "mon-3",
      status: "operational",
      group: "Infrastructure",
    },
    {
      id: "c-4",
      name: "Vector Neural Search Engine",
      description: "High-dimensional vector embeddings and similarity queries",
      monitorId: "mon-5",
      status: "degraded",
      group: "AI & Data Pipelines",
    },
    {
      id: "c-5",
      name: "Global CDN & Asset Distribution",
      description: "Edge caching, SSL offloading, and static delivery",
      monitorId: "mon-4",
      status: "operational",
      group: "Infrastructure",
    },
  ],
  announcement: {
    type: "warning",
    message: "Vector Search Engine is undergoing autoscaling node rebalancing. All other systems operating normally.",
    active: true,
  },
};

export const initialIntegrations: Integration[] = [
  {
    id: "int-1",
    name: "Production Incident Channel",
    type: "slack",
    webhookUrl: "https://hooks.slack.example.com/services/T0000/B0000/mock_sample",
    events: ["down", "degraded", "recovered", "ssl_expiry"],
    enabled: true,
    lastTriggered: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
  },
  {
    id: "int-2",
    name: "DevOps Discord Alerts",
    type: "discord",
    webhookUrl: "https://discord.example.com/api/webhooks/mock_demo_channel",
    events: ["down", "recovered"],
    enabled: true,
    lastTriggered: new Date(Date.now() - 86400 * 1000 * 3).toISOString(),
  },
  {
    id: "int-3",
    name: "PagerDuty Emergency Webhook",
    type: "webhook",
    webhookUrl: "https://events.pagerduty.com/v2/enqueue",
    events: ["down"],
    enabled: false,
  },
];

export const initialApiKeys: ApiKey[] = [
  {
    id: "key-1",
    name: "Production CI/CD Health Probe",
    keyPrefix: "pg_live_89f3a9b2...",
    createdAt: "2026-08-12T10:00:00Z",
    lastUsedAt: new Date(Date.now() - 60000).toISOString(),
    scopes: ["monitors:read", "monitors:write", "incidents:write"],
  },
  {
    id: "key-2",
    name: "Grafana Telemetry Readonly",
    keyPrefix: "pg_live_3c21e7d0...",
    createdAt: "2026-08-25T14:30:00Z",
    lastUsedAt: new Date(Date.now() - 3600000).toISOString(),
    scopes: ["monitors:read", "metrics:read"],
  },
];

export const initialOrganization: Organization = {
  id: "org-1",
  name: "Acme Cloud Technologies",
  plan: "pro",
  monitorsLimit: 50,
  checkFrequencySeconds: 30,
  members: [
    {
      id: "mem-1",
      name: "Clemens Jele",
      email: "clemens@example.com",
      role: "owner",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
      joinedAt: "2026-01-10T09:00:00Z",
    },
    {
      id: "mem-2",
      name: "Alex Rivera",
      email: "alex.r@acme.dev",
      role: "admin",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
      joinedAt: "2026-02-14T11:20:00Z",
    },
    {
      id: "mem-3",
      name: "Sarah Chen",
      email: "sarah.c@acme.dev",
      role: "engineer",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
      joinedAt: "2026-03-01T15:45:00Z",
    },
  ],
};
