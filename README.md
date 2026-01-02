# ⚽ Sistema de Sorteio de Futebol

Sistema completo para gerenciamento de torneios de futebol com sorteio automático de times, controle de partidas e tabela de pontos corridos.

## 📋 Sobre o Projeto

Este sistema permite que organizadores criem sorteios de times de futebol de forma automatizada e justa, distribuindo jogadores equilibradamente entre os times. Oferece visualização pública dos resultados e gerenciamento completo de partidas e classificações.

### ✨ Funcionalidades Principais

- 🔐 **Autenticação completa** com JWT e login via Google
- 👥 **Cadastro de jogadores** com sistema de pesos e destaques
- 🎲 **Sorteio automático de times** com distribuição equilibrada
- 🌐 **Visualização pública** de sorteios (sem necessidade de login)
- ⚽ **Gerenciamento de partidas** com registro de placares
- 📊 **Tabela de pontos corridos** (P, V, E, D, GM, GC, SG)
- 👤 **Perfil de usuário** editável (nome, código, senha)
- 📱 **Interface responsiva** para desktop e mobile

## 🚀 Tecnologias Utilizadas

### Frontend
- **React 18** com TypeScript
- **Vite** - Build tool rápida
- **React Router** - Navegação SPA
- **shadcn/ui** - Componentes UI modernos
- **Tailwind CSS** - Estilização
- **Sonner** - Notificações toast
- **Lucide React** - Ícones

### Backend
- **.NET 9** - Framework web
- **ASP.NET Core** - APIs RESTful
- **Entity Framework Core** - ORM
- **SQLite** - Banco de dados
- **JWT** - Autenticação
- **Google OAuth** - Login social

## 📦 Instalação e Execução

### Pré-requisitos

- Node.js 18+ e npm/yarn
- .NET 9 SDK
- Git

### 1️⃣ Clonar o Repositório

```bash
git clone https://github.com/jacksontrr/FutebolTorneio.git
cd FutebolTorneio
```

### 2️⃣ Configurar o Backend

```bash
cd Futebol.Api

# Restaurar dependências
dotnet restore

# Aplicar migrations
dotnet ef database update

# Executar a API
dotnet run
```

A API estará disponível em `http://localhost:5000`

### 3️⃣ Configurar o Frontend

```bash
cd web

# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev
```

O frontend estará disponível em `http://localhost:5173`

## 🏗️ Estrutura do Projeto

```
FutebolTorneio/
├── Futebol.Api/                 # Backend .NET
│   ├── Domain/                  # Entidades do domínio
│   ├── Dtos/                    # Data Transfer Objects
│   ├── Endpoints/               # Endpoints da API
│   ├── Infrastructure/          # Contexto EF e mapeamentos
│   ├── Migrations/              # Migrations do banco
│   └── Utils/                   # Utilitários (JWT, hash)
│
└── web/                         # Frontend React
    ├── src/
    │   ├── components/          # Componentes reutilizáveis
    │   │   ├── ui/              # shadcn/ui components
    │   │   ├── organizer/       # Componentes do organizador
    │   │   ├── player/          # Componentes do jogador
    │   │   └── team/            # Componentes de times
    │   ├── hooks/               # Custom hooks
    │   ├── lib/                 # Utilitários e lógica
    │   ├── models/              # Tipos TypeScript
    │   ├── pages/               # Páginas da aplicação
    │   ├── services/            # Chamadas à API
    │   └── main.tsx             # Entry point
    └── public/                  # Assets estáticos
```

## 🎮 Como Usar

### Para Organizadores

1. **Registrar-se** como organizador (ou fazer login via Google)
2. **Cadastrar jogadores** com nome, peso e destaque
3. **Criar um sorteio** definindo:
   - Nome do sorteio
   - Número de times
   - Jogadores participantes
4. **Gerar times** - o sistema distribui automaticamente
5. **Registrar resultados** das partidas
6. **Acompanhar a classificação** na tabela de pontos

### Para Visitantes

1. Acessar link público do sorteio: `/sorteio/:id`
2. Visualizar times formados
3. Ver tabela de classificação atualizada
4. Consultar resultados das partidas (se disponíveis)

## 🔑 Principais Endpoints da API

```
# Autenticação
POST   /api/auth/register/organizador
POST   /api/auth/login
POST   /api/auth/google
GET    /api/auth/profile
POST   /api/auth/change-password
POST   /api/auth/update-name
POST   /api/auth/update-codigo

# Jogadores
GET    /api/jogadores
POST   /api/jogadores
PUT    /api/jogadores/{id}
DELETE /api/jogadores/{id}

# Sorteios
POST   /api/sorteios
GET    /api/sorteios/:id/times              # Público
GET    /api/sorteios/:id/times/:timeId/jogadores  # Público

# Partidas
GET    /api/partidas/sorteio/:sorteioId    # Público
POST   /api/partidas
PUT    /api/partidas/{id}
```

## 🧮 Algoritmo de Distribuição

O sistema usa um algoritmo inteligente que:

1. **Separa jogadores destacados** distribuindo-os primeiro
2. **Ordena por peso** (habilidade) de forma decrescente
3. **Distribui em snake draft** para equilibrar os times
4. **Embaralha cada time** ao final para variar as posições

Resultado: Times balanceados com jogadores de diferentes níveis em cada equipe.

## 📊 Cálculo da Tabela de Pontos

- **Vitória**: 3 pontos
- **Empate**: 1 ponto
- **Derrota**: 0 pontos

Critérios de desempate:
1. Pontos (P)
2. Saldo de gols (SG)
3. Gols marcados (GM)

## 🔒 Segurança

- Senhas com hash bcrypt
- JWT com expiração configurável
- Endpoints protegidos por autorização
- Visualizações públicas sem exposição de dados sensíveis
- Validação de duplicatas (e-mail, código de organizador)

## 🛠️ Scripts Disponíveis

### Frontend

```bash
npm run dev          # Modo desenvolvimento
npm run build        # Build de produção
npm run preview      # Preview do build
npm run lint         # Verificar código
```

### Backend

```bash
dotnet run                                    # Executar API
dotnet ef migrations add <NomeMigration>      # Criar migration
dotnet ef database update                     # Aplicar migrations
dotnet test                                   # Executar testes
```

## 📝 Licença

Este projeto está sob a licença especificada no arquivo [LICENSE.txt](../LICENSE.txt).

## 👨‍💻 Autor

**Jackson**
- GitHub: [@jacksontrr](https://github.com/jacksontrr)

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fazer um fork do projeto
2. Criar uma branch para sua feature (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abrir um Pull Request

---

Desenvolvido com ⚽ para facilitar a organização de peladas e torneios amadores.
