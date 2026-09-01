export type MonitorStatus = "operational" | "degraded" | "down" | "paused";

export type MonitorType = "http" | "ssl" | "ping" | "port" | "cron";

export type HttpMethod = "GET" | "POST" | "HEAD" | "PUT" | "DELETE";

export interface LatencyDataPoint {
  timestamp: string;
  latencyMs: number;
  status: number;
}

export interface Monitor {
  id: string;
  name: string;
  url: string;
  type: MonitorType;
  method?: HttpMethod;
  intervalSeconds: number;
  timeoutSeconds: number;
  status: MonitorStatus;
  uptime90d: number;
  currentLatencyMs: number;
  avgLatency24h: number;
  lastChecked: string;
  sslExpiryDays?: number;
  sslIssuer?: string;
  expectedStatusCode?: number;
  bodyKeyword?: string;
  headers?: Record<string, string>;
  group?: string;
  latencyHistory: LatencyDataPoint[];
  dailyUptime: { date: string; uptime: number; count: number }[];
  tags: string[];
}

export type IncidentSeverity = "critical" | "major" | "minor" | "maintenance";
export type IncidentStatus = "investigating" | "identified" | "monitoring" | "resolved";

export interface IncidentUpdate {
  id: string;
  status: IncidentStatus;
  message: string;
  timestamp: string;
}

export interface Incident {
  id: string;
  title: string;
  monitorId?: string;
  monitorName?: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  createdAt: string;
  resolvedAt?: string;
  impact: string;
  updates: IncidentUpdate[];
  aiPostMortem?: string;
}

export interface StatusPageComponent {
  id: string;
  name: string;
  description: string;
  monitorId?: string;
  status: MonitorStatus;
  group: string;
}

export interface StatusPageConfig {
  id: string;
  slug: string;
  title: string;
  companyName: string;
  description: string;
  logoUrl?: string;
  customDomain?: string;
  isPublic: boolean;
  components: StatusPageComponent[];
  announcement?: {
    type: "info" | "warning" | "alert";
    message: string;
    active: boolean;
  };
}

export interface Integration {
  id: string;
  name: string;
  type: "slack" | "discord" | "teams" | "webhook" | "email";
  webhookUrl: string;
  events: ("down" | "degraded" | "recovered" | "ssl_expiry")[];
  enabled: boolean;
  lastTriggered?: string;
}

export interface ApiKey {
  id: string;
  name: string;
  keyPrefix: string;
  createdAt: string;
  lastUsedAt?: string;
  scopes: string[];
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "owner" | "admin" | "engineer" | "viewer";
  avatar: string;
  joinedAt: string;
}

export interface Organization {
  id: string;
  name: string;
  plan: "free" | "pro" | "enterprise";
  monitorsLimit: number;
  checkFrequencySeconds: number;
  members: TeamMember[];
}
