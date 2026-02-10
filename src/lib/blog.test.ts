import { describe, it, expect } from 'vitest';
import {
  blogArticles,
  getArticlesByCategory,
  getFeaturedArticles,
  getArticleById,
  searchArticles,
  getCategories,
  getRelatedArticles,
} from './blog';

describe('Blog Functions', () => {
  it('deve retornar todos os artigos', () => {
    expect(blogArticles.length).toBeGreaterThan(0);
  });

  it('deve retornar artigos por categoria', () => {
    const articles = getArticlesByCategory('Direito Condominial');
    expect(articles.length).toBeGreaterThan(0);
    expect(articles.every(a => a.category === 'Direito Condominial')).toBe(true);
  });

  it('deve retornar artigos em destaque', () => {
    const featured = getFeaturedArticles();
    expect(featured.length).toBeGreaterThan(0);
    expect(featured.every(a => a.featured)).toBe(true);
  });

  it('deve retornar artigo por ID', () => {
    const article = getArticleById('direito-condominial-1');
    expect(article).toBeDefined();
    expect(article?.id).toBe('direito-condominial-1');
  });

  it('deve retornar undefined para ID inválido', () => {
    const article = getArticleById('artigo-inexistente');
    expect(article).toBeUndefined();
  });

  it('deve buscar artigos por título', () => {
    const results = searchArticles('Direitos');
    expect(results.length).toBeGreaterThan(0);
    expect(results.some(a => a.title.includes('Direitos'))).toBe(true);
  });

  it('deve buscar artigos por tag', () => {
    const results = searchArticles('condomínio');
    expect(results.length).toBeGreaterThan(0);
  });

  it('deve retornar lista vazia para busca sem resultados', () => {
    const results = searchArticles('xyz123abc');
    expect(results.length).toBe(0);
  });

  it('deve retornar todas as categorias', () => {
    const categories = getCategories();
    expect(categories.length).toBeGreaterThan(0);
    expect(categories.includes('Direito Condominial')).toBe(true);
  });

  it('deve retornar artigos relacionados', () => {
    const related = getRelatedArticles('direito-condominial-1', 3);
    expect(related.length).toBeLessThanOrEqual(3);
    expect(related.every(a => a.category === 'Direito Condominial')).toBe(true);
    expect(related.every(a => a.id !== 'direito-condominial-1')).toBe(true);
  });

  it('deve retornar array vazio para ID inválido em artigos relacionados', () => {
    const related = getRelatedArticles('artigo-inexistente');
    expect(related.length).toBe(0);
  });

  it('deve ter propriedades obrigatórias em cada artigo', () => {
    blogArticles.forEach(article => {
      expect(article.id).toBeDefined();
      expect(article.title).toBeDefined();
      expect(article.excerpt).toBeDefined();
      expect(article.content).toBeDefined();
      expect(article.category).toBeDefined();
      expect(article.author).toBeDefined();
      expect(article.date).toBeDefined();
      expect(article.image).toBeDefined();
      expect(article.readTime).toBeGreaterThan(0);
      expect(article.tags).toBeDefined();
      expect(Array.isArray(article.tags)).toBe(true);
      expect(article.featured).toBeDefined();
      expect(article.views).toBeGreaterThanOrEqual(0);
    });
  });

  it('deve ter data válida em cada artigo', () => {
    blogArticles.forEach(article => {
      const date = new Date(article.date);
      expect(date.getTime()).toBeLessThanOrEqual(Date.now());
    });
  });
});
