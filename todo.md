# Project TODO

## Estrutura e Layout
- [x] Header/Navigation com logo e menu responsivo
- [x] Hero Section com título, subtítulo e CTAs
- [x] Seção "Como Funciona" com 3 passos
- [x] Seção "Áreas do Direito" com cards de especialidades
- [ ] Seção "Para Advogados" com informações para profissionais
- [ ] Seção de Depoimentos/Avaliações
- [x] Footer com links e informações de contato
- [x] Design responsivo (mobile-first)
- [x] WhatsApp floating button

## Formulário Multi-Step EVA
- [x] Formulário progressivo com 4 etapas
- [x] Etapa 1: Tipo de pessoa (PF/PJ)
- [x] Etapa 2: Dados pessoais (nome, CPF/CNPJ, telefone, email)
- [x] Etapa 3: Descrição do caso
- [x] Etapa 4: Localização (CEP, cidade, estado, geolocalização)
- [x] Validação CPF/CNPJ em tempo real
- [x] Máscaras automáticas de input (telefone, CPF, CNPJ, CEP)
- [x] Busca automática de CEP (ViaCEP API)
- [x] Geolocalização via GPS
- [x] Barra de progresso visual
- [x] Feedback de erros em tempo real

## Reconhecimento de Voz
- [x] Botão de gravação de voz
- [x] Transcrição automática de áudio para texto
- [x] Suporte para português brasileiro
- [x] Feedback visual durante gravação
- [x] Compatibilidade com navegadores (Chrome, Edge, Safari)

## Integração IA
- [x] Envio de dados para backend API
- [x] Classificação automática de área do direito
- [x] Exibição de score de confiança
- [x] Análise de urgência do caso
- [x] Sugestão de documentos necessários
- [x] Tratamento de erros de API

## Analytics e Tracking
- [x] Google Tag Manager integrado
- [x] Google Analytics 4 configurado
- [x] Google Ads Conversion Tracking
- [x] Facebook Pixel integrado
- [x] Eventos customizados (form_start, form_step, lead_submit)
- [x] Tracking de scroll depth
- [x] Tracking de time on page
- [x] Tracking de abandono de formulário
- [x] Tracking de voice recording

## SEO e Performance
- [x] Meta tags otimizadas (title, description, keywords)
- [x] Open Graph tags (Facebook/LinkedIn)
- [x] Twitter Card tags
- [x] Structured Data (Schema.org)
- [x] Canonical URL
- [x] Favicon e apple-touch-icon
- [x] Preconnect para Google Fonts
- [ ] Lazy loading de imagens
- [ ] Otimização de performance (Lighthouse 90+)

## Configurações
- [x] Configurar API_URL para backend
- [x] Configurar WHATSAPP_NUMBER
- [x] Configurar Google Analytics ID
- [x] Configurar Google Ads ID
- [x] Configurar Facebook Pixel ID
- [x] Configurar Google Tag Manager ID

## Testes e Validação
- [x] Testar formulário completo end-to-end
- [x] Testar validações de CPF/CNPJ
- [x] Testar busca de CEP
- [x] Testar geolocalização
- [x] Testar reconhecimento de voz
- [x] Testar integração com API
- [x] Testar analytics e eventos
- [x] Testar responsividade em diferentes dispositivos
- [x] Testar compatibilidade de navegadores

## Novas Funcionalidades Solicitadas

### Áreas do Direito - Atualização
- [x] Adicionar Direito Condominial
- [x] Adicionar Execuções Judiciais de Taxas e Despesas de Condomínio
- [x] Adicionar Direito Criminal (Defesas)
- [x] Adicionar Audiência de Custódia e Plantão Criminal
- [x] Adicionar Fraudes Bancárias e Pirâmides Financeiras
- [x] Adicionar Defesas em Processos Judiciais (bloqueios e desbloqueios)
- [x] Adicionar Direito e Erro Médico (medicamentos, plano de saúde)
- [x] Atualizar Direito de Trânsito (apenas acidentes com/sem vítimas)

### Formulário - Novos Campos
- [x] Adicionar campo de endereço completo (rua, número, complemento, bairro)
- [x] Adicionar campo "Canal de contato preferido" (WhatsApp, Telefone, Email)
- [x] Adicionar campo "Horários de preferência para contato"
- [x] Adicionar campo "Telefone de contato alternativo" (com validação de número diferente)
- [x] Para PJ: adicionar campo "Responsável pela empresa" (nome + CPF)
- [x] Para PJ: busca automática de dados via CNPJ (ReceitaWS API)

### Melhorias UX
- [x] Implementar popup da EVA.AI para auxiliar usuários
- [x] Validação para impedir cadastro do mesmo número em contato alternativo
- [x] Auto-preenchimento de dados da empresa via CNPJ


## Seção de Atendimento Online
- [x] Criar seção persuasiva sobre atendimento online
- [x] Adicionar frase de impacto sobre conveniência (Meet, Zoom, Teams)
- [x] Incluir ícones de plataformas de videoconferência
- [x] Adicionar destaque de segurança e confidencialidade
- [x] Incluir emojis e ícones criativos

## Mapa Interativo do Brasil
- [x] Criar componente de mapa do Brasil
- [x] Mostrar cobertura em todos os 27 estados
- [x] Adicionar interatividade ao mapa
- [x] Exibir contagem de estados/municípios/bairros
- [x] Design criativo e intuitivo

## Rodapé Reorganizado
- [x] Reorganizar estrutura do rodapé
- [x] Adicionar links úteis e navegação
- [x] Incluir informações de contato
- [x] Adicionar redes sociais
- [x] Melhorar responsividade mobile
- [x] Adicionar badges de segurança/certificações


## Seção de Blog
- [x] Criar estrutura de dados para artigos
- [x] Implementar componente de card de artigo
- [x] Criar seção de artigos recentes na página inicial
- [x] Implementar página de blog completa
- [x] Adicionar filtros por categoria/área do direito
- [x] Implementar busca de artigos
- [x] Criar página individual de artigo
- [x] Adicionar compartilhamento em redes sociais
- [ ] Implementar sistema de comentários
- [x] Adicionar newsletter/inscrição
- [x] Otimizar SEO dos artigos
- [x] Adicionar tempo de leitura estimado
- [x] Implementar artigos relacionados
