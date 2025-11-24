import { useParams } from 'wouter';
import { useState } from 'react';
import { Lead } from '@/lib/types';

export default function LeadDetail() {
  const params = useParams();
  const leadId = params.id as string;

  // Mock data - em produção, buscar da API
  const [lead] = useState<Lead>({
    id: leadId,
    tipoCliente: 'PF',
    nome: 'João Silva',
    cpfCnpj: '123.456.789-00',
    email: 'joao@email.com',
    telefonePrincipal: '(11) 98765-4321',
    telefoneAlternativo: '(11) 99999-8888',
    canalPreferido: 'whatsapp',
    horarioPreferido: 'manhã',
    endereco: {
      cep: '01310-100',
      rua: 'Av Paulista',
      numero: '1000',
      complemento: 'Apto 1500',
      bairro: 'Bela Vista',
      cidade: 'São Paulo',
      estado: 'SP',
    },
    areaDireito: 'Direito do Trabalho',
    descricaoCaso:
      'Fui demitido sem justa causa e não recebi minhas verbas rescisórias. Preciso de ajuda para entender meus direitos e recuperar o dinheiro.',
    dataCadastro: '2024-11-24',
    status: 'analisado',
    analiseIA: {
      categoria: 'Rescisão Contratual',
      urgencia: 'media',
      scoreConfianca: 0.92,
      documentosNecessarios: [
        'Contrato de trabalho original',
        'Comprovante de demissão',
        'Contracheque dos últimos 3 meses',
        'Comprovante de FGTS',
      ],
      recomendacoes: [
        'Coletar documentação de demissão imediatamente',
        'Verificar se houve acordo de rescisão',
        'Calcular verbas devidas (13º, férias, aviso prévio)',
        'Considerar ação trabalhista se empresa não pagar',
      ],
      estimativaHonorarios: {
        minimo: 2000,
        maximo: 5000,
        moeda: 'BRL',
      },
      tempoEstimado: '2-3 meses',
      complexidade: 'media',
      jurisprudenciaRelevante: [
        'CLT - Artigos 477 a 480',
        'Súmula 291 TST - Rescisão indireta',
      ],
    },
    anotacoes: 'Cliente parece ansioso. Primeira vez lidando com processo trabalhista.',
  });

  const [novaAnotacao, setNovaAnotacao] = useState('');
  const [showAnotacao, setShowAnotacao] = useState(false);

  const handleAdicionarAnotacao = () => {
    if (novaAnotacao.trim()) {
      // Em produção, enviar para API
      setNovaAnotacao('');
      setShowAnotacao(false);
    }
  };

  return (
    <div className="lead-detail-page">
      {/* Header */}
      <div className="page-header">
        <div className="container">
          <div className="header-content">
            <div>
              <h1>{lead.nome}</h1>
              <p>{lead.areaDireito}</p>
            </div>
            <div className="header-actions">
              <button className="btn btn-primary">Enviar Mensagem</button>
              <button className="btn btn-secondary">Agendar Consulta</button>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="lead-detail-content">
          {/* Main Content */}
          <div className="lead-main">
            {/* Informações Pessoais */}
            <section className="detail-section">
              <h2>Informações Pessoais</h2>
              <div className="info-grid">
                <div className="info-item">
                  <label>Nome</label>
                  <p>{lead.nome}</p>
                </div>
                <div className="info-item">
                  <label>CPF</label>
                  <p>{lead.cpfCnpj}</p>
                </div>
                <div className="info-item">
                  <label>Email</label>
                  <p>
                    <a href={`mailto:${lead.email}`}>{lead.email}</a>
                  </p>
                </div>
                <div className="info-item">
                  <label>Telefone Principal</label>
                  <p>{lead.telefonePrincipal}</p>
                </div>
                <div className="info-item">
                  <label>Telefone Alternativo</label>
                  <p>{lead.telefoneAlternativo || '-'}</p>
                </div>
                <div className="info-item">
                  <label>Canal Preferido</label>
                  <p className="channel-badge">{lead.canalPreferido.toUpperCase()}</p>
                </div>
              </div>
            </section>

            {/* Endereço */}
            <section className="detail-section">
              <h2>Endereço</h2>
              <div className="info-grid">
                <div className="info-item full">
                  <label>Endereço Completo</label>
                  <p>
                    {lead.endereco.rua}, {lead.endereco.numero}
                    {lead.endereco.complemento && ` - ${lead.endereco.complemento}`}
                  </p>
                </div>
                <div className="info-item">
                  <label>Bairro</label>
                  <p>{lead.endereco.bairro}</p>
                </div>
                <div className="info-item">
                  <label>Cidade</label>
                  <p>{lead.endereco.cidade}</p>
                </div>
                <div className="info-item">
                  <label>Estado</label>
                  <p>{lead.endereco.estado}</p>
                </div>
                <div className="info-item">
                  <label>CEP</label>
                  <p>{lead.endereco.cep}</p>
                </div>
              </div>
            </section>

            {/* Descrição do Caso */}
            <section className="detail-section">
              <h2>Descrição do Caso</h2>
              <div className="case-description">
                <p>{lead.descricaoCaso}</p>
              </div>
            </section>

            {/* Análise da IA */}
            {lead.analiseIA && (
              <section className="detail-section ia-analysis">
                <h2>📊 Análise da IA</h2>

                <div className="analysis-grid">
                  <div className="analysis-item">
                    <label>Categoria Identificada</label>
                    <p className="category-badge">{lead.analiseIA.categoria}</p>
                  </div>

                  <div className="analysis-item">
                    <label>Nível de Urgência</label>
                    <p className={`urgencia-badge ${lead.analiseIA.urgencia}`}>
                      {lead.analiseIA.urgencia.toUpperCase()}
                    </p>
                  </div>

                  <div className="analysis-item">
                    <label>Score de Confiança</label>
                    <div className="confidence-bar">
                      <div
                        className="confidence-fill"
                        style={{ width: `${lead.analiseIA.scoreConfianca * 100}%` }}
                      ></div>
                    </div>
                    <p>{(lead.analiseIA.scoreConfianca * 100).toFixed(0)}%</p>
                  </div>

                  <div className="analysis-item">
                    <label>Complexidade</label>
                    <p className={`complexity-badge ${lead.analiseIA.complexidade}`}>
                      {lead.analiseIA.complexidade.toUpperCase()}
                    </p>
                  </div>

                  <div className="analysis-item">
                    <label>Tempo Estimado</label>
                    <p>{lead.analiseIA.tempoEstimado}</p>
                  </div>

                  <div className="analysis-item">
                    <label>Estimativa de Honorários</label>
                    {lead.analiseIA.estimativaHonorarios && (
                      <p>
                        R$ {lead.analiseIA.estimativaHonorarios.minimo.toLocaleString()} a R${' '}
                        {lead.analiseIA.estimativaHonorarios.maximo.toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>

                {/* Documentos Necessários */}
                <div className="analysis-subsection">
                  <h3>📄 Documentos Necessários</h3>
                  <ul className="doc-list">
                    {lead.analiseIA.documentosNecessarios.map((doc, idx) => (
                      <li key={idx}>
                        <span className="doc-icon">📋</span>
                        {doc}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recomendações */}
                <div className="analysis-subsection">
                  <h3>💡 Recomendações</h3>
                  <ul className="recommendations-list">
                    {lead.analiseIA.recomendacoes.map((rec, idx) => (
                      <li key={idx}>
                        <span className="rec-icon">✓</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Jurisprudência */}
                {lead.analiseIA.jurisprudenciaRelevante && (
                  <div className="analysis-subsection">
                    <h3>⚖️ Jurisprudência Relevante</h3>
                    <ul className="jurisprudencia-list">
                      {lead.analiseIA.jurisprudenciaRelevante.map((jur, idx) => (
                        <li key={idx}>{jur}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>
            )}

            {/* Anotações */}
            <section className="detail-section">
              <div className="section-header">
                <h2>Anotações</h2>
                <button
                  onClick={() => setShowAnotacao(!showAnotacao)}
                  className="btn btn-secondary btn-sm"
                >
                  {showAnotacao ? 'Cancelar' : 'Adicionar Anotação'}
                </button>
              </div>

              {showAnotacao && (
                <div className="anotacao-form">
                  <textarea
                    value={novaAnotacao}
                    onChange={e => setNovaAnotacao(e.target.value)}
                    placeholder="Digite sua anotação..."
                    rows={4}
                  ></textarea>
                  <button onClick={handleAdicionarAnotacao} className="btn btn-primary">
                    Salvar Anotação
                  </button>
                </div>
              )}

              {lead.anotacoes && (
                <div className="anotacao-item">
                  <p>{lead.anotacoes}</p>
                  <small>Adicionado há 2 horas</small>
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <aside className="lead-sidebar">
            {/* Status */}
            <div className="sidebar-widget">
              <h3>Status</h3>
              <select className="status-select" defaultValue={lead.status}>
                <option value="novo">Novo</option>
                <option value="analisando">Analisando</option>
                <option value="analisado">Analisado</option>
                <option value="atribuido">Atribuído</option>
                <option value="concluido">Concluído</option>
              </select>
            </div>

            {/* Informações Rápidas */}
            <div className="sidebar-widget">
              <h3>Informações Rápidas</h3>
              <ul className="quick-info">
                <li>
                  <span>Data de Cadastro:</span>
                  <strong>{new Date(lead.dataCadastro).toLocaleDateString('pt-BR')}</strong>
                </li>
                <li>
                  <span>Horário Preferido:</span>
                  <strong>{lead.horarioPreferido}</strong>
                </li>
                <li>
                  <span>Canal Preferido:</span>
                  <strong>{lead.canalPreferido}</strong>
                </li>
              </ul>
            </div>

            {/* Ações */}
            <div className="sidebar-widget">
              <h3>Ações</h3>
              <div className="action-buttons">
                <button className="btn btn-primary btn-block">
                  📞 Ligar para Cliente
                </button>
                <button className="btn btn-secondary btn-block">
                  💬 Enviar WhatsApp
                </button>
                <button className="btn btn-secondary btn-block">
                  📧 Enviar Email
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
