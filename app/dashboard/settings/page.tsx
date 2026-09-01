"use client";

import React, { useState } from "react";
import {
  Settings,
  Users,
  CreditCard,
  Mail,
  Plus,
  ShieldCheck,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  Trash2,
} from "lucide-react";
import Header from "@/components/Header";
import UpgradeModal from "@/components/UpgradeModal";
import { useStore } from "@/lib/store";

export default function SettingsPage() {
  const { organization, inviteMember, resetToDefaults } = useStore();
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"admin" | "engineer" | "viewer">("engineer");
  const [invitedSuccess, setInvitedSuccess] = useState(false);

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;

    inviteMember(inviteEmail, inviteRole);
    setInvitedSuccess(true);
    setInviteEmail("");
    setTimeout(() => {
      setInvitedSuccess(false);
      setIsInviteOpen(false);
    }, 1500);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#090d16]">
      <Header
        title="Organization & Team Settings"
        subtitle="Manage workspaces, invite teammates with RBAC roles, and manage subscription tiers"
        onOpenUpgrade={() => setIsUpgradeOpen(true)}
      />

      <main className="p-6 md:p-8 space-y-8 max-w-5xl w-full mx-auto">
        {/* Organization Card */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white">Active Organization</h3>
              <p className="text-xs text-slate-400">Primary tenant identifier for alerts and status pages.</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono text-xs font-bold uppercase self-start sm:self-center">
              {organization.plan} Tier
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[11px] text-slate-400 block">Organization Name</span>
              <span className="text-sm font-bold text-white">{organization.name}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[11px] text-slate-400 block">Monitors Quota</span>
              <span className="text-sm font-bold text-indigo-400 font-mono">
                {organization.monitorsLimit} Endpoints
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[11px] text-slate-400 block">Check Interval Floor</span>
              <span className="text-sm font-bold text-emerald-400 font-mono">
                Every {organization.checkFrequencySeconds}s
              </span>
            </div>
          </div>
        </div>

        {/* Team Members & RBAC */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-400" />
                <span>Team Members ({organization.members.length})</span>
              </h3>
              <p className="text-xs text-slate-400">
                Grant role-based access to engineers, administrators, and on-call responders.
              </p>
            </div>

            <button
              onClick={() => setIsInviteOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-500/20"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Invite Teammate</span>
            </button>
          </div>

          <div className="divide-y divide-slate-800/60">
            {organization.members.map((m) => (
              <div
                key={m.id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={m.avatar}
                    alt={m.name}
                    className="w-8 h-8 rounded-full bg-slate-800 object-cover ring-2 ring-slate-700"
                  />
                  <div>
                    <span className="text-xs font-bold text-white block">{m.name}</span>
                    <span className="text-[11px] text-slate-400 font-mono">{m.email}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold uppercase ${
                    m.role === "owner" ? "bg-purple-500/20 text-purple-300 border border-purple-500/30" : "bg-slate-800 text-slate-300 border border-slate-700"
                  }`}>
                    {m.role}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Joined {new Date(m.joinedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subscription & Billing Quick Upgrade */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950/40 to-slate-900 border border-indigo-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Scale Your Capacity</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Upgrade for 10-second checks, 500 monitors, custom domains, and automated AI RCAs.
            </p>
          </div>

          <button
            onClick={() => setIsUpgradeOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-500/20 shrink-0"
          >
            Manage Subscription
          </button>
        </div>

        {/* Reset / Demo Maintenance */}
        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/60 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-300 block">Reset Demo State</span>
            <span className="text-[11px] text-slate-400">
              Clear browser local storage mutations and restore initial demo seed dataset.
            </span>
          </div>

          <button
            onClick={() => {
              if (confirm("Reset all monitors and incidents to initial state?")) {
                resetToDefaults();
              }
            }}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo</span>
          </button>
        </div>

        {/* Invite Modal */}
        {isInviteOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 relative">
              <h4 className="text-base font-bold text-white mb-4">Invite Team Member</h4>

              {invitedSuccess ? (
                <div className="py-6 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                  <span className="text-xs font-bold text-white block">Invitation Sent!</span>
                </div>
              ) : (
                <form onSubmit={handleInvite} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="engineer@acme.dev"
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Role & Permissions
                    </label>
                    <select
                      value={inviteRole}
                      onChange={(e) => setInviteRole(e.target.value as "admin" | "engineer" | "viewer")}
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                    >
                      <option value="admin">Admin (Manage monitors, billing & members)</option>
                      <option value="engineer">Engineer (Manage monitors & incidents)</option>
                      <option value="viewer">Viewer (Read-only access)</option>
                    </select>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsInviteOpen(false)}
                      className="px-3 py-2 rounded-xl text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
                    >
                      Send Invitation
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Upgrade Modal */}
        <UpgradeModal
          isOpen={isUpgradeOpen}
          onClose={() => setIsUpgradeOpen(false)}
        />
      </main>
    </div>
  );
}
