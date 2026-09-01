"use client";

import React, { useState } from "react";
import { X, Activity, Globe, Shield, Clock, Plus, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Monitor, MonitorType, HttpMethod } from "@/lib/types";

interface MonitorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    name: string;
    url: string;
    type: MonitorType;
    method?: HttpMethod;
    intervalSeconds: number;
    timeoutSeconds: number;
    status: "operational";
    expectedStatusCode?: number;
    bodyKeyword?: string;
    sslExpiryDays?: number;
    sslIssuer?: string;
    group?: string;
    tags: string[];
  }) => void;
  editMonitor?: Monitor | null;
}

export default function MonitorModal({
  isOpen,
  onClose,
  onSave,
  editMonitor,
}: MonitorModalProps) {
  const [name, setName] = useState(editMonitor?.name || "");
  const [url, setUrl] = useState(editMonitor?.url || "https://");
  const [type, setType] = useState<MonitorType>(editMonitor?.type || "http");
  const [method, setMethod] = useState<HttpMethod>(editMonitor?.method || "GET");
  const [intervalSeconds, setIntervalSeconds] = useState(editMonitor?.intervalSeconds || 30);
  const [timeoutSeconds, setTimeoutSeconds] = useState(editMonitor?.timeoutSeconds || 5);
  const [expectedStatusCode, setExpectedStatusCode] = useState(editMonitor?.expectedStatusCode || 200);
  const [bodyKeyword, setBodyKeyword] = useState(editMonitor?.bodyKeyword || "");
  const [group, setGroup] = useState(editMonitor?.group || "Production APIs");
  const [tagInput, setTagInput] = useState(editMonitor?.tags.join(", ") || "prod, critical");

  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; status?: number; latencyMs?: number; error?: string } | null>(null);

  if (!isOpen) return null;

  const handleTestProbe = async () => {
    if (!url || url === "https://") return;
    setTesting(true);
    setTestResult(null);

    try {
      const res = await fetch(`/api/check?url=${encodeURIComponent(url)}&method=${method}&expectedStatus=${expectedStatusCode}&keyword=${encodeURIComponent(bodyKeyword)}`);
      const data = await res.json();
      setTestResult(data);
    } catch {
      setTestResult({ ok: false, error: "Probe execution failed" });
    } finally {
      setTesting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !url) return;

    const tags = tagInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    onSave({
      name,
      url,
      type,
      method,
      intervalSeconds,
      timeoutSeconds,
      status: "operational",
      expectedStatusCode,
      bodyKeyword: bodyKeyword || undefined,
      group,
      tags,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">
              {editMonitor ? "Edit Uptime Monitor" : "Create New Monitor"}
            </h3>
            <p className="text-xs text-slate-400">
              Configure automated synthetic health probes with alerting rules.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Monitor Type Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Monitor Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setType("http")}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium border transition-all ${
                  type === "http"
                    ? "bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-sm"
                    : "bg-slate-800/60 border-slate-700 text-slate-400 hover:bg-slate-800"
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                HTTP / REST API
              </button>
              <button
                type="button"
                onClick={() => setType("ssl")}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium border transition-all ${
                  type === "ssl"
                    ? "bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-sm"
                    : "bg-slate-800/60 border-slate-700 text-slate-400 hover:bg-slate-800"
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                SSL Certificate
              </button>
              <button
                type="button"
                onClick={() => setType("ping")}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium border transition-all ${
                  type === "ping"
                    ? "bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-sm"
                    : "bg-slate-800/60 border-slate-700 text-slate-400 hover:bg-slate-800"
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                ICMP / Ping
              </button>
            </div>
          </div>

          {/* Monitor Friendly Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Monitor Friendly Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Stripe Webhook Gateway"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>

          {/* URL and Method */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Target Endpoint URL
            </label>
            <div className="flex gap-2">
              {type === "http" && (
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value as HttpMethod)}
                  className="px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-indigo-300 text-xs font-bold font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="HEAD">HEAD</option>
                  <option value="PUT">PUT</option>
                  <option value="DELETE">DELETE</option>
                </select>
              )}
              <input
                type="url"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://api.domain.com/v1/health"
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-mono"
              />
              <button
                type="button"
                onClick={handleTestProbe}
                disabled={testing}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-600 flex items-center gap-1.5 transition-colors"
              >
                {testing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Test Probe"}
              </button>
            </div>
          </div>

          {/* Test Probe Output */}
          {testResult && (
            <div
              className={`p-3 rounded-xl text-xs flex items-center justify-between border ${
                testResult.ok
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
                  : "bg-rose-500/10 border-rose-500/20 text-rose-300"
              }`}
            >
              <div className="flex items-center gap-2">
                {testResult.ok ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-400" />
                )}
                <span>
                  {testResult.ok
                    ? `Live probe passed (Status: ${testResult.status}, Latency: ${testResult.latencyMs}ms)`
                    : `Probe failed: ${testResult.error || `HTTP ${testResult.status}`}`}
                </span>
              </div>
            </div>
          )}

          {/* Intervals & Timeout */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Check Interval
              </label>
              <select
                value={intervalSeconds}
                onChange={(e) => setIntervalSeconds(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value={10}>Every 10 seconds (Turbo)</option>
                <option value={30}>Every 30 seconds (Default)</option>
                <option value={60}>Every 1 minute</option>
                <option value={300}>Every 5 minutes</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Timeout Threshold
              </label>
              <select
                value={timeoutSeconds}
                onChange={(e) => setTimeoutSeconds(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value={3}>3 seconds</option>
                <option value={5}>5 seconds</option>
                <option value={10}>10 seconds</option>
                <option value={15}>15 seconds</option>
              </select>
            </div>
          </div>

          {/* Assertions & Grouping */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Expected HTTP Status
              </label>
              <input
                type="number"
                value={expectedStatusCode}
                onChange={(e) => setExpectedStatusCode(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Body Keyword Check
              </label>
              <input
                type="text"
                value={bodyKeyword}
                onChange={(e) => setBodyKeyword(e.target.value)}
                placeholder="Optional (e.g. status: ok)"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Group & Tags */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Component Group
              </label>
              <input
                type="text"
                value={group}
                onChange={(e) => setGroup(e.target.value)}
                placeholder="e.g. Core Infrastructure"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="prod, critical, auth"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Action buttons */}
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
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-500/20 flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>{editMonitor ? "Update Monitor" : "Activate Monitor"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
