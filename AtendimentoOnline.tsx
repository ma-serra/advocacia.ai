export default function AtendimentoOnline() {
  return (
    <section className="section section-online-attendance">
      <div className="container">
        <div className="attendance-wrapper">
          {/* Left Side - Text Content */}
          <div className="attendance-content">
            <div className="attendance-badge">
              <span className="badge-icon">⚡</span>
              <span className="badge-text">Atendimento 100% Online</span>
            </div>
            
            <h2 className="attendance-title">
              Conecte-se com Advogados Especializados
              <span className="highlight"> Sem Sair de Casa</span>
            </h2>
            
            <p className="attendance-subtitle">
              Invés de ficar perdendo horas e horas no trânsito ou transporte público, conecte-se agora com advogados que irão te atender de forma online via Meet, Zoom ou Teams.
            </p>
            
            <div className="attendance-features">
              <div className="feature-item">
                <div className="feature-icon">📱</div>
                <div className="feature-content">
                  <h4>Tudo na Palma da Sua Mão</h4>
                  <p>Acesse de qualquer lugar, a qualquer hora, do seu celular ou computador</p>
                </div>
              </div>
              
              <div className="feature-item">
                <div className="feature-icon">🔒</div>
                <div className="feature-content">
                  <h4>100% Seguro e Confidencial</h4>
                  <p>Suas informações e conversas são protegidas com criptografia de ponta a ponta</p>
                </div>
              </div>
              
              <div className="feature-item">
                <div className="feature-icon">⚖️</div>
                <div className="feature-content">
                  <h4>Segurança para Todos</h4>
                  <p>Tanto você quanto os advogados têm total segurança e privacidade garantidas</p>
                </div>
              </div>
              
              <div className="feature-item">
                <div className="feature-icon">⏱️</div>
                <div className="feature-content">
                  <h4>Economia de Tempo</h4>
                  <p>Sem deslocamentos, sem filas, atendimento rápido e eficiente</p>
                </div>
              </div>
            </div>
            
            <div className="attendance-platforms">
              <p className="platforms-label">Plataformas Suportadas:</p>
              <div className="platforms-list">
                <div className="platform-badge">
                  <span className="platform-icon">📹</span>
                  <span className="platform-name">Google Meet</span>
                </div>
                <div className="platform-badge">
                  <span className="platform-icon">🎥</span>
                  <span className="platform-name">Zoom</span>
                </div>
                <div className="platform-badge">
                  <span className="platform-icon">💼</span>
                  <span className="platform-name">Microsoft Teams</span>
                </div>
                <div className="platform-badge">
                  <span className="platform-icon">☎️</span>
                  <span className="platform-name">Chamada Telefônica</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Side - Visual */}
          <div className="attendance-visual">
            <div className="visual-card">
              <div className="visual-header">
                <div className="visual-dot"></div>
                <div className="visual-dot"></div>
                <div className="visual-dot"></div>
              </div>
              
              <div className="visual-content">
                <div className="video-placeholder">
                  <div className="video-icon">🎥</div>
                  <p>Atendimento via Videoconferência</p>
                </div>
                
                <div className="benefits-list">
                  <div className="benefit">
                    <span className="benefit-check">✓</span>
                    <span>Atendimento Personalizado</span>
                  </div>
                  <div className="benefit">
                    <span className="benefit-check">✓</span>
                    <span>Resposta em Minutos</span>
                  </div>
                  <div className="benefit">
                    <span className="benefit-check">✓</span>
                    <span>Segurança Garantida</span>
                  </div>
                  <div className="benefit">
                    <span className="benefit-check">✓</span>
                    <span>Disponível 24/7</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
