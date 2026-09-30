import { destinatairesBIP, envoyerEmail } from "@/lib/email/envoyer";
import { emailSimulationBIP, emailSimulationVisiteur } from "@/lib/email/modeles";
import { leadSimulationSchema } from "@/lib/schemas/formulaires";
import { traiterFormulaire } from "@/lib/security/formulaire";
import { evaluer } from "@/lib/valuation";

export async function POST(req: Request) {
  return traiterFormulaire(req, "simulation", leadSimulationSchema, async (d) => {
    // Le résultat est RECALCULÉ sur le serveur : on ne fait jamais confiance
    // à un résultat transmis par le navigateur.
    const resultat = evaluer(d.donnees, { anneeReference: new Date().getFullYear() });
    await envoyerEmail(emailSimulationBIP(d, resultat, destinatairesBIP()));
    await envoyerEmail(emailSimulationVisiteur(d, resultat));
  });
}
