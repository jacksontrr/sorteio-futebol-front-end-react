import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from '@/components/ui/table';
import { toast } from 'sonner';
import { isAuthenticated } from '@/services/auth';
import {
    fetchSorteioTimes,
    fetchPartidasBySorteio,
    fetchTimeJogadores,
    registrarResultado,
    type SorteioTimeDto,
    type PartidaDto,
    type TimeJogadorDto,
} from '@/services/sorteio';
import { ArrowLeft, Users } from 'lucide-react';
import { computeStandings, type MatchRow } from '@/lib/standings';
import { getPlayerBackgroundClass, playerBadgeClasses } from '@/components/player/playerColors';

export default function SorteioPublicView() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [times, setTimes] = React.useState<SorteioTimeDto[]>([]);
    const [partidas, setPartidas] = React.useState<PartidaDto[]>([]);
    const [expandedTeam, setExpandedTeam] = React.useState<number | null>(null);
    const [teamJogadores, setTeamJogadores] = React.useState<Record<number, TimeJogadorDto[]>>({});
    const [loading, setLoading] = React.useState(true);
    const authenticated = isAuthenticated();

    // Estados para edição de partida (só para autenticados)
    const [editingMatch, setEditingMatch] = React.useState<{
        timeCasa: number;
        timeVisitante: number;
        golsCasa: number;
        golsVisitante: number;
    } | null>(null);

    const sorteioId = React.useMemo(() => {
        const parsed = parseInt(id ?? '', 10);
        return isNaN(parsed) ? null : parsed;
    }, [id]);

    React.useEffect(() => {
        if (!sorteioId) {
            toast.error('ID de sorteio inválido');
            return;
        }
        loadSorteioData();
    }, [sorteioId]);

    const loadSorteioData = async () => {
        if (!sorteioId) return;

        try {
            setLoading(true);
            const [timesData, partidasData] = await Promise.all([
                fetchSorteioTimes(sorteioId),
                fetchPartidasBySorteio(sorteioId),
            ]);
            setTimes(timesData);
            setPartidas(partidasData);
        } catch (err) {
            console.error(err);
            toast.error('Erro ao carregar dados do sorteio');
        } finally {
            setLoading(false);
        }
    };

    const handleExpandTeam = async (timeId: number) => {
        if (!sorteioId) return;

        if (expandedTeam === timeId) {
            setExpandedTeam(null);
            return;
        }

        if (teamJogadores[timeId]) {
            setExpandedTeam(timeId);
            return;
        }

        try {
            const jogadores = await fetchTimeJogadores(sorteioId, timeId);
            setTeamJogadores((prev) => ({ ...prev, [timeId]: jogadores }));
            setExpandedTeam(timeId);
        } catch (err) {
            console.error(err);
            toast.error('Erro ao carregar jogadores do time');
        }
    };

    const handleAddMatch = async () => {
        if (!authenticated || !sorteioId || !editingMatch) {
            toast.error('Preencha todos os campos');
            return;
        }

        if (editingMatch.timeCasa === editingMatch.timeVisitante) {
            toast.error('Selecione dois times diferentes');
            return;
        }

        try {
            await registrarResultado({
                sorteioId,
                timeCasa: editingMatch.timeCasa,
                timeVisitante: editingMatch.timeVisitante,
                golsCasa: editingMatch.golsCasa,
                golsVisitante: editingMatch.golsVisitante,
            });

            toast.success('Resultado registrado com sucesso');
            setEditingMatch(null);
            await loadSorteioData();
        } catch (err) {
            console.error(err);
            toast.error('Erro ao registrar resultado');
        }
    };

    const getTeamName = (timeId: number) => {
        return times.find((t) => t.id === timeId)?.nome ?? `Time ${timeId}`;
    };

    const standings = React.useMemo(() => {
        if (times.length === 0) return [];
        
        const matches: MatchRow[] = partidas.map((p) => ({
            home: String(p.timeCasaId),
            away: String(p.timeVisitanteId),
            homeGoals: p.golsCasa,
            awayGoals: p.golsVisitante,
        }));

        return computeStandings(
            times.map((t) => String(t.id)),
            matches
        );
    }, [times, partidas]);

    const playerTone = (jogador: TimeJogadorDto) =>
        getPlayerBackgroundClass({
            destaque: jogador.destaque,
            peso: jogador.peso,
            ativo: jogador.ativo ?? true,
            baseWhenNeutral: '',
        });

    if (loading) {
        return (
            <div className="container mx-auto p-4">
                <Card>
                    <CardContent className="p-6">
                        <p className="text-center">Carregando...</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 space-y-4">
            {/* Cabeçalho */}
            <div className="flex items-center gap-4">
                <Button variant="outline" onClick={() => navigate(-1)}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Voltar
                </Button>
                <h1 className="text-2xl font-bold">Sorteio #{sorteioId}</h1>
                {authenticated && (
                    <span className="text-sm text-green-600 font-medium">
                        (Modo Organizador)
                    </span>
                )}
            </div>

            {/* Times Sorteados */}
            <Card>
                <CardHeader>
                    <CardTitle>Times Sorteados</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {times.length === 0 ? (
                        <p className="text-muted-foreground">Nenhum time sorteado ainda</p>
                    ) : (
                        times.map((time) => (
                            <div key={time.id} className="border rounded-lg p-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Users className="h-5 w-5" />
                                        <span className="font-semibold">{time.nome}</span>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleExpandTeam(time.id)}
                                    >
                                        {expandedTeam === time.id
                                            ? 'Ocultar Jogadores'
                                            : 'Ver Jogadores'}
                                    </Button>
                                </div>

                                {expandedTeam === time.id && teamJogadores[time.id] && (
                                    <div className="mt-3 pl-7">
                                        <p className="text-sm font-medium mb-2">Jogadores:</p>
                                        <ul className="space-y-1">
                                            {teamJogadores[time.id].map((jogador) => (
                                                <li
                                                    key={jogador.id}
                                                    className={`text-sm text-muted-foreground rounded-md px-2 py-1 ${playerTone(jogador)}`}
                                                >
                                                    <span className="font-medium text-foreground mr-2">
                                                        {jogador.nome}
                                                    </span>
                                                    {jogador.posicoes.length > 0 && (
                                                        <span className="text-xs text-muted-foreground">
                                                            ({jogador.posicoes.join(', ')})
                                                        </span>
                                                    )}
                                                    <span className="ml-2 inline-flex gap-1 align-middle">
                                                        {jogador.destaque && (
                                                            <span className={playerBadgeClasses.destaque}>
                                                                Destaque
                                                            </span>
                                                        )}
                                                        {jogador.peso && (
                                                            <span className={playerBadgeClasses.peso}>Peso</span>
                                                        )}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </CardContent>
            </Card>

            {/* Partidas */}
            <Card>
                <CardHeader>
                    <CardTitle>Partidas</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Time Casa</TableHead>
                                <TableHead className="text-center">Placar</TableHead>
                                <TableHead>Time Visitante</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {partidas.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center text-muted-foreground">
                                        Nenhuma partida registrada
                                    </TableCell>
                                </TableRow>
                            ) : (
                                partidas.map((partida) => (
                                    <TableRow key={partida.id}>
                                        <TableCell>{getTeamName(partida.timeCasaId)}</TableCell>
                                        <TableCell className="text-center font-bold">
                                            {partida.golsCasa} x {partida.golsVisitante}
                                        </TableCell>
                                        <TableCell>{getTeamName(partida.timeVisitanteId)}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>

                    {/* Formulário para adicionar partida - Só para autenticados */}
                    {authenticated && times.length >= 2 && (
                            <div className="mt-6 border-t pt-6">
                                <h3 className="font-semibold mb-4">Registrar Nova Partida</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Time Casa</label>
                                        <select
                                            className="w-full px-3 py-2 border rounded-md"
                                            value={editingMatch?.timeCasa ?? ''}
                                            onChange={(e) =>
                                                setEditingMatch((prev) => ({
                                                    timeCasa: Number(e.target.value),
                                                    timeVisitante: prev?.timeVisitante ?? 0,
                                                    golsCasa: prev?.golsCasa ?? 0,
                                                    golsVisitante: prev?.golsVisitante ?? 0,
                                                }))
                                            }
                                        >
                                            <option value="">Selecione o time</option>
                                            {times.map((time) => (
                                                <option
                                                    key={time.id}
                                                    value={time.id}
                                                    disabled={editingMatch?.timeVisitante === time.id}
                                                >
                                                    {time.nome}
                                                </option>
                                            ))}
                                        </select>
                                        <Input
                                            type="number"
                                            min="0"
                                            placeholder="Gols"
                                            value={editingMatch?.golsCasa ?? 0}
                                            onChange={(e) =>
                                                setEditingMatch((prev) => ({
                                                    timeCasa: prev?.timeCasa ?? 0,
                                                    timeVisitante: prev?.timeVisitante ?? 0,
                                                    golsCasa: Number(e.target.value),
                                                    golsVisitante: prev?.golsVisitante ?? 0,
                                                }))
                                            }
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Time Visitante</label>
                                        <select
                                            className="w-full px-3 py-2 border rounded-md"
                                            value={editingMatch?.timeVisitante ?? ''}
                                            onChange={(e) =>
                                                setEditingMatch((prev) => ({
                                                    timeCasa: prev?.timeCasa ?? 0,
                                                    timeVisitante: Number(e.target.value),
                                                    golsCasa: prev?.golsCasa ?? 0,
                                                    golsVisitante: prev?.golsVisitante ?? 0,
                                                }))
                                            }
                                        >
                                            <option value="">Selecione o time</option>
                                            {times.map((time) => (
                                                <option
                                                    key={time.id}
                                                    value={time.id}
                                                    disabled={editingMatch?.timeCasa === time.id}
                                                >
                                                    {time.nome}
                                                </option>
                                            ))}
                                        </select>
                                        <Input
                                            type="number"
                                            min="0"
                                            placeholder="Gols"
                                            value={editingMatch?.golsVisitante ?? 0}
                                            onChange={(e) =>
                                                setEditingMatch((prev) => ({
                                                    timeCasa: prev?.timeCasa ?? 0,
                                                    timeVisitante: prev?.timeVisitante ?? 0,
                                                    golsCasa: prev?.golsCasa ?? 0,
                                                    golsVisitante: Number(e.target.value),
                                                }))
                                            }
                                        />
                                    </div>
                                </div>
                                <Button onClick={handleAddMatch} className="mt-4">
                                    Registrar Partida
                                </Button>
                            </div>
                        )}
                </CardContent>
            </Card>

            {/* Classificação / Pontos Corridos */}
            {partidas.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Classificação</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-12">#</TableHead>
                                    <TableHead>Time</TableHead>
                                    <TableHead className="text-center">P</TableHead>
                                    <TableHead className="text-center">J</TableHead>
                                    <TableHead className="text-center">V</TableHead>
                                    <TableHead className="text-center">E</TableHead>
                                    <TableHead className="text-center">D</TableHead>
                                    <TableHead className="text-center">GM</TableHead>
                                    <TableHead className="text-center">GC</TableHead>
                                    <TableHead className="text-center">SG</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {standings.map((standing, idx) => {
                                    const pontos = standing.v * 3 + standing.e;
                                    const saldoGols = standing.gm - standing.gc;
                                    return (
                                        <TableRow key={standing.id}>
                                            <TableCell className="font-medium">{idx + 1}</TableCell>
                                            <TableCell>{getTeamName(Number(standing.id))}</TableCell>
                                            <TableCell className="text-center font-bold">{pontos}</TableCell>
                                            <TableCell className="text-center">{standing.jogos}</TableCell>
                                            <TableCell className="text-center">{standing.v}</TableCell>
                                            <TableCell className="text-center">{standing.e}</TableCell>
                                            <TableCell className="text-center">{standing.d}</TableCell>
                                            <TableCell className="text-center">{standing.gm}</TableCell>
                                            <TableCell className="text-center">{standing.gc}</TableCell>
                                            <TableCell className={`text-center ${saldoGols > 0 ? 'text-green-600' : saldoGols < 0 ? 'text-red-600' : ''}`}>
                                                {saldoGols > 0 ? '+' : ''}{saldoGols}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
