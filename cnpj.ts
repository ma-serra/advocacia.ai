export interface CNPJData {
  cnpj: string;
  razao_social: string;
  nome_fantasia: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  municipio: string;
  uf: string;
  telefone: string;
  email: string;
  situacao: string;
  data_abertura: string;
}

export async function fetchCNPJ(cnpj: string): Promise<CNPJData> {
  const cleanCNPJ = cnpj.replace(/\D/g, '');
  
  if (cleanCNPJ.length !== 14) {
    throw new Error('CNPJ inválido');
  }

  // Usando ReceitaWS API (gratuita)
  const response = await fetch(`https://www.receitaws.com.br/v1/cnpj/${cleanCNPJ}`);
  
  if (!response.ok) {
    throw new Error('Erro ao buscar CNPJ');
  }

  const data = await response.json();
  
  if (data.status === 'ERROR') {
    throw new Error(data.message || 'CNPJ não encontrado');
  }

  return {
    cnpj: data.cnpj,
    razao_social: data.nome || '',
    nome_fantasia: data.fantasia || '',
    cep: data.cep || '',
    logradouro: data.logradouro || '',
    numero: data.numero || '',
    complemento: data.complemento || '',
    bairro: data.bairro || '',
    municipio: data.municipio || '',
    uf: data.uf || '',
    telefone: data.telefone || '',
    email: data.email || '',
    situacao: data.situacao || '',
    data_abertura: data.abertura || '',
  };
}
