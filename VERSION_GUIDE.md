# Guia de Versionamento Automático

## Como Funciona

O projeto usa **versionamento semântico** (SemVer): `MAJOR.MINOR.PATCH`

- **MAJOR** (1.x.x): Mudanças incompatíveis na API
- **MINOR** (x.1.x): Novas funcionalidades (compatível)
- **PATCH** (x.x.1): Correções de bugs

## Comandos Disponíveis

### 1. Atualizar Versão PATCH (1.0.0 → 1.0.1)
Use para correções de bugs:
```bash
npm run version:patch
```

### 2. Atualizar Versão MINOR (1.0.0 → 1.1.0)
Use para novas funcionalidades:
```bash
npm run version:minor
```

### 3. Atualizar Versão MAJOR (1.0.0 → 2.0.0)
Use para mudanças que quebram compatibilidade:
```bash
npm run version:major
```

### 4. Deploy Completo (recomendado)
Incrementa versão PATCH, faz build e está pronto para deploy:
```bash
npm run deploy
```

## O que Acontece Automaticamente

Quando você executa qualquer comando acima:

1. ✅ **Atualiza** o `package.json` com nova versão
2. ✅ **Cria commit** automático: "1.0.1" 
3. ✅ **Cria tag** no git: "v1.0.1"
4. ✅ **Faz push** do commit e da tag para o repositório
5. ✅ **Versão aparece** no menu do Organizador automaticamente

## Fluxo de Trabalho Recomendado

### Para Deploy Rápido:
```bash
npm run deploy
```
Isso faz tudo automaticamente!

### Para Controle Manual:
```bash
# 1. Faça suas alterações
git add .
git commit -m "feat: nova funcionalidade X"

# 2. Atualize a versão
npm run version:patch  # ou minor/major

# 3. Build
npm run build

# 4. Deploy (suba a pasta dist/)
```

## Exemplos Práticos

### Corrigi um bug:
```bash
npm run deploy
# Versão: 1.0.0 → 1.0.1
```

### Adicionei botão de instalação iOS:
```bash
npm run version:minor
npm run build
# Versão: 1.0.1 → 1.1.0
```

### Mudei estrutura da API:
```bash
npm run version:major
npm run build
# Versão: 1.1.0 → 2.0.0
```

## Ver Versão Atual

```bash
npm version
```

ou veja no arquivo `package.json`

## Histórico de Versões

```bash
git tag
```

## Desfazer Versão (se necessário)

Se criou versão errada:
```bash
# Remover tag local
git tag -d v1.0.1

# Remover tag remota
git push origin :refs/tags/v1.0.1

# Voltar commit
git reset --hard HEAD~1
```

## Notas Importantes

- ⚠️ Sempre faça **commit** das alterações antes de rodar `version:*`
- ⚠️ Os comandos fazem **push automático** para o repositório
- ✅ A versão é **automaticamente mostrada** no dashboard
- ✅ O service worker usa timestamp separado para cache busting
