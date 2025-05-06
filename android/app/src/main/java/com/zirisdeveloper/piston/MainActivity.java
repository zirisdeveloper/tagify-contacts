
package com.zirisdeveloper.piston;

import com.getcapacitor.BridgeActivity;
import android.os.Bundle;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.view.WindowManager;
import android.view.View;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // Configure WebView for better keyboard handling
        WebView webView = getBridge().getWebView();
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        
        // These settings help with input rendering
        webView.setLayerType(WebView.LAYER_TYPE_HARDWARE, null);
        
        // Prevent resizing when keyboard shows (prevents layout shifts)
        getWindow().setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_ADJUST_RESIZE);
        
        // Ensure the WebView has focus when keyboard is shown
        webView.requestFocus();
        
        // Set user agent to desktop mode to improve input behavior
        String defaultUserAgent = settings.getUserAgentString();
        settings.setUserAgentString(defaultUserAgent + " DesktopMode");
        
        // Force changes to be rendered
        webView.setVerticalScrollbarOverlay(true);
        webView.setHorizontalScrollbarOverlay(true);
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
