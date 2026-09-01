"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Activity,
  Radio,
  AlertOctagon,
  CheckCircle2,
  Clock,
  Shield,
  ArrowUpRight,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Plus,
  RefreshCw,
  Server,
  Zap,
} from "lucide-react";
import Header from "@/components/Header";
import SparklineChart from "@/components/SparklineChart";
import UptimeBar from "@/components/UptimeBar";
import MonitorModal from "@/components/MonitorModal";
import AiPostMortemModal from "@/components/AiPostMortemModal";
import UpgradeModal from "@/components/UpgradeModal";
import { useStore } from "@/lib/store";
import { formatMs, getStatusColor } from "@/lib/utils";
import { Incident, Monitor } from "@/lib/types";

export default function DashboardOverviewPage() {
  const { monitors, incidents, runCheckNow, runAllChecks, addMonitor, updateAiPostMortem } = useStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
  const [checkingId, setCheckingId] = useState<string | null>(null);

  const activeIncidents = incidents.filter((i) => i.status !== "resolved");
  const operationalCount = monitors.filter((m) => m.status === "operational").length;
  const degradedCount = monitors.filter((m) => m.status === "degraded").length;
  const downCount = monitors.filter((m) => m.status === "down").length;

  const avgLatency = Math.round(
    monitors.reduce((acc, m) => acc + (m.currentLatencyMs || 0), 0) / (monitors.length || 1)
  );

  const avgUptime = (
    monitors.reduce((acc, m) => acc + (m.uptime90d || 100), 0) / (monitors.length || 1)
  ).toFixed(2);

  const handleQuickCheck = async (id: string) => {
    setCheckingId(id);
    await runCheckNow(id);
    setCheckingId(null);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#090d16]">
      <Header
        title="Telemetry & Reliability Overview"
        subtitle="Real-time multi-region edge synthetic health and SLA telemetry"
        onOpenUpgrade={() => setIsUpgradeOpen(true)}
      />

      <main className="p-6 md:p-8 space-y-8 max-w-7xl w-full mx-auto">
        {/* Active Incident Alert Banner if any */}
        {activeIncidents.length > 0 && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in duration-300">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                <AlertOctagon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                  <span>Active Incident in Progress:</span>
                  <span className="text-white font-medium">{activeIncidents[0].title}</span>
                </h4>
                <p className="text-xs text-amber-400/80">
                  Status: {activeIncidents[0].status.toUpperCase()} • Impact: {activeIncidents[0].impact}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedIncident(activeIncidents[0])}
                className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Root-Cause RCA</span>
              </button>
              <Link
                href="/dashboard/incidents"
                className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors"
              >
                Manage Incident
              </Link>
            </div>
          </div>
        )}

        {/* 4 Metric KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: 90-day SLA */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Overall Uptime</span>
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-white font-mono">{avgUptime}%</div>
            <div className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Exceeding 99.9% Enterprise SLA</span>
            </div>
          </div>

          {/* Card 2: Average TTFB Latency */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Avg Latency (TTFB)</span>
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-white font-mono">{avgLatency}ms</div>
            <div className="text-xs text-indigo-400 flex items-center gap-1 font-medium">
              <Activity className="w-3.5 h-3.5" />
              <span>Multi-region Edge Mean</span>
            </div>
          </div>

          {/* Card 3: Monitored Endpoints */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Active Monitors</span>
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                <Radio className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-white font-mono flex items-baseline gap-2">
              <span>{monitors.length}</span>
              <span className="text-xs text-slate-400 font-normal">
                ({operationalCount} up, {degradedCount} degraded)
              </span>
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-1">
              <span>Next consensus probe in 18s</span>
            </div>
          </div>

          {/* Card 4: SSL & Security Guard */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">SSL Security Guard</span>
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <Shield className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-white font-mono">100%</div>
            <div className="text-xs text-slate-400 flex items-center gap-1">
              <span>All TLS 1.3 certificates valid</span>
            </div>
          </div>
        </div>

        {/* Global 90-Day SLA Availability Bar */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                90-Day Global Availability History
              </h3>
              <p className="text-xs text-slate-400">Continuous 30-second synthetic polling resolution</p>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              99.98% 90-Day Aggregate
            </span>
          </div>

          <UptimeBar overallUptime={Number(avgUptime)} />
        </div>

        {/* Live Monitors Health Table */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white">Live Synthetic Monitors</h3>
              <p className="text-xs text-slate-400">
                Real-time latency telemetry, status codes, and instant probe diagnostics.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-500/20 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add New Monitor</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="pb-3 pl-2">Status</th>
                  <th className="pb-3">Endpoint Name</th>
                  <th className="pb-3">Type / Target</th>
                  <th className="pb-3">24h Latency</th>
                  <th className="pb-3">Current TTFB</th>
                  <th className="pb-3">90d Uptime</th>
                  <th className="pb-3 text-right pr-2">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium text-slate-300">
                {monitors.map((m) => {
                  const statusColors = getStatusColor(m.status);

                  return (
                    <tr key={m.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 pl-2">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold capitalize border ${statusColors.bg} ${statusColors.text} ${statusColors.border}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${statusColors.dot} ${statusColors.glow}`} />
                          <span>{m.status}</span>
                        </span>
                      </td>

                      <td className="py-3.5">
                        <span className="font-bold text-white block">{m.name}</span>
                        <span className="text-[11px] text-slate-400 font-mono truncate max-w-xs block">
                          {m.group}
                        </span>
                      </td>

                      <td className="py-3.5 font-mono text-[11px] text-slate-400 truncate max-w-[200px]">
                        <span className="text-indigo-400 font-bold uppercase mr-1">{m.method || m.type}</span>
                        <span>{m.url}</span>
                      </td>

                      <td className="py-3.5">
                        <SparklineChart data={m.latencyHistory} color={m.status === "degraded" ? "#f59e0b" : "#6366f1"} />
                      </td>

                      <td className="py-3.5 font-mono font-bold">
                        <span className={m.currentLatencyMs < 50 ? "text-emerald-400" : m.currentLatencyMs < 200 ? "text-amber-400" : "text-rose-400"}>
                          {formatMs(m.currentLatencyMs)}
                        </span>
                      </td>

                      <td className="py-3.5 font-mono text-emerald-400">
                        {m.uptime90d.toFixed(2)}%
                      </td>

                      <td className="py-3.5 text-right pr-2">
                        <button
                          onClick={() => handleQuickCheck(m.id)}
                          disabled={checkingId === m.id}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] font-semibold transition-colors inline-flex items-center gap-1"
                        >
                          <RefreshCw className={`w-3 h-3 ${checkingId === m.id ? "animate-spin text-indigo-400" : ""}`} />
                          <span>{checkingId === m.id ? "Probing..." : "Test"}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Add Monitor Modal */}
      <MonitorModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={addMonitor}
      />

      {/* AI Post Mortem Modal */}
      <AiPostMortemModal
        isOpen={selectedIncident !== null}
        onClose={() => setSelectedIncident(null)}
        incident={selectedIncident}
        onSavePostMortem={updateAiPostMortem}
      />

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={isUpgradeOpen}
        onClose={() => setIsUpgradeOpen(false)}
      />
    </div>
  );
}
