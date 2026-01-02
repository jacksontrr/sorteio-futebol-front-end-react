import { apiRequest } from "@/lib/api";
import type { Player, PlayerFormData } from "@/models/player";


export async function fetchJogadores(query?: string, includeInactive?: boolean): Promise<Player[]> {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (!includeInactive) params.set('ativo', 'true');
    const qs = params.toString();
    const suffix = qs ? `?${qs}` : '';
    return await apiRequest<Player[]>(`/jogadores${suffix}`, "GET");
}

export async function postJogador(data: PlayerFormData): Promise<Player> {
    const body = {
        nome: data.nome,
        posicoes: data.posicoes ?? [],
        observacoes: data.observacoes ?? null,
        destaque: data.destaque ?? false,
        peso: data.peso ?? false,
    };
    return await apiRequest<Player>("/jogadores", "POST", { body });
}

export async function putJogador(id: string | number, data: PlayerFormData): Promise<void> {
    const body = {
        nome: data.nome,
        posicoes: data.posicoes ?? [],
        observacoes: data.observacoes ?? null,
        destaque: data.destaque ?? false,
        peso: data.peso ?? false,
    };
    await apiRequest<void>(`/jogadores/${id}`, "PUT", { body });
}

export async function toggleJogadorAtivo(id: string | number, ativo: boolean): Promise<void> {
    await apiRequest<void>(`/jogadores/${id}/status`, "PUT", { body: { ativo } });
}