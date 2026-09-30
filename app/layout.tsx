import type { Metadata, Viewport } from "next";
import { Inter, Montserrat } from "next/font/google";
import type { ReactNode } from "react";
import { Analytics } from "@/components/layout/Analytics";
import { BandeauCookies } from "@/components/layout/BandeauCookies";
import { BoutonWhatsApp } from "@/components/layout/BoutonWhatsApp";
import { ConsentementProvider } from "@/components/layout/Consentement";
import { ATTRIBUT, CLE_CONSENTEMENT } from "@/lib/consentement";
import { Entete } from "@/components/layout/Entete";
import { PiedDePage } from "@/components/layout/PiedDePage";
import { motsCles, site } from "@/config/site";
import { donneesProfessionalService, JsonLd } from "@/lib/seo/jsonld";
import "./globals.css";

const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat", display: "swap", weight: ["600", "700"] });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "BIP Corporate Finance — Valorisation et cession de PME en Côte d'Ivoire",
    template: "%s | BIP Corporate Finance",
  },
  description: site.description,
  keywords: motsCles,
  applicationName: site.nom,
  openGraph: {
    type: "website",
    locale: "fr_CI",
    siteName: site.nom,
  },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" className={`${montserrat.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        {/* Lit le choix cookies avant l'affichage pour ne pas faire clignoter le bandeau. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var c=localStorage.getItem(${JSON.stringify(CLE_CONSENTEMENT)});if(c==="accepte"||c==="refuse")document.documentElement.setAttribute(${JSON.stringify(ATTRIBUT)},c)}catch(e){}`,
          }}
        />
      </head>
      <body className="flex min-h-screen flex-col">
        <ConsentementProvider>
          <Entete />
          <main id="contenu" className="flex-1">
            {children}
          </main>
          <PiedDePage />
          <BoutonWhatsApp />
          <BandeauCookies />
          <Analytics />
        </ConsentementProvider>
        <JsonLd data={donneesProfessionalService} />
      </body>
    </html>
  );
}
