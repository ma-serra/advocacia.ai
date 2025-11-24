import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useFormSteps } from '@/hooks/useFormSteps';
import {
  validateCPF,
  validateCNPJ,
  validateEmail,
  validatePhone,
  maskCPF,
  maskCNPJ,
  maskPhone,
  maskCEP,
} from '@/lib/validations';
import { submitLead, fetchCEP, getCurrentLocation } from '@/lib/api';
import { fetchCNPJ } from '@/lib/cnpj';

export default function FormularioEVA() {
  const { currentStep, formData, nextStep, prevStep, updateFormData, setCurrentStep } = useFormSteps();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [showEvaPopup, setShowEvaPopup] = useState(false);

  useEffect(() => {
    // Mostrar popup EVA após 3 segundos
    const timer = setTimeout(() => {
      setShowEvaPopup(true);
    }, 3000);

    // Inicializar reconhecimento de voz
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.lang = 'pt-BR';
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;

      recognitionInstance.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        updateFormData('descricao', formData.descricao + ' ' + transcript);
        toast.success('Áudio transcrito com sucesso!');
        setIsRecording(false);
      };

      recognitionInstance.onerror = (event: any) => {
        console.error('Erro no reconhecimento de voz:', event.error);
        toast.error('Erro ao reconhecer voz. Tente novamente.');
        setIsRecording(false);
      };

      recognitionInstance.onend = () => {
        setIsRecording(false);
      };

      setRecognition(recognitionInstance);
    }

    return () => clearTimeout(timer);
  }, []);

  const handleVoiceRecording = () => {
    if (!recognition) {
      toast.error('Reconhecimento de voz não suportado neste navegador');
      return;
    }

    if (isRecording) {
      recognition.stop();
      setIsRecording(false);
    } else {
      recognition.start();
      setIsRecording(true);
      toast.info('Gravando... Fale agora!');
    }
  };

  const handleCEPSearch = async () => {
    const cep = formData.cep.replace(/\D/g, '');
    
    if (cep.length !== 8) {
      toast.error('CEP inválido');
      return;
    }

    try {
      const data = await fetchCEP(cep);
      updateFormData('endereco', data.logradouro);
      updateFormData('bairro', data.bairro);
      updateFormData('cidade', data.localidade);
      updateFormData('estado', data.uf);
      toast.success('CEP encontrado!');
    } catch (error) {
      toast.error('CEP não encontrado');
    }
  };

  const handleCNPJSearch = async () => {
    const cnpj = formData.cpf_cnpj.replace(/\D/g, '');
    
    if (cnpj.length !== 14) {
      toast.error('CNPJ inválido');
      return;
    }

    try {
      toast.info('Buscando dados da empresa...');
      const data = await fetchCNPJ(cnpj);
      
      updateFormData('nome_razao', data.razao_social);
      updateFormData('email', data.email);
      updateFormData('telefone', maskPhone(data.telefone));
      updateFormData('cep', maskCEP(data.cep));
      updateFormData('endereco', data.logradouro);
      updateFormData('numero', data.numero);
      updateFormData('complemento', data.complemento);
      updateFormData('bairro', data.bairro);
      updateFormData('cidade', data.municipio);
      updateFormData('estado', data.uf);
      
      toast.success('Dados da empresa carregados!');
    } catch (error) {
      toast.error('Erro ao buscar dados do CNPJ');
    }
  };

  const handleGeolocation = async () => {
    try {
      const location = await getCurrentLocation();
      updateFormData('geolat', location.latitude);
      updateFormData('geolon', location.longitude);
      toast.success('Localização obtida com sucesso!');
    } catch (error) {
      toast.error('Erro ao obter localização');
    }
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return true; // Tipo de pessoa sempre tem valor padrão
      case 2:
        if (!formData.nome_razao.trim()) {
          toast.error('Nome/Razão Social é obrigatório');
          return false;
        }
        
        const cpfCnpj = formData.cpf_cnpj.replace(/\D/g, '');
        if (formData.tipo_pessoa === 'pf') {
          if (!validateCPF(cpfCnpj)) {
            toast.error('CPF inválido');
            return false;
          }
        } else {
          if (!validateCNPJ(cpfCnpj)) {
            toast.error('CNPJ inválido');
            return false;
          }
          
          if (!formData.responsavel_nome.trim()) {
            toast.error('Nome do responsável é obrigatório para Pessoa Jurídica');
            return false;
          }
          
          const responsavelCPF = formData.responsavel_cpf.replace(/\D/g, '');
          if (!validateCPF(responsavelCPF)) {
            toast.error('CPF do responsável inválido');
            return false;
          }
        }
        
        if (!validatePhone(formData.telefone)) {
          toast.error('Telefone inválido');
          return false;
        }
        
        if (formData.telefone_alternativo) {
          if (!validatePhone(formData.telefone_alternativo)) {
            toast.error('Telefone alternativo inválido');
            return false;
          }
          
          const tel1 = formData.telefone.replace(/\D/g, '');
          const tel2 = formData.telefone_alternativo.replace(/\D/g, '');
          if (tel1 === tel2) {
            toast.error('O telefone alternativo deve ser diferente do telefone principal');
            return false;
          }
        }
        
        if (!validateEmail(formData.email)) {
          toast.error('E-mail inválido');
          return false;
        }
        
        return true;
      case 3:
        if (!formData.descricao.trim() || formData.descricao.length < 20) {
          toast.error('Descreva seu caso com pelo menos 20 caracteres');
          return false;
        }
        return true;
      case 4:
        if (!formData.cep.trim()) {
          toast.error('CEP é obrigatório');
          return false;
        }
        if (!formData.endereco.trim()) {
          toast.error('Endereço é obrigatório');
          return false;
        }
        if (!formData.numero.trim()) {
          toast.error('Número é obrigatório');
          return false;
        }
        if (!formData.bairro.trim()) {
          toast.error('Bairro é obrigatório');
          return false;
        }
        if (!formData.cidade.trim()) {
          toast.error('Cidade é obrigatória');
          return false;
        }
        if (!formData.estado.trim()) {
          toast.error('Estado é obrigatório');
          return false;
        }
        if (!formData.canal_contato) {
          toast.error('Canal de contato preferido é obrigatório');
          return false;
        }
        if (!formData.horario_contato.trim()) {
          toast.error('Horário de contato é obrigatório');
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      nextStep();
      
      // Track analytics
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'form_step', {
          step: currentStep + 1,
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(4)) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await submitLead({
        ...formData,
        origem: 'web-landing',
      } as any);
      
      toast.success('Caso enviado com sucesso!');
      
      // Track conversion
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'conversion', {
          send_to: 'AW-XXXXXXXX/XXXXXX',
          value: 1.0,
          currency: 'BRL',
        });
        
        (window as any).gtag('event', 'lead_submit', {
          area: response.ia.area,
          confidence: response.ia.confidence,
        });
      }
      
      if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', 'Lead');
      }
      
      // Redirecionar para página de sucesso ou mostrar resultado
      alert(`Análise concluída!\n\nÁrea identificada: ${response.ia.area}\nConfiança: ${(response.ia.confidence * 100).toFixed(0)}%\nUrgência: ${response.ia.urgency}\n\nEm breve você receberá propostas de advogados especializados no canal escolhido: ${formData.canal_contato}!`);
      
    } catch (error) {
      console.error('Erro ao enviar lead:', error);
      toast.error('Erro ao enviar seu caso. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    let maskedValue = value;
    
    // Aplicar máscaras
    if (field === 'cpf_cnpj') {
      maskedValue = formData.tipo_pessoa === 'pf' ? maskCPF(value) : maskCNPJ(value);
      
      // Auto-buscar CNPJ quando completo
      if (formData.tipo_pessoa === 'pj' && maskedValue.replace(/\D/g, '').length === 14) {
        setTimeout(() => handleCNPJSearch(), 500);
      }
    } else if (field === 'responsavel_cpf') {
      maskedValue = maskCPF(value);
    } else if (field === 'telefone' || field === 'telefone_alternativo') {
      maskedValue = maskPhone(value);
    } else if (field === 'cep') {
      maskedValue = maskCEP(value);
      // Auto-buscar CEP quando completo
      if (maskedValue.replace(/\D/g, '').length === 8) {
        setTimeout(() => handleCEPSearch(), 500);
      }
    }
    
    updateFormData(field as any, maskedValue);
  };

  return (
    <>
      <section id="formulario" className="section section-form">
        <div className="container">
          <div className="form-wrapper">
            <div className="form-header">
              <h2 className="form-title">Analisar Meu Caso Grátis</h2>
              <p className="form-subtitle">Preencha as informações abaixo e nossa IA analisará seu caso em segundos</p>
              
              <div className="form-progress">
                <div className="progress-steps">
                  {[1, 2, 3, 4].map((step) => (
                    <div
                      key={step}
                      className={`progress-step ${currentStep >= step ? 'active' : ''} ${currentStep > step ? 'completed' : ''}`}
                    >
                      <div className="step-circle">{step}</div>
                      <div className="step-label">
                        {step === 1 ? 'Tipo' : step === 2 ? 'Dados' : step === 3 ? 'Caso' : 'Local'}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="progress-bar-container">
                  <div className="progress-bar-fill" style={{ width: `${(currentStep / 4) * 100}%` }}></div>
                </div>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="eva-form">
              {/* Step 1: Tipo de Pessoa */}
              {currentStep === 1 && (
                <div className="form-step active" data-step="1">
                  <h3 className="step-title-form">Você é pessoa física ou jurídica?</h3>
                  <div className="radio-group">
                    <label className="radio-card">
                      <input
                        type="radio"
                        name="tipo_pessoa"
                        value="pf"
                        checked={formData.tipo_pessoa === 'pf'}
                        onChange={(e) => updateFormData('tipo_pessoa', e.target.value as 'pf' | 'pj')}
                      />
                      <div className="radio-content">
                        <div className="radio-icon">👤</div>
                        <div className="radio-label">Pessoa Física</div>
                        <div className="radio-description">CPF</div>
                      </div>
                    </label>
                    <label className="radio-card">
                      <input
                        type="radio"
                        name="tipo_pessoa"
                        value="pj"
                        checked={formData.tipo_pessoa === 'pj'}
                        onChange={(e) => updateFormData('tipo_pessoa', e.target.value as 'pf' | 'pj')}
                      />
                      <div className="radio-content">
                        <div className="radio-icon">🏢</div>
                        <div className="radio-label">Pessoa Jurídica</div>
                        <div className="radio-description">CNPJ</div>
                      </div>
                    </label>
                  </div>
                </div>
              )}

              {/* Step 2: Dados Pessoais */}
              {currentStep === 2 && (
                <div className="form-step active" data-step="2">
                  <h3 className="step-title-form">Seus dados de contato</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="cpf_cnpj">{formData.tipo_pessoa === 'pf' ? 'CPF' : 'CNPJ'} *</label>
                      <input
                        type="text"
                        id="cpf_cnpj"
                        value={formData.cpf_cnpj}
                        onChange={(e) => handleInputChange('cpf_cnpj', e.target.value)}
                        placeholder={formData.tipo_pessoa === 'pf' ? '000.000.000-00' : '00.000.000/0000-00'}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="nome_razao">{formData.tipo_pessoa === 'pf' ? 'Nome Completo' : 'Razão Social'} *</label>
                      <input
                        type="text"
                        id="nome_razao"
                        value={formData.nome_razao}
                        onChange={(e) => updateFormData('nome_razao', e.target.value)}
                        required
                      />
                    </div>
                    
                    {formData.tipo_pessoa === 'pj' && (
                      <>
                        <div className="form-group">
                          <label htmlFor="responsavel_nome">Nome do Responsável *</label>
                          <input
                            type="text"
                            id="responsavel_nome"
                            value={formData.responsavel_nome}
                            onChange={(e) => updateFormData('responsavel_nome', e.target.value)}
                            placeholder="Quem responde pela empresa"
                            required
                          />
                        </div>
                        
                        <div className="form-group">
                          <label htmlFor="responsavel_cpf">CPF do Responsável *</label>
                          <input
                            type="text"
                            id="responsavel_cpf"
                            value={formData.responsavel_cpf}
                            onChange={(e) => handleInputChange('responsavel_cpf', e.target.value)}
                            placeholder="000.000.000-00"
                            required
                          />
                        </div>
                      </>
                    )}
                    
                    <div className="form-group">
                      <label htmlFor="telefone">Telefone / WhatsApp Principal *</label>
                      <input
                        type="tel"
                        id="telefone"
                        value={formData.telefone}
                        onChange={(e) => handleInputChange('telefone', e.target.value)}
                        placeholder="(11) 99999-9999"
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="telefone_alternativo">Telefone Alternativo (opcional)</label>
                      <input
                        type="tel"
                        id="telefone_alternativo"
                        value={formData.telefone_alternativo}
                        onChange={(e) => handleInputChange('telefone_alternativo', e.target.value)}
                        placeholder="(11) 98888-8888 - Amigo, esposo(a), filho(a)"
                      />
                      <small>Para facilitar a comunicação (deve ser diferente do principal)</small>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="email">E-mail *</label>
                      <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={(e) => updateFormData('email', e.target.value)}
                        placeholder="seu@email.com"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Descrição do Caso */}
              {currentStep === 3 && (
                <div className="form-step active" data-step="3">
                  <h3 className="step-title-form">Conte-nos sobre seu caso</h3>
                  <div className="form-group">
                    <label htmlFor="descricao">Descrição do Caso *</label>
                    <textarea
                      id="descricao"
                      value={formData.descricao}
                      onChange={(e) => updateFormData('descricao', e.target.value)}
                      rows={6}
                      placeholder="Descreva sua situação jurídica com o máximo de detalhes possível..."
                      required
                    ></textarea>
                    <div className="voice-input">
                      <button
                        type="button"
                        onClick={handleVoiceRecording}
                        className={`btn btn-secondary ${isRecording ? 'recording' : ''}`}
                      >
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path
                            d="M10 1C8.34315 1 7 2.34315 7 4V10C7 11.6569 8.34315 13 10 13C11.6569 13 13 11.6569 13 10V4C13 2.34315 11.6569 1 10 1Z"
                            stroke="currentColor"
                            strokeWidth="2"
                          />
                          <path
                            d="M16 10C16 13.3137 13.3137 16 10 16M10 16C6.68629 16 4 13.3137 4 10M10 16V19M10 19H7M10 19H13"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                        {isRecording ? 'Gravando...' : 'Gravar Áudio'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Localização e Preferências */}
              {currentStep === 4 && (
                <div className="form-step active" data-step="4">
                  <h3 className="step-title-form">Endereço e preferências de contato</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="cep">CEP *</label>
                      <input
                        type="text"
                        id="cep"
                        value={formData.cep}
                        onChange={(e) => handleInputChange('cep', e.target.value)}
                        placeholder="00000-000"
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="endereco">Endereço *</label>
                      <input
                        type="text"
                        id="endereco"
                        value={formData.endereco}
                        onChange={(e) => updateFormData('endereco', e.target.value)}
                        placeholder="Rua, Avenida..."
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="numero">Número *</label>
                      <input
                        type="text"
                        id="numero"
                        value={formData.numero}
                        onChange={(e) => updateFormData('numero', e.target.value)}
                        placeholder="123"
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="complemento">Complemento</label>
                      <input
                        type="text"
                        id="complemento"
                        value={formData.complemento}
                        onChange={(e) => updateFormData('complemento', e.target.value)}
                        placeholder="Apto, Bloco..."
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="bairro">Bairro *</label>
                      <input
                        type="text"
                        id="bairro"
                        value={formData.bairro}
                        onChange={(e) => updateFormData('bairro', e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="cidade">Cidade *</label>
                      <input
                        type="text"
                        id="cidade"
                        value={formData.cidade}
                        onChange={(e) => updateFormData('cidade', e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="estado">Estado *</label>
                      <select
                        id="estado"
                        value={formData.estado}
                        onChange={(e) => updateFormData('estado', e.target.value)}
                        required
                      >
                        <option value="">Selecione...</option>
                        <option value="AC">Acre</option>
                        <option value="AL">Alagoas</option>
                        <option value="AP">Amapá</option>
                        <option value="AM">Amazonas</option>
                        <option value="BA">Bahia</option>
                        <option value="CE">Ceará</option>
                        <option value="DF">Distrito Federal</option>
                        <option value="ES">Espírito Santo</option>
                        <option value="GO">Goiás</option>
                        <option value="MA">Maranhão</option>
                        <option value="MT">Mato Grosso</option>
                        <option value="MS">Mato Grosso do Sul</option>
                        <option value="MG">Minas Gerais</option>
                        <option value="PA">Pará</option>
                        <option value="PB">Paraíba</option>
                        <option value="PR">Paraná</option>
                        <option value="PE">Pernambuco</option>
                        <option value="PI">Piauí</option>
                        <option value="RJ">Rio de Janeiro</option>
                        <option value="RN">Rio Grande do Norte</option>
                        <option value="RS">Rio Grande do Sul</option>
                        <option value="RO">Rondônia</option>
                        <option value="RR">Roraima</option>
                        <option value="SC">Santa Catarina</option>
                        <option value="SP">São Paulo</option>
                        <option value="SE">Sergipe</option>
                        <option value="TO">Tocantins</option>
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <button type="button" onClick={handleGeolocation} className="btn btn-secondary btn-block">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path
                            d="M10 2C7.23858 2 5 4.23858 5 7C5 11 10 18 10 18C10 18 15 11 15 7C15 4.23858 12.7614 2 10 2Z"
                            stroke="currentColor"
                            strokeWidth="2"
                          />
                          <circle cx="10" cy="7" r="2" stroke="currentColor" strokeWidth="2" />
                        </svg>
                        Usar Minha Localização
                      </button>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="canal_contato">Canal de Contato Preferido *</label>
                      <select
                        id="canal_contato"
                        value={formData.canal_contato}
                        onChange={(e) => updateFormData('canal_contato', e.target.value as any)}
                        required
                      >
                        <option value="whatsapp">WhatsApp</option>
                        <option value="telefone">Telefone</option>
                        <option value="email">E-mail</option>
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="horario_contato">Horário de Preferência *</label>
                      <select
                        id="horario_contato"
                        value={formData.horario_contato}
                        onChange={(e) => updateFormData('horario_contato', e.target.value)}
                        required
                      >
                        <option value="">Selecione...</option>
                        <option value="manha">Manhã (8h - 12h)</option>
                        <option value="tarde">Tarde (12h - 18h)</option>
                        <option value="noite">Noite (18h - 22h)</option>
                        <option value="qualquer">Qualquer horário</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Form Actions */}
              <div className="form-actions">
                {currentStep > 1 && (
                  <button type="button" onClick={prevStep} className="btn btn-secondary">
                    Voltar
                  </button>
                )}
                {currentStep < 4 && (
                  <button type="button" onClick={handleNext} className="btn btn-primary">
                    Próximo
                  </button>
                )}
                {currentStep === 4 && (
                  <button type="submit" className="btn btn-success" disabled={isSubmitting}>
                    {isSubmitting ? 'Enviando...' : 'Analisar Meu Caso'}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* EVA Popup */}
      {showEvaPopup && (
        <div className="eva-popup">
          <div className="eva-popup-content">
            <button className="eva-popup-close" onClick={() => setShowEvaPopup(false)}>×</button>
            <div className="eva-popup-avatar">🤖</div>
            <h3>Olá! Sou a EVA</h3>
            <p>Sua assistente jurídica com Inteligência Artificial. Posso te ajudar a preencher o formulário!</p>
            <div className="eva-popup-actions">
              <button className="btn btn-primary btn-sm" onClick={() => {
                setShowEvaPopup(false);
                const formSection = document.getElementById('formulario');
                if (formSection) formSection.scrollIntoView({ behavior: 'smooth' });
              }}>
                Começar Agora
              </button>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowEvaPopup(false)}>
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
