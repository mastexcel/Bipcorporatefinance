# Rapport final — site BIP Corporate Finance

30 septembre 2026 · branche `claude/new-session-s05hia`

## Ce qui a été fait

| Étape | Contenu |
|---|---|
| Structure | Next.js 16 (App Router), TypeScript strict, Tailwind CSS 4, MDX ; logo et favicon issus du fichier fourni ; en-tête fixe avec menu mobile, pied de page, bouton WhatsApp flottant, bandeau cookies |
| Pages | Accueil, Céder, Investir (formulaire « critères d'investissement »), Lever des fonds, Notre méthode (10 étapes + FAQ de 10 questions), Références filtrables, Analyses (3 articles), À propos (équipe, déontologie), Contact, mentions légales, politique de confidentialité (loi n° 2013-450, ARTCI), page 404 |
| Moteur de calcul | `lib/valuation/` en fonctions pures ; paramètres sourcés et datés dans `config/valuation.ts` ; EBE retraité, approche par le marché (multiples d'EBE / de CA), approche par le revenu (build-up, capitalisation, ± 1 pt), approche patrimoniale (repère et plancher), synthèse 60/40, pont de valeur, arrondi au million ; blocage du build si un paramètre obligatoire est vide |
| Simulateur | 5 étapes avec barre de progression, retour arrière et sauvegarde en session uniquement ; séparateurs de milliers automatiques ; aperçu de l'EBE retraité en direct ; résultat : fourchette, graphique « football field », pont de valeur, hypothèses dépliables, 3 points forts / 3 points de vigilance chiffrés, avertissement, formulaire de capture, bouton « Recommencer » ; page interne `/simulateur/methodologie` (non indexée) |
| Score de cession | 15 questions en 5 blocs de 20 points, niveaux et règle bloquante validés par BIP, radar, 3 actions prioritaires, formulaire de capture |
| Formulaires | Validation Zod côté navigateur et serveur, Turnstile, champ piège, limitation à 5 envois / 10 min / IP, e-mails Resend (BIP + synthèse au visiteur), résultat recalculé côté serveur, aucune donnée dans les journaux |
| SEO et conformité | Titre et description uniques par page, balises canoniques, Open Graph (image 1200 × 630), sitemap.xml, robots.txt, données structurées ProfessionalService, FAQPage et Article ; CSP, HSTS, X-Frame-Options ; GA4 et Meta Pixel chargés seulement après consentement ; refus aussi simple que l'acceptation |

**Tests** : 49 tests Vitest au vert (`npm test`) : 32 sur le moteur de calcul (tous les cas du cahier des charges), 7 sur
le score, 6 sur la validation, 4 sur les e-mails et la limitation d'envois.
Parcours complets du simulateur et du score vérifiés dans un navigateur, sur ordinateur et sur mobile. Cas de référence :
société de services, 1 Md FCFA de CA, 150 M d'EBE. Le résultat affiché (533 M FCFA en valeur centrale, avec retraitements
et profil) correspond au calcul fait à la main.

## Résultats Lighthouse (mobile, build de production)

| Page | Performance | Accessibilité | Bonnes pratiques | SEO |
|---|---|---|---|---|
| Accueil | 95–99 | 100 | 100 | 100 |
| Simulateur | 95 | 100 | 100 | 100 |
| Score de cession | 97 | 100 | 100 | 100 |
| Céder | 96 | 100 | 100 | 100 |
| Investir | 94 | 100 | 100 | 100 |
| Lever des fonds | 99 | 100 | 100 | 100 |
| Notre méthode | 97 | 100 | 100 | 100 |
| Références | 98 | 100 | 100 | 100 |
| Analyses | 98 | 100 | 100 | 100 |
| Article | 97 | 100 | 100 | 100 |
| Contact | 98 | 100 | 100 | 100 |
| À propos | 97 | 100 | 100 | 100 |

Mesures faites en local, sans les vraies photos. Elles sont à refaire après la mise en ligne, sur le domaine définitif et
avec les images définitives.

## Points à surveiller

1. **Photos** : le réseau de l'environnement de développement bloquait Unsplash. Aucune photo n'est intégrée : des visuels
   neutres aux couleurs de BIP s'affichent. Les emplacements se remplissent dans `config/images.ts`. Les photos ajouteront
   du poids : les servir via `next/image` (déjà en place) et refaire une mesure Lighthouse.
2. **Paramètres « à valider »** : multiples sectoriels, croissance g, taux d'IS et ajustements qualitatifs restent
   provisoires. Il faut aussi vérifier la mise à jour de juillet de la prime pays Damodaran (voir A_COMPLETER.md).
3. **Autres pays de l'UEMOA** : sans prime pays propre, le simulateur applique celle de la Côte d'Ivoire et l'affiche
   clairement.
4. **Limitation des envois** : elle est gardée en mémoire, donc propre à chaque instance serveur sur Vercel. C'est une
   protection d'appoint, Turnstile restant la barrière principale. Pour une limitation stricte : Upstash Redis.
5. **Clés obligatoires en production** : sans Resend ou sans Turnstile, les formulaires répondent « service indisponible »
   au lieu d'échouer silencieusement. Faire un envoi de test après chaque déploiement.
6. **CSP** : les pages restent statiques (rapides en 3G/4G), donc la CSP autorise les scripts intégrés. Elle limite
   cependant les scripts externes à Turnstile, Google et Meta. Pour ajouter un autre service (vidéo, carte…), il faut
   l'autoriser dans `next.config.ts`.
7. **Préchargement de Zod** : la bibliothèque de validation (~95 Ko) est préchargée par les liens vers le simulateur et les
   formulaires. C'est sans effet notable sur les scores actuels. Si besoin, on pourra passer à `zod/mini`.
8. **Relecture juridique** : mentions légales, confidentialité (déclaration ARTCI, transferts hors de Côte d'Ivoire) et
   conformité AMF-UMOA / OHADA, par un avocat, avant la mise en ligne.
9. **Contenus** : chiffres clés, références, équipe, téléphone et adresse restent à fournir (voir **A_COMPLETER.md**).
   Durées du processus, e-mail de contact et WhatsApp ont été intégrés.
