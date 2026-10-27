package net.bridgeinvestmentpartners.corporatefinance;

import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.view.View;
import android.view.Window;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

/**
 * Affiche le site BIP Corporate Finance en plein écran.
 * - Les pages du site restent dans l'application.
 * - WhatsApp, téléphone, e-mail et sites externes s'ouvrent dans l'application adaptée.
 * - Sans réseau, un écran « hors connexion » aux couleurs de BIP propose de réessayer.
 */
public class MainActivity extends Activity {

    private static final String PAGE_HORS_LIGNE = "file:///android_asset/hors-ligne.html";

    private WebView vue;
    private String urlSite;
    private String hoteSite;

    @Override
    protected void onCreate(Bundle etat) {
        super.onCreate(etat);
        urlSite = getString(R.string.url_site);
        hoteSite = Uri.parse(urlSite).getHost();

        Window fenetre = getWindow();
        fenetre.getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR);

        vue = new WebView(this);
        vue.setBackgroundColor(0xFF12131A);
        setContentView(vue);

        WebSettings reglages = vue.getSettings();
        reglages.setJavaScriptEnabled(true);
        reglages.setDomStorageEnabled(true);
        reglages.setDatabaseEnabled(true);
        reglages.setLoadWithOverviewMode(true);
        reglages.setUseWideViewPort(true);
        reglages.setSupportZoom(false);
        reglages.setMediaPlaybackRequiresUserGesture(true);
        reglages.setAllowFileAccess(false);
        reglages.setUserAgentString(reglages.getUserAgentString() + " BIPCorporateFinanceAndroid/1.0");

        vue.setWebViewClient(new ClientBIP());

        if (etat != null) {
            vue.restoreState(etat);
        } else {
            vue.loadUrl(urlSite);
        }
    }

    private final class ClientBIP extends WebViewClient {
        // Variante compatible avec toutes les versions d'Android (appelée aussi sur Android 7 et plus).
        @Override
        @SuppressWarnings("deprecation")
        public boolean shouldOverrideUrlLoading(WebView v, String url) {
            return ouvrirAilleursSiBesoin(Uri.parse(url));
        }

        @Override
        public void onReceivedError(WebView v, WebResourceRequest requete, WebResourceError erreur) {
            if (requete.isForMainFrame()) {
                v.loadUrl(PAGE_HORS_LIGNE);
            }
        }
    }

    /** Ouvre hors de l'application tout ce qui n'est pas une page du site. */
    private boolean ouvrirAilleursSiBesoin(Uri lien) {
        String schema = lien.getScheme() == null ? "" : lien.getScheme();
        boolean pageDuSite = ("https".equals(schema) || "http".equals(schema)) && hoteSite != null && hoteSite.equals(lien.getHost());
        if (pageDuSite) {
            return false;
        }
        if ("file".equals(schema) && lien.toString().startsWith("file:///android_asset/")) {
            return false;
        }
        if ("bip".equals(schema)) {
            // Bouton « Réessayer » de l'écran hors connexion.
            vue.loadUrl(urlSite);
            return true;
        }
        try {
            startActivity(new Intent(Intent.ACTION_VIEW, lien));
        } catch (ActivityNotFoundException e) {
            // Aucune application ne sait ouvrir ce lien : on ignore.
        }
        return true;
    }

    @Override
    public void onBackPressed() {
        if (vue != null && vue.canGoBack()) {
            vue.goBack();
        } else {
            super.onBackPressed();
        }
    }

    @Override
    protected void onSaveInstanceState(Bundle etat) {
        super.onSaveInstanceState(etat);
        if (vue != null) {
            vue.saveState(etat);
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (vue != null) vue.onResume();
    }

    @Override
    protected void onPause() {
        if (vue != null) vue.onPause();
        super.onPause();
    }

    @Override
    protected void onDestroy() {
        if (vue != null) {
            vue.destroy();
            vue = null;
        }
        super.onDestroy();
    }
}
