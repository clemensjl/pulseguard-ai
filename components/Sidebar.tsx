"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  LayoutDashboard,
  Radio,
  AlertOctagon,
  Globe2,
  Plug,
  Code2,
  Settings,
  Sparkles,
  ExternalLink,
  ChevronDown,
  ShieldCheck,
} from "lucide-react";
import { useStore } from "@/lib/store";

interface SidebarProps {
  onOpenUpgrade?: () => void;
}

export default function Sidebar({ onOpenUpgrade }: SidebarProps) {
  const pathname = usePathname();
  const { monitors, incidents, organization } = useStore();

  const activeIncidentsCount = incidents.filter((i) => i.status !== "resolved").length;
  const operationalMonitorsCount = monitors.filter((m) => m.status === "operational").length;

  const navItems = [
    {
      name: "Overview",
      href: "/dashboard",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      name: "Monitors Hub",
      href: "/dashboard/monitors",
      icon: Radio,
      badge: `${operationalMonitorsCount}/${monitors.length}`,
    },
    {
      name: "Incident Center",
      href: "/dashboard/incidents",
      icon: AlertOctagon,
      badge: activeIncidentsCount > 0 ? `${activeIncidentsCount} active` : null,
      badgeColor: activeIncidentsCount > 0 ? "bg-rose-500/20 text-rose-300 border border-rose-500/30" : undefined,
    },
    {
      name: "Status Pages",
      href: "/dashboard/status-pages",
      icon: Globe2,
      badge: null,
    },
    {
      name: "Alert Channels",
      href: "/dashboard/integrations",
      icon: Plug,
      badge: null,
    },
    {
      name: "Developer API",
      href: "/dashboard/developers",
      icon: Code2,
      badge: "REST",
    },
    {
      name: "Settings & Team",
      href: "/dashboard/settings",
      icon: Settings,
      badge: null,
    },
  ];

  return (
    <aside className="w-64 border-r border-slate-800 bg-[#080d1a] flex flex-col justify-between shrink-0 h-screen sticky top-0">
      <div className="p-4 space-y-5">
        {/* Brand Header */}
        <Link href="/" className="flex items-center gap-2.5 px-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white flex items-center justify-center shadow-md shadow-indigo-500/25">
            <Activity className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-tight text-white flex items-center gap-1">
              PulseGuard <span className="text-[10px] px-1 rounded bg-indigo-500/20 text-indigo-400 font-mono">AI</span>
            </span>
          </div>
        </Link>

        {/* Workspace Switcher */}
        <div className="px-1">
          <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between cursor-pointer hover:border-slate-700 transition-colors">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-5 h-5 rounded bg-indigo-600/40 text-indigo-300 flex items-center justify-center text-[10px] font-bold">
                A
              </div>
              <div className="truncate">
                <span className="text-xs font-semibold text-white block truncate">{organization.name}</span>
                <span className="text-[10px] text-slate-400 font-mono uppercase">{organization.plan} Plan</span>
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </div>
        </div>

        {/* Navigation List */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? "bg-indigo-600/15 text-indigo-300 font-semibold border border-indigo-500/20 shadow-sm"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? "text-indigo-400" : "text-slate-400"}`} />
                  <span>{item.name}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-medium ${
                      item.badgeColor || "bg-slate-800 text-slate-400 border border-slate-700/50"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Upgrade & Resource Card */}
      <div className="p-4 space-y-3 border-t border-slate-800/80 bg-slate-950/40">
        <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-950/60 to-slate-900 border border-indigo-500/20 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-white flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-indigo-400" />
              <span>{organization.plan.toUpperCase()} Capacity</span>
            </span>
            <span className="text-[10px] font-mono text-indigo-300">
              {monitors.length}/{organization.monitorsLimit}
            </span>
          </div>

          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all"
              style={{ width: `${Math.min(100, (monitors.length / organization.monitorsLimit) * 100)}%` }}
            />
          </div>

          <button
            onClick={onOpenUpgrade}
            className="w-full py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-[11px] transition-colors shadow-sm"
          >
            Upgrade Plan
          </button>
        </div>

        {/* Public Status Page Quick Link */}
        <Link
          href="/status/demo"
          target="_blank"
          className="flex items-center justify-between px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 text-xs transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>View Public Status</span>
          </div>
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>
    </aside>
  );
}
