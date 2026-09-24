"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  const [hasEntered, setHasEntered] = useState(false);
  const [zoomProgress, setZoomProgress] = useState(0);
  const [isDismissing, setIsDismissing] = useState(false);
  const [heroDismissed, setHeroDismissed] = useState(false);

  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);
  const secondSectionRef = useRef<HTMLElement | null>(null);
  const hasTriggeredScrollToSection = useRef(false);
  const isDismissingRef = useRef(false);
  const touchStartY = useRef<number | null>(null);

  const desktopHeroVideoRef = useRef<HTMLVideoElement | null>(null);
  const mobileHeroVideoRef = useRef<HTMLVideoElement | null>(null);
  const secondSectionVideoRef = useRef<HTMLVideoElement | null>(null);

  // Garantir que ao recarregar a página (F5) inicie limpo no topo com a Hero visível
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }, []);

  // Bloqueia o scroll físico da página enquanto a Hero estiver ativa
  useEffect(() => {
    if (!heroDismissed) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [heroDismissed]);

  const dismissHero = useCallback(() => {
    if (isDismissingRef.current) return;
    isDismissingRef.current = true;
    setIsDismissing(true);

    // Efeito de dissolução mágica: após o fade-out/scale cósmico (750ms), desmonta a Hero
    setTimeout(() => {
      setHeroDismissed(true);
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      window.scrollTo(0, 0);
      window.dispatchEvent(new Event("scroll"));
    }, 750);
  }, []);

  const forcePlayVideos = useCallback(() => {
    const videos = [
      desktopHeroVideoRef.current,
      mobileHeroVideoRef.current,
      secondSectionVideoRef.current,
    ];
    videos.forEach((video) => {
      if (video) {
        video.setAttribute("playsinline", "true");
        video.setAttribute("webkit-playsinline", "true");
        video.defaultMuted = true;
        video.muted = true;
        if (video.paused) {
          const promise = video.play();
          if (promise !== undefined) {
            promise.catch(() => {});
          }
        }
      }
    });
  }, []);

  // Forçar autoplay no carregamento e em qualquer toque/interação (essencial para Safari no iOS)
  useEffect(() => {
    forcePlayVideos();

    const handleInteraction = () => {
      forcePlayVideos();
    };

    window.addEventListener("touchstart", handleInteraction, { passive: true });
    window.addEventListener("touchmove", handleInteraction, { passive: true });
    window.addEventListener("pointerdown", handleInteraction, { passive: true });
    window.addEventListener("click", handleInteraction, { passive: true });
    window.addEventListener("scroll", handleInteraction, { passive: true });

    return () => {
      window.removeEventListener("touchstart", handleInteraction);
      window.removeEventListener("touchmove", handleInteraction);
      window.removeEventListener("pointerdown", handleInteraction);
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("scroll", handleInteraction);
    };
  }, [forcePlayVideos]);

  // 1. Initial delay for the mask to emerge
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasEntered(true);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  // 2. Smooth Lerp Loop for Zoom & Portal Effect
  useEffect(() => {
    if (heroDismissed) return;

    const updateZoom = () => {
      const diff = targetProgressRef.current - currentProgressRef.current;
      currentProgressRef.current += diff * 0.12;

      if (Math.abs(diff) < 0.0002) {
        currentProgressRef.current = targetProgressRef.current;
      }

      setZoomProgress(currentProgressRef.current);

      // Quando o zoom atinge o ápice (terceiro olho acessado), o portal dissolve e materializa a 2ª seção
      if (currentProgressRef.current >= 0.98 && !hasTriggeredScrollToSection.current) {
        hasTriggeredScrollToSection.current = true;
        dismissHero();
      }

      // Se o usuário recuar antes de entrar no portal
      if (currentProgressRef.current < 0.95 && !isDismissingRef.current) {
        hasTriggeredScrollToSection.current = false;
      }

      animationFrameRef.current = requestAnimationFrame(updateZoom);
    };

    animationFrameRef.current = requestAnimationFrame(updateZoom);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [heroDismissed, dismissHero]);

  // 3. Wheel Event: Zoom em direção ao portal do terceiro olho
  const handleWheel = useCallback((e: WheelEvent) => {
    if (isDismissingRef.current) return;

    if (e.deltaY > 0 && targetProgressRef.current < 1) {
      // Rolando para baixo: avança o zoom em direção ao portal
      e.preventDefault();
      targetProgressRef.current = Math.min(1, targetProgressRef.current + Math.abs(e.deltaY) * 0.0018);
    } else if (e.deltaY < 0 && targetProgressRef.current > 0) {
      // Rolando para cima: afasta o zoom de volta
      e.preventDefault();
      targetProgressRef.current = Math.max(0, targetProgressRef.current - Math.abs(e.deltaY) * 0.0018);
    }
  }, []);

  // 4. Touch events para navegação mobile fluida e bidirecional
  const handleTouchStart = useCallback((e: TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    forcePlayVideos();
  }, [forcePlayVideos]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (touchStartY.current === null || isDismissingRef.current) return;
    const currentY = e.touches[0].clientY;
    const deltaY = touchStartY.current - currentY;

    if (deltaY > 0 && targetProgressRef.current < 1) {
      // Deslizando para cima: avança no portal
      if (e.cancelable) e.preventDefault();
      targetProgressRef.current = Math.min(1, targetProgressRef.current + deltaY * 0.005);
    } else if (deltaY < 0 && targetProgressRef.current > 0) {
      // Deslizando para baixo: recua o portal
      if (e.cancelable) e.preventDefault();
      targetProgressRef.current = Math.max(0, targetProgressRef.current + deltaY * 0.005);
    }
    touchStartY.current = currentY;
  }, []);

  useEffect(() => {
    if (heroDismissed) return;

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [heroDismissed, handleWheel, handleTouchStart, handleTouchMove]);

  // Compute zoom scale: 1x -> 90x directly into third eye
  const isZooming = zoomProgress > 0.002;
  const zoomScale = 1 + Math.pow(zoomProgress, 2.3) * 88;

  // Mask vertical position: starts higher up at 34% in sky, smoothly aligns towards 50% as zoom takes over
  const currentTop = 34 + Math.min(1, zoomProgress * 2.2) * 16;

  // Portal Magical Vortex Opacity & Dynamic Scale (ignites from 0.72 to 1.0)
  const isPortalApproaching = zoomProgress >= 0.72;
  const portalVortexOpacity = Math.min(1, Math.max(0, (zoomProgress - 0.72) / 0.22));
  const portalVortexScale = 0.5 + Math.pow(Math.max(0, (zoomProgress - 0.72) / 0.28), 2) * 3.5;

  // Dimensional flash at peak entry (from 0.92 to 1.0)
  const dimensionalFlashOpacity = Math.min(1, Math.max(0, (zoomProgress - 0.92) / 0.07));

  // Hint opacity
  const hintOpacity = hasEntered && zoomProgress < 0.05 ? 1 : 0;

  return (
    <main className={styles.main}>
      {/* 1ª SEÇÃO: Hero Pinned com Vídeo dos Ancestrais e Efeito Especial de Portal */}
      {!heroDismissed && (
        <section
          id="hero-portal"
          className={`${styles.heroContainer} ${
            isDismissing ? styles.heroDismissing : ""
          }`}
          aria-label="Hero Section"
          onClick={forcePlayVideos}
          onTouchStart={forcePlayVideos}
        >
        {/* Desktop Stage (16:9) */}
        <div className={`${styles.videoStage} ${styles.desktopStage}`}>
          <video
            ref={(el) => {
              desktopHeroVideoRef.current = el;
              if (el) {
                el.setAttribute("playsinline", "true");
                el.setAttribute("webkit-playsinline", "true");
                el.defaultMuted = true;
                el.muted = true;
                el.play().catch(() => {});
              }
            }}
            className={styles.heroVideo}
            autoPlay
            loop
            muted
            playsInline
            controls={false}
            preload="auto"
            disablePictureInPicture
            disableRemotePlayback
            onLoadedMetadata={(e) => {
              const v = e.currentTarget;
              v.defaultMuted = true;
              v.muted = true;
              v.play().catch(() => {});
            }}
            onCanPlay={(e) => {
              const v = e.currentTarget;
              v.defaultMuted = true;
              v.muted = true;
              v.play().catch(() => {});
            }}
          >
            <source src="/fundo%20itech%202027%20ancestrais%202.mp4" type="video/mp4" />
          </video>

          {/* Mask Emerges Centered, Sized Appropriately and Positioned Higher Up Above Fire */}
          {hasEntered && (
            <div
              className={`${styles.maskWrapper} ${
                !isZooming ? styles.maskFloating : ""
              }`}
              style={{
                top: `${currentTop}%`,
                transform: `translate(-50%, -50%) scale(${zoomScale})`,
                opacity: hasEntered ? 1 : 0,
              }}
            >
              <div className={!isZooming ? styles.maskEmerging : ""}>
                <Image
                  src="/face.png"
                  alt="Ancestral Mask"
                  width={373}
                  height={533}
                  priority
                  className={styles.maskImage}
                />
              </div>
            </div>
          )}
        </div>

        {/* Mobile Stage (9:16) */}
        <div className={`${styles.videoStage} ${styles.mobileStage}`}>
          <video
            ref={(el) => {
              mobileHeroVideoRef.current = el;
              if (el) {
                el.setAttribute("playsinline", "true");
                el.setAttribute("webkit-playsinline", "true");
                el.defaultMuted = true;
                el.muted = true;
                el.play().catch(() => {});
              }
            }}
            className={styles.heroVideo}
            autoPlay
            loop
            muted
            playsInline
            controls={false}
            preload="auto"
            disablePictureInPicture
            disableRemotePlayback
            onLoadedMetadata={(e) => {
              const v = e.currentTarget;
              v.defaultMuted = true;
              v.muted = true;
              v.play().catch(() => {});
            }}
            onCanPlay={(e) => {
              const v = e.currentTarget;
              v.defaultMuted = true;
              v.muted = true;
              v.play().catch(() => {});
            }}
          >
            <source src="/Fundo-mobile.mp4" type="video/mp4" />
          </video>

          {/* Mask on Mobile */}
          {hasEntered && (
            <div
              className={`${styles.maskWrapper} ${
                !isZooming ? styles.maskFloating : ""
              }`}
              style={{
                top: `${currentTop}%`,
                transform: `translate(-50%, -50%) scale(${zoomScale})`,
                opacity: hasEntered ? 1 : 0,
              }}
            >
              <div className={!isZooming ? styles.maskEmerging : ""}>
                <Image
                  src="/face.png"
                  alt="Ancestral Mask"
                  width={373}
                  height={533}
                  priority
                  className={styles.maskImage}
                />
              </div>
            </div>
          )}
        </div>

        {/* EFEITO ESPECIAL: Vórtice Mágico e Anéis Sagrados do 3º Olho */}
        {isPortalApproaching && (
          <div
            className={styles.portalVortex}
            style={{
              opacity: portalVortexOpacity,
              transform: `scale(${portalVortexScale})`,
            }}
            aria-hidden="true"
          >
            {/* Feixes e Raios Cósmicos Prismáticos */}
            <div className={styles.portalRays} />

            {/* Núcleo de Luz Ultravioleta & Ciano */}
            <div className={styles.portalCoreGlow} />

            {/* Anéis de Geometria Sagrada em Rotação Contínua */}
            <div className={styles.portalRing1} />
            <div className={styles.portalRing2} />
            <div className={styles.portalRing3} />
          </div>
        )}

        {/* Flash Dimensional que cega a transição de entrada */}
        <div
          className={styles.dimensionalFlash}
          style={{ opacity: dimensionalFlashOpacity }}
          aria-hidden="true"
        />

        {/* Scroll Hint */}
        <div
          className={styles.scrollHint}
          style={{ opacity: hintOpacity, cursor: "pointer" }}
          onClick={() => {
            targetProgressRef.current = 1;
          }}
          aria-hidden="true"
        >
          <div className={styles.mouseIcon}>
            <div className={styles.wheelDot} />
          </div>
          <span className={styles.scrollText}>Role para entrar</span>
        </div>
      </section>
      )}

      {/* 2ª SEÇÃO: 1. Face | 2. iTech Maior | 3. Info Atualizada */}
      <section
        ref={secondSectionRef}
        id="segunda-secao"
        className={styles.secondSection}
        aria-label="iTech Festival 2027 - Ancestrais"
      >
        {/* Vídeo de Plano de Fundo da 2ª Seção em Loop Contínuo e Silenciado */}
        <video
          ref={(el) => {
            secondSectionVideoRef.current = el;
            if (el) {
              el.setAttribute("playsinline", "true");
              el.setAttribute("webkit-playsinline", "true");
              el.defaultMuted = true;
              el.muted = true;
              el.play().catch(() => {});
            }
          }}
          className={styles.secondSectionVideo}
          autoPlay
          loop
          muted
          playsInline
          controls={false}
          preload="auto"
          disablePictureInPicture
          disableRemotePlayback
          onLoadedMetadata={(e) => {
            const v = e.currentTarget;
            v.defaultMuted = true;
            v.muted = true;
            v.play().catch(() => {});
          }}
          onCanPlay={(e) => {
            const v = e.currentTarget;
            v.defaultMuted = true;
            v.muted = true;
            v.play().catch(() => {});
          }}
        >
          <source src="/Fundo%202%20itech%20festival.mp4" type="video/mp4" />
        </video>

        {/* Halo de luz mística do portal no fundo da 2ª seção */}
        <div className={styles.portalBehindSecondSection} aria-hidden="true" />

        {/* Conteúdo Oficial Materializado do Portal */}
        <div className={styles.secondSectionContent}>
          {/* 1. Face Colorida no topo */}
          <Image
            src="/face-colorida.png"
            alt="Face Ancestrais iTech"
            width={1075}
            height={1464}
            priority
            className={styles.festivalFace}
          />

          {/* Bloco do Logo e Informações com aura escura de contraste dedicado */}
          <div className={styles.brandInfoWrapper}>
            {/* Aura/Glow escuro radial que anula o brilho da água e garante legibilidade cristalina */}
            <div className={styles.textBackdropGlow} aria-hidden="true" />

            {/* 2. Logo iTech montanha no meio (BEM MAIOR) */}
            <Image
              src="/logo-itech-montanha-v2.png"
              alt="iTech Logo Montanha"
              width={800}
              height={379}
              priority
              className={styles.festivalLogo}
            />

            {/* 3. Informações atualizadas em baixo */}
            <Image
              src="/info-ancestrais-v2.png"
              alt="Ancestrais Camping Terra da Lua"
              width={398}
              height={180}
              priority
              className={styles.festivalInfo}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
