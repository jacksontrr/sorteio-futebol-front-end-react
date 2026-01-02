import React from 'react';
import {
    Dialog as DialogRoot,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogOverlay,
    DialogClose,
    DialogPortal,
} from '@/components/ui/dialog';
import PlayerForm from '@/components/player/PlayerForm';
import type { PlayerFormData } from '@/models/player';
import type { Team } from '@/models/team';
import { Button } from '@/components/ui/button';

export type DialogJogador = {
    id?: string;
    nome: string;
    timeId?: string;
    posicoes?: string[];
    observacoes?: string;
    destaque?: boolean;
    peso?: boolean;
};

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    selected?: DialogJogador | null;
    times: Team[];
    onSave: (payload: PlayerFormData) => Promise<void> | void;
};

export default function PlayerDialog({ open, onOpenChange, selected, onSave }: Props) {
    const formRef = React.useRef<{ submit: () => Promise<PlayerFormData | null> } | null>(null);

    const defaultValues = {
        nome: selected?.nome,
        posicoes: selected?.posicoes ?? [],
        observacoes: selected?.observacoes,
        destaque: selected?.destaque ?? false,
        peso: selected?.peso ?? false,
    };

    return (
        <DialogRoot open={open} onOpenChange={onOpenChange}>
            <DialogPortal>
                <DialogOverlay />
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {selected ? 'Editar Jogador' : 'Cadastrar Jogador'}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="mt-2">
                        <PlayerForm
                            ref={formRef}
                            defaultValues={defaultValues}
                            onSubmit={async () => {
                                /* handled by footer */
                            }}
                            showPreview={true}
                        />
                    </div>

                    <DialogFooter>
                        <div className="flex gap-2">
                            <DialogClose asChild>
                                <Button variant="secondary">Fechar</Button>
                            </DialogClose>
                            <Button
                                className="btn-primary px-3 py-1 text-white"
                                onClick={async () => {
                                    try {
                                        const data = await formRef.current?.submit();
                                        if (!data) return;
                                        await onSave(data);
                                        onOpenChange(false);
                                    } catch (err) {
                                        console.error('Erro ao salvar jogador no dialog:', err);
                                    }
                                }}
                            >
                                Salvar
                            </Button>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </DialogPortal>
        </DialogRoot>
    );
}
