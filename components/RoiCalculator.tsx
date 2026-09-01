"use client";

import React, { useState } from "react";
import { DollarSign, TrendingUp, ShieldAlert, Sparkles, Check } from "lucide-react";

export default function RoiCalculator() {
  const [monthlyRevenue, setMonthlyRevenue] = useState(50000);
  const [monthlyOutageMinutes, setMonthlyOutageMinutes] = useState(45);
  const [engineerHourlyRate, setEngineerHourlyRate] = useState(120);

  // Math calculations
  const revenuePerMinute = monthlyRevenue / (30 * 24 * 60);
  const directRevenueLoss = Math.round(revenuePerMinute * monthlyOutageMinutes);
  const engineeringTriageCost = Math.round((monthlyOutageMinutes / 60) * engineerHourlyRate * 3); // 3 engineers on incident bridge
  const customerChurnRisk = Math.round(monthlyRevenue * 0.035); // 3.5% churn risk on uncommunicated outages
  const totalAnnualCost = (directRevenueLoss + engineeringTriageCost + customerChurnRisk) * 12;

  // PulseGuard AI savings (detects within 30s instead of 25m user report, auto post-mortems)
  const pulseGuardAnnualCost = 29 * 12; // Pro tier
  const estimatedSavings = Math.max(0, Math.round(totalAnnualCost * 0.85) - pulseGuardAnnualCost);

  return (
    <div className="w-full max-w-5xl mx-auto rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 p-8 md:p-12 shadow-2xl relative overflow-hidden">
      {/* Background radial highlight */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold uppercase tracking-wider border border-emerald-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          Interactive SaaS ROI Calculator
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          How Much Does 1 Outage Cost Your SaaS?
        </h2>
        <p className="text-slate-400 text-sm md:text-base">
          Unmonitored API errors bleed customer trust, churn subscriptions, and burn engineer triage hours. See your estimated annual savings with PulseGuard AI.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Sliders Column */}
        <div className="lg:col-span-7 space-y-6 bg-slate-950/60 p-6 rounded-2xl border border-slate-800/80">
          {/* Slider 1: Monthly Revenue */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <label className="font-medium text-slate-300">Monthly Recurring Revenue (MRR)</label>
              <span className="font-mono font-bold text-indigo-400">${monthlyRevenue.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="5000"
              max="500000"
              step="5000"
              value={monthlyRevenue}
              onChange={(e) => setMonthlyRevenue(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
            <div className="flex justify-between text-[11px] text-slate-400 font-mono">
              <span>$5k/mo</span>
              <span>$250k/mo</span>
              <span>$500k/mo</span>
            </div>
          </div>

          {/* Slider 2: Average Monthly Outage / Degraded Time */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <label className="font-medium text-slate-300">Estimated Monthly Downtime (Minutes)</label>
              <span className="font-mono font-bold text-amber-400">{monthlyOutageMinutes} mins / mo</span>
            </div>
            <input
              type="range"
              min="5"
              max="240"
              step="5"
              value={monthlyOutageMinutes}
              onChange={(e) => setMonthlyOutageMinutes(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-[11px] text-slate-400 font-mono">
              <span>5 mins (99.99%)</span>
              <span>60 mins (99.86%)</span>
              <span>240 mins (99.4%)</span>
            </div>
          </div>

          {/* Slider 3: Hourly Engineer Cost */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <label className="font-medium text-slate-300">Blended Engineer Hourly Cost</label>
              <span className="font-mono font-bold text-slate-200">${engineerHourlyRate}/hr</span>
            </div>
            <input
              type="range"
              min="50"
              max="300"
              step="10"
              value={engineerHourlyRate}
              onChange={(e) => setEngineerHourlyRate(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-slate-400"
            />
          </div>

          {/* Cost Breakdown Items */}
          <div className="pt-4 border-t border-slate-800/80 grid grid-cols-3 gap-3 text-center">
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[11px] text-slate-400 block">Lost Transactions</span>
              <span className="text-sm font-bold text-rose-400 font-mono">${(directRevenueLoss * 12).toLocaleString()}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[11px] text-slate-400 block">Engineering Triage</span>
              <span className="text-sm font-bold text-amber-400 font-mono">${(engineeringTriageCost * 12).toLocaleString()}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[11px] text-slate-400 block">Churn Prevention</span>
              <span className="text-sm font-bold text-indigo-400 font-mono">${(customerChurnRisk * 12).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Results Card */}
        <div className="lg:col-span-5 rounded-2xl bg-gradient-to-br from-indigo-950/80 via-slate-900 to-slate-950 border border-indigo-500/30 p-6 md:p-8 space-y-6 shadow-xl relative">
          <div>
            <span className="text-xs uppercase tracking-wider text-indigo-300 font-semibold block mb-1">
              Estimated Annual Savings
            </span>
            <div className="text-4xl md:text-5xl font-extrabold text-white tracking-tight flex items-baseline gap-1 font-mono">
              <span className="text-emerald-400">${estimatedSavings.toLocaleString()}</span>
              <span className="text-sm text-slate-400 font-normal">/ year</span>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Based on 85% MTTR reduction with autonomous 30-sec synthetic polling and instant AI post-mortem root cause analysis.
            </p>
          </div>

          <div className="space-y-2.5 pt-2 border-t border-indigo-500/20 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>30-second multi-region probe intervals</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Instant Slack, Discord & Webhook paging</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Automated AI post-mortem & incident timeline</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Public hosted status page & badge embeds</span>
            </div>
          </div>

          <a
            href="/dashboard"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all block text-center"
          >
            Start Monitoring for $0 Today
          </a>
        </div>
      </div>
    </div>
  );
}
