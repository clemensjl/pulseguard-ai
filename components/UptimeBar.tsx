"use client";

import React, { useState } from "react";

interface DailyUptimePoint {
  date: string;
  uptime: number;
}

interface UptimeBarProps {
  days?: DailyUptimePoint[];
  overallUptime?: number;
  showLabels?: boolean;
}

export default function UptimeBar({
  days = [],
  overallUptime = 99.99,
  showLabels = true,
}: UptimeBarProps) {
  const [hoveredDay, setHoveredDay] = useState<DailyUptimePoint | null>(null);

  // Fallback if empty
  const data = days.length > 0 ? days.slice(-90) : Array.from({ length: 90 }, (_, i) => ({
    date: new Date(Date.now() - (89 - i) * 86400000).toISOString().split("T")[0],
    uptime: 100,
  }));

  return (
    <div className="w-full space-y-1.5">
      {/* 90-day pills */}
      <div className="flex items-center gap-[2px] h-7 w-full py-1">
        {data.map((day, idx) => {
          let color = "bg-emerald-500 hover:bg-emerald-400";
          if (day.uptime < 95) {
            color = "bg-rose-500 hover:bg-rose-400";
          } else if (day.uptime < 99.9) {
            color = "bg-amber-400 hover:bg-amber-300";
          }

          return (
            <div
              key={day.date + idx}
              onMouseEnter={() => setHoveredDay(day)}
              onMouseLeave={() => setHoveredDay(null)}
              className={`flex-1 h-full rounded-sm transition-all cursor-pointer ${color}`}
            />
          );
        })}
      </div>

      {/* Info Bar */}
      {showLabels && (
        <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span>90 days ago</span>
          <span className="text-slate-300 font-medium">
            {hoveredDay ? (
              <span className="text-indigo-300">
                {hoveredDay.date}: <strong className="text-white">{hoveredDay.uptime.toFixed(2)}%</strong> uptime
              </span>
            ) : (
              <span>Overall: <strong className="text-emerald-400">{overallUptime.toFixed(2)}%</strong></span>
            )}
          </span>
          <span>Today</span>
        </div>
      )}
    </div>
  );
}
