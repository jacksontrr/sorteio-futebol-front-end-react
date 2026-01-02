# Refatoração de SorteiosView - Documentação

## Resumo das Mudanças

O arquivo `SorteiosView.tsx` foi refatorado para melhorar a manutenibilidade, reutilização de código e separação de responsabilidades. O código monolítico foi dividido em componentes reutilizáveis, hooks customizados e tipos bem definidos.

## Estrutura Nova

### 📁 Modelos (Models)
- **[src/models/sorteio.ts](src/models/sorteio.ts)**
  - Tipos: `Time`, `Match`, `SorteioCreationState`, `SorteioDetailState`, `SorteioListState`
  - Centraliza todas as interfaces e tipos relacionados a sorteios

### 🎣 Hooks Customizados
1. **[src/hooks/useSorteio.ts](src/hooks/useSorteio.ts)**
   - Gerencia estado de criação de sorteio
   - Funções: `startSorteio`, `togglePaid`, `updateTeamCount`, `updateTeamName`, `generateTeamsFromPaid`, `addSorteioMatch`
   - Simplifica a lógica complexa em um único hook

2. **[src/hooks/useDetalheSorteio.ts](src/hooks/useDetalheSorteio.ts)**
   - Gerencia estado de detalhes e edição de sorteio existente
   - Funções: `addDetalheMatch`, `handleExpandTeam`, `viewDetails`, `resetDetails`
   - Isolado para evitar conflitos com criação

3. **[src/hooks/useSorteiosList.ts](src/hooks/useSorteiosList.ts)**
   - Carrega e gerencia lista de sorteios
   - Funções: `carregarSorteios`, efeito de carregamento automático
   - Responsável pela busca de dados iniciais

### 🧩 Componentes
1. **[src/components/organizer/SorteioCreationSection.tsx](src/components/organizer/SorteioCreationSection.tsx)**
   - Componente responsável pela seção de criação de novo sorteio
   - Reutiliza componentes menores como `PlayerSelectionPanel`, `TeamConfigPanel`, etc.
   - Recebe estado e callbacks como props

2. **[src/components/organizer/SorteioDetailSection.tsx](src/components/organizer/SorteioDetailSection.tsx)**
   - Componente responsável pela exibição e edição de sorteio existente
   - Mostra times, partidas e tabela de pontos
   - Permite registrar novos resultados

3. **[src/components/organizer/Bracket.tsx](src/components/organizer/Bracket.tsx)**
   - Componente para exibição de chaveamento/bracket
   - Permite entrada de placar e avançamento de vencedores
   - Anteriormente embutido na view principal

### 📄 Page Principal Refatorada
- **[src/pages/organizer/SorteiosView.tsx](src/pages/organizer/SorteiosView.tsx)**
  - Reduzida de ~900 linhas para ~280 linhas
  - Agora atua como orquestrador dos hooks e componentes
  - Mantém compatibilidade com dados antigos (campeonatos)
  - Muito mais legível e fácil de manter

## Benefícios

✅ **Separação de Responsabilidades**: Cada arquivo tem uma única responsabilidade clara  
✅ **Reutilização**: Componentes e hooks podem ser usados em outras páginas  
✅ **Testabilidade**: Hooks e componentes são mais fáceis de testar isoladamente  
✅ **Manutenibilidade**: Código organizado e bem estruturado  
✅ **Escalabilidade**: Fácil adicionar novos recursos sem afetar código existente  
✅ **TypeScript**: Tipos bem definidos em arquivo separado  

## Fluxo de Dados

```
SorteiosView (Page)
├── useSorteio (Hook)
│   ├── State: SorteioCreationState
│   └── Methods: startSorteio, togglePaid, generateTeamsFromPaid...
├── useDetalheSorteio (Hook)
│   ├── State: SorteioDetailState
│   └── Methods: addDetalheMatch, handleExpandTeam...
├── useSorteiosList (Hook)
│   └── Gerencia sorteios, loadingSorteios
└── Componentes:
    ├── SorteioCreationSection (props do useSorteio)
    ├── SorteioDetailSection (props do useDetalheSorteio)
    ├── SorteiosList
    └── Bracket
```

## Como Usar

### Criar novo Sorteio
```tsx
const sorteioHook = useSorteio();
await sorteioHook.startSorteio();
sorteioHook.togglePaid('jogador-id');
await sorteioHook.generateTeamsFromPaid();
```

### Acessar Detalhes de Sorteio
```tsx
const detalheHook = useDetalheSorteio();
detalheHook.viewDetails(sorteioId);
await detalheHook.addDetalheMatch();
```

### Listar Sorteios
```tsx
const { sorteios, loadingSorteios, carregarSorteios } = useSorteiosList();
```

## Próximos Passos Sugeridos

1. Extrair `ResultForm` para componente separado
2. Criar componente para exibição de campeonatos
3. Adicionar testes unitários para hooks
4. Considerar uso de Redux/Context para estado global (se aplicável)
5. Documentar tipos em JSDoc

## Compatibilidade

- ✅ Mantém compatibilidade com dados antigos (campeonatos)
- ✅ Sem breaking changes na API
- ✅ Funcionalidade 100% preservada
