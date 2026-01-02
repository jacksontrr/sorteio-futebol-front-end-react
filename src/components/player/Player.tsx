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

    return (
        <>
            <div className="text-sm flex flex-col sm:flex-row gap-4 items-start">
                <div>
                    <div className="mb-2">
                        <strong>Nome:</strong> {nomeJogador ?? 'Sem Nome'}
                    </div>
                    <div className="mb-2">
                        <strong>Posições:</strong> {posicoes.length ? posicoes.join(', ') : '—'}
                    </div>

                    {destaque && (
                        <div className="mb-2">
                            <strong>Destaque:</strong> {destaque ? 'Sim' : 'Não'}
                        </div>
                    )}
                    {peso && (
                        <div className="mb-2">
                            <strong>Peso:</strong> {peso ? 'Sim' : 'Não'}
                        </div>
                    )}
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
