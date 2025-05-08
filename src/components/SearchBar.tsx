
import React, { useState, useEffect, useRef } from "react";
import { Search, X, Mic, MicOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useLanguage } from "@/context/LanguageContext";

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  className?: string;
  autoFocus?: boolean;
  type?: "contact" | "service" | "general";
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder,
  onSearch,
  className,
  autoFocus = false,
  type = "general",
}) => {
  const [query, setQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  const { language } = useLanguage();
  const isAndroid = React.useMemo(() => /Android/.test(navigator.userAgent), []);

  // Set default placeholder based on search type
  if (!placeholder) {
    switch (type) {
      case "contact":
        placeholder = "Search contacts...";
        break;
      case "service":
        placeholder = "Search services or tags...";
        break;
      default:
        placeholder = "Search...";
    }
  }

  // Function to get speech recognition language
  const getSpeechLanguage = () => {
    switch (language) {
      case 'en': return 'en-US';
      case 'fr': return 'fr-FR';
      case 'ar': return 'ar-MA';
      default: return 'en-US';
    }
  };

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  // Initialize speech recognition when component mounts or language changes
  useEffect(() => {
    // Clean up the previous recognition instance
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (e) {
        console.error("Error cleaning up speech recognition:", e);
      }
      recognitionRef.current = null;
    }

    // Initialize speech recognition if supported
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      
      // Set language based on app language
      recognitionRef.current.lang = getSpeechLanguage();

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        onSearch(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error, event);
        toast.error("Voice recognition failed. Please try again.");
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          console.error("Error cleaning up speech recognition:", e);
        }
      }
    };
  }, [onSearch, language]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  const clearSearch = () => {
    setQuery("");
    onSearch("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const toggleListening = () => {
    if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      toast.error("Speech recognition is not supported in this browser");
      return;
    }

    if (isListening) {
      try {
        if (recognitionRef.current) {
          recognitionRef.current.abort();
        }
        setIsListening(false);
      } catch (error) {
        console.error("Error stopping speech recognition:", error);
      }
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        console.error("Speech recognition error:", error);
        toast.error("Could not start voice recognition. Please check microphone permissions.");
      }
    }
  };

  return (
    <div className={cn("relative w-full", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="search"
          placeholder={placeholder}
          value={query}
          onChange={handleChange}
          className="pl-10 pr-10 h-12 rounded-xl bg-white shadow-sm border-0 transition-all focus-visible:ring-2 focus-visible:ring-primary"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {query && (
            <button 
              onClick={clearSearch}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          {('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) && (
            <button
              onClick={toggleListening}
              className={cn(
                "text-muted-foreground hover:text-foreground transition-colors ml-1",
                isListening && "text-primary hover:text-primary"
              )}
              aria-label={isListening ? "Stop voice search" : "Start voice search"}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
