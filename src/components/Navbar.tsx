"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Navbar.module.css";

interface NavItem {
  label: string;
  href: string;
  isCta?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: "ITECH - STORE", href: "/store" },
  { label: "TERRA DA LUA", href: "/#terra-da-lua" },
  { label: "A ORIGEM E A FAÍSCA", href: "/a-origem-e-a-faisca" },
  { label: "PROGRAMAÇÃO", href: "/#programacao" },
  { label: "GALERIA E CURIOSIDADES", href: "/#galeria" },
  {
    label: "COMPRAR INGRESSO",
    href: "https://zig.tickets/eventos/itech-ancestrais",
    isCta: true,
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  // Se não estiver na home (ex: /store), o menu fica visível imediatamente
  const [isVisible, setIsVisible] = useState(!isHome);
  const [isScrolled, setIsScrolled] = useState(!isHome);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isHome) {
      setIsVisible(true);
      setIsScrolled(true);
      return;
    }

    const updateVisibility = () => {
      const secondSection = document.getElementById("segunda-secao");
      if (secondSection) {
        const rect = secondSection.getBoundingClientRect();
        // O menu aparece assim que o topo da 2ª seção se aproxima da metade da tela
        const inSecondSection = rect.top <= window.innerHeight * 0.65;
        setIsVisible(inSecondSection);
        setIsScrolled(rect.top <= 80);
      } else {
        const fallbackScroll = window.scrollY > window.innerHeight * 0.7;
        setIsVisible(fallbackScroll);
        setIsScrolled(window.scrollY > window.innerHeight * 0.85);
      }
    };

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    window.addEventListener("resize", updateVisibility, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateVisibility);
      window.removeEventListener("resize", updateVisibility);
    };
  }, [isHome]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={`${styles.header} ${isVisible ? styles.headerVisible : ""} ${
        isScrolled ? styles.headerScrolled : ""
      }`}
    >
      {/* 1. Logo da iTech Preto */}
      <Link
        href="/"
        className={styles.logoLink}
        onClick={(e) => {
          if (isHome) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
          closeMobileMenu();
        }}
      >
        <Image
          src="/logo-itech-preto.png"
          alt="iTech Festival"
          width={130}
          height={65}
          priority
          loading="eager"
          className={styles.navLogo}
        />
      </Link>

      {/* 2. Desktop Navigation Menu */}
      <nav className={styles.navContainer} aria-label="Menu Principal">
        <ul className={styles.navLinks}>
          {NAV_ITEMS.map((item) =>
            item.isCta ? (
              <li key={item.label} className={styles.navItem}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.ctaButton}
                >
                  {item.label}
                </a>
              </li>
            ) : item.href.startsWith("/") && !item.href.includes("#") ? (
              <li key={item.label} className={styles.navItem}>
                <Link href={item.href} className={styles.navLink}>
                  {item.label}
                </Link>
              </li>
            ) : (
              <li key={item.label} className={styles.navItem}>
                <a href={item.href} className={styles.navLink}>
                  {item.label}
                </a>
              </li>
            )
          )}
        </ul>
      </nav>

      {/* 3. Botão Hamburger Mobile */}
      <button
        type="button"
        className={`${styles.hamburger} ${
          isMobileMenuOpen ? styles.hamburgerOpen : ""
        }`}
        onClick={toggleMobileMenu}
        aria-label={isMobileMenuOpen ? "Fechar menu" : "Abrir menu"}
        aria-expanded={isMobileMenuOpen}
      >
        <span className={styles.hamburgerLine} />
        <span className={styles.hamburgerLine} />
        <span className={styles.hamburgerLine} />
      </button>

      {/* 4. Overlay do Menu Mobile */}
      <div
        className={`${styles.mobileMenu} ${
          isMobileMenuOpen ? styles.mobileMenuOpen : ""
        }`}
        aria-hidden={!isMobileMenuOpen}
      >
        <Image
          src="/logo-itech-preto.png"
          alt="iTech Festival"
          width={140}
          height={70}
          className={styles.mobileLogo}
        />

        <ul className={styles.mobileNavList}>
          {NAV_ITEMS.map((item) => (
            <li key={item.label}>
              {item.isCta ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.ctaButton} ${styles.mobileCta}`}
                  onClick={closeMobileMenu}
                >
                  {item.label}
                </a>
              ) : item.href.startsWith("/") && !item.href.includes("#") ? (
                <Link
                  href={item.href}
                  className={styles.mobileNavLink}
                  onClick={closeMobileMenu}
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  href={item.href}
                  className={styles.mobileNavLink}
                  onClick={closeMobileMenu}
                >
                  {item.label}
                </a>
              )}
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
