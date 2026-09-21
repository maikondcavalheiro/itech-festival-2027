export type BlogCategory = 
  | "Todas"
  | "Crônicas & Rituais"
  | "A Faísca Sonora"
  | "Raízes & Terra da Lua"
  | "Visão & Psicodelia";

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  category: "Crônicas & Rituais" | "A Faísca Sonora" | "Raízes & Terra da Lua" | "Visão & Psicodelia";
  categorySlug: "cronicas-rituais" | "faisca-sonora" | "raizes-terra-da-lua" | "visao-psicodelia";
  readTime: string;
  publishedAt: string;
  dateDisplay: string;
  featured?: boolean;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  tags: string[];
  coverImage: string;
  coverImageAlt: string;
}

export const BLOG_CATEGORIES: { name: BlogCategory; slug: string; icon: string; description: string }[] = [
  { 
    name: "Todas", 
    slug: "todas", 
    icon: "✧", 
    description: "Todas as crônicas e frequências registradas" 
  },
  { 
    name: "Crônicas & Rituais", 
    slug: "cronicas-rituais", 
    icon: "🔥", 
    description: "O manifesto da tribo, fogueiras xamânicas e a história viva" 
  },
  { 
    name: "A Faísca Sonora", 
    slug: "faisca-sonora", 
    icon: "⚡", 
    description: "Sintetizadores, frequências transcendentais e alquimia sonora" 
  },
  { 
    name: "Raízes & Terra da Lua", 
    slug: "raizes-terra-da-lua", 
    icon: "🌿", 
    description: "Conexão telúrica, camping sagrado e respeito à terra" 
  },
  { 
    name: "Visão & Psicodelia", 
    slug: "visao-psicodelia", 
    icon: "👁️", 
    description: "Arte visionária, geometria sagrada e expansão da mente" 
  },
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "fogo-primordial-2027",
    slug: "o-despertar-do-fogo-primordial",
    title: "O Despertar do Fogo Primordial: Por que 2027 marca o retorno às nossas origens",
    subtitle: "Antes dos lasers e sintetizadores, havia a fogueira sob as estrelas. O manifesto que define a próxima era da iTech.",
    excerpt: "Em um mundo saturado pelo hiper-digital sem alma, a iTech 2027 evoca o tambor ancestral. Uma investigação sobre a necessidade humana de dança coletiva em torno da chama sagrada e como a tecnologia pode ser um portal, não uma gaiola.",
    category: "Crônicas & Rituais",
    categorySlug: "cronicas-rituais",
    readTime: "6 min de leitura",
    publishedAt: "2026-09-15",
    dateDisplay: "15 de Setembro de 2026",
    featured: true,
    author: {
      name: "Guardião da Chama",
      role: "Conselho Ancestral iTech",
      avatar: "/face.png",
    },
    tags: ["Manifesto", "Ancestralidade", "iTech 2027", "Rituais"],
    coverImage: "/blog/fogo-primordial.jpg",
    coverImageAlt: "Fogueira ancestral e feixes de laser cruzando o céu noturno em um festival místico",
  },
  {
    id: "terra-da-lua-santuario",
    slug: "terra-da-lua-o-santuario-onde-a-gravidade-muda",
    title: "Terra da Lua: O santuário onde a gravidade se transforma em dança",
    subtitle: "Entre as montanhas de Guarapuava, um solo ancestral preparado para receber milhares de almas em harmonia.",
    excerpt: "Conheça os segredos geográficos e energéticos do Camping Terra da Lua. Água pura de nascente, florestas nativas e a acústica natural que amplifica cada batimento cardíaco da nossa pista.",
    category: "Raízes & Terra da Lua",
    categorySlug: "raizes-terra-da-lua",
    readTime: "4 min de leitura",
    publishedAt: "2026-09-08",
    dateDisplay: "08 de Setembro de 2026",
    author: {
      name: "Raissa Lua",
      role: "Guardiã Ambiental da Terra da Lua",
      avatar: "/face-colorida.png",
    },
    tags: ["Camping Terra da Lua", "Ecologia", "Guarapuava", "Natureza"],
    coverImage: "/blog/terra-da-lua.jpg",
    coverImageAlt: "Vista aérea mágica do vale do Camping Terra da Lua sob a luz da lua e névoa bioluminescente",
  },
  {
    id: "sintetizadores-e-tambores",
    slug: "sintetizadores-e-tambores-a-ciencia-do-transe",
    title: "Sintetizadores e Tambores: A ciência rítmica que reprograma a consciência",
    subtitle: "Como ondas senoidais puras e polirritmias primitivas ativam os mesmos estados meditativos dos rituais milenares.",
    excerpt: "Exploramos a física acústica do Psytrance e do Techno Orgânico. Do bpm calibrado para sincronizar ondas cerebrais Theta às baixas frequências que ressoam na caixa torácica como trovões primordiais.",
    category: "A Faísca Sonora",
    categorySlug: "faisca-sonora",
    readTime: "7 min de leitura",
    publishedAt: "2026-08-28",
    dateDisplay: "28 de Agosto de 2026",
    author: {
      name: "Alquimista Sonoro",
      role: "Curador Musical iTech",
      avatar: "/face.png",
    },
    tags: ["Música Eletrônica", "Frequências", "Neuroacústica", "Line-up"],
    coverImage: "/blog/sintetizadores-tambores.jpg",
    coverImageAlt: "Módulos de sintetizadores analógicos envoltos em raízes de árvores e chamas mágicas",
  },
  {
    id: "arte-visionaria-geometria",
    slug: "arte-visionaria-e-geometria-sagrada-decodificando-os-portais",
    title: "Arte Visionária e Geometria Sagrada: Decodificando os portais visuais da iTech",
    subtitle: "Cenografias biomecânicas inspiradas em fósseis, fractais de plantas e circuitos de silício.",
    excerpt: "Cada estrutura cenográfica do festival é um glifo projetado com proporções áureas. Descubra os artistas visuais que estão esculpindo o palco principal e as instalações interativas de 2027.",
    category: "Visão & Psicodelia",
    categorySlug: "visao-psicodelia",
    readTime: "5 min de leitura",
    publishedAt: "2026-08-14",
    dateDisplay: "14 de Agosto de 2026",
    author: {
      name: "Ícaro Fractal",
      role: "Diretor de Arte Visionária",
      avatar: "/face-colorida.png",
    },
    tags: ["Arte Visionária", "Cenografia", "Geometria Sagrada", "Instalações"],
    coverImage: "/blog/arte-visionaria.jpg",
    coverImageAlt: "Portal monumental de geometria sagrada com runas fluorescentes e iluminação psicodélica",
  },
  {
    id: "guia-do-peregrino-da-mata",
    slug: "guia-do-peregrino-como-se-preparar-para-3-dias-de-imersao",
    title: "Guia do Peregrino da Mata: Como se preparar para 3 dias de imersão total",
    subtitle: "Do kit de sobrevivência mística à hidratação consciente: tudo o que você precisa saber antes de pisar na pista.",
    excerpt: "Montar acampamento com sabedoria, escolher calçados que respeitem a terra, gerenciar a energia do corpo durante as transições de dia e noite e cuidar da nossa tribo coletiva.",
    category: "Raízes & Terra da Lua",
    categorySlug: "raizes-terra-da-lua",
    readTime: "8 min de leitura",
    publishedAt: "2026-07-30",
    dateDisplay: "30 de Julho de 2026",
    author: {
      name: "Tribo Guardiã",
      role: "Comunidade iTech",
      avatar: "/face.png",
    },
    tags: ["Guia Prático", "Dicas de Camping", "Sobrevivência", "Comunidade"],
    coverImage: "/blog/guia-peregrino.jpg",
    coverImageAlt: "Acampamento iluminado por lanternas orgânicas e céu estrelado sob a mata atlântica",
  },
  {
    id: "iluminacao-biomecanica",
    slug: "a-centelha-tecnologica-iluminacao-biomecanica-e-o-futuro",
    title: "A Centelha Tecnológica: Iluminação biomecânica e o futuro das artes imersivas",
    subtitle: "Como os lasers inteligentes reagem ao movimento coletivo do público através de sensores de campo.",
    excerpt: "Pela primeira vez na história da iTech, a iluminação do festival respirará em uníssono com a pulsação do público. Entenda como a engenharia óptica de ponta cria a ilusão de matéria viva no ar.",
    category: "A Faísca Sonora",
    categorySlug: "faisca-sonora",
    readTime: "5 min de leitura",
    publishedAt: "2026-07-12",
    dateDisplay: "12 de Julho de 2026",
    author: {
      name: "Eng. Solaris",
      role: "Desenvolvedor de Luz & Laser",
      avatar: "/face-colorida.png",
    },
    tags: ["Tecnologia de Luz", "Lasers", "Inovação", "Palco"],
    coverImage: "/blog/iluminacao-biomecanica.jpg",
    coverImageAlt: "Feixes de luz laser e projeções holográficas orgânicas se fundindo com copas de árvores ancestrais",
  },
];
