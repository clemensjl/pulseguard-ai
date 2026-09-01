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
  Sparkles,
  Plus,
  RefreshCw,
  ArrowRight,
} from "lucide-react";
import Header from "@/components/Header";
import SparklineChart from "@/components/SparklineChart";
import UptimeBar from "@/components/UptimeBar";
import MonitorModal from "@/components/MonitorModal";
import AiPostMortemModal from "@/components/AiPostMortemModal";
import UpgradeModal from "@/components/UpgradeModal";
import { useStore } from "@/lib/store";
import { formatMs } from "@/lib/utils";
import { Incident } from "@/lib/types";

export default function DashboardOverviewPage() {
  const { monitors, incidents, runCheckNow, addMonitor, updateAiPostMortem } = useStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
  const [checkingId, setCheckingId] = useState<string | null>(null);

  const activeIncidents = incidents.filter((i) => i.status !== "resolved");
  const operationalCount = monitors.filter((m) => m.status === "operational").length;

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
    <div className="flex-1 flex flex-col min-h-screen bg-black">
      <Header
        title="System Telemetry Overview"
        subtitle="Global synthetic health metrics & edge latency consensus"
        onOpenUpgrade={() => setIsUpgradeOpen(true)}
      />

      <main className="p-6 md:p-8 space-y-6 max-w-6xl w-full mx-auto">
        {/* Active Incident Callout */}
        {activeIncidents.length > 0 && (
          <div className="p-4 rounded-2xl bg-amber-500/[0.06] border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0">
                <AlertOctagon className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-amber-200">
                  Active Incident: {activeIncidents[0].title}
                </h4>
                <p className="text-[11px] text-amber-300/70">
                  {activeIncidents[0].impact}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedIncident(activeIncidents[0])}
                className="px-3 py-1.5 rounded-full bg-white/[0.08] hover:bg-white/[0.12] text-white text-xs font-medium border border-white/[0.08] transition-colors"
              >
                AI Root-Cause RCA
              </button>
              <Link
                href="/dashboard/incidents"
                className="px-3 py-1.5 rounded-full bg-white text-black text-xs font-semibold hover:bg-zinc-200 transition-colors"
              >
                Manage
              </Link>
            </div>
          </div>
        )}

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl apple-card space-y-2">
            <div className="flex justify-between items-center text-xs text-zinc-400">
              <span>90-Day SLA Uptime</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-3xl font-semibold font-mono text-white">{avgUptime}%</div>
            <span className="text-[11px] text-zinc-400 block">Above 99.9% guarantee</span>
          </div>

          <div className="p-5 rounded-2xl apple-card space-y-2">
            <div className="flex justify-between items-center text-xs text-zinc-400">
              <span>Mean Response TTFB</span>
              <Clock className="w-3.5 h-3.5 text-zinc-400" />
            </div>
            <div className="text-3xl font-semibold font-mono text-white">{avgLatency}ms</div>
            <span className="text-[11px] text-zinc-400 block">Global edge consensus</span>
          </div>

          <div className="p-5 rounded-2xl apple-card space-y-2">
            <div className="flex justify-between items-center text-xs text-zinc-400">
              <span>Monitored Services</span>
              <Radio className="w-3.5 h-3.5 text-zinc-400" />
            </div>
            <div className="text-3xl font-semibold font-mono text-white">
              {operationalCount}/{monitors.length}
            </div>
            <span className="text-[11px] text-zinc-400 block">All endpoints active</span>
          </div>

          <div className="p-5 rounded-2xl apple-card space-y-2">
            <div className="flex justify-between items-center text-xs text-zinc-400">
              <span>TLS Security Guard</span>
              <Shield className="w-3.5 h-3.5 text-zinc-400" />
            </div>
            <div className="text-3xl font-semibold font-mono text-white">100%</div>
            <span className="text-[11px] text-zinc-400 block">Certificates verified</span>
          </div>
        </div>

        {/* Global 90-Day SLA Availability Bar */}
        <div className="p-6 rounded-3xl apple-card space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-white">Global Availability (Past 90 Days)</span>
            <span className="font-mono text-emerald-400">{avgUptime}% Aggregate</span>
          </div>
          <UptimeBar overallUptime={Number(avgUptime)} />
        </div>

        {/* Health Table */}
        <div className="p-6 rounded-3xl apple-card space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-white">Monitored Endpoints</h3>
              <p className="text-[11px] text-zinc-400">Synthetic probe metrics across global edge zones</p>
            </div>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="apple-btn-primary px-3.5 py-1.5 text-xs font-semibold flex items-center gap-1.5 self-start sm:self-center"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Monitor</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/[0.08] text-zinc-400 font-medium">
                <tr>
                  <th className="pb-2.5 pl-1">Status</th>
                  <th className="pb-2.5">Endpoint</th>
                  <th className="pb-2.5">Protocol / Target</th>
                  <th className="pb-2.5">24h Latency</th>
                  <th className="pb-2.5">TTFB</th>
                  <th className="pb-2.5">90d SLA</th>
                  <th className="pb-2.5 text-right pr-1">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04] text-zinc-300">
                {monitors.map((m) => (
                  <tr key={m.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 pl-1">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium capitalize ${
                          m.status === "operational"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : m.status === "degraded"
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${m.status === "operational" ? "bg-emerald-400" : m.status === "degraded" ? "bg-amber-400" : "bg-rose-400"}`} />
                        <span>{m.status}</span>
                      </span>
                    </td>

                    <td className="py-3">
                      <span className="font-semibold text-white block">{m.name}</span>
                      <span className="text-[10px] text-zinc-400 font-mono">{m.group}</span>
                    </td>

                    <td className="py-3 font-mono text-[11px] text-zinc-400 truncate max-w-[180px]">
                      <span className="text-zinc-200 font-semibold mr-1">{m.method || m.type}</span>
                      <span>{m.url}</span>
                    </td>

                    <td className="py-3">
                      <SparklineChart data={m.latencyHistory} color={m.status === "degraded" ? "#ffd60a" : "#ffffff"} />
                    </td>

                    <td className="py-3 font-mono font-semibold text-white">
                      {formatMs(m.currentLatencyMs)}
                    </td>

                    <td className="py-3 font-mono text-zinc-300">
                      {m.uptime90d.toFixed(2)}%
                    </td>

                    <td className="py-3 text-right pr-1">
                      <button
                        onClick={() => handleQuickCheck(m.id)}
                        disabled={checkingId === m.id}
                        className="px-2.5 py-1 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 border border-white/[0.08] text-[11px] font-medium transition-colors inline-flex items-center gap-1"
                      >
                        <RefreshCw className={`w-2.5 h-2.5 ${checkingId === m.id ? "animate-spin text-white" : ""}`} />
                        <span>{checkingId === m.id ? "Probing..." : "Test"}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <MonitorModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={addMonitor}
      />

      <AiPostMortemModal
        isOpen={selectedIncident !== null}
        onClose={() => setSelectedIncident(null)}
        incident={selectedIncident}
        onSavePostMortem={updateAiPostMortem}
      />

      <UpgradeModal
        isOpen={isUpgradeOpen}
        onClose={() => setIsUpgradeOpen(false)}
      />
    </div>
  );
}
