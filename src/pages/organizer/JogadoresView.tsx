import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import PlayerDialog from '@/components/player/PlayerDialog';
import Player from '@/components/player/Player';
import { getPlayerBackgroundClass } from '@/components/player/playerColors';
import type { PlayerFormData } from '@/models/player';
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from '@/components/ui/table';
import type { Team } from '@/models/team';
import { fetchJogadores, postJogador, putJogador, toggleJogadorAtivo } from '@/services/jogador';
import { Switch } from '@/components/ui/switch';

type Time = Team & {
    quantidadeJogadores?: number;
};

type Jogador = {
    id: string;
    nome: string;
    posicoes?: string[];
    observacoes?: string;
    destaque?: boolean;
    peso?: boolean;
    ativo: boolean;
};

function uid(prefix = 'id') {
    return prefix + '_' + Math.random().toString(36).slice(2, 9);
}

export default function JogadoresView() {
    const [jogadores, setJogadores] = React.useState<Jogador[]>([]);
    const [times] = React.useState<Time[]>([]);
    const [selectedJogador, setSelectedJogador] = React.useState<Jogador | null>(null);
    const [showPlayerModal, setShowPlayerModal] = React.useState(false);

    const [search, setSearch] = React.useState('');
    const [loadingJogadores, setLoadingJogadores] = React.useState(false);
    const [togglingId, setTogglingId] = React.useState<string | null>(null);

    const rowTone = (j: Jogador) =>
        getPlayerBackgroundClass({ destaque: j.destaque, peso: j.peso, ativo: j.ativo });

    const cardTone = (j: Jogador) =>
        getPlayerBackgroundClass({
            destaque: j.destaque,
            peso: j.peso,
            ativo: j.ativo,
            baseWhenNeutral: 'bg-white',
        });

    function addJogador() {
        setSelectedJogador(null);
        setShowPlayerModal(true);
    }

    async function loadJogadores(q?: string, includeInactive = true) {
        try {
            setLoadingJogadores(true);
            const res = await fetchJogadores(q ?? undefined, includeInactive);
            const normalized = Array.isArray(res)
                ? res.map((item) => ({
                      id: String(item.id ?? uid('jog')),
                      nome: item.nome,
                      posicoes: item.posicoes ?? [],
                      observacoes: item.observacoes,
                      destaque: item.destaque,
                      peso: item.peso,
                      ativo: item.ativo ?? true,
                  }))
                : [];

            setJogadores(normalized);
        } catch (err) {
            console.error('Erro ao buscar jogadores:', err);
        } finally {
            setLoadingJogadores(false);
        }
    }

    const loadingRef = React.useRef(false);

    const load = async () => {
        if (loadingRef.current) return;

        loadingRef.current = true;
        await loadJogadores(undefined);
    };

    React.useEffect(() => {
        load();
    }, []);

    return (
        <>
            <div className="grid gap-4">
                <div>
                    <div className="mb-3">
                        <div className="flex gap-2">
                            <div className="flex-1 relative">
                                <Input
                                    id="search-jogador"
                                    className="pr-10"
                                    placeholder="Buscar jogadores..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            loadJogadores(search);
                                        }
                                    }}
                                />
                                <button
                                    aria-label="Pesquisar"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-600"
                                    onClick={() => loadJogadores(search)}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M12.9 14.32a8 8 0 111.414-1.414l4.387 4.387a1 1 0 01-1.414 1.414l-4.387-4.387zM14 8a6 6 0 11-12 0 6 6 0 0112 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </button>
                            </div>
                            <div className="flex items-center gap-3">
                                {/* <label className="flex items-center gap-2 text-sm text-slate-700">
                                    Mostrar inativos
                                    <Switch
                                        checked={showInactive}
                                        onCheckedChange={async (val) => {
                                            setShowInactive(val);
                                            await loadJogadores(search, val);
                                        }}
                                    />
                                </label> */}
                                <Button onClick={addJogador}>Adicionar Jogador</Button>
                            </div>
                        </div>
                        <h1 className="text-2xl font-bold">Jogadores ({jogadores.length})</h1>
                        <p className="text-sm text-slate-600">
                            Destaques ({jogadores.filter((j) => j.destaque).length})
                        </p>
                        <p className="text-sm text-slate-600">
                            Peso ({jogadores.filter((j) => j.peso).length})
                        </p>
                    </div>

                    {loadingJogadores ? (
                        <div>Carregando jogadores...</div>
                    ) : (
                        <div className="p-2">
                            {/* Desktop: table with compact player preview */}
                            <div className="hidden sm:block overflow-x-auto">
                                <Table className="min-w-full">
                                    <TableHeader>
                                        <tr>
                                            <TableHead>Jogador</TableHead>
                                            <TableHead>Ações</TableHead>
                                        </tr>
                                    </TableHeader>
                                    <TableBody>
                                        {jogadores.length === 0 && (
                                            <tr>
                                                <td colSpan={4} className="p-4">
                                                    Nenhum jogador encontrado.
                                                </td>
                                            </tr>
                                        )}
                                        {jogadores.map((j) => (
                                            <TableRow
                                                key={j.id}
                                                className={rowTone(j)}
                                            >
                                                <TableCell>
                                                    <div className="max-w-xl">
                                                        <Player
                                                            nome={j.nome}
                                                            posicoes={j.posicoes}
                                                            destaque={j.destaque}
                                                            peso={j.peso}
                                                        />
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-4">
                                                        <button
                                                            className="text-primary underline"
                                                            onClick={() => {
                                                                setSelectedJogador(j);
                                                                setShowPlayerModal(true);
                                                            }}
                                                        >
                                                            Editar
                                                        </button>
                                                        <label className="flex items-center gap-2">
                                                            <Switch
                                                                checked={j.ativo}
                                                                disabled={togglingId === j.id}
                                                                onCheckedChange={async () => {
                                                                    try {
                                                                        setTogglingId(j.id);
                                                                        await toggleJogadorAtivo(
                                                                            j.id,
                                                                            !j.ativo,
                                                                        );
                                                                        await loadJogadores(search);
                                                                    } finally {
                                                                        setTogglingId(null);
                                                                    }
                                                                }}
                                                            />
                                                        </label>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Mobile: stacked Player cards */}
                            <div className="sm:hidden space-y-3">
                                {jogadores.length === 0 && (
                                    <div className="p-4">Nenhum jogador encontrado.</div>
                                )}
                                {jogadores.map((j) => (
                                    <div
                                        key={j.id}
                                        className={`p-3 rounded-lg shadow-sm ${cardTone(j)}`}
                                    >
                                        <Player
                                            nome={j.nome}
                                            posicoes={j.posicoes}
                                            destaque={j.destaque}
                                            peso={j.peso}
                                        />
                                        <div className="mt-2 flex justify-end">
                                            <button
                                                className="text-primary underline"
                                                onClick={() => {
                                                    setSelectedJogador(j);
                                                    setShowPlayerModal(true);
                                                }}
                                            >
                                                Editar
                                            </button>
                                            <label className="ml-4 inline-flex items-center gap-2">
                                                <span className="text-sm text-slate-700">
                                                    {j.ativo ? 'Ativo' : 'Inativo'}
                                                </span>
                                                <Switch
                                                    checked={j.ativo}
                                                    disabled={togglingId === j.id}
                                                    onCheckedChange={async () => {
                                                        try {
                                                            setTogglingId(j.id);
                                                            await toggleJogadorAtivo(
                                                                j.id,
                                                                !j.ativo,
                                                            );
                                                            await loadJogadores(search);
                                                        } finally {
                                                            setTogglingId(null);
                                                        }
                                                    }}
                                                />
                                            </label>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <PlayerDialog
                open={showPlayerModal}
                onOpenChange={(val) => setShowPlayerModal(val)}
                selected={selectedJogador}
                times={times}
                onSave={async (payload) => {
                    if (selectedJogador) {
                        await putJogador(selectedJogador.id, payload as PlayerFormData);
                    } else {
                        await postJogador(payload as PlayerFormData);
                    }
                    await loadJogadores(search);
                    setShowPlayerModal(false);
                    setSelectedJogador(null);
                }}
            />
        </>
    );
}
