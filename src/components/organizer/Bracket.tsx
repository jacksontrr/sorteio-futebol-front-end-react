import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Time } from '@/models/sorteio';

interface BracketProps {
    campId: string;
    rounds: string[][][];
    times: Time[];
    onSetWinner: (campId: string, roundIdx: number, matchIdx: number, winnerId: string) => void;
}

export function Bracket({ campId, rounds, times, onSetWinner }: BracketProps) {
    const labelsFor = (teams: number) => {
        if (teams >= 16) return ['Oitavas', 'Quartas', 'Semifinais', 'Final'];
        if (teams === 8) return ['Quartas', 'Semifinais', 'Final'];
        if (teams === 4) return ['Semifinais', 'Final'];
        if (teams === 2) return ['Final'];
        const roundsCount = Math.max(1, Math.ceil(Math.log2(teams)));
        return Array.from({ length: roundsCount }, (_, i) => `R${i + 1}`);
    };

    const labels = labelsFor(rounds[0]?.length * 2 || 0);
    const [scores, setScores] = React.useState<Record<string, { h: number; a: number }>>({});

    if (!rounds || rounds.length === 0) return <div>Nenhum chaveamento.</div>;

    const name = (id: string) => times.find((t) => t.id === id)?.nome ?? id ?? '';

    const handleSaveScore = (r: number, m: number) => {
        const key = `${r}-${m}`;
        const s = scores[key] ?? { h: 0, a: 0 };
        const pair = rounds[r][m];
        const home = pair[0];
        const away = pair[1];
        if (!home || !away) return;
        const winner = s.h > s.a ? home : s.a > s.h ? away : '';
        if (!winner) return; // no draws allowed for knockout
        onSetWinner(campId, r, m, winner);
    };

    return (
        <div className="w-full overflow-auto">
            <div className="flex gap-4 items-start">
                {rounds.map((r, ri) => (
                    <div key={ri} className="flex flex-col gap-4">
                        <div className="text-sm font-medium mb-2">{labels[ri] ?? `R${ri + 1}`}</div>
                        {r.map((pair, pi) => (
                            <div key={pi} className="border rounded p-2 w-56 bg-white shadow-sm">
                                <div className="text-xs text-gray-500">Jogo {pi + 1}</div>
                                <div className="mt-1">
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm">
                                            {pair[0] ? name(pair[0]) : '---'}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Input
                                                type="number"
                                                value={
                                                    (scores[`${ri}-${pi}`]?.h ??
                                                        0) as unknown as string
                                                }
                                                onChange={(e) =>
                                                    setScores((s) => ({
                                                        ...s,
                                                        [`${ri}-${pi}`]: {
                                                            ...(s[`${ri}-${pi}`] ?? {
                                                                h: 0,
                                                                a: 0,
                                                            }),
                                                            h: Number(e.target.value),
                                                        },
                                                    }))
                                                }
                                                className="w-16"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between mt-1">
                                        <div className="text-sm">
                                            {pair[1] ? name(pair[1]) : '---'}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Input
                                                type="number"
                                                value={
                                                    (scores[`${ri}-${pi}`]?.a ??
                                                        0) as unknown as string
                                                }
                                                onChange={(e) =>
                                                    setScores((s) => ({
                                                        ...s,
                                                        [`${ri}-${pi}`]: {
                                                            ...(s[`${ri}-${pi}`] ?? {
                                                                h: 0,
                                                                a: 0,
                                                            }),
                                                            a: Number(e.target.value),
                                                        },
                                                    }))
                                                }
                                                className="w-16"
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-2 flex gap-2">
                                        <Button onClick={() => handleSaveScore(ri, pi)}>
                                            Salvar
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
