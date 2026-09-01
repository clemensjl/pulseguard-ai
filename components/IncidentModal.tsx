"use client";

import React, { useState } from "react";
import { X, AlertOctagon, Plus, ShieldAlert } from "lucide-react";
import { IncidentSeverity, IncidentStatus, Monitor } from "@/lib/types";

interface IncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  monitors: Monitor[];
  onSave: (incident: {
    title: string;
    monitorId?: string;
    monitorName?: string;
    severity: IncidentSeverity;
    status: IncidentStatus;
    impact: string;
  }) => void;
}

export default function IncidentModal({
  isOpen,
  onClose,
  monitors,
  onSave,
}: IncidentModalProps) {
  const [title, setTitle] = useState("");
  const [monitorId, setMonitorId] = useState(monitors[0]?.id || "");
  const [severity, setSeverity] = useState<IncidentSeverity>("major");
  const [status, setStatus] = useState<IncidentStatus>("investigating");
  const [impact, setImpact] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const selectedMonitor = monitors.find((m) => m.id === monitorId);
    onSave({
      title,
      monitorId: selectedMonitor?.id,
      monitorName: selectedMonitor?.name,
      severity,
      status,
      impact: impact || "Degraded service performance detected by monitoring probes.",
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <AlertOctagon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Declare New Incident</h3>
            <p className="text-xs text-slate-400">
              Open an active incident bulletin and notify subscribers & on-call teams.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Incident Headline
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Elevating Latency & 504 Gateway Timeouts"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Affected Component
              </label>
              <select
                value={monitorId}
                onChange={(e) => setMonitorId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                {monitors.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Severity Level
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as IncidentSeverity)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value="critical">Critical Outage</option>
                <option value="major">Major Degradation</option>
                <option value="minor">Minor Incident</option>
                <option value="maintenance">Scheduled Maintenance</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Current Investigation State
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as IncidentStatus)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              <option value="investigating">Investigating — Probing issue</option>
              <option value="identified">Identified — Root cause known</option>
              <option value="monitoring">Monitoring — Fix applied</option>
              <option value="resolved">Resolved — Service restored</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Public Customer Impact Summary
            </label>
            <textarea
              rows={3}
              value={impact}
              onChange={(e) => setImpact(e.target.value)}
              placeholder="Describe what customers are experiencing and interim workarounds..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm"
            />
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white text-xs font-bold shadow-md shadow-rose-500/20 flex items-center gap-1.5 transition-all"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Broadcast Incident</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
