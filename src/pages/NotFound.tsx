export default function NotFound() {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      padding: '20px',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '4rem', margin: '0' }}>404</h1>
      <h2>Página não encontrada</h2>
      <p>A página que você está procurando não existe.</p>
      <a href="/" style={{ marginTop: '20px', textDecoration: 'underline' }}>
        Voltar para a página inicial
      </a>
    </div>
  );
}
