"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { UserRole, UserProfile } from "@/lib/types";
import {
  SAMPLE_STUDENTS,
  SAMPLE_RECRUITERS,
  SAMPLE_ADMIN,
} from "@/lib/sampleData";
import { isSupabaseConfigured, getSupabaseClient } from "@/lib/supabase/client";

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  isDemoMode: boolean;
  isLoading: boolean;
  loginAsDemo: (role: UserRole) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  updateCurrentUserProfile: (updates: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<UserRole>("student");
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);

  // Initialize from localStorage or fallback to default student
  useEffect(() => {
    try {
      const supabaseActive = isSupabaseConfigured();
      setIsDemoMode(!supabaseActive);

      const savedRole = localStorage.getItem("campushire_active_role") as UserRole | null;
      const savedUserJson = localStorage.getItem("campushire_active_user");

      if (savedUserJson) {
        const parsed = JSON.parse(savedUserJson);
        setUser(parsed);
        setRole(parsed.role || "student");
      } else if (savedRole) {
        setRole(savedRole);
        setUser(getDefaultProfileForRole(savedRole));
      } else {
        // Default to student demo user
        setRole("student");
        setUser(SAMPLE_STUDENTS[0]);
      }
    } catch {
      // In SSR or storage disabled
      setRole("student");
      setUser(SAMPLE_STUDENTS[0]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  function getDefaultProfileForRole(r: UserRole): UserProfile {
    if (r === "student") return SAMPLE_STUDENTS[0];
    if (r === "recruiter") return SAMPLE_RECRUITERS[0];
    return SAMPLE_ADMIN;
  }

  const loginAsDemo = (newRole: UserRole) => {
    const profile = getDefaultProfileForRole(newRole);
    setRole(newRole);
    setUser(profile);
    try {
      localStorage.setItem("campushire_active_role", newRole);
      localStorage.setItem("campushire_active_user", JSON.stringify(profile));
    } catch {}
  };

  const switchRole = (newRole: UserRole) => {
    loginAsDemo(newRole);
  };

  const logout = () => {
    if (!isDemoMode) {
      const supabase = getSupabaseClient();
      if (supabase) {
        supabase.auth.signOut();
      }
    }
    setUser(null);
    try {
      localStorage.removeItem("campushire_active_role");
      localStorage.removeItem("campushire_active_user");
    } catch {}
  };

  const updateCurrentUserProfile = (updates: Partial<UserProfile>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...updates };
      try {
        localStorage.setItem("campushire_active_user", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isDemoMode,
        isLoading,
        loginAsDemo,
        logout,
        switchRole,
        updateCurrentUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

