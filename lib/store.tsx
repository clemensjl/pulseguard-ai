"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  Monitor,
  Incident,
  StatusPageConfig,
  Integration,
  ApiKey,
  Organization,
  MonitorStatus,
  IncidentStatus,
  IncidentSeverity,
} from "./types";
import {
  initialMonitors,
  initialIncidents,
  initialStatusPage,
  initialIntegrations,
  initialApiKeys,
  initialOrganization,
  generateLatencyHistory,
  generateDailyUptime,
} from "./mock-data";

interface StoreContextType {
  monitors: Monitor[];
  incidents: Incident[];
  statusPage: StatusPageConfig;
  integrations: Integration[];
  apiKeys: ApiKey[];
  organization: Organization;
  isLoading: boolean;
  addMonitor: (monitor: Omit<Monitor, "id" | "uptime90d" | "currentLatencyMs" | "avgLatency24h" | "lastChecked" | "latencyHistory" | "dailyUptime">) => void;
  updateMonitor: (id: string, updates: Partial<Monitor>) => void;
  deleteMonitor: (id: string) => void;
  toggleMonitorPause: (id: string) => void;
  runCheckNow: (id: string) => Promise<void>;
  runAllChecks: () => Promise<void>;
  createIncident: (incident: Omit<Incident, "id" | "createdAt" | "updates">) => void;
  updateIncidentStatus: (id: string, status: IncidentStatus, message: string) => void;
  updateAiPostMortem: (id: string, postMortem: string) => void;
  updateStatusPage: (updates: Partial<StatusPageConfig>) => void;
  addIntegration: (integration: Omit<Integration, "id">) => void;
  toggleIntegration: (id: string) => void;
  deleteIntegration: (id: string) => void;
  createApiKey: (name: string, scopes: string[]) => string;
  deleteApiKey: (id: string) => void;
  upgradePlan: (plan: "pro" | "enterprise") => void;
  inviteMember: (email: string, role: "admin" | "engineer" | "viewer") => void;
  resetToDefaults: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEYS = {
  MONITORS: "pulseguard_monitors_v1",
  INCIDENTS: "pulseguard_incidents_v1",
  STATUS_PAGE: "pulseguard_statuspage_v1",
  INTEGRATIONS: "pulseguard_integrations_v1",
  API_KEYS: "pulseguard_apikeys_v1",
  ORG: "pulseguard_org_v1",
};

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [monitors, setMonitors] = useState<Monitor[]>(initialMonitors);
  const [incidents, setIncidents] = useState<Incident[]>(initialIncidents);
  const [statusPage, setStatusPage] = useState<StatusPageConfig>(initialStatusPage);
  const [integrations, setIntegrations] = useState<Integration[]>(initialIntegrations);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(initialApiKeys);
  const [organization, setOrganization] = useState<Organization>(initialOrganization);
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedMonitors = localStorage.getItem(STORAGE_KEYS.MONITORS);
      if (savedMonitors) setMonitors(JSON.parse(savedMonitors));

      const savedIncidents = localStorage.getItem(STORAGE_KEYS.INCIDENTS);
      if (savedIncidents) setIncidents(JSON.parse(savedIncidents));

      const savedStatusPage = localStorage.getItem(STORAGE_KEYS.STATUS_PAGE);
      if (savedStatusPage) setStatusPage(JSON.parse(savedStatusPage));

      const savedIntegrations = localStorage.getItem(STORAGE_KEYS.INTEGRATIONS);
      if (savedIntegrations) setIntegrations(JSON.parse(savedIntegrations));

      const savedApiKeys = localStorage.getItem(STORAGE_KEYS.API_KEYS);
      if (savedApiKeys) setApiKeys(JSON.parse(savedApiKeys));

      const savedOrg = localStorage.getItem(STORAGE_KEYS.ORG);
      if (savedOrg) setOrganization(JSON.parse(savedOrg));
    } catch (e) {
      console.error("Failed to load state from localStorage:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save to localStorage helpers
  const saveMonitors = (newMonitors: Monitor[]) => {
    setMonitors(newMonitors);
    try {
      localStorage.setItem(STORAGE_KEYS.MONITORS, JSON.stringify(newMonitors));
    } catch (e) {
      console.error(e);
    }
  };

  const saveIncidents = (newIncidents: Incident[]) => {
    setIncidents(newIncidents);
    try {
      localStorage.setItem(STORAGE_KEYS.INCIDENTS, JSON.stringify(newIncidents));
    } catch (e) {
      console.error(e);
    }
  };

  const saveStatusPage = (newStatusPage: StatusPageConfig) => {
    setStatusPage(newStatusPage);
    try {
      localStorage.setItem(STORAGE_KEYS.STATUS_PAGE, JSON.stringify(newStatusPage));
    } catch (e) {
      console.error(e);
    }
  };

  const saveIntegrations = (newIntegrations: Integration[]) => {
    setIntegrations(newIntegrations);
    try {
      localStorage.setItem(STORAGE_KEYS.INTEGRATIONS, JSON.stringify(newIntegrations));
    } catch (e) {
      console.error(e);
    }
  };

  const saveApiKeys = (newKeys: ApiKey[]) => {
    setApiKeys(newKeys);
    try {
      localStorage.setItem(STORAGE_KEYS.API_KEYS, JSON.stringify(newKeys));
    } catch (e) {
      console.error(e);
    }
  };

  const saveOrg = (newOrg: Organization) => {
    setOrganization(newOrg);
    try {
      localStorage.setItem(STORAGE_KEYS.ORG, JSON.stringify(newOrg));
    } catch (e) {
      console.error(e);
    }
  };

  const addMonitor = (
    newMon: Omit<
      Monitor,
      "id" | "uptime90d" | "currentLatencyMs" | "avgLatency24h" | "lastChecked" | "latencyHistory" | "dailyUptime"
    >
  ) => {
    const id = `mon-${Date.now()}`;
    const monitor: Monitor = {
      ...newMon,
      id,
      uptime90d: 100.0,
      currentLatencyMs: 32,
      avgLatency24h: 32,
      lastChecked: new Date().toISOString(),
      latencyHistory: generateLatencyHistory(24, 32),
      dailyUptime: generateDailyUptime(90, 100),
    };
    saveMonitors([monitor, ...monitors]);
  };

  const updateMonitor = (id: string, updates: Partial<Monitor>) => {
    const updated = monitors.map((m) => (m.id === id ? { ...m, ...updates } : m));
    saveMonitors(updated);
  };

  const deleteMonitor = (id: string) => {
    saveMonitors(monitors.filter((m) => m.id !== id));
  };

  const toggleMonitorPause = (id: string) => {
    const updated = monitors.map((m) => {
      if (m.id === id) {
        const nextStatus: MonitorStatus = m.status === "paused" ? "operational" : "paused";
        return { ...m, status: nextStatus };
      }
      return m;
    });
    saveMonitors(updated);
  };

  const runCheckNow = async (id: string) => {
    const monitor = monitors.find((m) => m.id === id);
    if (!monitor) return;

    try {
      const startTime = performance.now();
      const res = await fetch(`/api/check?url=${encodeURIComponent(monitor.url)}&method=${monitor.method || "GET"}`);
      const data = await res.json();
      const duration = Math.round(performance.now() - startTime);

      const status: MonitorStatus = data.ok ? "operational" : "down";
      const latency = data.latencyMs || duration;

      const updatedHistory = [
        ...monitor.latencyHistory.slice(1),
        {
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          latencyMs: latency,
          status: data.status || (data.ok ? 200 : 500),
        },
      ];

      updateMonitor(id, {
        status,
        currentLatencyMs: latency,
        lastChecked: new Date().toISOString(),
        latencyHistory: updatedHistory,
      });
    } catch {
      // Fallback
      updateMonitor(id, {
        lastChecked: new Date().toISOString(),
      });
    }
  };

  const runAllChecks = async () => {
    for (const m of monitors) {
      if (m.status !== "paused") {
        await runCheckNow(m.id);
      }
    }
  };

  const createIncident = (incidentData: Omit<Incident, "id" | "createdAt" | "updates">) => {
    const id = `inc-${Date.now()}`;
    const newInc: Incident = {
      ...incidentData,
      id,
      createdAt: new Date().toISOString(),
      updates: [
        {
          id: `up-${Date.now()}`,
          status: incidentData.status,
          message: `Incident created with severity: ${incidentData.severity.toUpperCase()}. Investigating root cause.`,
          timestamp: new Date().toISOString(),
        },
      ],
    };
    saveIncidents([newInc, ...incidents]);
  };

  const updateIncidentStatus = (id: string, status: IncidentStatus, message: string) => {
    const updated = incidents.map((inc) => {
      if (inc.id === id) {
        const updates = [
          ...inc.updates,
          {
            id: `up-${Date.now()}`,
            status,
            message,
            timestamp: new Date().toISOString(),
          },
        ];
        return {
          ...inc,
          status,
          resolvedAt: status === "resolved" ? new Date().toISOString() : inc.resolvedAt,
          updates,
        };
      }
      return inc;
    });
    saveIncidents(updated);
  };

  const updateAiPostMortem = (id: string, postMortem: string) => {
    const updated = incidents.map((inc) => (inc.id === id ? { ...inc, aiPostMortem: postMortem } : inc));
    saveIncidents(updated);
  };

  const updateStatusPage = (updates: Partial<StatusPageConfig>) => {
    saveStatusPage({ ...statusPage, ...updates });
  };

  const addIntegration = (integrationData: Omit<Integration, "id">) => {
    const newIntegration: Integration = {
      ...integrationData,
      id: `int-${Date.now()}`,
    };
    saveIntegrations([...integrations, newIntegration]);
  };

  const toggleIntegration = (id: string) => {
    const updated = integrations.map((int) => (int.id === id ? { ...int, enabled: !int.enabled } : int));
    saveIntegrations(updated);
  };

  const deleteIntegration = (id: string) => {
    saveIntegrations(integrations.filter((int) => int.id !== id));
  };

  const createApiKey = (name: string, scopes: string[]) => {
    const rawSecret = `pg_live_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    const newKey: ApiKey = {
      id: `key-${Date.now()}`,
      name,
      keyPrefix: `${rawSecret.substring(0, 16)}...`,
      createdAt: new Date().toISOString(),
      scopes,
    };
    saveApiKeys([newKey, ...apiKeys]);
    return rawSecret;
  };

  const deleteApiKey = (id: string) => {
    saveApiKeys(apiKeys.filter((k) => k.id !== id));
  };

  const upgradePlan = (plan: "pro" | "enterprise") => {
    saveOrg({
      ...organization,
      plan,
      monitorsLimit: plan === "enterprise" ? 500 : 100,
      checkFrequencySeconds: plan === "enterprise" ? 10 : 30,
    });
  };

  const inviteMember = (email: string, role: "admin" | "engineer" | "viewer") => {
    const newMember = {
      id: `mem-${Date.now()}`,
      name: email.split("@")[0].replace(".", " "),
      email,
      role,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      joinedAt: new Date().toISOString(),
    };
    saveOrg({
      ...organization,
      members: [...organization.members, newMember],
    });
  };

  const resetToDefaults = () => {
    localStorage.clear();
    setMonitors(initialMonitors);
    setIncidents(initialIncidents);
    setStatusPage(initialStatusPage);
    setIntegrations(initialIntegrations);
    setApiKeys(initialApiKeys);
    setOrganization(initialOrganization);
  };

  return (
    <StoreContext.Provider
      value={{
        monitors,
        incidents,
        statusPage,
        integrations,
        apiKeys,
        organization,
        isLoading,
        addMonitor,
        updateMonitor,
        deleteMonitor,
        toggleMonitorPause,
        runCheckNow,
        runAllChecks,
        createIncident,
        updateIncidentStatus,
        updateAiPostMortem,
        updateStatusPage,
        addIntegration,
        toggleIntegration,
        deleteIntegration,
        createApiKey,
        deleteApiKey,
        upgradePlan,
        inviteMember,
        resetToDefaults,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}
