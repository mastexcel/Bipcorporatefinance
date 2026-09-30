# Informations et validations à fournir par BIP

Chaque point indique où la modification se fait. Les emplacements visibles sur le site sont signalés par
**[À COMPLÉTER]**, **[À CONFIRMER]** ou **[À VALIDER]**.

## 1. Paramètres financiers du simulateur — `config/valuation.ts`

- [ ] **Vérifier si Damodaran a publié une prime pays plus récente** (mise à jour de juillet 2026 du fichier « ctryprem »)
      et, le cas échéant, mettre à jour **ensemble** les trois valeurs : taux sans risque (Bund 10 ans), prime de marché
      mature et prime pays Côte d'Ivoire, avec source et date. À refaire **au moins une fois par an**.
- [ ] Valider la **grille des multiples sectoriels** (EBE et CA, bas / central / haut) — actuellement « provisoire ».
- [ ] Valider la **croissance à long terme** g = 3 %.
- [ ] Valider le **taux d'impôt sur les sociétés** de 25 % avec le conseil fiscal.
- [ ] Valider les **ajustements qualitatifs** (valeurs par défaut du cahier des charges).
- [ ] Fournir, si souhaité, la **prime pays des autres pays de l'UEMOA** (Bénin, Burkina Faso, Guinée-Bissau, Mali, Niger,
      Sénégal, Togo). En attendant, le simulateur applique la prime de la Côte d'Ivoire avec un avertissement.
- [ ] Relire l'ensemble sur la page interne `/simulateur/methodologie`.

Déjà validé le 30/09/2026 : taux sans risque 3,61 % (Bund 10 ans, 29/09/2026), prime de marché 4,20 % (Damodaran, 01/07/2026),
prime pays Côte d'Ivoire 3,90 % (Damodaran, 05/01/2026, Ba2), prime de taille (5 / 4 / 3,5 / 3 pts), décote de taille
(−15 % / −5 % / 0 %), traitement de l'EBE négatif, règles du score de préparation.

## 2. Score de préparation — `config/readiness.ts`

- [ ] Valider le **libellé des 15 questions**, des options et le **nombre de points** de chaque réponse
      (structure 5 × 20 points, seuils et règle bloquante déjà validés).
- [ ] Relire les **actions conseillées** associées à chaque question.

## 3. Coordonnées et réseaux — `config/site.ts` et variables d'environnement

- [x] Numéro **WhatsApp** : +225 05 84 37 48 48 (fourni le 30/09/2026, intégré dans `config/site.ts`).
- [x] **E-mail** de contact et de réception des demandes : contact@bridgeinvestmentpartners.net (fourni le 30/09/2026).
- [x] **Téléphone** : +225 05 84 37 48 48 (même numéro que le WhatsApp, confirmé le 30/09/2026).
- [x] **Adresse** : lot 100, îlot 101, Riviera Faya Akouédo, Cocody, Abidjan (confirmée le 30/09/2026).
- [ ] URL des pages **LinkedIn** et **Facebook**.
- [x] **Adresse du site** : `corporatefinance.bridgeinvestmentpartners.net` (validée le 30/09/2026). À faire lors de la
      mise en ligne : ajouter le sous-domaine dans Vercel et l'enregistrement DNS `CNAME` chez le gestionnaire du domaine
      (README § 8), puis un lien « Corporate Finance » sur le site actuel de BIP.
- [ ] Vérifier le domaine **bridgeinvestmentpartners.net** dans Resend pour pouvoir envoyer depuis
      contact@bridgeinvestmentpartners.net (`EMAIL_FROM`).
- [ ] Comptes et clés : **Resend**, **Cloudflare Turnstile**, **Google Analytics 4**, **Meta Pixel**.

## 4. Contenus

- [ ] **Chiffres clés** de la page d'accueil (3 emplacements) — `app/page.tsx`, section « Chiffres clés ».
- [ ] **Références d'opérations** (tombstones), avec l'accord écrit des clients — `config/references.ts`.
- [ ] **Équipe** : photo, nom, fonction, parcours, certifications et lien LinkedIn de chaque membre (dont M. ATTEMENE Zatri
      Jean-Jacques, gérant) — `app/a-propos/page.tsx`, tableau `equipe`. Les photos vont dans `public/equipe/`.
- [ ] **Histoire détaillée** de BIP — `app/a-propos/page.tsx`.
- [x] **Durées indicatives** des 10 étapes du processus (fournies le 30/09/2026 ; durée totale 6 à 12 mois).
- [ ] Relire les **réponses de la FAQ** et les **3 articles** de départ.

## 5. Photos — `config/images.ts`

Le réseau de développement ne permettait pas d'accéder à Unsplash : des visuels neutres s'affichent en attendant.
À fournir ou à choisir (libres de droits, avec crédit) :

- [ ] `accueil` — vue d'Abidjan (Plateau, quartier d'affaires)
- [ ] `ceder` — réunion d'affaires dans un bureau
- [ ] `investir` — Abidjan (pont, lagune Ébrié)
- [ ] `leverDesFonds` — échange autour d'un plan d'affaires
- [ ] `aPropos` — bureaux modernes

Rappel : aucune photo de personne ne doit être présentée comme membre de l'équipe ou client.

## 6. Identité visuelle

- [ ] **Logo vectoriel officiel** (SVG) et **version sur fond sombre** réalisés par le graphiste, pour remplacer
      `public/logo.png`, `public/logo-icon.png`, `app/icon.png` et `app/apple-icon.png`.

## 7. Textes juridiques

- [x] **Mentions légales** : forme juridique, capital, RCCM, compte contribuable, siège et directeur de la publication
      renseignés d'après le RCCM et la DFE fournis le 30/09/2026 (`config/site.ts`, objet `societe`).
- [x] **Lot et îlot du siège** : lot 100, îlot 101 (confirmés par BIP le 30/09/2026).
- [ ] **Confirmer l'hébergeur** (Vercel) une fois la mise en ligne décidée.
- [x] **Objet social** : BIP confirme (30/09/2026) que le conseil en fusions-acquisitions et l'évaluation d'entreprise
      relèvent de l'activité « Expertise » déclarée.
- [ ] **Politique de confidentialité** — `app/confidentialite/page.tsx` : date de mise à jour,
      e-mail pour les données personnelles (contact@bridgeinvestmentpartners.net par défaut, à remplacer si une adresse
      dédiée existe), référence de la **déclaration ou autorisation ARTCI**, **durées de
      conservation**, validation par un juriste des **transferts de données hors de Côte d'Ivoire** (Vercel, Resend,
      Cloudflare, Google, Meta).
- [ ] **Relecture par un avocat** de l'ensemble du site au regard de la réglementation **AMF-UMOA** et du cadre **OHADA**.
