/**
 * Application Android (APK) proposée en téléchargement sur /application.
 * Après chaque nouvelle construction (android/build.sh), copier l'APK dans
 * public/telechargements/ et mettre à jour ces informations.
 */
export const applicationAndroid = {
  fichier: "/telechargements/bip-corporate-finance.apk",
  version: "1.0.0",
  taille: "140 Ko",
  androidMinimum: "Android 7",
  /** Empreinte SHA-256 du fichier APK, pour vérifier son intégrité. */
  sha256: "b5f4db2cd8d20bfa1fbcf1692b490279bdf35e686f2d1996b3fdea2798bf1586",
};
