import { destinatairesBIP, envoyerEmail } from "@/lib/email/envoyer";
import { emailContact } from "@/lib/email/modeles";
import { contactSchema } from "@/lib/schemas/formulaires";
import { traiterFormulaire } from "@/lib/security/formulaire";

export async function POST(req: Request) {
  return traiterFormulaire(req, "contact", contactSchema, async (d) => {
    await envoyerEmail(emailContact(d, destinatairesBIP()));
  });
}
