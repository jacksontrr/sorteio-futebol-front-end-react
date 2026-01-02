/**
 * Exemplos de uso dos novos componentes e hooks refatorados
 */

// ==========================================
// EXEMPLO 1: Usar o hook useSorteio isoladamente
// ==========================================
import { useSorteio } from '@/hooks/useSorteio';

function MyCustomComponent() {
    const { state, startSorteio, togglePaid, generateTeamsFromPaid } = useSorteio();

    return (
        <div>
            <button onClick={() => startSorteio()}>Iniciar Sorteio</button>
            <p>Sorteio ID: {state.sorteioId}</p>
            <p>Times gerados: {Object.keys(state.teamsAlloc).length}</p>
        </div>
    );
}

// ==========================================
// EXEMPLO 2: Usar SorteioCreationSection em outro contexto
// ==========================================
import { SorteioCreationSection } from '@/components/organizer/SorteioCreationSection';
import { useSorteio } from '@/hooks/useSorteio';

function MyCustomSorteioPage() {
    const sorteioHook = useSorteio();

    return (
        <SorteioCreationSection
            state={sorteioHook.state}
            onCampNomeChange={(nome) => sorteioHook.updateState({ campNome: nome })}
            onStartSorteio={() => sorteioHook.startSorteio()}
            onTogglePaid={sorteioHook.togglePaid}
            onFilterChange={(text) => sorteioHook.updateState({ filterText: text })}
            onTeamCountChange={sorteioHook.updateTeamCount}
            onTeamNameChange={sorteioHook.updateTeamName}
            onGenerateTeams={() => sorteioHook.generateTeamsFromPaid()}
            // ... outros props
        />
    );
}

// ==========================================
// EXEMPLO 3: Usar Bracket component isoladamente
// ==========================================
import { Bracket } from '@/components/organizer/Bracket';
import type { Time } from '@/models/sorteio';

function BracketViewer({ rounds, times }: { rounds: string[][][]; times: Time[] }) {
    return (
        <Bracket
            campId="campeonato-1"
            rounds={rounds}
            times={times}
            onSetWinner={(campId, roundIdx, matchIdx, winnerId) => {
                console.log(`Vencedor: ${winnerId}`);
            }}
        />
    );
}

// ==========================================
// EXEMPLO 4: Combinar múltiplos hooks em uma page customizada
// ==========================================
import { useSorteio } from '@/hooks/useSorteio';
import { useDetalheSorteio } from '@/hooks/useDetalheSorteio';
import { useSorteiosList } from '@/hooks/useSorteiosList';

function MyCustomDashboard() {
    const sorteio = useSorteio();
    const detalhe = useDetalheSorteio();
    const lista = useSorteiosList();

    return (
        <div>
            {/* Seção para criar sorteio */}
            <button onClick={() => sorteio.startSorteio()}>Novo Sorteio</button>

            {/* Seção para listar sorteios */}
            <div>
                {lista.sorteios.map((s) => (
                    <div key={s.id} onClick={() => detalhe.viewDetails(s.id)}>
                        {s.nome}
                    </div>
                ))}
            </div>

            {/* Seção para editar sorteio selecionado */}
            {detalhe.state.detalheSorteioId && (
                <div>
                    <h2>Editando sorteio {detalhe.state.detalheSorteioId}</h2>
                    <button onClick={() => detalhe.addDetalheMatch()}>Registrar Resultado</button>
                </div>
            )}
        </div>
    );
}

// ==========================================
// EXEMPLO 5: Tipagem TypeScript com os novos tipos
// ==========================================
import type { SorteioCreationState, SorteioDetailState, Time } from '@/models/sorteio';

function TypedComponent(props: {
    creationState: SorteioCreationState;
    detailState: SorteioDetailState;
    teams: Time[];
}) {
    console.log(`Times alocados: ${Object.keys(props.creationState.teamsAlloc).length}`);
    console.log(`Time expandido: ${props.detailState.expandedTeamId}`);
}

export { MyCustomComponent, MyCustomSorteioPage, BracketViewer, MyCustomDashboard, TypedComponent };
