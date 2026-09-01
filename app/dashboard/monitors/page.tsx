"use client";

import React, { useState } from "react";
import {
  Radio,
  Plus,
  Search,
  Filter,
  RefreshCw,
  MoreVertical,
  Play,
  Pause,
  Trash2,
  Edit,
  Shield,
  Clock,
  Sparkles,
  ExternalLink,
  Code2,
  Activity,
  Globe,
} from "lucide-react";
import Header from "@/components/Header";
import MonitorModal from "@/components/MonitorModal";
import BadgeEmbedModal from "@/components/BadgeEmbedModal";
import SparklineChart from "@/components/SparklineChart";
import UptimeBar from "@/components/UptimeBar";
import { useStore } from "@/lib/store";
import { Monitor, MonitorStatus } from "@/lib/types";
import { formatMs, getStatusColor, timeAgo } from "@/lib/utils";

export default function MonitorsStudioPage() {
  const {
    monitors,
    addMonitor,
    updateMonitor,
    deleteMonitor,
    toggleMonitorPause,
    runCheckNow,
  } = useStore();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedGroup, setSelectedGroup] = useState<string>("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingMonitor, setEditingMonitor] = useState<Monitor | null>(null);
  const [badgeMonitor, setBadgeMonitor] = useState<Monitor | null>(null);
  const [probingId, setProbingId] = useState<string | null>(null);

  // Extract unique groups
  const groups = ["all", ...Array.from(new Set(monitors.map((m) => m.group || "Default")))];

  // Filter monitors
  const filtered = monitors.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.url.toLowerCase().includes(search.toLowerCase()) ||
      m.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = statusFilter === "all" || m.status === statusFilter;
    const matchesGroup = selectedGroup === "all" || (m.group || "Default") === selectedGroup;

    return matchesSearch && matchesStatus && matchesGroup;
  });

  const handleRunCheck = async (id: string) => {
    setProbingId(id);
    await runCheckNow(id);
    setProbingId(null);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#090d16]">
      <Header
        title="Monitors Studio"
        subtitle="Manage synthetic health probes, SSL inspectors, and latency assertions"
      />

      <main className="p-6 md:p-8 space-y-6 max-w-7xl w-full mx-auto">
        {/* Top Control Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search & Filters */}
          <div className="flex flex-wrap items-center gap-3 flex-1">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, URL, or tag..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Statuses</option>
              <option value="operational">Operational</option>
              <option value="degraded">Degraded</option>
              <option value="down">Down</option>
              <option value="paused">Paused</option>
            </select>

            {/* Group Filter */}
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {groups.map((g) => (
                <option key={g} value={g}>
                  {g === "all" ? "All Groups" : g}
                </option>
              ))}
            </select>
          </div>

          {/* Create Button */}
          <button
            onClick={() => {
              setEditingMonitor(null);
              setIsCreateOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Monitor</span>
          </button>
        </div>

        {/* Monitors List */}
        <div className="space-y-4">
          {filtered.length === 0 ? (
            <div className="py-16 text-center rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <Radio className="w-8 h-8 text-slate-400 mx-auto" />
              <h4 className="text-base font-bold text-white">No monitors match your criteria</h4>
              <p className="text-xs text-slate-400">Try adjusting your search filters or add a new endpoint.</p>
            </div>
          ) : (
            filtered.map((m) => {
              const statusColors = getStatusColor(m.status);

              return (
                <div
                  key={m.id}
                  className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 hover:border-slate-700 transition-all shadow-sm"
                >
                  {/* Top Row: Status, Title, URL, Actions */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold capitalize border ${statusColors.bg} ${statusColors.text} ${statusColors.border}`}
                      >
                        <span className={`w-2 h-2 rounded-full ${statusColors.dot} ${statusColors.glow}`} />
                        <span>{m.status}</span>
                      </span>

                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-bold text-white">{m.name}</h4>
                          <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 font-mono">
                            {m.group || "Default"}
                          </span>
                        </div>
                        <a
                          href={m.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-indigo-400 hover:text-indigo-300 font-mono flex items-center gap-1 mt-0.5 truncate max-w-lg"
                        >
                          <span className="font-bold text-slate-400 uppercase">{m.method || "GET"}</span>
                          <span>{m.url}</span>
                          <ExternalLink className="w-3 h-3 text-slate-400" />
                        </a>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleRunCheck(m.id)}
                        disabled={probingId === m.id}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${probingId === m.id ? "animate-spin text-indigo-400" : ""}`} />
                        <span>{probingId === m.id ? "Testing..." : "Test Probe"}</span>
                      </button>

                      <button
                        onClick={() => setBadgeMonitor(m)}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
                        title="Embed Live Status Badge"
                      >
                        <Code2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => toggleMonitorPause(m.id)}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
                        title={m.status === "paused" ? "Resume Monitor" : "Pause Monitor"}
                      >
                        {m.status === "paused" ? <Play className="w-4 h-4 text-emerald-400" /> : <Pause className="w-4 h-4" />}
                      </button>

                      <button
                        onClick={() => {
                          setEditingMonitor(m);
                          setIsCreateOpen(true);
                        }}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
                        title="Edit Configuration"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Delete monitor "${m.name}"?`)) {
                            deleteMonitor(m.id);
                          }
                        }}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-400 border border-slate-700 hover:border-rose-500/40 transition-colors"
                        title="Delete Monitor"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Middle Row: Telemetry Metrics */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 border-y border-slate-800/80 bg-slate-950/40 rounded-xl px-4">
                    <div>
                      <span className="text-[11px] text-slate-400 block">Current TTFB</span>
                      <span className={`text-sm font-bold font-mono ${m.currentLatencyMs < 50 ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {formatMs(m.currentLatencyMs)}
                      </span>
                    </div>

                    <div>
                      <span className="text-[11px] text-slate-400 block">90-Day SLA</span>
                      <span className="text-sm font-bold font-mono text-white">
                        {m.uptime90d.toFixed(2)}%
                      </span>
                    </div>

                    <div>
                      <span className="text-[11px] text-slate-400 block">Check Interval</span>
                      <span className="text-sm font-bold text-slate-200">
                        Every {m.intervalSeconds}s
                      </span>
                    </div>

                    <div>
                      <span className="text-[11px] text-slate-400 block">SSL Expiration</span>
                      <span className={`text-sm font-bold font-mono ${m.sslExpiryDays && m.sslExpiryDays < 30 ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {m.sslExpiryDays ? `${m.sslExpiryDays} days` : "Active"}
                      </span>
                    </div>
                  </div>

                  {/* Bottom Row: 90-day history bar */}
                  <div>
                    <UptimeBar days={m.dailyUptime} overallUptime={m.uptime90d} />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>

      {/* Create / Edit Modal */}
      <MonitorModal
        isOpen={isCreateOpen}
        onClose={() => {
          setIsCreateOpen(false);
          setEditingMonitor(null);
        }}
        editMonitor={editingMonitor}
        onSave={(data) => {
          if (editingMonitor) {
            updateMonitor(editingMonitor.id, data);
          } else {
            addMonitor(data);
          }
        }}
      />

      {/* Badge Embed Modal */}
      <BadgeEmbedModal
        isOpen={badgeMonitor !== null}
        onClose={() => setBadgeMonitor(null)}
        monitor={badgeMonitor}
      />
    </div>
  );
}
