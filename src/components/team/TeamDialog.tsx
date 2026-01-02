import React from 'react';
import { DialogContent, DialogHeader, DialogTitle, Dialog } from '@/components/ui/dialog';
import type { Team } from '@/models/team';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type TeamDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    selected?: Team | null;
    onSave: (team: Team) => void;
};

export default function TeamDialog({ open, onOpenChange, selected, onSave }: TeamDialogProps) {
    const [nome, setNome] = React.useState(selected?.nome || '');
    const [avatar, setAvatar] = React.useState<string | undefined>(selected?.avatar);
    const fileInputRef = React.useRef<HTMLInputElement | null>(null);

    React.useEffect(() => {
        if (selected) setNome(selected.nome);
        else setNome('');
        // update avatar when selected changes
        if (selected?.avatar) setAvatar(selected.avatar);
        else setAvatar(undefined);
    }, [selected]);

    const handleSave = () => {
        if (!nome.trim()) return;
        onSave({
            id: selected?.id ?? Math.random().toString(36).slice(2),
            nome: nome.trim(),
            gols: selected?.gols ?? 0,
            avatar: avatar,
        });
        onOpenChange(false);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files && e.target.files[0];
        if (!f) return;
        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result as string | null;
            if (result) setAvatar(result);
        };
        reader.readAsDataURL(f);
    };

    const handleChooseImage = () => {
        fileInputRef.current?.click();
    };

    const handleRemoveImage = () => {
        setAvatar(undefined);
        // reset input value so the same file can be chosen again if needed
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{selected ? 'Editar Time' : 'Cadastrar Time'}</DialogTitle>
                </DialogHeader>

                <div className="my-4 flex flex-col items-center">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                    />

                    {avatar ? (
                        <div className="flex items-center  gap-2">
                            <img
                                src={avatar}
                                alt="Preview"
                                style={{
                                    width: 96,
                                    height: 96,
                                    objectFit: 'cover',
                                    borderRadius: 8,
                                }}
                            />
                            <div className="flex flex-col">
                                <Button variant="outline" onClick={handleChooseImage}>
                                    Trocar imagem
                                </Button>
                                <Button variant="ghost" onClick={handleRemoveImage}>
                                    Remover
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <Button onClick={handleChooseImage}>Escolher imagem</Button>
                    )}
                </div>

                <div className="grid gap-3 mt-2">
                    <Input
                        placeholder="Nome do time"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                    />

                    <Button onClick={handleSave}>
                        {selected ? 'Salvar alterações' : 'Adicionar'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
