import { useState } from 'react';
import { FiltrosLead, Lead } from '@/lib/types';

export default function LeadsPage() {
  const [filtros, setFiltros] = useState<FiltrosLead>({});
  const [leads, setLeads] = useState<Lead[]>([
    {
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
      status: 'analisado',
      analiseIA: {
        categoria: 'Rescisão Contratual',
        urgencia: 'media',
        scoreConfianca: 0.92,
        documentosNecessarios: ['Contrato', 'Comprovante'],
        recomendacoes: ['Coletar documentos'],
        complexidade: 'media',
      },
    },
  ]);

  const handleFiltroChange = (chave: keyof FiltrosLead, valor: string) => {
    setFiltros(prev => ({
      ...prev,
      [chave]: valor || undefined,
    }));
  };

  return (
    <div className="leads-page">
      {/* Header */}
      <div className="page-header">
        <div className="container">
          <h1>Gerenciar Leads</h1>
          <p>Acompanhe todos os seus leads e análises de IA</p>
        </div>
      </div>

      <div className="container">
        {/* Filtros */}
        <div className="filters-section">
          <div className="filter-group">
            <label>Status</label>
            <select
              value={filtros.status || ''}
              onChange={e => handleFiltroChange('status', e.target.value)}
              className="filter-select"
            >
              <option value="">Todos</option>
              <option value="novo">Novo</option>
              <option value="analisando">Analisando</option>
              <option value="analisado">Analisado</option>
              <option value="atribuido">Atribuído</option>
              <option value="concluido">Concluído</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Área do Direito</label>
            <select
              value={filtros.areaDireito || ''}
              onChange={e => handleFiltroChange('areaDireito', e.target.value)}
              className="filter-select"
            >
              <option value="">Todas</option>
              <option value="Direito do Trabalho">Direito do Trabalho</option>
              <option value="Direito de Família">Direito de Família</option>
              <option value="Direito Condominial">Direito Condominial</option>
              <option value="Direito Criminal">Direito Criminal</option>
              <option value="Direito Médico">Direito Médico</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Urgência</label>
            <select
              value={filtros.urgencia || ''}
              onChange={e => handleFiltroChange('urgencia', e.target.value)}
              className="filter-select"
            >
              <option value="">Todas</option>
              <option value="baixa">Baixa</option>
              <option value="media">Média</option>
              <option value="alta">Alta</option>
              <option value="critica">Crítica</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Buscar</label>
            <input
              type="text"
              placeholder="Nome, email ou CPF..."
              value={filtros.busca || ''}
              onChange={e => handleFiltroChange('busca', e.target.value)}
              className="filter-input"
            />
          </div>
        </div>

        {/* Leads Table */}
        <div className="leads-section">
          <div className="section-header">
            <h2>Leads ({leads.length})</h2>
          </div>

          <div className="leads-table-wrapper">
            <table className="leads-table">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Contato</th>
                  <th>Área</th>
                  <th>Urgência</th>
                  <th>Confiança IA</th>
                  <th>Status</th>
                  <th>Data</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {leads.map(lead => (
                  <tr key={lead.id} className={`lead-row ${lead.status}`}>
                    <td>
                      <div className="lead-cell">
                        <strong>{lead.nome}</strong>
                        <small>{lead.tipoCliente === 'PF' ? 'Pessoa Física' : 'Pessoa Jurídica'}</small>
                      </div>
                    </td>
                    <td>
                      <div className="lead-cell">
                        <a href={`mailto:${lead.email}`}>{lead.email}</a>
                        <small>{lead.telefonePrincipal}</small>
                      </div>
                    </td>
                    <td>{lead.areaDireito}</td>
                    <td>
                      <span className={`urgencia-badge ${lead.analiseIA?.urgencia}`}>
                        {lead.analiseIA?.urgencia.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <div className="confianca-bar">
                        <div
                          className="confianca-fill"
                          style={{ width: `${(lead.analiseIA?.scoreConfianca || 0) * 100}%` }}
                        ></div>
                        <span className="confianca-text">
                          {((lead.analiseIA?.scoreConfianca || 0) * 100).toFixed(0)}%
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className={`status-badge ${lead.status}`}>
                        {lead.status.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <small>{new Date(lead.dataCadastro).toLocaleDateString('pt-BR')}</small>
                    </td>
                    <td>
                      <a href={`/advogado/leads/${lead.id}`} className="btn btn-primary btn-xs">
                        Ver
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
