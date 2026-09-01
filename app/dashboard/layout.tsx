"use client";

import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import UpgradeModal from "@/components/UpgradeModal";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#090d16]">
      {/* Desktop & Tablet Sidebar */}
      <Sidebar onOpenUpgrade={() => setUpgradeModalOpen(true)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {children}
      </div>

      {/* Global Upgrade Modal */}
      <UpgradeModal
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
      />
    </div>
  );
}
