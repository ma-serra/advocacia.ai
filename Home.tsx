import { useEffect, useState } from "react";
import FormularioEVA from "@/components/FormularioEVA";
import AtendimentoOnline from "@/components/AtendimentoOnline";
import MapaBrasil from "@/components/MapaBrasil";
import Footer from "@/components/Footer";
import BlogSection from "@/components/BlogSection";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Scroll header effect
    const handleScroll = () => {
      const header = document.querySelector('.header');
      if (header) {
        if (window.scrollY > 50) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToForm = () => {
    const formSection = document.getElementById('formulario');
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const playVideo = () => {
    alert('Vídeo demonstrativo em breve!');
  };

  return (
    <>
      {/* Header/Navigation */}
      <header className="header">
        <nav className="nav container">
          <div className="nav-logo">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <rect width="40" height="40" rx="8" fill="#1E40AF"/>
              <path d="M20 12L28 28H12L20 12Z" fill="white"/>
              <circle cx="20" cy="20" r="3" fill="#F59E0B"/>
            </svg>
            <span className="nav-brand">Advocacia<span className="text-accent">.AI</span></span>
          </div>
          
          <div className={`nav-menu ${mobileMenuOpen ? 'active' : ''}`}>
            <a href="#como-funciona" className="nav-link">Como Funciona</a>
            <a href="#areas" className="nav-link">Áreas do Direito</a>
            <a href="#advogados" className="nav-link">Para Advogados</a>
            <a href="#contato" className="nav-link">Contato</a>
          </div>
          
          <div className="nav-cta">
            <button className="btn btn-primary" onClick={scrollToForm}>Começar Agora</button>
          </div>
          
          <button 
            className="nav-toggle" 
            id="navToggle" 
            aria-label="Menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="badge">🚀 Inteligência Artificial Jurídica</span>
            </div>
            
            <h1 className="hero-title">
              Encontre o <span className="text-gradient">Advogado Perfeito</span><br/>
              para o Seu Caso em <span className="text-accent">3 Minutos</span>
            </h1>
            
            <p className="hero-subtitle">
              Nossa IA analisa sua situação jurídica e conecta você instantaneamente com advogados especializados e verificados na sua região
            </p>
            
            <div className="hero-stats">
              <div className="stat">
                <div className="stat-number">10.247+</div>
                <div className="stat-label">Casos Resolvidos</div>
              </div>
              <div className="stat">
                <div className="stat-number">98%</div>
                <div className="stat-label">Satisfação</div>
              </div>
              <div className="stat">
                <div className="stat-number">30min</div>
                <div className="stat-label">Tempo Médio de Resposta</div>
              </div>
            </div>
            
            <div className="hero-cta">
              <button className="btn btn-primary btn-lg" onClick={scrollToForm}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 5V15M5 10H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Analisar Meu Caso Grátis
              </button>
              <button className="btn btn-secondary btn-lg" onClick={playVideo}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M6 5L14 10L6 15V5Z" fill="currentColor"/>
                </svg>
                Ver Como Funciona
              </button>
            </div>
            
            <div className="hero-trust">
              <div className="trust-badges">
                <div className="trust-badge">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L2 7V12C2 17 6 21 12 22C18 21 22 17 22 12V7L12 2Z" stroke="#10B981" strokeWidth="2"/>
                    <path d="M9 12L11 14L15 10" stroke="#10B981" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <span>100% Seguro LGPD</span>
                </div>
                <div className="trust-badge">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L15 8L22 9L17 14L18 21L12 18L6 21L7 14L2 9L9 8L12 2Z" fill="#F59E0B"/>
                  </svg>
                  <span>4.9/5 Avaliação</span>
                </div>
                <div className="trust-badge">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#1E40AF" strokeWidth="2"/>
                    <path d="M12 6V12L16 14" stroke="#1E40AF" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <span>Disponível 24/7</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="hero-image">
            <div className="hero-card floating">
              <div className="card-header">
                <div className="avatar">
                  <div className="avatar-img">👩‍⚖️</div>
                  <div className="avatar-status"></div>
                </div>
                <div className="avatar-info">
                  <div className="avatar-name">EVA - Assistente IA</div>
                  <div className="avatar-status-text">Online agora</div>
                </div>
              </div>
              <div className="card-body">
                <div className="message message-received">
                  <p>Olá! Sou a EVA, sua assistente jurídica. Em que posso ajudar?</p>
                </div>
                <div className="message message-sent">
                  <p>Fui demitido sem receber as verbas rescisórias...</p>
                </div>
                <div className="message message-received typing">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
              <div className="card-suggestion">
                <div className="suggestion-badge">✨ Analisando seu caso...</div>
                <div className="suggestion-text">Identificamos: <strong>Direito do Trabalho</strong></div>
                <div className="suggestion-progress">
                  <div className="progress-bar" style={{width: '85%'}}></div>
                </div>
                <div className="suggestion-confidence">Confiança: 98%</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="scroll-indicator">
          <div className="mouse">
            <div className="wheel"></div>
          </div>
        </div>
      </section>

      {/* Como Funciona Section */}
      <section id="como-funciona" className="section section-how">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Simples e Rápido</span>
            <h2 className="section-title">Como Funciona</h2>
            <p className="section-subtitle">3 passos simples para conectar você ao advogado ideal</p>
          </div>
          
          <div className="steps">
            <div className="step">
              <div className="step-number">01</div>
              <div className="step-icon">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <rect width="48" height="48" rx="12" fill="#EEF2FF"/>
                  <path d="M24 16V32M16 24H32" stroke="#1E40AF" strokeWidth="3" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 className="step-title">Conte Seu Caso</h3>
              <p className="step-description">Descreva sua situação em texto ou por voz. Nossa IA compreende português natural.</p>
            </div>
            
            <div className="step">
              <div className="step-number">02</div>
              <div className="step-icon">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <rect width="48" height="48" rx="12" fill="#FEF3C7"/>
                  <circle cx="24" cy="24" r="8" stroke="#F59E0B" strokeWidth="3"/>
                  <path d="M24 20V24L27 27" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 className="step-title">IA Analisa</h3>
              <p className="step-description">Em segundos, identificamos a área do direito, urgência e documentos necessários.</p>
            </div>
            
            <div className="step">
              <div className="step-number">03</div>
              <div className="step-icon">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <rect width="48" height="48" rx="12" fill="#D1FAE5"/>
                  <path d="M20 24L23 27L28 21" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="24" cy="24" r="10" stroke="#10B981" strokeWidth="2"/>
                </svg>
              </div>
              <h3 className="step-title">Conecte-se ao Advogado</h3>
              <p className="step-description">Receba até 3 propostas de advogados especializados. Escolha o melhor para você.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Áreas do Direito Section */}
      <section id="areas" className="section section-areas">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Expertise Completa</span>
            <h2 className="section-title">Áreas do Direito</h2>
            <p className="section-subtitle">Advogados especializados em todas as áreas jurídicas</p>
          </div>
          
          <div className="areas-grid">
            <div className="area-card">
              <div className="area-icon">👔</div>
              <h3 className="area-title">Direito do Trabalho</h3>
              <p className="area-description">Demissões, verbas rescisórias, assédio moral</p>
            </div>
            
            <div className="area-card">
              <div className="area-icon">👨‍👩‍👧</div>
              <h3 className="area-title">Direito de Família</h3>
              <p className="area-description">Divórcio, pensão alimentícia, guarda</p>
            </div>
            
            <div className="area-card">
              <div className="area-icon">🏛️</div>
              <h3 className="area-title">Direito Condominial</h3>
              <p className="area-description">Execuções judiciais, taxas, despesas de condomínio</p>
            </div>
            
            <div className="area-card">
              <div className="area-icon">⚖️</div>
              <h3 className="area-title">Direito Criminal</h3>
              <p className="area-description">Defesas, audiência de custódia, plantão criminal</p>
            </div>
            
            <div className="area-card">
              <div className="area-icon">💳</div>
              <h3 className="area-title">Fraudes Bancárias</h3>
              <p className="area-description">Fraudes bancárias, pirâmides financeiras</p>
            </div>
            
            <div className="area-card">
              <div className="area-icon">🛡️</div>
              <h3 className="area-title">Defesas Judiciais</h3>
              <p className="area-description">Bloqueios e desbloqueios de bens</p>
            </div>
            
            <div className="area-card">
              <div className="area-icon">🏥</div>
              <h3 className="area-title">Direito Médico</h3>
              <p className="area-description">Erro médico, medicamentos, plano de saúde</p>
            </div>
            
            <div className="area-card">
              <div className="area-icon">🚗</div>
              <h3 className="area-title">Acidentes de Trânsito</h3>
              <p className="area-description">Acidentes com vítimas ou sem vítimas</p>
            </div>
            
            <div className="area-card">
              <div className="area-icon">🛒</div>
              <h3 className="area-title">Direito do Consumidor</h3>
              <p className="area-description">Produtos defeituosos, cobranças indevidas</p>
            </div>
            
            <div className="area-card">
              <div className="area-icon">🏠</div>
              <h3 className="area-title">Direito Imobiliário</h3>
              <p className="area-description">Contratos, despejo, usucapião</p>
            </div>
            
            <div className="area-card">
              <div className="area-icon">💼</div>
              <h3 className="area-title">Direito Civil</h3>
              <p className="area-description">Contratos, indenizações, responsabilidade</p>
            </div>
            
            <div className="area-card">
              <div className="area-icon">⏱️</div>
              <h3 className="area-title">Advogado em 10min</h3>
              <p className="area-description">Atendimento urgente, plantão 24/7</p>
            </div>
          </div>
        </div>
      </section>

      {/* Seção de Atendimento Online */}
      <AtendimentoOnline />
      
      {/* Mapa do Brasil */}
      <MapaBrasil />
      
      {/* Seção de Blog */}
      <BlogSection />
      
      {/* Formulário EVA Section */}
      <FormularioEVA />

      {/* Footer */}
      <Footer />

      {/* WhatsApp Float Button */}
      <a 
        href="https://wa.me/5511999999999?text=Olá!%20Vim%20do%20site" 
        className="whatsapp-float"
        target="_blank"
        rel="noopener noreferrer"
      >
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <path d="M16 0C7.16479 0 0 7.16479 0 16C0 18.9336 0.800781 21.6914 2.19922 24.0742L0.0976562 31.9023L8.19141 29.8516C10.4961 31.1172 13.1602 31.8438 16 31.8438C24.8352 31.8438 32 24.6789 32 15.8438C32 7.00854 24.8352 0 16 0Z" fill="white"/>
          <path d="M25.3203 22.4688C24.9609 23.5547 23.2031 24.4805 22.0859 24.6797C21.3203 24.8086 20.3359 24.9023 16.6406 23.3203C11.6406 21.2109 8.44141 16.0352 8.19141 15.6992C7.94141 15.3633 6.15625 13.0273 6.15625 10.6133C6.15625 8.19922 7.39844 7.01562 7.83594 6.57812C8.19531 6.21875 8.78906 6.05469 9.35156 6.05469C9.51562 6.05469 9.66406 6.0625 9.79688 6.06641C10.2344 6.07812 10.4531 6.09766 10.7344 6.77344C11.0938 7.64062 11.9766 10.0547 12.082 10.2773C12.1914 10.5 12.3008 10.8008 12.1445 11.1367C12.0039 11.4727 11.8789 11.6133 11.6289 11.8984C11.3789 12.1836 11.1406 12.3984 10.8906 12.6992C10.6602 12.9609 10.4023 13.2422 10.6914 13.7188C10.9805 14.1953 11.9688 15.7266 13.4453 16.9766C15.3359 18.5781 16.8906 19.0898 17.4141 19.3125C17.7734 19.4609 18.1875 19.4297 18.4922 19.1016C18.8711 18.6836 19.2734 18.0234 19.6797 17.3672C19.9766 16.8906 20.3555 16.8242 20.793 16.9727C21.2305 17.1211 23.6445 18.3125 24.1211 18.5508C24.5977 18.7891 24.9141 18.9023 25.0234 19.1016C25.1328 19.3008 25.1328 20.168 24.7734 21.1523C24.4141 22.1367 23.0391 23.1992 22.1719 23.3242C21.8359 23.3789 21.4609 23.4141 21.0625 23.4141C20.5 23.4141 19.8672 23.3203 19.1719 23.1094C17.9688 22.7383 16.4297 22.1367 14.8438 21.2109C11.6406 19.3672 9.44141 16.3516 9.19141 16.0156C8.94141 15.6797 7.15625 13.3438 7.15625 10.9297C7.15625 8.51562 8.39844 7.33203 8.83594 6.89453C9.19531 6.53516 9.78906 6.37109 10.3516 6.37109C10.5156 6.37109 10.6641 6.37891 10.7969 6.38281C11.2344 6.39453 11.4531 6.41406 11.7344 7.08984C12.0938 7.95703 12.9766 10.3711 13.082 10.5938C13.1914 10.8164 13.3008 11.1172 13.1445 11.4531C13.0039 11.7891 12.8789 11.9297 12.6289 12.2148C12.3789 12.5 12.1406 12.7148 11.8906 13.0156C11.6602 13.2773 11.4023 13.5586 11.6914 14.0352C11.9805 14.5117 12.9688 16.043 14.4453 17.293C16.3359 18.8945 17.8906 19.4062 18.4141 19.6289C18.7734 19.7773 19.1875 19.7461 19.4922 19.418C19.8711 19 20.2734 18.3398 20.6797 17.6836C20.9766 17.207 21.3555 17.1406 21.793 17.2891C22.2305 17.4375 24.6445 18.6289 25.1211 18.8672C25.5977 19.1055 25.9141 19.2188 26.0234 19.418C26.1328 19.6172 26.1328 20.4844 25.7734 21.4688C25.4141 22.4531 24.0391 23.5156 23.1719 23.6406C22.8359 23.6953 22.4609 23.7305 22.0625 23.7305C21.5 23.7305 20.8672 23.6367 20.1719 23.4258L25.3203 22.4688Z" fill="#25D366"/>
        </svg>
      </a>
    </>
  );
}
