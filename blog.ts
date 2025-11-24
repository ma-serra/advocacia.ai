export interface BlogArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  date: string;
  image: string;
  readTime: number;
  tags: string[];
  featured: boolean;
  views: number;
}

export const blogArticles: BlogArticle[] = [
  {
    id: 'direito-condominial-1',
    title: 'Direitos e Deveres do Condômino: Guia Completo',
    excerpt: 'Entenda quais são seus direitos e responsabilidades como condômino e como proteger seus interesses.',
    content: `Os direitos e deveres do condômino são regulados pela Lei 4.591/64 e pela Convenção do Condomínio. 
    Como condômino, você tem direito a usar livremente as áreas privativas do imóvel, participar das assembleias 
    condominiais e votar nas decisões. Também é seu direito receber informações sobre as despesas e contas do condomínio.
    
    Por outro lado, você tem o dever de pagar as despesas condominiais em dia, respeitar as regras da convenção, 
    não causar danos às áreas comuns e não prejudicar o sossego dos vizinhos. O não cumprimento desses deveres 
    pode resultar em multas, ações judiciais e até mesmo perda do direito de voto.`,
    category: 'Direito Condominial',
    author: 'Dr. João Silva',
    date: '2024-11-20',
    image: '/blog-condominial-1.jpg',
    readTime: 5,
    tags: ['condomínio', 'direitos', 'deveres', 'assembleia'],
    featured: true,
    views: 1250,
  },
  {
    id: 'direito-criminal-1',
    title: 'Audiência de Custódia: O Que Você Precisa Saber',
    excerpt: 'Saiba como funciona a audiência de custódia e quais são seus direitos durante esse processo.',
    content: `A audiência de custódia é uma oportunidade para o preso apresentar sua versão dos fatos e solicitar 
    sua libertação ou imposição de medidas cautelares menos gravosas. Regulada pela Lei 12.403/11, essa audiência 
    deve ocorrer no prazo máximo de 24 horas após a prisão.
    
    Durante a audiência, o juiz avalia se há necessidade de manter a prisão ou se é possível conceder liberdade 
    provisória com ou sem condições. É fundamental estar acompanhado de um advogado experiente que possa apresentar 
    argumentos sólidos em sua defesa.`,
    category: 'Direito Criminal',
    author: 'Dra. Maria Santos',
    date: '2024-11-18',
    image: '/blog-criminal-1.jpg',
    readTime: 6,
    tags: ['criminal', 'custódia', 'direitos', 'defesa'],
    featured: true,
    views: 2100,
  },
  {
    id: 'fraudes-bancarias-1',
    title: 'Como Se Proteger de Fraudes Bancárias e Golpes Online',
    excerpt: 'Dicas práticas para proteger suas contas bancárias e evitar ser vítima de fraudes digitais.',
    content: `As fraudes bancárias e golpes online crescem a cada ano. Para se proteger, é importante seguir 
    algumas práticas básicas: nunca compartilhe sua senha com ninguém, não clique em links suspeitos, 
    use autenticação de dois fatores e mantenha seu antivírus atualizado.
    
    Se você foi vítima de fraude, é importante denunciar imediatamente ao banco e à polícia. Você pode 
    entrar com uma ação civil para recuperar o valor roubado e também denunciar criminalmente os responsáveis.`,
    category: 'Fraudes Bancárias',
    author: 'Dr. Carlos Oliveira',
    date: '2024-11-15',
    image: '/blog-fraude-1.jpg',
    readTime: 7,
    tags: ['fraude', 'segurança', 'banco', 'proteção'],
    featured: false,
    views: 1850,
  },
  {
    id: 'direito-medico-1',
    title: 'Erro Médico: Seus Direitos e Como Agir',
    excerpt: 'Entenda o que constitui erro médico e quais são seus direitos como paciente prejudicado.',
    content: `Erro médico é a conduta profissional inadequada que causa dano ao paciente. Pode ocorrer por 
    negligência, imprudência ou imperícia. Se você sofreu um erro médico, você tem direito a indenização 
    pelos danos morais e materiais causados.
    
    Para comprovar o erro médico, é necessário fazer uma perícia técnica que demonstre a culpa do profissional. 
    É importante documentar tudo e procurar um advogado especializado em direito médico para orientação.`,
    category: 'Direito Médico',
    author: 'Dra. Ana Costa',
    date: '2024-11-12',
    image: '/blog-medico-1.jpg',
    readTime: 8,
    tags: ['médico', 'erro', 'indenização', 'saúde'],
    featured: true,
    views: 2350,
  },
  {
    id: 'transito-1',
    title: 'Acidentes de Trânsito: Como Proceder Corretamente',
    excerpt: 'Guia prático sobre o que fazer após um acidente de trânsito e como proteger seus direitos.',
    content: `Após um acidente de trânsito, é importante seguir os procedimentos corretos para proteger seus direitos. 
    Primeiro, verifique se há feridos e chame a ambulância se necessário. Depois, acione a polícia para fazer 
    o boletim de ocorrência e tire fotos do local e dos danos.
    
    Anote os dados dos envolvidos e testemunhas, não assine nada sem ler, e procure um advogado para orientação. 
    Você pode ter direito a indenização pelos danos materiais e morais causados pelo acidente.`,
    category: 'Acidentes de Trânsito',
    author: 'Dr. Roberto Lima',
    date: '2024-11-10',
    image: '/blog-transito-1.jpg',
    readTime: 5,
    tags: ['trânsito', 'acidente', 'indenização', 'procedimento'],
    featured: false,
    views: 1600,
  },
  {
    id: 'direito-trabalho-1',
    title: 'Rescisão Contratual: Seus Direitos na Demissão',
    excerpt: 'Saiba quais são seus direitos quando é demitido e o que o empregador é obrigado a pagar.',
    content: `Quando você é demitido sem justa causa, o empregador é obrigado a pagar várias verbas rescisórias: 
    saldo de salário, 13º proporcional, férias vencidas e proporcionais, aviso prévio e indenização de 40% do FGTS.
    
    Se o empregador não pagar corretamente, você pode entrar com uma ação trabalhista para reclamar os valores. 
    É importante guardar todos os documentos e procurar um advogado trabalhista para orientação.`,
    category: 'Direito do Trabalho',
    author: 'Dra. Patricia Gomes',
    date: '2024-11-08',
    image: '/blog-trabalho-1.jpg',
    readTime: 6,
    tags: ['trabalho', 'demissão', 'direitos', 'rescisão'],
    featured: true,
    views: 2800,
  },
  {
    id: 'direito-familia-1',
    title: 'Guarda de Filhos: Tipos e Procedimentos Legais',
    excerpt: 'Entenda os diferentes tipos de guarda e como funciona o processo de definição da guarda.',
    content: `Existem três tipos de guarda: unilateral (um dos pais), compartilhada (ambos os pais) e alternada 
    (cada pai fica um período). A guarda compartilhada é a mais comum atualmente, pois permite que ambos os pais 
    participem das decisões sobre o filho.
    
    O processo de guarda pode ser feito de forma consensual (acordo entre os pais) ou litigioso (decisão do juiz). 
    É importante ter um advogado especializado em direito de família para proteger seus interesses e os do seu filho.`,
    category: 'Direito de Família',
    author: 'Dr. Fernando Alves',
    date: '2024-11-05',
    image: '/blog-familia-1.jpg',
    readTime: 7,
    tags: ['família', 'guarda', 'filhos', 'procedimento'],
    featured: false,
    views: 1950,
  },
  {
    id: 'defesa-judicial-1',
    title: 'Bloqueio de Bens: Como Desbloquear Seus Ativos',
    excerpt: 'Conheça os procedimentos para desbloquear bens e recuperar seus direitos patrimoniais.',
    content: `O bloqueio de bens ocorre quando há uma decisão judicial contra você ou quando há uma dívida. 
    Para desbloquear seus bens, você precisa comprovar que pagou a dívida ou que a decisão foi revertida.
    
    É importante agir rápido, pois o bloqueio pode prejudicar suas atividades comerciais e pessoais. 
    Procure um advogado especializado para ajudá-lo a resolver essa situação.`,
    category: 'Defesas Judiciais',
    author: 'Dr. Lucas Martins',
    date: '2024-11-03',
    image: '/blog-defesa-1.jpg',
    readTime: 5,
    tags: ['bloqueio', 'bens', 'desbloquear', 'direitos'],
    featured: false,
    views: 1400,
  },
  {
    id: 'direito-imobiliario-1',
    title: 'Contrato de Aluguel: Direitos e Deveres do Inquilino',
    excerpt: 'Guia completo sobre os direitos e deveres do inquilino e como se proteger em contratos de aluguel.',
    content: `O inquilino tem direitos importantes garantidos pela Lei do Inquilinato: direito à moradia digna, 
    direito de não sofrer abusos do proprietário e direito a receber o imóvel em bom estado de conservação.
    
    O inquilino também tem deveres: pagar o aluguel em dia, manter o imóvel em bom estado, não fazer reformas 
    sem autorização e avisar com antecedência sobre a saída. Conhecer seus direitos é fundamental para evitar abusos.`,
    category: 'Direito Imobiliário',
    author: 'Dra. Beatriz Rocha',
    date: '2024-10-30',
    image: '/blog-imobiliario-1.jpg',
    readTime: 6,
    tags: ['imóvel', 'aluguel', 'inquilino', 'contrato'],
    featured: true,
    views: 2200,
  },
];

export function getArticlesByCategory(category: string): BlogArticle[] {
  return blogArticles.filter(article => article.category === category);
}

export function getFeaturedArticles(): BlogArticle[] {
  return blogArticles.filter(article => article.featured).slice(0, 3);
}

export function getArticleById(id: string): BlogArticle | undefined {
  return blogArticles.find(article => article.id === id);
}

export function searchArticles(query: string): BlogArticle[] {
  const lowerQuery = query.toLowerCase();
  return blogArticles.filter(article =>
    article.title.toLowerCase().includes(lowerQuery) ||
    article.excerpt.toLowerCase().includes(lowerQuery) ||
    article.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}

export function getCategories(): string[] {
  return Array.from(new Set(blogArticles.map(article => article.category)));
}

export function getRelatedArticles(articleId: string, limit: number = 3): BlogArticle[] {
  const article = getArticleById(articleId);
  if (!article) return [];
  
  return blogArticles
    .filter(a => a.id !== articleId && a.category === article.category)
    .slice(0, limit);
}
