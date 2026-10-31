"use client";

import React, { useState } from "react";
import { AppSidebar } from "./AppSidebar";
import { ResponsiveMobileNav } from "./ResponsiveMobileNav";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* Desktop Navy Sidebar */}
      <div className="hidden lg:block shrink-0 sticky top-0 h-screen">
        <AppSidebar />
      </div>

      {/* Mobile Drawer */}
      <ResponsiveMobileNav
        isOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Pass mobile toggle via clone or render */}
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            // @ts-ignore
            return React.cloneElement(child, {
              onOpenMobileNav: () => setMobileNavOpen(true),
            });
          }
          return child;
        })}
      </div>
    </div>
  );
}
