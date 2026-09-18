import { onAuthStateChanged, signInAnonymously, type User } from 'firebase/auth';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { auth } from '../firebase/config';

interface AuthState {
  uid: string | null;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthState | null>(null);

/**
 * Signs the device in anonymously (no login UI) and exposes the resulting
 * uid. Firebase persists the anonymous session locally, so reopening the
 * app on the same device/browser reuses the same uid — that's what lets a
 * player rejoin a room as "themselves" after a disconnect.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ uid: null, loading: true, error: null });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user: User | null) => {
        if (user) {
          setState({ uid: user.uid, loading: false, error: null });
        } else {
          signInAnonymously(auth).catch((err: unknown) => {
            setState({ uid: null, loading: false, error: err instanceof Error ? err.message : String(err) });
          });
        }
      },
      (err) => {
        setState({ uid: null, loading: false, error: err.message });
      },
    );

    return unsubscribe;
  }, []);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
