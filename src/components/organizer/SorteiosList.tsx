import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { SorteioResumo } from '@/services/sorteio';

export interface SorteiosListProps {
    sorteios: SorteioResumo[];
    loading: boolean;
    onReload: () => void;
    onViewDetails: (id: number) => void;
    detalheSorteioId: number | null;
    detalheLoading: boolean;
}

export function SorteiosList({
    sorteios,
    loading,
    onReload,
    onViewDetails,
    detalheSorteioId,
    detalheLoading,
}: SorteiosListProps) {
    const navigate = useNavigate();

    return (
        <div className="p-2">
            <div className="mb-2 font-semibold flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <span>Sorteios criados</span>
                <Button variant="outline" size="sm" onClick={onReload} disabled={loading}>
                    {loading ? 'Atualizando...' : 'Recarregar'}
                </Button>
            </div>
            {sorteios.length === 0 && (
                <div className="text-muted-foreground text-sm">Nenhum sorteio encontrado.</div>
            )}
            <div className="grid gap-2 md:grid-cols-2">
                {sorteios.map((s) => (
                    <Card key={s.id}>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>{s.nome}</CardTitle>
                                <div className="text-xs text-muted-foreground">
                                    ID: {s.id}
                                    {s.status ? ` · ${s.status}` : ''}
                                    {s.createdAt
                                        ? ` · ${new Date(s.createdAt).toLocaleDateString('pt-BR')}`
                                        : ''}
                                    {typeof s.quantidadeTimes === 'number'
                                        ? ` · ${s.quantidadeTimes} times`
                                        : ''}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => navigate(`/sorteio/${s.id}`)}
                                    title="Ver sorteio público"
                                >
                                    <ExternalLink className="h-4 w-4" />
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={() => onViewDetails(s.id)}
                                    disabled={detalheLoading && detalheSorteioId === s.id}
                                >
                                    {detalheLoading && detalheSorteioId === s.id
                                        ? 'Carregando...'
                                        : 'Detalhes'}
                                </Button>
                            </div>
                        </CardHeader>
                    </Card>
                ))}
            </div>
        </div>
    );
}
