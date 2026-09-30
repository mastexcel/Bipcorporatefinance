import Image from "next/image";
import { TYPES_OPERATION, type Reference } from "@/config/references";
import { ACompleter } from "@/components/ui/ACompleter";

/** Carte « tombstone » d'une opération, au format des banques d'affaires. */
export function Tombstone({ reference }: { reference: Reference }) {
  return (
    <article className="flex h-full flex-col items-center justify-between rounded-lg border border-bordure bg-white p-6 text-center shadow-sm">
      <p className="text-sm font-semibold tracking-widest text-rouge uppercase">{TYPES_OPERATION[reference.typeOperation]}</p>
      <div className="my-6 flex min-h-20 items-center justify-center">
        {reference.logo ? (
          <Image src={reference.logo} alt={reference.client ?? reference.descriptionAnonyme} width={160} height={80} className="max-h-20 w-auto object-contain" />
        ) : (
          <h3 className="text-lg">{reference.client ?? `${reference.descriptionAnonyme} — ${reference.pays}`}</h3>
        )}
      </div>
      <div className="w-full border-t border-bordure pt-4 text-base text-gris">
        <p>{reference.secteur}</p>
        <p className="font-semibold text-anthracite">{reference.roleBIP}</p>
        <p>{reference.annee}</p>
      </div>
    </article>
  );
}

/** Emplacement de tombstone à compléter. */
export function TombstoneVide() {
  return (
    <div className="flex h-full min-h-64 flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-bordure bg-white p-6 text-center text-gris">
      <p className="text-sm font-semibold tracking-widest uppercase">Type d&apos;opération</p>
      <ACompleter>RÉFÉRENCE À COMPLÉTER</ACompleter>
      <p className="text-base">Secteur · Rôle de BIP · Année</p>
    </div>
  );
}
