import React from 'react';
import { Button } from '@/components/ui/button';
import { PlayerSelectionPanel } from './PlayerSelectionPanel';
import { TeamConfigPanel } from './TeamConfigPanel';
import { GeneratedTeamsDisplay } from './GeneratedTeamsDisplay';
import { MatchRegistrationForm } from './MatchRegistrationForm';
import { StandingsTable } from './StandingsTable';
import { computeStandings } from '@/lib/standings';
import type { SorteioCreationState } from '@/models/sorteio';

interface SorteioCreationSectionProps {
    state: SorteioCreationState;
    onTogglePaid: (id: string) => void;
    onFilterChange: (text: string) => void;
    onTeamCountChange: (count: number) => void;
    onTeamNameChange: (index: number, name: string) => void;
    onGenerateTeams: () => void;
    onHomeTeamChange: (teamId: string) => void;
    onAwayTeamChange: (teamId: string) => void;
    onHomeGoalsChange: (goals: number) => void;
    onAwayGoalsChange: (goals: number) => void;
    onAddMatch: () => void;
    onReset: () => void;
}

export function SorteioCreationSection({
    state,
    onTogglePaid,
    onFilterChange,
    onTeamCountChange,
    onTeamNameChange,
    onGenerateTeams,
    onHomeTeamChange,
    onAwayTeamChange,
    onHomeGoalsChange,
    onAwayGoalsChange,
    onAddMatch,
    onReset,
}: SorteioCreationSectionProps) {
    const teamsAllocIds = React.useMemo(() => Object.keys(state.teamsAlloc), [state.teamsAlloc]);

    const sorteioStandings = React.useMemo(
        () => computeStandings(teamsAllocIds, state.sorteioMatches),
        [teamsAllocIds, state.sorteioMatches],
    );

    if (!state.creatingSorteio) {
        return null;
    }

    return (
        <div className="grid gap-4">
            <div className="p-2">
                <div className="mb-2 font-semibold">Jogadores</div>
                <PlayerSelectionPanel
                    players={state.allJogadores}
                    paidIds={state.paidIds}
                    filterText={state.filterText}
                    onTogglePaid={onTogglePaid}
                    onFilterChange={onFilterChange}
                />
            </div>

            <TeamConfigPanel
                teamCount={state.teamCount}
                teamNames={state.teamNames}
                onTeamCountChange={onTeamCountChange}
                onTeamNameChange={onTeamNameChange}
                onGenerate={onGenerateTeams}
            />

            {state.sorteioGerado && Object.keys(state.teamsAlloc).length > 0 && (
                <div className="p-2">
                    <div className="mb-4 flex justify-between items-center">
                        <div className="font-semibold text-lg">
                            Sorteio Gerado:{' '}
                            {state.campNome || new Date().toLocaleDateString('pt-BR')}
                        </div>
                        <Button variant="outline" onClick={onReset}>
                            Novo Sorteio
                        </Button>
                    </div>

                    <div className="mb-2 font-semibold">Times Sorteados</div>
                    <GeneratedTeamsDisplay teams={state.teamsAlloc} />

                    <div className="mb-2 font-semibold mt-6">Registrar Nova Partida</div>
                    <MatchRegistrationForm
                        teams={teamsAllocIds.map((id) => ({ id, nome: id }))}
                        homeTeamId={state.sorteioHome}
                        awayTeamId={state.sorteioAway}
                        homeGoals={state.sorteioHomeGoals}
                        awayGoals={state.sorteioAwayGoals}
                        onHomeTeamChange={(v) => onHomeTeamChange(v as string)}
                        onAwayTeamChange={(v) => onAwayTeamChange(v as string)}
                        onHomeGoalsChange={onHomeGoalsChange}
                        onAwayGoalsChange={onAwayGoalsChange}
                        onSubmit={onAddMatch}
                        isLoading={false}
                    />

                    <div className="overflow-auto">
                        <StandingsTable standings={sorteioStandings} />
                    </div>
                </div>
            )}
        </div>
    );
}
