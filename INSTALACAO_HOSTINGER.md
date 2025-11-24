# 🚀 Guia Completo: Instalação Advocacia.AI em Hostinger

## 📋 Pré-requisitos

- ✅ Conta Hostinger ativa
- ✅ Domínio registrado (seu-dominio.com)
- ✅ Plano com suporte a Node.js (Business ou superior recomendado)
- ✅ Acesso SSH habilitado
- ✅ Arquivo `advocacia-ai-landing-complete.tar.gz`

---

## 🔧 Passo 1: Acessar Painel Hostinger

1. Acesse [hostinger.com.br](https://www.hostinger.com.br)
2. Faça login na sua conta
3. Vá para **Produtos > Hospedagem**
4. Clique no seu plano

---

## 🔑 Passo 2: Habilitar SSH

1. No painel Hostinger, vá para **Configurações > SSH**
2. Clique em **Habilitar SSH**
3. Anote as informações:
   - **Host**: seu-dominio.com ou IP do servidor
   - **Porta**: 22 (padrão)
   - **Usuário**: seu-usuario
   - **Senha**: sua-senha

---

## 💻 Passo 3: Conectar via SSH

### Windows (PuTTY)
1. Baixe [PuTTY](https://www.putty.org/)
2. Abra PuTTY
3. Preencha:
   - Host: seu-dominio.com
   - Port: 22
4. Clique "Open"
5. Login: seu-usuario
6. Senha: sua-senha

### Mac/Linux (Terminal)
```bash
ssh seu-usuario@seu-dominio.com
```

---

## 📦 Passo 4: Preparar Servidor

```bash
# 1. Atualizar sistema
sudo apt-get update && sudo apt-get upgrade -y

# 2. Instalar Node.js (versão LTS)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Instalar pnpm
npm install -g pnpm

# 4. Instalar PM2 (gerenciador de processos)
npm install -g pm2

# 5. Instalar Nginx (servidor web)
sudo apt-get install -y nginx

# 6. Instalar Git (para versionamento)
sudo apt-get install -y git

# 7. Verificar instalações
node --version
npm --version
pnpm --version
nginx -v
```

---

## 📂 Passo 5: Transferir Arquivos

### Opção A: Via SCP (Recomendado)

**No seu computador local:**

```bash
# Copiar arquivo para servidor
scp advocacia-ai-landing-complete.tar.gz seu-usuario@seu-dominio.com:~/

# Conectar ao servidor
ssh seu-usuario@seu-dominio.com

# No servidor, descompactar
cd ~
tar -xzf advocacia-ai-landing-complete.tar.gz
cd advocacia-ai-landing
```

### Opção B: Via Git

**No servidor:**

```bash
# Se você tem repositório Git
cd ~
git clone https://seu-repositorio.git advocacia-ai-landing
cd advocacia-ai-landing
```

---

## ⚙️ Passo 6: Instalar Dependências

```bash
# No servidor, dentro da pasta do projeto
cd ~/advocacia-ai-landing

# Instalar dependências
pnpm install --frozen-lockfile

# Build para produção
pnpm build

# Verificar se build foi bem-sucedido
ls -la dist/
```

---

## 🔐 Passo 7: Configurar Variáveis de Ambiente

```bash
# Criar arquivo .env.production
nano .env.production
```

**Cole o seguinte conteúdo (ajuste conforme necessário):**

```env
# APLICAÇÃO
NODE_ENV=production
PORT=3000
APP_URL=https://seu-dominio.com
APP_NAME=Advocacia.AI

# AUTENTICAÇÃO
JWT_SECRET=sua-chave-super-secreta-minimo-32-caracteres-aleatorios
CORS_ORIGIN=https://seu-dominio.com,https://www.seu-dominio.com

# API DE IA (Configure com seus dados)
VITE_FRONTEND_FORGE_API_URL=https://sua-api-ia.com
VITE_FRONTEND_FORGE_API_KEY=sua-chave-api-aqui

# BANCO DE DADOS (Opcional - se usar)
DATABASE_URL=postgresql://usuario:senha@localhost:5432/advocacia_ai

# EMAIL (Para notificações)
SMTP_HOST=smtp.seu-provedor.com
SMTP_PORT=587
SMTP_USER=seu-email@seu-dominio.com
SMTP_PASS=sua-senha-email
SMTP_FROM=noreply@seu-dominio.com

# ANALYTICS
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
GOOGLE_ADS_ID=AW-XXXXXXXXXX
FACEBOOK_PIXEL_ID=XXXXXXXXXX
GTM_ID=GTM-XXXXXXXXXX
```

**Salvar:** Ctrl+X, depois Y, depois Enter

---

## 🚀 Passo 8: Iniciar Aplicação com PM2

```bash
# Criar arquivo ecosystem.config.js
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'advocacia-ai',
    script: 'dist/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    autorestart: true,
    watch: false,
    max_memory_restart: '500M'
  }]
};
EOF

# Criar pasta de logs
mkdir -p logs

# Iniciar com PM2
pm2 start ecosystem.config.js

# Salvar configuração
pm2 save

# Configurar para iniciar automaticamente
pm2 startup
# Copie e execute o comando que aparecer na tela
```

---

## 🌐 Passo 9: Configurar Nginx

```bash
# Criar arquivo de configuração
sudo nano /etc/nginx/sites-available/advocacia-ai
```

**Cole o seguinte:**

```nginx
upstream advocacia_ai {
    server 127.0.0.1:3000;
    keepalive 64;
}

server {
    listen 80;
    listen [::]:80;
    server_name seu-dominio.com www.seu-dominio.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name seu-dominio.com www.seu-dominio.com;

    # Certificados SSL (será gerado no próximo passo)
    ssl_certificate /etc/letsencrypt/live/seu-dominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/seu-dominio.com/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Headers de segurança
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css text/javascript application/json application/javascript;
    gzip_min_length 1000;

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

**Salvar:** Ctrl+X, Y, Enter

```bash
# Ativar configuração
sudo ln -s /etc/nginx/sites-available/advocacia-ai /etc/nginx/sites-enabled/

# Testar configuração
sudo nginx -t

# Reiniciar Nginx
sudo systemctl restart nginx
```

---

## 🔐 Passo 10: Configurar SSL com Let's Encrypt

```bash
# Instalar Certbot
sudo apt-get install -y certbot python3-certbot-nginx

# Gerar certificado
sudo certbot certonly --nginx -d seu-dominio.com -d www.seu-dominio.com

# Renovação automática
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer

# Testar renovação
sudo certbot renew --dry-run
```

---

## ✅ Passo 11: Verificar Instalação

```bash
# Verificar status do PM2
pm2 status

# Ver logs em tempo real
pm2 logs advocacia-ai

# Testar acesso local
curl http://localhost:3000

# Verificar Nginx
sudo systemctl status nginx

# Testar acesso via HTTPS
curl https://seu-dominio.com
```

---

## 🔗 Passo 12: Apontar Domínio

1. No painel Hostinger, vá para **Domínios**
2. Clique no seu domínio
3. Vá para **Gerenciar DNS**
4. Adicione/Atualize registros:

| Tipo | Nome | Valor |
|------|------|-------|
| A | @ | IP do seu servidor |
| A | www | IP do seu servidor |
| CNAME | www | seu-dominio.com |

**Nota:** O IP do servidor está no painel Hostinger em **Configurações > Informações do Servidor**

---

## 🐛 Troubleshooting

### Problema: Porta 3000 não acessível
```bash
sudo ufw allow 3000
sudo ufw allow 80
sudo ufw allow 443
```

### Problema: Certificado SSL não funciona
```bash
sudo certbot renew --force-renewal
sudo systemctl restart nginx
```

### Problema: Aplicação não inicia
```bash
pm2 logs advocacia-ai --err
```

### Problema: Nginx retorna 502 Bad Gateway
```bash
# Verificar se PM2 está rodando
pm2 status

# Reiniciar PM2
pm2 restart advocacia-ai

# Verificar logs
pm2 logs advocacia-ai
```

---

## 📊 Monitoramento

```bash
# Ver status em tempo real
pm2 monit

# Ver logs
pm2 logs

# Reiniciar aplicação
pm2 restart advocacia-ai

# Parar aplicação
pm2 stop advocacia-ai

# Iniciar aplicação
pm2 start advocacia-ai

# Deletar aplicação
pm2 delete advocacia-ai
```

---

## 🔄 Atualizar Aplicação

```bash
# Parar aplicação
pm2 stop advocacia-ai

# Atualizar código
cd ~/advocacia-ai-landing
git pull origin main  # Se usar Git
# OU
# Descompactar novo arquivo

# Reinstalar dependências
pnpm install

# Rebuild
pnpm build

# Reiniciar
pm2 restart advocacia-ai
```

---

## 📋 Checklist Final

- [ ] Node.js instalado
- [ ] pnpm instalado
- [ ] PM2 instalado
- [ ] Nginx instalado
- [ ] Arquivos transferidos
- [ ] Dependências instaladas
- [ ] Build gerado
- [ ] .env.production configurado
- [ ] PM2 iniciado
- [ ] Nginx configurado
- [ ] SSL configurado
- [ ] Domínio apontado
- [ ] Site acessível via HTTPS
- [ ] Analytics funcionando
- [ ] Formulário testado

---

## 🎉 Sucesso!

Seu site está pronto! Acesse: **https://seu-dominio.com**

**Próximos passos:**
1. Testar formulário de captura de leads
2. Configurar integração com API de IA
3. Configurar banco de dados
4. Implementar portal do advogado com autenticação
5. Configurar notificações por email/WhatsApp

---

**Suporte:** Em caso de dúvidas, consulte os arquivos:
- `DEPLOYMENT_GODADDY.md` - Detalhes técnicos
- `API_INTEGRATION.md` - Integração com IA
- `SECURITY_CONFIG.md` - Segurança e variáveis
