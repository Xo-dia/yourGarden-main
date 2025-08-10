import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { apiFetch } from '../services/fetchClient';
import { tokenService } from '../services/TokenService';
import { User } from '@/models/user';
import { LoginCredentials } from '@/models/loginCredentials';

// export interface LoginCredentials {
//   email: string;
//   password: string;
//   [key: string]: unknown;
// }

interface LoginResponse {
  Token: string;
  accessToken: string;
  refreshToken: string;
  user: User;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initializeAuth = async () => {
    const access = tokenService.getLocalAccessToken();

      // Sans refresh: si pas d'access ou expiré -> clear direct
    if (!access || tokenService.isTokenExpired(access)) {
      tokenService.clearTokens();
      setLoading(false);
      return;
    }

      try {
        const me = await apiFetch<User>("/accounts", { method: "GET" });
        setUser(me);
      } catch {
        tokenService.clearTokens();
      } finally {
        setLoading(false);
      }
    };
    void initializeAuth();
  }, []);

  const login = useCallback(async (credentials: LoginCredentials): Promise<User> => {
    const data = await apiFetch<LoginResponse>('/accounts/authenticate', {
      method: 'POST',
      json: credentials,
      auth: false, // pas de bearer sur login
      retryOnUnauthorized: false
    });
    tokenService.updateLocalAccessToken(data.accessToken);
    console.log("data " + JSON.stringify(data));

    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback((): void => {
    tokenService.clearTokens();
    setUser(null);
    if (typeof window !== 'undefined') window.location.href = '/login';
  }, []);

  const value = useMemo<AuthContextValue>(() => ({ user, loading, login, logout }), [user, loading, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth doit être utilisé dans le AuthProvider');
  return context;
};
