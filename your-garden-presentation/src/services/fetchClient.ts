import { tokenService } from './TokenService';

// CRA: REACT_APP_API_BASE_URL / Vite: VITE_API_BASE_URL
// const API_BASE_URL: string | undefined =
//   (typeof process !== 'undefined' && (process as any).env?.REACT_APP_API_BASE_URL) ??
//   (typeof import.meta !== 'undefined' ? (import.meta as any).env?.VITE_API_BASE_URL : undefined);
// if (!API_BASE_URL) {
//   // eslint-disable-next-line no-console
//   console.warn('[fetchClient] API_BASE_URL non défini. Configurez REACT_APP_API_BASE_URL ou VITE_API_BASE_URL.');
// }

const API_BASE_URL = "http://localhost:8080"
export class ApiError extends Error {
  public status: number;
  public details?: unknown;
  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface ApiInit extends Omit<RequestInit, 'body' | 'method'> {
  method?: HttpMethod;
  /** Passer un objet ici pour sérialisation JSON + header Content-Type */
  json?: unknown;
  /** Injecter automatiquement le Bearer token (par défaut true) */
  auth?: boolean;
  /** Forcer la baseURL (par défaut API_BASE_URL) */
  baseURL?: string;
  /** Retenter une requête 401 après refresh (défaut true) */
  retryOnUnauthorized?: boolean;
}

let refreshPromise: Promise<string> | null = null;

function buildUrl(input: string, baseURL = API_BASE_URL): string {
  try {
    // si input est absolu, new URL ne lèvera pas
    // @ts-ignore
    return new URL(input, baseURL ?? undefined).toString();
  } catch {
    if (!baseURL) throw new Error('Aucune baseURL fournie');
    return `${baseURL.replace(/\/$/, '')}/${input.replace(/^\//, '')}`;
  }
}

async function refreshAccessToken(): Promise<string> {
  const currentRefresh = tokenService.getLocalRefreshToken();
  if (!currentRefresh) throw new ApiError('Missing refresh token', 401);

  const url = buildUrl('/auth/refresh');
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken: currentRefresh })
  });

  if (!res.ok) {
    const details = await safeParseJson(res);
    throw new ApiError('Refresh token invalid', res.status, details);
  }

  const data = (await res.json()) as { accessToken: string; refreshToken: string };
  tokenService.updateLocalAccessToken(data.accessToken);
  tokenService.updateLocalRefreshToken(data.refreshToken);
  return data.accessToken;
}

async function ensureValidAccessToken(): Promise<string | null> {
  const token = tokenService.getLocalAccessToken();
  if (token && !tokenService.isTokenExpired(token)) return token;

  // single-flight: partage la même promesse entre appels concurrents
  if (!refreshPromise) {
    refreshPromise = refreshAccessToken().finally(() => {
      refreshPromise = null;
    });
  }
  try {
    return await refreshPromise;
  } catch (e) {
    tokenService.clearTokens();
    if (typeof window !== 'undefined') window.location.href = '/login';
    throw e;
  }
}

async function safeParseJson(res: Response): Promise<unknown | undefined> {
  const text = await res.text().catch(() => '');
  if (!text) return undefined;
  try { return JSON.parse(text); } catch { return text; }
}

export async function apiFetch<T = unknown>(input: string, init: ApiInit = {}): Promise<T> {
  const {
    method = 'GET',
    json,
    auth = true,
    baseURL = API_BASE_URL,
    retryOnUnauthorized = true,
    headers: initHeaders,
    ...rest
  } = init;

  const headers = new Headers(initHeaders);

  let accessToken: string | null = null;
  if (auth) {
    accessToken = await ensureValidAccessToken();
    if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`);
  }

  let body: BodyInit | undefined;
  if (json !== undefined) {
    headers.set('Content-Type', 'application/json');
    body = JSON.stringify(json);
  }

  const request = new Request(buildUrl(input, baseURL), { method, headers, body, ...rest });
console.log(request);
  let res = await fetch(request);

  // Si 401, on tente un refresh + retry une seule fois
  if (res.status === 401 && retryOnUnauthorized && auth) {
    try {
      const newAccess = await ensureValidAccessToken();
      const retryHeaders = new Headers(headers);
      if (newAccess) retryHeaders.set('Authorization', `Bearer ${newAccess}`);
      const retryReq = new Request(buildUrl(input, baseURL), { method, headers: retryHeaders, body, ...rest });
      res = await fetch(retryReq);
    } catch (e) {
      // Laisse l'erreur suivre son cours
    }
  }

  if (!res.ok) {
    const details = await safeParseJson(res);
    throw new ApiError(`HTTP ${res.status}`, res.status, details);
  }

  // Tente JSON, sinon renvoie texte
  const contentType = res.headers.get('Content-Type') ?? '';
  if (contentType.includes('application/json')) {
    return (await res.json()) as T;
  }
  // @ts-ignore
  return (await res.text()) as T;
}