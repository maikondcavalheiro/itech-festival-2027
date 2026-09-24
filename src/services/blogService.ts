"use client";

import { BlogPost, BLOG_POSTS, BlogCategory } from "@/data/blogPosts";

const STORAGE_KEY = "itech_blog_posts_v1";
const AUTH_KEY = "itech_blog_admin_session";

// Helpers para SEO e utilitários
export const SEO_PRESET_TAGS = [
  "Música Eletrônica",
  "Psytrance",
  "Festival Alternativo",
  "Rave Brasil",
  "Terra da Lua",
  "iTech 2027",
  "Arte Visionária",
  "Camping Sagrado",
  "Trance da Mata",
  "Cultura Psicodélica",
  "Sintetizadores",
  "Line-up 2027",
  "Guarapuava",
  "Ritual Noturno"
];

// Helper para extrair embed URL do YouTube
export function getYouTubeEmbedUrl(url?: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = trimmed.match(regExp);
  return match && match[2].length === 11
    ? `https://www.youtube.com/embed/${match[2]}`
    : null;
}

// Helper para converter títulos em slug amigável
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

// Inicializar armazenamento se vazio
export function getStoredPosts(): BlogPost[] {
  if (typeof window === "undefined") {
    return BLOG_POSTS;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = BLOG_POSTS.map(p => ({
        ...p,
        status: (p.status || "published") as "published" | "archived"
      }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error("Erro ao ler posts locais:", e);
    return BLOG_POSTS;
  }
}

// Salvar lista inteira
export function saveAllPosts(posts: BlogPost[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}

// Criar post
export function createPost(newPost: Partial<BlogPost> & { title: string; category: BlogPost["category"] }): BlogPost {
  const posts = getStoredPosts();
  const now = new Date();
  
  const dateDisplay = now.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  });

  const post: BlogPost = {
    id: `post-${Date.now()}`,
    slug: newPost.slug || generateSlug(newPost.title),
    title: newPost.title,
    subtitle: newPost.subtitle || "",
    excerpt: newPost.excerpt || (newPost.content ? newPost.content.substring(0, 160) + "..." : (newPost.subtitle || "")),
    category: newPost.category,
    categorySlug: newPost.categorySlug || "noticias",
    readTime: newPost.readTime || `${Math.max(2, Math.ceil((newPost.content?.length || 500) / 450))} min de leitura`,
    publishedAt: now.toISOString().split("T")[0],
    dateDisplay,
    featured: !!newPost.featured,
    author: newPost.author || {
      name: "Conselho iTech",
      role: "Curadoria Oficial",
      avatar: "/face.png"
    },
    tags: newPost.tags || [],
    coverImage: newPost.coverImage || "/blog/fogo-primordial.jpg",
    coverImageAlt: newPost.coverImageAlt || newPost.title,
    youtubeUrl: newPost.youtubeUrl || "",
    content: newPost.content || "",
    status: newPost.status || "published"
  };

  const updated = [post, ...posts];
  saveAllPosts(updated);
  return post;
}

// Atualizar post
export function updatePost(id: string, updates: Partial<BlogPost>): BlogPost | null {
  const posts = getStoredPosts();
  const index = posts.findIndex(p => p.id === id);
  if (index === -1) return null;

  const current = posts[index];
  const updatedPost: BlogPost = {
    ...current,
    ...updates,
    slug: updates.title && updates.title !== current.title ? generateSlug(updates.title) : (updates.slug || current.slug),
  };

  posts[index] = updatedPost;
  saveAllPosts(posts);
  return updatedPost;
}

// Alternar status Arquivado / Publicado
export function toggleArchivePost(id: string): BlogPost | null {
  const posts = getStoredPosts();
  const target = posts.find(p => p.id === id);
  if (!target) return null;

  const nextStatus = target.status === "archived" ? "published" : "archived";
  return updatePost(id, { status: nextStatus });
}

// Excluir post
export function deletePost(id: string): boolean {
  const posts = getStoredPosts();
  const filtered = posts.filter(p => p.id !== id);
  if (filtered.length !== posts.length) {
    saveAllPosts(filtered);
    return true;
  }
  return false;
}

// Autenticação de redator
export function loginAdmin(pass: string): boolean {
  if (typeof window === "undefined") return false;
  const validPasswords = ["itech2027", "adminitech", "faisca2027"];
  if (validPasswords.includes(pass.trim())) {
    localStorage.setItem(AUTH_KEY, JSON.stringify({
      authenticated: true,
      user: "Redator Oficial",
      role: "Admin Blog",
      timestamp: Date.now()
    }));
    return true;
  }
  return false;
}

export function isUserAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return false;
    const session = JSON.parse(raw);
    return !!session.authenticated;
  } catch {
    return false;
  }
}

export function logoutAdmin(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_KEY);
}
