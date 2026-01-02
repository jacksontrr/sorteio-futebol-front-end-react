import type { ApiResponse, ErrorResponse } from "@/models/api";

export const API_URL = import.meta.env.VITE_API_URL;

function getToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  }
  return null;
}

function setToken(token: string): void {
  if (typeof window !== 'undefined') {
    if (localStorage.getItem('token')) {
      localStorage.setItem('token', token);
    } else {
      sessionStorage.setItem('token', token);
    }
  }
}

function clearToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
  }
}

async function refreshTokenRequest(): Promise<string | null> {
  try {
    const token = getToken();
    if (!token) return null;

    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });

    if (!res.ok) return null;

    const json = await res.json().catch(() => null);
    if (json && (json as ApiResponse<{ token: string }>).data?.token) {
      const newToken = (json as ApiResponse<{ token: string }>).data.token;
      setToken(newToken);
      return newToken;
    }
  } catch {
    // Silenciosamente falha
  }
  return null;
}

// Generic apiRequest that unwraps the backend envelope { data } on success
// and throws with the backend error.message when { error } is returned.
export async function apiRequest<T>(
  endpoint: string,
  method: string,
  { body, headers, retry = true }: { body?: any, headers?: Record<string, string>, retry?: boolean } = {}
): Promise<T> {
  const token = getToken();
  const requestHeaders: Record<string, string> = { "Content-Type": "application/json" };
  if (token) requestHeaders["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers: { ...requestHeaders, ...headers },
    body: body ? JSON.stringify(body) : undefined,
  });

  // Try to parse JSON body (many endpoints return JSON envelopes)
  const json = await res.json().catch(() => null);

  // Se 401, tentar refresh token uma vez
  if (res.status === 401 && retry) {
    const newToken = await refreshTokenRequest();
    if (newToken) {
      // Retry a requisição com o novo token
      return apiRequest<T>(endpoint, method, { body, headers, retry: false });
    } else {
      // Falha no refresh, redirecionar para login
      clearToken();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      throw new Error('Sessão expirada. Redirecionando para login.');
    }
  }

  if (!res.ok) {
    // If backend returned structured error, use its message
    if (json && (json as ErrorResponse).error && (json as ErrorResponse).error.message) {
      // Throw the structured error so callers can inspect/typesafe-handle it
      throw (json as ErrorResponse);
    }

    // Fallback to throwing an Error with statusText
    throw new Error(res.statusText || "Erro na requisição");
  }

  // If backend uses envelope { data: ... }
  if (json && (json as ApiResponse<T>).data !== undefined) {
    return (json as ApiResponse<T>).data as T;
  }

  // If backend returns plain JSON (not yet wrapped), return it directly
  return json as T;
}
