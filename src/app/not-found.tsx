import Link from "next/link";
import Image from "next/image";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <main className={styles.notFoundWrapper}>
      <div className={styles.cosmicBackdrop} aria-hidden="true">
        <div className={styles.ambientBlobCyan} />
        <div className={styles.ambientBlobViolet} />
      </div>

      <div className={styles.contentCard}>
        {/* Medallion Ancestral */}
        <div className={styles.medallionWrapper}>
          <div className={styles.medallionHalo} aria-hidden="true" />
          <div className={styles.medallionFrame}>
            <div className={styles.medallionInner}>
              <Image
                src="/face-colorida.png"
                alt="Rosto Ancestral iTech"
                width={130}
                height={130}
                priority
                className={styles.ancestralFaceImg}
              />
            </div>
          </div>
        </div>

        {/* Badge */}
        <div className={styles.badge404}>
          <span>Portal Não Desperto • 404</span>
        </div>

        {/* Mensagem Solicitada */}
        <h1 className={styles.title}>Você chegou antes do tempo.</h1>
        <div className={styles.description}>
          <span>Este caminho ainda está sendo preparado.</span>
          <span>Algumas histórias precisam de tempo para serem reveladas.</span>
        </div>
        <p className={styles.closing}>Volte em breve, viajante.</p>

        {/* Retornar */}
        <Link href="/" className={styles.homeButton}>
          <span>Retornar ao Portal Principal</span>
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </main>
  );
}
