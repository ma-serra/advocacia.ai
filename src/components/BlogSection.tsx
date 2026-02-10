import { getFeaturedArticles } from '@/lib/blog';
import BlogArticleCard from './BlogArticleCard';

export default function BlogSection() {
  const featuredArticles = getFeaturedArticles();

  return (
    <section className="section section-blog">
      <div className="container">
        <div className="blog-header">
          <h2 className="blog-title">Blog & Notícias Jurídicas</h2>
          <p className="blog-subtitle">
            Mantenha-se informado sobre seus direitos com artigos educativos e notícias do mundo jurídico
          </p>
        </div>

        <div className="blog-articles-grid">
          {featuredArticles.map(article => (
            <BlogArticleCard key={article.id} article={article} />
          ))}
        </div>

        <div className="blog-footer">
          <a href="/blog" className="btn btn-primary btn-lg">
            Ver Todos os Artigos →
          </a>
          <div className="blog-newsletter">
            <h3>Receba Notícias Jurídicas no Seu Email</h3>
            <p>Inscreva-se na nossa newsletter para receber artigos e dicas sobre direito</p>
            <form className="newsletter-form" onSubmit={(e) => {
              e.preventDefault();
              // Handle newsletter subscription
              alert('Inscrição realizada com sucesso!');
            }}>
              <input
                type="email"
                placeholder="Seu melhor email"
                required
                className="newsletter-input"
              />
              <button type="submit" className="btn btn-primary">
                Inscrever
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
