import { Button } from '@/components/ui/button';
import type { TimeJogadorDto } from '@/services/sorteio';

export interface TeamsListProps {
    teams: Array<{ id: number; nome: string }>;
    expandedTeamId: number | null;
    expandedTeamJogadores: TimeJogadorDto[];
    loadingTeamJogadores: boolean;
    onExpandTeam: (teamId: number) => void;
}

export function TeamsList({
    teams,
    expandedTeamId,
    expandedTeamJogadores,
    loadingTeamJogadores,
    onExpandTeam,
}: TeamsListProps) {
    return (
        <>
            {teams.length === 0 ? (
                <div className="text-sm text-muted-foreground">Nenhum time encontrado.</div>
            ) : (
                <div className="space-y-2 text-sm">
                    {teams.map((t) => (
                        <div
                            key={t.id}
                            className="flex items-center justify-between p-2 border rounded"
                        >
                            <span>{t.nome}</span>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => onExpandTeam(t.id)}
                                disabled={loadingTeamJogadores && expandedTeamId === t.id}
                            >
                                {expandedTeamId === t.id
                                    ? loadingTeamJogadores
                                        ? 'Carregando...'
                                        : 'Ocultar'
                                    : 'Jogadores'}
                            </Button>
                        </div>
                    ))}
                </div>
            )}

            {expandedTeamId && (
                <div className="mt-4 p-2 bg-gray-50 rounded border">
                    <div className="font-semibold text-sm mb-2">
                        {teams.find((t) => t.id === expandedTeamId)?.nome}
                    </div>
                    {loadingTeamJogadores ? (
                        <div className="text-sm text-muted-foreground">Carregando jogadores...</div>
                    ) : expandedTeamJogadores.length === 0 ? (
                        <div className="text-sm text-muted-foreground">
                            Nenhum jogador encontrado.
                        </div>
                    ) : (
                        <ul className="space-y-2 text-sm">
                            {expandedTeamJogadores.map((j) => (
                                <li key={j.id} className="flex items-center justify-between p-1">
                                    <span>{j.nome}</span>
                                    <span className="text-xs text-muted-foreground">
                                        {(j.posicoes || []).join(', ')}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </>
    );
}
