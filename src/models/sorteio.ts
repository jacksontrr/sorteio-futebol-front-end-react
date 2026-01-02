import type { Team } from './team';
import type { Player } from './player';
import type { MatchRow } from '@/lib/standings';

export type Time = Team & {
    quantidadeJogadores?: number;
};

export type Match = MatchRow;

export interface SorteioCreationState {
    creatingSorteio: boolean;
    allJogadores: Player[];
    paidIds: Set<string>;
    teamCount: number;
    teamNames: string[];
    teamsAlloc: Record<string, Player[]>;
    filterText: string;
    sorteioMatches: Match[];
    sorteioHome: string;
    sorteioAway: string;
    sorteioHomeGoals: number;
    sorteioAwayGoals: number;
    sorteioId: number | null;
    loadingSorteio: boolean;
    teamNamesToIds: Record<string, number>;
    sorteioGerado: boolean;
    campNome: string;
}

export interface TimeJogadorDto {
    id: number;
    nome: string;
    numero?: number;
    posicoes: string[];
}

export interface SorteioResumo {
    id: number;
    nome: string;
    createdAt?: string;
}

export interface SorteioDetailState {
    detalheSorteioId: number | null;
    detalheHome: number | null;
    detalheAway: number | null;
    detalheHomeGoals: number;
    detalheAwayGoals: number;
    expandedTeamId: number | null;
    expandedTeamJogadores: TimeJogadorDto[];
    loadingTeamJogadores: boolean;
}

export interface SorteioListState {
    sorteios: SorteioResumo[];
    loadingSorteios: boolean;
}
