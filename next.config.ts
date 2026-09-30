import createMDX from "@next/mdx";
import type { NextConfig } from "next";
import { PHASE_PRODUCTION_BUILD } from "next/constants";
// Import relatif (les alias « @/ » ne sont pas résolus dans next.config.ts).
import { parametresEnVigueur, parametresManquants } from "./lib/valuation/params";

const isDev = process.env.NODE_ENV === "development";

/**
 * Content-Security-Policy.
 * Les pages sont statiques (rapides en 3G/4G) : on n'utilise donc pas de
 * « nonce », qui obligerait à générer chaque page à la demande. Les scripts
 * externes sont limités aux seuls domaines nécessaires : Cloudflare Turnstile,
 * Google Analytics 4 et Meta Pixel (ces deux derniers ne sont chargés qu'après
 * consentement).
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://challenges.cloudflare.com https://www.googletagmanager.com https://connect.facebook.net`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data: https://images.unsplash.com https://www.googletagmanager.com https://*.google-analytics.com https://www.facebook.com",
  "font-src 'self'",
  "connect-src 'self' https://challenges.cloudflare.com https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com https://www.facebook.com https://connect.facebook.net",
  "frame-src https://challenges.cloudflare.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
];

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

// Plugins déclarés par leur nom (compatibilité Turbopack). remark-gfm : tableaux Markdown.
const withMDX = createMDX({ options: { remarkPlugins: ["remark-gfm"] } });

export default function config(phase: string): NextConfig {
  // Blocage de la mise en production : tant qu'un paramètre de valorisation
  // obligatoire est vide ([À COMPLÉTER]), le build échoue avec une erreur explicite.
  if (phase === PHASE_PRODUCTION_BUILD) {
    const manquants = parametresManquants(parametresEnVigueur);
    if (manquants.length > 0) {
      throw new Error(
        `\n\n❌ Build interrompu : paramètres de valorisation [À COMPLÉTER] dans config/valuation.ts : ${manquants.join(", ")}.\n` +
          "   Renseignez-les (avec source et date) avant la mise en ligne.\n",
      );
    }
  }
  return withMDX(nextConfig);
}
