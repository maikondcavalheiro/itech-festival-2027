"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import styles from "./AncestralLockModal.module.css";

const AUTO_CLOSE_MS = 10000; // 10 segundos configurados

export function triggerAncestralLock() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("open-ancestral-lock"));
  }
}

export default function AncestralLockModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [sessionKey, setSessionKey] = useState(0);

  const autoCloseTimerRef = useRef<NodeJS.Timeout | null>(null);
  const animCloseTimerRef = useRef<NodeJS.Timeout | null>(null);

  const clearAllTimers = useCallback(() => {
    if (autoCloseTimerRef.current) {
      clearTimeout(autoCloseTimerRef.current);
      autoCloseTimerRef.current = null;
    }
    if (animCloseTimerRef.current) {
      clearTimeout(animCloseTimerRef.current);
      animCloseTimerRef.current = null;
    }
  }, []);

  const closeModal = useCallback(() => {
    clearAllTimers();
    setIsClosing(true);

    animCloseTimerRef.current = setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 280);
  }, [clearAllTimers]);

  const openModal = useCallback(() => {
    clearAllTimers();
    setIsClosing(false);
    setIsOpen(true);
    setSessionKey((prev) => prev + 1);

    autoCloseTimerRef.current = setTimeout(() => {
      closeModal();
    }, AUTO_CLOSE_MS);
  }, [clearAllTimers, closeModal]);

  // Listener global estável para interceptar todos os links sem destino
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement | null)?.closest(
        "a, button, [data-ancestral-lock]"
      );
      if (!target) return;

      // 1. Elementos com atributo explícito para bloqueio ancestral
      if (target.getAttribute("data-ancestral-lock") === "true") {
        e.preventDefault();
        openModal();
        return;
      }

      // 2. Links âncora ou sem destino
      if (target.tagName.toLowerCase() === "a") {
        const anchor = target as HTMLAnchorElement;
        const href = anchor.getAttribute("href") || "";

        // Ignorar links externos e protocolos de e-mail/telefone
        if (
          href.startsWith("http://") ||
          href.startsWith("https://") ||
          href.startsWith("mailto:") ||
          href.startsWith("tel:")
        ) {
          return;
        }

        // Links vazios ou marcadores genéricos
        if (
          href === "#" ||
          href === "" ||
          href.startsWith("javascript:")
        ) {
          e.preventDefault();
          openModal();
          return;
        }

        // Links âncoras (ex: #terra-da-lua ou /#terra-da-lua)
        if (href.includes("#")) {
          const hashId = href.split("#")[1];
          if (hashId) {
            const targetElement = document.getElementById(hashId);
            // Se a seção correspondente não existe no documento
            if (!targetElement) {
              e.preventDefault();
              openModal();
              return;
            }
          }
        }
      }
    };

    const handleCustomOpen = () => {
      openModal();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeModal();
      }
    };

    document.addEventListener("click", handleGlobalClick, { capture: true });
    window.addEventListener("open-ancestral-lock", handleCustomOpen);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("click", handleGlobalClick, { capture: true });
      window.removeEventListener("open-ancestral-lock", handleCustomOpen);
      window.removeEventListener("keydown", handleKeyDown);
      clearAllTimers();
    };
  }, [openModal, closeModal, clearAllTimers]);

  if (!isOpen) return null;

  return (
    <div
      key={sessionKey}
      className={`${styles.overlay} ${isClosing ? styles.overlayClosing : ""}`}
      onClick={closeModal}
      role="dialog"
      aria-modal="true"
      aria-label="Caminho Ancestral Bloqueado"
    >
      <div
        className={`${styles.modalCard} ${isClosing ? styles.cardClosing : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Luz Mística no topo */}
        <div className={styles.sacredGlowTop} aria-hidden="true" />

        {/* Runas de canto */}
        <div className={styles.cornerDecorTL} aria-hidden="true" />
        <div className={styles.cornerDecorTR} aria-hidden="true" />
        <div className={styles.cornerDecorBL} aria-hidden="true" />
        <div className={styles.cornerDecorBR} aria-hidden="true" />

        {/* Botão Fechar */}
        <button
          type="button"
          onClick={closeModal}
          className={styles.closeButton}
          aria-label="Fechar pop-up"
        >
          ✕
        </button>

        {/* Medallion com o Rosto Ancestral */}
        <div className={styles.medallionWrapper}>
          <div className={styles.medallionHalo} aria-hidden="true" />
          <div className={styles.medallionFrame}>
            <div className={styles.medallionInner}>
              <Image
                src="/face-colorida.png"
                alt="Rosto Ancestral iTech"
                width={120}
                height={120}
                priority
                className={styles.ancestralFaceImg}
              />
            </div>
          </div>
          <div className={styles.lockBadge} title="Reino Bloqueado" aria-hidden="true">
            🔒
          </div>
        </div>

        {/* Badge Estilo RPG */}
        <div className={styles.gameBadge}>
          <span className={styles.badgeDot} />
          <span>Dimensão Selada</span>
        </div>

        {/* Mensagem Mística Solicitada */}
        <div className={styles.messageBlock}>
          <h2 className={styles.leadTitle}>Você chegou antes do tempo.</h2>
          <div className={styles.middleBody}>
            <span>Este caminho ainda está sendo preparado.</span>
            <span>Algumas histórias precisam de tempo para serem reveladas.</span>
          </div>
          <p className={styles.closingNote}>Volte em breve, viajante.</p>
        </div>

        {/* Barra de Energia / Timer (10 segundos) */}
        <div className={styles.timerContainer} aria-hidden="true">
          <div className={styles.timerBar} />
        </div>

        <p className={styles.autoCloseHint}>Sincronizando frequências...</p>
      </div>
    </div>
  );
}
