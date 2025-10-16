
'use client';

import { useState } from 'react';
import { signOut as firebaseSignOut } from 'firebase/auth';
import { useFirebase, initiateEmailSignIn, initiateEmailSignUp } from '@/firebase';

export function useAuth() {
  const { auth } = useFirebase();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // This is now a non-blocking call
  const signup = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      initiateEmailSignUp(auth, email, password);
      // We don't await, so we can't know success here directly.
      // Auth state listeners will handle the result.
      // We'll optimistically assume it will work and let the listener redirect.
      setLoading(false);
      return true;
    } catch (e: any) {
      console.error("Signup initiation error:", e);
      setError(e);
      setLoading(false);
      return false;
    }
  };

  // This is now a non-blocking call
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      initiateEmailSignIn(auth, email, password);
       // We don't await, so we can't know success here directly.
      setLoading(false);
      return true;
    } catch (e: any) {
      console.error("Login initiation error:", e);
      setError(e);
      setLoading(false);
      return false;
    }
  };

  const signOut = async () => {
    setLoading(true);
    setError(null);
    try {
      await firebaseSignOut(auth);
      setLoading(false);
    } catch (e: any)      {
      console.error("Logout error:", e);
      setError(e);
      setLoading(false);
    }
  };

  return { signup, login, signOut, loading, error };
}
