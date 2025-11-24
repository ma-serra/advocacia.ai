# ⚡ Guia Rápido - Advocacia.AI

## 📦 O que você recebeu?

Você recebeu um **site completo e pronto para produção** com:

### 🎯 Landing Page
- ✅ Hero section persuasivo
- ✅ 12 áreas do direito
- ✅ Seção "Como Funciona"
- ✅ Mapa interativo do Brasil
- ✅ Seção de atendimento online
- ✅ Blog com 8 artigos
- ✅ Footer completo
- ✅ 100% responsivo

### 📝 Formulário de Captura
- ✅ Multi-step (4 etapas)
- ✅ Validações em tempo real
- ✅ Busca de CEP automática
- ✅ Geolocalização GPS
- ✅ Reconhecimento de voz
- ✅ Análise por IA
- ✅ WhatsApp floating button

### 🔧 Portal do Advogado
- ✅ Dashboard com estatísticas
- ✅ Lista de leads com filtros
- ✅ Detalhes do lead com análise IA
- ✅ Anotações e histórico

### 📊 Analytics & SEO
- ✅ Google Analytics 4
- ✅ Google Ads Conversion
- ✅ Facebook Pixel
- ✅ Google Tag Manager
- ✅ Meta tags otimizadas
- ✅ Schema.org estruturado

---

## 🚀 Começar em 3 Passos

### 1️⃣ Escolha seu Provedor

**Hostinger** (Mais fácil)
```
Vantagens:
- Painel intuitivo
- Suporte 24/7
- Preço acessível
- Fácil configuração de domínio
```

**Speedinx** (Mais controle)
```
Vantagens:
- Servidor dedicado
- Mais performance
- Melhor para escala
- Suporte técnico especializado
```

### 2️⃣ Seguir Manual Correspondente

- **Hostinger**: Abra `INSTALACAO_HOSTINGER.md`
- **Speedinx**: Abra `INSTALACAO_SPEEDINX.md`

### 3️⃣ Testar Site

```
https://seu-dominio.com
```

---

## 📋 Arquivos Inclusos

```
advocacia-ai-landing/
├── client/                          # Frontend React
│   ├── src/
│   │   ├── pages/                   # Páginas (Home, Blog, etc)
│   │   ├── components/              # Componentes reutilizáveis
│   │   ├── lib/                     # Utilitários (API, validações)
│   │   └── hooks/                   # Hooks customizados
│   ├── public/                      # Arquivos estáticos
│   └── index.html                   # HTML principal
├── dist/                            # Build para produção
├── package.json                     # Dependências
├── vite.config.ts                   # Configuração Vite
├── tsconfig.json                    # Configuração TypeScript
├── DEPLOYMENT_GODADDY.md            # Deploy detalhado
├── API_INTEGRATION.md               # Integração com IA
├── SECURITY_CONFIG.md               # Segurança
└── README.md                        # Documentação
```

---

## ⚙️ Configuração Essencial

### Variáveis de Ambiente (.env.production)

```env
# Obrigatório
NODE_ENV=production
PORT=3000
APP_URL=https://seu-dominio.com
JWT_SECRET=sua-chave-secreta-32-caracteres

# API de IA (configure com seus dados)
VITE_FRONTEND_FORGE_API_URL=https://sua-api-ia.com
VITE_FRONTEND_FORGE_API_KEY=sua-chave-api

# Analytics (opcional, mas recomendado)
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
FACEBOOK_PIXEL_ID=XXXXXXXXXX
GTM_ID=GTM-XXXXXXXXXX
```

---

## 🔌 Integração com API de IA

### Endpoint que o site espera

**POST** `/api/leads/submit`

```json
{
  "tipoCliente": "PF",
  "nome": "João Silva",
  "cpfCnpj": "123.456.789-00",
  "email": "joao@email.com",
  "telefonePrincipal": "(11) 98765-4321",
  "areaDireito": "Direito do Trabalho",
  "descricaoCaso": "Fui demitido sem justa causa...",
  "endereco": { ... }
}
```

**Response esperado**

```json
{
  "success": true,
  "data": {
    "leadId": "lead_123456",
    "status": "analisando",
    "analiseIA": {
      "categoria": "Rescisão Contratual",
      "urgencia": "media",
      "scoreConfianca": 0.92,
      "documentosNecessarios": [...],
      "recomendacoes": [...]
    }
  }
}
```

**Veja detalhes em:** `API_INTEGRATION.md`

---

## 🔐 Segurança

### Checklist de Segurança

- [ ] HTTPS/SSL ativado
- [ ] JWT_SECRET configurado (mínimo 32 caracteres)
- [ ] CORS configurado corretamente
- [ ] Rate limiting ativo
- [ ] Variáveis sensíveis em .env (não no Git)
- [ ] Backup automático configurado
- [ ] Logs monitorados

**Veja detalhes em:** `SECURITY_CONFIG.md`

---

## 🧪 Testar Localmente (Antes de Deploy)

```bash
# 1. Instalar dependências
pnpm install

# 2. Iniciar servidor de desenvolvimento
pnpm dev

# 3. Abrir no navegador
http://localhost:5173

# 4. Testar formulário
# Preencher e submeter formulário

# 5. Verificar console
# Deve aparecer requisição para API
```

---

## 📱 Responsividade

O site foi testado em:
- ✅ iPhone (375px)
- ✅ iPad (768px)
- ✅ Desktop (1920px)
- ✅ Tablets Android
- ✅ Navegadores: Chrome, Firefox, Safari, Edge

---

## 🚀 Após Deploy

### Próximas Ações

1. **Testar Formulário**
   - Submeter lead de teste
   - Verificar se chega na API

2. **Configurar Email/WhatsApp**
   - Enviar confirmação ao cliente
   - Notificar advogado

3. **Implementar Portal do Advogado**
   - Adicionar autenticação
   - Conectar ao banco de dados

4. **Otimizar Performance**
   - Rodar Lighthouse
   - Melhorar Core Web Vitals

5. **Monitorar Analytics**
   - Acompanhar visitantes
   - Rastrear conversões

---

## 🆘 Problemas Comuns

### Site não abre
```
1. Verificar se domínio está apontado
2. Verificar se SSL está ativo
3. Verificar logs do servidor
```

### Formulário não envia
```
1. Verificar se API está respondendo
2. Verificar CORS
3. Verificar variáveis de ambiente
```

### Performance lenta
```
1. Ativar gzip no Nginx
2. Implementar cache
3. Otimizar imagens
```

---

## 📞 Suporte

### Documentação Completa
- `DEPLOYMENT_GODADDY.md` - Deploy detalhado
- `API_INTEGRATION.md` - Integração com IA
- `SECURITY_CONFIG.md` - Segurança
- `README.md` - Documentação técnica

### Contato
- **Hostinger**: https://www.hostinger.com.br/suporte
- **Speedinx**: https://www.speedinx.com.br/suporte

---

## ✅ Checklist de Deployment

- [ ] Arquivo `advocacia-ai-landing-complete.tar.gz` baixado
- [ ] Conta criada no provedor (Hostinger ou Speedinx)
- [ ] Domínio registrado
- [ ] SSH habilitado
- [ ] Manual lido (Hostinger ou Speedinx)
- [ ] Arquivos transferidos
- [ ] Dependências instaladas
- [ ] .env.production configurado
- [ ] Build gerado
- [ ] PM2 iniciado
- [ ] Nginx configurado
- [ ] SSL ativado
- [ ] Site acessível via HTTPS
- [ ] Formulário testado
- [ ] Analytics funcionando

---

## 🎉 Parabéns!

Seu site de captura de leads está no ar! 🚀

**Próximos passos:**
1. Monitorar leads recebidos
2. Integrar com sua API de IA
3. Implementar portal do advogado
4. Otimizar conversão
5. Escalar para mais advogados

---

**Dúvidas?** Consulte os manuais específicos ou entre em contato com o suporte do seu provedor.
