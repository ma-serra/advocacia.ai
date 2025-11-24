# 🤖 Guia de Integração com API de IA

## 📋 Índice
1. [Visão Geral](#visão-geral)
2. [Endpoints Necessários](#endpoints-necessários)
3. [Fluxo de Processamento](#fluxo-de-processamento)
4. [Autenticação](#autenticação)
5. [Exemplos de Implementação](#exemplos-de-implementação)
6. [Tratamento de Erros](#tratamento-de-erros)
7. [Webhook para Notificações](#webhook-para-notificações)

---

## Visão Geral

O site integra-se com sua API de IA para:
1. **Análise de Leads**: Processar descrição do caso e identificar área jurídica
2. **Classificação de Urgência**: Determinar prioridade do atendimento
3. **Recomendações**: Sugerir documentos necessários e próximos passos
4. **Estimativa de Honorários**: Calcular faixa de preço baseado no caso

### Fluxo Geral
```
Lead Submete Formulário
        ↓
Validação no Frontend
        ↓
Envio para Backend (seu servidor)
        ↓
Chamada para API de IA
        ↓
Processamento e Análise
        ↓
Armazenamento no Banco de Dados
        ↓
Notificação ao Advogado
```

---

## Endpoints Necessários

### 1. Submeter Lead para Análise

**POST** `/api/leads/submit`

**Headers:**
```
Authorization: Bearer {API_KEY}
Content-Type: application/json
```

**Request Body:**
```json
{
  "tipoCliente": "PF",
  "nome": "João Silva",
  "cpfCnpj": "123.456.789-00",
  "email": "joao@email.com",
  "telefonePrincipal": "(11) 98765-4321",
  "telefoneAlternativo": "(11) 99999-8888",
  "canalPreferido": "whatsapp",
  "horarioPreferido": "manhã",
  "endereco": {
    "cep": "01310-100",
    "rua": "Av Paulista",
    "numero": "1000",
    "complemento": "Apto 1500",
    "bairro": "Bela Vista",
    "cidade": "São Paulo",
    "estado": "SP"
  },
  "areaDireito": "Direito do Trabalho",
  "descricaoCaso": "Fui demitido sem justa causa...",
  "transcricaoVoz": "Texto da transcrição de voz (opcional)"
}
```

**Response (200 OK):**
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
      "documentosNecessarios": [
        "Contrato de trabalho",
        "Comprovante de demissão",
        "Contracheques últimos 3 meses"
      ],
      "recomendacoes": [
        "Coletar documentação imediatamente",
        "Verificar se houve acordo",
        "Calcular verbas devidas"
      ],
      "estimativaHonorarios": {
        "minimo": 2000,
        "maximo": 5000,
        "moeda": "BRL"
      },
      "tempoEstimado": "2-3 meses",
      "complexidade": "media",
      "jurisprudenciaRelevante": [
        "CLT - Artigos 477 a 480",
        "Súmula 291 TST"
      ]
    }
  },
  "message": "Lead recebido e em análise"
}
```

### 2. Obter Status da Análise

**GET** `/api/leads/{leadId}`

**Headers:**
```
Authorization: Bearer {API_KEY}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "leadId": "lead_123456",
    "status": "analisado",
    "analiseIA": { ... },
    "dataCadastro": "2024-11-24T10:30:00Z",
    "dataAnalise": "2024-11-24T10:35:00Z"
  }
}
```

### 3. Listar Leads do Advogado

**GET** `/api/advogado/{advogadoId}/leads?status=novo&area=Direito%20do%20Trabalho&page=1&limit=20`

**Headers:**
```
Authorization: Bearer {API_KEY}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "leads": [
      { ... },
      { ... }
    ],
    "total": 247,
    "pagina": 1,
    "porPagina": 20,
    "totalPaginas": 13
  }
}
```

### 4. Atualizar Status do Lead

**PATCH** `/api/leads/{leadId}`

**Headers:**
```
Authorization: Bearer {API_KEY}
Content-Type: application/json
```

**Request Body:**
```json
{
  "status": "atribuido",
  "advogadoAtribuido": "adv_123456",
  "anotacoes": "Cliente parece ansioso, primeira vez em processo trabalhista"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": { ... },
  "message": "Lead atualizado com sucesso"
}
```

### 5. Enviar Mensagem ao Cliente

**POST** `/api/leads/{leadId}/messages`

**Headers:**
```
Authorization: Bearer {API_KEY}
Content-Type: application/json
```

**Request Body:**
```json
{
  "canal": "whatsapp",
  "mensagem": "Olá João! Recebemos seu caso e já iniciamos a análise...",
  "tipo": "atendimento"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "messageId": "msg_123456",
    "status": "enviado",
    "dataEnvio": "2024-11-24T10:40:00Z"
  }
}
```

---

## Fluxo de Processamento

### Fase 1: Recebimento do Lead

```javascript
// client/src/lib/api.ts
export async function submitLead(formData: any) {
  const response = await fetch(`${API_URL}/leads/submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    throw new Error(`Erro ao enviar lead: ${response.statusText}`);
  }

  return response.json();
}
```

### Fase 2: Análise pela IA

Sua API deve:
1. Receber os dados do lead
2. Processar a descrição do caso com IA
3. Identificar a área jurídica
4. Calcular nível de urgência
5. Gerar recomendações
6. Estimar honorários
7. Retornar análise completa

**Exemplo de Processamento (Node.js/Express):**

```javascript
// Seu backend
const express = require('express');
const app = express();

app.post('/api/leads/submit', authenticateAPI, async (req, res) => {
  try {
    const leadData = req.body;
    
    // 1. Validar dados
    validateLeadData(leadData);
    
    // 2. Salvar lead no banco
    const lead = await Lead.create({
      ...leadData,
      status: 'analisando'
    });
    
    // 3. Enviar para IA
    const analise = await callIAAPI({
      descricaoCaso: leadData.descricaoCaso,
      transcricaoVoz: leadData.transcricaoVoz,
      areaDireito: leadData.areaDireito
    });
    
    // 4. Atualizar lead com análise
    lead.analiseIA = analise;
    lead.status = 'analisado';
    await lead.save();
    
    // 5. Notificar advogados
    await notifyLawyers(lead);
    
    // 6. Responder ao cliente
    res.json({
      success: true,
      data: {
        leadId: lead.id,
        status: lead.status,
        analiseIA: lead.analiseIA
      }
    });
    
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

async function callIAAPI(caseData) {
  const response = await fetch('https://sua-ia-api.com/analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${IA_API_KEY}`
    },
    body: JSON.stringify(caseData)
  });
  
  return response.json();
}
```

### Fase 3: Notificação ao Advogado

```javascript
async function notifyLawyers(lead) {
  // Encontrar advogados especializados na área
  const lawyers = await Lawyer.find({
    especialidades: lead.areaDireito,
    ativo: true
  });
  
  // Enviar notificação
  for (const lawyer of lawyers) {
    await sendNotification({
      type: 'novo_lead',
      lawyerId: lawyer.id,
      leadId: lead.id,
      titulo: `Novo lead: ${lead.nome}`,
      mensagem: `Novo caso em ${lead.areaDireito}`,
      urgencia: lead.analiseIA.urgencia
    });
  }
}
```

---

## Autenticação

### Bearer Token

```
Authorization: Bearer sua-chave-api-secreta
```

### Gerar Chave API

1. Acesse o painel de administração
2. Vá para "Configurações > API"
3. Clique em "Gerar Nova Chave"
4. Copie a chave e guarde em local seguro

### Renovar Chave

```bash
# Via CLI
curl -X POST https://seu-dominio.com/api/admin/keys/rotate \
  -H "Authorization: Bearer {ADMIN_TOKEN}"
```

---

## Exemplos de Implementação

### React - Submeter Lead

```typescript
// client/src/components/FormularioEVA.tsx
import { submitLead } from '@/lib/api';

async function handleSubmitForm(formData: any) {
  try {
    setLoading(true);
    
    const response = await submitLead(formData);
    
    if (response.success) {
      // Sucesso!
      showSuccessMessage('Lead enviado com sucesso!');
      
      // Redirecionar para página de confirmação
      navigate(`/confirmacao/${response.data.leadId}`);
    }
  } catch (error) {
    showErrorMessage(error.message);
  } finally {
    setLoading(false);
  }
}
```

### Node.js - Processar com IA

```javascript
// server/routes/leads.js
const router = require('express').Router();
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

router.post('/analyze', async (req, res) => {
  const { descricaoCaso, areaDireito } = req.body;
  
  const prompt = `
    Analise o seguinte caso jurídico e forneça:
    1. Categoria específica
    2. Nível de urgência (baixa/média/alta/crítica)
    3. Score de confiança (0-1)
    4. Documentos necessários
    5. Recomendações
    6. Estimativa de honorários
    
    Área: ${areaDireito}
    Descrição: ${descricaoCaso}
  `;
  
  const completion = await openai.chat.completions.create({
    model: 'gpt-4-turbo',
    messages: [
      {
        role: 'system',
        content: 'Você é um advogado especializado em análise de casos jurídicos.'
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    temperature: 0.7,
    max_tokens: 1000
  });
  
  // Parse resposta e retornar
  const analise = parseAnalysis(completion.choices[0].message.content);
  
  res.json({
    success: true,
    data: analise
  });
});
```

---

## Tratamento de Erros

### Códigos de Erro

| Código | Descrição | Ação |
|--------|-----------|------|
| 400 | Bad Request | Validar dados enviados |
| 401 | Unauthorized | Verificar API Key |
| 403 | Forbidden | Verificar permissões |
| 404 | Not Found | Verificar ID do recurso |
| 429 | Too Many Requests | Implementar rate limiting |
| 500 | Server Error | Contatar suporte |

### Exemplo de Tratamento

```typescript
async function submitLead(formData: any) {
  try {
    const response = await fetch(`${API_URL}/leads/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const error = await response.json();
      
      switch (response.status) {
        case 400:
          throw new Error(`Dados inválidos: ${error.message}`);
        case 401:
          throw new Error('API Key inválida');
        case 429:
          throw new Error('Muitas requisições. Tente novamente em alguns minutos.');
        default:
          throw new Error(`Erro ${response.status}: ${error.message}`);
      }
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao enviar lead:', error);
    throw error;
  }
}
```

---

## Webhook para Notificações

### Configurar Webhook

```bash
POST /api/admin/webhooks

{
  "url": "https://seu-dominio.com/webhooks/leads",
  "eventos": [
    "lead.criado",
    "lead.analisado",
    "lead.atribuido"
  ]
}
```

### Receber Webhook

```javascript
// server/webhooks.js
app.post('/webhooks/leads', verifyWebhookSignature, (req, res) => {
  const { evento, dados } = req.body;
  
  switch (evento) {
    case 'lead.criado':
      handleNewLead(dados);
      break;
    case 'lead.analisado':
      handleLeadAnalyzed(dados);
      break;
    case 'lead.atribuido':
      handleLeadAssigned(dados);
      break;
  }
  
  res.json({ received: true });
});

function handleLeadAnalyzed(lead) {
  // Enviar email ao advogado
  // Atualizar dashboard
  // Enviar notificação ao cliente
}
```

---

## Checklist de Integração

- [ ] API Key configurada nas variáveis de ambiente
- [ ] Endpoints testados com Postman/Insomnia
- [ ] Tratamento de erros implementado
- [ ] Rate limiting configurado
- [ ] Logging de requisições ativo
- [ ] Webhook configurado
- [ ] Banco de dados pronto
- [ ] Notificações por email funcionando
- [ ] Notificações por WhatsApp funcionando (opcional)
- [ ] Testes automatizados criados
- [ ] Documentação atualizada

---

**Próximo passo:** Configurar variáveis de ambiente e testar integração completa!
