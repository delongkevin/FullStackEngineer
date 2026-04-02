package com.portfolio.medicaliot

import android.annotation.SuppressLint
import android.content.Intent
import android.os.Bundle
import android.webkit.WebResourceError
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView
    private val primaryUrl = "https://fullstackengineer.netlify.app/projects/dornerworks-iot/index.html"
    private val fallbackUrl = "https://fullstackengineer.netlify.app/projects/dornerworks-iot/"
    private val offlinePageUrl = "file:///android_asset/offline.html"
    private val trustedHost = "fullstackengineer.netlify.app"
    private var triedFallback = false
    private var loadedOfflinePage = false

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        webView = findViewById(R.id.webview)
        webView.settings.javaScriptEnabled = true
        webView.settings.domStorageEnabled = true
        webView.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(view: WebView, request: WebResourceRequest): Boolean {
                val uri = request.url ?: return true
                // Allow navigation within the trusted host
                if (uri.host.equals(trustedHost, ignoreCase = true)) {
                    return false
                }
                // Open external http/https URLs in the system browser
                val scheme = uri.scheme?.lowercase()
                if (scheme == "http" || scheme == "https") {
                    startActivity(Intent(Intent.ACTION_VIEW, uri))
                }
                // Block all other schemes (intent:, tel:, etc.)
                return true
            }

            override fun onReceivedHttpError(
                view: WebView,
                request: WebResourceRequest,
                errorResponse: WebResourceResponse
            ) {
                super.onReceivedHttpError(view, request, errorResponse)
                if (request.isForMainFrame && errorResponse.statusCode >= 400) {
                    loadFallbackOrOffline(view, request.url?.toString())
                }
            }

            override fun onReceivedError(
                view: WebView,
                request: WebResourceRequest,
                error: WebResourceError
            ) {
                super.onReceivedError(view, request, error)
                if (request.isForMainFrame) {
                    loadFallbackOrOffline(view, request.url?.toString())
                }
            }

            override fun onPageFinished(view: WebView, url: String?) {
                super.onPageFinished(view, url)
                if (url.equals(primaryUrl, ignoreCase = true) || url.equals(fallbackUrl, ignoreCase = true)) {
                    // Successful load: reset fallback flags so a future failure retries correctly
                    triedFallback = false
                    loadedOfflinePage = false
                }
            }

            private fun loadFallbackOrOffline(view: WebView, failingUrl: String?) {
                if (!triedFallback && !failingUrl.equals(fallbackUrl, ignoreCase = true)) {
                    triedFallback = true
                    view.loadUrl(fallbackUrl)
                    return
                }
                if (!loadedOfflinePage) {
                    loadedOfflinePage = true
                    view.loadUrl(offlinePageUrl)
                }
            }
        }
        webView.loadUrl(primaryUrl)
    }

    @Deprecated("Deprecated in Java")
    override fun onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack()
        } else {
            @Suppress("DEPRECATION")
            super.onBackPressed()
        }
    }
}
