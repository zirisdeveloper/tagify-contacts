
import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    const inputRef = React.useRef<HTMLInputElement | null>(null);
    
    // Combine the provided ref with our internal ref
    React.useImperativeHandle(ref, () => inputRef.current!);
    
    // Add an input event listener to force rerender when text is entered
    React.useEffect(() => {
      const input = inputRef.current;
      if (!input) return;
      
      const forceUpdate = () => {
        // Force Android WebView to refresh the input display
        const currentValue = input.value;
        const cursorPosition = input.selectionStart;
        
        // On Android, triggering a style change can force a redraw
        if (/Android/.test(navigator.userAgent)) {
          input.style.textShadow = '0 0 0 transparent';
          setTimeout(() => {
            input.style.textShadow = '';
            input.setSelectionRange(cursorPosition, cursorPosition);
          }, 0);
        }
      };
      
      input.addEventListener('input', forceUpdate);
      return () => {
        input.removeEventListener('input', forceUpdate);
      };
    }, []);

    return (
      <input
        ref={inputRef}
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          // Fix for Android WebView visibility issue
          /Android/.test(navigator.userAgent) ? "will-change-transform" : "",
          className
        )}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
