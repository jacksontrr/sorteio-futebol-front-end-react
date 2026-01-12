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
        <div className="min-h-screen flex flex-col md:flex-row mx-auto bg-gradient-to-br from-green-50/30 via-white to-blue-50/30">
            {/* Sidebar */}
            <aside className="w-full md:w-56 bg-gradient-to-br from-green-50 to-blue-50 md:border-r border-green-100 border-b p-3 md:p-4">
                <div className="mb-2 text-lg font-semibold text-green-800">Organizador</div>
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
                            className="w-full px-2 py-1 bg-green-50 hover:bg-green-100 border border-green-300 rounded text-sm font-mono text-green-700 transition-colors text-left"
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
                        className={view === 'jogadores' ? 'bg-green-600 hover:bg-green-700' : ''}
                    >
                        Jogadores
                    </Button>
                    <Button
                        variant={view === 'campeonatos' ? 'default' : 'ghost'}
                        onClick={() => setView('campeonatos')}
                        className={view === 'campeonatos' ? 'bg-green-600 hover:bg-green-700' : ''}
                    >
                        Criar Sorteios
                    </Button>
                    <Button
                        variant={view === 'usuario' ? 'default' : 'ghost'}
                        onClick={() => setView('usuario')}
                        className={view === 'usuario' ? 'bg-green-600 hover:bg-green-700' : ''}
                    >
                        Usuário
                    </Button>
                    <Button variant="ghost" onClick={logoutUser} className="hover:bg-red-100 hover:text-red-700">
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
