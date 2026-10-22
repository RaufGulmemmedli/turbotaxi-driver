import { createContext, useCallback, useContext, useMemo, useState } from 'react';

import {
  Api,
  type AuthUser,
  type RequestAccessPayload,
  type SignInPayload,
  type SignUpPayload,
} from '@/services/api';

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (payload: SignInPayload) => Promise<void>;
  signInDemo: () => Promise<void>;
  signUp: (payload: SignUpPayload) => Promise<void>;
  requestAccess: (payload: RequestAccessPayload) => Promise<void>;
  deleteAccount: () => Promise<void>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const signIn = useCallback(async (payload: SignInPayload) => {
    setIsLoading(true);
    try {
      setUser(await Api.signIn(payload));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signInDemo = useCallback(async () => {
    setIsLoading(true);
    try {
      setUser(await Api.signInDemo());
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signUp = useCallback(async (payload: SignUpPayload) => {
    setIsLoading(true);
    try {
      setUser(await Api.signUp(payload));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const requestAccess = useCallback(async (payload: RequestAccessPayload) => {
    setIsLoading(true);
    try {
      await Api.requestAccess(payload);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearSession = useCallback(() => {
    // Single place to wipe the authenticated session. The current build keeps
    // the session in memory only; when persistent storage (access/refresh
    // tokens, cached profile) is added, clear it here too.
    setUser(null);
  }, []);

  const signOut = useCallback(() => {
    clearSession();
  }, [clearSession]);

  const deleteAccount = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      // Always use the real, logged-in user's id.
      await Api.deleteUser(user.id);
      // On success, fully tear down the session so no protected screen remains
      // reachable (navigation reset is handled by the route guards).
      clearSession();
    } finally {
      setIsLoading(false);
    }
  }, [user, clearSession]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: user !== null,
      isLoading,
      signIn,
      signInDemo,
      signUp,
      requestAccess,
      deleteAccount,
      signOut,
    }),
    [user, isLoading, signIn, signInDemo, signUp, requestAccess, deleteAccount, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
