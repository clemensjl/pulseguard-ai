import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMs(ms: number): string {
  if (ms < 1000) return `${Math.round(ms)}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

export function formatUptime(uptime: number): string {
  return `${uptime.toFixed(2)}%`;
}

export function getStatusColor(status: string): {
  bg: string;
  text: string;
  border: string;
  dot: string;
  glow: string;
} {
  switch (status) {
    case "operational":
    case "resolved":
      return {
        bg: "bg-emerald-500/10 dark:bg-emerald-500/15",
        text: "text-emerald-700 dark:text-emerald-400",
        border: "border-emerald-500/20 dark:border-emerald-500/30",
        dot: "bg-emerald-500",
        glow: "shadow-[0_0_12px_rgba(16,185,129,0.35)]",
      };
    case "degraded":
    case "monitoring":
      return {
        bg: "bg-amber-500/10 dark:bg-amber-500/15",
        text: "text-amber-700 dark:text-amber-400",
        border: "border-amber-500/20 dark:border-amber-500/30",
        dot: "bg-amber-500",
        glow: "shadow-[0_0_12px_rgba(245,158,11,0.35)]",
      };
    case "down":
    case "investigating":
    case "critical":
    case "major":
      return {
        bg: "bg-rose-500/10 dark:bg-rose-500/15",
        text: "text-rose-700 dark:text-rose-400",
        border: "border-rose-500/20 dark:border-rose-500/30",
        dot: "bg-rose-500",
        glow: "shadow-[0_0_12px_rgba(244,63,94,0.35)]",
      };
    case "paused":
    default:
      return {
        bg: "bg-slate-500/10 dark:bg-slate-500/15",
        text: "text-slate-700 dark:text-slate-400",
        border: "border-slate-500/20 dark:border-slate-500/30",
        dot: "bg-slate-500",
        glow: "shadow-none",
      };
  }
}

export function timeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 5) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
