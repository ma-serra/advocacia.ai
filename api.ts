const CONFIG = {
  API_URL: 'https://api.advocacia.ai',
  API_LOCAL: 'http://localhost:8000',
  USE_LOCAL: window.location.hostname === 'localhost',
  OPENAI_ENDPOINT: '/api/leads/',
};

const getApiUrl = () => {
  return CONFIG.USE_LOCAL ? CONFIG.API_LOCAL : CONFIG.API_URL;
};

export interface LeadData {
  tipo_pessoa: 'pf' | 'pj';
  nome_razao: string;
  cpf_cnpj: string;
  telefone: string;
  email: string;
  descricao: string;
  cep: string;
  cidade: string;
  estado: string;
  geolat: number | null;
  geolon: number | null;
  origem: string;
}

export interface LeadResponse {
  lead_id: string;
  ia: {
    area: string;
    confidence: number;
    tags: string[];
    urgency: string;
  };
}

export async function submitLead(data: LeadData): Promise<LeadResponse> {
  const url = `${getApiUrl()}${CONFIG.OPENAI_ENDPOINT}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...data,
      origem: 'web-landing',
    }),
  });

  if (!response.ok) {
    throw new Error(`Erro ao enviar lead: ${response.statusText}`);
  }

  return response.json();
}

export interface CEPData {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

export async function fetchCEP(cep: string): Promise<CEPData> {
  const cleanCEP = cep.replace(/\D/g, '');
  
  if (cleanCEP.length !== 8) {
    throw new Error('CEP inválido');
  }

  const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`);
  
  if (!response.ok) {
    throw new Error('Erro ao buscar CEP');
  }

  const data = await response.json();
  
  if (data.erro) {
    throw new Error('CEP não encontrado');
  }

  return data;
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
}

export async function getCurrentLocation(): Promise<GeoLocation> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocalização não suportada'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        reject(new Error(`Erro ao obter localização: ${error.message}`));
      }
    );
  });
}
