"use client";

import React, { useState } from "react";
import {
  Code2,
  Key,
  Plus,
  Trash2,
  Copy,
  Check,
  Terminal,
  Play,
  Loader2,
  Sparkles,
} from "lucide-react";
import Header from "@/components/Header";
import { useStore } from "@/lib/store";

export default function DevelopersApiPage() {
  const { apiKeys, createApiKey, deleteApiKey } = useStore();
  const [keyName, setKeyName] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createdSecret, setCreatedSecret] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"curl" | "typescript" | "python" | "go">("curl");

  // Interactive REST Sandbox
  const [sandboxEndpoint, setSandboxEndpoint] = useState("/api/check?url=https://api.github.com");
  const [sandboxRunning, setSandboxRunning] = useState(false);
  const [sandboxResponse, setSandboxResponse] = useState<string | null>(null);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyName) return;

    const secret = createApiKey(keyName, ["monitors:read", "monitors:write", "incidents:write"]);
    setCreatedSecret(secret);
    setKeyName("");
  };

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const runSandbox = async () => {
    setSandboxRunning(true);
    try {
      const res = await fetch(sandboxEndpoint);
      const data = await res.json();
      setSandboxResponse(JSON.stringify(data, null, 2));
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : "Request failed";
      setSandboxResponse(JSON.stringify({ error: errorMessage }, null, 2));
    } finally {
      setSandboxRunning(false);
    }
  };

  const codeSnippets = {
    curl: `curl -X GET "https://pulseguard-ai.vercel.app/api/check?url=https://api.stripe.com" \\
  -H "Authorization: Bearer pg_live_89f3a9b2..." \\
  -H "Content-Type: application/json"`,
    typescript: `import { PulseGuard } from "@pulseguard/sdk";

const client = new PulseGuard({
  apiKey: process.env.PULSEGUARD_API_KEY,
});

// Run immediate synthetic probe
const result = await client.monitors.probe({
  url: "https://api.stripe.com/healthcheck",
  method: "GET",
  expectedStatus: 200,
});

console.log(\`Latency: \${result.latencyMs}ms, Status: \${result.status}\`);`,
    python: `from pulseguard import PulseGuard

client = PulseGuard(api_key="pg_live_89f3a9b2...")

# Trigger instant diagnostic check
result = client.monitors.probe(
    url="https://api.stripe.com/healthcheck",
    method="GET"
)

print(f"Health: {result.status}, Latency: {result.latency_ms}ms")`,
    go: `package main

import (
    "fmt"
    "github.com/pulseguard/go-sdk/pulseguard"
)

func main() {
    client := pulseguard.NewClient("pg_live_89f3a9b2...")
    result, err := client.Monitors.Probe("https://api.stripe.com/healthcheck")
    if err != nil {
        panic(err)
    }
    fmt.Printf("Status: %d, Latency: %dms\\n", result.Status, result.LatencyMs)
}`,
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#090d16]">
      <Header
        title="Developer REST API & SDKs"
        subtitle="Manage secret keys, query endpoints, and integrate automated reliability pipelines"
      />

      <main className="p-6 md:p-8 space-y-8 max-w-5xl w-full mx-auto">
        {/* API Keys Manager */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Key className="w-4 h-4 text-indigo-400" />
                <span>Production API Keys</span>
              </h3>
              <p className="text-xs text-slate-400">
                Authenticate CI/CD pipelines, Prometheus scrapers, or custom monitoring agents.
              </p>
            </div>

            <button
              onClick={() => {
                setCreatedSecret(null);
                setIsCreateOpen(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-500/20"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Generate New Secret Key</span>
            </button>
          </div>

          {/* Key Reveal Callout */}
          {createdSecret && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs space-y-2 animate-in fade-in duration-200">
              <span className="font-bold text-emerald-400 block">
                🔑 New Secret Key Generated! Copy it now (will not be shown again):
              </span>
              <div className="flex items-center gap-2">
                <code className="p-2 rounded bg-slate-950 font-mono text-white flex-1 select-all border border-emerald-500/20">
                  {createdSecret}
                </code>
                <button
                  onClick={() => copyText(createdSecret, "new-sec")}
                  className="px-3 py-2 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center gap-1"
                >
                  {copied === "new-sec" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied === "new-sec" ? "Copied" : "Copy"}</span>
                </button>
              </div>
            </div>
          )}

          {/* Existing Keys Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="pb-2.5">Key Name</th>
                  <th className="pb-2.5">Token Prefix</th>
                  <th className="pb-2.5">Created</th>
                  <th className="pb-2.5">Scopes</th>
                  <th className="pb-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium text-slate-300">
                {apiKeys.map((k) => (
                  <tr key={k.id} className="hover:bg-slate-850/40">
                    <td className="py-3 font-bold text-white">{k.name}</td>
                    <td className="py-3 font-mono text-slate-400">{k.keyPrefix}</td>
                    <td className="py-3 text-slate-400">{new Date(k.createdAt).toLocaleDateString()}</td>
                    <td className="py-3">
                      <div className="flex gap-1 flex-wrap">
                        {k.scopes.map((s) => (
                          <span key={s} className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-slate-400">
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => deleteApiKey(k.id)}
                        className="p-1.5 rounded text-slate-400 hover:text-rose-400"
                        title="Revoke Key"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Interactive REST API Playground */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>Interactive REST API Sandbox</span>
            </h3>
            <span className="text-xs text-slate-400">Live Serverless Execution</span>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={sandboxEndpoint}
              onChange={(e) => setSandboxEndpoint(e.target.value)}
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={runSandbox}
              disabled={sandboxRunning}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              {sandboxRunning ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
              <span>Execute</span>
            </button>
          </div>

          {sandboxResponse && (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto max-h-64">
              <pre>{sandboxResponse}</pre>
            </div>
          )}
        </div>

        {/* Code SDK Snippets */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Code2 className="w-4 h-4 text-indigo-400" />
              <span>Multi-Language Integration Snippets</span>
            </h3>

            <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-950 border border-slate-800">
              {(["curl", "typescript", "python", "go"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-colors ${
                    activeTab === tab ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="relative rounded-xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs text-slate-300 overflow-x-auto">
            <button
              onClick={() => copyText(codeSnippets[activeTab], activeTab)}
              className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs flex items-center gap-1"
            >
              {copied === activeTab ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied === activeTab ? "Copied" : "Copy"}</span>
            </button>
            <pre className="pr-16">{codeSnippets[activeTab]}</pre>
          </div>
        </div>

        {/* Modal */}
        {isCreateOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 relative">
              <h4 className="text-base font-bold text-white mb-4">Create Scoped API Key</h4>

              <form onSubmit={handleCreate} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Key Description
                  </label>
                  <input
                    type="text"
                    required
                    value={keyName}
                    onChange={(e) => setKeyName(e.target.value)}
                    placeholder="e.g. GitHub Actions Deployment Health Probe"
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsCreateOpen(false)}
                    className="px-3 py-2 rounded-xl text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
                  >
                    Generate Key
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
