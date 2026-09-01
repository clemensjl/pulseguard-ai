"use client";

import React, { useState } from "react";
import { X, Shield, Copy, Check, ExternalLink } from "lucide-react";
import { Monitor } from "@/lib/types";

interface BadgeEmbedModalProps {
  isOpen: boolean;
  onClose: () => void;
  monitor: Monitor | null;
}

export default function BadgeEmbedModal({
  isOpen,
  onClose,
  monitor,
}: BadgeEmbedModalProps) {
  const [copiedType, setCopiedType] = useState<string | null>(null);

  if (!isOpen || !monitor) return null;

  const origin = typeof window !== "undefined" ? window.location.origin : "https://pulseguard-ai.vercel.app";
  const badgeUrl = `${origin}/api/badge/${monitor.id}?type=uptime`;
  const statusBadgeUrl = `${origin}/api/badge/${monitor.id}?type=status`;

  const markdownCode = `[![Uptime](${badgeUrl})](https://pulseguard-ai.vercel.app/status/demo)`;
  const htmlCode = `<a href="https://pulseguard-ai.vercel.app/status/demo"><img src="${badgeUrl}" alt="PulseGuard Uptime" /></a>`;

  const copySnippet = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Embed Live Status Badge</h3>
            <p className="text-xs text-slate-400">
              Display real-time uptime status directly on GitHub READMEs, docs, or landing pages.
            </p>
          </div>
        </div>

        {/* Live Badge Preview */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center gap-3 mb-5">
          <span className="text-xs text-slate-400">Live Render Preview:</span>
          <div className="flex items-center gap-4">
            <img src={`/api/badge/${monitor.id}?type=uptime`} alt="Uptime Badge Preview" className="h-5" />
            <img src={`/api/badge/${monitor.id}?type=status`} alt="Status Badge Preview" className="h-5" />
          </div>
        </div>

        {/* Snippets */}
        <div className="space-y-4">
          {/* Markdown */}
          <div>
            <div className="flex justify-between items-center mb-1 text-xs">
              <span className="font-semibold text-slate-300">Markdown (GitHub / README)</span>
              <button
                onClick={() => copySnippet(markdownCode, "md")}
                className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
              >
                {copiedType === "md" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedType === "md" ? "Copied" : "Copy"}</span>
              </button>
            </div>
            <textarea
              readOnly
              rows={2}
              value={markdownCode}
              className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 select-all"
            />
          </div>

          {/* HTML */}
          <div>
            <div className="flex justify-between items-center mb-1 text-xs">
              <span className="font-semibold text-slate-300">HTML Embed</span>
              <button
                onClick={() => copySnippet(htmlCode, "html")}
                className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
              >
                {copiedType === "html" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedType === "html" ? "Copied" : "Copy"}</span>
              </button>
            </div>
            <textarea
              readOnly
              rows={2}
              value={htmlCode}
              className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 select-all"
            />
          </div>
        </div>

        <div className="pt-5 mt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
