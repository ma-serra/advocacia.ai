import { describe, it, expect } from 'vitest';
import {
  validateCPF,
  validateCNPJ,
  validateEmail,
  validatePhone,
  maskCPF,
  maskCNPJ,
  maskPhone,
  maskCEP,
} from './validations';

describe('Validações', () => {
  describe('validateCPF', () => {
    it('deve validar CPF válido', () => {
      expect(validateCPF('123.456.789-09')).toBe(true);
      expect(validateCPF('12345678909')).toBe(true);
    });

    it('deve rejeitar CPF inválido', () => {
      expect(validateCPF('123.456.789-00')).toBe(false);
      expect(validateCPF('111.111.111-11')).toBe(false);
      expect(validateCPF('12345')).toBe(false);
    });
  });

  describe('validateCNPJ', () => {
    it('deve validar CNPJ válido', () => {
      expect(validateCNPJ('11.222.333/0001-81')).toBe(true);
      expect(validateCNPJ('11222333000181')).toBe(true);
    });

    it('deve rejeitar CNPJ inválido', () => {
      expect(validateCNPJ('11.222.333/0001-00')).toBe(false);
      expect(validateCNPJ('11.111.111/1111-11')).toBe(false);
      expect(validateCNPJ('123456')).toBe(false);
    });
  });

  describe('validateEmail', () => {
    it('deve validar email válido', () => {
      expect(validateEmail('teste@example.com')).toBe(true);
      expect(validateEmail('usuario.nome@dominio.com.br')).toBe(true);
    });

    it('deve rejeitar email inválido', () => {
      expect(validateEmail('teste@')).toBe(false);
      expect(validateEmail('teste')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
    });
  });

  describe('validatePhone', () => {
    it('deve validar telefone válido', () => {
      expect(validatePhone('(11) 99999-9999')).toBe(true);
      expect(validatePhone('11999999999')).toBe(true);
      expect(validatePhone('1133334444')).toBe(true);
    });

    it('deve rejeitar telefone inválido', () => {
      expect(validatePhone('123')).toBe(false);
      expect(validatePhone('123456789012')).toBe(false);
    });
  });

  describe('Máscaras', () => {
    it('deve aplicar máscara de CPF', () => {
      expect(maskCPF('12345678909')).toBe('123.456.789-09');
    });

    it('deve aplicar máscara de CNPJ', () => {
      expect(maskCNPJ('11222333000181')).toBe('11.222.333/0001-81');
    });

    it('deve aplicar máscara de telefone', () => {
      expect(maskPhone('11999999999')).toBe('(11) 99999-9999');
    });

    it('deve aplicar máscara de CEP', () => {
      expect(maskCEP('01310100')).toBe('01310-100');
    });
  });
});
