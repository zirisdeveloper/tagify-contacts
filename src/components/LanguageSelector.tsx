
import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Check, Languages } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const LanguageSelector: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const handleLanguageChange = (newLanguage: "en" | "fr") => {
    setLanguage(newLanguage);
    // Show toast notification about language change
    toast.success(newLanguage === "en" ? "Language switched to English" : "Langue changée en Français");
  };

  const handleEditTranslations = () => {
    navigate("/translations");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Languages className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-background border border-border w-48">
        <DropdownMenuItem
          onClick={() => handleLanguageChange("en")}
          className={`flex items-center gap-2 ${language === "en" ? "bg-accent" : ""}`}
        >
          <span className="mr-2">🇬🇧</span>
          <span>English</span>
          {language === "en" && <Check className="h-4 w-4 ml-auto" />}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleLanguageChange("fr")}
          className={`flex items-center gap-2 ${language === "fr" ? "bg-accent" : ""}`}
        >
          <span className="mr-2">🇫🇷</span>
          <span>Français</span>
          {language === "fr" && <Check className="h-4 w-4 ml-auto" />}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleEditTranslations} className="flex items-center gap-2">
          <span>{t("modifyTranslations")}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
