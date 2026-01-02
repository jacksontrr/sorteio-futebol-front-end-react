import { getToken } from '@/services/auth';
import { apiRequest } from '@/lib/api';

export interface DecodedToken {
    sub?: string;
    id?: string;
    email?: string;
    nome?: string;
    codigo?: string;
    organizadorId?: string;
    iat?: number;
    exp?: number;
}

export interface OrganizadorResponse {
    id: string;
    nome: string;
    codigo: string;
    ativo: boolean;
}

/**
 * Decodifica um token JWT
 */
function decodeToken(token: string): DecodedToken | null {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;

        const payload = parts[1];
        const decoded = JSON.parse(atob(payload));
        return decoded;
    } catch {
        return null;
    }
}

/**
 * Obtém os dados do usuário autenticado
 */
export function getCurrentUser(): DecodedToken | null {
    const token = getToken();
    if (!token) return null;
    return decodeToken(token);
}

/**
 * Obtém o ID do usuário autenticado
 */
export function getUserId(): string | null {
    const user = getCurrentUser();
    return user?.id || user?.sub || null;
}

/**
 * Obtém o código do usuário (para organizadores)
 */
export function getUserCode(): string | null {
    const user = getCurrentUser();
    return user?.codigo || null;
}

/**
 * Obtém o email do usuário
 */
export function getUserEmail(): string | null {
    const user = getCurrentUser();
    return user?.email || null;
}

/**
 * Obtém o nome do usuário
 */
export function getUserName(): string | null {
    const user = getCurrentUser();
    return user?.nome || null;
}
/**
 * Consulta o endpoint /api/user para obter dados do organizador
 */
export async function fetchUserData(): Promise<OrganizadorResponse | null> {
    try {
        const data = await apiRequest<OrganizadorResponse>('/user', 'GET');
        return data;
    } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
        return null;
    }
}