import { jwtDecode } from 'jwt-decode';

export interface JwtPayload {
  exp: number; // expiration epoch (secondes)
  iat?: number;
  [key: string]: unknown;
}

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

export const tokenService = {
  getLocalAccessToken(): string | null {
    return typeof window === 'undefined' ? null : window.localStorage.getItem(ACCESS_TOKEN_KEY);
  },
  updateLocalAccessToken(token: string): void {
    if (typeof window !== 'undefined') window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
  },
  clearTokens(): void {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(ACCESS_TOKEN_KEY);
      window.localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
  },
  isTokenExpired(token?: string | null): boolean {
    if (!token) return true;
    try {
      const { exp } = jwtDecode<JwtPayload>(token);
      // marge de 5s pour éviter les courses
      return Date.now() >= exp * 1000 - 5000;
    } catch {
      // si le token est illisible, on le considère expiré
      return true;
    }
  }
} as const;