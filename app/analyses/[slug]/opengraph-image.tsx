import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { articles, CATEGORIES } from "@/content/analyses";

/** Image de partage propre à chaque article (LinkedIn, WhatsApp, Facebook) : 1200 × 630. */
export const alt = "Analyse BIP Corporate Finance";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

const logo = `data:image/png;base64,${await readFile(join(process.cwd(), "public/logo-clair.png"), "base64")}`;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);
  const titre = article?.titre ?? "Analyses BIP Corporate Finance";
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 80px",
          background: "radial-gradient(circle at 0% 0%, #6b1814 0%, #12131a 55%), #12131a",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logo} width={410} height={100} alt="" />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 26, color: "#ff8a5c", letterSpacing: 4, textTransform: "uppercase" }}>
            {article ? CATEGORIES[article.categorie] : "Analyses"}
          </div>
          <div style={{ fontSize: 58, fontWeight: 700, color: "#ffffff", lineHeight: 1.12, marginTop: 18 }}>{titre}</div>
        </div>
        <div style={{ display: "flex", height: 8, width: "100%", background: "linear-gradient(90deg, #D7261E, #F26522, #E3A84E)" }} />
      </div>
    ),
    size,
  );
}
