/** Emplacement visible d'une information à fournir par BIP. */
export function ACompleter({ children = "À COMPLÉTER" }: { children?: string }) {
  return <span className="a-completer">[{children}]</span>;
}
