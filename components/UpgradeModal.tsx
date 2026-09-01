"use client";

import React, { useState } from "react";
import { X, Check, Zap, Sparkles, Loader2, CreditCard, ShieldCheck } from "lucide-react";
import confetti from "canvas-confetti";
import { useStore } from "@/lib/store";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UpgradeModal({ isOpen, onClose }: UpgradeModalProps) {
  const { organization, upgradePlan } = useStore();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");
  const [loadingTier, setLoadingTier] = useState<string | null>(null);
  const [successPlan, setSuccessPlan] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSimulatedUpgrade = (tier: "pro" | "enterprise") => {
    setLoadingTier(tier);
    setTimeout(() => {
      upgradePlan(tier);
      setLoadingTier(null);
      setSuccessPlan(tier);

      // Trigger celebratory confetti
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#6366f1", "#10b981", "#fbbf24", "#f43f5e"],
      });

      setTimeout(() => {
        setSuccessPlan(null);
        onClose();
      }, 2500);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-4xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 md:p-8 relative max-h-[95vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {successPlan ? (
          <div className="py-16 text-center space-y-4 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-white">
              Successfully Upgraded to {successPlan.toUpperCase()}!
            </h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto">
              Your organization limits have been updated with 10-second turbo polling, unlimited status page subscribers, and AI incident post-mortems.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="text-center max-w-lg mx-auto space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold uppercase tracking-wider border border-indigo-500/20">
                <Sparkles className="w-3.5 h-3.5" />
                Zero-Friction Upgrade
              </div>
              <h3 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                Scale Your SaaS Reliability
              </h3>
              <p className="text-xs md:text-sm text-slate-400">
                Current Plan: <strong className="text-indigo-400 uppercase font-mono">{organization.plan}</strong> ({organization.monitorsLimit} monitors)
              </p>

              {/* Monthly / Annual switch */}
              <div className="inline-flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800 mt-2">
                <button
                  onClick={() => setBillingCycle("monthly")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    billingCycle === "monthly" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingCycle("annual")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                    billingCycle === "annual" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  <span>Annual</span>
                  <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                    Save 20%
                  </span>
                </button>
              </div>
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pro Tier */}
              <div className={`rounded-2xl p-6 border relative flex flex-col justify-between ${
                organization.plan === "pro" ? "bg-indigo-950/40 border-indigo-500/50" : "bg-slate-950/80 border-slate-800"
              }`}>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-lg font-bold text-white">Pro Plan</h4>
                      <p className="text-xs text-slate-400">For fast-growing SaaS startups</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 font-mono text-xs font-bold">
                      Most Popular
                    </span>
                  </div>

                  <div className="text-3xl font-extrabold text-white font-mono flex items-baseline gap-1">
                    <span>${billingCycle === "annual" ? "24" : "29"}</span>
                    <span className="text-xs text-slate-400 font-normal">/ month</span>
                  </div>

                  <ul className="space-y-2.5 text-xs text-slate-300 pt-3 border-t border-slate-800">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span><strong>100</strong> Synthetics & API Monitors</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span><strong>30-second</strong> check frequency</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>Unlimited Slack & Discord webhooks</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>Autonomous AI Incident Post-Mortems</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>White-label public status pages</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-6">
                  <button
                    disabled={loadingTier !== null || organization.plan === "pro"}
                    onClick={() => handleSimulatedUpgrade("pro")}
                    className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                  >
                    {loadingTier === "pro" ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Processing Stripe Checkout...</span>
                      </>
                    ) : organization.plan === "pro" ? (
                      "Current Active Plan"
                    ) : (
                      <>
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Upgrade to Pro</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Enterprise Tier */}
              <div className={`rounded-2xl p-6 border relative flex flex-col justify-between ${
                organization.plan === "enterprise" ? "bg-indigo-950/40 border-indigo-500/50" : "bg-slate-950/80 border-slate-800"
              }`}>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-lg font-bold text-white">Enterprise Tier</h4>
                      <p className="text-xs text-slate-400">Mission-critical scale & compliance</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold">
                      Turbo SLA
                    </span>
                  </div>

                  <div className="text-3xl font-extrabold text-white font-mono flex items-baseline gap-1">
                    <span>${billingCycle === "annual" ? "79" : "99"}</span>
                    <span className="text-xs text-slate-400 font-normal">/ month</span>
                  </div>

                  <ul className="space-y-2.5 text-xs text-slate-300 pt-3 border-t border-slate-800">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span><strong>500</strong> Synthetics & API Monitors</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span><strong>10-second</strong> turbo check frequency</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>Multi-region synthetic ping consensus</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>Custom status page domains with SSL</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>Dedicated SLA support & audit logs</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-6">
                  <button
                    disabled={loadingTier !== null || organization.plan === "enterprise"}
                    onClick={() => handleSimulatedUpgrade("enterprise")}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                  >
                    {loadingTier === "enterprise" ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Processing Stripe Checkout...</span>
                      </>
                    ) : organization.plan === "enterprise" ? (
                      "Current Active Plan"
                    ) : (
                      <>
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Upgrade to Enterprise</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
