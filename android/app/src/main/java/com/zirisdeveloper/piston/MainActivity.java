
package com.zirisdeveloper.piston;

import com.getcapacitor.BridgeActivity;
import android.os.Bundle;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.view.WindowManager;
import android.view.View;
import android.content.res.Configuration;

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
        
        // Critical for text input visibility
        getWindow().setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_ADJUST_RESIZE);
        
        // Ensure the WebView has focus when keyboard is shown
        webView.requestFocus();
        
        // Force text rendering to be visible with keyboard
        settings.setTextZoom(100);
        webView.setTextDirection(View.TEXT_DIRECTION_INHERIT);
        
        // Additional settings to prevent rendering issues
        settings.setAllowContentAccess(true);
        settings.setAllowFileAccess(true);
        settings.setMediaPlaybackRequiresUserGesture(false);
        
        // Force the default user agent
        settings.setUserAgentString("Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36");
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
    }
}
