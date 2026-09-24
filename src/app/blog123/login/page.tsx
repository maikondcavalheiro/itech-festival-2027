"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginAdmin } from "@/services/blogService";
import styles from "./page.module.css";

export default function BlogLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      const success = loginAdmin(password);
      if (success) {
        router.push("/blog123/admin");
      } else {
        setError("Chave de acesso incorreta. Tente novamente.");
        setLoading(false);
      }
    }, 400);
  };

  return (
    <main className={styles.loginContainer}>
      <div className={styles.ambientGlowTop} />
      <div className={styles.ambientGlowBottom} />
      <div className={styles.gridPattern} />

      <div className={styles.loginCard}>
        <div className={styles.cardHeader}>
          <div className={styles.badge}>
            <span>⚡ Portal do Redator ⚡</span>
          </div>
          <h1 className={styles.title}>A Origem & a Faísca</h1>
          <p className={styles.subtitle}>
            Acesse o estúdio de publicação de crônicas e frequências do iTech 2027.
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && (
            <div className={styles.errorMessage}>
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="email">Identificação / E-mail</label>
            <input
              id="email"
              type="text"
              required
              placeholder="ex: redacao@itechfestival.com.br"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="password">Chave de Acesso / Senha</label>
            <input
              id="password"
              type="password"
              required
              placeholder="Digite sua senha de autor"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? "Sintonizando portal..." : "Acessar Estúdio do Blog ⚡"}
          </button>
        </form>

        <div className={styles.cardFooter}>
          <Link href="/blog123" className={styles.backLink}>
            ← Voltar para a vitrine do blog
          </Link>
          <span className={styles.hintText}>
            Dica de acesso rápido: utilize a senha <code>itech2027</code>
          </span>
        </div>
      </div>
    </main>
  );
}
