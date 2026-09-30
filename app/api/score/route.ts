import { destinatairesBIP, envoyerEmail } from "@/lib/email/envoyer";
import { emailScoreBIP, emailScoreVisiteur } from "@/lib/email/modeles";
import { calculerScore } from "@/lib/readiness/score";
import { leadScoreSchema } from "@/lib/schemas/formulaires";
import { traiterFormulaire } from "@/lib/security/formulaire";

export async function POST(req: Request) {
  return traiterFormulaire(req, "score", leadScoreSchema, async (d) => {
    const resultat = calculerScore(d.reponses); // recalcul serveur
    await envoyerEmail(emailScoreBIP(d, resultat, destinatairesBIP()));
    await envoyerEmail(emailScoreVisiteur(d, resultat));
  });
}
