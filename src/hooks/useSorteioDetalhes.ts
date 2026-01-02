import { useEffect, useState } from 'react';
import {
    fetchSorteioTimes,
    fetchPartidasBySorteio,
    type SorteioTimeDto,
    type PartidaDto,
} from '@/services/sorteio';

export function useSorteioDetalhes(sorteioId: number | null) {
    const [times, setTimes] = useState<SorteioTimeDto[]>([]);
    const [partidas, setPartidas] = useState<PartidaDto[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;
        async function load() {
            try {
                setLoading(true);
                setError(null);
                if (sorteioId == null) {
                    if (mounted) {
                        setTimes([]);
                        setPartidas([]);
                    }
                    return;
                }
                const [t, p] = await Promise.all([
                    fetchSorteioTimes(sorteioId),
                    fetchPartidasBySorteio(sorteioId),
                ]);
                if (mounted) {
                    setTimes(t);
                    setPartidas(p);
                }
            } catch {
                if (mounted) setError('Falha ao carregar detalhes');
            } finally {
                if (mounted) setLoading(false);
            }
        }
        load();
        return () => {
            mounted = false;
        };
    }, [sorteioId]);

    return { times, partidas, loading, error };
}
