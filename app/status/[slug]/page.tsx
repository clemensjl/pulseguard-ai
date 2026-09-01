"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Clock,
  ShieldCheck,
  Bell,
  X,
  Send,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import UptimeBar from "@/components/UptimeBar";
import { useStore } from "@/lib/store";
import { getStatusColor, timeAgo } from "@/lib/utils";

export default function PublicStatusPage() {
  const { statusPage, monitors, incidents } = useStore();
  const [isSubscribeOpen, setIsSubscribeOpen] = useState(false);
  const [subscriberEmail, setSubscriberEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const activeIncidents = incidents.filter((i) => i.status !== "resolved");
  const hasOutage = monitors.some((m) => m.status === "down");
  const hasDegraded = monitors.some((m) => m.status === "degraded");

  let overallStatusText = "All Systems Operational";
  let overallColor = "emerald";

  if (hasOutage) {
    overallStatusText = "Active Outage Detected";
    overallColor = "rose";
  } else if (hasDegraded) {
    overallStatusText = "Experiencing Degraded Performance";
    overallColor = "amber";
  }

  // Group components by group
  const groupedComponents = statusPage.components.reduce((acc, comp) => {
    const groupName = comp.group || "Core Services";
    if (!acc[groupName]) acc[groupName] = [];
    acc[groupName].push(comp);
    return acc;
  }, {} as Record<string, typeof statusPage.components>);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subscriberEmail) return;
    setSubscribed(true);
    setTimeout(() => {
      setSubscribed(false);
      setIsSubscribeOpen(false);
      setSubscriberEmail("");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col justify-between selection:bg-indigo-500/30">
      {/* Top Brand Bar */}
      <header className="border-b border-slate-800/80 bg-[#090e1c]/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white flex items-center justify-center shadow-md shadow-indigo-500/25">
              <Activity className="w-4 h-4" />
            </div>
            <span className="font-bold text-base text-white tracking-tight">
              {statusPage.companyName}
            </span>
          </div>

          <button
            onClick={() => setIsSubscribeOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-500/20 transition-all"
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Get Updates</span>
          </button>
        </div>
      </header>

      {/* Main Status Container */}
      <main className="mx-auto max-w-4xl w-full px-4 sm:px-6 py-10 space-y-8 flex-1">
        {/* Big Overall Health Banner */}
        <div
          className={`p-6 md:p-8 rounded-3xl border shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
            overallColor === "emerald"
              ? "bg-emerald-950/30 border-emerald-500/30 text-emerald-400"
              : overallColor === "amber"
              ? "bg-amber-950/30 border-amber-500/30 text-amber-400"
              : "bg-rose-950/30 border-rose-500/30 text-rose-400"
          }`}
        >
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                overallColor === "emerald"
                  ? "bg-emerald-500/20 text-emerald-400"
                  : overallColor === "amber"
                  ? "bg-amber-500/20 text-amber-400"
                  : "bg-rose-500/20 text-rose-400"
              }`}
            >
              {overallColor === "emerald" ? (
                <CheckCircle2 className="w-7 h-7" />
              ) : (
                <AlertTriangle className="w-7 h-7" />
              )}
            </div>

            <div>
              <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">
                {overallStatusText}
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                Probed continuously across multiple edge zones worldwide.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <span className="text-xs font-mono font-bold bg-slate-900/80 px-3 py-1.5 rounded-full border border-slate-700 text-slate-200">
              99.98% 90-Day SLA
            </span>
          </div>
        </div>

        {/* Announcement Banner if active */}
        {statusPage.announcement?.active && (
          <div className="p-4 rounded-2xl bg-indigo-950/50 border border-indigo-500/30 text-indigo-300 text-xs flex items-center gap-3">
            <Sparkles className="w-4 h-4 text-indigo-400 flex-shrink-0" />
            <span>{statusPage.announcement.message}</span>
          </div>
        )}

        {/* Global 90-Day Uptime Calendar */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span className="font-bold text-white uppercase tracking-wider">System Availability (Past 90 Days)</span>
            <span className="font-mono text-emerald-400">99.98% Uptime</span>
          </div>
          <UptimeBar overallUptime={99.98} />
        </div>

        {/* Component Groups List */}
        <div className="space-y-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Cloud Infrastructure Services
          </h3>

          <div className="space-y-4">
            {Object.entries(groupedComponents).map(([groupName, comps]) => (
              <div
                key={groupName}
                className="rounded-2xl bg-slate-900/80 border border-slate-800 divide-y divide-slate-800/80 overflow-hidden"
              >
                <div className="px-5 py-3 bg-slate-950/60 font-semibold text-xs text-slate-400 uppercase tracking-wider">
                  {groupName}
                </div>

                {comps.map((comp) => {
                  const statusColors = getStatusColor(comp.status);

                  return (
                    <div
                      key={comp.id}
                      className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-850/40 transition-colors"
                    >
                      <div>
                        <h4 className="text-sm font-bold text-white">{comp.name}</h4>
                        <p className="text-xs text-slate-400">{comp.description}</p>
                      </div>

                      <span
                        className={`self-start sm:self-center inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold capitalize border ${statusColors.bg} ${statusColors.text} ${statusColors.border}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${statusColors.dot} ${statusColors.glow}`} />
                        <span>{comp.status}</span>
                      </span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Incidents Section */}
        <div className="space-y-4 pt-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Past Incidents & Bulletins
          </h3>

          <div className="space-y-4">
            {incidents.slice(0, 3).map((inc) => (
              <div
                key={inc.id}
                className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 text-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h4 className="text-sm font-bold text-white">{inc.title}</h4>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] text-slate-400">
                      {new Date(inc.createdAt).toLocaleDateString()}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono text-[11px] uppercase">
                      {inc.status}
                    </span>
                  </div>
                </div>

                <p className="text-slate-300">{inc.impact}</p>

                <div className="space-y-2 border-l-2 border-slate-800 pl-3 pt-1">
                  {inc.updates.map((u) => (
                    <div key={u.id} className="text-[11px]">
                      <span className="font-bold text-slate-200 uppercase mr-1">[{u.status}]</span>
                      <span className="text-slate-400 font-mono mr-2">
                        {new Date(u.timestamp).toLocaleTimeString()}
                      </span>
                      <span className="text-slate-300">{u.message}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#050810] py-8 text-center text-xs text-slate-400 space-y-2">
        <div className="flex items-center justify-center gap-1.5">
          <span>Powered by</span>
          <Link
            href="/"
            className="text-indigo-400 hover:text-indigo-300 font-bold inline-flex items-center gap-1"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>PulseGuard AI</span>
          </Link>
        </div>
        <p>© 2026 {statusPage.companyName}. All rights reserved.</p>
      </footer>

      {/* Subscribe Modal */}
      {isSubscribeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 relative">
            <button
              onClick={() => setIsSubscribeOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {subscribed ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-white">Subscribed!</h4>
                <p className="text-xs text-slate-400">
                  You will receive real-time incident bulletins directly in your inbox.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">Subscribe to Alerts</h4>
                    <p className="text-xs text-slate-400">
                      Receive notifications whenever an incident is opened or resolved.
                    </p>
                  </div>
                </div>

                <input
                  type="email"
                  required
                  value={subscriberEmail}
                  onChange={(e) => setSubscriberEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-500/20 flex items-center justify-center gap-1.5 transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Subscribe to Notifications</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
