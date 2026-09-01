"use client";

import React, { useState } from "react";
import {
  AlertOctagon,
  Plus,
  Sparkles,
  CheckCircle2,
  Clock,
  MessageSquare,
  ShieldAlert,
  ChevronRight,
  Send,
  Loader2,
} from "lucide-react";
import Header from "@/components/Header";
import IncidentModal from "@/components/IncidentModal";
import AiPostMortemModal from "@/components/AiPostMortemModal";
import { useStore } from "@/lib/store";
import { Incident, IncidentStatus } from "@/lib/types";
import { timeAgo } from "@/lib/utils";

export default function IncidentsCenterPage() {
  const {
    incidents,
    monitors,
    createIncident,
    updateIncidentStatus,
    updateAiPostMortem,
  } = useStore();

  const [isDeclareOpen, setIsDeclareOpen] = useState(false);
  const [selectedIncidentForRca, setSelectedIncidentForRca] = useState<Incident | null>(null);
  const [updatingIncidentId, setUpdatingIncidentId] = useState<string | null>(null);
  const [nextStatus, setNextStatus] = useState<IncidentStatus>("monitoring");
  const [updateMessage, setUpdateMessage] = useState("");

  const handlePostUpdate = (e: React.FormEvent, incidentId: string) => {
    e.preventDefault();
    if (!updateMessage) return;

    updateIncidentStatus(incidentId, nextStatus, updateMessage);
    setUpdateMessage("");
    setUpdatingIncidentId(null);
  };

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case "critical":
        return "bg-rose-500/20 text-rose-300 border-rose-500/30";
      case "major":
        return "bg-amber-500/20 text-amber-300 border-amber-500/30";
      case "minor":
        return "bg-indigo-500/20 text-indigo-300 border-indigo-500/30";
      case "maintenance":
      default:
        return "bg-slate-500/20 text-slate-300 border-slate-500/30";
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#090d16]">
      <Header
        title="Incident Command Center"
        subtitle="Manage active outages, broadcast public bulletins, and synthesize AI post-mortems"
      />

      <main className="p-6 md:p-8 space-y-8 max-w-7xl w-full mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white">Incident Feed & Triage</h3>
            <p className="text-xs text-slate-400">
              Correlated telemetry alarms, live public status notifications, and autonomous RCAs.
            </p>
          </div>

          <button
            onClick={() => setIsDeclareOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-bold text-xs shadow-md shadow-rose-500/20 flex items-center justify-center gap-2 transition-all shrink-0"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Declare New Incident</span>
          </button>
        </div>

        {/* Incident Cards List */}
        <div className="space-y-6">
          {incidents.length === 0 ? (
            <div className="py-16 text-center rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <h4 className="text-base font-bold text-white">Zero Active or Historical Incidents</h4>
              <p className="text-xs text-slate-400">All systems are operational with 100% SLA compliance.</p>
            </div>
          ) : (
            incidents.map((inc) => (
              <div
                key={inc.id}
                className={`rounded-2xl bg-slate-900/90 border p-6 space-y-6 transition-all ${
                  inc.status === "resolved" ? "border-slate-800" : "border-rose-500/30 shadow-lg shadow-rose-500/5"
                }`}
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                  <div className="flex items-start sm:items-center gap-3">
                    <div
                      className={`p-2.5 rounded-xl border ${
                        inc.status === "resolved" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                      }`}
                    >
                      <AlertOctagon className="w-5 h-5" />
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-base font-bold text-white">{inc.title}</h4>
                        <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-mono font-bold uppercase border ${getSeverityBadge(inc.severity)}`}>
                          {inc.severity}
                        </span>
                        <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-mono font-bold uppercase border ${
                          inc.status === "resolved"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        }`}>
                          {inc.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                        <span>Component: <strong className="text-slate-200">{inc.monitorName || "Core Platform"}</strong></span>
                        <span>•</span>
                        <span>Opened {timeAgo(inc.createdAt)}</span>
                        {inc.resolvedAt && (
                          <>
                            <span>•</span>
                            <span className="text-emerald-400">Resolved {timeAgo(inc.resolvedAt)}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedIncidentForRca(inc)}
                      className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600/20 to-purple-600/20 hover:from-indigo-600/30 hover:to-purple-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{inc.aiPostMortem ? "View AI Post-Mortem" : "Generate AI RCA"}</span>
                    </button>

                    {inc.status !== "resolved" && (
                      <button
                        onClick={() => {
                          setUpdatingIncidentId(updatingIncidentId === inc.id ? null : inc.id);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Post Update</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Impact Statement */}
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300">
                  <span className="font-semibold text-slate-400 block mb-1">Public Impact Bulletin:</span>
                  <p>{inc.impact}</p>
                </div>

                {/* Post update accordion */}
                {updatingIncidentId === inc.id && (
                  <form
                    onSubmit={(e) => handlePostUpdate(e, inc.id)}
                    className="p-4 rounded-xl bg-slate-950 border border-indigo-500/30 space-y-3 animate-in fade-in duration-200"
                  >
                    <div className="flex justify-between items-center text-xs font-semibold text-indigo-300">
                      <span>Broadcast Incident Update</span>
                      <select
                        value={nextStatus}
                        onChange={(e) => setNextStatus(e.target.value as IncidentStatus)}
                        className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-mono"
                      >
                        <option value="investigating">Investigating</option>
                        <option value="identified">Identified</option>
                        <option value="monitoring">Monitoring</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    </div>

                    <textarea
                      rows={2}
                      required
                      value={updateMessage}
                      onChange={(e) => setUpdateMessage(e.target.value)}
                      placeholder="Describe what mitigation steps were taken or progress update..."
                      className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-400 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />

                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setUpdatingIncidentId(null)}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-400 text-xs font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5"
                      >
                        <Send className="w-3 h-3" />
                        <span>Publish Note</span>
                      </button>
                    </div>
                  </form>
                )}

                {/* Timeline History */}
                <div className="space-y-3">
                  <h5 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Incident Timeline & Broadcast Logs
                  </h5>
                  <div className="space-y-2.5 border-l-2 border-slate-800 pl-4 ml-1">
                    {inc.updates.map((update) => (
                      <div key={update.id} className="relative space-y-0.5 text-xs">
                        <div className="absolute -left-[21px] top-1 w-2 h-2 rounded-full bg-indigo-500 ring-4 ring-[#090d16]" />
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white uppercase text-[11px] font-mono">
                            [{update.status}]
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono">
                            {new Date(update.timestamp).toLocaleTimeString()} ({timeAgo(update.timestamp)})
                          </span>
                        </div>
                        <p className="text-slate-300 leading-relaxed">{update.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Declare Incident Modal */}
      <IncidentModal
        isOpen={isDeclareOpen}
        onClose={() => setIsDeclareOpen(false)}
        monitors={monitors}
        onSave={createIncident}
      />

      {/* AI Post Mortem Modal */}
      <AiPostMortemModal
        isOpen={selectedIncidentForRca !== null}
        onClose={() => setSelectedIncidentForRca(null)}
        incident={selectedIncidentForRca}
        onSavePostMortem={updateAiPostMortem}
      />
    </div>
  );
}
