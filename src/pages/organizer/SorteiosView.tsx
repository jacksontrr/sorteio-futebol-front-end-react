import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Campeonato } from '@/models/campeonato';
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from '@/components/ui/table';
import React from 'react';
import { toast } from 'sonner';
import { computeStandings, type MatchRow, type StandingRow } from '@/lib/standings';
import { SorteiosList } from '@/components/organizer/SorteiosList';
import { SorteioCreationSection } from '@/components/organizer/SorteioCreationSection';
import { SorteioDetailSection } from '@/components/organizer/SorteioDetailSection';
import { useSorteio } from '@/hooks/useSorteio';
import { useDetalheSorteio } from '@/hooks/useDetalheSorteio';
import { useSorteiosList } from '@/hooks/useSorteiosList';
import { buildRoundsFromInitial, advanceWinner } from '@/lib/bracketLogic';
import { Bracket } from '@/components/organizer/Bracket';
import type { Time } from '@/models/sorteio';

export default function SorteiosView() {
    const [campeonatos] = React.useState<Campeonato[]>([]);
    const [matchesByCamp, setMatchesByCamp] = React.useState<Record<string, MatchRow[]>>({});
    const [bracketsByCamp, setBracketsByCamp] = React.useState<Record<string, string[][][]>>({});

    const sorteioHook = useSorteio();
    const detalheHook = useDetalheSorteio();
    const { sorteios, loadingSorteios, carregarSorteios } = useSorteiosList();

    const handleStartSorteio = async () => {
        await sorteioHook.startSorteio();
    };

    const handleGenerateTeams = async () => {
        await sorteioHook.generateTeamsFromPaid();
    };

    const handleAddSorteioMatch = async () => {
        await sorteioHook.addSorteioMatch();
    };

    const handleResetSorteio = () => {
        sorteioHook.clearFormState();
    };

    const handleReloadSorteios = async () => {
        await carregarSorteios();
    };

    const handleViewDetails = (id: number) => {
        detalheHook.viewDetails(id);
    };

    const handleAddDetalheMatch = async () => {
        await detalheHook.addDetalheMatch();
    };

    const handleExpandTeam = async (timeId: number) => {
        await detalheHook.handleExpandTeam(timeId);
    };

    const times: Time[] = [];

    const handleSetWinner = (
        campId: string,
        roundIdx: number,
        matchIdx: number,
        winnerId: string,
    ) => {
        setBracketsByCamp((prev) => {
            const next = { ...prev } as Record<string, string[][][]>;

            const existing = prev[campId];
            const rounds = existing
                ? existing.map((r) => r.map((p) => [p[0], p[1]]))
                : buildRoundsFromInitial(campeonatos.find((x) => x.id === campId)?.chave ?? []);

            const updatedRounds = advanceWinner(rounds, roundIdx, matchIdx, winnerId);
            next[campId] = updatedRounds;
            return next;
        });
    };

    const ResultForm: React.FC<{
        camp: Campeonato;
        times: Time[];
        onAddResult: (m: MatchRow) => void;
    }> = ({ camp, times, onAddResult }) => {
        const [home, setHome] = React.useState<string>('');
        const [away, setAway] = React.useState<string>('');
        const [homeGoals, setHomeGoals] = React.useState<number>(0);
        const [awayGoals, setAwayGoals] = React.useState<number>(0);

        const handleAdd = () => {
            if (!home || !away || home === away) {
                toast.error('Escolha dois times diferentes!');
                return;
            }
            onAddResult({ home, away, homeGoals, awayGoals });
            setHomeGoals(0);
            setAwayGoals(0);
        };

        return (
            <div className="flex flex-col gap-2 items-center">
                <select
                    value={home}
                    onChange={(e) => setHome(e.target.value)}
                    className="px-2 py-1 border rounded"
                >
                    <option value="">Selecione o time</option>
                    {camp.times.map((id) => (
                        <option key={id} value={id} disabled={id === away}>
                            {times.find((t) => t.id === id)?.nome ?? id}
                        </option>
                    ))}
                </select>
                <Input
                    type="number"
                    value={homeGoals}
                    onChange={(e) => setHomeGoals(Number(e.target.value))}
                    className="w-16"
                />
                <span>vs</span>
                <Input
                    type="number"
                    value={awayGoals}
                    onChange={(e) => setAwayGoals(Number(e.target.value))}
                    className="w-16"
                />
                <select
                    value={away}
                    onChange={(e) => setAway(e.target.value)}
                    className="px-2 py-1 border rounded"
                >
                    <option value="">Selecione o time</option>
                    {camp.times.map((id) => (
                        <option key={id} value={id} disabled={id === home}>
                            {times.find((t) => t.id === id)?.nome ?? id}
                        </option>
                    ))}
                </select>
                <Button onClick={handleAdd}>Adicionar resultado</Button>
            </div>
        );
    };

    return (
        <div className="grid gap-4">
            {/* Cabeçalho de criação */}
            <div className="flex flex-col sm:flex-row gap-2">
                <Input
                    className="flex-1"
                    placeholder="Nome do sorteio (opcional)"
                    value={sorteioHook.state.campNome}
                    onChange={(e) => sorteioHook.updateState({ campNome: e.target.value })}
                />
                <Button onClick={handleStartSorteio} disabled={sorteioHook.state.loadingSorteio}>
                    {sorteioHook.state.loadingSorteio ? 'Criando...' : 'Criar Sorteio'}
                </Button>
            </div>

            {/* Seção de criação de sorteio */}
            <SorteioCreationSection
                state={sorteioHook.state}
                onTogglePaid={sorteioHook.togglePaid}
                onFilterChange={(text) => sorteioHook.updateState({ filterText: text })}
                onTeamCountChange={sorteioHook.updateTeamCount}
                onTeamNameChange={sorteioHook.updateTeamName}
                onGenerateTeams={handleGenerateTeams}
                onHomeTeamChange={(v) => sorteioHook.updateState({ sorteioHome: v })}
                onAwayTeamChange={(v) => sorteioHook.updateState({ sorteioAway: v })}
                onHomeGoalsChange={(v) => sorteioHook.updateState({ sorteioHomeGoals: v })}
                onAwayGoalsChange={(v) => sorteioHook.updateState({ sorteioAwayGoals: v })}
                onAddMatch={handleAddSorteioMatch}
                onReset={handleResetSorteio}
            />

            {!sorteioHook.state.creatingSorteio && (
                <>
                    {/* Lista de sorteios */}
                    <SorteiosList
                        sorteios={sorteios}
                        loading={loadingSorteios}
                        onReload={handleReloadSorteios}
                        onViewDetails={handleViewDetails}
                        detalheSorteioId={detalheHook.state.detalheSorteioId}
                        detalheLoading={false}
                    />

                    {/* Seção de detalhes do sorteio */}
                    <SorteioDetailSection
                        detalheSorteioId={detalheHook.state.detalheSorteioId}
                        sorteios={sorteios}
                        state={detalheHook.state}
                        onHomeTeamChange={(v) => detalheHook.updateState({ detalheHome: v })}
                        onAwayTeamChange={(v) => detalheHook.updateState({ detalheAway: v })}
                        onHomeGoalsChange={(v) => detalheHook.updateState({ detalheHomeGoals: v })}
                        onAwayGoalsChange={(v) => detalheHook.updateState({ detalheAwayGoals: v })}
                        onAddMatch={handleAddDetalheMatch}
                        onExpandTeam={handleExpandTeam}
                    />
                </>
            )}
        </div>
    );
}
