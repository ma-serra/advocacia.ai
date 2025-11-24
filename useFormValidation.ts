// frontend/src/hooks/useFormValidation.ts
// Hook para validação de formulários em tempo real

import { useState, useCallback } from 'react';

export interface ValidationError {
  [key: string]: string;
}

export interface ValidationRules {
  [key: string]: ((value: any) => string | null)[];
}

export function useFormValidation(rules: ValidationRules) {
  const [errors, setErrors] = useState<ValidationError>({});

  const validateField = useCallback((name: string, value: any) => {
    const fieldRules = rules[name];
    if (!fieldRules) return null;

    for (const rule of fieldRules) {
      const error = rule(value);
      if (error) return error;
    }
    return null;
  }, [rules]);

  const validateForm = useCallback((formData: Record<string, any>) => {
    const newErrors: ValidationError = {};

    Object.keys(rules).forEach((fieldName) => {
      const error = validateField(fieldName, formData[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [rules, validateField]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const error = validateField(name, value);

    setErrors((prev) => {
      const newErrors = { ...prev };
      if (error) {
        newErrors[name] = error;
      } else {
        delete newErrors[name];
      }
      return newErrors;
    });
  }, [validateField]);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  return {
    errors,
    validateField,
    validateForm,
    handleChange,
    clearErrors,
    hasErrors: Object.keys(errors).length > 0
  };
}

// Validadores pré-definidos
export const validators = {
  required: (message = 'Campo obrigatório') => (value: any) =>
    !value || (typeof value === 'string' && !value.trim()) ? message : null,

  email: (message = 'Email inválido') => (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return !emailRegex.test(value) ? message : null;
  },

  minLength: (length: number, message?: string) => (value: string) =>
    value && value.length < length
      ? message || `Mínimo ${length} caracteres`
      : null,

  maxLength: (length: number, message?: string) => (value: string) =>
    value && value.length > length
      ? message || `Máximo ${length} caracteres`
      : null,

  cpf: (message = 'CPF inválido') => (value: string) => {
    if (!value) return null;
    const cpf = value.replace(/\D/g, '');
    if (cpf.length !== 11) return message;
    
    // Validar CPF
    let sum = 0;
    let remainder;
    
    if (cpf === '00000000000') return message;
    
    for (let i = 1; i <= 9; i++) {
      sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(9, 10))) return message;
    
    sum = 0;
    for (let i = 1; i <= 10; i++) {
      sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(10, 11))) return message;
    
    return null;
  },

  cnpj: (message = 'CNPJ inválido') => (value: string) => {
    if (!value) return null;
    const cnpj = value.replace(/\D/g, '');
    if (cnpj.length !== 14) return message;
    
    if (/^(\d)\1{13}$/.test(cnpj)) return message;
    
    let size = cnpj.length - 2;
    let numbers = cnpj.substring(0, size);
    let digits = cnpj.substring(size);
    let sum = 0;
    let pos = size - 7;
    
    for (let i = size; i >= 1; i--) {
      sum += parseInt(numbers.charAt(size - i)) * pos--;
      if (pos < 2) pos = 9;
    }
    
    let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== parseInt(digits.charAt(0))) return message;
    
    size = size + 1;
    numbers = cnpj.substring(0, size);
    sum = 0;
    pos = size - 7;
    
    for (let i = size; i >= 1; i--) {
      sum += parseInt(numbers.charAt(size - i)) * pos--;
      if (pos < 2) pos = 9;
    }
    
    result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== parseInt(digits.charAt(1))) return message;
    
    return null;
  },

  phone: (message = 'Telefone inválido') => (value: string) => {
    if (!value) return null;
    const phone = value.replace(/\D/g, '');
    return phone.length < 10 || phone.length > 11 ? message : null;
  },

  url: (message = 'URL inválida') => (value: string) => {
    if (!value) return null;
    try {
      new URL(value);
      return null;
    } catch {
      return message;
    }
  },

  match: (fieldName: string, message?: string) => (value: string, formData?: Record<string, any>) =>
    value !== formData?.[fieldName]
      ? message || `Não corresponde com ${fieldName}`
      : null,

  custom: (fn: (value: any) => boolean, message = 'Inválido') => (value: any) =>
    !fn(value) ? message : null
};
