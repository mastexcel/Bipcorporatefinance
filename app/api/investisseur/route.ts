import { destinatairesBIP, envoyerEmail } from "@/lib/email/envoyer";
import { emailInvestisseur } from "@/lib/email/modeles";
import { investisseurSchema } from "@/lib/schemas/formulaires";
import { traiterFormulaire } from "@/lib/security/formulaire";

export async function POST(req: Request) {
  return traiterFormulaire(req, "investisseur", investisseurSchema, async (d) => {
    await envoyerEmail(emailInvestisseur(d, destinatairesBIP()));
  });
}
