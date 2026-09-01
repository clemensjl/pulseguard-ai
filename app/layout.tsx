import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "@/lib/store";

export const metadata: Metadata = {
  title: "PulseGuard AI | Autonomous Observability, API Monitoring & Status Pages",
  description:
    "Enterprise-grade uptime monitoring, SSL tracking, AI incident post-mortems, and public status pages. Never let an outage catch you by surprise.",
  keywords: [
    "uptime monitoring",
    "status page",
    "API monitoring",
    "incident management",
    "AI post mortem",
    "synthetic monitoring",
    "SSL certificate monitor",
  ],
  authors: [{ name: "PulseGuard AI" }],
  openGraph: {
    title: "PulseGuard AI | Autonomous Observability & Uptime Platform",
    description: "Enterprise-grade uptime monitoring, SSL tracking, AI incident post-mortems, and public status pages.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#090d16] text-slate-100 antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
