import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from '@/components/ui/table';
import type { Player } from '@/models/player';

export interface PlayerSelectionPanelProps {
    players: Player[];
    paidIds: Set<string>;
    filterText: string;
    onTogglePaid: (id: string) => void;
    onFilterChange: (text: string) => void;
}

type ExtPlayer = Player & { destaque?: boolean; peso?: boolean };

export function PlayerSelectionPanel({
    players,
    paidIds,
    filterText,
    onTogglePaid,
    onFilterChange,
}: PlayerSelectionPanelProps) {
    const isDestaque = (p: Player): boolean => {
        return (p as unknown as ExtPlayer).destaque === true;
    };

    const isPeso = (p: Player): boolean => {
        return (p as unknown as ExtPlayer).peso === true;
    };

    const filtered = players.filter((p) => {
        const text = filterText.toLowerCase();
        if (!text) return true;
        return p.nome.toLowerCase().includes(text);
    });

    const paid = filtered.filter((p) => paidIds.has(String(p.id)));
    const unpaid = filtered.filter((p) => !paidIds.has(String(p.id)));

    return (
        <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
                <div className="font-semibold text-sm">Disponíveis ({unpaid.length})</div>
                <Input
                    placeholder="Filtrar por nome..."
                    value={filterText}
                    onChange={(e) => onFilterChange(e.target.value)}
                />
                <div className="overflow-auto max-h-96 rounded border bg-white shadow-sm">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nome</TableHead>
                                <TableHead>Posições</TableHead>
                                <TableHead>Destaque</TableHead>
                                <TableHead>Peso</TableHead>
                                <TableHead>Ação</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {unpaid.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5}>
                                        <div className="text-sm text-muted-foreground text-center py-4">
                                            Nenhum jogador disponível
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                            {unpaid.map((p) => {
                                const positions =
                                    (p as unknown as { posicoes?: string[] }).posicoes || [];
                                return (
                                    <TableRow key={String(p.id)}>
                                        <TableCell>{p.nome}</TableCell>
                                        <TableCell>{positions.join(', ')}</TableCell>
                                        <TableCell>{isDestaque(p) ? 'Sim' : 'Não'}</TableCell>
                                        <TableCell>{isPeso(p) ? 'Sim' : 'Não'}</TableCell>
                                        <TableCell>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => onTogglePaid(String(p.id))}
                                            >
                                                Incluir
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <div className="font-semibold text-sm">Selecionados ({paid.length})</div>
                <div className="overflow-auto max-h-96 rounded border bg-white shadow-sm">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nome</TableHead>
                                <TableHead>Posições</TableHead>
                                <TableHead>Destaque</TableHead>
                                <TableHead>Peso</TableHead>
                                <TableHead>Ação</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paid.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5}>
                                        <div className="text-sm text-muted-foreground text-center py-4">
                                            Nenhum jogador selecionado
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                            {paid.map((p) => {
                                const positions =
                                    (p as unknown as { posicoes?: string[] }).posicoes || [];
                                return (
                                    <TableRow key={String(p.id)}>
                                        <TableCell>{p.nome}</TableCell>
                                        <TableCell>{positions.join(', ')}</TableCell>
                                        <TableCell>{isDestaque(p) ? 'Sim' : 'Não'}</TableCell>
                                        <TableCell>{isPeso(p) ? 'Sim' : 'Não'}</TableCell>
                                        <TableCell>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => onTogglePaid(String(p.id))}
                                            >
                                                Remover
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
