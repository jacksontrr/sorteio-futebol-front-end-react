import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Team } from '@/models/team';
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from '@/components/ui/table';
import TeamDialog from '@/components/team/TeamDialog';

type Time = Team & {
    quantidadeJogadores?: number;
};
// Jogador type removed (not used in this view)

function uid(prefix = 'id') {
    return prefix + '_' + Math.random().toString(36).slice(2, 9);
}

export default function TimesView() {
    const [times, setTimes] = React.useState<Time[]>([]);
    // Adicionar 2 jogadores para teste
    React.useEffect(() => {
        setTimes([
            {
                id: uid('time'),
                nome: 'Time A',
                avatar: 'https://www.softjack.com.br/Pg-portfolio/img/perfil.jpg',
                quantidadeJogadores: 2,
                gols: 0,
            },
            {
                id: uid('time'),
                nome: 'Time B',
                quantidadeJogadores: 3,
                gols: 0,
            },
        ]);
    }, []);
    const [selectedTime, setSelectedTime] = React.useState<Time | null>(null);
    const [showTeamModal, setShowTeamModal] = React.useState(false);
    // search state (not wired to backend yet)

    const [loadingTimes] = React.useState(false);

    // small form states
    const [timeNome, setTimeNome] = React.useState('');

    function addTime() {
        console.log('addTime clicked');
        setSelectedTime(null);
        setShowTeamModal(true);
    }

    /* async function loadJogadores(q?: string) {
        try {
            setLoadingJogadores(true);
            const { fetchJogadores } = await import('@/services/auth');
            const res = await fetchJogadores(q ?? undefined);
            setJogadores(Array.isArray(res) ? (res as Jogador[]) : []);
        } catch (err) {
            console.error('Erro ao buscar jogadores:', err);
        } finally {
            setLoadingJogadores(false);
        }
    } */

    return (
        <>
            <div className="grid gap-4">
                <div className="flex flex-col sm:flex-row gap-2">
                    <Input
                        className="flex-1"
                        placeholder="Buscar Times..."
                        value={timeNome}
                        onChange={(e) => setTimeNome(e.target.value)}
                    />
                    <Button onClick={addTime}>Adicionar Time</Button>
                </div>
                <div className="grid gap-2">
                    {loadingTimes ? (
                        <div>Carregando Times...</div>
                    ) : (
                        <div className="p-2">
                            {/* Desktop / wide screens: regular table with horizontal scroll */}
                            <div className="hidden sm:block overflow-x-auto">
                                <Table className="min-w-full">
                                    <TableHeader>
                                        <tr>
                                            <TableHead className="w-16">Imagem</TableHead>
                                            <TableHead>Nome do Time</TableHead>
                                            <TableHead className="text-center">
                                                Quantidade de Jogadores
                                            </TableHead>
                                            <TableHead className="text-center">Ações</TableHead>
                                        </tr>
                                    </TableHeader>
                                    <TableBody>
                                        {times.length === 0 && (
                                            <tr>
                                                <td colSpan={4} className="p-4">
                                                    Nenhum time encontrado.
                                                </td>
                                            </tr>
                                        )}
                                        {times.map((t) => (
                                            <TableRow key={t.id}>
                                                <TableCell>
                                                    {t.avatar ? (
                                                        <img
                                                            src={t.avatar}
                                                            alt={t.nome}
                                                            className="w-10 h-10 object-cover rounded-full"
                                                        />
                                                    ) : (
                                                        <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-500">
                                                            ?
                                                        </div>
                                                    )}
                                                </TableCell>
                                                <TableCell className="whitespace-nowrap">
                                                    {t.nome}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    {t.quantidadeJogadores ?? 0}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <button
                                                        className="text-primary underline"
                                                        onClick={() => {
                                                            setSelectedTime(t);
                                                            setShowTeamModal(true);
                                                        }}
                                                    >
                                                        Ver
                                                    </button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Mobile: stacked cards */}
                            <div className="sm:hidden space-y-3">
                                {times.length === 0 && (
                                    <div className="p-4">Nenhum time encontrado.</div>
                                )}
                                {times.map((t) => (
                                    <div
                                        key={t.id}
                                        className="flex items-center justify-between gap-3 p-3 bg-white rounded-lg shadow-sm"
                                    >
                                        <div className="flex items-center gap-3">
                                            {t.avatar ? (
                                                <img
                                                    src={t.avatar}
                                                    alt={t.nome}
                                                    className="w-12 h-12 object-cover rounded-full"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center text-slate-500">
                                                    ?
                                                </div>
                                            )}
                                            <div>
                                                <div className="font-semibold">{t.nome}</div>
                                                <div className="text-sm text-muted-foreground">
                                                    {(t.quantidadeJogadores ?? 0) + ' jogadores'}
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <button
                                                className="text-primary underline"
                                                onClick={() => {
                                                    setSelectedTime(t);
                                                    setShowTeamModal(true);
                                                }}
                                            >
                                                Ver
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <TeamDialog
                open={showTeamModal}
                onOpenChange={(val) => setShowTeamModal(val)}
                selected={selectedTime}
                onSave={(team) => {
                    setTimes((s) => {
                        const exists = s.find((t) => t.id === team.id);
                        if (exists) return s.map((t) => (t.id === team.id ? team : t));
                        return [...s, team];
                    });
                }}
            />
        </>
    );
}
