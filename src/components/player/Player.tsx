import { playerBadgeClasses } from './playerColors';

export interface JogadorProps {
    nome: string;
    timeId?: string | null;
    posicoes?: string[];
    observacoes?: string;
    destaque?: boolean;
    peso?: boolean;
}

export default function Player({ nome, posicoes = [], observacoes, destaque, peso }: JogadorProps) {
    const nomeJogador = nome != '' ? nome : undefined;

    const badges: Array<{ label: string; className: string }> = [];
    if (destaque) badges.push({ label: 'Destaque', className: playerBadgeClasses.destaque });
    if (peso) badges.push({ label: 'Peso', className: playerBadgeClasses.peso });

    return (
        <>
            <div className="text-sm flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
                <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                        <strong>Nome:</strong> {nomeJogador ?? 'Sem Nome'}
                        {badges.map((badge) => (
                            <span key={badge.label} className={badge.className}>
                                {badge.label}
                            </span>
                        ))}
                    </div>
                    <div>
                        <strong>Posições:</strong> {posicoes.length ? posicoes.join(', ') : '—'}
                    </div>
                </div>
            </div>
            {observacoes && (
                <div className="mb-2 w-full sm:w-auto">
                    <strong>Observações:</strong> {observacoes}
                </div>
            )}
        </>
    );
}
