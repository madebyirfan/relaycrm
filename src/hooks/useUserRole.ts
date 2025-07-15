import { useEffect, useState } from 'react';
import { onAuthStateChanged, getIdTokenResult } from 'firebase/auth';
import { auth } from '../firebase/config';

export const useUserRole = (): 'admin' | 'user' | null => {
  const [role, setRole] = useState<'admin' | 'user' | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const tokenResult = await getIdTokenResult(user);
        const roleClaim = tokenResult.claims.role;
        if (roleClaim === 'admin' || roleClaim === 'user') {
          setRole(roleClaim);
        } else {
          setRole('user'); // fallback to user if claim is missing or invalid
        }
      } else {
        setRole(null);
      }
    });
    return () => unsubscribe();
  }, []);

  return role;
};
