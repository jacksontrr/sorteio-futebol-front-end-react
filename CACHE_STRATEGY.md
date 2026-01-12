# Configuração de Cache para Produção

## Problema
Arquivos em cache impedem que usuários vejam atualizações após deploy.

## Soluções Implementadas

### 1. Versionamento Automático (✅ Implementado)
- **Service Worker** com versão automática baseada em timestamp
- **Vite** configurado para gerar hashes únicos nos arquivos
- **Script** que atualiza a versão do SW a cada build

### 2. Meta Tags HTML (✅ Implementado)
```html
<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
<meta http-equiv="Pragma" content="no-cache" />
<meta http-equiv="Expires" content="0" />
```

### 3. Estratégia de Cache no Service Worker (✅ Implementado)
- **Network-first** para HTML e API (sempre busca do servidor)
- **Cache-first** para assets estáticos (JS, CSS, imagens)
- **Limpeza automática** de caches antigos

## Configuração do Servidor (⚠️ Requer Configuração Manual)

### Se usar **GitHub Pages**:
Não precisa de configuração adicional, o GitHub Pages já faz cache busting.

### Se usar **Nginx**:
Adicione ao arquivo de configuração:

```nginx
location / {
    # Cache para arquivos com hash (1 ano)
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Sem cache para HTML
    location ~* \.html$ {
        expires -1;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        add_header Pragma "no-cache";
    }
    
    # Service Worker sem cache
    location = /service-worker.js {
        expires -1;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        add_header Pragma "no-cache";
    }
}
```

### Se usar **Apache** (.htaccess):
```apache
# Cache para assets com hash (1 ano)
<FilesMatch "\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$">
    Header set Cache-Control "max-age=31536000, public, immutable"
</FilesMatch>

# Sem cache para HTML
<FilesMatch "\.html$">
    Header set Cache-Control "no-cache, no-store, must-revalidate"
    Header set Pragma "no-cache"
    Header set Expires "0"
</FilesMatch>

# Sem cache para service worker
<Files "service-worker.js">
    Header set Cache-Control "no-cache, no-store, must-revalidate"
    Header set Pragma "no-cache"
    Header set Expires "0"
</Files>
```

### Se usar **Netlify** (netlify.toml):
```toml
[[headers]]
  for = "/*"
  [headers.values]
    Cache-Control = "no-cache"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

### Se usar **Vercel** (vercel.json):
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "no-cache, no-store, must-revalidate"
        }
      ]
    },
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

## Como Usar

### Build para produção:
```bash
npm run build
```

O script automaticamente:
1. Compila o projeto
2. Gera arquivos com hash único
3. Atualiza versão do service worker com timestamp
4. Limpa caches antigos quando usuários acessarem

### Versões do App:
- A cada build, a versão no `package.json` pode ser atualizada manualmente
- O service worker usa timestamp automático
- Arquivos JS/CSS têm hash automático do Vite

## Testando

1. Faça build: `npm run build`
2. Suba para produção
3. Abra DevTools (F12) no celular ou desktop
4. Aba Application > Service Workers
5. Verifique a nova versão sendo instalada
6. Force refresh: Ctrl+Shift+R (ou limpe cache manualmente uma vez)

## Forçar Atualização Manual (Emergência)

Se mesmo assim houver problemas, usuários podem:
1. **Safari iOS**: Ajustes > Safari > Limpar Histórico e Dados
2. **Chrome Android**: Configurações > Privacidade > Limpar dados de navegação
3. Ou simplesmente desinstalar e reinstalar o PWA
