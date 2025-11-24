import { useState } from 'react';

interface FormData {
  tipo_pessoa: 'pf' | 'pj';
  nome_razao: string;
  cpf_cnpj: string;
  responsavel_nome: string; // Para PJ
  responsavel_cpf: string; // Para PJ
  telefone: string;
  telefone_alternativo: string;
  email: string;
  canal_contato: 'whatsapp' | 'telefone' | 'email';
  horario_contato: string;
  descricao: string;
  cep: string;
  endereco: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  geolat: number | null;
  geolon: number | null;
}

export function useFormSteps() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    tipo_pessoa: 'pf',
    nome_razao: '',
    cpf_cnpj: '',
    responsavel_nome: '',
    responsavel_cpf: '',
    telefone: '',
    telefone_alternativo: '',
    email: '',
    canal_contato: 'whatsapp',
    horario_contato: '',
    descricao: '',
    cep: '',
    endereco: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    geolat: null,
    geolon: null,
  });

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return {
    currentStep,
    formData,
    nextStep,
    prevStep,
    updateFormData,
    setCurrentStep,
  };
}
