/*
 * Service worker de l'application BIP Corporate Finance.
 * - Pages : réseau d'abord, copie en cache, page « hors connexion » en dernier recours.
 * - Fichiers statiques Next.js (noms uniques) : cache d'abord.
 * - Images et icônes : cache, mis à jour en arrière-plan.
 * - Formulaires et API : jamais mis en cache (aucune donnée saisie n'est stockée ici).
 */
const VERSION = "bip-v1";
const CACHE_PAGES = `${VERSION}-pages`;
const CACHE_STATIQUE = `${VERSION}-statique`;
const CACHE_IMAGES = `${VERSION}-images`;
const HORS_LIGNE = "/hors-ligne";
const A_PRECHARGER = [HORS_LIGNE, "/", "/simulateur", "/score-cession", "/contact"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_PAGES)
      .then((cache) => cache.addAll(A_PRECHARGER))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cles) => Promise.all(cles.filter((c) => !c.startsWith(VERSION)).map((c) => caches.delete(c))))
      .then(() => self.clients.claim()),
  );
});

function mettreEnCache(nom, requete, reponse) {
  if (reponse && reponse.ok && reponse.type === "basic") {
    const copie = reponse.clone();
    caches.open(nom).then((cache) => cache.put(requete, copie));
  }
  return reponse;
}

self.addEventListener("fetch", (event) => {
  const requete = event.request;
  if (requete.method !== "GET") return;
  const url = new URL(requete.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/telechargements/")) return;
  // Données de navigation interne de Next.js : laissées au réseau.
  if (url.searchParams.has("_rsc") || requete.headers.get("RSC") === "1") return;

  // Pages : réseau d'abord.
  if (requete.mode === "navigate") {
    event.respondWith(
      fetch(requete)
        .then((reponse) => mettreEnCache(CACHE_PAGES, requete, reponse))
        .catch(async () => {
          const enCache = await caches.match(requete, { ignoreSearch: true });
          return enCache || caches.match(HORS_LIGNE);
        }),
    );
    return;
  }

  // Fichiers statiques versionnés : cache d'abord.
  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(
      caches.match(requete).then((enCache) => enCache || fetch(requete).then((r) => mettreEnCache(CACHE_STATIQUE, requete, r))),
    );
    return;
  }

  // Images, icônes, logos : cache puis mise à jour en arrière-plan.
  if (
    url.pathname.startsWith("/_next/image") ||
    url.pathname.startsWith("/images/") ||
    url.pathname.startsWith("/icons/") ||
    url.pathname.startsWith("/equipe/") ||
    /\.(png|webp|jpg|svg|ico)$/.test(url.pathname)
  ) {
    event.respondWith(
      caches.match(requete).then((enCache) => {
        const reseau = fetch(requete)
          .then((r) => mettreEnCache(CACHE_IMAGES, requete, r))
          .catch(() => enCache);
        return enCache || reseau;
      }),
    );
  }
});
