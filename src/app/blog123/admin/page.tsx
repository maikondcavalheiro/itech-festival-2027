"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  BlogPost,
  BLOG_CATEGORIES,
  BlogCategory
} from "@/data/blogPosts";
import {
  getStoredPosts,
  createPost,
  updatePost,
  deletePost,
  toggleArchivePost,
  isUserAuthenticated,
  logoutAdmin,
  SEO_PRESET_TAGS,
  getYouTubeEmbedUrl
} from "@/services/blogService";
import styles from "./page.module.css";

export default function BlogAdminDashboard() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filterTab, setFilterTab] = useState<"all" | "published" | "archived">("all");

  // Modal / Editor State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);

  // Form Fields
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [coverImage, setCoverImage] = useState("/blog/fogo-primordial.jpg");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [category, setCategory] = useState<BlogPost["category"]>("Notícias");
  const [authorName, setAuthorName] = useState("Conselho iTech");
  const [authorRole, setAuthorRole] = useState("Curadoria Oficial");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTagInput, setCustomTagInput] = useState("");
  const [content, setContent] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    if (!isUserAuthenticated()) {
      router.push("/blog123/login");
      return;
    }
    setPosts(getStoredPosts());
  }, [router]);

  const handleLogout = () => {
    logoutAdmin();
    router.push("/blog123/login");
  };

  const reloadPosts = () => {
    setPosts(getStoredPosts());
  };

  // Filtragem na tabela
  const filteredPosts = useMemo(() => {
    if (filterTab === "all") return posts;
    return posts.filter(p => (p.status || "published") === filterTab);
  }, [posts, filterTab]);

  // Estatísticas
  const stats = useMemo(() => {
    const total = posts.length;
    const published = posts.filter(p => (p.status || "published") === "published").length;
    const archived = posts.filter(p => p.status === "archived").length;
    const withVideo = posts.filter(p => !!p.youtubeUrl).length;
    return { total, published, archived, withVideo };
  }, [posts]);

  // Compressão e Upload de Imagem
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Por favor selecione um arquivo de imagem válido.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("A imagem selecionada excede 10MB. Escolha uma foto menor.");
      return;
    }

    setIsUploading(true);
    setUploadMessage("Otimizando e comprimindo imagem...");

    try {
      // Compressão via HTML5 Canvas (redimensiona máx 1920x1080 e comprime em JPEG 82%)
      const compressedBlob = await new Promise<Blob>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = document.createElement("img");
          img.onload = () => {
            const canvas = document.createElement("canvas");
            let { width, height } = img;
            const maxDimension = 1920;

            if (width > maxDimension || height > maxDimension) {
              if (width > height) {
                height = Math.round((height * maxDimension) / width);
                width = maxDimension;
              } else {
                width = Math.round((width * maxDimension) / height);
                height = maxDimension;
              }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            if (!ctx) {
              reject(new Error("Falha ao inicializar canvas"));
              return;
            }
            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob(
              (blob) => {
                if (blob) resolve(blob);
                else reject(new Error("Falha na conversão para blob"));
              },
              "image/jpeg",
              0.82
            );
          };
          img.onerror = () => reject(new Error("Falha ao carregar imagem"));
          img.src = event.target?.result as string;
        };
        reader.onerror = () => reject(new Error("Falha ao ler arquivo"));
        reader.readAsDataURL(file);
      });

      setUploadMessage("Enviando para o servidor...");
      const formData = new FormData();
      const sanitizedName = file.name.replace(/\.[^/.]+$/, "") + ".jpg";
      formData.append("file", compressedBlob, sanitizedName);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Erro no envio");
      }

      setCoverImage(data.url);
      setUploadMessage("✓ Imagem carregada e otimizada com sucesso!");
      setTimeout(() => setUploadMessage(null), 4000);
    } catch (err: any) {
      console.error("Erro no upload:", err);
      alert(`Falha no upload: ${err.message || "Tente novamente"}`);
      setUploadMessage(null);
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  // Abertura do Modal para Novo Post
  const handleOpenNew = () => {
    setEditingPostId(null);
    setTitle("");
    setSubtitle("");
    setCoverImage("/blog/fogo-primordial.jpg");
    setYoutubeUrl("");
    setCategory("Notícias");
    setAuthorName("Conselho iTech");
    setAuthorRole("Curadoria Oficial");
    setSelectedTags(["Música Eletrônica", "iTech 2027"]);
    setContent("");
    setIsFeatured(false);
    setUploadMessage(null);
    setIsModalOpen(true);
  };

  // Abertura do Modal para Edição
  const handleOpenEdit = (post: BlogPost) => {
    setEditingPostId(post.id);
    setTitle(post.title);
    setSubtitle(post.subtitle || "");
    setCoverImage(post.coverImage || "/blog/fogo-primordial.jpg");
    setYoutubeUrl(post.youtubeUrl || "");
    setCategory(post.category);
    setAuthorName(post.author?.name || "Conselho iTech");
    setAuthorRole(post.author?.role || "Curadoria Oficial");
    setSelectedTags(post.tags || []);
    setContent(post.content || post.excerpt || "");
    setIsFeatured(!!post.featured);
    setUploadMessage(null);
    setIsModalOpen(true);
  };

  // Alternar tag nos chips de SEO
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // Adicionar tag personalizada
  const handleAddCustomTag = () => {
    const trimmed = customTagInput.trim();
    if (trimmed && !selectedTags.includes(trimmed)) {
      setSelectedTags([...selectedTags, trimmed]);
      setCustomTagInput("");
    }
  };

  // Salvar Post (Criação ou Edição)
  const handleSavePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Por favor, preencha o título do post.");
      return;
    }

    const categorySlugMap: Record<BlogPost["category"], BlogPost["categorySlug"]> = {
      "Notícias": "noticias",
      "Música & Line-up": "musica-lineup",
      "Camping & Estrutura": "camping-estrutura",
      "Arte & Cultura": "arte-cultura"
    };

    const payload = {
      title,
      subtitle,
      excerpt: content ? content.slice(0, 180) + "..." : subtitle,
      category,
      categorySlug: categorySlugMap[category],
      coverImage,
      coverImageAlt: title,
      youtubeUrl,
      content,
      tags: selectedTags,
      featured: isFeatured,
      author: {
        name: authorName,
        role: authorRole,
        avatar: "/face.png"
      }
    };

    if (editingPostId) {
      updatePost(editingPostId, payload);
    } else {
      createPost(payload);
    }

    setIsModalOpen(false);
    reloadPosts();
  };

  // Exclusão
  const handleDelete = (id: string, postTitle: string) => {
    if (confirm(`Tem certeza que deseja excluir o post "${postTitle}"?`)) {
      deletePost(id);
      reloadPosts();
    }
  };

  // Arquivamento
  const handleToggleArchive = (id: string) => {
    toggleArchivePost(id);
    reloadPosts();
  };

  if (!mounted) return null;

  const currentEmbedUrl = getYouTubeEmbedUrl(youtubeUrl);

  return (
    <div className={styles.adminContainer}>
      <div className={styles.ambientHeaderGlow} />

      {/* Barra de Navegação Superior */}
      <header className={styles.topBar}>
        <div className={styles.topBarInner}>
          <div className={styles.brandInfo}>
            <span className={styles.brandLogo}>⚡ iTech 2027 Studio</span>
            <span className={styles.brandTag}>Painel do Blog</span>
          </div>

          <div className={styles.userActions}>
            <Link href="/blog123" target="_blank" className={styles.publicViewBtn}>
              <span>↗</span>
              <span>Ver Blog ao Vivo</span>
            </Link>
            <button onClick={handleLogout} className={styles.logoutBtn}>
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className={styles.mainContent}>
        <div className={styles.dashboardHeader}>
          <div>
            <h1 className={styles.headerTitle}>Gestão de Artigos & Crônicas</h1>
            <p className={styles.headerSubtitle}>
              Crie, edite e gerencie o fluxo de frequências e narrativas para a comunidade.
            </p>
          </div>

          <button onClick={handleOpenNew} className={styles.newPostBtn}>
            <span>+</span>
            <span>Novo Post</span>
          </button>
        </div>

        {/* Métricas Rápidas */}
        <section className={styles.statsRow}>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{stats.total}</div>
            <div className={styles.statLabel}>Total de Artigos</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{stats.published}</div>
            <div className={styles.statLabel}>Publicados no Ar</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{stats.withVideo}</div>
            <div className={styles.statLabel}>Com Vídeo YouTube</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{stats.archived}</div>
            <div className={styles.statLabel}>Arquivados / Ocultos</div>
          </div>
        </section>

        {/* Lista de Posts */}
        <section className={styles.postsSection}>
          <div className={styles.postsSectionHeader}>
            <div className={styles.filterTabs}>
              <button
                className={`${styles.filterTab} ${filterTab === "all" ? styles.filterTabActive : ""}`}
                onClick={() => setFilterTab("all")}
              >
                Todos ({stats.total})
              </button>
              <button
                className={`${styles.filterTab} ${filterTab === "published" ? styles.filterTabActive : ""}`}
                onClick={() => setFilterTab("published")}
              >
                Publicados ({stats.published})
              </button>
              <button
                className={`${styles.filterTab} ${filterTab === "archived" ? styles.filterTabActive : ""}`}
                onClick={() => setFilterTab("archived")}
              >
                Arquivados ({stats.archived})
              </button>
            </div>
          </div>

          <div className={styles.postsList}>
            {filteredPosts.length === 0 ? (
              <div style={{ padding: "3rem", textAlign: "center", color: "#64748b" }}>
                Nenhum post encontrado nesta categoria.
              </div>
            ) : (
              filteredPosts.map((post) => (
                <div key={post.id} className={styles.postItem}>
                  <div className={styles.postMetaLeft}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={post.coverImage || "/blog/fogo-primordial.jpg"}
                      alt={post.title}
                      className={styles.postThumb}
                    />

                    <div className={styles.postInfo}>
                      <div className={styles.postTitle}>{post.title}</div>
                      <div className={styles.postMetaSub}>
                        <span className={styles.postCategoryBadge}>{post.category}</span>
                        <span>•</span>
                        <span>{post.dateDisplay}</span>
                        {post.youtubeUrl && (
                          <>
                            <span>•</span>
                            <span className={styles.postVideoBadge}>▶ Vídeo Integrado</span>
                          </>
                        )}
                        <span>•</span>
                        <span
                          className={
                            (post.status || "published") === "published"
                              ? styles.statusBadgePublished
                              : styles.statusBadgeArchived
                          }
                        >
                          {(post.status || "published") === "published" ? "Publicado" : "Arquivado"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.postActions}>
                    <button onClick={() => handleOpenEdit(post)} className={styles.editBtn}>
                      ✏️ Editar
                    </button>
                    <button onClick={() => handleToggleArchive(post.id)} className={styles.archiveBtn}>
                      {post.status === "archived" ? "📤 Desarquivar" : "📦 Arquivar"}
                    </button>
                    <button
                      onClick={() => handleDelete(post.id, post.title)}
                      className={styles.deleteBtn}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>

      {/* Modal / Editor de Post */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                {editingPostId ? "Editar Artigo" : "Publicar Novo Artigo"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className={styles.closeModalBtn}>
                &times;
              </button>
            </div>

            <form onSubmit={handleSavePost} className={styles.editorForm}>
              {/* Título */}
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>
                  Título Principal <span className={styles.fieldHint}>(Foco no leitor e SEO)</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: O Retorno dos Rituais Noturnos no Vale da Lua..."
                  className={styles.fieldInput}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              {/* Subtítulo */}
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Subtítulo / Linha de Apoio</label>
                <input
                  type="text"
                  placeholder="Breve resumo provocativo que sintetiza o post"
                  className={styles.fieldInput}
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                />
              </div>

              {/* Categoria e Autor */}
              <div className={styles.formGridTwo}>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Categoria do Festival</label>
                  <select
                    className={styles.fieldSelect}
                    value={category}
                    onChange={(e) => setCategory(e.target.value as BlogPost["category"])}
                  >
                    <option value="Notícias">Notícias 📢</option>
                    <option value="Música & Line-up">Música & Line-up ⚡</option>
                    <option value="Camping & Estrutura">Camping & Estrutura 🏕️</option>
                    <option value="Arte & Cultura">Arte & Cultura 🎨</option>
                  </select>
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Nome do Autor / Conselho</label>
                  <input
                    type="text"
                    className={styles.fieldInput}
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="Ex: Curadoria iTech"
                  />
                </div>
              </div>

              {/* Imagem de Capa (Upload do Computador/Celular ou URL) */}
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>
                  Imagem de Capa
                  <span className={styles.fieldHint}>(Envie do seu celular/computador ou digite uma URL)</span>
                </label>

                <div className={styles.uploadControlsRow}>
                  <label className={styles.uploadFileBtn}>
                    <span>📁</span>
                    <span>{isUploading ? "Comprimindo & Enviando..." : "Escolher do Dispositivo"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      disabled={isUploading}
                      onChange={handleImageUpload}
                    />
                  </label>

                  <span className={styles.compressionBadge}>⚡ Otimização & Compressão Automática</span>
                </div>

                {uploadMessage && (
                  <div className={styles.uploadStatus}>
                    <span>{uploadMessage}</span>
                  </div>
                )}

                <input
                  type="text"
                  placeholder="/blog/fogo-primordial.jpg ou https://..."
                  className={styles.fieldInput}
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  style={{ marginTop: "0.5rem" }}
                />

                {coverImage && (
                  <div className={styles.coverPreviewBox}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={coverImage}
                      alt="Pré-visualização da capa"
                      className={styles.coverImagePreview}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/blog/fogo-primordial.jpg";
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Link do YouTube com Preview Automático */}
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>
                  Vídeo do YouTube (Opcional)
                  <span className={styles.fieldHint}>(Cole o link direto do YouTube; caso preenchido, será embutido no post)</span>
                </label>
                <input
                  type="text"
                  placeholder="https://www.youtube.com/watch?v=..."
                  className={styles.fieldInput}
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                />

                {currentEmbedUrl && (
                  <div className={styles.videoPreviewBox}>
                    <iframe
                      src={currentEmbedUrl}
                      title="Prévia do Vídeo YouTube"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className={styles.videoIframe}
                    />
                  </div>
                )}
              </div>

              {/* Tags de SEO Pré-definidas e customizadas */}
              <div className={styles.seoTagsSection}>
                <label className={styles.fieldLabel}>
                  Tags Estratégicas para SEO & Busca
                  <span className={styles.fieldHint}>(Clique para ativar/desativar tags com alto potencial de ranqueamento)</span>
                </label>

                <div className={styles.tagPresetsList}>
                  {SEO_PRESET_TAGS.map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <button
                        type="button"
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`${styles.tagPresetChip} ${isSelected ? styles.tagPresetChipSelected : ""}`}
                      >
                        {isSelected ? `✓ ${tag}` : `+ ${tag}`}
                      </button>
                    );
                  })}
                </div>

                <div className={styles.customTagRow}>
                  <input
                    type="text"
                    placeholder="Adicionar outra tag personalizada..."
                    className={styles.fieldInput}
                    value={customTagInput}
                    onChange={(e) => setCustomTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddCustomTag();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomTag}
                    className={styles.addCustomTagBtn}
                  >
                    + Adicionar Tag
                  </button>
                </div>
              </div>

              {/* Caixa de Texto do Artigo */}
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>
                  Corpo do Artigo / Texto Completo
                  <span className={styles.fieldHint}>(Escreva ou cole o conteúdo do post com parágrafos)</span>
                </label>
                <textarea
                  className={styles.fieldTextarea}
                  rows={8}
                  placeholder="Escreva ou cole os parágrafos da matéria aqui..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>

              {/* Opção de Post em Destaque no Carrossel Principal (Máx 3) */}
              <div className={styles.featuredToggleBox}>
                <label className={styles.featuredCheckboxLabel}>
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      if (checked) {
                        const currentFeaturedCount = posts.filter(
                          (p) => p.featured && p.id !== editingPostId
                        ).length;
                        if (currentFeaturedCount >= 3) {
                          alert(
                            "Já existem 3 posts marcados como destaque no carrossel. Desmarque outro post antes para adicionar este."
                          );
                          return;
                        }
                      }
                      setIsFeatured(checked);
                    }}
                    className={styles.featuredCheckboxInput}
                  />
                  <div className={styles.featuredCheckboxInfo}>
                    <span className={styles.featuredCheckboxTitle}>
                      🔥 Fixar no Carrossel de Destaques do Topo
                    </span>
                    <span className={styles.featuredCheckboxSub}>
                      Aparecerá com visual monumental e troca automática no topo do blog (máximo de 3 matérias).
                    </span>
                  </div>
                </label>
              </div>

              <div className={styles.modalFooter}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className={styles.cancelModalBtn}
                >
                  Cancelar
                </button>
                <button type="submit" className={styles.saveModalBtn}>
                  {editingPostId ? "Salvar Alterações ⚡" : "Publicar Artigo ⚡"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
