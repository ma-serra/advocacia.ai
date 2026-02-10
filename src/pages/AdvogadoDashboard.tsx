import { useState, useEffect } from 'react';
import { DashboardStats, LeadPorArea, Lead } from '@/lib/types';

export default function AdvogadoDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [leadsRecentes, setLeadsRecentes] = useState<Lead[]>([]);
  const [leadsArea, setLeadsArea] = useState<LeadPorArea[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carregamento de dados
    setTimeout(() => {
      setStats({
        totalLeads: 247,
        leadsNovos: 12,
        leadsAnalisando: 8,
        leadsAnalisados: 156,
        leadsAtribuidos: 71,
        taxaConversao: 28.7,
        tempoMedioResposta: 2.5,
        satisfacaoMedia: 4.8,
      });

      setLeadsArea([
        { area: 'Direito do Trabalho', quantidade: 45, percentual: 18.2 },
        { area: 'Direito de Família', quantidade: 38, percentual: 15.4 },
        { area: 'Direito Condominial', quantidade: 32, percentual: 12.9 },
        { area: 'Direito Criminal', quantidade: 28, percentual: 11.3 },
        { area: 'Direito Médico', quantidade: 24, percentual: 9.7 },
      ]);

      setLeadsRecentes([
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
            documentosNecessarios: ['Contrato de trabalho', 'Comprovante de demissão'],
            recomendacoes: ['Coletar documentos de demissão', 'Verificar se há acordo'],
            complexidade: 'media',
          },
        },
      ]);

      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return <div className="container py-20 text-center">Carregando dashboard...</div>;
  }

  return (
    <div className="advogado-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="container">
          <h1>Dashboard do Advogado</h1>
          <p>Bem-vindo! Aqui você acompanha todos os seus leads e análises de IA</p>
        </div>
      </div>

      <div className="container">
        {/* Stats Cards */}
        {stats && (
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-content">
                <div className="stat-value">{stats.totalLeads}</div>
                <div className="stat-label">Total de Leads</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">✨</div>
              <div className="stat-content">
                <div className="stat-value">{stats.leadsNovos}</div>
                <div className="stat-label">Leads Novos</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">⚙️</div>
              <div className="stat-content">
                <div className="stat-value">{stats.leadsAnalisando}</div>
                <div className="stat-label">Analisando</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-content">
                <div className="stat-value">{stats.leadsAnalisados}</div>
                <div className="stat-label">Analisados</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">🎯</div>
              <div className="stat-content">
                <div className="stat-value">{stats.taxaConversao.toFixed(1)}%</div>
                <div className="stat-label">Taxa de Conversão</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">⭐</div>
              <div className="stat-content">
                <div className="stat-value">{stats.satisfacaoMedia.toFixed(1)}</div>
                <div className="stat-label">Satisfação Média</div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="dashboard-content">
          {/* Left Column */}
          <div className="dashboard-main">
            {/* Leads Recentes */}
            <section className="dashboard-section">
              <div className="section-header">
                <h2>Leads Recentes</h2>
                <a href="/advogado/leads" className="btn btn-secondary btn-sm">
                  Ver Todos →
                </a>
              </div>

              <div className="leads-table">
                <table>
                  <thead>
                    <tr>
                      <th>Cliente</th>
                      <th>Área</th>
                      <th>Urgência</th>
                      <th>Status</th>
                      <th>Ação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leadsRecentes.map(lead => (
                      <tr key={lead.id}>
                        <td>
                          <div className="lead-name">
                            <strong>{lead.nome}</strong>
                            <small>{lead.email}</small>
                          </div>
                        </td>
                        <td>{lead.areaDireito}</td>
                        <td>
                          <span className={`urgencia-badge ${lead.analiseIA?.urgencia}`}>
                            {lead.analiseIA?.urgencia}
                          </span>
                        </td>
                        <td>
                          <span className={`status-badge ${lead.status}`}>
                            {lead.status}
                          </span>
                        </td>
                        <td>
                          <a href={`/advogado/leads/${lead.id}`} className="btn btn-primary btn-xs">
                            Ver Detalhes
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Gráfico de Leads por Área */}
            <section className="dashboard-section">
              <h2>Leads por Área do Direito</h2>
              <div className="area-chart">
                {leadsArea.map(area => (
                  <div key={area.area} className="area-item">
                    <div className="area-info">
                      <span className="area-name">{area.area}</span>
                      <span className="area-count">{area.quantidade} leads</span>
                    </div>
                    <div className="area-bar">
                      <div
                        className="area-progress"
                        style={{ width: `${area.percentual * 5}%` }}
                      ></div>
                    </div>
                    <span className="area-percent">{area.percentual.toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column - Sidebar */}
          <aside className="dashboard-sidebar">
            {/* Quick Actions */}
            <div className="sidebar-widget">
              <h3>Ações Rápidas</h3>
              <div className="quick-actions">
                <a href="/advogado/leads?status=novo" className="quick-action-btn">
                  <span className="icon">🆕</span>
                  <span className="text">Novos Leads</span>
                  <span className="count">{stats?.leadsNovos}</span>
                </a>
                <a href="/advogado/leads?status=analisando" className="quick-action-btn">
                  <span className="icon">⚙️</span>
                  <span className="text">Em Análise</span>
                  <span className="count">{stats?.leadsAnalisando}</span>
                </a>
                <a href="/advogado/leads?status=analisado" className="quick-action-btn">
                  <span className="icon">✅</span>
                  <span className="text">Analisados</span>
                  <span className="count">{stats?.leadsAnalisados}</span>
                </a>
              </div>
            </div>

            {/* Próximas Ações */}
            <div className="sidebar-widget">
              <h3>Próximas Ações</h3>
              <ul className="action-list">
                <li>
                  <span className="action-time">Hoje 14:00</span>
                  <span className="action-text">Contato com João Silva</span>
                </li>
                <li>
                  <span className="action-time">Amanhã 10:00</span>
                  <span className="action-text">Agendar consulta - Maria</span>
                </li>
                <li>
                  <span className="action-time">Amanhã 15:30</span>
                  <span className="action-text">Enviar documentos - Pedro</span>
                </li>
              </ul>
            </div>

            {/* Dicas */}
            <div className="sidebar-widget tips-widget">
              <h3>💡 Dica do Dia</h3>
              <p>
                Responda aos leads dentro de 2 horas para aumentar sua taxa de conversão em até 40%.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
