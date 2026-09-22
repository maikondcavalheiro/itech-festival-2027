import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono, Metamorphous, Cinzel_Decorative } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AncestralAura from "@/components/AncestralAura";
import AncestralLockModal from "@/components/AncestralLockModal";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fontAncestrais = Metamorphous({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-ancestrais",
});

const fontCinzel = Cinzel_Decorative({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-cinzel",
});

export const metadata: Metadata = {
  title: "iTech Festival 2027 • Ancestrais | Camping Terra da Lua",
  description:
    "iTech Ancestrais • 30 de Abril a 02 de Maio de 2027 no Camping Terra da Lua, Guarapuava - PR. Celebração de música eletrônica, arte psicodélica e expansão de consciência.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} ${fontAncestrais.variable} ${fontCinzel.variable}`}
    >
      <body>
        {/* Google tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-F1P4EXS50J"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-F1P4EXS50J');
          `}
        </Script>

        <AncestralAura />
        <AncestralLockModal />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
