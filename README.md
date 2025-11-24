# 🚀 ADVOCACIA.AI - LANDING PAGE

Landing page completa para captação de leads jurídicos com Inteligência Artificial integrada.

## 📋 ÍNDICE

- [Visão Geral](#visão-geral)
- [Funcionalidades](#funcionalidades)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Instalação e Configuração](#instalação-e-configuração)
- [Integração com Backend](#integração-com-backend)
- [Configuração de Analytics](#configuração-de-analytics)
- [SEO e Performance](#seo-e-performance)
- [Deploy](#deploy)
- [Troubleshooting](#troubleshooting)

---

## 🎯 VISÃO GERAL

Landing page otimizada para conversão que conecta clientes a advogados usando IA. Recursos principais:

- ✅ **Formulário multi-step inteligente** com validação em tempo real
- ✅ **Reconhecimento de voz (Web Speech API)** para entrada por áudio
- ✅ **Análise por IA** que classifica casos automaticamente
- ✅ **Totalmente responsivo** (mobile-first design)
- ✅ **Tracking completo** (Google Analytics 4, Google Ads, Facebook Pixel)
- ✅ **SEO otimizado** (Schema.org, Open Graph, meta tags)
- ✅ **Performance 90+** no Lighthouse

---

## ⚡ FUNCIONALIDADES

### 1. **Formulário Progressivo EVA**
- 4 etapas de qualificação
- Validação CPF/CNPJ em tempo real
- Máscaras automáticas de input
- Busca automática de CEP (ViaCEP API)
- Geolocalização via GPS

### 2. **Reconhecimento de Voz**
- Transcrição automática de áudio para texto
- Suporte para português brasileiro
- Feedback visual e sonoro
- Compatibilidade: Chrome, Edge, Safari (iOS 14.5+)

### 3. **Integração IA**
- Classificação automática de área do direito
- Score de confiança
- Análise de urgência
- Sugestão de documentos necessários

### 4. **Analytics Completo**
- Tracking de todos os eventos
- Conversões Google Ads
- Facebook Pixel integrado
- Scroll depth, time on page, abandono de formulário

---

## 📁 ESTRUTURA DO PROJETO

```
advocacia-ai-landing/
├── index.html              # Página principal
├── css/
│   └── style.css          # Estilos completos (responsivo)
├── js/
│   ├── app.js             # Lógica principal (formulário, validações)
│   ├── eva.js             # Reconhecimento de voz e IA
│   └── analytics.js       # Google Analytics, Ads, Facebook Pixel
├── assets/
│   └── images/            # Imagens (logos, placeholders)
└── README.md              # Este arquivo
```

---

## 🔧 INSTALAÇÃO E CONFIGURAÇÃO

### **Passo 1: Download dos Arquivos**

Baixe todos os arquivos e organize conforme a estrutura acima.

### **Passo 2: Configurar API Backend**

Edite `js/app.js` linha 12-15:

```javascript
const CONFIG = {
    API_URL: 'https://api.advocacia.ai',        // Produção
    API_LOCAL: 'http://localhost:8000',         // Desenvolvimento
    USE_LOCAL: window.location.hostname === 'localhost',
    OPENAI_ENDPOINT: '/api/leads/',             // Seu endpoint FastAPI
    // ...
};
```

### **Passo 3: Configurar Analytics**

#### **Google Analytics 4**

Edite `index.html` linha 44:
```html
<script>
  (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','GTM-XXXXXXX'); // ← Altere aqui
</script>
```

Edite `js/analytics.js` linha 9:
```javascript
const ANALYTICS_CONFIG = {
    GA4_ID: 'G-XXXXXXXXXX',      // ← Seu ID Google Analytics 4
    GOOGLE_ADS_ID: 'AW-XXXXXXXXX', // ← Seu ID Google Ads
    FB_PIXEL_ID: 'YOUR_PIXEL_ID',  // ← Seu ID Facebook Pixel
    // ...
};
```

#### **Facebook Pixel**

Edite `index.html` linha 57:
```html
fbq('init', 'YOUR_PIXEL_ID'); // ← Seu Pixel ID aqui
```

#### **Google Ads Conversion**

Edite `js/app.js` linha 636:
```javascript
gtag('event', 'conversion', {
    'send_to': 'AW-XXXXXXXX/XXXXXX', // ← Seu Conversion ID
    'value': 1.0,
    'currency': 'BRL'
});
```

### **Passo 4: Configurar WhatsApp**

Edite `js/app.js` linha 19:
```javascript
WHATSAPP_NUMBER: '5511999999999', // ← Seu número com DDI+DDD
```

Edite `index.html` (buscar por `wa.me`):
```html
<a href="https://wa.me/5511999999999?text=Olá!%20Vim%20do%20site" 
   class="whatsapp-float">
```

---

## 🔌 INTEGRAÇÃO COM BACKEND

### **Endpoint Esperado: POST /api/leads/**

**Request Body:**
```json
{
  "tipo_pessoa": "pf",
  "nome_razao": "João Silva",
  "cpf_cnpj": "123.456.789-00",
  "telefone": "(11) 99999-9999",
  "email": "joao@email.com",
  "descricao": "Fui demitido sem justa causa...",
  "cep": "01310-100",
  "cidade": "São Paulo",
  "estado": "SP",
  "geolat": -23.561684,
  "geolon": -46.655981,
  "origem": "web-landing"
}
```

**Response Esperada:**
```json
{
  "lead_id": "uuid-aqui",
  "ia": {
    "area": "Direito do Trabalho",
    "confidence": 0.95,
    "tags": ["demissão", "verbas rescisórias"],
    "urgency": "media"
  }
}
```

### **CORS (se backend separado)**

Configure CORS no FastAPI:
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://advocacia.ai"],  # Seu domínio
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 📊 CONFIGURAÇÃO DE ANALYTICS

### **1. Google Tag Manager (Recomendado)**

1. Crie conta em [tagmanager.google.com](https://tagmanager.google.com)
2. Substitua `GTM-XXXXXXX` pelo seu ID
3. Configure tags no GTM:
   - Google Analytics 4
   - Google Ads Conversion Tracking
   - Facebook Pixel

### **2. Eventos Customizados**

Eventos já implementados (automáticos):
- `form_start` - Usuário começa a preencher
- `form_step` - Cada etapa concluída
- `ia_analysis_complete` - IA finaliza análise
- `lead_submit` - Formulário enviado com sucesso
- `scroll_depth` - 25%, 50%, 75%, 100%
- `time_on_page` - Tempo na página
- `voice_recording_start` - Início de gravação de voz

### **3. Conversões Google Ads**

Configure em: Google Ads → Ferramentas → Conversões → Nova Conversão

Tipo: **Envio de formulário de leads**

Copie o ID de conversão e cole em `js/app.js` linha 636.

---

## 🔍 SEO E PERFORMANCE

### **SEO On-Page (já implementado)**

✅ **Meta Tags**
- Title otimizado
- Description persuasiva
- Keywords relevantes
- Canonical URL

✅ **Open Graph** (Facebook/LinkedIn)
- og:title, og:description, og:image
- Twitter Card

✅ **Structured Data** (Schema.org)
- Type: ProfessionalService
- Aggregate Rating
- Contact Info

### **Performance Checklist**

Para garantir Lighthouse 90+:

1. **Otimizar Imagens**
   - Converter para WebP
   - Lazy loading: `<img loading="lazy">`
   - Definir width/height

2. **Minificar CSS/JS**
   ```bash
   # Usar minifiers
   npm install -g terser clean-css-cli
   terser js/app.js -o js/app.min.js
   cleancss -o css/style.min.css css/style.css
   ```
   
   Atualizar referências no HTML:
   ```html
   <link rel="stylesheet" href="css/style.min.css">
   <script src="js/app.min.js"></script>
   ```

3. **Habilitar Compressão GZIP** (servidor)
   
   **Nginx:**
   ```nginx
   gzip on;
   gzip_types text/css text/javascript application/javascript;
   ```
   
   **Apache (.htaccess):**
   ```apache
   AddOutputFilterByType DEFLATE text/html text/css text/javascript
   ```

4. **Cache Headers**
   
   **Nginx:**
   ```nginx
   location ~* \.(css|js|jpg|png|webp)$ {
       expires 30d;
       add_header Cache-Control "public, immutable";
   }
   ```

5. **CDN** (opcional mas recomendado)
   - Cloudflare (gratuito)
   - AWS CloudFront
   - Google Cloud CDN

---

## 🚀 DEPLOY

### **Opção 1: Vercel (Recomendado - Gratuito)**

1. Instalar Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   cd advocacia-ai-landing
   vercel --prod
   ```

3. Configurar domínio customizado no dashboard Vercel

### **Opção 2: Netlify (Gratuito)**

1. Criar conta em [netlify.com](https://netlify.com)
2. Arrastar pasta do projeto
3. Configurar domínio customizado

### **Opção 3: GitHub Pages (Gratuito)**

1. Criar repositório `username.github.io`
2. Push dos arquivos
3. Habilitar GitHub Pages em Settings

### **Opção 4: Servidor Próprio (cPanel/VPS)**

1. Upload via FTP/SFTP
2. Configurar SSL (Let's Encrypt gratuito)
3. Apontar domínio para IP do servidor

---

## 🔐 CONFIGURAÇÕES DE SEGURANÇA

### **1. SSL/HTTPS (Obrigatório)**

Todas as opções acima oferecem SSL gratuito.

Se servidor próprio:
```bash
# Certbot (Let's Encrypt)
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d advocacia.ai -d www.advocacia.ai
```

### **2. Content Security Policy (CSP)**

Adicionar no `<head>`:
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com; 
               style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
               img-src 'self' data: https:;">
```

### **3. Proteção contra XSS**

Já implementado no JavaScript (validação de inputs).

---

## 🧪 TESTES

### **1. Teste Local**

```bash
# Servidor HTTP simples (Python)
python3 -m http.server 8000

# ou (Node.js)
npx http-server -p 8000

# Acessar: http://localhost:8000
```

### **2. Teste de Performance**

- [PageSpeed Insights](https://pagespeed.web.dev/)
- [GTmetrix](https://gtmetrix.com/)
- [WebPageTest](https://www.webpagetest.org/)

**Meta: Score 90+ no mobile**

### **3. Teste de Compatibilidade**

- Chrome DevTools (Device Mode)
- [BrowserStack](https://www.browserstack.com/)
- Testar em: Chrome, Firefox, Safari, Edge

### **4. Teste de Conversão**

1. Google Analytics → Tempo Real
2. Preencher formulário
3. Verificar evento `lead_submit`

---

## ❓ TROUBLESHOOTING

### **Problema: Formulário não envia**

**Solução:**
1. Abrir Console (F12)
2. Verificar erros JavaScript
3. Confirmar que `CONFIG.API_URL` está correto
4. Testar endpoint manualmente:
   ```bash
   curl -X POST https://api.advocacia.ai/api/leads/ \
        -H "Content-Type: application/json" \
        -d '{"tipo_pessoa":"pf","nome_razao":"Teste",...}'
   ```

### **Problema: Reconhecimento de voz não funciona**

**Solução:**
- Verificar navegador compatível (Chrome, Edge)
- Permitir acesso ao microfone
- Testar em HTTPS (obrigatório)
- Safari iOS requer versão 14.5+

### **Problema: Analytics não rastreia**

**Solução:**
1. Verificar IDs em `js/analytics.js`
2. Verificar GTM instalado corretamente
3. Usar Google Tag Assistant
4. Verificar AdBlockers desabilitados

### **Problema: Performance baixa**

**Solução:**
1. Otimizar imagens (WebP, compressão)
2. Minificar CSS/JS
3. Habilitar cache e compressão no servidor
4. Usar CDN

---

## 📞 SUPORTE

Para dúvidas ou problemas:

- **Email:** suporte@advocacia.ai
- **WhatsApp:** (11) 99999-9999
- **Documentação Backend:** Ver README do projeto backend

---

## 📝 LICENÇA

© 2024 Advocacia.AI. Todos os direitos reservados.

Uso exclusivo para o projeto Advocacia.AI / RDM Advogados Associados.

---

## 🎉 PRÓXIMOS PASSOS

Após deploy:

1. ✅ Configurar domínio customizado
2. ✅ Adicionar Google Search Console
3. ✅ Criar sitemap.xml
4. ✅ Configurar Google My Business
5. ✅ Iniciar campanhas Google Ads
6. ✅ Testar conversões end-to-end
7. ✅ Monitorar Analytics diariamente

**Boa sorte com o lançamento! 🚀**
