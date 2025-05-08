
package com.zirisdeveloper.piston;

import com.getcapacitor.BridgeActivity;
import android.os.Bundle;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.view.WindowManager;
import android.view.View;
import android.content.res.Configuration;
import android.graphics.Color;
import android.view.inputmethod.EditorInfo;
import android.view.inputmethod.InputMethodManager;
import android.content.Context;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // Configure WebView for better keyboard handling
        WebView webView = getBridge().getWebView();
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        
        // Force hardware acceleration for better rendering
        webView.setLayerType(View.LAYER_TYPE_HARDWARE, null);
        
        // Critical for text input visibility - ADJUST_RESIZE ensures keyboard doesn't cover inputs
        getWindow().setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_ADJUST_RESIZE);
        
        // Force WebView to keep focus when keyboard is shown
        webView.setFocusable(true);
        webView.setFocusableInTouchMode(true);
        webView.requestFocus();
        
        // Enhanced text rendering settings
        settings.setTextZoom(100);
        webView.setBackgroundColor(Color.WHITE);
        
        // Additional advanced settings for better text input
        settings.setAllowContentAccess(true);
        settings.setAllowFileAccess(true);
        settings.setMediaPlaybackRequiresUserGesture(false);
        settings.setJavaScriptCanOpenWindowsAutomatically(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        
        // Critical for input handling
        settings.setSupportMultipleWindows(true);
        settings.setUseWideViewPort(true);
        settings.setLoadWithOverviewMode(true);
        settings.setBuiltInZoomControls(false);
        settings.setSupportZoom(false);
        
        // Use a standard user agent to ensure proper rendering
        settings.setUserAgentString(null);
    }
    
    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        super.onConfigurationChanged(newConfig);
        
        // Re-focus WebView when configuration changes (like keyboard visibility)
        final WebView webView = getBridge().getWebView();
        webView.post(() -> {
            webView.requestFocus();
        });
    }
    
    @Override
    public void onResume() {
        super.onResume();
        
        // Re-focus WebView when activity resumes
        final WebView webView = getBridge().getWebView();
        webView.post(() -> {
            webView.requestFocus();
        });
        
        // Reset input mode
        getWindow().setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_ADJUST_RESIZE);
    }
    
    @Override
    public void onPause() {
        super.onPause();
        
        // Hide keyboard when app is paused
        InputMethodManager imm = (InputMethodManager) getSystemService(Context.INPUT_METHOD_SERVICE);
        View view = getCurrentFocus();
        if (view != null && imm != null) {
            imm.hideSoftInputFromWindow(view.getWindowToken(), 0);
        }
    }
}
