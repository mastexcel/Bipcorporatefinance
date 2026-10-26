#!/usr/bin/env bash
# Construit l'APK Android de BIP Corporate Finance sans Android Studio.
# Outils (paquets Ubuntu) : aapt apksigner zipalign dalvik-exchange android-sdk-platform-23, et un JDK.
#
# Variables :
#   BIP_URL          adresse du site à ouvrir (par défaut : site officiel)
#   BIP_KEYSTORE     chemin du fichier de signature (.jks) — à conserver précieusement
#   BIP_KS_PASS      mot de passe du fichier de signature
#   BIP_KS_ALIAS     alias de la clé (par défaut : bip)
#   ANDROID_JAR      plateforme de compilation (par défaut : android-23 du paquet Ubuntu)
set -euo pipefail
cd "$(dirname "$0")"

ANDROID_JAR="${ANDROID_JAR:-/usr/lib/android-sdk/platforms/android-23/android.jar}"
BIP_KS_ALIAS="${BIP_KS_ALIAS:-bip}"
: "${BIP_KEYSTORE:?Définissez BIP_KEYSTORE (fichier .jks de signature)}"
: "${BIP_KS_PASS:?Définissez BIP_KS_PASS (mot de passe du fichier de signature)}"

rm -rf build && mkdir -p build/gen build/obj build/res
cp -r res/* build/res/
if [ -n "${BIP_URL:-}" ]; then
  sed -i "s#<string name=\"url_site\" translatable=\"false\">[^<]*</string>#<string name=\"url_site\" translatable=\"false\">${BIP_URL}</string>#" build/res/values/strings.xml
fi

echo "1/6 Ressources"
aapt package -f -m -J build/gen -M AndroidManifest.xml -S build/res -I "$ANDROID_JAR"

echo "2/6 Compilation Java"
javac -nowarn -Xlint:-options --release 8 -encoding UTF-8 -classpath "$ANDROID_JAR" -d build/obj \
  $(find src build/gen -name '*.java')

echo "3/6 Conversion Dalvik"
dalvik-exchange --dex --min-sdk-version=24 --output=build/classes.dex build/obj

echo "4/6 Paquet"
aapt package -f -M AndroidManifest.xml -S build/res -A assets -I "$ANDROID_JAR" -F build/non-signe.apk
(cd build && aapt add non-signe.apk classes.dex >/dev/null)

echo "5/6 Alignement"
zipalign -f -p 4 build/non-signe.apk build/aligne.apk

echo "6/6 Signature"
apksigner sign --ks "$BIP_KEYSTORE" --ks-key-alias "$BIP_KS_ALIAS" --ks-pass "pass:$BIP_KS_PASS" \
  --min-sdk-version 24 --out build/BIP-Corporate-Finance.apk build/aligne.apk
apksigner verify --print-certs build/BIP-Corporate-Finance.apk | head -3
echo "APK prêt : android/build/BIP-Corporate-Finance.apk"
