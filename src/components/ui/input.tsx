
import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
<<<<<<< HEAD
<<<<<<< HEAD
=======
=======
>>>>>>> 6aa8ed567ffdb25705b7a2ec21b3f8c70ba9c848
    const inputRef = React.useRef<HTMLInputElement | null>(null);
    
    // Combine the provided ref with our internal ref
    React.useImperativeHandle(ref, () => inputRef.current!);
    
    // Add an input event listener to force rerender when text is entered
    React.useEffect(() => {
      const input = inputRef.current;
      if (!input) return;
      
      const forceUpdate = () => {
        // Force Android WebView to refresh the input display
        const cursorPosition = input.selectionStart || 0;
        
        // Stronger redraw forcing on Android
        if (/Android/.test(navigator.userAgent)) {
          // Apply multiple style changes to force redraw
          input.style.opacity = '0.99';
          input.style.transform = 'translateZ(0)';
          
          setTimeout(() => {
            input.style.opacity = '';
            input.style.transform = '';
            input.focus();
            try {
              input.setSelectionRange(cursorPosition, cursorPosition);
            } catch (e) {
              console.error('Error setting selection range:', e);
            }
          }, 0);
        }
      };
      
      // Handle focus events more aggressively
      const handleFocus = () => {
        if (/Android/.test(navigator.userAgent)) {
          // Ensure the element is properly receiving focus
          setTimeout(() => {
            input.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 300);
        }
      };
      
      input.addEventListener('input', forceUpdate);
      input.addEventListener('focus', handleFocus);
      
      return () => {
        input.removeEventListener('input', forceUpdate);
        input.removeEventListener('focus', handleFocus);
      };
    }, []);

<<<<<<< HEAD
>>>>>>> 6aa8ed5... Fix Android keyboard visibility issue
=======
>>>>>>> 6aa8ed567ffdb25705b7a2ec21b3f8c70ba9c848
    return (
      <input
        ref={inputRef}
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
<<<<<<< HEAD
<<<<<<< HEAD
=======
=======
>>>>>>> 6aa8ed567ffdb25705b7a2ec21b3f8c70ba9c848
          // Enhanced fixes for Android WebView visibility issue
          /Android/.test(navigator.userAgent) 
            ? "will-change-transform translate-z-0 backface-visibility-visible" 
            : "",
<<<<<<< HEAD
>>>>>>> 6aa8ed5... Fix Android keyboard visibility issue
=======
>>>>>>> 6aa8ed567ffdb25705b7a2ec21b3f8c70ba9c848
          className
        )}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
