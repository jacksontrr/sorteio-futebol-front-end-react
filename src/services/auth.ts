import { apiRequest } from "@/lib/api";
import type { OrganizerFormData, Organizer } from "@/models/organizer";
import type { PlayerFormData, Player } from "@/models/player";

export interface UserProfile {
  nome: string;
  email: string;
  codigo: string;
  contaGoogle: boolean;
}

export async function registerOrganizador(data: OrganizerFormData): Promise<Organizer> {
  return await apiRequest<Organizer>("/auth/register/organizador", "POST", { body: data });
}

export async function registerJogador(data: PlayerFormData): Promise<
  Pick<Player, "id" | "nome" | "observacoes"> & {
    posicoes: string[];
    organizador: { id: string; nome: string; codigo: string };
  }
> {
  return await apiRequest("/auth/register/jogador", "POST", { body: data });
}

export async function login(email: string, password: string, remember: boolean): Promise<{ token: string }> {
  return await apiRequest<{ token: string }>("/auth/login", "POST", { body: { email, password, remember } });
}

export async function loginWithGoogle(clientId: string, credential: string): Promise<{ token: string }> {
  return await apiRequest<{ token: string }>("/auth/google", "POST", {
    body: { token: credential },
    headers: { "X-Google-Client-Id": clientId }
  });
}

export async function getUserProfile(): Promise<UserProfile> {
  const response = await apiRequest<UserProfile>("/auth/profile", "GET");
  return response;
}

export async function changePassword(senhaAtual: string | null, novaSenha: string): Promise<{ message: string }> {
  return await apiRequest<{ message: string }>("/auth/change-password", "POST", {
    body: {
      senhaAtual: senhaAtual || null,
      novaSenha,
    },
  });
}

export async function updateName(nome: string): Promise<{ message: string }> {
  return await apiRequest<{ message: string }>("/auth/update-name", "POST", {
    body: { nome },
  });
}

export async function updateCodigo(codigo: string): Promise<{ message: string }> {
  return await apiRequest<{ message: string }>("/auth/update-codigo", "POST", {
    body: { codigo },
  });
}

export function logout(): void {
  localStorage.removeItem('token');
  sessionStorage.removeItem('token');
}

export function getToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  }
  return null;
}

export function isAuthenticated(): boolean {
  return getToken() !== null;
}
