"use client";

import React from "react";
import { LatencyDataPoint } from "@/lib/types";

interface SparklineProps {
  data: LatencyDataPoint[];
  color?: string;
  height?: number;
}

export default function SparklineChart({
  data,
  color = "#6366f1",
  height = 40,
}: SparklineProps) {
  if (!data || data.length < 2) {
    return <div className="h-10 text-xs text-slate-400 flex items-center">No telemetry</div>;
  }

  const values = data.map((d) => d.latencyMs);
  const min = Math.min(...values) * 0.8;
  const max = Math.max(...values) * 1.2 || 1;
  const range = max - min || 1;

  const width = 180;
  const points = data.map((d, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((d.latencyMs - min) / range) * (height - 8) - 4;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const pathD = `M ${points.join(" L ")}`;
  const areaD = `${pathD} L ${width},${height} L 0,${height} Z`;

  return (
    <div className="relative w-full max-w-[180px]">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full overflow-visible"
      >
        <defs>
          <linearGradient id={`grad-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <path d={areaD} fill={`url(#grad-${color.replace("#", "")})`} />
        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
