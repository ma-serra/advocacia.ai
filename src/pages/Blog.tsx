import { useState, useMemo } from 'react';
import { blogArticles, getCategories, searchArticles } from '@/lib/blog';
import BlogArticleCard from '@/components/BlogArticleCard';

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'title'>('recent');

  const categories = getCategories();

  const filteredArticles = useMemo(() => {
    let articles = blogArticles;

    // Filter by search query
    if (searchQuery) {
      articles = searchArticles(searchQuery);
    }

    // Filter by category
    if (selectedCategory) {
      articles = articles.filter(article => article.category === selectedCategory);
    }

    // Sort articles
    if (sortBy === 'recent') {
      articles = [...articles].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (sortBy === 'popular') {
      articles = [...articles].sort((a, b) => b.views - a.views);
    } else if (sortBy === 'title') {
      articles = [...articles].sort((a, b) => a.title.localeCompare(b.title));
    }

    return articles;
  }, [searchQuery, selectedCategory, sortBy]);

  return (
    <div className="blog-page">
      {/* Blog Header */}
      <div className="blog-page-header">
        <div className="container">
          <h1>Blog de Direito</h1>
          <p>Artigos, notícias e dicas sobre suas áreas jurídicas</p>
        </div>
      </div>

      <div className="container">
        {/* Search and Filters */}
        <div className="blog-controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="Buscar artigos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>

          <div className="filters">
            <div className="filter-group">
              <label htmlFor="category">Categoria:</label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="filter-select"
              >
                <option value="">Todas as categorias</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="sort">Ordenar por:</label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'recent' | 'popular' | 'title')}
                className="filter-select"
              >
                <option value="recent">Mais Recentes</option>
                <option value="popular">Mais Populares</option>
                <option value="title">Título (A-Z)</option>
              </select>
            </div>
          </div>

          <div className="results-count">
            {filteredArticles.length} artigo{filteredArticles.length !== 1 ? 's' : ''} encontrado{filteredArticles.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Articles List */}
        <div className="blog-articles-list">
          {filteredArticles.length > 0 ? (
            filteredArticles.map(article => (
              <BlogArticleCard key={article.id} article={article} variant="list" />
            ))
          ) : (
            <div className="no-results">
              <p>Nenhum artigo encontrado. Tente refinar sua busca.</p>
            </div>
          )}
        </div>

        {/* Categories Sidebar */}
        <div className="blog-sidebar">
          <div className="sidebar-widget">
            <h3>Categorias Populares</h3>
            <ul className="category-list">
              {categories.map(category => {
                const count = blogArticles.filter(a => a.category === category).length;
                return (
                  <li key={category}>
                    <button
                      onClick={() => {
                        setSelectedCategory(category);
                        setSearchQuery('');
                      }}
                      className={`category-link ${selectedCategory === category ? 'active' : ''}`}
                    >
                      {category}
                      <span className="count">({count})</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="sidebar-widget">
            <h3>Artigos Populares</h3>
            <ul className="popular-articles">
              {blogArticles
                .sort((a, b) => b.views - a.views)
                .slice(0, 5)
                .map(article => (
                  <li key={article.id}>
                    <a href={`/blog/${article.id}`} className="popular-article-link">
                      {article.title}
                      <span className="views">👁️ {article.views.toLocaleString()}</span>
                    </a>
                  </li>
                ))}
            </ul>
          </div>

          <div className="sidebar-widget newsletter-widget">
            <h3>Newsletter</h3>
            <p>Receba notícias jurídicas no seu email</p>
            <form onSubmit={(e) => {
              e.preventDefault();
              alert('Inscrição realizada com sucesso!');
            }}>
              <input
                type="email"
                placeholder="Seu email"
                required
                className="newsletter-input"
              />
              <button type="submit" className="btn btn-primary btn-sm">
                Inscrever
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
