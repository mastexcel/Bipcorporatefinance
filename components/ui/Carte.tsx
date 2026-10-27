import Link from "next/link";
import type { ReactNode } from "react";

export function Carte({
  titre,
  children,
  href,
  lien,
  icone,
  className = "",
}: {
  titre: string;
  children: ReactNode;
  href?: string;
  lien?: string;
  icone?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`carte-vivante revele flex h-full flex-col rounded-2xl border border-bordure bg-white p-7 shadow-sm ${className}`}>
      {icone && <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-rouge to-orange text-white">{icone}</div>}
      <h3 className="mb-3 text-xl">{titre}</h3>
      <div className="flex-1 text-gris">{children}</div>
      {href && (
        <Link href={href} className="mt-5 inline-flex items-center gap-1 font-semibold text-rouge hover:text-rouge-fonce">
          {lien ?? "En savoir plus"} <span aria-hidden="true">→</span>
        </Link>
      )}
    </div>
  );
}
