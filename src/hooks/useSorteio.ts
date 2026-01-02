import React from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { fetchJogadores as fetchPlayersService } from '@/services/jogador';
import {
    criarSorteio,
    adicionarTimes,
    registrarResultado,
} from '@/services/sorteio';
import { distributePlayersToTeams } from '@/lib/teamDistribution';
import type { SorteioCreationState } from '@/models/sorteio';

function uid(prefix = 'id') {
    return prefix + '_' + Math.random().toString(36).slice(2, 9);
}

export function useSorteio() {
    const navigate = useNavigate();
    const [state, setState] = React.useState<SorteioCreationState>({
        creatingSorteio: false,
        allJogadores: [],
        paidIds: new Set(),
        teamCount: 0,
        teamNames: [],
        teamsAlloc: {},
        filterText: '',
        sorteioMatches: [],
        sorteioHome: '',
        sorteioAway: '',
        sorteioHomeGoals: 0,
        sorteioAwayGoals: 0,
        sorteioId: null,
        loadingSorteio: false,
        teamNamesToIds: {},
        sorteioGerado: false,
        campNome: '',
    });

    const updateState = (updates: Partial<SorteioCreationState>) => {
        setState((prev) => ({ ...prev, ...updates }));
    };

    const startSorteio = async () => {
        try {
            updateState({ loadingSorteio: true });

            const sorteioName = state.campNome.trim() || new Date().toLocaleDateString('pt-BR');

            const newSorteioId = await criarSorteio({
                nome: sorteioName,
            });

            const players = await fetchPlayersService(undefined, false);
            const normalized = (players || []).map((p) => ({
                ...p,
                id: String(p.id ?? uid('j')),
            }));

            updateState({
                sorteioId: newSorteioId,
                creatingSorteio: true,
                allJogadores: normalized,
            });

            toast.success('Sorteio criado com sucesso');
        } catch (err) {
            console.error(err);
            toast.error('Falha ao criar sorteio');
        } finally {
            updateState({ loadingSorteio: false });
        }
    };

    const togglePaid = (id: string) => {
        setState((prev) => {
            const next = new Set(prev.paidIds);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return { ...prev, paidIds: next };
        });
    };

    const updateTeamCount = (n: number) => {
        const nn = Math.max(0, n);
        const newTeamNames = Array(nn)
            .fill(null)
            .map((_, i) => state.teamNames[i] || `Time ${i + 1}`);

        updateState({
            teamCount: n,
            teamNames: newTeamNames,
        });
    };

    const updateTeamName = (i: number, nome: string) => {
        const newTeamNames = [...state.teamNames];
        newTeamNames[i] = nome;
        updateState({ teamNames: newTeamNames });
    };

    const generateTeamsFromPaid = async () => {
        if (state.teamCount <= 0) {
            toast.error('Informe a quantidade de times');
            return;
        }

        const selected = state.allJogadores.filter((p) =>
            state.paidIds.has(String(p.id))
        );

        if (selected.length === 0) {
            toast.error('Inclua jogadores na lista de pagos');
            return;
        }

        if (!state.sorteioId) {
            toast.error('Sorteio não foi criado. Clique em "Criar Sorteio" primeiro.');
            return;
        }

        const names =
            state.teamNames.length === state.teamCount
                ? state.teamNames
                : Array.from({ length: state.teamCount }, (_, i) => `Time ${i + 1}`);

        const alloc = distributePlayersToTeams(selected, names);

        try {
            const created = await adicionarTimes(state.sorteioId, {
                times: names.map((nome) => ({
                    nome,
                    jogadorIds: alloc[nome].map((p) => p.id ?? uid('j')),
                })),
            });

            const teamMapping: Record<string, number> = {};
            created.forEach((t) => {
                teamMapping[t.nome] = t.id;
            });

            updateState({
                teamsAlloc: alloc,
                teamNamesToIds: teamMapping,
                sorteioMatches: [],
                sorteioHome: '',
                sorteioAway: '',
                sorteioHomeGoals: 0,
                sorteioAwayGoals: 0,
                sorteioGerado: true,
            });

            toast.success('Times gerados e salvos com distribuição de destaque e peso');
            
            // Redirecionar para a página pública do sorteio
            setTimeout(() => {
                navigate(`/sorteio/${state.sorteioId}`);
            }, 1000);
        } catch (err) {
            console.error(err);
            toast.error('Falha ao salvar times');
        }
    };

    const addSorteioMatch = async () => {
        const teamIds = Object.keys(state.teamsAlloc);

        if (teamIds.length < 2) {
            toast.error('Gere ao menos dois times para registrar partidas.');
            return;
        }

        if (!state.sorteioHome || !state.sorteioAway || state.sorteioHome === state.sorteioAway) {
            toast.error('Selecione dois times diferentes.');
            return;
        }

        if (!state.sorteioId) {
            toast.error('Sorteio não foi criado.');
            return;
        }

        const homeTeamId = state.teamNamesToIds[state.sorteioHome];
        const awayTeamId = state.teamNamesToIds[state.sorteioAway];

        if (!homeTeamId || !awayTeamId) {
            toast.error('Time não encontrado. Gere o sorteio novamente.');
            return;
        }

        try {
            await registrarResultado({
                timeCasa: homeTeamId,
                golsCasa: state.sorteioHomeGoals,
                golsVisitante: state.sorteioAwayGoals,
                timeVisitante: awayTeamId,
                sorteioId: state.sorteioId,
            });

            setState((prev) => ({
                ...prev,
                sorteioMatches: [
                    ...prev.sorteioMatches,
                    {
                        home: prev.sorteioHome,
                        away: prev.sorteioAway,
                        homeGoals: prev.sorteioHomeGoals,
                        awayGoals: prev.sorteioAwayGoals,
                    },
                ],
                sorteioHome: '',
                sorteioAway: '',
                sorteioHomeGoals: 0,
                sorteioAwayGoals: 0,
            }));

            toast.success('Resultado registrado');
        } catch (err) {
            console.error(err);
            toast.error('Falha ao registrar resultado');
        }
    };

    const clearFormState = () => {
        updateState({
            sorteioGerado: false,
            allJogadores: [],
            paidIds: new Set(),
            teamCount: 0,
            teamNames: [],
            teamsAlloc: {},
            sorteioMatches: [],
            sorteioHome: '',
            sorteioAway: '',
            sorteioHomeGoals: 0,
            sorteioAwayGoals: 0,
            teamNamesToIds: {},
            campNome: '',
            filterText: '',
            sorteioId: null,
            creatingSorteio: false,
        });
    };

    const viewSorteio = () => {
        if (state.sorteioId) {
            navigate(`/sorteio/${state.sorteioId}`);
        }
    };

    return {
        state,
        updateState,
        startSorteio,
        togglePaid,
        updateTeamCount,
        updateTeamName,
        generateTeamsFromPaid,
        addSorteioMatch,
        clearFormState,
        viewSorteio,
    };
}
