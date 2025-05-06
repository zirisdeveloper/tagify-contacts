
import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);
    
    // Combine the provided ref with our internal ref
    React.useImperativeHandle(ref, () => textareaRef.current!);
    
    // Add an input event listener to force rerender when text is entered
    React.useEffect(() => {
      const textarea = textareaRef.current;
      if (!textarea) return;
      
      const forceUpdate = () => {
        // Force Android WebView to refresh the textarea display
        const cursorPosition = textarea.selectionStart || 0;
        
        // Enhanced redraw forcing for Android
        if (/Android/.test(navigator.userAgent)) {
          textarea.style.opacity = '0.99';
          textarea.style.transform = 'translateZ(0)';
          textarea.style.textShadow = '0 0 0 transparent';
          
          setTimeout(() => {
            textarea.style.opacity = '';
            textarea.style.transform = '';
            textarea.style.textShadow = '';
            
            try {
              textarea.setSelectionRange(cursorPosition, cursorPosition);
            } catch (e) {
              console.error('Error setting selection range:', e);
            }
          }, 0);
        }
      };
      
      // Handle focus events
      const handleFocus = () => {
        if (/Android/.test(navigator.userAgent)) {
          // Ensure the element is properly receiving focus and visible
          setTimeout(() => {
            textarea.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Force the cursor to be visible
            const cursorPosition = textarea.selectionStart || textarea.value.length;
            textarea.setSelectionRange(cursorPosition, cursorPosition);
          }, 300);
        }
      };
      
      // Handle keyboard show/hide events
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible' && /Android/.test(navigator.userAgent)) {
          setTimeout(() => {
            // Reapply focus when app becomes visible
            if (document.activeElement === textarea) {
              textarea.blur();
              setTimeout(() => textarea.focus(), 50);
            }
          }, 100);
        }
      };
      
      textarea.addEventListener('input', forceUpdate);
      textarea.addEventListener('focus', handleFocus);
      document.addEventListener('visibilitychange', handleVisibilityChange);
      
      return () => {
        textarea.removeEventListener('input', forceUpdate);
        textarea.removeEventListener('focus', handleFocus);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }, []);

    return (
      <textarea
        ref={textareaRef}
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          // Enhanced fixes for Android WebView visibility issue
          /Android/.test(navigator.userAgent) ? "will-change-transform backface-visibility-visible user-select-text" : "",
          className
        )}
        autoComplete="off"
        spellCheck="false"
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
