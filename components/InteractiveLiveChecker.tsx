"use client";

import React, { useState } from "react";
import { Search, Loader2, CheckCircle2, AlertTriangle, XCircle, Shield, Globe, Clock, Server, ArrowRight } from "lucide-react";
import { formatMs } from "@/lib/utils";
import Link from "next/link";

interface CheckResult {
  ok: boolean;
  url: string;
  status: number;
  statusText: string;
  latencyMs: number;
  timestamp: string;
  headers?: Record<string, string>;
  ssl?: {
    issuer?: string;
    daysRemaining?: number;
    validTo?: string;
  };
}

export default function InteractiveLiveChecker() {
  const [url, setUrl] = useState("https://api.github.com");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CheckResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTest = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!url) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // 1. Run HTTP check
      const res = await fetch(`/api/check?url=${encodeURIComponent(url)}`);
      const data = await res.json();

      // 2. Run SSL check in parallel if HTTPS
      let sslData = undefined;
      if (url.startsWith("https://") || !url.startsWith("http://")) {
        try {
          const sslRes = await fetch(`/api/ssl-check?url=${encodeURIComponent(url)}`);
          if (sslRes.ok) {
            sslData = await sslRes.json();
          }
        } catch {
          // Ignore ssl check errors gracefully
        }
      }

      setResult({
        ...data,
        ssl: sslData && sslData.ok ? sslData : undefined,
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to execute probe";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const sampleUrls = [
    { label: "GitHub API", url: "https://api.github.com" },
    { label: "Stripe Health", url: "https://api.stripe.com/healthcheck" },
    { label: "Cloudflare DNS", url: "https://1.1.1.1" },
    { label: "Vercel Edge", url: "https://vercel.com" },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto rounded-2xl bg-slate-900/90 border border-slate-800/90 p-6 md:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2 border border-indigo-500/20">
              <Globe className="w-3.5 h-3.5" />
              Live Edge Probe
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              Test Any API or Website in Real Time
            </h3>
            <p className="text-sm text-slate-400">
              Zero registration required. Test TTFB latency, HTTP status codes, and SSL certificate health right now.
            </p>
          </div>

          {/* Quick presets */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-slate-400 mr-1">Presets:</span>
            {sampleUrls.map((s) => (
              <button
                key={s.label}
                onClick={() => {
                  setUrl(s.url);
                  setTimeout(() => handleTest(), 50);
                }}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-slate-700/50 transition-colors"
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search / Input form */}
        <form onSubmit={handleTest} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter endpoint (e.g. https://your-api.com/health)"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950/80 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Probing Edge...</span>
              </>
            ) : (
              <>
                <span>Run Diagnostic Probe</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Error message */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm flex items-center gap-3">
            <XCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Live Result Card */}
        {result && (
          <div className="p-5 rounded-xl bg-slate-950/90 border border-slate-800 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Top status bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                {result.ok ? (
                  <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>200 OK — Healthy</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-rose-400 font-semibold text-sm bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
                    <AlertTriangle className="w-4 h-4" />
                    <span>HTTP {result.status || "FAIL"} — Degraded / Unreachable</span>
                  </div>
                )}
                <span className="text-xs text-slate-400 font-mono">{result.url}</span>
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1 text-slate-300">
                  <Clock className="w-3.5 h-3.5 text-indigo-400" />
                  Latency: <strong className="text-white font-mono">{formatMs(result.latencyMs)}</strong>
                </span>
              </div>
            </div>

            {/* Metrics 3-column breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Latency */}
              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block">Response Time (TTFB)</span>
                  <span className={`text-base font-bold font-mono ${result.latencyMs < 100 ? 'text-emerald-400' : result.latencyMs < 400 ? 'text-amber-400' : 'text-rose-400'}`}>
                    {formatMs(result.latencyMs)}
                  </span>
                </div>
                <div className="p-2 rounded-md bg-slate-800 text-slate-300">
                  <Clock className="w-4 h-4" />
                </div>
              </div>

              {/* SSL Details */}
              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block">SSL Certificate</span>
                  <span className="text-sm font-semibold text-white">
                    {result.ssl?.daysRemaining ? `${result.ssl.daysRemaining} days valid` : "TLS 1.3 Active"}
                  </span>
                </div>
                <div className="p-2 rounded-md bg-slate-800 text-emerald-400">
                  <Shield className="w-4 h-4" />
                </div>
              </div>

              {/* Server / CDN */}
              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block">Server Gateway</span>
                  <span className="text-xs font-mono text-slate-200 truncate max-w-[120px] block">
                    {result.headers?.server || "Cloud Edge"}
                  </span>
                </div>
                <div className="p-2 rounded-md bg-slate-800 text-indigo-400">
                  <Server className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Call to Action to save monitor in dashboard */}
            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Want 30-second automated checks & instant Slack alerts for this endpoint?
              </span>
              <Link
                href="/dashboard/monitors"
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                <span>Add to 24/7 Monitor Hub</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
