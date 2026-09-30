import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

/** Image de partage (LinkedIn, Facebook, WhatsApp) : 1200 × 630. */
export const alt = "BIP Corporate Finance — Valorisation, cession et transmission de PME en Côte d'Ivoire";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const logo = `data:image/png;base64,${await readFile(join(process.cwd(), "public/logo.png"), "base64")}`;

export default function Image() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#ffffff", padding: "70px 80px" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logo} width={560} height={137} alt="" />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 64, fontWeight: 700, color: "#3A3A3A", lineHeight: 1.1 }}>Combien vaut vraiment votre entreprise ?</div>
          <div style={{ fontSize: 30, color: "#6B6B6B", marginTop: 24 }}>
            Valorisation, cession et transmission de PME · Côte d&apos;Ivoire et UEMOA
          </div>
        </div>
        <div style={{ display: "flex", height: 10, width: "100%", background: "linear-gradient(90deg, #D7261E, #F26522)" }} />
      </div>
    ),
    size,
  );
}
