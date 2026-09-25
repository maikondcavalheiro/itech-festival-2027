"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { BlogPost, BLOG_CATEGORIES, BlogCategory } from "@/data/blogPosts";
import { getStoredPosts } from "@/services/blogService";
import styles from "./page.module.css";

export default function OrigemEFaiscaBlog() {
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<BlogCategory>("Todas");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Sincroniza posts armazenados no cliente
    const updatePosts = () => {
      const loaded = getStoredPosts();
      setAllPosts(loaded.filter((p) => (p.status || "published") === "published"));
    };

    updatePosts();
    window.addEventListener("storage", updatePosts);
    return () => window.removeEventListener("storage", updatePosts);
  }, []);

  const [currentSlide, setCurrentSlide] = useState(0);

  // Filtragem combinada
  const filteredPosts = useMemo(() => {
    return allPosts.filter((post) => {
      const matchCategory =
        selectedCategory === "Todas" || post.category === selectedCategory;

      const query = searchQuery.trim().toLowerCase();
      const matchSearch =
        query === "" ||
        post.title.toLowerCase().includes(query) ||
        post.subtitle.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.tags.some((tag) => tag.toLowerCase().includes(query)) ||
        post.author.name.toLowerCase().includes(query);

      return matchCategory && matchSearch;
    });
  }, [allPosts, selectedCategory, searchQuery]);

  // Posts em destaque para o Carrossel do Topo (até 3 matérias)
  const featuredPosts = useMemo(() => {
    if (selectedCategory !== "Todas" || searchQuery.trim() !== "") {
      return [];
    }
    const marked = allPosts.filter((p) => p.featured);
    if (marked.length > 0) {
      return marked.slice(0, 3);
    }
    // Fallback: se nenhum estiver marcado como featured, pega o primeiro
    return allPosts.slice(0, 1);
  }, [allPosts, selectedCategory, searchQuery]);

  // Troca automática de slides a cada 6 segundos
  useEffect(() => {
    if (featuredPosts.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredPosts.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [featuredPosts.length]);

  const nextSlide = () => {
    if (featuredPosts.length <= 1) return;
    setCurrentSlide((prev) => (prev + 1) % featuredPosts.length);
  };

  const prevSlide = () => {
    if (featuredPosts.length <= 1) return;
    setCurrentSlide((prev) => (prev - 1 + featuredPosts.length) % featuredPosts.length);
  };

  const currentFeatured = featuredPosts[currentSlide] || featuredPosts[0];

  // Grid posts: exclui os posts que já estão no carrossel de destaques
  const gridPosts = useMemo(() => {
    if (featuredPosts.length > 0) {
      const featuredIds = new Set(featuredPosts.map((p) => p.id));
      return filteredPosts.filter((p) => !featuredIds.has(p.id));
    }
    return filteredPosts;
  }, [filteredPosts, featuredPosts]);

  const getCategoryCount = (categoryName: BlogCategory) => {
    if (categoryName === "Todas") return allPosts.length;
    return allPosts.filter((p) => p.category === categoryName).length;
  };

  return (
    <main className={styles.blogContainer}>
      {/* ==================== HERO MONUMENTAL COM A ARTE TEMA ==================== */}
      <section className={styles.oracleHeroSection} aria-label="Portal de Frequências Ancestrais">
        <div className={styles.oracleHeroBgWrapper}>
          <Image
            src="/blog-theme-art.jpg"
            alt="Máscara ancestral xamânica e lobos guardiões bioluminescentes do iTech 2027"
            fill
            priority
            className={styles.oracleHeroImage}
            sizes="100vw"
          />
          <div className={styles.oracleGradientOverlay} />
          <div className={styles.psychAuraCyan} />
          <div className={styles.psychAuraMagenta} />
        </div>

        <div className={styles.oracleContent}>
          <div className={styles.mythicBadge}>
            <span className={styles.sparkleDot}>✧</span>
            <span>Blog iTech Festival</span>
            <span className={styles.sparkleDot}>✧</span>
          </div>

          <h1 className={styles.oracleTitle}>A Origem & a Faísca</h1>

          <p className={styles.oracleSubtitle}>
            Notícias, cronogramas, cultura trance e os bastidores da iTech Festival
          </p>
        </div>
      </section>

      {/* ==================== CORPO PRINCIPAL ==================== */}
      <div className={styles.contentWrapper}>
        {/* ==================== CARROSSEL DE ARTIGOS EM DESTAQUE (TOPO - ATÉ 3 MATÉRIAS) ==================== */}
        {featuredPosts.length > 0 && (
          <section className={styles.featuredMonumentalSection} aria-label="Carrossel de Chamas em Destaque">
            <div className={styles.carouselContainer}>
              {currentFeatured && (
                <Link
                  key={currentFeatured.id}
                  href={`/a-origem-e-a-faisca/${currentFeatured.slug}`}
                  className={styles.monumentalCard}
                  aria-label={`Ver conteúdo: ${currentFeatured.title}`}
                >
                  <div className={styles.monumentalImageWrapper}>
                    <Image
                      src={currentFeatured.coverImage}
                      alt={currentFeatured.coverImageAlt}
                      fill
                      priority
                      className={styles.monumentalImage}
                      sizes="(max-width: 992px) 100vw, 55vw"
                    />
                    <div className={styles.monumentalImageGlow} />
                  </div>

                  <div className={styles.monumentalContent}>
                    <div className={styles.monumentalBadgeRow}>
                      <span className={styles.monumentalFlameBadge}>🔥 Destaque Especial</span>
                      <span className={styles.monumentalCategory}>{currentFeatured.category}</span>
                      <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>⏱ {currentFeatured.readTime}</span>
                    </div>

                    <h2 className={styles.monumentalTitle}>{currentFeatured.title}</h2>

                    <p className={styles.monumentalExcerpt}>{currentFeatured.excerpt}</p>

                    <div className={styles.monumentalAuthorRow}>
                      <div className={styles.monumentalAuthor}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={currentFeatured.author.avatar || "/face.png"}
                          alt={currentFeatured.author.name}
                          className={styles.monumentalAuthorAvatar}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/face.png";
                          }}
                        />
                        <div>
                          <div className={styles.monumentalAuthorName}>{currentFeatured.author.name}</div>
                          <div className={styles.monumentalAuthorRole}>{currentFeatured.author.role}</div>
                        </div>
                      </div>

                      <span className={styles.portalActionBtn}>
                        <span>Ver Conteúdo</span>
                        <span aria-hidden="true">→</span>
                      </span>
                    </div>
                  </div>
                </Link>
              )}

              {/* Controles do Carrossel (caso haja mais de 1 destaque) */}
              {featuredPosts.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      prevSlide();
                    }}
                    className={`${styles.carouselArrowBtn} ${styles.carouselArrowLeft}`}
                    aria-label="Destaque anterior"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      nextSlide();
                    }}
                    className={`${styles.carouselArrowBtn} ${styles.carouselArrowRight}`}
                    aria-label="Próximo destaque"
                  >
                    ›
                  </button>

                  <div className={styles.carouselIndicators}>
                    {featuredPosts.map((post, idx) => (
                      <button
                        key={post.id}
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentSlide(idx);
                        }}
                        className={`${styles.carouselDot} ${currentSlide === idx ? styles.carouselDotActive : ""}`}
                        aria-label={`Ir para destaque ${idx + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </section>
        )}

        {/* Título da Seção alinhado no topo */}
        <div className={styles.streamSectionTitleRow}>
          <h2 className={styles.streamSectionTitle}>
            <span className={styles.streamRune}>🔥</span>
            <span>
              {selectedCategory === "Todas"
                ? "Artigos & Crônicas"
                : `Trilha: ${selectedCategory}`}
            </span>
          </h2>
        </div>

        {/* ==================== LAYOUT DE 2 COLUNAS: FEED PRINCIPAL (2 POSTS/LINHA) + SIDEBAR ==================== */}
        <div className={styles.mainFeedWithSidebarLayout}>
          {/* Coluna Principal: Grade de Posts */}
          <section className={styles.primaryFeedCol} aria-label="Todas as Crônicas da Tribo">
            {gridPosts.length > 0 ? (
              <div className={styles.crystalTotemGrid}>
                {gridPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/a-origem-e-a-faisca/${post.slug}`}
                    className={styles.crystalTotemCard}
                    aria-label={`Ver conteúdo: ${post.title}`}
                  >
                    <article className={styles.totemArticleInner}>
                      <div className={styles.totemImageWrapper}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={post.coverImage || "/blog/fogo-primordial.jpg"}
                          alt={post.coverImageAlt || post.title}
                          className={styles.totemImage}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/blog/fogo-primordial.jpg";
                          }}
                        />
                        <div className={styles.totemCategoryBadge}>{post.category}</div>
                      </div>

                      <div className={styles.totemBody}>
                        <div className={styles.totemMetaRow}>
                          <span>{post.dateDisplay}</span>
                          <span>⏱ {post.readTime}</span>
                          {post.youtubeUrl && (
                            <span className={styles.videoNeonBadge}>▶ Vídeo</span>
                          )}
                        </div>

                        <h3 className={styles.totemTitle}>{post.title}</h3>

                        <p className={styles.totemExcerpt}>{post.excerpt}</p>

                        <div className={styles.totemFooter}>
                          <div className={styles.totemAuthor}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={post.author.avatar || "/face.png"}
                              alt={post.author.name}
                              className={styles.totemAuthorAvatar}
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "/face.png";
                              }}
                            />
                            <span className={styles.totemAuthorName}>{post.author.name}</span>
                          </div>

                          <span className={styles.totemExploreLink}>
                            <span>Ver Conteúdo</span>
                            <span aria-hidden="true">→</span>
                          </span>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <div className={styles.emptyRune}>⚡</div>
                <h3>Nenhuma frequência revelada</h3>
                <p style={{ color: "#94a3b8", marginTop: "0.5rem" }}>
                  Não encontramos crônicas para &ldquo;{searchQuery}&rdquo; na trilha selecionada.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("Todas");
                  }}
                  className={styles.emptyResetBtn}
                >
                  Resetar Filtros & Revelar Todas
                </button>
              </div>
            )}
          </section>

          {/* Coluna Lateral (Sidebar): Trilha Sonora Spotify alinhada aos cards, seguida por Categorias + Busca */}
          <aside className={styles.blogSidebar} aria-label="Navegação Lateral e Frequências">
            {/* Player Spotify Direto (Alinhado com a linha dos posts) */}
            <div className={styles.spotifyDirectContainer}>
              <iframe
                style={{ borderRadius: "16px", border: "0" }}
                src="https://open.spotify.com/embed/playlist/4qeaKqhIuYmksMBacX3Dfk?utm_source=generator&theme=0"
                width="100%"
                height="352"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                title="Playlist Oficial iTech Festival no Spotify"
              />
            </div>

            {/* Widget Unificado de Categorias com Pesquisa embutida na parte inferior */}
            <div className={styles.sidebarWidget}>
              <h3 className={styles.sidebarWidgetTitle}>
                <span className={styles.sidebarWidgetRune}>✧</span>
                <span>Trilhas & Categorias</span>
              </h3>

              <div className={styles.sidebarCategoryList} role="tablist">
                {BLOG_CATEGORIES.map((cat) => {
                  const isActive = selectedCategory === cat.name;
                  return (
                    <button
                      key={cat.slug}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setSelectedCategory(cat.name)}
                      className={`${styles.sidebarCategoryBtn} ${isActive ? styles.sidebarCategoryBtnActive : ""}`}
                    >
                      <span className={styles.sidebarCatLeft}>
                        <span aria-hidden="true">{cat.icon}</span>
                        <span>{cat.name}</span>
                      </span>
                      <span className={styles.chipCountBadge}>{getCategoryCount(cat.name)}</span>
                    </button>
                  );
                })}
              </div>

              {/* Divisória e Campo de Pesquisa embutido abaixo dos itens */}
              <div className={styles.sidebarSearchWrapper}>
                <span className={styles.sidebarSearchLabel}>Pesquisar no Acervo</span>
                <div className={styles.searchBox}>
                  <span className={styles.searchRuneIcon} aria-hidden="true">🔍</span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar artigo, DJ, tema..."
                    className={styles.searchInput}
                    aria-label="Buscar publicações"
                  />
                </div>
                <div className={styles.searchCounter}>
                  <span>
                    {filteredPosts.length}{" "}
                    {filteredPosts.length === 1 ? "publicação encontrada" : "publicações encontradas"}
                  </span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
