# 🎯 Guia de Implementação - Painel Administrativo do Advogado

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Arquivos Fornecidos](#arquivos-fornecidos)
3. [Setup Backend (FastAPI + SQLAlchemy)](#setup-backend)
4. [Setup Frontend (React)](#setup-frontend)
5. [Integração Completa](#integração-completa)
6. [Testes](#testes)
7. [Deploy](#deploy)

---

## 🎯 Visão Geral

Você recebeu um **painel administrativo profissional** com:

### ✅ Backend (Python/FastAPI)
- Autenticação JWT segura
- Modelo de dados completo (SQLAlchemy)
- Endpoints RESTful para:
  - Registro e login de advogados
  - Gerenciamento de perfil profissional
  - CRM completo (leads, conversas, anotações)
  - Dashboard com estatísticas
  - Chat em tempo real

### ✅ Frontend (React/TypeScript)
- Login responsivo
- Registro multi-step
- Dashboard com estatísticas
- Gerenciamento de leads
- Chat integrado
- Componentes reutilizáveis

### ✅ Banco de Dados (PostgreSQL)
- 6 tabelas relacionadas
- Criptografia de dados sensíveis
- Índices para performance
- Migrations automáticas

---

## 📦 Arquivos Fornecidos

### 1. **PAINEL_ADMIN_MODELS.py** (13 KB)
Modelos SQLAlchemy com 6 tabelas:
- `users` - Autenticação
- `advogados` - Perfil profissional
- `leads` - Clientes/Casos
- `conversas` - Chat
- `anotacoes` - Notas
- `tarefas` - Tasks/Lembretes

### 2. **PAINEL_ADMIN_ENDPOINTS.py** (20 KB)
Endpoints FastAPI:
- `/auth/register/advogado` - Registro
- `/auth/login` - Login
- `/auth/profile` - Perfil
- `/auth/leads` - CRUD de leads
- `/auth/dashboard/stats` - Estatísticas
- `/auth/leads/{id}/mensagens` - Chat
- `/auth/leads/{id}/anotacoes` - Anotações

### 3. **PAINEL_ADMIN_REACT.tsx** (20 KB)
Componentes React:
- `AdvogadoLogin` - Tela de login
- `AdvogadoRegistro` - Registro multi-step
- `AdvogadoDashboard` - Dashboard principal
- `LeadDetail` - Detalhes do lead com chat

---

## 🔧 Setup Backend

### Passo 1: Instalar Dependências

```bash
# Criar ambiente virtual
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate  # Windows

# Instalar pacotes
pip install fastapi uvicorn sqlalchemy psycopg2-binary pydantic python-jose bcrypt python-multipart python-dotenv
```

### Passo 2: Configurar Banco de Dados

```bash
# Criar banco PostgreSQL
createdb advocacia_ai

# Ou via Docker
docker run --name advocacia-db \
  -e POSTGRES_DB=advocacia_ai \
  -e POSTGRES_PASSWORD=senha123 \
  -p 5432:5432 \
  -d postgres:15
```

### Passo 3: Adicionar Modelos

1. Copie o conteúdo de `PAINEL_ADMIN_MODELS.py`
2. Crie arquivo: `backend/app/models.py`
3. Cole o código

### Passo 4: Adicionar Endpoints

1. Copie o conteúdo de `PAINEL_ADMIN_ENDPOINTS.py`
2. Crie arquivo: `backend/app/routers/auth.py`
3. Cole o código

### Passo 5: Criar Database.py

```python
# backend/app/database.py

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:senha123@localhost/advocacia_ai")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Criar tabelas
from .models import Base
Base.metadata.create_all(bind=engine)
```

### Passo 6: Criar Main.py

```python
# backend/app/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import auth
from .database import engine
from .models import Base

# Criar tabelas
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Advocacia.AI API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth.router)

@app.get("/health")
def health():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

### Passo 7: Executar Backend

```bash
# Desenvolvimento
python -m uvicorn backend.app.main:app --reload

# Produção
python -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000
```

Backend estará em: `http://localhost:8000`

---

## ⚛️ Setup Frontend

### Passo 1: Copiar Componentes

1. Copie o conteúdo de `PAINEL_ADMIN_REACT.tsx`
2. Crie arquivo: `frontend/src/components/AdvogadoPanel/index.tsx`
3. Cole o código

### Passo 2: Adicionar Rotas

```typescript
// frontend/src/App.tsx

import { Route, Switch } from 'wouter';
import { AdvogadoLogin } from '@/components/AdvogadoPanel';
import { AdvogadoRegistro } from '@/components/AdvogadoPanel';
import { AdvogadoDashboard } from '@/components/AdvogadoPanel';
import { LeadDetail } from '@/components/AdvogadoPanel';

function Router() {
  return (
    <Switch>
      {/* Landing Page */}
      <Route path="/" component={Home} />
      
      {/* Portal do Advogado */}
      <Route path="/advogado/login" component={AdvogadoLogin} />
      <Route path="/advogado/registro" component={AdvogadoRegistro} />
      <Route path="/advogado/dashboard" component={AdvogadoDashboard} />
      <Route path="/advogado/leads/:id" component={LeadDetail} />
      
      {/* 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}
```

### Passo 3: Configurar API URL

```typescript
// frontend/src/lib/api.ts

const API_URL = process.env.VITE_API_URL || 'http://localhost:8000/api';

export async function apiCall(
  endpoint: string,
  options: RequestInit = {}
) {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}
```

### Passo 4: Testar Frontend

```bash
cd frontend
pnpm dev
```

Frontend estará em: `http://localhost:5173`

---

## 🔗 Integração Completa

### Fluxo de Autenticação

```
1. Usuário acessa /advogado/login
   ↓
2. Submete email + senha
   ↓
3. Backend valida e retorna JWT token
   ↓
4. Frontend salva token em localStorage
   ↓
5. Token enviado em todas as requisições
   ↓
6. Backend valida token e retorna dados
```

### Fluxo de Criação de Lead

```
1. Cliente preenche formulário na landing page
   ↓
2. Dados enviados para backend
   ↓
3. Backend analisa com IA
   ↓
4. Lead criado no banco
   ↓
5. Advogado vê lead no dashboard
   ↓
6. Advogado entra em contato via chat
```

### Fluxo de Chat

```
1. Advogado envia mensagem
   ↓
2. Mensagem salva no banco
   ↓
3. Cliente recebe notificação
   ↓
4. Cliente responde
   ↓
5. Advogado vê resposta em tempo real
```

---

## 🧪 Testes

### Testar Backend com cURL

```bash
# 1. Registrar advogado
curl -X POST http://localhost:8000/api/auth/register/advogado \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@example.com",
    "full_name": "João Silva",
    "password": "senha123456",
    "nome": "João Silva Advogados",
    "oab_numero": "123456",
    "oab_estado": "SP",
    "areas": ["Trabalho", "Cível"]
  }'

# 2. Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@example.com",
    "password": "senha123456"
  }'

# 3. Obter perfil (com token)
curl -X GET http://localhost:8000/api/auth/profile \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"

# 4. Listar leads
curl -X GET http://localhost:8000/api/auth/leads \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"

# 5. Obter estatísticas
curl -X GET http://localhost:8000/api/auth/dashboard/stats \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

### Testar Frontend

1. Acesse `http://localhost:5173/advogado/login`
2. Clique em "Registre-se"
3. Preencha formulário
4. Clique em "Registrar"
5. Você será redirecionado para o dashboard

---

## 🚀 Deploy

### Deploy Backend (Vercel/Railway)

1. Criar arquivo `requirements.txt`:
```
fastapi==0.104.1
uvicorn==0.24.0
sqlalchemy==2.0.23
psycopg2-binary==2.9.9
pydantic==2.5.0
python-jose==3.3.0
bcrypt==4.1.1
python-multipart==0.0.6
python-dotenv==1.0.0
```

2. Criar arquivo `Procfile`:
```
web: python -m uvicorn backend.app.main:app --host 0.0.0.0 --port $PORT
```

3. Fazer push para GitHub
4. Conectar no Vercel/Railway
5. Adicionar variáveis de ambiente:
```
DATABASE_URL=postgresql://...
SECRET_KEY=sua-chave-secreta
```

### Deploy Frontend (Vercel)

1. Fazer push para GitHub
2. Conectar no Vercel
3. Adicionar variável:
```
VITE_API_URL=https://sua-api.com/api
```

---

## 📋 Checklist de Implementação

### Backend
- [ ] Dependências instaladas
- [ ] Banco de dados criado
- [ ] Modelos adicionados
- [ ] Endpoints adicionados
- [ ] Database.py criado
- [ ] Main.py criado
- [ ] Backend rodando em localhost:8000
- [ ] Endpoints testados com cURL

### Frontend
- [ ] Componentes adicionados
- [ ] Rotas configuradas
- [ ] API URL configurada
- [ ] Frontend rodando em localhost:5173
- [ ] Login funcionando
- [ ] Registro funcionando
- [ ] Dashboard carregando

### Integração
- [ ] Backend e Frontend conectados
- [ ] Autenticação funcionando
- [ ] Leads sendo criados
- [ ] Chat funcionando
- [ ] Estatísticas atualizando

### Deploy
- [ ] Backend deployado
- [ ] Frontend deployado
- [ ] Domínio configurado
- [ ] HTTPS ativo
- [ ] Tudo funcionando em produção

---

## 🔐 Segurança

### Variáveis de Ambiente

Crie arquivo `.env`:

```env
# Backend
DATABASE_URL=postgresql://usuario:senha@localhost/advocacia_ai
SECRET_KEY=sua-chave-super-secreta-minimo-32-caracteres
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Email
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu-email@gmail.com
SMTP_PASSWORD=sua-senha-app

# Criptografia
ENCRYPTION_KEY=sua-chave-fernet

# Frontend
VITE_API_URL=http://localhost:8000/api
```

### Boas Práticas

1. **Nunca** commite `.env` no Git
2. **Sempre** use HTTPS em produção
3. **Valide** todos os inputs
4. **Criptografe** dados sensíveis
5. **Implemente** rate limiting
6. **Monitore** logs de erro
7. **Faça** backup regular do banco

---

## 📞 Suporte

### Documentação
- FastAPI: https://fastapi.tiangolo.com/
- SQLAlchemy: https://docs.sqlalchemy.org/
- React: https://react.dev/
- PostgreSQL: https://www.postgresql.org/docs/

### Comunidades
- FastAPI Discord
- React Community
- Stack Overflow

---

## 🎉 Próximos Passos

1. ✅ Implementar backend
2. ✅ Implementar frontend
3. ✅ Testar integração
4. ✅ Adicionar mais funcionalidades:
   - [ ] Notificações em tempo real (WebSocket)
   - [ ] Integração com WhatsApp API
   - [ ] Relatórios PDF
   - [ ] Agendamento de consultas
   - [ ] Pagamentos (Stripe)
5. ✅ Deploy em produção

---

**Tempo estimado de implementação: 4-6 horas**

Boa sorte! 🚀
