"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    setSubscribed(true);
    setEmail("");
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className={styles.footerWrapper} aria-label="Rodapé Oficial iTech Festival">
      {/* Luzes ambiente cósmicas */}
      <div className={styles.ambientGlowTop} aria-hidden="true" />
      <div className={styles.ambientBlobLeft} aria-hidden="true" />
      <div className={styles.ambientBlobRight} aria-hidden="true" />

      <div className={styles.container}>
        {/* Banner Superior de Destaque: Prévia / Ingressos */}
        <div className={styles.highlightBanner}>
          <div className={styles.highlightInfo}>
            <span className={styles.highlightBadge}>
              <span className={styles.pulseDot} />
              Edição 2027 Confirmada
            </span>
            <div>
              <span className={styles.highlightTitle}>iTech Ancestrais</span>
              <span className={styles.highlightSub}>
                • 30 de Abril a 02 de Maio de 2027 • Camping Terra da Lua
              </span>
            </div>
          </div>

          <a
            href="https://zig.tickets/eventos/itech-ancestrais"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.ctaTicketButton}
          >
            Garantir Ingresso
            <span aria-hidden="true">→</span>
          </a>
        </div>

        {/* Grid Principal de 4 Colunas */}
        <div className={styles.mainGrid}>
          {/* Coluna 1: Identidade & Manifesto */}
          <div className={styles.brandCol}>
            <Link href="/" className={styles.brandLogoLink} aria-label="Página Inicial iTech">
              <Image
                src="/logo-itech-preto.png"
                alt="iTech Festival"
                width={180}
                height={90}
                className={styles.footerLogo}
              />
            </Link>

            <p className={styles.brandManifesto}>
              O portal onde música de alta fidelidade, arte visionária, respeito
              à terra e conexões humanas convergem no coração da floresta nativa.
            </p>

            <div className={styles.festivalMetaList}>
              <div className={styles.metaItem}>
                <span className={styles.metaIcon} aria-hidden="true">📍</span>
                <span>Camping Terra da Lua • Guarapuava - PR</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaIcon} aria-hidden="true">📅</span>
                <span>30 de Abril a 02 de Maio de 2027</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaIcon} aria-hidden="true">✨</span>
                <span>Música, Arte Visionária & Conexão</span>
              </div>
            </div>
          </div>

          {/* Coluna 2: Navegação & Experiência */}
          <div>
            <h3 className={styles.colTitle}>Navegação</h3>
            <ul className={styles.linkList}>
              <li>
                <Link href="/" className={styles.footerLink}>
                  Início
                </Link>
              </li>
              <li>
                <Link href="/store" className={styles.footerLink}>
                  iTech Store & Lookbook
                  <span className={styles.tagNew}>Acervo</span>
                </Link>
              </li>
              <li>
                <Link href="/#terra-da-lua" className={styles.footerLink}>
                  O Santuário (Terra da Lua)
                </Link>
              </li>
              <li>
                <Link href="/#programacao" className={styles.footerLink}>
                  Line-up & Soundspaces
                </Link>
              </li>
              <li>
                <Link href="/#galeria" className={styles.footerLink}>
                  Galeria & Memórias
                </Link>
              </li>
              <li>
                <a
                  href="https://zig.tickets/eventos/itech-ancestrais"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.footerLink}
                >
                  Passaportes & Ingressos
                </a>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Guia do Viajante & Informações */}
          <div>
            <h3 className={styles.colTitle}>Guia do Viajante</h3>
            <ul className={styles.linkList}>
              <li>
                <Link href="/#como-chegar" className={styles.footerLink}>
                  Como Chegar & Localização
                </Link>
              </li>
              <li>
                <Link href="/#camping" className={styles.footerLink}>
                  Área de Camping & Estrutura
                </Link>
              </li>
              <li>
                <Link href="/#faq" className={styles.footerLink}>
                  O que Levar / Permitidos
                </Link>
              </li>
              <li>
                <Link href="/#regras" className={styles.footerLink}>
                  Regras de Convivência & Respeito
                </Link>
              </li>
              <li>
                <Link href="/#transporte" className={styles.footerLink}>
                  Excursões & Transporte Oficial
                </Link>
              </li>
              <li>
                <span className={styles.footerLink} style={{ opacity: 0.75, cursor: "default" }}>
                  Classificação Indicativa: +18 anos
                </span>
              </li>
            </ul>
          </div>

          {/* Coluna 4: Transmissões Cósmicas & Redes */}
          <div className={styles.newsletterCol}>
            <h3 className={styles.colTitle}>Junte-se à Tribo</h3>
            <p className={styles.newsletterText}>
              Receba anúncios de lotes, revelações do line-up e lançamentos
              exclusivos da nova coleção 2027.
            </p>

            {subscribed ? (
              <div className={styles.successMessage} role="status">
                <span aria-hidden="true">✨</span>
                <span>Conectado! Boas-vindas à nossa tribo.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className={styles.newsletterForm}>
                <div className={styles.inputGroup}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Seu melhor e-mail..."
                    required
                    className={styles.newsletterInput}
                    aria-label="Inscreva-se na newsletter"
                  />
                  <button type="submit" className={styles.newsletterBtn}>
                    Inscrever
                  </button>
                </div>
              </form>
            )}

            {/* Redes Sociais */}
            <div className={styles.socialSection}>
              <span className={styles.socialLabel}>Conecte-se com a Tribo</span>
              <div className={styles.socialRow}>
                {/* Instagram Oficial */}
                <a
                  href="https://www.instagram.com/itech.festival/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialIconBtn}
                  aria-label="Instagram Oficial @itech.festival"
                  title="@itech.festival"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </a>

                {/* WhatsApp */}
                <a
                  href="https://wa.me"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialIconBtn}
                  aria-label="WhatsApp Oficial"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </a>

                {/* Spotify / Playlist */}
                <a
                  href="https://open.spotify.com/playlist/4qeaKqhIuYmksMBacX3Dfk?si=pt9TmVVeRW-YD8CuG5DDgQ&utm_source=copy-link&pi=6cOLgWpBQXGBx&nd=1&dlsi=15705cf3987e43f9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialIconBtn}
                  aria-label="Spotify Playlist Oficial"
                  title="Playlist Spotify Oficial"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.496 17.306c-.215.352-.676.463-1.028.247-2.812-1.718-6.353-2.107-10.524-1.155-.403.092-.806-.16-.898-.564-.092-.403.16-.806.564-.898 4.568-1.044 8.502-.601 11.639 1.342.352.216.463.676.247 1.028zm1.468-3.264c-.27.441-.848.58-1.289.31-3.218-1.978-8.124-2.55-11.93-1.394-.496.15-1.024-.136-1.174-.632-.15-.496.136-1.024.632-1.174 4.356-1.321 9.774-.683 13.451 1.579.441.27.58.848.31 1.289zm.126-3.41c-3.859-2.292-10.228-2.503-13.906-1.386-.59.179-1.218-.16-1.397-.75-.179-.59.16-1.218.75-1.397 4.234-1.285 11.264-1.037 15.698 1.595.53.315.704 1.003.389 1.533-.315.53-1.003.704-1.534.405z" />
                  </svg>
                </a>

                {/* E-mail */}
                <a
                  href="mailto:contato@itechfestival.com.br"
                  className={styles.socialIconBtn}
                  aria-label="E-mail de Contato"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Linha Divisória */}
        <div className={styles.bottomDivider} aria-hidden="true" />

        {/* Barra Inferior: Copyright, Links Legais e Botão Voltar ao Topo */}
        <div className={styles.bottomBar}>
          <div className={styles.legalNotice}>
            <span className={styles.copyrightText}>
              © 2027 iTech Festival • Todos os direitos reservados.
            </span>
            <span className={styles.creatorCredit}>
              Desenvolvido por <strong>Maikon Cavalheiro</strong>
            </span>
          </div>

          <div className={styles.bottomLinks}>
            <Link href="/#termos" className={styles.bottomLegalLink}>
              Termos de Uso
            </Link>
            <Link href="/#privacidade" className={styles.bottomLegalLink}>
              Privacidade
            </Link>
            <Link href="/#regras-camping" className={styles.bottomLegalLink}>
              Regras do Camping
            </Link>
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className={styles.backToTopBtn}
            aria-label="Voltar ao topo da página"
          >
            <span>Voltar ao Topo</span>
            <span className={styles.backToTopArrow} aria-hidden="true">↑</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
