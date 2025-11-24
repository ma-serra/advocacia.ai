# 🚀 Guia Completo: Deploy em GoDaddy com React 19 + Tailwind CSS

## 📋 Índice
1. [Pré-requisitos](#pré-requisitos)
2. [Opções de Deployment](#opções-de-deployment)
3. [Deployment Recomendado (Node.js)](#deployment-recomendado)
4. [Integração com API de IA](#integração-com-api-de-ia)
5. [Portal do Advogado](#portal-do-advogado)
6. [Variáveis de Ambiente](#variáveis-de-ambiente)
7. [Monitoramento e Manutenção](#monitoramento-e-manutenção)

---

## Pré-requisitos

### Conta GoDaddy
- ✅ Domínio registrado
- ✅ Hosting com suporte a Node.js (recomendado: GoDaddy Managed WordPress com SSH ou VPS)
- ✅ Acesso SSH ao servidor
- ✅ Node.js 18+ instalado no servidor

### Ferramentas Locais
```bash
# Instalar globalmente
npm install -g pm2  # Para gerenciar processo Node.js
npm install -g git  # Para versionamento
```

---

## Opções de Deployment

### Opção 1: GoDaddy Managed Hosting (Mais Simples)
**Pros:** Fácil, suporte 24/7, gerenciado
**Contras:** Menos controle, pode ser mais caro

### Opção 2: GoDaddy VPS (Recomendado) ⭐
**Pros:** Controle total, melhor performance, escalável
**Contras:** Requer conhecimento técnico básico

### Opção 3: GoDaddy App Engine
**Pros:** Serverless, escalável automaticamente
**Contras:** Mais caro, menos controle

---

## Deployment Recomendado (Node.js em VPS GoDaddy)

### Passo 1: Preparar o Projeto Localmente

```bash
# 1. Build do projeto
cd /home/ubuntu/advocacia-ai-landing
pnpm build

# 2. Verificar se build foi bem-sucedido
ls -la dist/

# 3. Criar arquivo .env.production
cat > .env.production << 'EOF'
VITE_APP_TITLE=Advocacia.AI
VITE_APP_ID=advocacia-ai-landing
VITE_FRONTEND_FORGE_API_URL=https://seu-dominio.com/api
VITE_FRONTEND_FORGE_API_KEY=sua-chave-api-aqui
VITE_ANALYTICS_ENDPOINT=https://seu-dominio.com/analytics
VITE_ANALYTICS_WEBSITE_ID=seu-website-id
EOF
```

### Passo 2: Conectar ao Servidor GoDaddy via SSH

```bash
# Conectar ao servidor
ssh seu-usuario@seu-dominio.com

# Ou com IP específico
ssh seu-usuario@seu-ip-servidor

# Criar diretório para o projeto
mkdir -p ~/apps/advocacia-ai
cd ~/apps/advocacia-ai
```

### Passo 3: Clonar/Transferir Projeto

**Opção A: Via Git (Recomendado)**
```bash
# No servidor GoDaddy
git clone https://seu-repositorio.git .
cd advocacia-ai-landing
```

**Opção B: Via SCP (Se não usar Git)**
```bash
# No seu computador local
scp -r /home/ubuntu/advocacia-ai-landing/* seu-usuario@seu-dominio.com:~/apps/advocacia-ai/
```

### Passo 4: Instalar Dependências no Servidor

```bash
# No servidor GoDaddy
cd ~/apps/advocacia-ai-landing

# Instalar Node.js (se não tiver)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar pnpm
npm install -g pnpm

# Instalar dependências do projeto
pnpm install --frozen-lockfile

# Build para produção
pnpm build
```

### Passo 5: Configurar PM2 para Executar o App

```bash
# Instalar PM2 globalmente
npm install -g pm2

# Criar arquivo ecosystem.config.js
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'advocacia-ai',
    script: 'server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    watch: false,
    max_memory_restart: '500M'
  }]
};
EOF

# Criar diretório de logs
mkdir -p logs

# Iniciar com PM2
pm2 start ecosystem.config.js

# Salvar configuração do PM2
pm2 save

# Configurar PM2 para iniciar automaticamente após reboot
pm2 startup
```

### Passo 6: Configurar Nginx como Reverse Proxy

```bash
# Instalar Nginx
sudo apt-get install -y nginx

# Criar arquivo de configuração
sudo nano /etc/nginx/sites-available/advocacia-ai

# Adicionar configuração:
```

```nginx
upstream advocacia_ai {
    server 127.0.0.1:3000;
    keepalive 64;
}

server {
    listen 80;
    listen [::]:80;
    server_name seu-dominio.com www.seu-dominio.com;

    # Redirecionar HTTP para HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name seu-dominio.com www.seu-dominio.com;

    # Certificado SSL (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/seu-dominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/seu-dominio.com/privkey.pem;

    # Configurações SSL
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Compressão
    gzip on;
    gzip_types text/plain text/css text/javascript application/json application/javascript;
    gzip_min_length 1000;

    # Cache de assets estáticos
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        proxy_pass http://advocacia_ai;
        proxy_cache_valid 200 30d;
        add_header Cache-Control "public, max-age=2592000";
    }

    # API routes
    location /api/ {
        proxy_pass http://advocacia_ai;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Todas as outras requisições
    location / {
        proxy_pass http://advocacia_ai;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Ativar configuração
sudo ln -s /etc/nginx/sites-available/advocacia-ai /etc/nginx/sites-enabled/

# Testar configuração
sudo nginx -t

# Reiniciar Nginx
sudo systemctl restart nginx
```

### Passo 7: Configurar SSL com Let's Encrypt

```bash
# Instalar Certbot
sudo apt-get install -y certbot python3-certbot-nginx

# Gerar certificado
sudo certbot certonly --nginx -d seu-dominio.com -d www.seu-dominio.com

# Renovação automática
sudo systemctl enable certbot.timer
```

### Passo 8: Verificar Deployment

```bash
# Verificar status do PM2
pm2 status

# Ver logs em tempo real
pm2 logs advocacia-ai

# Testar acesso
curl https://seu-dominio.com

# Verificar status do Nginx
sudo systemctl status nginx
```

---

## Integração com API de IA

### Configurar Endpoints da API

**Arquivo: `client/src/lib/api.ts`**

```typescript
const API_BASE_URL = process.env.VITE_FRONTEND_FORGE_API_URL || 'https://seu-dominio.com/api';

export async function submitLead(formData: any) {
  try {
    const response = await fetch(`${API_BASE_URL}/leads/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.VITE_FRONTEND_FORGE_API_KEY}`,
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao enviar lead:', error);
    throw error;
  }
}

export async function analyzeCase(caseData: any) {
  try {
    const response = await fetch(`${API_BASE_URL}/ai/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.VITE_FRONTEND_FORGE_API_KEY}`,
      },
      body: JSON.stringify(caseData),
    });

    return await response.json();
  } catch (error) {
    console.error('Erro ao analisar caso:', error);
    throw error;
  }
}
```

### Estrutura de Dados do Lead

```typescript
interface Lead {
  id: string;
  tipoCliente: 'PF' | 'PJ';
  nome: string;
  cpfCnpj: string;
  email: string;
  telefonePrincipal: string;
  telefoneAlternativo?: string;
  canalPreferido: 'whatsapp' | 'telefone' | 'email';
  horarioPreferido: string;
  endereco: {
    cep: string;
    rua: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
  };
  areaDireito: string;
  descricaoCaso: string;
  transcricaoVoz?: string;
  dataCadastro: string;
  status: 'novo' | 'analisando' | 'analisado' | 'atribuido';
  
  // Dados da IA
  analiseIA?: {
    categoria: string;
    urgencia: 'baixa' | 'media' | 'alta' | 'critica';
    scoreConfianca: number;
    documentosNecessarios: string[];
    recomendacoes: string[];
    estimativaHonorarios?: {
      minimo: number;
      maximo: number;
      moeda: string;
    };
  };
}
```

---

## Portal do Advogado

### Estrutura de Pastas

```
client/src/pages/
├── AdvogadoDashboard.tsx      # Dashboard principal
├── LeadsPage.tsx               # Lista de leads
├── LeadDetail.tsx              # Detalhes do lead
├── AnaliseIA.tsx               # Análise gerada pela IA
└── Configuracoes.tsx           # Configurações do advogado
```

### Funcionalidades do Portal

1. **Dashboard**
   - Resumo de leads (novo, analisando, analisado)
   - Gráficos de áreas do direito mais solicitadas
   - Leads recentes
   - Estatísticas

2. **Gerenciamento de Leads**
   - Filtrar por status, área, urgência
   - Buscar por nome/CPF
   - Atribuir a advogado
   - Mudar status

3. **Análise da IA**
   - Categoria identificada
   - Nível de urgência
   - Documentos necessários
   - Estimativa de honorários
   - Recomendações

4. **Comunicação**
   - Enviar mensagem ao cliente
   - Agendar consulta
   - Histórico de interações

---

## Variáveis de Ambiente

### `.env.production` (Servidor)

```env
# Aplicação
NODE_ENV=production
PORT=3000
APP_URL=https://seu-dominio.com

# API de IA
API_KEY=sua-chave-api-secreta
API_URL=https://api-ia.seu-provedor.com
IA_MODEL=gpt-4-turbo  # ou seu modelo

# Banco de Dados (se usar)
DATABASE_URL=postgresql://user:password@localhost:5432/advocacia_ai

# Email (para notificações)
SMTP_HOST=smtp.seu-provedor.com
SMTP_PORT=587
SMTP_USER=seu-email@seu-dominio.com
SMTP_PASS=sua-senha

# Analytics
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
GOOGLE_ADS_ID=AW-XXXXXXXXXX
FACEBOOK_PIXEL_ID=XXXXXXXXXX
GTM_ID=GTM-XXXXXXXXXX

# Segurança
JWT_SECRET=sua-chave-jwt-super-secreta
CORS_ORIGIN=https://seu-dominio.com
```

---

## Monitoramento e Manutenção

### Verificar Saúde do Servidor

```bash
# Verificar uso de recursos
top

# Verificar espaço em disco
df -h

# Verificar logs de erro
pm2 logs advocacia-ai --err

# Verificar status do Nginx
sudo systemctl status nginx

# Verificar certificado SSL
sudo certbot certificates
```

### Atualizações

```bash
# Atualizar código
cd ~/apps/advocacia-ai-landing
git pull origin main

# Reinstalar dependências (se necessário)
pnpm install

# Rebuild
pnpm build

# Reiniciar aplicação
pm2 restart advocacia-ai
```

### Backups

```bash
# Backup diário
0 2 * * * tar -czf ~/backups/advocacia-ai-$(date +\%Y\%m\%d).tar.gz ~/apps/advocacia-ai-landing

# Manter últimos 30 dias
find ~/backups -name "advocacia-ai-*.tar.gz" -mtime +30 -delete
```

---

## Checklist Final

- [ ] Domínio apontado para IP do servidor GoDaddy
- [ ] Node.js instalado no servidor
- [ ] Projeto clonado/transferido
- [ ] Dependências instaladas
- [ ] Build gerado com sucesso
- [ ] PM2 configurado e rodando
- [ ] Nginx configurado como reverse proxy
- [ ] SSL configurado com Let's Encrypt
- [ ] Variáveis de ambiente configuradas
- [ ] API de IA conectada e testada
- [ ] Banco de dados configurado (se usar)
- [ ] Email configurado para notificações
- [ ] Monitoramento ativo (PM2, logs)
- [ ] Backups configurados
- [ ] Site acessível via HTTPS

---

## Suporte e Troubleshooting

### Problema: Porta 3000 não acessível
```bash
# Verificar se porta está aberta
sudo ufw allow 3000

# Verificar se PM2 está rodando
pm2 status
```

### Problema: Certificado SSL não funciona
```bash
# Renovar certificado
sudo certbot renew --force-renewal

# Verificar validade
sudo certbot certificates
```

### Problema: Aplicação lenta
```bash
# Aumentar memória no PM2
pm2 start ecosystem.config.js --max-memory-restart 1G

# Verificar logs
pm2 logs advocacia-ai
```

---

**Próximos passos:** Após deployment, implemente o portal do advogado e integre completamente com sua API de IA!
