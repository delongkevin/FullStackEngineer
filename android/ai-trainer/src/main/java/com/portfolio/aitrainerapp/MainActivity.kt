package com.portfolio.aitrainerapp

import android.annotation.SuppressLint
import android.os.Bundle
import android.webkit.WebResourceError
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView
    private val primaryUrl = "https://fullstackengineer.netlify.app/projects/ai-trainer/index.html"
    private val fallbackUrl = "https://fullstackengineer.netlify.app/projects/ai-trainer/"
    private val offlinePageUrl = "file:///android_asset/offline.html"
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
                return false
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
