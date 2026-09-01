"use client";

import React, { useState } from "react";
import {
  Plug,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Send,
  MessageSquare,
  Globe,
  ToggleLeft,
  ToggleRight,
  ShieldCheck,
} from "lucide-react";
import Header from "@/components/Header";
import { useStore } from "@/lib/store";
import { Integration } from "@/lib/types";

export default function IntegrationsPage() {
  const { integrations, addIntegration, toggleIntegration, deleteIntegration } = useStore();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState<Integration["type"]>("slack");
  const [webhookUrl, setWebhookUrl] = useState("");

  const [testingId, setTestingId] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ id: string; ok: boolean; message: string } | null>(null);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !webhookUrl) return;

    addIntegration({
      name,
      type,
      webhookUrl,
      events: ["down", "degraded", "recovered", "ssl_expiry"],
      enabled: true,
    });

    setName("");
    setWebhookUrl("");
    setIsAddOpen(false);
  };

  const handleTestDispatch = async (int: Integration) => {
    setTestingId(int.id);
    setTestResult(null);

    try {
      const res = await fetch("/api/webhook-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          webhookUrl: int.webhookUrl,
          type: int.type,
        }),
      });
      const data = await res.json();
      setTestResult({
        id: int.id,
        ok: data.ok,
        message: data.message || "Test payload delivered successfully!",
      });
    } catch {
      setTestResult({
        id: int.id,
        ok: false,
        message: "Failed to dispatch payload",
      });
    } finally {
      setTestingId(null);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#090d16]">
      <Header
        title="Alert Channels & Webhook Integrations"
        subtitle="Connect Slack, Discord, Microsoft Teams, and custom JSON webhook endpoints"
      />

      <main className="p-6 md:p-8 space-y-8 max-w-5xl w-full mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white">Configured Notification Channels</h3>
            <p className="text-xs text-slate-400">
              Triggered automatically when any probe detects an outage, latency surge, or SSL expiry warning.
            </p>
          </div>

          <button
            onClick={() => setIsAddOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Connect Channel</span>
          </button>
        </div>

        {/* Integration List */}
        <div className="space-y-4">
          {integrations.map((int) => (
            <div
              key={int.id}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 hover:border-slate-700 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 text-slate-200 flex items-center justify-center border border-slate-700">
                    {int.type === "slack" ? (
                      <span className="font-bold text-sm text-indigo-400">#</span>
                    ) : int.type === "discord" ? (
                      <MessageSquare className="w-5 h-5 text-indigo-400" />
                    ) : (
                      <Globe className="w-5 h-5 text-emerald-400" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white">{int.name}</h4>
                      <span className="text-[10px] px-2 py-0.5 rounded uppercase font-mono font-bold bg-slate-800 text-slate-300">
                        {int.type}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 font-mono truncate max-w-md block">
                      {int.webhookUrl}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleTestDispatch(int)}
                    disabled={testingId === int.id}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    {testingId === int.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                    ) : (
                      <Send className="w-3.5 h-3.5 text-indigo-400" />
                    )}
                    <span>{testingId === int.id ? "Sending..." : "Test Dispatch"}</span>
                  </button>

                  <button
                    onClick={() => toggleIntegration(int.id)}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-white transition-colors"
                    title={int.enabled ? "Disable Integration" : "Enable Integration"}
                  >
                    {int.enabled ? (
                      <ToggleRight className="w-7 h-7 text-emerald-400" />
                    ) : (
                      <ToggleLeft className="w-7 h-7 text-slate-400" />
                    )}
                  </button>

                  <button
                    onClick={() => deleteIntegration(int.id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Test output message */}
              {testResult && testResult.id === int.id && (
                <div
                  className={`p-3 rounded-xl text-xs flex items-center gap-2 border animate-in fade-in duration-200 ${
                    testResult.ok
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
                      : "bg-rose-500/10 border-rose-500/20 text-rose-300"
                  }`}
                >
                  {testResult.ok ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  )}
                  <span>{testResult.message}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Add Modal */}
        {isAddOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 relative">
              <h4 className="text-base font-bold text-white mb-4">Connect Notification Channel</h4>

              <form onSubmit={handleAdd} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Channel Friendly Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. #ops-alarms Slack Channel"
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Platform Type
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as Integration["type"])}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  >
                    <option value="slack">Slack Incoming Webhook</option>
                    <option value="discord">Discord Webhook</option>
                    <option value="teams">Microsoft Teams</option>
                    <option value="webhook">Custom JSON Webhook</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Webhook Destination URL
                  </label>
                  <input
                    type="url"
                    required
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    placeholder="https://hooks.slack.example.com/services/..."
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddOpen(false)}
                    className="px-3 py-2 rounded-xl text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
                  >
                    Connect Channel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
