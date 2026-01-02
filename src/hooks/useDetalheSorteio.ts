import React from 'react';
import { toast } from 'sonner';
import { registrarResultado, fetchTimeJogadores } from '@/services/sorteio';
import type { SorteioDetailState } from '@/models/sorteio';

export function useDetalheSorteio() {
    const [state, setState] = React.useState<SorteioDetailState>({
        detalheSorteioId: null,
        detalheHome: null,
        detalheAway: null,
        detalheHomeGoals: 0,
        detalheAwayGoals: 0,
        expandedTeamId: null,
        expandedTeamJogadores: [],
        loadingTeamJogadores: false,
    });

    const updateState = (updates: Partial<SorteioDetailState>) => {
        setState((prev) => ({ ...prev, ...updates }));
    };

    const addDetalheMatch = async () => {
        if (!state.detalheHome || !state.detalheAway || state.detalheHome === state.detalheAway) {
            toast.error('Selecione dois times diferentes.');
            return;
        }

        if (!state.detalheSorteioId) {
            toast.error('Sorteio não encontrado.');
            return;
        }

        try {
            await registrarResultado({
                timeCasa: state.detalheHome,
                golsCasa: state.detalheHomeGoals,
                golsVisitante: state.detalheAwayGoals,
                timeVisitante: state.detalheAway,
                sorteioId: state.detalheSorteioId,
            });

            toast.success('Resultado registrado');

            const id = state.detalheSorteioId;
            updateState({
                detalheHome: null,
                detalheAway: null,
                detalheHomeGoals: 0,
                detalheAwayGoals: 0,
            });

            // Trigger refresh by resetting and setting the id again
            updateState({ detalheSorteioId: null });
            setTimeout(() => updateState({ detalheSorteioId: id }), 100);
        } catch (err) {
            console.error(err);
            toast.error('Falha ao registrar resultado');
        }
    };

    const loadTeamJogadores = async (timeId: number) => {
        if (!state.detalheSorteioId) return;

        try {
            updateState({ loadingTeamJogadores: true });
            const jogadores = await fetchTimeJogadores(state.detalheSorteioId, timeId);
            updateState({ expandedTeamJogadores: jogadores });
        } catch (err) {
            console.error(err);
            toast.error('Falha ao carregar jogadores');
        } finally {
            updateState({ loadingTeamJogadores: false });
        }
    };

    const handleExpandTeam = async (timeId: number) => {
        if (state.expandedTeamId === timeId) {
            updateState({
                expandedTeamId: null,
                expandedTeamJogadores: [],
            });
        } else {
            updateState({ expandedTeamId: timeId });
            await loadTeamJogadores(timeId);
        }
    };

    const viewDetails = (id: number) => {
        updateState({ detalheSorteioId: id });
    };

    const resetDetails = () => {
        updateState({
            detalheSorteioId: null,
            detalheHome: null,
            detalheAway: null,
            detalheHomeGoals: 0,
            detalheAwayGoals: 0,
            expandedTeamId: null,
            expandedTeamJogadores: [],
        });
    };

    return {
        state,
        updateState,
        addDetalheMatch,
        loadTeamJogadores,
        handleExpandTeam,
        viewDetails,
        resetDetails,
    };
}
