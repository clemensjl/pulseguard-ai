"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Activity, Menu, X, ArrowRight, ShieldCheck } from "lucide-react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-black/70 backdrop-blur-2xl transition-all">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 h-14">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-white/[0.08] border border-white/[0.12] text-white shadow-sm group-hover:border-white/25 transition-colors">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <span className="font-semibold text-sm tracking-tight text-white flex items-center gap-1.5">
            PulseGuard <span className="text-[10px] text-zinc-400 font-normal">SaaS</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-7 text-[13px] text-zinc-400 font-medium">
          <Link href="#features" className="hover:text-white transition-colors">
            Overview
          </Link>
          <Link href="#live-tester" className="hover:text-white transition-colors">
            Live Diagnostics
          </Link>
          <Link href="#roi-calculator" className="hover:text-white transition-colors">
            ROI Engine
          </Link>
          <Link href="#pricing" className="hover:text-white transition-colors">
            Pricing
          </Link>
          <Link href="/status/demo" className="hover:text-white transition-colors flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
            <span>Status Page</span>
          </Link>
        </nav>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-2.5">
          <Link
            href="/dashboard"
            className="text-xs font-medium px-3.5 py-1.5 rounded-full text-zinc-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-all"
          >
            Sign In
          </Link>
          <Link
            href="/dashboard"
            className="apple-btn-primary text-xs font-semibold px-4 py-1.5 flex items-center gap-1.5 group"
          >
            <span>Launch Console</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-1.5 rounded-lg text-zinc-400 hover:text-white"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/[0.08] bg-black/95 backdrop-blur-3xl px-6 py-5 space-y-3">
          <Link
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1.5 text-sm text-zinc-300 hover:text-white"
          >
            Overview
          </Link>
          <Link
            href="#live-tester"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1.5 text-sm text-zinc-300 hover:text-white"
          >
            Live Diagnostics
          </Link>
          <Link
            href="#roi-calculator"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1.5 text-sm text-zinc-300 hover:text-white"
          >
            ROI Engine
          </Link>
          <Link
            href="#pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1.5 text-sm text-zinc-300 hover:text-white"
          >
            Pricing
          </Link>
          <Link
            href="/status/demo"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1.5 text-sm text-zinc-300 hover:text-white"
          >
            Status Page
          </Link>
          <div className="pt-3 border-t border-white/[0.08]">
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="apple-btn-primary w-full py-2 text-xs text-center block"
            >
              Launch Console
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
