import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchCNPJ } from './cnpj';

// Mock do fetch global
global.fetch = vi.fn();

describe('Busca de CNPJ', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve validar CNPJ com 14 dígitos', async () => {
    const mockResponse = {
      status: 'OK',
      cnpj: '11.222.333/0001-81',
      nome: 'Empresa Teste LTDA',
      fantasia: 'Teste',
      cep: '01310-100',
      logradouro: 'Av Paulista',
      numero: '1000',
      complemento: '',
      bairro: 'Bela Vista',
      municipio: 'São Paulo',
      uf: 'SP',
      telefone: '(11) 3000-0000',
      email: 'contato@teste.com',
      situacao: 'ATIVA',
      abertura: '01/01/2020',
    };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await fetchCNPJ('11.222.333/0001-81');
    
    expect(result.razao_social).toBe('Empresa Teste LTDA');
    expect(result.municipio).toBe('São Paulo');
    expect(result.uf).toBe('SP');
  });

  it('deve rejeitar CNPJ com menos de 14 dígitos', async () => {
    await expect(fetchCNPJ('123456')).rejects.toThrow('CNPJ inválido');
  });

  it('deve tratar erro da API', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
    });

    await expect(fetchCNPJ('11222333000181')).rejects.toThrow('Erro ao buscar CNPJ');
  });

  it('deve tratar CNPJ não encontrado', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        status: 'ERROR',
        message: 'CNPJ não encontrado',
      }),
    });

    await expect(fetchCNPJ('11222333000181')).rejects.toThrow('CNPJ não encontrado');
  });
});
