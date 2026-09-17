"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";

interface ProductItem {
  id: string;
  title: string;
  category: "Vestuário" | "Headwear" | "Acessórios" | "Editorial";
  badge: string;
  description: string;
  imageSrc: string;
}

const STORE_ITEMS: ProductItem[] = [
  {
    id: "img-0218",
    title: "Camiseta O Caminho da Vida",
    category: "Vestuário",
    badge: "Best Seller 2026",
    description:
      "Estampa dorsal monumental em serigrafia de alta resolução com os 7 chakras, o amor ancestral e geometria sagrada.",
    imageSrc: "/store/IMG_0218-2.jpg.jpeg",
  },
  {
    id: "img-0127",
    title: "Boné iTech Edition 2026",
    category: "Headwear",
    badge: "Bordado em Relevo",
    description:
      "Aba curva estruturada em tom caramelo e bordado frontal em 3D azul claro luminescente. Patch cósmico da Terra da Lua aplicado na lateral.",
    imageSrc: "/store/IMG_0127-2.jpg.jpeg",
  },
  {
    id: "img-0220",
    title: "Ensaio Passarela da Mata",
    category: "Editorial",
    badge: "Camping Terra da Lua",
    description:
      "Peças que ganham vida entre a natureza, a arte e os caminhos da vida.",
    imageSrc: "/store/IMG_0220-2.jpg.jpeg",
  },
  {
    id: "img-0328",
    title: "Camiseta Kurenai",
    category: "Vestuário",
    badge: "Edição Especial",
    description:
      "Tecido nobre em tom bordô com o brasão sagrado ao centro e sequência de runas ancestrais estampadas na lateral inferior.",
    imageSrc: "/store/IMG_0328.jpg.jpeg",
  },
  {
    id: "img-0291",
    title: "Bag iTech Cyan Moss",
    category: "Acessórios",
    badge: "À Prova de Pista",
    description:
      "Gym sack confeccionada em nylon leve e resistente, com compartimento com zíper frontal para itens essenciais e logo magenta.",
    imageSrc: "/store/IMG_0291.JPG.jpeg",
  },
  {
    id: "img-0299",
    title: "Copos Oficiais Colecionáveis",
    category: "Acessórios",
    badge: "Eco Festival",
    description:
      "Copos plásticos colecionáveis com artes míticas das edições passadas.",
    imageSrc: "/store/IMG_0299.jpg.jpeg",
  },
  {
    id: "img-0341",
    title: "Camiseta Oficial iTech 2026 - O Caminho da Vida",
    category: "Vestuário",
    badge: "Arte Autoral",
    description:
      "Ilustração psicodélica completa retratando a conexão entre mente, natureza e frequências sonoras transcendentais.",
    imageSrc: "/store/IMG_0341.jpg.jpeg",
  },
  {
    id: "img-0410",
    title: "Ensaio Coleção 2026",
    category: "Editorial",
    badge: "Lookbook 2026",
    description:
      "Uma peça que transforma símbolos ancestrais em arte para vestir. Detalhes que revelam sua identidade em cada traço.",
    imageSrc: "/store/IMG_0410 2.jpg.jpeg",
  },
  {
    id: "img-7941",
    title: "Boné iTech - Trucker Dark",
    category: "Headwear",
    badge: "Trucker Oficial",
    description:
      "Corpo reto possui com tela traseira ultra respirável, vivo em contraste e logo iTech bordado em degradê turquesa.",
    imageSrc: "/store/IMG_7941-2.jpg.jpeg",
  },
  {
    id: "img-8011",
    title: "Conjunto Bags Coleção 2026",
    category: "Acessórios",
    badge: "Coleção Tríade",
    description:
      "As três variações cromáticas do acervo: Magenta Solar, Preto Ether e Ciano Elétrico, projetadas para durar o festival e o caminho todo.",
    imageSrc: "/store/IMG_8011-2.jpg.jpeg",
  },
  {
    id: "img-0229",
    title: "Excelência nos Detalhes",
    category: "Editorial",
    badge: "Ensaio Oficial",
    description:
      "Design marcante, simbologia ancestral e identidade iTech em uma peça feita para se destacar.",
    imageSrc: "/store/IMG_0229 2.jpg.jpeg",
  },
  {
    id: "img-0274",
    title: "Caminho dos Ancestrais",
    category: "Acessórios",
    badge: "Edição Histórica",
    description:
      "Grafismos inspirados na dilatação temporal e no portal dimensional, impressos com alta fixação resistente à lavagem.",
    imageSrc: "/store/IMG_0274.jpg.jpeg",
  },
  {
    id: "img-0439",
    title: "Estética Singular e Significados Marcantes",
    category: "Vestuário",
    badge: "100% Algodão",
    description:
      "Corte reforçado, toque suave e acabamento resistente pensado especialmente para os dias e noites de celebração.",
    imageSrc: "/store/IMG_0439.jpg.jpeg",
  },
  {
    id: "img-7962",
    title: "Diversos Modelos",
    category: "Headwear",
    badge: "Proteção & Estilo",
    description:
      "O acessório indispensável para o amanhecer no Main Floor, combinando ergonomia, sombra e visual psicodélico refinado.",
    imageSrc: "/store/IMG_7962-2.jpg.jpeg",
  },
  {
    id: "img-7997",
    title: "Qual Corresponde a Sua Essência?",
    category: "Acessórios",
    badge: "Mobilidade",
    description:
      "Cordões reforçados para conforto nos ombros e espaço ideal para carregar carga, garrafa d'água e protetor solar.",
    imageSrc: "/store/IMG_7997-2.jpg.jpeg",
  },
];

type CategoryFilter = "Todos" | "Vestuário" | "Headwear" | "Acessórios" | "Editorial";

export default function StorePage() {
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>("Todos");
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);

  const filteredItems = activeFilter === "Todos"
    ? STORE_ITEMS
    : STORE_ITEMS.filter((item) => item.category === activeFilter);

  const openLightbox = (index: number) => {
    setSelectedItemIndex(index);
  };

  const closeLightbox = useCallback(() => {
    setSelectedItemIndex(null);
  }, []);

  const nextItem = useCallback(() => {
    if (selectedItemIndex === null) return;
    setSelectedItemIndex((prev) => ((prev! + 1) % filteredItems.length));
  }, [selectedItemIndex, filteredItems.length]);

  const prevItem = useCallback(() => {
    if (selectedItemIndex === null) return;
    setSelectedItemIndex((prev) => (prev! === 0 ? filteredItems.length - 1 : prev! - 1));
  }, [selectedItemIndex, filteredItems.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedItemIndex === null) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") nextItem();
      if (e.key === "ArrowLeft") prevItem();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedItemIndex, closeLightbox, nextItem, prevItem]);

  const currentItem = selectedItemIndex !== null ? filteredItems[selectedItemIndex] : null;

  return (
    <main className={styles.storeContainer}>
      {/* Luz ambiente cósmica */}
      <div className={styles.ambientGlowTop} aria-hidden="true" />
      <div className={styles.ambientGlowBottom} aria-hidden="true" />

      <div className={styles.contentWrapper}>
        {/* Cabeçalho da Store */}
        <section className={styles.heroHeader}>
          <div className={styles.badgeRow}>
            <span className={styles.editionBadge}>Acervo Oficial • Lookbook</span>
          </div>

          <h1 className={styles.pageTitle}>iTech Store</h1>

          <p className={styles.pageSubtitle}>
            Peças que carregam a energia, a arte e a história do iTech Festival
            <span className={styles.subtitleBreak}>da pista para o seu dia a dia.</span>
          </p>

          <div className={styles.heritageNote}>
            <strong>Nota aos Viajantes:</strong> As peças apresentadas abaixo
            compõem o catálogo histórico da edição de <strong>2026</strong>. A nova
            coleção exclusiva <strong>Ancestrais 2027</strong> está sendo
            desenvolvida e será lançada em breve.
          </div>
        </section>

        {/* Barra de Filtros */}
        <nav className={styles.filterBar} aria-label="Categorias de produtos">
          {(["Todos", "Vestuário", "Headwear", "Acessórios", "Editorial"] as CategoryFilter[]).map(
            (cat) => (
              <button
                key={cat}
                type="button"
                className={`${styles.filterBtn} ${
                  activeFilter === cat ? styles.filterBtnActive : ""
                }`}
                onClick={() => {
                  setActiveFilter(cat);
                  setSelectedItemIndex(null);
                }}
              >
                {cat} {cat === "Todos" ? `(${STORE_ITEMS.length})` : ""}
              </button>
            )
          )}
        </nav>

        {/* Vitrine / Galeria de Produtos */}
        <section className={styles.galleryGrid} aria-label="Catálogo de Peças">
          {filteredItems.map((item, idx) => (
            <article
              key={item.id}
              className={styles.productCard}
              onClick={() => openLightbox(idx)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") openLightbox(idx);
              }}
            >
              <div className={styles.imageWrapper}>
                <Image
                  src={item.imageSrc}
                  alt={item.title}
                  width={600}
                  height={800}
                  sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
                  className={styles.productImage}
                  loading={idx < 4 ? "eager" : "lazy"}
                />

                <div className={styles.cardBadges}>
                  <span className={styles.categoryTag}>{item.category}</span>
                  <span className={styles.statusTag}>{item.badge}</span>
                </div>

                <div className={styles.viewIconOverlay}>
                  <span className={styles.viewButtonBadge}>Explorar Peça</span>
                </div>
              </div>

              <div className={styles.cardContent}>
                <h2 className={styles.cardTitle}>{item.title}</h2>
                <p className={styles.cardDescription}>{item.description}</p>
              </div>
            </article>
          ))}
        </section>

        {/* Banner Gerador de Desejo: Coleção 2027 */}
        <section className={styles.teaserSection}>
          <div className={styles.teaserContent}>
            <span className={styles.teaserBadge}>Em Desenvolvimento</span>
            <h2 className={styles.teaserTitle}>
              Nova Coleção iTech Ancestrais 2027
            </h2>
            <p className={styles.teaserText}>
              Para a edição de 2027, novos cortes, tecidos sustentáveis, mantas
              cerimoniais e estampas sagradas com a nova identidade visual estão
              sendo forjadas. Garanta seu passaporte para o festival e viva a
              experiência completa.
            </p>

            <div className={styles.teaserActions}>
              <a
                href="https://zig.tickets/eventos/itech-ancestrais"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.btnPrimary}
              >
                Garantir Ingresso 2027
              </a>
              <Link href="/" className={styles.btnSecondary}>
                Voltar à Página Principal
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* Lightbox / Modal em Tela Cheia */}
      {currentItem && (
        <div
          className={styles.lightboxBackdrop}
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label={currentItem.title}
        >
          <div
            className={styles.lightboxContainer}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className={styles.lightboxCloseBtn}
              onClick={closeLightbox}
              aria-label="Fechar visualizador"
            >
              ✕
            </button>

            <div className={styles.lightboxBody}>
              <div className={styles.lightboxImageWrapper}>
                <button
                  type="button"
                  className={styles.lightboxNavPrev}
                  onClick={prevItem}
                  aria-label="Item anterior"
                >
                  ‹
                </button>

                <Image
                  src={currentItem.imageSrc}
                  alt={currentItem.title}
                  width={900}
                  height={1200}
                  priority
                  className={styles.lightboxImg}
                />

                <button
                  type="button"
                  className={styles.lightboxNavNext}
                  onClick={nextItem}
                  aria-label="Próximo item"
                >
                  ›
                </button>
              </div>

              <div className={styles.lightboxDetails}>
                <div>
                  <span className={styles.lightboxCategory}>
                    {currentItem.category} • {currentItem.badge}
                  </span>
                  <h3 className={styles.lightboxTitle}>{currentItem.title}</h3>
                  <p className={styles.lightboxDescription}>
                    {currentItem.description}
                  </p>
                </div>

                <div className={styles.lightboxFooter}>
                  <div className={styles.lightboxIndex}>
                    Item {selectedItemIndex! + 1} de {filteredItems.length}
                  </div>
                  <button
                    type="button"
                    className={styles.btnPrimary}
                    onClick={closeLightbox}
                  >
                    Continuar Explorando
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
