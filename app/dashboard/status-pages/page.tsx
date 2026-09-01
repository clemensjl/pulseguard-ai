"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Globe2,
  ExternalLink,
  Save,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Layers,
  Sparkles,
  Copy,
  Check,
} from "lucide-react";
import Header from "@/components/Header";
import { useStore } from "@/lib/store";

export default function StatusPagesDesignerPage() {
  const { statusPage, updateStatusPage } = useStore();
  const [title, setTitle] = useState(statusPage.title);
  const [companyName, setCompanyName] = useState(statusPage.companyName);
  const [description, setDescription] = useState(statusPage.description);
  const [announcementMsg, setAnnouncementMsg] = useState(statusPage.announcement?.message || "");
  const [announcementActive, setAnnouncementActive] = useState(statusPage.announcement?.active || false);
  const [saved, setSaved] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateStatusPage({
      title,
      companyName,
      description,
      announcement: {
        type: "warning",
        message: announcementMsg,
        active: announcementActive,
      },
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const copyPublicUrl = () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://pulseguard-ai.vercel.app";
    navigator.clipboard.writeText(`${origin}/status/${statusPage.slug}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#090d16]">
      <Header
        title="Public Status Page Designer"
        subtitle="Configure white-label customer status portals and incident announcements"
      />

      <main className="p-6 md:p-8 space-y-8 max-w-5xl w-full mx-auto">
        {/* Top Link Banner */}
        <div className="p-5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400">
              <Globe2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Your Public Status Page is Live</h4>
              <p className="text-xs text-indigo-300/80 font-mono">
                /status/{statusPage.slug} (Hosted globally on edge CDN)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={copyPublicUrl}
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? "Copied" : "Copy URL"}</span>
            </button>

            <Link
              href={`/status/${statusPage.slug}`}
              target="_blank"
              className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-500/20 transition-all"
            >
              <span>View Public Page</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Configuration Form */}
        <form onSubmit={handleSave} className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-5">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Branding & Page Meta
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Company / Organization Name
                </label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Status Page Header Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Public Header Subtitle Description
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Announcement Banner */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                Maintenance & Incident Announcement Banner
              </h4>
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 font-semibold">
                <input
                  type="checkbox"
                  checked={announcementActive}
                  onChange={(e) => setAnnouncementActive(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 bg-slate-950 border-slate-700 focus:ring-indigo-500"
                />
                <span>Display Announcement</span>
              </label>
            </div>

            <textarea
              rows={2}
              value={announcementMsg}
              onChange={(e) => setAnnouncementMsg(e.target.value)}
              placeholder="e.g. Scheduled database maintenance will take place Sunday at 02:00 UTC."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Components Grid Preview */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                Exposed Components ({statusPage.components.length})
              </h4>
              <span className="text-xs text-slate-400">Synced automatically from Monitors Hub</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {statusPage.components.map((comp) => (
                <div
                  key={comp.id}
                  className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between"
                >
                  <div>
                    <span className="text-xs font-bold text-white block">{comp.name}</span>
                    <span className="text-[11px] text-slate-400 font-mono">{comp.group}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {comp.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Save action button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className={`px-6 py-2.5 rounded-xl text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md ${
                saved ? "bg-emerald-600 shadow-emerald-500/20" : "bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/20"
              }`}
            >
              {saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              <span>{saved ? "Changes Published Live!" : "Save & Publish Status Page"}</span>
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
