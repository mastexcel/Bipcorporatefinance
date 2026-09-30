# BIP Corporate Finance — site web et simulateur de valorisation

Site de **BIP Corporate Finance**, branche de conseil en fusions-acquisitions de Bridge Investment Partners (Abidjan) :
pages institutionnelles, simulateur de valorisation, score de préparation à la cession et formulaires de contact.

- **Stack** : Next.js 16 (App Router) · TypeScript strict · Tailwind CSS 4 · MDX · Zod · Resend · Cloudflare Turnstile · Vitest
- **Aucune base de données** : les données saisies dans le simulateur restent dans le navigateur (session) et ne sont
  transmises qu'à l'envoi du formulaire.
- Informations et validations encore attendues de BIP : voir **[A_COMPLETER.md](A_COMPLETER.md)**.

> ⚖️ **Recommandation juridique.** Avant la mise en ligne, faites relire les pages (en particulier « Lever des fonds »,
> « Investir », le simulateur et les mentions légales) par un avocat, au regard de la réglementation de l'**AMF-UMOA**
> (appel public à l'épargne, conseil en investissement) et du cadre **OHADA**. Le site a été rédigé pour ne jamais suggérer
> un appel public à l'épargne ni un conseil en investissement réglementé, mais cette relecture reste indispensable.

---

## 1. Installation

Prérequis : **Node.js 20 ou plus** (22 recommandé).

```bash
npm install
cp .env.example .env.local   # puis renseigner les valeurs (voir § 4)
npm run dev                  # http://localhost:3000
```

| Commande | Rôle |
|---|---|
| `npm run dev` | serveur de développement |
| `npm test` | tests Vitest (moteur de calcul, score, validation, e-mails) |
| `npm run typecheck` | vérification TypeScript |
| `npm run build` | build de production (échoue si un paramètre de valorisation est vide) |
| `npm start` | lance le build de production |

En développement, sans clés configurées : les e-mails sont **simulés** (seuls le destinataire et le sujet s'affichent dans
la console) et la vérification Turnstile est ignorée. En production, ces clés sont obligatoires.

## 2. Structure du projet

```
app/                    pages (une par dossier) et routes serveur (app/api/*)
components/             composants d'interface (ui, layout, forms, simulator, readiness, charts, sections)
config/
  valuation.ts          ⚠️ paramètres du simulateur (multiples, taux, primes, ajustements)
  readiness.ts          questions et barème du score de préparation
  site.ts               nom, coordonnées, réseaux sociaux, navigation
  references.ts         références d'opérations (tombstones)
  images.ts             photos d'illustration
content/
  analyses/             articles (MDX) + registre index.ts
  methode.ts            10 étapes du processus et FAQ
lib/
  valuation/            moteur de calcul (fonctions pures, sans dépendance à l'interface)
  readiness/            calcul du score
  schemas/              validation Zod (partagée navigateur / serveur)
  security/             Turnstile, champ piège, limitation des envois
  email/                envoi Resend et modèles d'e-mails
tests/                  tests Vitest
```

## 3. Modifier les multiples et les paramètres de valorisation

Tous les paramètres sont dans **`config/valuation.ts`** ; le moteur (`lib/valuation/`) ne contient aucune valeur en dur.

1. Modifiez la valeur concernée (taux en décimal : `0.0361` = 3,61 %).
2. Mettez à jour **`source`** et **`dateMiseAJour`** du groupe, et passez `statut` à `"valide"` une fois validé.
3. Lancez `npm test` : certains tests vérifient des valeurs précises et devront être ajustés si vous changez les barèmes.
4. Relisez le résultat sur la page interne **`/simulateur/methodologie`** (non indexée), qui affiche les formules et tous
   les paramètres en vigueur.

**Blocage de la mise en production** : un paramètre obligatoire à `null` (taux sans risque, prime de marché, prime pays
Côte d'Ivoire, croissance, impôt) fait échouer `npm run build` avec un message explicite.

**Mise à jour annuelle** (au minimum) : taux sans risque (Bund 10 ans), prime de marché et prime pays (Damodaran), à mettre
à jour **ensemble**, avec leur source et leur date.

Règles de calcul importantes (commentées dans le code) :
- pas de décote d'illiquidité sur l'approche par le marché (les multiples de PME non cotées l'intègrent déjà) ;
- décote de taille **uniquement** sur l'approche par le marché, prime de taille **uniquement** sur l'approche par le revenu ;
- EBE négatif : multiple de CA, ajustements qualitatifs plafonnés, décote de taille, puis −20 % en dernier.

Le **score de préparation** se règle dans `config/readiness.ts` (chaque bloc doit totaliser 20 points ; un test le vérifie).

## 4. Configurer les e-mails (Resend) et l'anti-spam (Turnstile)

### Resend
1. Créez un compte sur [resend.com](https://resend.com) et **vérifiez votre nom de domaine** (enregistrements DNS fournis par Resend).
2. Créez une clé API.
3. Renseignez dans `.env.local` (et dans Vercel, § 7) :
   - `RESEND_API_KEY` : la clé ;
   - `EMAIL_FROM` : l'expéditeur, sur le domaine vérifié (ex. `BIP Corporate Finance <contact@votre-domaine.com>`) ;
   - `EMAIL_TO` : la ou les adresses de réception des demandes, séparées par des virgules.

Chaque formulaire envoie un e-mail à BIP (avec « Répondre à » = le visiteur). Le simulateur et le score envoient en plus une
synthèse au visiteur. Le résultat du simulateur est **recalculé sur le serveur** avant envoi.

### Cloudflare Turnstile
1. Dans le tableau de bord Cloudflare → **Turnstile**, ajoutez un widget pour votre domaine (et `localhost` pour les tests).
2. Renseignez `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (clé de site) et `TURNSTILE_SECRET_KEY` (clé secrète).

Protections en place sur chaque formulaire : validation Zod côté navigateur **et** serveur, Turnstile, champ piège invisible,
limitation à 5 envois par IP toutes les 10 minutes, taille de requête limitée. Aucune donnée financière ni personnelle n'est
écrite dans les journaux serveur.

> Limitation d'envois : elle est gardée en mémoire, donc par instance serveur sur Vercel (protection « au mieux », en
> complément de Turnstile). Pour une limitation stricte, brancher un stockage partagé (ex. Upstash Redis) dans
> `lib/security/rateLimit.ts`.

### Mesure d'audience et WhatsApp
- `NEXT_PUBLIC_GA4_ID` (ex. `G-XXXXXXX`) et `NEXT_PUBLIC_META_PIXEL_ID` : chargés **uniquement après consentement**.
  Événements envoyés : `simulation_commencee`, `simulation_terminee`, `coordonnees_envoyees` (+ `score_commence`, `score_termine`).
- `NEXT_PUBLIC_WHATSAPP_NUMBER` : numéro international, chiffres uniquement (ex. `2250700000000`). Sans numéro, le bouton
  WhatsApp flottant est masqué.

## 5. Ajouter un article

1. Créez `content/analyses/mon-article.mdx` (Markdown ; tableaux autorisés).
2. Ajoutez une entrée dans `content/analyses/index.ts` :
   ```ts
   { slug: "mon-article", titre: "…", description: "…", categorie: "evaluation", date: "2026-10-15" },
   ```
   Le `slug` doit correspondre au nom du fichier. Le temps de lecture est calculé automatiquement ; l'article apparaît sur
   `/analyses`, sur l'accueil (3 derniers) et dans le sitemap.

## 6. Ajouter une référence (tombstone)

⚠️ Uniquement avec l'**accord écrit** du client.

Ajoutez un objet dans le tableau `references` de `config/references.ts` (un exemple commenté figure en tête du fichier).
Si le client ne souhaite pas être nommé, laissez `client: null` : la description anonyme s'affiche
(« Cession d'une société de distribution — Côte d'Ivoire »). Pour un logo, déposez l'image dans `public/references/`.

## 7. Mise en ligne sur Vercel

1. Poussez le dépôt sur GitHub, puis sur [vercel.com](https://vercel.com) : **Add New → Project**, importez le dépôt
   (framework détecté automatiquement : Next.js).
2. Dans **Settings → Environment Variables**, ajoutez toutes les variables de `.env.example` (environnement *Production*),
   dont `NEXT_PUBLIC_SITE_URL` = l'URL définitive (ex. `https://www.bip-corporatefinance.com`).
3. Déployez. Les en-têtes de sécurité (CSP, HSTS, X-Frame-Options…) sont définis dans `next.config.ts` ; Vercel force le HTTPS.

## 8. Brancher le nom de domaine

1. Vercel → projet → **Settings → Domains** → ajoutez `votre-domaine.com` et `www.votre-domaine.com`.
2. Chez votre registrar, créez les enregistrements DNS indiqués par Vercel (généralement un `A` vers l'IP Vercel pour le
   domaine nu et un `CNAME` `www` → `cname.vercel-dns.com`).
3. Choisissez le domaine principal (redirection de l'autre), puis mettez `NEXT_PUBLIC_SITE_URL` à jour et redéployez.
4. Ajoutez le domaine dans Turnstile et vérifiez-le dans Resend.
5. Déclarez le site dans Google Search Console et soumettez `https://votre-domaine.com/sitemap.xml`.

## 9. Photos

Le réseau de l'environnement de développement ne permettait pas d'accéder à Unsplash : **aucune photo n'est encore intégrée**.
Des visuels neutres aux couleurs de BIP s'affichent à la place. Pour ajouter une photo :
- téléchargez-la (ex. depuis Unsplash) dans `public/images/`, ou utilisez directement son URL `https://images.unsplash.com/…` ;
- renseignez `src` et `credit` dans `config/images.ts`, puis ajoutez le crédit ci-dessous.

Règle BIP : aucune photo de personne ne doit être présentée comme membre de l'équipe ou client.

**Crédits photos** : aucun pour l'instant.

## 10. Identité visuelle

- Logo : `public/logo.png` (fond transparent, issu du fichier fourni) ; favicon : `app/icon.png`, `app/apple-icon.png` et
  `public/logo-icon.png` (monogramme « BIP »). À remplacer par les fichiers vectoriels officiels dès qu'ils sont disponibles.
- Couleurs et polices : `app/globals.css` (`@theme`). L'orange `#F26522` n'est jamais utilisé pour du texte courant
  (contraste insuffisant) ; les boutons utilisent un dégradé rouge → orange foncé conforme WCAG AA.
