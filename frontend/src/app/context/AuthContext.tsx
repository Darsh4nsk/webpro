import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '../lib/firebase';
import type { User } from '../types';

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  /** Reload user profile from Firestore (e.g. after saving community on Profile). */
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function userFromFirebaseUser(fbUser: {
  uid: string;
  displayName: string | null;
  email: string | null;
}): User {
  return {
    id: fbUser.uid,
    name: fbUser.displayName || 'User',
    email: fbUser.email || '',
    communityId: '',
    communityName: '',
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = useCallback(async () => {
    if (!isFirebaseConfigured || !auth || !db) return;
    const fbUser = auth.currentUser;
    if (!fbUser) return;
    try {
      const snap = await getDoc(doc(db, 'users', fbUser.uid));
      if (!snap.exists()) return;
      const d = snap.data();
      setUser({
        id: fbUser.uid,
        name: (d.name as string) || fbUser.displayName || 'User',
        email: fbUser.email || '',
        communityId: String(d.communityId ?? ''),
        communityName: String(d.communityName ?? ''),
      });
    } catch {
      // keep current user
    }
  }, []);

  useEffect(() => {
    if (!isFirebaseConfigured || !auth || !db) {
      setLoading(false);
      return;
    }

    const unsub = onAuthStateChanged(auth, (fbUser) => {
      if (!fbUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      // Resolve session from Auth immediately so reload never blocks on Firestore.
      setUser(userFromFirebaseUser(fbUser));
      setLoading(false);

      void (async () => {
        try {
          const snap = await getDoc(doc(db, 'users', fbUser.uid));
          if (!snap.exists()) return;
          const d = snap.data();
          setUser({
            id: fbUser.uid,
            name: (d.name as string) || fbUser.displayName || 'User',
            email: fbUser.email || '',
            communityId: String(d.communityId ?? ''),
            communityName: String(d.communityName ?? ''),
          });
        } catch {
          // Permission/offline: keep Auth-only profile
        }
      })();
    });

    return () => unsub();
  }, []);

  const signOut = useCallback(async () => {
    if (!auth) return;
    await firebaseSignOut(auth);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, signOut, refreshProfile }),
    [user, loading, signOut, refreshProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
