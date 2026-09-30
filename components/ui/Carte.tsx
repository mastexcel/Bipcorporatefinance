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
    <div className={`flex h-full flex-col rounded-lg border border-bordure bg-white p-6 shadow-sm ${className}`}>
      {icone && <div className="mb-4 text-rouge">{icone}</div>}
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
