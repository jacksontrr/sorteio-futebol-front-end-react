import { apiRequest } from "@/lib/api";

export interface CriarSorteioRequest {
    nome: string;
}

export interface AdicionarTimesRequest {
    times: Array<{
        nome: string;
        jogadorIds: (string | number)[];
    }>;
}

export interface RegistrarResultadoRequest {
    timeCasa: number;
    golsCasa: number;
    golsVisitante: number;
    timeVisitante: number;
    sorteioId: number;
}

export interface SorteioResumo {
    id: number;
    nome: string;
    status?: string;
    createdAt?: string;
    quantidadeTimes?: number;
}

export interface SorteioTimeDto {
    id: number;
    nome: string;
    sorteioId: number;
}

export interface PartidaDto {
    id: number;
    sorteioId: number;
    timeCasaId: number;
    timeVisitanteId: number;
    golsCasa: number;
    golsVisitante: number;
}

export interface TimeJogadorDto {
    id: number;
    nome: string;
    posicoes: string[];
}

export async function criarSorteio(req: CriarSorteioRequest): Promise<number> {
    const response = await apiRequest<number>("/sorteios", "POST", {
        body: req,
    });
    return response;
}

export async function adicionarTimes(
    sorteioId: number,
    req: AdicionarTimesRequest,
): Promise<SorteioTimeDto[]> {
    const timesWithIntIds = req.times.map((t) => ({
        nome: t.nome,
        jogadorIds: t.jogadorIds.map((id) => parseInt(String(id), 10)),
    }));

    return await apiRequest<SorteioTimeDto[]>(`/sorteios/${sorteioId}/times`, "POST", {
        body: { times: timesWithIntIds },
    });
}

export async function registrarResultado(req: RegistrarResultadoRequest): Promise<void> {
    await apiRequest<void>("/partidas", "POST", {
        body: req,
    });
}

export async function fetchSorteios(): Promise<SorteioResumo[]> {
    return await apiRequest<SorteioResumo[]>("/sorteios", "GET");
}

export async function fetchSorteioTimes(sorteioId: number): Promise<SorteioTimeDto[]> {
    return await apiRequest<SorteioTimeDto[]>(`/sorteios/${sorteioId}/times`, "GET");
}

export async function fetchPartidasBySorteio(sorteioId: number): Promise<PartidaDto[]> {
    return await apiRequest<PartidaDto[]>(`/partidas/sorteio/${sorteioId}`, "GET");
}

export async function fetchTimeJogadores(
    sorteioId: number,
    timeId: number,
): Promise<TimeJogadorDto[]> {
    return await apiRequest<TimeJogadorDto[]>(
        `/sorteios/${sorteioId}/times/${timeId}/jogadores`,
        "GET",
    );
}
