# 🔒 Guia de Segurança e Configuração

## 📋 Índice
1. [Variáveis de Ambiente](#variáveis-de-ambiente)
2. [Segurança da API](#segurança-da-api)
3. [HTTPS e SSL](#https-e-ssl)
4. [Proteção de Dados](#proteção-de-dados)
5. [Rate Limiting](#rate-limiting)
6. [CORS](#cors)
7. [Backup e Recuperação](#backup-e-recuperação)
8. [Monitoramento](#monitoramento)

---

## Variáveis de Ambiente

### Arquivo `.env.production`

Crie este arquivo na raiz do projeto (NÃO commitar no Git):

```env
# ==========================================
# APLICAÇÃO
# ==========================================
NODE_ENV=production
PORT=3000
APP_URL=https://seu-dominio.com
APP_NAME=Advocacia.AI

# ==========================================
# AUTENTICAÇÃO E SEGURANÇA
# ==========================================
JWT_SECRET=sua-chave-jwt-super-secreta-minimo-32-caracteres
JWT_EXPIRATION=7d
CORS_ORIGIN=https://seu-dominio.com,https://www.seu-dominio.com

# ==========================================
# API DE IA
# ==========================================
VITE_FRONTEND_FORGE_API_URL=https://sua-api-ia.com
VITE_FRONTEND_FORGE_API_KEY=sua-chave-api-secreta
IA_API_URL=https://sua-ia-api.com
IA_API_KEY=sua-chave-ia-secreta
IA_MODEL=gpt-4-turbo

# ==========================================
# BANCO DE DADOS
# ==========================================
DATABASE_URL=postgresql://usuario:senha@localhost:5432/advocacia_ai
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=10
DATABASE_SSL=true

# ==========================================
# EMAIL (NOTIFICAÇÕES)
# ==========================================
SMTP_HOST=smtp.seu-provedor.com
SMTP_PORT=587
SMTP_USER=seu-email@seu-dominio.com
SMTP_PASS=sua-senha-email
SMTP_FROM=noreply@seu-dominio.com
SMTP_FROM_NAME=Advocacia.AI

# ==========================================
# SMS/WHATSAPP (OPCIONAL)
# ==========================================
TWILIO_ACCOUNT_SID=seu-account-sid
TWILIO_AUTH_TOKEN=seu-auth-token
TWILIO_PHONE_NUMBER=+55XXXXXXXXXX

# ==========================================
# ANALYTICS
# ==========================================
VITE_ANALYTICS_ENDPOINT=https://seu-dominio.com/analytics
VITE_ANALYTICS_WEBSITE_ID=seu-website-id
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
GOOGLE_ADS_ID=AW-XXXXXXXXXX
FACEBOOK_PIXEL_ID=XXXXXXXXXX
GTM_ID=GTM-XXXXXXXXXX

# ==========================================
# ARMAZENAMENTO (S3 OU SIMILAR)
# ==========================================
AWS_ACCESS_KEY_ID=sua-chave-acesso
AWS_SECRET_ACCESS_KEY=sua-chave-secreta
AWS_REGION=us-east-1
AWS_S3_BUCKET=seu-bucket-nome

# ==========================================
# LOGGING
# ==========================================
LOG_LEVEL=info
LOG_FILE=/var/log/advocacia-ai/app.log
LOG_MAX_SIZE=10m
LOG_MAX_FILES=14

# ==========================================
# RATE LIMITING
# ==========================================
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# ==========================================
# CACHE
# ==========================================
REDIS_URL=redis://localhost:6379
CACHE_TTL=3600

# ==========================================
# SEGURANÇA ADICIONAL
# ==========================================
HELMET_ENABLED=true
HELMET_CSP_ENABLED=true
HELMET_HSTS_MAX_AGE=31536000
HELMET_HSTS_INCLUDE_SUBDOMAINS=true
HELMET_HSTS_PRELOAD=true
```

### Arquivo `.env.example`

Crie este arquivo para documentar variáveis (pode ser commitado):

```env
# Copie este arquivo para .env.production e preencha com seus valores
NODE_ENV=production
PORT=3000
APP_URL=https://seu-dominio.com
JWT_SECRET=sua-chave-secreta-aqui
VITE_FRONTEND_FORGE_API_URL=https://sua-api-ia.com
VITE_FRONTEND_FORGE_API_KEY=sua-chave-api-aqui
DATABASE_URL=postgresql://usuario:senha@localhost:5432/advocacia_ai
SMTP_HOST=smtp.seu-provedor.com
SMTP_USER=seu-email@seu-dominio.com
SMTP_PASS=sua-senha-email
# ... outras variáveis
```

---

## Segurança da API

### Autenticação com Bearer Token

```javascript
// server/middleware/auth.js
const jwt = require('jsonwebtoken');

function authenticateAPI(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Token não fornecido'
    });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Token inválido ou expirado'
    });
  }
}

module.exports = authenticateAPI;
```

### Validação de Entrada

```javascript
// server/middleware/validation.js
const { body, validationResult } = require('express-validator');

function validateLead() {
  return [
    body('nome').trim().notEmpty().isLength({ min: 3, max: 100 }),
    body('email').isEmail().normalizeEmail(),
    body('cpfCnpj').matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/),
    body('telefonePrincipal').matches(/^\(\d{2}\)\s\d{4,5}-\d{4}$/),
    body('descricaoCaso').trim().isLength({ min: 10, max: 5000 }),
    body('areaDireito').trim().notEmpty(),
  ];
}

function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  next();
}

module.exports = { validateLead, handleValidationErrors };
```

### Sanitização de Dados

```javascript
// server/middleware/sanitize.js
const xss = require('xss');

function sanitizeInput(req, res, next) {
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = xss(req.body[key]);
      }
    });
  }
  next();
}

module.exports = sanitizeInput;
```

---

## HTTPS e SSL

### Let's Encrypt (Gratuito)

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

### Configuração Nginx com SSL

```nginx
# /etc/nginx/sites-available/advocacia-ai

# Redirecionar HTTP para HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name seu-dominio.com www.seu-dominio.com;
    return 301 https://$server_name$request_uri;
}

# HTTPS
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name seu-dominio.com www.seu-dominio.com;

    # Certificados SSL
    ssl_certificate /etc/letsencrypt/live/seu-dominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/seu-dominio.com/privkey.pem;

    # Configurações SSL seguras
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # HSTS (força HTTPS)
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;

    # Segurança adicional
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # CSP (Content Security Policy)
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https://fonts.googleapis.com;" always;

    # Proxy para Node.js
    location / {
        proxy_pass http://127.0.0.1:3000;
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

---

## Proteção de Dados

### Criptografia de Senhas

```javascript
// server/utils/crypto.js
const bcrypt = require('bcrypt');

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

module.exports = { hashPassword, comparePassword };
```

### Criptografia de Dados Sensíveis

```javascript
// server/utils/encryption.js
const crypto = require('crypto');

const algorithm = 'aes-256-gcm';
const key = crypto.scryptSync(process.env.ENCRYPTION_KEY, 'salt', 32);

function encryptData(data) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  
  let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  
  return {
    iv: iv.toString('hex'),
    data: encrypted,
    authTag: authTag.toString('hex')
  };
}

function decryptData(encrypted) {
  const decipher = crypto.createDecipheriv(
    algorithm,
    key,
    Buffer.from(encrypted.iv, 'hex')
  );
  
  decipher.setAuthTag(Buffer.from(encrypted.authTag, 'hex'));
  
  let decrypted = decipher.update(encrypted.data, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return JSON.parse(decrypted);
}

module.exports = { encryptData, decryptData };
```

### LGPD - Lei Geral de Proteção de Dados

```javascript
// server/middleware/lgpd.js
const LGPD_FIELDS = ['cpfCnpj', 'email', 'telefonePrincipal', 'telefoneAlternativo'];

function anonymizeData(lead) {
  const anonymized = { ...lead };
  
  LGPD_FIELDS.forEach(field => {
    if (anonymized[field]) {
      anonymized[field] = '***REMOVIDO***';
    }
  });
  
  return anonymized;
}

// Deletar dados após período de retenção (ex: 2 anos)
async function deleteOldLeads() {
  const twoYearsAgo = new Date();
  twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
  
  await Lead.deleteMany({
    dataCadastro: { $lt: twoYearsAgo },
    status: 'concluido'
  });
}

module.exports = { anonymizeData, deleteOldLeads };
```

---

## Rate Limiting

```javascript
// server/middleware/rateLimit.js
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Muitas requisições. Tente novamente mais tarde.',
  standardHeaders: true,
  legacyHeaders: false,
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  keyGenerator: (req) => req.headers.authorization || req.ip,
});

module.exports = { limiter, apiLimiter };
```

---

## CORS

```javascript
// server/middleware/cors.js
const cors = require('cors');

const corsOptions = {
  origin: process.env.CORS_ORIGIN?.split(',') || 'https://seu-dominio.com',
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

module.exports = cors(corsOptions);
```

---

## Backup e Recuperação

### Script de Backup Automático

```bash
#!/bin/bash
# /usr/local/bin/backup-advocacia-ai.sh

BACKUP_DIR="/backups/advocacia-ai"
DB_NAME="advocacia_ai"
DATE=$(date +%Y%m%d_%H%M%S)

# Criar diretório se não existir
mkdir -p $BACKUP_DIR

# Backup do banco de dados
pg_dump $DB_NAME | gzip > $BACKUP_DIR/db_$DATE.sql.gz

# Backup dos arquivos
tar -czf $BACKUP_DIR/files_$DATE.tar.gz /home/ubuntu/advocacia-ai-landing

# Fazer upload para S3 (opcional)
aws s3 cp $BACKUP_DIR/db_$DATE.sql.gz s3://seu-bucket/backups/

# Manter apenas últimos 30 dias
find $BACKUP_DIR -name "*.gz" -mtime +30 -delete

echo "Backup concluído: $DATE"
```

### Agendar Backup Diário

```bash
# Adicionar ao crontab
sudo crontab -e

# Adicionar linha:
0 2 * * * /usr/local/bin/backup-advocacia-ai.sh >> /var/log/backup.log 2>&1
```

---

## Monitoramento

### Logs Estruturados

```javascript
// server/utils/logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({
      filename: process.env.LOG_FILE || 'app.log',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  ],
});

module.exports = logger;
```

### Monitoramento de Performance

```javascript
// server/middleware/monitoring.js
function monitorPerformance(req, res, next) {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    
    logger.info({
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString(),
    });
    
    // Alertar se requisição demorou muito
    if (duration > 5000) {
      logger.warn({
        message: 'Requisição lenta detectada',
        method: req.method,
        path: req.path,
        duration: `${duration}ms`,
      });
    }
  });
  
  next();
}

module.exports = monitorPerformance;
```

---

## Checklist de Segurança

- [ ] Variáveis de ambiente configuradas
- [ ] JWT_SECRET com mínimo 32 caracteres
- [ ] HTTPS/SSL ativado
- [ ] HSTS configurado
- [ ] CSP (Content Security Policy) ativo
- [ ] CORS configurado corretamente
- [ ] Rate limiting implementado
- [ ] Validação de entrada em todos os endpoints
- [ ] Sanitização de dados XSS
- [ ] Criptografia de senhas (bcrypt)
- [ ] Criptografia de dados sensíveis
- [ ] Backup automático configurado
- [ ] Logs estruturados ativo
- [ ] Monitoramento de performance
- [ ] Política de retenção de dados (LGPD)
- [ ] Testes de segurança realizados

---

**Próximo passo:** Testar integração completa e fazer deploy!
