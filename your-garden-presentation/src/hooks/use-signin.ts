// src/hooks/useSignin.ts
import { useState } from 'react';
import { signin, SigninPayload } from '@/services/authenticationService';
import { SigninResponse } from '@/models/signin-response';

interface UseSignin {
  signinUser: (payload: SigninPayload) => Promise<SigninResponse | null>;
  loading: boolean;
  error: string | null;
}

export const useSignin = (): UseSignin => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signinUser = async (payload: SigninPayload): Promise<SigninResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await signin(payload);
      return response;
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Erreur inconnue');
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { signinUser, loading, error };
};
