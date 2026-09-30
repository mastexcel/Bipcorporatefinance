import type { ReactNode } from "react";

export interface QuestionFaq {
  question: string;
  reponse: ReactNode;
  /** Version texte de la réponse (données structurées FAQPage). */
  reponseTexte: string;
}

/** FAQ accessible sans JavaScript (<details>/<summary>). */
export function Faq({ questions }: { questions: QuestionFaq[] }) {
  return (
    <div className="divide-y divide-bordure rounded-lg border border-bordure bg-white">
      {questions.map((q) => (
        <details key={q.question} className="group px-5 py-4 sm:px-6">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-titre font-semibold text-anthracite [&::-webkit-details-marker]:hidden">
            <span>{q.question}</span>
            <span aria-hidden="true" className="mt-1 text-rouge transition group-open:rotate-45">
              +
            </span>
          </summary>
          <div className="mt-3 text-gris">{q.reponse}</div>
        </details>
      ))}
    </div>
  );
}
