
import * as React from "react"
import { cn } from "@/lib/utils"
import { isMobileDevice } from "@/utils/fileSystem/deviceDetection"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    const inputRef = React.useRef<HTMLInputElement | null>(null);
    const isAndroid = React.useMemo(() => 
      /Android/.test(navigator.userAgent), 
      []
    );
    
    // Combine the provided ref with our internal ref
    React.useImperativeHandle(ref, () => inputRef.current!);

    // For Android: ensure visibility and focus retention
    React.useEffect(() => {
      if (isAndroid && inputRef.current) {
        const input = inputRef.current;
        
        const handleFocus = () => {
          // Force redraw to ensure caret visibility
          input.style.opacity = '0.99';
          setTimeout(() => {
            input.style.opacity = '1';
          }, 0);
        };
        
        input.addEventListener('focus', handleFocus);
        return () => input.removeEventListener('focus', handleFocus);
      }
    }, [isAndroid]);

    const handleTap = React.useCallback((e: React.MouseEvent) => {
      if (isAndroid && inputRef.current) {
        // Ensure input gets and retains focus
        e.preventDefault();
        inputRef.current.focus();
      }
    }, [isAndroid]);

    return (
      <input
        ref={inputRef}
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          isAndroid && "caret-current android-input",
          className
        )}
        autoComplete="off"
        enterKeyHint="done"
        spellCheck="false"
        onClick={handleTap}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
