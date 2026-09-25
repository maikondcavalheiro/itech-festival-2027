export type BlogCategory = 
  | "Todas"
  | "Notícias"
  | "Música & Line-up"
  | "Camping & Estrutura"
  | "Arte & Cultura";

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  category: "Notícias" | "Música & Line-up" | "Camping & Estrutura" | "Arte & Cultura";
  categorySlug: "noticias" | "musica-lineup" | "camping-estrutura" | "arte-cultura";
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
  youtubeUrl?: string;
  content?: string;
  status?: "published" | "archived";
}

export const BLOG_CATEGORIES: { name: BlogCategory; slug: string; icon: string; description: string }[] = [
  { 
    name: "Todas", 
    slug: "todas", 
    icon: "✧", 
    description: "Todas as publicações do festival" 
  },
  { 
    name: "Notícias", 
    slug: "noticias", 
    icon: "📢", 
    description: "Comunicados oficiais, avisos e novidades da edição 2027" 
  },
  { 
    name: "Música & Line-up", 
    slug: "musica-lineup", 
    icon: "⚡", 
    description: "DJs, atrações, estilos musicais, pistas e frequências" 
  },
  { 
    name: "Camping & Estrutura", 
    slug: "camping-estrutura", 
    icon: "🏕️", 
    description: "Terra da Lua, mapa do camping, banheiros, alimentação e infraestrutura" 
  },
  { 
    name: "Arte & Cultura", 
    slug: "arte-cultura", 
    icon: "🎨", 
    description: "Cenografia, arte visionária, performances e intervenções culturais" 
  },
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "itech-2026-materializacao",
    slug: "itech-2026-a-materializacao-de-uma-experiencia-absoluta",
    title: "ITECH 2026: A Materialização de uma Experiência Absoluta",
    subtitle: "A ITECH não é apenas um festival; é um manifesto vivo, provando que a arte e a técnica, quando unidas com um propósito maior, são capazes de criar verdadeiras revoluções sociais.",
    excerpt: "A ITECH não é apenas um festival; é um manifesto vivo, provando que a arte e a técnica, quando unidas com um propósito maior, são capazes de criar verdadeiras revoluções sociais.",
    content: `Em um cenário onde grandes festivais apostam na saturação para impressionar, a iTech trilhou o caminho inverso. Elegendo como essência o rigor estético, a precisão cenográfica e uma relação de cumplicidade genuína com o seu público, o evento se consolidou não apenas como referência de entretenimento e música eletrônica alternativa, mas como uma potência de vanguarda cultural.

O Solo Sagrado de Guarapuava: Terra Peregrina de Evolução

Muito além de cifras, esse sucesso tem nome e chão: o Camping Terra da Lua, cenário perfeito para uma imersão profunda na floresta nativa de Guarapuava. Cercada de montanhas, vertentes de água pura e o frescor inconfundível do planalto paranaense, o espaço foi abraçado pela organização como um santuário de coexistência. Tornou-se um verdadeiro ponto de convivência onde a ancestralidade da mata e a tecnologia dialogaram em uníssono, com o público respeitando cada palmo de natureza e demonstrando um nível de maturidade e consciência ecológica raro de se ver em eventos de grande porte. A energia do vale reverbera a cada batida, tornando a comunhão entre o público e a música um ritual vivo.

Palco Autoral: Onde a Escultura Encontra a Engenharia

O encanto superior materializou um diálogo impecável entre técnicas ancestrais e novas linguagens. Toda a concepção cenográfica ostentou uma obra monumental de bioarquitetura esculpida à mão, garantindo densidade orgânica incomparável com seus entalhes complexos e iluminação em sintonia. Ao mesmo tempo, sua precisão visual foi conduzida pelo renomado Palco X, provando que o festival se recusa a seguir padrões e cria sua própria cartilha de design sensorial.

Com o som que esteve sob o comando do mestre das frequências, o lendário engenheiro de áudio Bob, que projetou um ecossistema sonoro através do sistema de ponta Lambda Labs. O resultado foi uma cobertura impecável, com frequências límpidas do sub-grave aos agudos mais cristalinos. A precisão e a potência da estrutura sonora não apenas surpreenderam os amantes de música eletrônica, como também criaram a base técnica perfeita para acomodar as narrativas dos maiores produtores da cena.

Alta Performance: Coesão Sonora Sem Concessões

A curadoria sonora desenhou uma jornada magistral, conectando vertentes rítmicas e orgânicas sem oscilar. Do psytrance progressivo de alta voltagem à pulsação densa e contínua do techno, cada set manteve uma narrativa precisa, com sequências sublimes do coletivo Nômade Sounds. Foi uma entrega de fidelidade sonora que permitiu a todos entrarem em comunhão de pulsação e estados ampliados de consciência através da música.

Vocais envolventes e compassos profundos ecoaram sob o dossel das araucárias. Artistas como Rica Amaral, Mandragora, Burn in Noise, Element, Harmonika e Becker compuseram a trilha sonora desta jornada inesquecível, transformando o vale num caleidoscópio de frequências que ecoarão para sempre na memória de cada participante.

A Nova Referência: A Comunidade Que Transforma a Cena

Mais importante do que qualquer estrutura física é a identidade dos presentes: um público vibrante, composto por apreciadores e apaixonados de música eletrônica e artes alternativas que compreendem o verdadeiro significado da palavra comunidade. A reverência mútua, a empatia genuína e a busca por autoconhecimento transformaram o solo em um verdadeiro santuário onde a segurança e o respeito imperaram em todos os cantos.

A atmosfera transcendental foi enriquecida por intervenções artísticas ao vivo, apresentações teatrais itinerantes do Grupo Vagamundo e performances visuais guiadas por videomapping que fundiam símbolos arcanos com arquitetura futurista. Uma experiência de três dias de duração que extrapolou a música para se tornar um catalisador de transformações existenciais.

Um Segundo de Silêncio e uma Vida de Celebração

O encerramento do festival nos premiou com o amanhecer inesquecível, sob a regência do mestre Rica Amaral e a energia de Bob no comando de som. Naquele instante em que o sol rasgou o nevoeiro e beijou as copas centenárias, o tempo parou. Uma catarse compartilhada e lágrimas de pura alegria uniram todos em um único coro de vibração positiva.

Para aqueles que viveram a edição 2026, a certeza é única: a iTech ultrapassou o conceito tradicional de evento para consagrar-se como um divisor de águas na cultura de festivais independentes do Brasil. O legado está construído e o convite ecoa para as futuras gerações: quem pisa nesta terra sai transformado.

A Gratidão de Quem Viveu o Momento

À organização, voluntários e a cada alma que uniu sua frequência à nossa: o festival se curvou em reverência à dedicação e ao espírito de fraternidade que conduziram cada momento. Cada detalhe, do cuidado impecável com a limpeza e estrutura ao respeito com os ecossistemas, refletiu uma operação que colocou o amor pela arte no centro de cada decisão.

Nos encontramos nos próximos capítulos, onde novos caminhos se abrirão e a mesma chama continuará a queimar em cada batimento dos nossos corações.

Viva a música viva, respeite a terra, celebre com a sua tribo.`,
    category: "Notícias",
    categorySlug: "noticias",
    readTime: "7 min de leitura",
    publishedAt: "2026-09-25",
    dateDisplay: "25 de Setembro de 2026",
    featured: true,
    author: {
      name: "Conselho Editorial iTech",
      role: "Curadoria Oficial",
      avatar: "/face.png",
    },
    tags: [
      "iTech 2026",
      "Terra da Lua",
      "Guarapuava",
      "Música Eletrônica",
      "Psytrance",
      "Manifesto",
      "Cultura Psicodélica",
      "Lambda Labs",
      "Arte Visionária"
    ],
    coverImage: "/blog/itech-festival-musica-eletronica-guarapuava-1790315489843.jpg",
    coverImageAlt: "Público vibrando e cenografia monumental psicodélica da ITECH",
  },
];

