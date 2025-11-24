import { useParams } from 'wouter';
import { getArticleById, getRelatedArticles } from '@/lib/blog';
import BlogArticleCard from '@/components/BlogArticleCard';

export default function BlogArticle() {
  const params = useParams();
  const articleId = params.id as string;
  const article = getArticleById(articleId);
  const relatedArticles = article ? getRelatedArticles(articleId) : [];

  if (!article) {
    return (
      <div className="container">
        <div className="not-found">
          <h1>Artigo não encontrado</h1>
          <p>Desculpe, o artigo que você procura não existe.</p>
          <a href="/blog" className="btn btn-primary">Voltar ao Blog</a>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-article-page">
      {/* Article Header */}
      <div className="article-page-header">
        <div className="container">
          <div className="article-breadcrumb">
            <a href="/blog">Blog</a>
            <span>/</span>
            <a href={`/blog?category=${article.category}`}>{article.category}</a>
            <span>/</span>
            <span>{article.title}</span>
          </div>
          <h1 className="article-page-title">{article.title}</h1>
          <div className="article-page-meta">
            <span className="meta-item">👤 {article.author}</span>
            <span className="meta-item">📅 {new Date(article.date).toLocaleDateString('pt-BR')}</span>
            <span className="meta-item">⏱️ {article.readTime} min de leitura</span>
            <span className="meta-item">👁️ {article.views.toLocaleString()} visualizações</span>
          </div>
        </div>
      </div>

      {/* Article Image */}
      <div className="article-page-image">
        <img src={article.image} alt={article.title} />
      </div>

      <div className="container">
        <div className="article-page-content">
          {/* Main Content */}
          <div className="article-main">
            <div className="article-body">
              {article.content.split('\n\n').map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>

            {/* Article Tags */}
            <div className="article-tags-section">
              <h4>Tags:</h4>
              <div className="article-tags">
                {article.tags.map(tag => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
            </div>

            {/* Share Section */}
            <div className="article-share">
              <h4>Compartilhe este artigo:</h4>
              <div className="share-buttons">
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="share-btn facebook"
                  title="Compartilhar no Facebook"
                >
                  f
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?url=${window.location.href}&text=${article.title}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="share-btn twitter"
                  title="Compartilhar no Twitter"
                >
                  𝕏
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="share-btn linkedin"
                  title="Compartilhar no LinkedIn"
                >
                  in
                </a>
                <a
                  href={`https://wa.me/?text=${article.title} ${window.location.href}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="share-btn whatsapp"
                  title="Compartilhar no WhatsApp"
                >
                  💬
                </a>
              </div>
            </div>

            {/* Author Info */}
            <div className="author-info">
              <div className="author-avatar">👤</div>
              <div className="author-details">
                <h4>{article.author}</h4>
                <p>Advogado especializado em {article.category}</p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="article-sidebar">
            {/* CTA Box */}
            <div className="cta-box">
              <h3>Precisa de Ajuda?</h3>
              <p>Fale com um advogado especializado em {article.category}</p>
              <a href="/#formulario" className="btn btn-primary btn-block">
                Analisar Meu Caso
              </a>
            </div>

            {/* Related Articles */}
            {relatedArticles.length > 0 && (
              <div className="related-articles">
                <h3>Artigos Relacionados</h3>
                <ul className="related-list">
                  {relatedArticles.map(relArticle => (
                    <li key={relArticle.id}>
                      <a href={`/blog/${relArticle.id}`} className="related-link">
                        {relArticle.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </div>

      {/* More Articles Section */}
      {relatedArticles.length > 0 && (
        <section className="section section-related-articles">
          <div className="container">
            <h2>Leia Também</h2>
            <div className="related-articles-grid">
              {relatedArticles.map(relArticle => (
                <BlogArticleCard key={relArticle.id} article={relArticle} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
