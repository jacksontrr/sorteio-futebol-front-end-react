import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MatchRegistrationForm } from './MatchRegistrationForm';
import { StandingsTable } from './StandingsTable';
import { TeamsList } from './TeamsList';
import { computeStandings } from '@/lib/standings';
import { useSorteioDetalhes } from '@/hooks/useSorteioDetalhes';
import type { SorteioResumo } from '@/services/sorteio';
import type { SorteioDetailState } from '@/models/sorteio';

interface SorteioDetailSectionProps {
    detalheSorteioId: number | null;
    sorteios: SorteioResumo[];
    state: SorteioDetailState;
    onHomeTeamChange: (teamId: number | null) => void;
    onAwayTeamChange: (teamId: number | null) => void;
    onHomeGoalsChange: (goals: number) => void;
    onAwayGoalsChange: (goals: number) => void;
    onAddMatch: () => void;
    onExpandTeam: (teamId: number) => void;
}

export function SorteioDetailSection({
    detalheSorteioId,
    sorteios,
    state,
    onHomeTeamChange,
    onAwayTeamChange,
    onHomeGoalsChange,
    onAwayGoalsChange,
    onAddMatch,
    onExpandTeam,
}: SorteioDetailSectionProps) {
    const { times: detalheTimes, partidas: detalhePartidas } = useSorteioDetalhes(detalheSorteioId);

    if (!detalheSorteioId) {
        return null;
    }

    const sorteioInfo = sorteios.find((x) => x.id === detalheSorteioId);
    const date = sorteioInfo?.createdAt
        ? new Date(sorteioInfo.createdAt).toLocaleDateString('pt-BR')
        : '';
    const namePart = sorteioInfo?.nome ? `: ${sorteioInfo.nome}` : '';
    const datePart = date ? ` · ${date}` : '';
    const title = `Detalhes do sorteio${namePart}${datePart} · ID #${detalheSorteioId}`;

    return (
        <div className="p-2">
            <div className="mb-2 font-semibold">{title}</div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Times sorteados</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <TeamsList
                            teams={detalheTimes}
                            expandedTeamId={state.expandedTeamId}
                            expandedTeamJogadores={state.expandedTeamJogadores}
                            loadingTeamJogadores={state.loadingTeamJogadores}
                            onExpandTeam={onExpandTeam}
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Placar / Partidas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {detalhePartidas.length === 0 ? (
                            <div className="text-sm text-muted-foreground">
                                Nenhuma partida registrada.
                            </div>
                        ) : (
                            <ul className="space-y-2 text-sm">
                                {detalhePartidas.map((p) => {
                                    const home =
                                        detalheTimes.find((t) => t.id === p.timeCasaId)?.nome ??
                                        p.timeCasaId;
                                    const away =
                                        detalheTimes.find((t) => t.id === p.timeVisitanteId)
                                            ?.nome ?? p.timeVisitanteId;
                                    return (
                                        <li key={p.id} className="flex justify-between">
                                            <span>
                                                {home} x {away}
                                            </span>
                                            <span>
                                                {p.golsCasa} - {p.golsVisitante}
                                            </span>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </CardContent>
                </Card>
            </div>

            <div className="mt-4">
                <div className="mb-2 font-semibold">Registrar Nova Partida</div>
                <MatchRegistrationForm
                    teams={detalheTimes.map((t) => ({ id: t.id, nome: t.nome }))}
                    homeTeamId={state.detalheHome}
                    awayTeamId={state.detalheAway}
                    homeGoals={state.detalheHomeGoals}
                    awayGoals={state.detalheAwayGoals}
                    onHomeTeamChange={(v) => onHomeTeamChange(v != null ? Number(v) : null)}
                    onAwayTeamChange={(v) => onAwayTeamChange(v != null ? Number(v) : null)}
                    onHomeGoalsChange={onHomeGoalsChange}
                    onAwayGoalsChange={onAwayGoalsChange}
                    onSubmit={onAddMatch}
                    isLoading={false}
                />
            </div>

            <div className="mt-4">
                <div className="mb-2 font-semibold">Tabela de Pontos Corridos</div>
                <div className="overflow-auto">
                    <StandingsTable
                        standings={(() => {
                            const timeIds = detalheTimes.map((t) => String(t.id));
                            const partidas = detalhePartidas.map((p) => ({
                                home: String(p.timeCasaId),
                                away: String(p.timeVisitanteId),
                                homeGoals: p.golsCasa,
                                awayGoals: p.golsVisitante,
                            }));
                            return computeStandings(timeIds, partidas);
                        })()}
                        teamNameMap={Object.fromEntries(
                            detalheTimes.map((t) => [String(t.id), t.nome]),
                        )}
                    />
                </div>
            </div>
        </div>
    );
}
