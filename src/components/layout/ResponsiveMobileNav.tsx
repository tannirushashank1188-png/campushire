"use client";

import React from "react";
import { X } from "lucide-react";
import { AppSidebar } from "./AppSidebar";

interface ResponsiveMobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ResponsiveMobileNav({ isOpen, onClose }: ResponsiveMobileNavProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      {/* Sidebar slideover */}
      <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] z-50 flex shadow-2xl animate-in slide-in-from-left duration-300">
        <AppSidebar onNavigate={onClose} className="w-full" />
        <button
          onClick={onClose}
          className="absolute top-4 right-[-44px] p-2 rounded-full bg-slate-800 text-white hover:bg-slate-700 shadow-md"
          aria-label="Close navigation"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

