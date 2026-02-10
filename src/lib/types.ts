// Lead Types
export interface Lead {
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
  status: 'novo' | 'analisando' | 'analisado' | 'atribuido' | 'concluido';
  
  // Dados da IA
  analiseIA?: AnaliseIA;
  
  // Atribuição
  advogadoAtribuido?: string;
  dataAtribuicao?: string;
  
  // Comunicação
  proximoContato?: string;
  anotacoes?: string;
}

export interface AnaliseIA {
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
  tempoEstimado?: string;
  complexidade: 'baixa' | 'media' | 'alta';
  jurisprudenciaRelevante?: string[];
}

// Advogado Types
export interface Advogado {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  oab: string;
  especialidades: string[];
  fotoPerfil?: string;
  bio?: string;
  leadsAtribuidos: number;
  taxaResolucao: number; // percentual
  avaliacaoMedia: number;
  ativo: boolean;
  dataCadastro: string;
}

// Dashboard Types
export interface DashboardStats {
  totalLeads: number;
  leadsNovos: number;
  leadsAnalisando: number;
  leadsAnalisados: number;
  leadsAtribuidos: number;
  taxaConversao: number;
  tempoMedioResposta: number; // em horas
  satisfacaoMedia: number;
}

export interface LeadPorArea {
  area: string;
  quantidade: number;
  percentual: number;
}

export interface LeadPorUrgencia {
  urgencia: 'baixa' | 'media' | 'alta' | 'critica';
  quantidade: number;
}

// Filtros
export interface FiltrosLead {
  status?: string;
  areaDireito?: string;
  urgencia?: string;
  dataInicio?: string;
  dataFim?: string;
  advogado?: string;
  busca?: string;
}

// Resposta da API
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  pagina: number;
  porPagina: number;
  totalPaginas: number;
}
