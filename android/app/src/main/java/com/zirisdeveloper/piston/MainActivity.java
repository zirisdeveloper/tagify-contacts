
package com.zirisdeveloper.piston;

import com.getcapacitor.BridgeActivity;
import android.os.Bundle;
import android.webkit.WebSettings;
import android.webkit.WebView;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // Configure WebView for better keyboard handling
        WebView webView = getBridge().getWebView();
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        
        // These settings can help with input rendering
        webView.setLayerType(WebView.LAYER_TYPE_HARDWARE, null);
        
        // Ensure the WebView has focus when keyboard is shown
        webView.requestFocus();
    }
}
