# 🚀 Guia Completo: GitHub + Vercel + React para Advocacia.AI

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Pré-requisitos](#pré-requisitos)
3. [Setup GitHub](#setup-github)
4. [Deploy no Vercel](#deploy-no-vercel)
5. [Integração com CRM](#integração-com-crm)
6. [Atualizar Site](#atualizar-site)
7. [Monitoramento](#monitoramento)

---

## 🎯 Visão Geral

### O que você vai ter:

- ✅ Site React super rápido
- ✅ Deploy automático via Git
- ✅ Hospedagem gratuita (Vercel)
- ✅ HTTPS automático
- ✅ Domínio customizado
- ✅ Versionamento de código
- ✅ Histórico de mudanças
- ✅ Fácil de atualizar

### Vantagens:

```
✅ Grátis (até certo ponto)
✅ Muito rápido
✅ Deploy automático
✅ Escalável
✅ Profissional
✅ Código versionado
✅ Fácil colaboração
```

### Tempo estimado:
- Setup: 30 minutos
- Deploy: 10 minutos
- Total: 1 hora

---

## 📋 Pré-requisitos

### Contas Necessárias

1. **GitHub** (Gratuito)
   - [github.com](https://github.com)
   - Crie conta se não tiver

2. **Vercel** (Gratuito)
   - [vercel.com](https://vercel.com)
   - Crie conta com GitHub

3. **Domínio** (Opcional)
   - seu-dominio.com.br
   - Pode usar subdomínio Vercel grátis

4. **Editor de Código** (Gratuito)
   - VS Code: [code.visualstudio.com](https://code.visualstudio.com)
   - Recomendado

---

## 🔧 Setup GitHub

### Passo 1: Criar Repositório

1. Acesse [github.com](https://github.com)
2. Faça login
3. Clique em **New Repository**
4. Preencha:
   - **Repository name**: `advocacia-ai-landing`
   - **Description**: `Landing page para captura de leads jurídicos`
   - **Public**: Sim (recomendado)
   - **Add .gitignore**: Node
   - **Add license**: MIT
5. Clique em **Create repository**

### Passo 2: Clonar Repositório Localmente

```bash
# Abrir terminal/cmd
cd /caminho/onde/quer/salvar

# Clonar repositório
git clone https://github.com/seu-usuario/advocacia-ai-landing.git

# Entrar na pasta
cd advocacia-ai-landing
```

### Passo 3: Adicionar Código do Projeto

```bash
# Copiar arquivos do projeto para a pasta
# (Copie os arquivos do projeto React)

# Verificar status
git status

# Adicionar todos os arquivos
git add .

# Fazer commit
git commit -m "Initial commit: Advocacia.AI landing page"

# Fazer push para GitHub
git push origin main
```

### Passo 4: Configurar Variáveis de Ambiente

1. No repositório GitHub, vá para **Settings > Secrets and variables > Actions**
2. Clique em **New repository secret**
3. Adicione cada variável:

```
VITE_FRONTEND_FORGE_API_URL=https://sua-api-ia.com
VITE_FRONTEND_FORGE_API_KEY=sua-chave-api-secreta
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
FACEBOOK_PIXEL_ID=XXXXXXXXXX
GTM_ID=GTM-XXXXXXXXXX
```

---

## 🚀 Deploy no Vercel

### Passo 1: Conectar Vercel ao GitHub

1. Acesse [vercel.com](https://vercel.com)
2. Clique em **New Project**
3. Selecione **Import Git Repository**
4. Procure por `advocacia-ai-landing`
5. Clique em **Import**

### Passo 2: Configurar Projeto

1. **Project Name**: `advocacia-ai-landing`
2. **Framework Preset**: `Vite`
3. **Root Directory**: `./`
4. **Build Command**: `pnpm build`
5. **Output Directory**: `dist`
6. **Install Command**: `pnpm install`

### Passo 3: Adicionar Variáveis de Ambiente

1. Na tela de configuração, clique em **Environment Variables**
2. Adicione as mesmas variáveis do GitHub:

```
VITE_FRONTEND_FORGE_API_URL=https://sua-api-ia.com
VITE_FRONTEND_FORGE_API_KEY=sua-chave-api-secreta
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
FACEBOOK_PIXEL_ID=XXXXXXXXXX
GTM_ID=GTM-XXXXXXXXXX
```

### Passo 4: Deploy

1. Clique em **Deploy**
2. Aguarde o build completar
3. Seu site estará em: `https://advocacia-ai-landing.vercel.app`

---

## 🔗 Configurar Domínio Customizado

### Opção A: Domínio Registrado em Outro Lugar

1. No Vercel, vá para **Settings > Domains**
2. Clique em **Add Domain**
3. Digite seu domínio: `seu-dominio.com.br`
4. Siga as instruções para apontar DNS
5. Adicione registros CNAME:

```
Nome: www
Valor: cname.vercel-dns.com

Nome: @
Valor: alias.vercel.sh
```

### Opção B: Registrar Domínio no Vercel

1. No Vercel, vá para **Settings > Domains**
2. Clique em **Add Domain**
3. Clique em **Purchase Domain**
4. Siga o processo de compra

---

## 🔗 Integração com CRM

### Fluxo de Dados

```
Formulário React
    ↓
Vercel (hospedagem)
    ↓
Zapier/Make (automação)
    ↓
Sua API de IA
    ↓
RD Station / Google Sheets / Email
```

### Configurar Webhook no Formulário

No arquivo `client/src/lib/api.ts`:

```typescript
export async function submitLead(formData: any) {
  try {
    // 1. Enviar para sua API de IA
    const iaResponse = await fetch('https://sua-api-ia.com/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_FRONTEND_FORGE_API_KEY}`
      },
      body: JSON.stringify(formData)
    });

    const iaResult = await iaResponse.json();

    // 2. Enviar para Zapier
    await fetch('https://hooks.zapier.com/hooks/catch/seu-id/seu-webhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        analiseIA: iaResult
      })
    });

    return iaResult;
  } catch (error) {
    console.error('Erro ao enviar lead:', error);
    throw error;
  }
}
```

### Configurar Zapier

1. Acesse [zapier.com](https://zapier.com)
2. Clique em **Create Zap**
3. Trigger: **Webhooks by Zapier > Catch Raw Hook**
4. Copie a URL do webhook
5. Adicione em `api.ts` (veja acima)
6. Actions:
   - **Google Sheets > Create Spreadsheet Row** (backup)
   - **RD Station > Create Contact** (CRM)
   - **Gmail > Send Email** (notificação)
   - **Twilio > Send SMS** (WhatsApp)

---

## 🔄 Atualizar Site

### Fluxo de Atualização

```
1. Editar código localmente
   ↓
2. Fazer commit no Git
   ↓
3. Fazer push para GitHub
   ↓
4. Vercel detecta mudança
   ↓
5. Vercel faz build automático
   ↓
6. Site atualizado em produção
```

### Exemplo: Adicionar Novo Artigo no Blog

```bash
# 1. Editar arquivo localmente
nano client/src/lib/blog.ts
# Adicionar novo artigo

# 2. Salvar arquivo

# 3. Fazer commit
git add client/src/lib/blog.ts
git commit -m "Add new blog article: Direito Médico"

# 4. Fazer push
git push origin main

# 5. Vercel detecta e faz deploy automático
# Seu site estará atualizado em ~2 minutos
```

### Exemplo: Editar Página Home

```bash
# 1. Editar componente
nano client/src/pages/Home.tsx

# 2. Fazer commit
git add client/src/pages/Home.tsx
git commit -m "Update home page hero text"

# 3. Fazer push
git push origin main

# 4. Deploy automático
```

---

## 📊 Monitoramento

### Ver Logs de Deploy

1. No Vercel, vá para **Deployments**
2. Clique no deploy mais recente
3. Veja logs de build e erros

### Monitorar Performance

1. No Vercel, vá para **Analytics**
2. Veja métricas de:
   - Tempo de resposta
   - Requisições
   - Erros
   - Usuários

### Monitorar Leads

1. Acesse seu CRM (RD Station, Google Sheets, etc)
2. Veja leads capturados
3. Acompanhe análise da IA

---

## 🔐 Segurança

### Variáveis Sensíveis

**NUNCA** commite variáveis sensíveis no Git!

```bash
# ❌ Errado
git add .env.production
git commit -m "Add env variables"

# ✅ Correto
# Adicione em Vercel Settings > Environment Variables
```

### .gitignore

Certifique-se que `.gitignore` contém:

```
.env
.env.local
.env.production
node_modules/
dist/
.DS_Store
```

---

## 🚀 Fluxo Completo de Desenvolvimento

### Dia 1: Setup
```bash
# 1. Criar repositório GitHub
# 2. Clonar localmente
git clone https://github.com/seu-usuario/advocacia-ai-landing.git

# 3. Instalar dependências
cd advocacia-ai-landing
pnpm install

# 4. Testar localmente
pnpm dev
# Abrir http://localhost:5173
```

### Dia 2: Deploy
```bash
# 1. Fazer push para GitHub
git add .
git commit -m "Initial commit"
git push origin main

# 2. Conectar Vercel
# (Seguir passos acima)

# 3. Seu site está no ar! 🎉
```

### Dia 3+: Manutenção
```bash
# Fazer mudanças
nano client/src/pages/Home.tsx

# Testar localmente
pnpm dev

# Fazer commit
git add .
git commit -m "Update home page"

# Fazer push (deploy automático!)
git push origin main
```

---

## 📋 Checklist

### Setup
- [ ] Conta GitHub criada
- [ ] Conta Vercel criada
- [ ] Repositório criado
- [ ] Código clonado localmente

### Configuração
- [ ] Variáveis de ambiente adicionadas
- [ ] Build testado localmente
- [ ] Vercel conectado ao GitHub

### Deploy
- [ ] Projeto importado no Vercel
- [ ] Build bem-sucedido
- [ ] Site acessível
- [ ] HTTPS funcionando

### Integração
- [ ] Zapier configurado
- [ ] CRM conectado
- [ ] IA integrada
- [ ] Webhooks testados

### Testes
- [ ] Formulário funciona
- [ ] Dados chegam no CRM
- [ ] IA processa corretamente
- [ ] Notificações funcionam
- [ ] Performance OK

---

## 🎯 Próximos Passos

1. ✅ Criar repositório GitHub
2. ✅ Clonar localmente
3. ✅ Fazer push
4. ✅ Conectar Vercel
5. ✅ Deploy automático
6. ✅ Configurar domínio
7. ✅ Integrar CRM
8. ✅ Integrar IA
9. ✅ Testar tudo
10. ✅ Lançar site

---

## 📞 Suporte

### Documentação
- [GitHub Docs](https://docs.github.com)
- [Vercel Docs](https://vercel.com/docs)
- [React Docs](https://react.dev)
- [Vite Docs](https://vitejs.dev)

### Comunidades
- GitHub Community
- Vercel Community
- React Community

---

## 🎉 Benefícios dessa Abordagem

```
✅ Grátis (até certo ponto)
✅ Deploy automático (git push)
✅ Histórico de mudanças (Git)
✅ Colaboração fácil (GitHub)
✅ Performance excelente (Vercel)
✅ Escalável (infraestrutura global)
✅ Profissional (como grandes empresas)
✅ Fácil de manter (código versionado)
```

---

**Tempo total: ~1 hora para estar no ar!**

Bom desenvolvimento! 🚀
