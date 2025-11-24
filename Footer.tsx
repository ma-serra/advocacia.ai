export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        {/* Footer Top */}
        <div className="footer-top">
          <div className="footer-brand">
            <div className="footer-logo">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <rect width="40" height="40" rx="8" fill="#1E40AF"/>
                <path d="M20 12L28 28H12L20 12Z" fill="white"/>
                <circle cx="20" cy="20" r="3" fill="#F59E0B"/>
              </svg>
              <span>Advocacia<span className="text-accent">.AI</span></span>
            </div>
            <p className="footer-description">
              Conectando você aos melhores advogados através de Inteligência Artificial
            </p>
            <div className="footer-badges">
              <span className="badge">🔒 Seguro</span>
              <span className="badge">✓ Verificado</span>
              <span className="badge">⭐ Confiável</span>
            </div>
          </div>
          
          <div className="footer-links">
            <div className="footer-column">
              <h4>Plataforma</h4>
              <a href="#como-funciona">Como Funciona</a>
              <a href="#areas">Áreas do Direito</a>
              <a href="#cobertura">Cobertura Nacional</a>
              <a href="#faq">Perguntas Frequentes</a>
            </div>
            
            <div className="footer-column">
              <h4>Para Advogados</h4>
              <a href="#cadastro-adv">Cadastre-se</a>
              <a href="#planos">Planos e Preços</a>
              <a href="#suporte">Suporte</a>
              <a href="#blog">Blog</a>
            </div>
            
            <div className="footer-column">
              <h4>Empresa</h4>
              <a href="#sobre">Sobre Nós</a>
              <a href="#blog">Blog</a>
              <a href="#carreiras">Carreiras</a>
              <a href="#contato">Contato</a>
            </div>
            
            <div className="footer-column">
              <h4>Legal</h4>
              <a href="#privacidade">Política de Privacidade</a>
              <a href="#termos">Termos de Uso</a>
              <a href="#lgpd">Conformidade LGPD</a>
              <a href="#cookies">Política de Cookies</a>
            </div>
          </div>
        </div>
        
        {/* Footer Middle - Contact & Social */}
        <div className="footer-middle">
          <div className="footer-contact">
            <h4>Entre em Contato</h4>
            <div className="contact-info">
              <a href="mailto:contato@advocacia.ai" className="contact-item">
                <span className="contact-icon">✉️</span>
                <span>contato@advocacia.ai</span>
              </a>
              <a href="https://wa.me/5511999999999" className="contact-item" target="_blank" rel="noopener noreferrer">
                <span className="contact-icon">💬</span>
                <span>(11) 99999-9999</span>
              </a>
              <a href="tel:+5511999999999" className="contact-item">
                <span className="contact-icon">☎️</span>
                <span>(11) 99999-9999</span>
              </a>
            </div>
          </div>
          
          <div className="footer-social">
            <h4>Siga-nos</h4>
            <div className="social-links">
              <a href="https://facebook.com/advocaciaai" target="_blank" rel="noopener noreferrer" className="social-link" title="Facebook">
                <span>f</span>
              </a>
              <a href="https://instagram.com/advocaciaai" target="_blank" rel="noopener noreferrer" className="social-link" title="Instagram">
                <span>📷</span>
              </a>
              <a href="https://linkedin.com/company/advocaciaai" target="_blank" rel="noopener noreferrer" className="social-link" title="LinkedIn">
                <span>in</span>
              </a>
              <a href="https://youtube.com/@advocaciaai" target="_blank" rel="noopener noreferrer" className="social-link" title="YouTube">
                <span>▶️</span>
              </a>
            </div>
          </div>
        </div>
        
        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-left">
            <p>&copy; 2024 Advocacia.AI. Todos os direitos reservados.</p>
          </div>
          <div className="footer-bottom-right">
            <span className="footer-version">v1.0.0</span>
            <span className="footer-separator">•</span>
            <span className="footer-status">🟢 Operacional</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
