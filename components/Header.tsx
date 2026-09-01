"use client";

import React, { useState } from "react";
import { RefreshCw, CheckCircle2 } from "lucide-react";
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
      setTimeout(() => setRefreshDone(false), 2000);
    } catch {
      //
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-3.5 border-b border-white/[0.08] bg-black/70 backdrop-blur-2xl">
      <div>
        <h1 className="text-sm font-semibold text-white tracking-tight">{title}</h1>
        {subtitle && <p className="text-[11px] text-zinc-400">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-2.5">
        <button
          onClick={handleRefreshAll}
          disabled={refreshing}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
            refreshDone
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
              : "bg-white/[0.04] hover:bg-white/[0.08] border-white/[0.08] text-zinc-300 hover:text-white"
          }`}
        >
          <RefreshCw className={`w-3 h-3 ${refreshing ? "animate-spin text-white" : ""}`} />
          <span>{refreshing ? "Probing Edge..." : refreshDone ? "Complete" : "Run All Checks"}</span>
        </button>

        <button
          onClick={onOpenUpgrade}
          className="px-2.5 py-1 rounded-full bg-white/[0.06] hover:bg-white/[0.1] text-zinc-300 text-[11px] font-mono uppercase font-semibold border border-white/[0.08] transition-colors"
        >
          {organization.plan}
        </button>

        <div className="w-6 h-6 rounded-full bg-zinc-800 text-white flex items-center justify-center text-[10px] font-semibold border border-white/[0.1]">
          CJ
        </div>
      </div>
    </header>
  );
}
