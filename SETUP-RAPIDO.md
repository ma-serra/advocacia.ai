# ⚡ GUIA RÁPIDO DE CONFIGURAÇÃO

## 🚀 INÍCIO RÁPIDO (5 MINUTOS)

### 1. CONFIGURAR IDS DE TRACKING

Abra os arquivos e substitua os IDs pelos seus:

**js/analytics.js** (linha 9-11):
```javascript
GA4_ID: 'G-XXXXXXXXXX',        // ← Google Analytics 4
GOOGLE_ADS_ID: 'AW-XXXXXXXXX', // ← Google Ads
FB_PIXEL_ID: 'YOUR_PIXEL_ID',  // ← Facebook Pixel
```

**index.html** (linha 44):
```javascript
'https://www.googletagmanager.com/gtm.js?id=GTM-XXXXXXX' // ← Google Tag Manager
```

**index.html** (linha 57):
```javascript
fbq('init', 'YOUR_PIXEL_ID'); // ← Facebook Pixel
```

---

### 2. CONFIGURAR BACKEND API

**js/app.js** (linha 12):
```javascript
API_URL: 'https://api.advocacia.ai', // ← Sua URL de produção
```

**js/app.js** (linha 15):
```javascript
OPENAI_ENDPOINT: '/api/leads/', // ← Confirme o endpoint correto
```

---

### 3. CONFIGURAR WHATSAPP

**js/app.js** (linha 19):
```javascript
WHATSAPP_NUMBER: '5511999999999', // ← Seu número (DDI+DDD+Número)
```

**index.html** (buscar todos os `wa.me`):
```html
<a href="https://wa.me/5511999999999?text=Olá!">
```

---

### 4. TESTAR LOCALMENTE

```bash
# Opção 1: Python
python3 -m http.server 8000

# Opção 2: Node.js
npx http-server -p 8000

# Acessar: http://localhost:8000
```

---

### 5. DEPLOY RÁPIDO

**Vercel (mais fácil):**
```bash
npm install -g vercel
vercel --prod
```

**Netlify:**
Arraste a pasta em [app.netlify.com](https://app.netlify.com/)

---

## ✅ CHECKLIST PÓS-DEPLOY

- [ ] SSL configurado (HTTPS funcionando)
- [ ] Google Analytics rastreando (verificar em Tempo Real)
- [ ] Formulário enviando para backend (testar preenchimento)
- [ ] WhatsApp abrindo corretamente
- [ ] Reconhecimento de voz funcionando (Chrome/Edge)
- [ ] Performance 90+ no PageSpeed Insights
- [ ] Testar em mobile (Chrome DevTools)

---

## 🆘 PROBLEMAS COMUNS

### Formulário não envia?
1. Abrir Console (F12)
2. Verificar se `API_URL` está correto
3. Verificar CORS no backend

### Analytics não rastreia?
1. Verificar IDs corretos em `analytics.js`
2. Desabilitar AdBlockers
3. Usar Google Tag Assistant

### Voz não funciona?
1. Usar HTTPS (obrigatório)
2. Permitir microfone
3. Testar no Chrome ou Edge

---

## 📞 SUPORTE

WhatsApp: (11) 99999-9999
Email: suporte@advocacia.ai

---

**Pronto para lançar! 🎉**
