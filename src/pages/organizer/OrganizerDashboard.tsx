// src/pages/organizer/OrganizerDashboard.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import JogadoresView from './JogadoresView';
import SorteiosView from './SorteiosView';
import UsuarioView from './UsuarioView';
import { logout } from '@/services/auth';
import { fetchUserData, type OrganizadorResponse } from '@/services/user';

export default function OrganizerDashboard() {
    const navigate = useNavigate();
    const [view, setView] = React.useState<'times' | 'jogadores' | 'campeonatos' | 'usuario'>(
        'jogadores',
    );
    const [userData, setUserData] = React.useState<OrganizadorResponse | null>(null);
    const [loading, setLoading] = React.useState(true);

    // Carrega os dados do usuário ao montar o componente
    React.useEffect(() => {
        const loadUserData = async () => {
            setLoading(true);
            const data = await fetchUserData();
            setUserData(data);
            setLoading(false);
        };
        loadUserData();
    }, []);

    const logoutUser = () => {
        logout();
        navigate('/login');
        return;
    };

    const handleProfileUpdated = async () => {
        const data = await fetchUserData();
        setUserData(data);
    };

    const copyUserCode = () => {
        if (userData?.codigo) {
            navigator.clipboard.writeText(userData.codigo);
            toast.success('Código copiado para a área de transferência!');
        }
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row mx-auto">
            {/* Sidebar */}
            <aside className="w-full md:w-56 bg-slate-50 md:border-r border-b p-3 md:p-4">
                <div className="mb-2 text-lg font-semibold">Organizador</div>
                {loading ? (
                    <div className="mb-4 text-sm text-gray-500">Carregando...</div>
                ) : userData ? (
                    <div className="mb-4 pb-3 border-b">
                        <div className="text-xs text-gray-600 mb-1">Nome:</div>
                        <div className="mb-3 text-sm font-medium text-gray-800">
                            {userData.nome}
                        </div>
                        <div className="text-xs text-gray-600 mb-1">Seu código:</div>
                        <button
                            onClick={copyUserCode}
                            className="w-full px-2 py-1 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded text-sm font-mono text-blue-700 transition-colors text-left"
                            title="Clique para copiar"
                        >
                            {userData.codigo}
                        </button>
                    </div>
                ) : null}
                <nav className="flex md:flex-col gap-2 overflow-x-auto">
                    <Button
                        variant={view === 'jogadores' ? 'default' : 'ghost'}
                        onClick={() => setView('jogadores')}
                    >
                        Jogadores
                    </Button>
                    <Button
                        variant={view === 'campeonatos' ? 'default' : 'ghost'}
                        onClick={() => setView('campeonatos')}
                    >
                        Criar Sorteios
                    </Button>
                    <Button
                        variant={view === 'usuario' ? 'default' : 'ghost'}
                        onClick={() => setView('usuario')}
                    >
                        Usuário
                    </Button>
                    <Button variant="ghost" onClick={logoutUser}>
                        Sair
                    </Button>
                </nav>
            </aside>

            {/* Conteúdo dinâmico */}
            <main className="flex-1 p-4 md:p-6">
                <h1 className="text-2xl font-bold mb-4">Painel do Organizador</h1>

                {view === 'jogadores' && <JogadoresView />}
                {view === 'campeonatos' && <SorteiosView />}
                {view === 'usuario' && <UsuarioView onLogout={logoutUser} onProfileUpdated={handleProfileUpdated} />}
            </main>
        </div>
    );
}
