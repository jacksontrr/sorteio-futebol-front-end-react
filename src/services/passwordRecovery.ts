import { API_URL } from '@/lib/api';

export interface RecuperarSenhaRequest {
  email: string;
}

export interface RedefinirSenhaRequest {
  token: string;
  novaSenha: string;
}

export interface ApiResponse {
  message?: string;
  error?: string;
  success?: boolean;
}

export const passwordRecoveryService = {
  async solicitarRecuperacao(email: string): Promise<ApiResponse> {
    const response = await fetch(`${API_URL}/auth/recuperar-senha`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email } as RecuperarSenhaRequest),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Erro ao solicitar recuperação de senha');
    }

    return response.json();
  },

  async redefinirSenha(token: string, novaSenha: string): Promise<ApiResponse> {
    const response = await fetch(`${API_URL}/auth/redefinir-senha`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token,
        novaSenha,
      } as RedefinirSenhaRequest),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Erro ao redefinir senha');
    }

    return response.json();
  },
};
