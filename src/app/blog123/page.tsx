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

  // Post em destaque: o marcado como featured
  const featuredPost = useMemo(() => {
    if (selectedCategory === "Todas" && searchQuery.trim() === "") {
      return allPosts.find((p) => p.featured) || allPosts[0];
    }
    return null;
  }, [allPosts, selectedCategory, searchQuery]);

  // Grid posts: exclui o featured quando na visão inicial padrão
  const gridPosts = useMemo(() => {
    if (featuredPost) {
      return filteredPosts.filter((p) => p.id !== featuredPost.id);
    }
    return filteredPosts;
  }, [filteredPosts, featuredPost]);

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
            O portal onde a pulsação do trance, a sabedoria ancestral da Terra da Lua
            e a engenharia visual de ponta se encontram em êxtase cósmico.
          </p>
        </div>
      </section>

      {/* ==================== CORPO PRINCIPAL ==================== */}
      <div className={styles.contentWrapper}>
        {/* ==================== ARTIGO MONUMENTAL EM DESTAQUE (TOPO) ==================== */}
        {featuredPost && (
          <section className={styles.featuredMonumentalSection} aria-label="Chama Principal em Destaque">
            <Link
              href={`/blog123/${featuredPost.slug}`}
              className={styles.monumentalCard}
              aria-label={`Ver conteúdo: ${featuredPost.title}`}
            >
              <div className={styles.monumentalImageWrapper}>
                <Image
                  src={featuredPost.coverImage}
                  alt={featuredPost.coverImageAlt}
                  fill
                  priority
                  className={styles.monumentalImage}
                  sizes="(max-width: 992px) 100vw, 55vw"
                />
                <div className={styles.monumentalImageGlow} />
              </div>

              <div className={styles.monumentalContent}>
                <div className={styles.monumentalBadgeRow}>
                  <span className={styles.monumentalFlameBadge}>🔥 Chama Monumental</span>
                  <span className={styles.monumentalCategory}>{featuredPost.category}</span>
                  <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>⏱ {featuredPost.readTime}</span>
                </div>

                <h2 className={styles.monumentalTitle}>{featuredPost.title}</h2>

                <p className={styles.monumentalExcerpt}>{featuredPost.excerpt}</p>

                <div className={styles.monumentalAuthorRow}>
                  <div className={styles.monumentalAuthor}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={featuredPost.author.avatar || "/face.png"}
                      alt={featuredPost.author.name}
                      className={styles.monumentalAuthorAvatar}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/face.png";
                      }}
                    />
                    <div>
                      <div className={styles.monumentalAuthorName}>{featuredPost.author.name}</div>
                      <div className={styles.monumentalAuthorRole}>{featuredPost.author.role}</div>
                    </div>
                  </div>

                  <span className={styles.portalActionBtn}>
                    <span>Ver Conteúdo</span>
                    <span aria-hidden="true">→</span>
                  </span>
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* ==================== LAYOUT DE 2 COLUNAS: FEED PRINCIPAL (3 POSTS/LINHA) + SIDEBAR ==================== */}
        <div className={styles.mainFeedWithSidebarLayout}>
          {/* Coluna Principal: Grade de Posts */}
          <section className={styles.primaryFeedCol} aria-label="Todas as Crônicas da Tribo">
            <div className={styles.streamSectionTitleRow}>
              <h2 className={styles.streamSectionTitle}>
                <span className={styles.streamRune}>᚛ ⚡ ᚜</span>
                <span>
                  {selectedCategory === "Todas"
                    ? "Crônicas & Frequências Ativas"
                    : `Trilha Sagrada: ${selectedCategory}`}
                </span>
              </h2>
            </div>

            {gridPosts.length > 0 ? (
              <div className={styles.crystalTotemGrid}>
                {gridPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog123/${post.slug}`}
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

          {/* Coluna Lateral (Sidebar): Busca, Categorias e Trilha Sonora Spotify */}
          <aside className={styles.blogSidebar} aria-label="Navegação Lateral e Frequências">
            {/* Widget de Pesquisa */}
            <div className={styles.sidebarWidget}>
              <h3 className={styles.sidebarWidgetTitle}>
                <span className={styles.sidebarWidgetRune}>ᛟ</span>
                <span>Pesquisar</span>
              </h3>
              <div className={styles.searchBox}>
                <span className={styles.searchRuneIcon} aria-hidden="true">🔍</span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar crônicas, DJs..."
                  className={styles.searchInput}
                  aria-label="Buscar publicações"
                />
              </div>
              <div className={styles.searchCounter}>
                <span>
                  {filteredPosts.length}{" "}
                  {filteredPosts.length === 1 ? "frequência sintonizada" : "frequências sintonizadas"}
                </span>
              </div>
            </div>

            {/* Widget de Categorias */}
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
            </div>

            {/* Widget de Trilha Sonora / Spotify Playlist */}
            <div className={styles.sidebarWidget}>
              <h3 className={styles.sidebarWidgetTitle}>
                <span className={styles.sidebarWidgetRune}>🎵</span>
                <span>Trilha Sonora Oficial</span>
              </h3>
              <div className={styles.spotifyPlayerWrapper}>
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
            </div>
          </aside>
        </div>

        {/* ==================== RODAPÉ DO BLOG / ACESSO DO REDATOR ==================== */}
        <div className={styles.adminAccessBar}>
          <span className={styles.adminAccessText}>
            ⚡ A Origem e a Faísca • Portal Editorial Cósmico iTech 2027
          </span>
          <Link href="/blog123/login" className={styles.adminAccessLink}>
            <span>🔒</span>
            <span>Área do Redator / Publicar Matéria</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
