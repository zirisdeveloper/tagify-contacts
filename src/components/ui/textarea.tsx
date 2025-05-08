
import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);
    const isAndroid = React.useMemo(() => 
      /Android/.test(navigator.userAgent), 
      []
    );
    
    // Combine the provided ref with our internal ref
    React.useImperativeHandle(ref, () => textareaRef.current!);

    // For Android: ensure visibility and focus retention
    React.useEffect(() => {
      if (isAndroid && textareaRef.current) {
        const textarea = textareaRef.current;
        
        const handleFocus = () => {
          // Force redraw to ensure caret visibility
          textarea.style.opacity = '0.99';
          setTimeout(() => {
            textarea.style.opacity = '1';
            
            // Center textarea in viewport when keyboard opens
            if (typeof textarea.scrollIntoView === 'function') {
              textarea.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }, 0);
        };
        
        // Force text to display while typing
        const handleInput = () => {
          textarea.style.opacity = '0.99';
          setTimeout(() => textarea.style.opacity = '1', 0);
        };
        
        textarea.addEventListener('focus', handleFocus);
        textarea.addEventListener('input', handleInput);
        
        return () => {
          textarea.removeEventListener('focus', handleFocus);
          textarea.removeEventListener('input', handleInput);
        };
      }
    }, [isAndroid]);

    const handleTap = React.useCallback((e: React.MouseEvent) => {
      if (isAndroid && textareaRef.current) {
        // Ensure textarea gets and retains focus
        e.preventDefault();
        textareaRef.current.focus();
      }
    }, [isAndroid]);

    return (
      <textarea
        ref={textareaRef}
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          isAndroid && "caret-current android-textarea",
          className
        )}
        autoComplete="off"
        spellCheck="false"
        onClick={handleTap}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
