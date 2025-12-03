import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

type AuthContextValue = {
  user: any | null;
  isPending: boolean;
  logout: () => Promise<void>;
  redirectToLogin: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [isPending, setIsPending] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user ?? null);
      setIsPending(false);
    })();
    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      sub.subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const redirectToLogin = () => {
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, isPending, logout, redirectToLogin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

