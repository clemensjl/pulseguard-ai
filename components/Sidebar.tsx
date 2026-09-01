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
  ExternalLink,
  ChevronDown,
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
      name: "Monitors",
      href: "/dashboard/monitors",
      icon: Radio,
      badge: `${operationalMonitorsCount}/${monitors.length}`,
    },
    {
      name: "Incidents",
      href: "/dashboard/incidents",
      icon: AlertOctagon,
      badge: activeIncidentsCount > 0 ? `${activeIncidentsCount}` : null,
      badgeColor: activeIncidentsCount > 0 ? "bg-rose-500/20 text-rose-300" : undefined,
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
      badge: null,
    },
    {
      name: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
      badge: null,
    },
  ];

  return (
    <aside className="w-60 border-r border-white/[0.08] bg-[#070709] flex flex-col justify-between shrink-0 h-screen sticky top-0">
      <div className="p-4 space-y-4">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 px-2 py-1">
          <div className="w-6 h-6 rounded-md bg-white/[0.08] border border-white/[0.12] text-white flex items-center justify-center">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <span className="font-semibold text-xs tracking-tight text-white">
            PulseGuard
          </span>
        </Link>

        {/* Workspace Switcher */}
        <div className="px-1">
          <div className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between cursor-pointer hover:bg-white/[0.06] transition-colors">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-4 h-4 rounded bg-white/[0.1] text-white flex items-center justify-center text-[9px] font-bold">
                A
              </div>
              <div className="truncate">
                <span className="text-[11px] font-semibold text-white block truncate">{organization.name}</span>
              </div>
            </div>
            <ChevronDown className="w-3 h-3 text-zinc-500" />
          </div>
        </div>

        {/* Nav list */}
        <nav className="space-y-0.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? "bg-white/[0.08] text-white font-semibold"
                    : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-zinc-400"}`} />
                  <span>{item.name}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-md font-mono ${
                      item.badgeColor || "bg-white/[0.06] text-zinc-400"
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

      {/* Bottom capacity pill */}
      <div className="p-4 space-y-2 border-t border-white/[0.06]">
        <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
          <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400">
            <span className="uppercase">{organization.plan} Tier</span>
            <span>{monitors.length}/{organization.monitorsLimit}</span>
          </div>

          <div className="w-full h-1 bg-white/[0.08] rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all"
              style={{ width: `${Math.min(100, (monitors.length / organization.monitorsLimit) * 100)}%` }}
            />
          </div>

          <button
            onClick={onOpenUpgrade}
            className="w-full py-1 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-zinc-200 text-[11px] font-medium transition-colors"
          >
            Upgrade Capacity
          </button>
        </div>

        <Link
          href="/status/demo"
          target="_blank"
          className="flex items-center justify-between px-2 py-1 text-zinc-500 hover:text-zinc-300 text-[11px] transition-colors"
        >
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>Live Status Page</span>
          </div>
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>
    </aside>
  );
}
