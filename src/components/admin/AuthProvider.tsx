"use client";
/**
 * Admin authentication context. Signing in only proves identity — authorisation comes from the
 * `admins/{uid}` document (created manually by the owner in the Firebase console) and is enforced
 * again by Firestore/Storage Security Rules on every request.
 */
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { User } from "firebase/auth";
import { isFirebaseConfigured } from "@/lib/firebase/config";
import type { AdminRecord } from "@/lib/schema";

interface AuthState {
  configured: boolean;
  loading: boolean;
  user: User | null;
  admin: AdminRecord | null;
  error: string;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const Ctx = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(isFirebaseConfigured);
  const [user, setUser] = useState<User | null>(null);
  const [admin, setAdmin] = useState<AdminRecord | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    let unsub = () => {};
    (async () => {
      const [{ onAuthStateChanged }, { getClientAuth, getClientDb }, { doc, getDoc }] = await Promise.all([
        import("firebase/auth"), import("@/lib/firebase/client"), import("firebase/firestore"),
      ]);
      unsub = onAuthStateChanged(getClientAuth(), async (u) => {
        setUser(u);
        setAdmin(null);
        setError("");
        if (u) {
          try {
            const snap = await getDoc(doc(getClientDb(), "admins", u.uid));
            const data = snap.exists() ? (snap.data() as AdminRecord) : null;
            if (data && data.active === true && (data.role === "owner" || data.role === "editor")) setAdmin(data);
            else setError("This account is not an authorised administrator. Ask the owner to add your user ID to the admins list.");
          } catch {
            setError("This account is not an authorised administrator.");
          }
        }
        setLoading(false);
      });
    })();
    return () => unsub();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const [{ signInWithEmailAndPassword }, { getClientAuth }] = await Promise.all([import("firebase/auth"), import("@/lib/firebase/client")]);
    await signInWithEmailAndPassword(getClientAuth(), email, password);
  }, []);
  const signOut = useCallback(async () => {
    const [{ signOut: so }, { getClientAuth }] = await Promise.all([import("firebase/auth"), import("@/lib/firebase/client")]);
    await so(getClientAuth());
  }, []);
  const resetPassword = useCallback(async (email: string) => {
    const [{ sendPasswordResetEmail }, { getClientAuth }] = await Promise.all([import("firebase/auth"), import("@/lib/firebase/client")]);
    await sendPasswordResetEmail(getClientAuth(), email);
  }, []);

  return <Ctx.Provider value={{ configured: isFirebaseConfigured, loading, user, admin, error, signIn, signOut, resetPassword }}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth must be used inside AuthProvider");
  return c;
}
