"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { BLOG_POSTS, BLOG_CATEGORIES, BlogCategory } from "@/data/blogPosts";
import styles from "./page.module.css";

export default function OrigemEFaiscaBlog() {
  const [selectedCategory, setSelectedCategory] = useState<BlogCategory>("Todas");
  const [searchQuery, setSearchQuery] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  // Filtragem combinada por categoria e termo de busca
  const filteredPosts = useMemo(() => {
    return BLOG_POSTS.filter((post) => {
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
  }, [selectedCategory, searchQuery]);

  // Post em destaque: o marcado como featured (se estiver dentro dos filtros), senão o primeiro da lista filtrada
  const featuredPost = useMemo(() => {
    if (selectedCategory === "Todas" && searchQuery.trim() === "") {
      return BLOG_POSTS.find((p) => p.featured) || BLOG_POSTS[0];
    }
    return null;
  }, [selectedCategory, searchQuery]);

  // Grid posts: exclui o featured quando estamos na visão inicial padrão
  const gridPosts = useMemo(() => {
    if (featuredPost) {
      return filteredPosts.filter((p) => p.id !== featuredPost.id);
    }
    return filteredPosts;
  }, [filteredPosts, featuredPost]);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setSubscribed(true);
      setEmailInput("");
    }
  };

  const getCategoryCount = (categoryName: BlogCategory) => {
    if (categoryName === "Todas") return BLOG_POSTS.length;
    return BLOG_POSTS.filter((p) => p.category === categoryName).length;
  };

  return (
    <main className={styles.blogContainer}>
      {/* Luzes cósmicas e auras de faísca */}
      <div className={styles.ambientSparkTop} />
      <div className={styles.ambientAuraLeft} />
      <div className={styles.ambientAuraRight} />
      <div className={styles.gridPattern} />

      <div className={styles.contentWrapper}>
        {/* ==================== HERO SECTION ==================== */}
        <section className={styles.heroSection}>
          <div className={styles.sealWrapper}>
            <div className={styles.tribalBadge}>
              <span className={styles.sparkIcon}>⚡</span>
              <span>Crônicas & Frequências • iTech 2027</span>
              <span className={styles.sparkIcon}>⚡</span>
            </div>
          </div>

          <h1 className={styles.heroTitle}>A Origem e a Faísca</h1>

          <p className={styles.heroSubtitle}>
            Onde o fogo ancestral encontra a centelha do futuro. Crônicas sobre a
            essência do festival, rituais sonoros, arte visionária e a conexão
            sagrada na Terra da Lua.
          </p>

          <div className={styles.heroDivider}>
            <span className={styles.dividerLine} />
            <span className={styles.dividerRune}>᚛ ᚚ ᚜</span>
            <span className={styles.dividerLine} />
          </div>
        </section>

        {/* ==================== BARRA DE FILTROS E BUSCA ==================== */}
        <section className={styles.filterBarSection} aria-label="Filtros do Blog">
          <div className={styles.searchRow}>
            <div className={styles.searchInputWrapper}>
              <span className={styles.searchIcon} aria-hidden="true">🔍</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por runas, temas, frequências ou autores..."
                className={styles.searchInput}
                aria-label="Buscar crônicas"
              />
            </div>

            <div className={styles.searchStats}>
              <span>
                {filteredPosts.length}{" "}
                {filteredPosts.length === 1 ? "registro revelado" : "registros revelados"}
              </span>
            </div>
          </div>

          <div className={styles.categoryList} role="tablist" aria-label="Categorias das Crônicas">
            {BLOG_CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.name;
              return (
                <button
                  key={cat.slug}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`${styles.categoryChip} ${isActive ? styles.categoryChipActive : ""}`}
                >
                  <span aria-hidden="true">{cat.icon}</span>
                  <span>{cat.name}</span>
                  <span className={styles.chipCount}>{getCategoryCount(cat.name)}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* ==================== ARTIGO DESTAQUE (CHAMA MONUMENTAL) ==================== */}
        {featuredPost && (
          <section className={styles.featuredSection} aria-label="Crônica Principal em Destaque">
            <article className={styles.featuredCard}>
              <div className={styles.featuredImageWrapper}>
                <Image
                  src={featuredPost.coverImage}
                  alt={featuredPost.coverImageAlt}
                  fill
                  priority
                  className={styles.featuredImage}
                  sizes="(max-width: 992px) 100vw, 55vw"
                />
                <div className={styles.imageOverlay} />
              </div>

              <div className={styles.featuredContent}>
                <div className={styles.featuredBadgeRow}>
                  <span className={styles.featuredPill}>🔥 Chama Primordial</span>
                  <span className={styles.categoryTag}>{featuredPost.category}</span>
                  <span className={styles.readTimeTag}>⏱ {featuredPost.readTime}</span>
                </div>

                <h2 className={styles.featuredTitle}>{featuredPost.title}</h2>

                <p className={styles.featuredExcerpt}>{featuredPost.excerpt}</p>

                <div className={styles.authorAndActionRow}>
                  <div className={styles.authorInfo}>
                    <Image
                      src={featuredPost.author.avatar}
                      alt={featuredPost.author.name}
                      width={42}
                      height={42}
                      className={styles.authorAvatar}
                    />
                    <div>
                      <div className={styles.authorName}>{featuredPost.author.name}</div>
                      <div className={styles.authorRole}>{featuredPost.author.role}</div>
                    </div>
                  </div>

                  <Link
                    href={`/blog123/${featuredPost.slug}`}
                    className={styles.readButton}
                  >
                    <span>Ler Crônica</span>
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            </article>
          </section>
        )}

        {/* ==================== GRADE DE CRÔNICAS ==================== */}
        <section aria-label="Todas as Crônicas">
          <div className={styles.sectionTitleRow}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionRune}>ᛟ</span>
              <span>
                {selectedCategory === "Todas"
                  ? "Crônicas da Tribo"
                  : `Trilha: ${selectedCategory}`}
              </span>
            </h2>
          </div>

          {gridPosts.length > 0 ? (
            <div className={styles.articleGrid}>
              {gridPosts.map((post) => (
                <article key={post.id} className={styles.articleCard}>
                  <div className={styles.cardImageWrapper}>
                    <Image
                      src={post.coverImage}
                      alt={post.coverImageAlt}
                      fill
                      className={styles.cardImage}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className={styles.cardCategoryBadge}>{post.category}</div>
                  </div>

                  <div className={styles.cardBody}>
                    <div className={styles.cardMetaRow}>
                      <span>{post.dateDisplay}</span>
                      <span>⏱ {post.readTime}</span>
                    </div>

                    <h3 className={styles.cardTitle}>{post.title}</h3>

                    <p className={styles.cardExcerpt}>{post.excerpt}</p>

                    <div className={styles.tagRow}>
                      {post.tags.map((tag) => (
                        <span key={tag} className={styles.tagPill}>
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <div className={styles.cardFooter}>
                      <div className={styles.cardAuthor}>
                        <Image
                          src={post.author.avatar}
                          alt={post.author.name}
                          width={28}
                          height={28}
                          className={styles.cardAuthorAvatar}
                        />
                        <span className={styles.cardAuthorName}>{post.author.name}</span>
                      </div>

                      <Link
                        href={`/blog123/${post.slug}`}
                        className={styles.cardReadLink}
                      >
                        <span>Explorar</span>
                        <span aria-hidden="true">→</span>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyRune}>⚡</div>
              <h3 className={styles.emptyTitle}>Nenhuma frequência encontrada</h3>
              <p className={styles.emptyText}>
                Nenhum registro corresponde ao termo &ldquo;{searchQuery}&rdquo; na categoria selecionada.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("Todas");
                }}
                className={styles.emptyResetBtn}
              >
                Limpar Filtros & Revelar Todas
              </button>
            </div>
          )}
        </section>

        {/* ==================== NEWSLETTER TRIBAL ==================== */}
        <section className={styles.newsletterSection} aria-label="Sintonizar a Frequência Tribal">
          <div className={styles.newsletterContent}>
            <span className={styles.newsletterBadge}>✧ Frequência Direta</span>
            <h2 className={styles.newsletterTitle}>Sintonize a Centelha Ancestral</h2>
            <p className={styles.newsletterDescription}>
              Receba antes de todos as novas crônicas, revelações do line-up, mapas
              secretos da Terra da Lua e ensinamentos da tribo iTech 2027.
            </p>

            {subscribed ? (
              <div className={styles.newsletterSuccess}>
                <span>⚡ Sua conexão foi sintonizada com sucesso nos registros ancestrais!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className={styles.newsletterForm}>
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="Seu melhor e-mail cósmico..."
                  className={styles.newsletterInput}
                  aria-label="E-mail para newsletter tribal"
                />
                <button type="submit" className={styles.newsletterButton}>
                  Conectar à Frequência
                </button>
              </form>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
