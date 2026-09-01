import React from "react";
import Link from "next/link";
import { Activity, ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-[#060911] text-slate-400 py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-5 gap-10">
        {/* Brand Column */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-600 text-white">
              <Activity className="w-4 h-4" />
            </div>
            <span className="font-bold text-lg text-white">PulseGuard AI</span>
          </div>
          <p className="text-sm text-slate-400 max-w-sm">
            Autonomous API and website observability platform with AI incident post-mortems, multi-protocol checks, and instant public status pages.
          </p>
          <div className="flex items-center gap-4 text-slate-400 pt-2">
            <a
              href="https://github.com/clemensjl/pulseguard-ai"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </a>
            <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              All Systems Operational (99.99%)
            </span>
          </div>
        </div>

        {/* Column 1 */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Product</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/dashboard/monitors" className="hover:text-white transition-colors">
                Uptime Monitors
              </Link>
            </li>
            <li>
              <Link href="/dashboard/incidents" className="hover:text-white transition-colors">
                AI Post-Mortems
              </Link>
            </li>
            <li>
              <Link href="/status/demo" className="hover:text-white transition-colors">
                Hosted Status Pages
              </Link>
            </li>
            <li>
              <Link href="/dashboard/integrations" className="hover:text-white transition-colors">
                Slack & Discord Alerts
              </Link>
            </li>
            <li>
              <Link href="/dashboard/developers" className="hover:text-white transition-colors">
                REST API & SDKs
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 2 */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Resources</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="#live-tester" className="hover:text-white transition-colors">
                Free Live Probe
              </Link>
            </li>
            <li>
              <Link href="#roi-calculator" className="hover:text-white transition-colors">
                Downtime ROI Calculator
              </Link>
            </li>
            <li>
              <Link href="/dashboard/developers" className="hover:text-white transition-colors">
                API Documentation
              </Link>
            </li>
            <li>
              <Link href="/status/demo" className="hover:text-white transition-colors">
                Public Demo
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3 */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Enterprise & Trust</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-1.5 text-slate-300">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span>SOC2 Type II Ready</span>
            </li>
            <li className="flex items-center gap-1.5 text-slate-300">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span>GDPR & HIPAA Compliant</span>
            </li>
            <li className="flex items-center gap-1.5 text-slate-300">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span>99.99% Uptime SLA</span>
            </li>
            <li className="pt-2">
              <Link
                href="/dashboard"
                className="text-xs px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors inline-block"
              >
                Access Dashboard
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto max-w-7xl border-t border-slate-800/60 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-400 gap-4">
        <p>© 2026 PulseGuard AI, Inc. All rights reserved. Zero-Spend Architecture on Vercel Edge.</p>
        <div className="flex items-center gap-6">
          <Link href="/privacy" className="hover:text-slate-300">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-slate-300">Terms of Service</Link>
          <Link href="/security" className="hover:text-slate-300">Security Whitepaper</Link>
        </div>
      </div>
    </footer>
  );
}
