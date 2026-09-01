"use client";

import React, { useState } from "react";
import { Check, Sparkles } from "lucide-react";
import Link from "next/link";

export default function RoiCalculator() {
  const [monthlyRevenue, setMonthlyRevenue] = useState(75000);
  const [monthlyOutageMinutes, setMonthlyOutageMinutes] = useState(30);
  const [engineerHourlyRate, setEngineerHourlyRate] = useState(140);

  const revenuePerMinute = monthlyRevenue / (30 * 24 * 60);
  const directRevenueLoss = Math.round(revenuePerMinute * monthlyOutageMinutes);
  const engineeringTriageCost = Math.round((monthlyOutageMinutes / 60) * engineerHourlyRate * 3);
  const churnRisk = Math.round(monthlyRevenue * 0.025);
  const totalAnnualOutageCost = (directRevenueLoss + engineeringTriageCost + churnRisk) * 12;

  const estimatedAnnualSavings = Math.max(0, Math.round(totalAnnualOutageCost * 0.88) - 29 * 12);

  return (
    <div className="w-full max-w-5xl mx-auto rounded-3xl apple-card p-8 md:p-12 space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-2.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.06] text-zinc-300 text-xs font-medium border border-white/[0.08]">
          <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
          <span>Reliability Economics</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-semibold text-white tracking-tight">
          Calculate the Cost of Unmonitored Downtime
        </h2>
        <p className="text-xs md:text-sm text-zinc-400">
          Quantify transactional risk, customer churn exposure, and engineering triage overhead.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Sliders */}
        <div className="lg:col-span-7 space-y-6 bg-black/40 p-6 rounded-2xl border border-white/[0.06]">
          {/* Slider 1 */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-medium text-zinc-300">Monthly Recurring Revenue (MRR)</label>
              <span className="font-mono font-semibold text-white">${monthlyRevenue.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="10000"
              max="500000"
              step="5000"
              value={monthlyRevenue}
              onChange={(e) => setMonthlyRevenue(Number(e.target.value))}
              className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-white"
            />
            <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
              <span>$10,000</span>
              <span>$250,000</span>
              <span>$500,000</span>
            </div>
          </div>

          {/* Slider 2 */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-medium text-zinc-300">Estimated Monthly Downtime</label>
              <span className="font-mono font-semibold text-white">{monthlyOutageMinutes} minutes / mo</span>
            </div>
            <input
              type="range"
              min="5"
              max="180"
              step="5"
              value={monthlyOutageMinutes}
              onChange={(e) => setMonthlyOutageMinutes(Number(e.target.value))}
              className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-white"
            />
            <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
              <span>5 mins (99.99%)</span>
              <span>45 mins (99.9%)</span>
              <span>180 mins (99.5%)</span>
            </div>
          </div>

          {/* Slider 3 */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-medium text-zinc-300">Engineer Hourly Rate</label>
              <span className="font-mono font-semibold text-white">${engineerHourlyRate}/hr</span>
            </div>
            <input
              type="range"
              min="60"
              max="300"
              step="10"
              value={engineerHourlyRate}
              onChange={(e) => setEngineerHourlyRate(Number(e.target.value))}
              className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-white"
            />
          </div>

          {/* 3 Metrics breakdown */}
          <div className="pt-4 border-t border-white/[0.06] grid grid-cols-3 gap-2.5 text-center">
            <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <span className="text-[10px] text-zinc-500 block">Lost Volume</span>
              <span className="text-xs font-mono font-semibold text-zinc-200 mt-0.5 block">
                ${(directRevenueLoss * 12).toLocaleString()}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <span className="text-[10px] text-zinc-500 block">Engineer Triage</span>
              <span className="text-xs font-mono font-semibold text-zinc-200 mt-0.5 block">
                ${(engineeringTriageCost * 12).toLocaleString()}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <span className="text-[10px] text-zinc-500 block">Churn Risk</span>
              <span className="text-xs font-mono font-semibold text-zinc-200 mt-0.5 block">
                ${(churnRisk * 12).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Results Card */}
        <div className="lg:col-span-5 rounded-2xl bg-zinc-900/90 border border-white/[0.12] p-6 md:p-8 space-y-6 shadow-2xl relative">
          <div>
            <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-400 block mb-1">
              Estimated Net Annual Savings
            </span>
            <div className="text-4xl md:text-5xl font-semibold tracking-tight text-white font-mono">
              ${estimatedAnnualSavings.toLocaleString()}
            </div>
            <p className="text-xs text-zinc-400 mt-2">
              Based on 88% Mean Time to Resolution (MTTR) improvement through automated 30s probes and instant RCA generation.
            </p>
          </div>

          <div className="space-y-2 pt-2 border-t border-white/[0.08] text-xs text-zinc-300">
            <div className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>30-second multi-region probe consensus</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Sub-second alert dispatch (Slack / Webhooks)</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Public white-label status page & badges</span>
            </div>
          </div>

          <Link
            href="/dashboard"
            className="apple-btn-primary w-full py-2.5 text-xs text-center block font-semibold"
          >
            Start Free Monitoring
          </Link>
        </div>
      </div>
    </div>
  );
}
