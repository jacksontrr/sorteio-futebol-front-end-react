import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Player } from '@/models/player';
import { playerBadgeClasses } from '../player/playerColors';

export interface GeneratedTeamsDisplayProps {
    teams: Record<string, Player[]>;
}

type ExtPlayer = Player & { destaque?: boolean; peso?: boolean };

export function GeneratedTeamsDisplay({ teams }: GeneratedTeamsDisplayProps) {
    const isDestaque = (p: Player): boolean => {
        return (p as unknown as ExtPlayer).destaque === true;
    };

    const isPeso = (p: Player): boolean => {
        return (p as unknown as ExtPlayer).peso === true;
    };

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-4">
            {Object.entries(teams).map(([tname, players]) => (
                <Card key={tname}>
                    <CardHeader>
                        <CardTitle>{tname}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {players.length === 0 ? (
                            <div className="text-sm text-muted-foreground">Sem jogadores.</div>
                        ) : (
                            <ul className="space-y-2">
                                {players.map((pl) => (
                                    <li key={String(pl.id)} className="flex items-center gap-2">
                                        <span>{pl.nome}</span>
                                        {isDestaque(pl) && (
                                            <span className={playerBadgeClasses.destaque}>Destaque</span>
                                        )}
                                        {isPeso(pl) && (
                                            <span className={playerBadgeClasses.peso}>Peso</span>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
