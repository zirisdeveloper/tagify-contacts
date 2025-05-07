
import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);
    
    // Combine the provided ref with our internal ref
    React.useImperativeHandle(ref, () => textareaRef.current!);
    
    // Force textarea visibility on Android
    React.useEffect(() => {
      const textarea = textareaRef.current;
      if (!textarea) return;
      
      const forceTextareaVisibility = () => {
        if (/Android/.test(navigator.userAgent)) {
          // Force redraw by toggling multiple properties
          textarea.style.opacity = '0.99';
          textarea.style.transform = 'translateZ(0)';
          
          setTimeout(() => {
            textarea.style.opacity = '';
            textarea.style.transform = '';
            
            try {
              // Force cursor visibility
              const cursorPosition = textarea.selectionStart || textarea.value.length;
              textarea.setSelectionRange(cursorPosition, cursorPosition);
            } catch (e) {
              console.error('Error setting selection range:', e);
            }
          }, 0);
        }
      };
      
      const handleChange = () => {
        if (/Android/.test(navigator.userAgent)) {
          forceTextareaVisibility();
          
          // Double refresh for stubborn browsers
          setTimeout(forceTextareaVisibility, 50);
        }
      };
      
      const handleFocus = () => {
        if (/Android/.test(navigator.userAgent)) {
          // Ensure the element is visible when focused
          textarea.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setTimeout(forceTextareaVisibility, 100);
          setTimeout(forceTextareaVisibility, 300);
          setTimeout(forceTextareaVisibility, 500);
        }
      };
      
      textarea.addEventListener('input', handleChange);
      textarea.addEventListener('focus', handleFocus);
      textarea.addEventListener('click', handleFocus);
      
      return () => {
        textarea.removeEventListener('input', handleChange);
        textarea.removeEventListener('focus', handleFocus);
        textarea.removeEventListener('click', handleFocus);
      };
    }, []);

    return (
      <textarea
        ref={textareaRef}
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          // Enhanced fixes for Android WebView visibility issue
          /Android/.test(navigator.userAgent) ? "will-change-transform will-change-opacity backface-visibility-visible user-select-text" : "",
          className
        )}
        style={{
          // Force text visibility on Android
          WebkitTextFillColor: /Android/.test(navigator.userAgent) ? 'currentColor' : undefined,
          textShadow: /Android/.test(navigator.userAgent) ? '0 0 0 currentColor' : undefined,
        }}
        autoComplete="off"
        spellCheck="false"
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
