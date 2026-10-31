import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';

export type AuthStatus =
  | 'unconfigured'
  | 'loading'
  | 'authenticated'
  | 'unauthenticated';

type AuthContextValue = {
  status: AuthStatus;
  session: Session | null;
  user: User | null;
  initializationError: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<Session | null>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function requireSupabase() {
  if (!supabase) {
    throw new Error('Le projet Supabase n’est pas configuré.');
  }
  return supabase;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [status, setStatus] = useState<AuthStatus>(
    supabase ? 'loading' : 'unconfigured',
  );
  const [initializationError, setInitializationError] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (!supabase) {
      setStatus('unconfigured');
      return;
    }

    let active = true;
    let receivedAuthEvent = false;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      receivedAuthEvent = true;
      if (!active) return;

      setSession(nextSession);
      setStatus(nextSession ? 'authenticated' : 'unauthenticated');
      setInitializationError(null);
    });

    void supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (!active || receivedAuthEvent) return;

        if (error) {
          setInitializationError(error.message);
          setSession(null);
          setStatus('unauthenticated');
          return;
        }

        setSession(data.session);
        setStatus(data.session ? 'authenticated' : 'unauthenticated');
      })
      .catch((error: unknown) => {
        if (!active || receivedAuthEvent) return;
        setInitializationError(
          error instanceof Error
            ? error.message
            : 'Impossible de vérifier la session Supabase.',
        );
        setSession(null);
        setStatus('unauthenticated');
      });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const client = requireSupabase();
    const { error } = await client.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    const client = requireSupabase();
    const { data, error } = await client.auth.signUp({ email, password });
    if (error) throw error;
    return data.session;
  }, []);

  const signOut = useCallback(async () => {
    const client = requireSupabase();
    const { error } = await client.auth.signOut();
    if (error) throw error;
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      session,
      user: session?.user ?? null,
      initializationError,
      signIn,
      signUp,
      signOut,
    }),
    [status, session, initializationError, signIn, signUp, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé à l’intérieur de AuthProvider.');
  }
  return context;
}
