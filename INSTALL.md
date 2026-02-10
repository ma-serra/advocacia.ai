# 📦 Guia de Instalação - Advocacia.AI

## ✅ Pré-requisitos

Antes de começar, certifique-se de ter instalado em seu sistema:

- **Node.js** versão 18 ou superior ([Download](https://nodejs.org/))
- **npm** ou **pnpm** (gerenciador de pacotes)
- **Git** ([Download](https://git-scm.com/))

Para verificar se você tem as ferramentas instaladas:

```bash
node --version  # Deve mostrar v18.0.0 ou superior
npm --version   # Deve mostrar 9.0.0 ou superior
```

---

## 🚀 Instalação Rápida

### 1. Clone o repositório

```bash
git clone https://github.com/ma-serra/advocacia.ai.git
cd advocacia.ai
```

### 2. Instale as dependências

```bash
npm install
```

ou se preferir usar pnpm (mais rápido):

```bash
npm install -g pnpm
pnpm install
```

### 3. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

O site estará disponível em: **http://localhost:5173**

---

## 🏗️ Build para Produção

Para criar uma versão otimizada para produção:

```bash
npm run build
```

Os arquivos otimizados serão gerados na pasta `dist/`.

Para visualizar a versão de produção localmente:

```bash
npm run preview
```

---

## 🧪 Executar Testes

```bash
# Executar todos os testes
npm test

# Executar testes em modo watch (desenvolvimento)
npm run test:watch

# Verificar tipos TypeScript
npm run type-check
```

---

## 📁 Estrutura do Projeto

```
advocacia.ai/
├── src/                          # Código fonte
│   ├── components/               # Componentes React
│   │   ├── ui/                   # Componentes de UI base
│   │   ├── AtendimentoOnline.tsx
│   │   ├── BlogArticleCard.tsx
│   │   ├── BlogSection.tsx
│   │   ├── ErrorBoundary.tsx
│   │   ├── Footer.tsx
│   │   ├── FormularioEVA.tsx
│   │   ├── MapaBrasil.tsx
│   │   └── ProtectedRoute.tsx
│   ├── pages/                    # Páginas da aplicação
│   │   ├── Home.tsx
│   │   ├── Blog.tsx
│   │   ├── BlogArticle.tsx
│   │   ├── AdvogadoDashboard.tsx
│   │   ├── LeadsPage.tsx
│   │   ├── LeadDetail.tsx
│   │   └── NotFound.tsx
│   ├── contexts/                 # Contextos React
│   │   ├── AuthContext.tsx
│   │   └── ThemeContext.tsx
│   ├── hooks/                    # Hooks customizados
│   │   ├── useFormSteps.ts
│   │   └── useFormValidation.ts
│   ├── lib/                      # Utilitários e helpers
│   │   ├── api.ts               # Chamadas de API
│   │   ├── blog.ts              # Lógica do blog
│   │   ├── cnpj.ts              # Validação de CNPJ
│   │   ├── types.ts             # Tipos TypeScript
│   │   └── validations.ts       # Validações
│   ├── App.tsx                   # Componente principal
│   ├── main.tsx                  # Ponto de entrada
│   └── index.css                 # Estilos globais
├── public/                       # Arquivos estáticos
├── index.html                    # HTML principal
├── package.json                  # Dependências
├── tsconfig.json                 # Configuração TypeScript
├── vite.config.ts                # Configuração Vite
└── vitest.config.ts              # Configuração de testes
```

---

## ⚙️ Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto (opcional):

```env
# API Backend (se aplicável)
VITE_API_URL=https://api.advocacia.ai

# Analytics (opcional)
VITE_GA4_ID=G-XXXXXXXXXX
VITE_GOOGLE_ADS_ID=AW-XXXXXXXXX
VITE_FB_PIXEL_ID=YOUR_PIXEL_ID
```

### Configurar API Backend

Se você tem um backend API, edite o arquivo `src/lib/api.ts` e configure a URL:

```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
```

---

## 🌐 Deploy

### Opção 1: Vercel (Recomendado - Gratuito)

1. Instale a CLI do Vercel:
```bash
npm install -g vercel
```

2. Faça o deploy:
```bash
vercel --prod
```

3. Configure o domínio customizado no dashboard do Vercel

### Opção 2: Netlify (Gratuito)

1. Crie uma conta em [netlify.com](https://netlify.com)
2. Conecte seu repositório GitHub
3. Configure:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Deploy automático a cada push

### Opção 3: Servidor Próprio

1. Faça o build:
```bash
npm run build
```

2. Copie a pasta `dist/` para seu servidor web (Apache, Nginx, etc.)

3. Configure seu servidor para redirecionar todas as rotas para `index.html` (SPA)

**Exemplo de configuração Nginx:**
```nginx
server {
    listen 80;
    server_name advocacia.ai;
    root /var/www/advocacia.ai/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

## 🔧 Troubleshooting

### Problema: Erro ao instalar dependências

**Solução:**
```bash
# Limpe o cache e reinstale
rm -rf node_modules package-lock.json
npm install
```

### Problema: Porta 5173 já está em uso

**Solução:**
Edite `vite.config.ts` e altere a porta:
```typescript
server: {
  port: 3000, // Altere para a porta desejada
}
```

### Problema: Erros de tipo TypeScript

**Solução:**
```bash
# Verifique os erros
npm run type-check

# Se necessário, reconstrua
npm run build
```

### Problema: Componentes não são encontrados

**Solução:**
Verifique se os path aliases estão configurados corretamente em:
- `tsconfig.json` (seção `paths`)
- `vite.config.ts` (seção `resolve.alias`)

---

## 📚 Scripts Disponíveis

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm run preview` - Preview do build de produção
- `npm test` - Executa testes
- `npm run test:watch` - Executa testes em modo watch
- `npm run lint` - Executa linter
- `npm run type-check` - Verifica tipos TypeScript

---

## 🆘 Suporte

Se você encontrar problemas durante a instalação:

1. **Verifique os pré-requisitos** - Node.js 18+, npm atualizado
2. **Limpe o cache** - `rm -rf node_modules && npm install`
3. **Verifique as issues** no repositório GitHub
4. **Abra uma nova issue** com detalhes do erro

---

## 📝 Próximos Passos

Após a instalação bem-sucedida:

1. ✅ Configure variáveis de ambiente (`.env`)
2. ✅ Personalize estilos em `src/index.css`
3. ✅ Configure integração com API backend
4. ✅ Configure Google Analytics (opcional)
5. ✅ Teste o formulário de leads
6. ✅ Faça o deploy em produção

---

## 🎉 Pronto para Usar!

Seu ambiente de desenvolvimento está configurado e pronto para uso.

Para começar a desenvolver, execute:
```bash
npm run dev
```

E acesse: **http://localhost:5173**

**Bom desenvolvimento! 🚀**
