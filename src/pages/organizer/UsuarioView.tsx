import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { getUserProfile, changePassword, updateName, updateCodigo } from '@/services/auth';
import type { UserProfile } from '@/services/auth';

type Props = {
    onLogout: () => void;
    onProfileUpdated?: () => Promise<void>;
};

export default function UsuarioView({ onLogout, onProfileUpdated }: Props) {
    const [profile, setProfile] = React.useState<UserProfile | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [editingName, setEditingName] = React.useState(false);
    const [nome, setNome] = React.useState('');
    const [updatingName, setUpdatingName] = React.useState(false);
    const [editingCodigo, setEditingCodigo] = React.useState(false);
    const [codigo, setCodigo] = React.useState('');
    const [updatingCodigo, setUpdatingCodigo] = React.useState(false);
    const [showChangePassword, setShowChangePassword] = React.useState(false);
    const [senhaAtual, setSenhaAtual] = React.useState('');
    const [novaSenha, setNovaSenha] = React.useState('');
    const [confirmarSenha, setConfirmarSenha] = React.useState('');
    const [changingPassword, setChangingPassword] = React.useState(false);

    React.useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            setLoading(true);
            const data = await getUserProfile();
            setProfile(data);
            setNome(data.nome);
            setCodigo(data.codigo);
        } catch (err) {
            console.error(err);
            toast.error('Erro ao carregar dados do usuário');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateName = async () => {
        if (!nome.trim()) {
            toast.error('Nome não pode estar vazio');
            return;
        }

        if (nome === profile?.nome) {
            setEditingName(false);
            return;
        }

        try {
            setUpdatingName(true);
            await updateName(nome);
            toast.success('Nome atualizado com sucesso');
            setProfile(prev => prev ? { ...prev, nome } : null);
            setEditingName(false);
            if (onProfileUpdated) {
                await onProfileUpdated();
            }
        } catch (err) {
            console.error(err);
            toast.error('Erro ao atualizar nome');
            setNome(profile?.nome || '');
        } finally {
            setUpdatingName(false);
        }
    };

    const handleUpdateCodigo = async () => {
        if (!codigo.trim()) {
            toast.error('Código não pode estar vazio');
            return;
        }

        if (codigo === profile?.codigo) {
            setEditingCodigo(false);
            return;
        }

        try {
            setUpdatingCodigo(true);
            await updateCodigo(codigo);
            toast.success('Código atualizado com sucesso');
            setProfile(prev => prev ? { ...prev, codigo } : null);
            setEditingCodigo(false);
            if (onProfileUpdated) {
                await onProfileUpdated();
            }
        } catch (err) {
            console.error(err);
            toast.error('Erro ao atualizar código');
            setCodigo(profile?.codigo || '');
        } finally {
            setUpdatingCodigo(false);
        }
    };

    const handleChangePassword = async () => {
        if (!novaSenha) {
            toast.error('Nova senha é obrigatória');
            return;
        }

        if (novaSenha !== confirmarSenha) {
            toast.error('As senhas não correspondem');
            return;
        }

        if (!senhaAtual) {
            toast.error('Senha atual é obrigatória');
            return;
        }

        try {
            setChangingPassword(true);
            await changePassword(senhaAtual, novaSenha);
            toast.success('Senha alterada com sucesso');
            setSenhaAtual('');
            setNovaSenha('');
            setConfirmarSenha('');
            setShowChangePassword(false);
        } catch (err) {
            console.error(err);
            toast.error('Erro ao alterar senha');
        } finally {
            setChangingPassword(false);
        }
    };

    if (loading) {
        return (
            <div className="space-y-4">
                <h2 className="text-xl font-semibold">Informações do Usuário</h2>
                <p className="text-muted-foreground">Carregando...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold mb-4">Informações do Usuário</h2>
            </div>

            {profile && (
                <Card>
                    <CardHeader>
                        <CardTitle>Perfil</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">Nome</label>
                            {editingName ? (
                                <div className="flex gap-2 mt-2">
                                    <Input
                                        value={nome}
                                        onChange={(e) => setNome(e.target.value)}
                                        disabled={updatingName}
                                        autoFocus
                                    />
                                    <Button
                                        onClick={handleUpdateName}
                                        disabled={updatingName}
                                        size="sm"
                                    >
                                        {updatingName ? 'Salvando...' : 'Salvar'}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setEditingName(false);
                                            setNome(profile.nome);
                                        }}
                                        disabled={updatingName}
                                        size="sm"
                                    >
                                        Cancelar
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex justify-between items-center mt-2">
                                    <p className="text-base">{profile.nome}</p>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setEditingName(true)}
                                    >
                                        Editar
                                    </Button>
                                </div>
                            )}
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">Email</label>
                            <p className="text-base">{profile.email}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">Código do Organizador</label>
                            {editingCodigo ? (
                                <div className="flex gap-2 mt-2">
                                    <Input
                                        value={codigo}
                                        onChange={(e) => setCodigo(e.target.value)}
                                        disabled={updatingCodigo}
                                        autoFocus
                                    />
                                    <Button
                                        onClick={handleUpdateCodigo}
                                        disabled={updatingCodigo}
                                        size="sm"
                                    >
                                        {updatingCodigo ? 'Salvando...' : 'Salvar'}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setEditingCodigo(false);
                                            setCodigo(profile.codigo);
                                        }}
                                        disabled={updatingCodigo}
                                        size="sm"
                                    >
                                        Cancelar
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex justify-between items-center mt-2">
                                    <p className="text-base font-mono">{profile.codigo}</p>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setEditingCodigo(true)}
                                    >
                                        Editar
                                    </Button>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Formulário de Alterar Senha */}
            {showChangePassword && (
                <Card>
                    <CardHeader>
                        <CardTitle>Alterar Senha</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="text-sm font-medium">Senha Atual</label>
                            <Input
                                type="password"
                                placeholder="Digite sua senha atual"
                                value={senhaAtual}
                                onChange={(e) => setSenhaAtual(e.target.value)}
                                disabled={changingPassword}
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium">Nova Senha</label>
                            <Input
                                type="password"
                                placeholder="Digite a nova senha"
                                value={novaSenha}
                                onChange={(e) => setNovaSenha(e.target.value)}
                                disabled={changingPassword}
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium">Confirmar Senha</label>
                            <Input
                                type="password"
                                placeholder="Confirme a nova senha"
                                value={confirmarSenha}
                                onChange={(e) => setConfirmarSenha(e.target.value)}
                                disabled={changingPassword}
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button
                                onClick={handleChangePassword}
                                disabled={changingPassword}
                            >
                                {changingPassword ? 'Alterando...' : 'Alterar Senha'}
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setShowChangePassword(false);
                                    setSenhaAtual('');
                                    setNovaSenha('');
                                    setConfirmarSenha('');
                                }}
                                disabled={changingPassword}
                            >
                                Cancelar
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="flex gap-2">
                {!showChangePassword && (
                    <Button onClick={() => setShowChangePassword(true)}>
                        Alterar Senha
                    </Button>
                )}
                <Button variant="destructive" onClick={onLogout}>
                    Logout
                </Button>
            </div>
        </div>
    );
}
