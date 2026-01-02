import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SorteiosList } from '@/components/organizer/SorteiosList';
import { SorteioCreationSection } from '@/components/organizer/SorteioCreationSection';
import { SorteioDetailSection } from '@/components/organizer/SorteioDetailSection';
import { useSorteio } from '@/hooks/useSorteio';
import { useDetalheSorteio } from '@/hooks/useDetalheSorteio';
import { useSorteiosList } from '@/hooks/useSorteiosList';

export default function SorteiosView() {
    const sorteioHook = useSorteio();
    const detalheHook = useDetalheSorteio();
    const { sorteios, loadingSorteios, carregarSorteios } = useSorteiosList();

    const handleStartSorteio = async () => {
        await sorteioHook.startSorteio();
    };

    const handleGenerateTeams = async () => {
        await sorteioHook.generateTeamsFromPaid();
    };

    const handleAddSorteioMatch = async () => {
        await sorteioHook.addSorteioMatch();
    };

    const handleResetSorteio = () => {
        sorteioHook.clearFormState();
    };

    const handleReloadSorteios = async () => {
        await carregarSorteios();
    };

    const handleViewDetails = (id: number) => {
        detalheHook.viewDetails(id);
    };

    const handleAddDetalheMatch = async () => {
        await detalheHook.addDetalheMatch();
    };

    const handleExpandTeam = async (timeId: number) => {
        await detalheHook.handleExpandTeam(timeId);
    };

    return (
        <div className="grid gap-4">
            {/* Cabeçalho de criação */}
            <div className="flex flex-col sm:flex-row gap-2">
                <Input
                    className="flex-1"
                    placeholder="Nome do sorteio (opcional)"
                    value={sorteioHook.state.campNome}
                    onChange={(e) => sorteioHook.updateState({ campNome: e.target.value })}
                />
                <Button onClick={handleStartSorteio} disabled={sorteioHook.state.loadingSorteio}>
                    {sorteioHook.state.loadingSorteio ? 'Criando...' : 'Criar Sorteio'}
                </Button>
            </div>

            {/* Seção de criação de sorteio */}
            <SorteioCreationSection
                state={sorteioHook.state}
                onTogglePaid={sorteioHook.togglePaid}
                onFilterChange={(text) => sorteioHook.updateState({ filterText: text })}
                onTeamCountChange={sorteioHook.updateTeamCount}
                onTeamNameChange={sorteioHook.updateTeamName}
                onGenerateTeams={handleGenerateTeams}
                onHomeTeamChange={(v) => sorteioHook.updateState({ sorteioHome: v })}
                onAwayTeamChange={(v) => sorteioHook.updateState({ sorteioAway: v })}
                onHomeGoalsChange={(v) => sorteioHook.updateState({ sorteioHomeGoals: v })}
                onAwayGoalsChange={(v) => sorteioHook.updateState({ sorteioAwayGoals: v })}
                onAddMatch={handleAddSorteioMatch}
                onReset={handleResetSorteio}
            />

            {!sorteioHook.state.creatingSorteio && (
                <>
                    {/* Lista de sorteios */}
                    <SorteiosList
                        sorteios={sorteios}
                        loading={loadingSorteios}
                        onReload={handleReloadSorteios}
                        onViewDetails={handleViewDetails}
                        detalheSorteioId={detalheHook.state.detalheSorteioId}
                        detalheLoading={false}
                    />

                    {/* Seção de detalhes do sorteio */}
                    <SorteioDetailSection
                        detalheSorteioId={detalheHook.state.detalheSorteioId}
                        sorteios={sorteios}
                        state={detalheHook.state}
                        onHomeTeamChange={(v) => detalheHook.updateState({ detalheHome: v })}
                        onAwayTeamChange={(v) => detalheHook.updateState({ detalheAway: v })}
                        onHomeGoalsChange={(v) => detalheHook.updateState({ detalheHomeGoals: v })}
                        onAwayGoalsChange={(v) => detalheHook.updateState({ detalheAwayGoals: v })}
                        onAddMatch={handleAddDetalheMatch}
                        onExpandTeam={handleExpandTeam}
                    />
                </>
            )}
        </div>
    );
}
