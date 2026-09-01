"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Globe,
  Radio,
  Sparkles,
  Server,
  AlertTriangle,
  Clock,
  Cpu,
  Lock,
  ChevronRight,
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
      q: "How does PulseGuard AI run with $0 ongoing infrastructure costs?",
      a: "PulseGuard AI leverages serverless Edge API handlers and client-side synthetic polling routines deployed on Vercel's global CDN tier. You get multi-region health checks without paying hundreds of dollars for dedicated proxy fleets.",
    },
    {
      q: "How does the AI Post-Mortem generator work?",
      a: "When an outage or latency spike occurs, PulseGuard correlates synthetic probe error codes, TTFB variance, and your incident timeline updates to automatically formulate a structured Root-Cause Analysis (RCA) with mitigation checklists in seconds.",
    },
    {
      q: "Can I host a public status page on my own custom domain?",
      a: "Yes! PulseGuard gives you an instant status page hosted at /status/[your-brand] with support for custom CNAME domains (e.g. status.yourcompany.com) with automatic SSL provisioning.",
    },
    {
      q: "What notification channels are supported?",
      a: "We natively support Slack Incoming Webhooks, Discord Webhooks, Microsoft Teams, PagerDuty, and custom JSON webhook endpoints with customizable event triggers.",
    },
    {
      q: "How fast can PulseGuard detect an outage?",
      a: "PulseGuard supports check intervals as fast as every 10 seconds with multi-region consensus verification to eliminate false positive alerts.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col selection:bg-indigo-500/30 selection:text-indigo-200">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-28 md:pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-grid-pattern">
        {/* Glowing Background Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[350px] h-[350px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative mx-auto max-w-5xl text-center space-y-6">
          {/* Status Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 shadow-inner backdrop-blur-md">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-medium text-slate-300">
              Autonomous Synthetic Probes • 99.99% Global Uptime
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 font-mono font-semibold">
              $0 Spend Stack
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1]">
            Autonomous Observability & Uptime for{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-emerald-400 bg-clip-text text-transparent">
              Modern SaaS
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto max-w-2xl text-base sm:text-lg text-slate-400 leading-relaxed">
            Instant multi-protocol API monitoring, SSL expiry guard, autonomous AI incident post-mortems, and white-labeled public status pages. Never let an outage catch your customers by surprise.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-bold text-sm shadow-xl shadow-indigo-500/25 flex items-center justify-center gap-2 group transition-all"
            >
              <span>Launch Live Dashboard (Demo)</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/status/demo"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 font-semibold text-sm border border-slate-700 shadow-md flex items-center justify-center gap-2 transition-all"
            >
              <Globe className="w-4 h-4 text-emerald-400" />
              <span>View Public Status Page</span>
            </Link>
          </div>

          {/* Trust badges */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> No credit card required
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 10-second check intervals
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Instant Slack & Discord alerts
            </span>
          </div>
        </div>
      </section>

      {/* Live Interactive Probe Section */}
      <section id="live-tester" className="py-12 px-4 sm:px-6 lg:px-8 relative">
        <div className="mx-auto max-w-7xl">
          <InteractiveLiveChecker />
        </div>
      </section>

      {/* Feature Pillar Showcase */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-800/80 bg-slate-950/40">
        <div className="mx-auto max-w-7xl space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold uppercase tracking-wider border border-indigo-500/20">
              <Zap className="w-3.5 h-3.5" />
              Enterprise Feature Matrix
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Everything Needed to Protect 99.99% Reliability
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Engineered from the ground up for high-scale microservices, SaaS APIs, and critical web endpoints.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-4 hover:border-slate-700 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                <Radio className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Multi-Protocol Synthetic Probes</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Monitor HTTP/HTTPS endpoints, REST payloads, keyword matching, ICMP pings, and SSL certificate expiration before downtime strikes.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-4 hover:border-slate-700 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Autonomous AI Post-Mortems</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                One-click AI synthesis turns telemetry spikes into complete Root Cause Analysis documents, timelines, and mitigation action items.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-4 hover:border-slate-700 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Hosted Public Status Pages</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                White-label status pages with 90-day uptime bars, component grouping, live embeddable SVG badges, and subscriber announcements.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-4 hover:border-slate-700 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Instant Alert Dispatch</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Broadcast instant incident alerts to Slack, Discord, Microsoft Teams, and custom webhooks with sub-second latency.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ROI Calculator Section */}
      <section id="roi-calculator" className="py-20 px-4 sm:px-6 lg:px-8">
        <RoiCalculator />
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-800/80 bg-slate-950/50">
        <div className="mx-auto max-w-6xl space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold uppercase tracking-wider border border-indigo-500/20">
              Transparent Pricing
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Simple, Predictable Plans
            </h2>
            <p className="text-slate-400 text-sm">
              Start monitoring for free, scale to hundreds of endpoints with enterprise-grade SLA.
            </p>

            {/* Toggle */}
            <div className="inline-flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 mt-4">
              <button
                onClick={() => setPricingCycle("monthly")}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  pricingCycle === "monthly" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setPricingCycle("annual")}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  pricingCycle === "annual" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                <span>Annual Billing</span>
                <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                  20% OFF
                </span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free Tier */}
            <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-8 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">Starter (Free)</h3>
                <p className="text-xs text-slate-400">For side projects & independent creators</p>
                <div className="text-4xl font-extrabold text-white font-mono">$0</div>
                <ul className="space-y-3 text-xs text-slate-300 pt-4 border-t border-slate-800">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Up to <strong>15 Monitors</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>60-second check frequency</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Public Status Page</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Email & Discord alerts</span>
                  </li>
                </ul>
              </div>
              <Link
                href="/dashboard"
                className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs text-center block transition-colors"
              >
                Get Started Free
              </Link>
            </div>

            {/* Pro Tier (Featured) */}
            <div className="rounded-2xl bg-gradient-to-b from-indigo-950/80 to-slate-900 border-2 border-indigo-500 p-8 space-y-6 flex flex-col justify-between shadow-2xl relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-indigo-500 text-white text-[11px] font-bold uppercase tracking-wider shadow-md">
                Most Popular
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">Pro SaaS</h3>
                <p className="text-xs text-indigo-200">For revenue-generating startups & engineering teams</p>
                <div className="text-4xl font-extrabold text-white font-mono flex items-baseline gap-1">
                  <span>${pricingCycle === "annual" ? "24" : "29"}</span>
                  <span className="text-xs text-slate-400 font-normal">/ mo</span>
                </div>
                <ul className="space-y-3 text-xs text-slate-200 pt-4 border-t border-indigo-500/30">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Up to <strong>100 Monitors</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span><strong>30-second</strong> check frequency</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Autonomous AI Post-Mortem Generator</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Slack, Discord & Webhook Pagers</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Dynamic SVG Status Badge Embeds</span>
                  </li>
                </ul>
              </div>
              <Link
                href="/dashboard"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 text-center block transition-all"
              >
                Start 14-Day Free Pro Trial
              </Link>
            </div>

            {/* Enterprise Tier */}
            <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-8 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">Enterprise Scale</h3>
                <p className="text-xs text-slate-400">For multi-cluster high traffic organizations</p>
                <div className="text-4xl font-extrabold text-white font-mono flex items-baseline gap-1">
                  <span>${pricingCycle === "annual" ? "79" : "99"}</span>
                  <span className="text-xs text-slate-400 font-normal">/ mo</span>
                </div>
                <ul className="space-y-3 text-xs text-slate-300 pt-4 border-t border-slate-800">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Up to <strong>500 Monitors</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span><strong>10-second</strong> turbo check frequency</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Custom domain with automatic SSL</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Unlimited team seats & RBAC</span>
                  </li>
                </ul>
              </div>
              <Link
                href="/dashboard"
                className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs text-center block transition-colors"
              >
                Contact Enterprise
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Frequently Asked Questions</h2>
          <p className="text-sm text-slate-400">Everything you need to know about PulseGuard AI.</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={faq.q}
              className="rounded-xl bg-slate-900/80 border border-slate-800 overflow-hidden transition-colors"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between text-sm font-bold text-white hover:text-indigo-300 transition-colors"
              >
                <span>{faq.q}</span>
                {openFaq === idx ? <Minus className="w-4 h-4 text-indigo-400 shrink-0" /> : <Plus className="w-4 h-4 text-slate-400 shrink-0" />}
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-5 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Pre-Footer CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-800/80 bg-gradient-to-b from-transparent to-indigo-950/20">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Ready to Protect Your Uptime & User Trust?
          </h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Join engineering teams worldwide using PulseGuard AI to detect incidents in seconds and maintain 99.99% reliability.
          </p>
          <div className="pt-2">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-bold text-sm shadow-xl shadow-indigo-500/25 transition-all"
            >
              <span>Launch Dashboard Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
