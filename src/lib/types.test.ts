import { describe, it, expect } from 'vitest';
import { Lead, AnaliseIA, Advogado, DashboardStats } from './types';

describe('Types and Interfaces', () => {
  it('deve criar um lead válido', () => {
    const lead: Lead = {
      id: '1',
      tipoCliente: 'PF',
      nome: 'João Silva',
      cpfCnpj: '123.456.789-00',
      email: 'joao@email.com',
      telefonePrincipal: '(11) 98765-4321',
      canalPreferido: 'whatsapp',
      horarioPreferido: 'manhã',
      endereco: {
        cep: '01310-100',
        rua: 'Av Paulista',
        numero: '1000',
        bairro: 'Bela Vista',
        cidade: 'São Paulo',
        estado: 'SP',
      },
      areaDireito: 'Direito do Trabalho',
      descricaoCaso: 'Demissão sem justa causa',
      dataCadastro: '2024-11-24',
      status: 'novo',
    };

    expect(lead.id).toBe('1');
    expect(lead.nome).toBe('João Silva');
    expect(lead.tipoCliente).toBe('PF');
    expect(lead.status).toBe('novo');
  });

  it('deve criar uma análise de IA válida', () => {
    const analise: AnaliseIA = {
      categoria: 'Rescisão Contratual',
      urgencia: 'media',
      scoreConfianca: 0.92,
      documentosNecessarios: ['Contrato', 'Comprovante'],
      recomendacoes: ['Coletar documentos'],
      complexidade: 'media',
    };

    expect(analise.categoria).toBe('Rescisão Contratual');
    expect(analise.urgencia).toBe('media');
    expect(analise.scoreConfianca).toBe(0.92);
    expect(analise.documentosNecessarios.length).toBe(2);
  });

  it('deve criar um advogado válido', () => {
    const advogado: Advogado = {
      id: '1',
      nome: 'Dr. João Silva',
      email: 'joao@advocacia.com',
      telefone: '(11) 98765-4321',
      oab: 'SP 123456',
      especialidades: ['Direito do Trabalho', 'Direito Civil'],
      leadsAtribuidos: 10,
      taxaResolucao: 85.5,
      avaliacaoMedia: 4.8,
      ativo: true,
      dataCadastro: '2024-01-01',
    };

    expect(advogado.nome).toBe('Dr. João Silva');
    expect(advogado.oab).toBe('SP 123456');
    expect(advogado.especialidades.length).toBe(2);
    expect(advogado.ativo).toBe(true);
  });

  it('deve criar stats do dashboard válidos', () => {
    const stats: DashboardStats = {
      totalLeads: 247,
      leadsNovos: 12,
      leadsAnalisando: 8,
      leadsAnalisados: 156,
      leadsAtribuidos: 71,
      taxaConversao: 28.7,
      tempoMedioResposta: 2.5,
      satisfacaoMedia: 4.8,
    };

    expect(stats.totalLeads).toBe(247);
    expect(stats.taxaConversao).toBe(28.7);
    expect(stats.satisfacaoMedia).toBe(4.8);
  });

  it('deve permitir lead com dados opcionais', () => {
    const lead: Lead = {
      id: '1',
      tipoCliente: 'PJ',
      nome: 'Empresa XYZ',
      cpfCnpj: '12.345.678/0001-90',
      email: 'contato@empresa.com',
      telefonePrincipal: '(11) 3456-7890',
      telefoneAlternativo: '(11) 3456-7891',
      canalPreferido: 'email',
      horarioPreferido: 'tarde',
      endereco: {
        cep: '01310-100',
        rua: 'Av Paulista',
        numero: '1000',
        complemento: 'Sala 500',
        bairro: 'Bela Vista',
        cidade: 'São Paulo',
        estado: 'SP',
      },
      areaDireito: 'Direito Empresarial',
      descricaoCaso: 'Consultoria jurídica',
      dataCadastro: '2024-11-24',
      status: 'analisado',
      analiseIA: {
        categoria: 'Consultoria',
        urgencia: 'baixa',
        scoreConfianca: 0.95,
        documentosNecessarios: [],
        recomendacoes: [],
        complexidade: 'alta',
      },
      anotacoes: 'Cliente importante',
    };

    expect(lead.telefoneAlternativo).toBe('(11) 3456-7891');
    expect(lead.endereco.complemento).toBe('Sala 500');
    expect(lead.analiseIA?.categoria).toBe('Consultoria');
    expect(lead.anotacoes).toBe('Cliente importante');
  });

  it('deve validar urgência do lead', () => {
    const urgencias: Array<'baixa' | 'media' | 'alta' | 'critica'> = [
      'baixa',
      'media',
      'alta',
      'critica',
    ];

    urgencias.forEach(urgencia => {
      expect(['baixa', 'media', 'alta', 'critica']).toContain(urgencia);
    });
  });

  it('deve validar status do lead', () => {
    const statuses: Array<'novo' | 'analisando' | 'analisado' | 'atribuido' | 'concluido'> = [
      'novo',
      'analisando',
      'analisado',
      'atribuido',
      'concluido',
    ];

    statuses.forEach(status => {
      expect(['novo', 'analisando', 'analisado', 'atribuido', 'concluido']).toContain(status);
    });
  });

  it('deve validar complexidade da análise', () => {
    const complexidades: Array<'baixa' | 'media' | 'alta'> = ['baixa', 'media', 'alta'];

    complexidades.forEach(complexidade => {
      expect(['baixa', 'media', 'alta']).toContain(complexidade);
    });
  });

  it('deve permitir estimativa de honorários', () => {
    const analise: AnaliseIA = {
      categoria: 'Rescisão',
      urgencia: 'alta',
      scoreConfianca: 0.88,
      documentosNecessarios: [],
      recomendacoes: [],
      complexidade: 'media',
      estimativaHonorarios: {
        minimo: 2000,
        maximo: 5000,
        moeda: 'BRL',
      },
    };

    expect(analise.estimativaHonorarios?.minimo).toBe(2000);
    expect(analise.estimativaHonorarios?.maximo).toBe(5000);
    expect(analise.estimativaHonorarios?.moeda).toBe('BRL');
  });

  it('deve permitir jurisprudência relevante', () => {
    const analise: AnaliseIA = {
      categoria: 'Rescisão',
      urgencia: 'media',
      scoreConfianca: 0.9,
      documentosNecessarios: [],
      recomendacoes: [],
      complexidade: 'media',
      jurisprudenciaRelevante: ['CLT - Artigos 477 a 480', 'Súmula 291 TST'],
    };

    expect(analise.jurisprudenciaRelevante).toHaveLength(2);
    expect(analise.jurisprudenciaRelevante?.[0]).toBe('CLT - Artigos 477 a 480');
  });
});
