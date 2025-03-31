
import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { FlagTriangleLeft, FlagTriangleRight } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          {language === "en" ? (
            <FlagTriangleRight className="h-5 w-5 text-blue-600" />
          ) : (
            <FlagTriangleRight className="h-5 w-5 text-blue-900" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-background border border-border">
        <DropdownMenuItem
          onClick={() => setLanguage("en")}
          className={`flex items-center gap-2 ${language === "en" ? "bg-accent" : ""}`}
        >
          <FlagTriangleRight className="h-4 w-4 text-blue-600" />
          <span>English</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setLanguage("fr")}
          className={`flex items-center gap-2 ${language === "fr" ? "bg-accent" : ""}`}
        >
          <FlagTriangleLeft className="h-4 w-4 text-blue-900" />
          <span>Français</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
