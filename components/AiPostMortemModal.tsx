"use client";

import React, { useState } from "react";
import { X, Sparkles, Loader2, Copy, Check, FileText } from "lucide-react";
import { Incident } from "@/lib/types";

interface AiPostMortemModalProps {
  isOpen: boolean;
  onClose: () => void;
  incident: Incident | null;
  onSavePostMortem: (incidentId: string, text: string) => void;
}

export default function AiPostMortemModal({
  isOpen,
  onClose,
  incident,
  onSavePostMortem,
}: AiPostMortemModalProps) {
  const [loading, setLoading] = useState(false);
  const [postMortemText, setPostMortemText] = useState(incident?.aiPostMortem || "");
  const [copied, setCopied] = useState(false);

  if (!isOpen || !incident) return null;

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai-postmortem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: incident.title,
          monitorName: incident.monitorName,
          severity: incident.severity,
          impact: incident.impact,
          updates: incident.updates,
        }),
      });
      const data = await res.json();
      if (data.postMortem) {
        setPostMortemText(data.postMortem);
        onSavePostMortem(incident.id, data.postMortem);
      }
    } catch {
      alert("Failed to generate AI post-mortem");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(postMortemText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 relative max-h-[90vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white shadow-md shadow-indigo-500/25">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              Autonomous AI Post-Mortem Generator
            </h3>
            <p className="text-xs text-slate-400">
              Synthesize telemetry anomalies, timeline logs, and generate executive RCAs.
            </p>
          </div>
        </div>

        {/* Incident Summary Pill */}
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 mb-4 flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-400">Incident:</span>{" "}
            <strong className="text-white">{incident.title}</strong>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono text-[11px]">
            {incident.severity.toUpperCase()}
          </span>
        </div>

        {/* Post-mortem Text Container */}
        <div className="flex-1 overflow-y-auto rounded-xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed min-h-[260px]">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center space-y-3 py-16 text-indigo-400">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="text-slate-400 text-xs font-sans">
                Correlating telemetry logs & generating root-cause analysis...
              </span>
            </div>
          ) : postMortemText ? (
            postMortemText
          ) : (
            <div className="h-full flex flex-col items-center justify-center space-y-3 py-12 text-slate-400 font-sans text-center">
              <FileText className="w-8 h-8 text-slate-400" />
              <p className="text-xs">No post-mortem generated yet for this incident.</p>
              <button
                onClick={handleGenerate}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-500/20"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generate Autonomous Post-Mortem</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>{postMortemText ? "Regenerate RCA" : "Generate"}</span>
          </button>

          <div className="flex items-center gap-3">
            {postMortemText && (
              <button
                onClick={handleCopy}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied Markdown" : "Copy Markdown"}</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
