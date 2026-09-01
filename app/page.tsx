"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Check,
  Shield,
  Zap,
  Globe,
  Radio,
  Sparkles,
  Server,
  Lock,
  Clock,
  Terminal,
  Plus,
  Minus,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import InteractiveLiveChecker from "@/components/InteractiveLiveChecker";
import RoiCalculator from "@/components/RoiCalculator";
import UptimeBar from "@/components/UptimeBar";

export default function LandingPage() {
  const [pricingCycle, setPricingCycle] = useState<"monthly" | "annual">("annual");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: "How does PulseGuard run with zero ongoing cloud hosting costs?",
      a: "PulseGuard executes synthetic diagnostic probes using serverless edge handlers distributed on Vercel's global CDN network. You get multi-region health checks without paying hundreds of dollars for dedicated proxy fleets.",
    },
    {
      q: "How does the AI Post-Mortem engine work?",
      a: "When an anomaly or service disruption occurs, PulseGuard correlates synthetic probe response codes, TTFB variance, and incident logs to formulate a structured Root-Cause Analysis (RCA) with mitigation checklists.",
    },
    {
      q: "Can I host a public status page on a custom domain?",
      a: "Yes. PulseGuard provides an instant public status page hosted at /status/[your-brand] with support for custom CNAME domains (e.g. status.yourcompany.com) with automatic SSL certificate provisioning.",
    },
    {
      q: "What notification channels are supported?",
      a: "We natively support Slack Incoming Webhooks, Discord Webhooks, Microsoft Teams, and custom JSON webhook endpoints with customizable event filters.",
    },
    {
      q: "What check intervals are supported?",
      a: "Probes can run as frequently as every 10 seconds across global edge zones with multi-region consensus verification to eliminate false alarms.",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-[#f5f5f7] flex flex-col selection:bg-white/20 selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 md:pt-36 md:pb-28 px-4 sm:px-6 lg:px-8 ambient-glow overflow-hidden">
        <div className="relative mx-auto max-w-5xl text-center space-y-6">
          {/* Subtle Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-white/[0.08] backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span className="text-xs font-medium text-zinc-300">
              Autonomous Synthetic Observability • 99.99% SLA
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-semibold tracking-tightest text-white leading-[1.05]">
            Uptime & Telemetry.
            <br />
            <span className="text-zinc-400 font-normal">Engineered for Reliability.</span>
          </h1>

          {/* Subheading */}
          <p className="mx-auto max-w-2xl text-sm sm:text-base text-zinc-400 font-normal leading-relaxed">
            Multi-protocol synthetic probes, TLS certificate tracking, autonomous incident post-mortems, and white-labeled public status pages.
          </p>

          {/* CTA Row */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              href="/dashboard"
              className="apple-btn-primary px-7 py-3 text-xs font-semibold flex items-center justify-center gap-2 group w-full sm:w-auto"
            >
              <span>Launch Console</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <Link
              href="/status/demo"
              className="apple-btn-secondary px-7 py-3 text-xs font-medium flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <span>View Public Status</span>
            </Link>
          </div>

          {/* Micro badges */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-400 font-medium">
            <span>• 10-second check intervals</span>
            <span>• Sub-second alert dispatch</span>
            <span>• $0 infrastructure spend</span>
          </div>
        </div>
      </section>

      {/* Live Interactive Diagnostics Section */}
      <section id="live-tester" className="py-12 px-4 sm:px-6 lg:px-8 relative">
        <div className="mx-auto max-w-5xl">
          <InteractiveLiveChecker />
        </div>
      </section>

      {/* Bento Grid Features */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 border-t border-white/[0.08]">
        <div className="mx-auto max-w-5xl space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight">
              Designed with Precision. Built for Scale.
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400">
              A complete reliability toolkit engineered for modern engineering organizations.
            </p>
          </div>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: 2-col span */}
            <div className="md:col-span-2 rounded-3xl apple-card p-8 space-y-6 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-white">
                  <Radio className="w-4 h-4 text-emerald-400" />
                </div>
                <h3 className="text-xl font-semibold text-white tracking-tight">
                  Multi-Protocol Synthetic Probing
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed max-w-md">
                  Execute synthetic HTTP/HTTPS requests with custom headers, JSON assertions, ICMP ping latency, and automatic TLS 1.3 certificate expiration watchdogs.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-black/60 border border-white/[0.06] space-y-2">
                <div className="flex justify-between items-center text-[11px] text-zinc-400 font-mono">
                  <span>api.production.internal/v1</span>
                  <span className="text-emerald-400 font-bold">200 OK • 18ms</span>
                </div>
                <div className="h-1.5 w-full bg-white/[0.06] rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400 w-full" />
                </div>
              </div>
            </div>

            {/* Card 2: 1-col span */}
            <div className="rounded-3xl apple-card p-8 space-y-6 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-white">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-white tracking-tight">
                  AI Incident Post-Mortems
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Synthesize telemetry spikes and timeline notes into structured Root-Cause Analysis documents and mitigation checklists.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-black/60 border border-white/[0.06] text-[11px] font-mono text-zinc-400">
                <span className="text-purple-300 block mb-1">Root Cause Analysis</span>
                <span className="text-zinc-500">Auto-generated in 1.2s</span>
              </div>
            </div>

            {/* Card 3: 1-col span */}
            <div className="rounded-3xl apple-card p-8 space-y-6 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-white">
                  <Globe className="w-4 h-4 text-sky-400" />
                </div>
                <h3 className="text-xl font-semibold text-white tracking-tight">
                  Hosted Status Pages
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  White-label public status portals with 90-day SLA history bars, active notices, and dynamic SVG badges for READMEs.
                </p>
              </div>

              <Link
                href="/status/demo"
                className="text-xs text-zinc-300 hover:text-white font-medium flex items-center gap-1.5"
              >
                <span>Preview Status Page</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Card 4: 2-col span */}
            <div className="md:col-span-2 rounded-3xl apple-card p-8 space-y-6 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-white">
                  <Zap className="w-4 h-4 text-amber-400" />
                </div>
                <h3 className="text-xl font-semibold text-white tracking-tight">
                  Multi-Channel Instant Alert Dispatch
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed max-w-md">
                  Broadcast alarms to Slack, Discord, Microsoft Teams, and custom JSON webhook endpoints with sub-second latency.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 text-xs font-mono text-zinc-300">
                <span className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08]"># Slack Webhooks</span>
                <span className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08]">Discord Webhooks</span>
                <span className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08]">Custom REST Webhook</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROI Calculator */}
      <section id="roi-calculator" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-white/[0.08]">
        <RoiCalculator />
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 border-t border-white/[0.08]">
        <div className="mx-auto max-w-5xl space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight">
              Simple, Transparent Pricing.
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400">
              Start monitoring for free, scale to enterprise multi-cluster endpoints.
            </p>

            {/* Segmented control */}
            <div className="inline-flex items-center p-1 rounded-full bg-zinc-900 border border-white/[0.08] mt-3">
              <button
                onClick={() => setPricingCycle("monthly")}
                className={`px-4 py-1 rounded-full text-xs font-medium transition-all ${
                  pricingCycle === "monthly" ? "bg-white text-black font-semibold shadow-sm" : "text-zinc-400 hover:text-white"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setPricingCycle("annual")}
                className={`px-4 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                  pricingCycle === "annual" ? "bg-white text-black font-semibold shadow-sm" : "text-zinc-400 hover:text-white"
                }`}
              >
                <span>Annual</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black text-white font-bold">
                  20% OFF
                </span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Starter */}
            <div className="rounded-3xl apple-card p-8 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">Starter</h3>
                  <p className="text-xs text-zinc-400">For independent creators & side projects</p>
                </div>
                <div className="text-4xl font-semibold text-white font-mono">$0</div>
                <ul className="space-y-2.5 text-xs text-zinc-300 pt-4 border-t border-white/[0.08]">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    <span>Up to <strong>15 Monitors</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    <span>60-second check frequency</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    <span>Public Status Page</span>
                  </li>
                </ul>
              </div>
              <Link href="/dashboard" className="apple-btn-secondary w-full py-2.5 text-xs text-center block font-medium">
                Get Started Free
              </Link>
            </div>

            {/* Pro */}
            <div className="rounded-3xl bg-zinc-900/90 border border-white/[0.18] p-8 space-y-6 flex flex-col justify-between shadow-2xl relative">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-white">Pro SaaS</h3>
                    <p className="text-xs text-zinc-400">For growing engineering teams</p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white text-black font-semibold">
                    Popular
                  </span>
                </div>
                <div className="text-4xl font-semibold text-white font-mono flex items-baseline gap-1">
                  <span>${pricingCycle === "annual" ? "24" : "29"}</span>
                  <span className="text-xs text-zinc-400 font-normal">/ mo</span>
                </div>
                <ul className="space-y-2.5 text-xs text-zinc-300 pt-4 border-t border-white/[0.08]">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Up to <strong>100 Monitors</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span><strong>30-second</strong> check frequency</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>AI Incident Post-Mortem Generator</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Slack & Discord Alert Pagers</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Dynamic SVG Status Badges</span>
                  </li>
                </ul>
              </div>
              <Link href="/dashboard" className="apple-btn-primary w-full py-2.5 text-xs text-center block font-semibold">
                Start 14-Day Trial
              </Link>
            </div>

            {/* Enterprise */}
            <div className="rounded-3xl apple-card p-8 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">Enterprise</h3>
                  <p className="text-xs text-zinc-400">For high-traffic infrastructure</p>
                </div>
                <div className="text-4xl font-semibold text-white font-mono flex items-baseline gap-1">
                  <span>${pricingCycle === "annual" ? "79" : "99"}</span>
                  <span className="text-xs text-zinc-400 font-normal">/ mo</span>
                </div>
                <ul className="space-y-2.5 text-xs text-zinc-300 pt-4 border-t border-white/[0.08]">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    <span>Up to <strong>500 Monitors</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    <span><strong>10-second</strong> turbo checks</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    <span>Custom domain with automatic SSL</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    <span>Unlimited team seats & RBAC</span>
                  </li>
                </ul>
              </div>
              <Link href="/dashboard" className="apple-btn-secondary w-full py-2.5 text-xs text-center block font-medium">
                Contact Enterprise
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full space-y-6 border-t border-white/[0.08]">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-semibold text-white tracking-tight">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-2 pt-4">
          {faqs.map((faq, idx) => (
            <div
              key={faq.q}
              className="rounded-2xl bg-white/[0.02] border border-white/[0.06] overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-4 text-left flex items-center justify-between text-xs font-semibold text-white hover:text-zinc-300 transition-colors"
              >
                <span>{faq.q}</span>
                {openFaq === idx ? <Minus className="w-3.5 h-3.5 text-zinc-400" /> : <Plus className="w-3.5 h-3.5 text-zinc-500" />}
              </button>
              {openFaq === idx && (
                <div className="px-4 pb-4 text-xs text-zinc-400 leading-relaxed border-t border-white/[0.04] pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Pre-Footer Callout */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-white/[0.08]">
        <div className="max-w-3xl mx-auto text-center space-y-5">
          <h2 className="text-3xl sm:text-5xl font-semibold text-white tracking-tightest">
            Experience 99.99% Reliability.
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto">
            Join engineering teams worldwide maintaining uninterrupted availability with PulseGuard AI.
          </p>
          <div className="pt-2">
            <Link
              href="/dashboard"
              className="apple-btn-primary px-7 py-3 text-xs font-semibold inline-flex items-center gap-2"
            >
              <span>Launch Console Free</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
