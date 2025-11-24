import { BlogArticle } from '@/lib/blog';

interface BlogArticleCardProps {
  article: BlogArticle;
  variant?: 'grid' | 'list';
}

export default function BlogArticleCard({ article, variant = 'grid' }: BlogArticleCardProps) {
  if (variant === 'list') {
    return (
      <article className="blog-article-list">
        <div className="article-list-image">
          <img src={article.image} alt={article.title} />
          <span className="article-category-badge">{article.category}</span>
        </div>
        <div className="article-list-content">
          <h3 className="article-list-title">{article.title}</h3>
          <p className="article-list-excerpt">{article.excerpt}</p>
          <div className="article-list-meta">
            <span className="article-author">👤 {article.author}</span>
            <span className="article-date">📅 {new Date(article.date).toLocaleDateString('pt-BR')}</span>
            <span className="article-read-time">⏱️ {article.readTime} min</span>
            <span className="article-views">👁️ {article.views.toLocaleString()}</span>
          </div>
          <div className="article-tags">
            {article.tags.map(tag => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
          <a href={`/blog/${article.id}`} className="btn btn-secondary btn-sm">
            Ler Artigo →
          </a>
        </div>
      </article>
    );
  }

  return (
    <article className="blog-article-card">
      <div className="article-image">
        <img src={article.image} alt={article.title} />
        {article.featured && <span className="featured-badge">⭐ Destaque</span>}
        <span className="category-badge">{article.category}</span>
      </div>
      <div className="article-content">
        <h3 className="article-title">{article.title}</h3>
        <p className="article-excerpt">{article.excerpt}</p>
        <div className="article-meta">
          <span className="meta-item">
            <span className="meta-icon">👤</span>
            <span className="meta-text">{article.author}</span>
          </span>
          <span className="meta-item">
            <span className="meta-icon">📅</span>
            <span className="meta-text">{new Date(article.date).toLocaleDateString('pt-BR')}</span>
          </span>
          <span className="meta-item">
            <span className="meta-icon">⏱️</span>
            <span className="meta-text">{article.readTime} min</span>
          </span>
        </div>
        <div className="article-tags">
          {article.tags.slice(0, 2).map(tag => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
        <a href={`/blog/${article.id}`} className="btn btn-primary btn-sm">
          Ler Mais →
        </a>
      </div>
    </article>
  );
}
