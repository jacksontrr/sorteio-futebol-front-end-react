import React from 'react';
import { toast } from 'sonner';
import { fetchSorteios } from '@/services/sorteio';
import type { SorteioResumo } from '@/services/sorteio';

export function useSorteiosList() {
    const [sorteios, setSorteios] = React.useState<SorteioResumo[]>([]);
    const [loadingSorteios, setLoadingSorteios] = React.useState(false);

    const carregarSorteios = async () => {
        try {
            setLoadingSorteios(true);
            const data = await fetchSorteios();
            setSorteios(data);
        } catch (err) {
            console.error(err);
            toast.error('Falha ao listar sorteios');
        } finally {
            setLoadingSorteios(false);
        }
    };

    React.useEffect(() => {
        carregarSorteios();
    }, []);

    return {
        sorteios,
        loadingSorteios,
        carregarSorteios,
    };
}
