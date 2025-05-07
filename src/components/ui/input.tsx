
import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    const inputRef = React.useRef<HTMLInputElement | null>(null);
    
    // Combine the provided ref with our internal ref
    React.useImperativeHandle(ref, () => inputRef.current!);
    
    // Force input visibility on Android
    React.useEffect(() => {
      const input = inputRef.current;
      if (!input) return;
      
      const forceInputVisibility = () => {
        if (/Android/.test(navigator.userAgent)) {
          // Force redraw by toggling multiple properties
          input.style.opacity = '0.99';
          input.style.transform = 'translateZ(0)';
          
          setTimeout(() => {
            input.style.opacity = '';
            input.style.transform = '';
            
            try {
              // Force cursor visibility
              const cursorPosition = input.selectionStart || input.value.length;
              input.setSelectionRange(cursorPosition, cursorPosition);
            } catch (e) {
              console.error('Error setting selection range:', e);
            }
          }, 0);
        }
      };
      
      const handleChange = () => {
        if (/Android/.test(navigator.userAgent)) {
          forceInputVisibility();
          
          // Double refresh for stubborn browsers
          setTimeout(forceInputVisibility, 50);
        }
      };
      
      const handleFocus = () => {
        if (/Android/.test(navigator.userAgent)) {
          // Ensure the element is visible when focused
          input.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setTimeout(forceInputVisibility, 100);
          setTimeout(forceInputVisibility, 300);
          setTimeout(forceInputVisibility, 500);
        }
      };
      
      input.addEventListener('input', handleChange);
      input.addEventListener('focus', handleFocus);
      input.addEventListener('click', handleFocus);
      
      return () => {
        input.removeEventListener('input', handleChange);
        input.removeEventListener('focus', handleFocus);
        input.removeEventListener('click', handleFocus);
      };
    }, []);

    return (
      <input
        ref={inputRef}
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          // Enhanced visibility fixes for Android
          /Android/.test(navigator.userAgent) 
            ? "will-change-transform will-change-opacity backface-visibility-visible user-select-text" 
            : "",
          className
        )}
        style={{
          // Force text visibility on Android
          WebkitTextFillColor: /Android/.test(navigator.userAgent) ? 'currentColor' : undefined,
          textShadow: /Android/.test(navigator.userAgent) ? '0 0 0 currentColor' : undefined,
        }}
        autoComplete="off"
        enterKeyHint="done"
        spellCheck="false"
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
