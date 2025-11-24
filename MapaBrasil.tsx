import { useState } from 'react';

interface Estado {
  sigla: string;
  nome: string;
  municipios: number;
  bairros: number;
}

const estados: Estado[] = [
  { sigla: 'AC', nome: 'Acre', municipios: 22, bairros: 150 },
  { sigla: 'AL', nome: 'Alagoas', municipios: 102, bairros: 450 },
  { sigla: 'AP', nome: 'Amapá', municipios: 16, bairros: 120 },
  { sigla: 'AM', nome: 'Amazonas', municipios: 62, bairros: 380 },
  { sigla: 'BA', nome: 'Bahia', municipios: 417, bairros: 2500 },
  { sigla: 'CE', nome: 'Ceará', municipios: 184, bairros: 1200 },
  { sigla: 'DF', nome: 'Distrito Federal', municipios: 1, bairros: 120 },
  { sigla: 'ES', nome: 'Espírito Santo', municipios: 78, bairros: 600 },
  { sigla: 'GO', nome: 'Goiás', municipios: 246, bairros: 1500 },
  { sigla: 'MA', nome: 'Maranhão', municipios: 217, bairros: 1100 },
  { sigla: 'MT', nome: 'Mato Grosso', municipios: 141, bairros: 900 },
  { sigla: 'MS', nome: 'Mato Grosso do Sul', municipios: 79, bairros: 650 },
  { sigla: 'MG', nome: 'Minas Gerais', municipios: 853, bairros: 4500 },
  { sigla: 'PA', nome: 'Pará', municipios: 143, bairros: 800 },
  { sigla: 'PB', nome: 'Paraíba', municipios: 223, bairros: 1300 },
  { sigla: 'PR', nome: 'Paraná', municipios: 399, bairros: 2800 },
  { sigla: 'PE', nome: 'Pernambuco', municipios: 184, bairros: 1400 },
  { sigla: 'PI', nome: 'Piauí', municipios: 224, bairros: 1100 },
  { sigla: 'RJ', nome: 'Rio de Janeiro', municipios: 92, bairros: 1800 },
  { sigla: 'RN', nome: 'Rio Grande do Norte', municipios: 167, bairros: 900 },
  { sigla: 'RS', nome: 'Rio Grande do Sul', municipios: 497, bairros: 3200 },
  { sigla: 'RO', nome: 'Rondônia', municipios: 52, bairros: 350 },
  { sigla: 'RR', nome: 'Roraima', municipios: 15, bairros: 100 },
  { sigla: 'SC', nome: 'Santa Catarina', municipios: 295, bairros: 2100 },
  { sigla: 'SP', nome: 'São Paulo', municipios: 645, bairros: 5000 },
  { sigla: 'SE', nome: 'Sergipe', municipios: 75, bairros: 450 },
  { sigla: 'TO', nome: 'Tocantins', municipios: 139, bairros: 800 },
];

export default function MapaBrasil() {
  const [selectedEstado, setSelectedEstado] = useState<Estado | null>(null);
  
  const totalMunicipios = estados.reduce((sum, e) => sum + e.municipios, 0);
  const totalBairros = estados.reduce((sum, e) => sum + e.bairros, 0);

  return (
    <section className="section section-mapa-brasil">
      <div className="container">
        <div className="mapa-header">
          <h2 className="mapa-title">
            Cobertura em Todo o Brasil 🇧🇷
          </h2>
          <p className="mapa-subtitle">
            Estamos presentes em todos os estados, municípios e bairros do Brasil
          </p>
        </div>
        
        <div className="mapa-stats">
          <div className="stat-card">
            <div className="stat-icon">🗺️</div>
            <div className="stat-content">
              <div className="stat-number">27</div>
              <div className="stat-label">Estados Cobertos</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">🏙️</div>
            <div className="stat-content">
              <div className="stat-number">{totalMunicipios.toLocaleString()}</div>
              <div className="stat-label">Municípios</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">🏘️</div>
            <div className="stat-content">
              <div className="stat-number">{totalBairros.toLocaleString()}</div>
              <div className="stat-label">Bairros</div>
            </div>
          </div>
        </div>
        
        <div className="mapa-content">
          {/* Mapa ASCII simplificado do Brasil */}
          <div className="mapa-visual">
            <div className="mapa-container">
              <svg viewBox="0 0 1000 1000" className="mapa-svg">
                {/* Representação simplificada do Brasil */}
                <defs>
                  <linearGradient id="brasilGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#3B82F6', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#1E40AF', stopOpacity: 1 }} />
                  </linearGradient>
                </defs>
                
                {/* Silhueta simplificada do Brasil */}
                <path
                  d="M 300,150 L 450,100 L 550,120 L 600,150 L 650,140 L 700,160 L 720,200 L 750,250 L 760,300 L 780,350 L 800,400 L 820,450 L 830,500 L 820,550 L 800,600 L 780,650 L 750,700 L 700,750 L 650,780 L 600,800 L 550,810 L 500,820 L 450,810 L 400,800 L 350,790 L 300,780 L 250,750 L 200,700 L 180,650 L 170,600 L 160,550 L 150,500 L 140,450 L 130,400 L 120,350 L 110,300 L 100,250 L 90,200 L 100,150 Z"
                  fill="url(#brasilGradient)"
                  opacity="0.3"
                  stroke="#1E40AF"
                  strokeWidth="2"
                />
                
                {/* Pontos representando estados */}
                {[
                  { x: 350, y: 200, label: 'N' },
                  { x: 400, y: 250, label: 'NE' },
                  { x: 500, y: 350, label: 'CO' },
                  { x: 550, y: 450, label: 'SE' },
                  { x: 450, y: 550, label: 'S' },
                ].map((region, idx) => (
                  <circle
                    key={idx}
                    cx={region.x}
                    cy={region.y}
                    r="40"
                    fill="#10B981"
                    opacity="0.7"
                  />
                ))}
                
                {/* Texto de cobertura */}
                <text x="500" y="500" textAnchor="middle" fontSize="24" fill="#1E40AF" fontWeight="bold">
                  100% Cobertura
                </text>
              </svg>
              
              <div className="mapa-overlay">
                <div className="coverage-badge">
                  <span className="badge-icon">✓</span>
                  <span className="badge-text">Cobertura Nacional</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Lista de estados */}
          <div className="estados-grid">
            {estados.map((estado) => (
              <div
                key={estado.sigla}
                className={`estado-card ${selectedEstado?.sigla === estado.sigla ? 'active' : ''}`}
                onClick={() => setSelectedEstado(selectedEstado?.sigla === estado.sigla ? null : estado)}
              >
                <div className="estado-sigla">{estado.sigla}</div>
                <div className="estado-info">
                  <h4 className="estado-nome">{estado.nome}</h4>
                  <div className="estado-stats">
                    <span className="stat">🏙️ {estado.municipios}</span>
                    <span className="stat">🏘️ {estado.bairros}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Selected Estado Details */}
        {selectedEstado && (
          <div className="estado-details">
            <div className="details-card">
              <h3>{selectedEstado.nome}</h3>
              <div className="details-grid">
                <div className="detail-item">
                  <span className="detail-label">Estado</span>
                  <span className="detail-value">{selectedEstado.sigla}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Municípios</span>
                  <span className="detail-value">{selectedEstado.municipios}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Bairros</span>
                  <span className="detail-value">{selectedEstado.bairros}</span>
                </div>
              </div>
              <p className="details-text">
                Temos advogados especializados em todas as áreas do direito atendendo em {selectedEstado.nome}. 
                Clique no botão abaixo para começar sua análise gratuita.
              </p>
              <button className="btn btn-primary">
                Analisar Meu Caso Agora
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
