"use client";

import React, { useState } from "react";
import { RefreshCw, Search, Bell, Sparkles, Zap, Shield, CheckCircle2 } from "lucide-react";
import { useStore } from "@/lib/store";

interface HeaderProps {
  title: string;
  subtitle?: string;
  onOpenUpgrade?: () => void;
}

export default function Header({ title, subtitle, onOpenUpgrade }: HeaderProps) {
  const { runAllChecks, organization } = useStore();
  const [refreshing, setRefreshing] = useState(false);
  const [refreshDone, setRefreshDone] = useState(false);

  const handleRefreshAll = async () => {
    setRefreshing(true);
    setRefreshDone(false);
    try {
      await runAllChecks();
      setRefreshDone(true);
      setTimeout(() => setRefreshDone(false), 2500);
    } catch {
      //
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-[#090d16]/80 backdrop-blur-xl">
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight">{title}</h1>
        {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        {/* Run All Probes Button */}
        <button
          onClick={handleRefreshAll}
          disabled={refreshing}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
            refreshDone
              ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
              : "bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-300 hover:text-white"
          }`}
        >
          {refreshing ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-400" />
          ) : refreshDone ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <RefreshCw className="w-3.5 h-3.5" />
          )}
          <span>{refreshing ? "Probing Edge..." : refreshDone ? "Probes Complete!" : "Check All Now"}</span>
        </button>

        {/* Upgrade Pill */}
        <button
          onClick={onOpenUpgrade}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 text-indigo-300 hover:text-white text-xs font-semibold transition-all"
        >
          <Sparkles className="w-3 h-3 text-indigo-400" />
          <span className="capitalize">{organization.plan} Tier</span>
        </button>

        {/* User Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
          <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold ring-2 ring-indigo-500/30">
            CJ
          </div>
        </div>
      </div>
    </header>
  );
}
