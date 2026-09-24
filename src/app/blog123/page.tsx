"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { BlogPost, BLOG_CATEGORIES, BlogCategory } from "@/data/blogPosts";
import { getStoredPosts } from "@/services/blogService";
import styles from "./page.module.css";

export default function OrigemEFaiscaBlog() {
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<BlogCategory>("Todas");
  const [searchQuery, setSearchQuery] = useState("");
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Áudio sintetizado via Web Audio API (Drone Psicoacústico 432Hz)
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const osc1Ref = useRef<OscillatorNode | null>(null);
  const osc2Ref = useRef<OscillatorNode | null>(null);

  useEffect(() => {
    const loaded = getStoredPosts();
    setAllPosts(loaded.filter((p) => (p.status || "published") === "published"));

    return () => {
      // Limpeza de áudio ao desmontar
      if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  const toggleSound = () => {
    if (isPlayingAudio) {
      // Fade out
      if (gainNodeRef.current && audioCtxRef.current) {
        gainNodeRef.current.gain.setTargetAtTime(0, audioCtxRef.current.currentTime, 0.5);
        setTimeout(() => {
          setIsPlayingAudio(false);
        }, 500);
      } else {
        setIsPlayingAudio(false);
      }
    } else {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContextClass) return;

        if (!audioCtxRef.current || audioCtxRef.current.state === "closed") {
          audioCtxRef.current = new AudioContextClass();
        }

        const ctx = audioCtxRef.current;
        if (ctx.state === "suspended") {
          ctx.resume();
        }

        // Criar osciladores harmoniosos (432Hz fundamental + 216Hz sub + 864Hz harmônico)
        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0.01, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 1.5);
        gainNode.connect(ctx.destination);
        gainNodeRef.current = gainNode;

        const osc1 = ctx.createOscillator();
        osc1.type = "sine";
        osc1.frequency.setValueAtTime(108, ctx.currentTime); // Sub-grave ancestral
        osc1.connect(gainNode);
        osc1.start();
        osc1Ref.current = osc1;

        const osc2 = ctx.createOscillator();
        osc2.type = "triangle";
        osc2.frequency.setValueAtTime(432, ctx.currentTime); // Frequência da cura / geometria
        
        // Modulação LFO sutil para respirar com a música
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.setValueAtTime(0.2, ctx.currentTime); // Ciclo lento de 5 segundos
        lfoGain.gain.setValueAtTime(4, ctx.currentTime);
        lfo.connect(lfoGain);
        lfoGain.connect(osc2.frequency);
        lfo.start();

        osc2.connect(gainNode);
        osc2.start();
        osc2Ref.current = osc2;

        setIsPlayingAudio(true);
      } catch (e) {
        console.error("Falha ao iniciar áudio ambiental:", e);
      }
    }
  };

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
            <span>O Oráculo das Frequências • iTech 2027</span>
            <span className={styles.sparkleDot}>✧</span>
          </div>

          <h1 className={styles.oracleTitle}>A Origem & a Faísca</h1>

          <p className={styles.oracleSubtitle}>
            O portal onde a pulsação do trance, a sabedoria ancestral da Terra da Lua
            e a engenharia visual de ponta se encontram em êxtase cósmico.
          </p>

          {/* Sintetizador de Frequência Sonora Tribal */}
          <div className={styles.soundFrequencyBar}>
            <button
              onClick={toggleSound}
              type="button"
              className={`${styles.soundBtn} ${isPlayingAudio ? styles.soundBtnActive : ""}`}
              aria-label={isPlayingAudio ? "Pausar frequência sonora" : "Ativar frequência sonora 432Hz"}
            >
              <span>{isPlayingAudio ? "⏸ Pausar Ressonância" : "▶ Sintonizar 432Hz"}</span>
            </button>

            <div className={styles.waveVisualizer} aria-hidden="true">
              <span className={`${styles.waveBar} ${isPlayingAudio ? styles.waveBarActive : ""}`} />
              <span className={`${styles.waveBar} ${isPlayingAudio ? styles.waveBarActive : ""}`} />
              <span className={`${styles.waveBar} ${isPlayingAudio ? styles.waveBarActive : ""}`} />
              <span className={`${styles.waveBar} ${isPlayingAudio ? styles.waveBarActive : ""}`} />
              <span className={`${styles.waveBar} ${isPlayingAudio ? styles.waveBarActive : ""}`} />
            </div>

            <span className={styles.frequencyInfo}>
              {isPlayingAudio ? "Frequência harmônica ativa em tempo real" : "Áudio ambiente imersivo (opcional)"}
            </span>
          </div>
        </div>
      </section>

      {/* ==================== CORPO PRINCIPAL ==================== */}
      <div className={styles.contentWrapper}>
        {/* Painel de Controles Cósmicos (Busca + Glifos de Categorias) */}
        <section className={styles.controlsSection} aria-label="Navegação e Filtros do Oráculo">
          <div className={styles.searchBarRow}>
            <div className={styles.searchBox}>
              <span className={styles.searchRuneIcon} aria-hidden="true">ᛟ</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Pesquisar crônicas, DJs, rituais, tags ou autores..."
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

          {/* Glifos Holográficos de Categorias */}
          <div className={styles.hologramCategoryGrid} role="tablist">
            {BLOG_CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.name;
              return (
                <button
                  key={cat.slug}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`${styles.holoChip} ${isActive ? styles.holoChipActive : ""}`}
                >
                  <span aria-hidden="true">{cat.icon}</span>
                  <span>{cat.name}</span>
                  <span className={styles.chipCountBadge}>{getCategoryCount(cat.name)}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* ==================== ARTIGO MONUMENTAL EM DESTAQUE ==================== */}
        {featuredPost && (
          <section className={styles.featuredMonumentalSection} aria-label="Chama Principal em Destaque">
            <article className={styles.monumentalCard}>
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

                  <Link
                    href={`/blog123/${featuredPost.slug}`}
                    className={styles.portalActionBtn}
                  >
                    <span>Entrar no Portal</span>
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            </article>
          </section>
        )}

        {/* ==================== TOTENS CRISTALINOS (GRADE DE CRÔNICAS) ==================== */}
        <section aria-label="Todas as Crônicas da Tribo">
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
                <article key={post.id} className={styles.crystalTotemCard}>
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

                    {post.tags && post.tags.length > 0 && (
                      <div className={styles.totemTags}>
                        {post.tags.map((tag) => (
                          <span key={tag} className={styles.totemTagPill}>
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

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

                      <Link
                        href={`/blog123/${post.slug}`}
                        className={styles.totemExploreLink}
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
