
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
        const cursorPosition = textarea.selectionStart;
        
        // On Android, triggering a style change can force a redraw
        if (/Android/.test(navigator.userAgent)) {
          textarea.style.textShadow = '0 0 0 transparent';
          setTimeout(() => {
            textarea.style.textShadow = '';
            textarea.setSelectionRange(cursorPosition, cursorPosition);
          }, 0);
        }
      };
      
      textarea.addEventListener('input', forceUpdate);
      return () => {
        textarea.removeEventListener('input', forceUpdate);
      };
    }, []);

    return (
      <textarea
        ref={textareaRef}
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          // Fix for Android WebView visibility issue
          /Android/.test(navigator.userAgent) ? "will-change-transform" : "",
          className
        )}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
