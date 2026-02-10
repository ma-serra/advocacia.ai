# 🚀 ADVOCACIA.AI - LANDING PAGE

Landing page completa para captação de leads jurídicos com Inteligência Artificial integrada.

## ⚡ INÍCIO RÁPIDO

Este projeto está **pronto para instalar e usar**! Siga os passos abaixo:

```bash
# 1. Clone o repositório
git clone https://github.com/ma-serra/advocacia.ai.git
cd advocacia.ai

# 2. Instale as dependências
npm install

# 3. Inicie o servidor de desenvolvimento
npm run dev
```

O site estará disponível em: **http://localhost:5173**

📖 **Para instruções detalhadas de instalação, veja [INSTALL.md](./INSTALL.md)**

---

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
advocacia.ai/
├── src/                          # Código fonte
│   ├── components/               # Componentes React
│   ├── pages/                    # Páginas da aplicação
│   ├── contexts/                 # Contextos React
│   ├── hooks/                    # Hooks customizados
│   ├── lib/                      # Utilitários e helpers
│   ├── App.tsx                   # Componente principal
│   ├── main.tsx                  # Ponto de entrada
│   └── index.css                 # Estilos globais
├── public/                       # Arquivos estáticos
├── index.html                    # HTML principal
├── package.json                  # Dependências
├── tsconfig.json                 # Configuração TypeScript
├── vite.config.ts                # Configuração Vite
├── INSTALL.md                    # Guia de instalação detalhado
└── README.md                     # Este arquivo
```

**Nota:** Há também uma versão standalone em HTML/CSS/JS no arquivo `index-standalone.html` para uso sem build.

---

## 🔧 INSTALAÇÃO E CONFIGURAÇÃO

### **Instalação Rápida**

```bash
npm install
npm run dev
```

Para instruções detalhadas de instalação, veja **[INSTALL.md](./INSTALL.md)**.

### **Scripts Disponíveis**

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Cria build de produção  
- `npm run preview` - Preview do build de produção
- `npm test` - Executa testes
- `npm run type-check` - Verifica tipos TypeScript

### **Configuração de Variáveis de Ambiente (Opcional)**

Crie um arquivo `.env` na raiz do projeto:

```env
# API Backend
VITE_API_URL=https://api.advocacia.ai

# Analytics (opcional)
VITE_GA4_ID=G-XXXXXXXXXX
VITE_GOOGLE_ADS_ID=AW-XXXXXXXXX
VITE_FB_PIXEL_ID=YOUR_PIXEL_ID
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

### **Build para Produção**

```bash
npm run build
```

Os arquivos otimizados serão gerados na pasta `dist/`.

### **Opções de Deploy**

#### **Vercel (Recomendado - Gratuito)**
```bash
npm install -g vercel
vercel --prod
```

#### **Netlify (Gratuito)**
1. Conecte seu repositório GitHub em [netlify.com](https://netlify.com)
2. Configure:
   - Build command: `npm run build`
   - Publish directory: `dist`

#### **Servidor Próprio**
1. Faça o build: `npm run build`
2. Copie a pasta `dist/` para seu servidor web
3. Configure redirecionamento de rotas para `index.html` (SPA)

**Exemplo Nginx:**
```nginx
server {
    listen 80;
    server_name advocacia.ai;
    root /var/www/advocacia.ai/dist;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

Para mais opções de deploy, veja [INSTALL.md](./INSTALL.md).

---

## 🧪 TESTES

### **Executar Testes**

```bash
npm test              # Executa todos os testes
npm run test:watch    # Modo watch para desenvolvimento
```

### **Testes Incluídos**

- ✅ Validações (CPF, CNPJ, email, telefone)
- ✅ Tipos TypeScript
- ✅ Funcionalidades do blog
- ✅ Utilitários CNPJ

**39 testes passando com sucesso!**

### **Testar Localmente**

```bash
npm run dev          # http://localhost:5173
npm run preview      # Preview do build de produção
```

---

## ❓ TROUBLESHOOTING

Para problemas comuns de instalação e configuração, consulte o [INSTALL.md](./INSTALL.md).

### **Problemas Comuns**

**Erro ao instalar dependências:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Porta já em uso:**
Edite `vite.config.ts` e altere a porta em `server.port`.

**Erros de tipo TypeScript:**
```bash
npm run type-check
```

---

## 📞 SUPORTE

Para dúvidas ou problemas:

- **Issues no GitHub:** [github.com/ma-serra/advocacia.ai/issues](https://github.com/ma-serra/advocacia.ai/issues)
- **Documentação:** [INSTALL.md](./INSTALL.md) para instalação detalhada

---

## 📝 LICENÇA

© 2024 Advocacia.AI. Todos os direitos reservados.

---

## 🎉 PRONTO PARA USAR!

O projeto está completamente configurado e pronto para instalação e uso.

**Começar agora:**
```bash
git clone https://github.com/ma-serra/advocacia.ai.git
cd advocacia.ai
npm install
npm run dev
```

**Boa sorte com o lançamento! 🚀**
