"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { BlogPost } from "@/data/blogPosts";
import { getStoredPosts, getYouTubeEmbedUrl } from "@/services/blogService";
import styles from "./page.module.css";

export default function SingleBlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  const slug = params?.slug as string;

  useEffect(() => {
    if (!slug) return;
    const posts = getStoredPosts();
    const found = posts.find((p) => p.slug === slug);

    if (found) {
      setPost(found);
    }
    setLoading(false);
  }, [slug]);

  if (loading) {
    return (
      <main className={styles.singleContainer}>
        <div className={styles.contentWrapper} style={{ textAlign: "center", paddingTop: "5rem" }}>
          <p style={{ color: "#fb923c", fontWeight: 700 }}>⚡ Sintonizando crônica...</p>
        </div>
      </main>
    );
  }

  if (!post) {
    return (
      <main className={styles.singleContainer}>
        <div className={styles.contentWrapper} style={{ textAlign: "center", paddingTop: "5rem" }}>
          <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Crônica Não Encontrada</h1>
          <p style={{ color: "#94a3b8", marginBottom: "2rem" }}>
            A frequência solicitada não foi registrada ou o artigo foi movido.
          </p>
          <Link href="/a-origem-e-a-faisca" className={styles.backLink}>
            ← Retornar à Tribo & Blog
          </Link>
        </div>
      </main>
    );
  }

  const embedUrl = getYouTubeEmbedUrl(post.youtubeUrl);

  // Divide o conteúdo em parágrafos caso venha texto corrido com quebras de linha
  const paragraphs = post.content
    ? post.content.split("\n\n").filter((p) => p.trim() !== "")
    : [post.excerpt || post.subtitle];

  return (
    <main className={styles.singleContainer}>
      <div className={styles.ambientGlowTop} />
      <div className={styles.ambientAuraRight} />
      <div className={styles.gridPattern} />

      <article className={styles.contentWrapper}>
        {/* Navegação Superior */}
        <nav className={styles.navigationTop}>
          <Link href="/a-origem-e-a-faisca" className={styles.backLink}>
            ← Voltar para todas as publicações
          </Link>
          <span style={{ fontSize: "0.8rem", color: "#64748b" }}>iTech 2027 • Origem & Faísca</span>
        </nav>

        {/* Cabeçalho do Post */}
        <header className={styles.headerSection}>
          <div className={styles.badgeRow}>
            <span className={styles.categoryBadge}>{post.category}</span>
            <span className={styles.readTimeBadge}>⏱ {post.readTime}</span>
            {post.youtubeUrl && (
              <span style={{ fontSize: "0.78rem", color: "#f87171", fontWeight: 700 }}>
                ▶ Contém Vídeo
              </span>
            )}
          </div>

          <h1 className={styles.articleTitle}>{post.title}</h1>

          {post.subtitle && (
            <p className={styles.articleSubtitle}>{post.subtitle}</p>
          )}

          <div className={styles.authorMetaRow}>
            <div className={styles.authorBox}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.author.avatar || "/face.png"}
                alt={post.author.name}
                className={styles.authorAvatar}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/face.png";
                }}
              />
              <div>
                <div className={styles.authorName}>{post.author.name}</div>
                <div className={styles.authorRole}>{post.author.role}</div>
              </div>
            </div>

            <time className={styles.publishDate} dateTime={post.publishedAt}>
              Publicado em {post.dateDisplay}
            </time>
          </div>
        </header>

        {/* Imagem de Capa Monumental */}
        <div className={styles.coverWrapper}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.coverImage || "/blog/fogo-primordial.jpg"}
            alt={post.coverImageAlt || post.title}
            className={styles.coverImage}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/blog/fogo-primordial.jpg";
            }}
          />
        </div>

        {/* Bloco de Vídeo do YouTube (se houver) */}
        {embedUrl && (
          <section className={styles.videoSection} aria-label="Transmissão de Vídeo">
            <div className={styles.videoSectionTitle}>
              <span>▶</span>
              <span>Transmissão em Vídeo</span>
            </div>
            <div className={styles.videoPlayerWrapper}>
              <iframe
                src={embedUrl}
                title={`Vídeo referente a: ${post.title}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className={styles.videoIframe}
              />
            </div>
          </section>
        )}

        {/* Corpo do Artigo */}
        <section className={styles.articleBody}>
          {paragraphs.map((para, idx) => (
            <p key={idx} className={styles.paragraph}>
              {para}
            </p>
          ))}
        </section>

        {/* Tags de SEO */}
        {post.tags && post.tags.length > 0 && (
          <section className={styles.tagsSection} aria-label="Tags do Artigo">
            <div className={styles.tagsLabel}>Tópicos & Frequências:</div>
            <div className={styles.tagsList}>
              {post.tags.map((tag) => (
                <span key={tag} className={styles.tagItem}>
                  #{tag}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Rodapé / Chamada */}
        <footer className={styles.articleFooter}>
          <div className={styles.footerCallout}>
            <div className={styles.footerCalloutTitle}>Gostou desta frequência?</div>
            <div className={styles.footerCalloutText}>
              Acompanhe as próximas crônicas e novidades sobre o iTech 2027 na Terra da Lua.
            </div>
          </div>

          <Link href="/a-origem-e-a-faisca" className={styles.exploreMoreBtn}>
            Explorar Mais Artigos ⚡
          </Link>
        </footer>
      </article>
    </main>
  );
}
