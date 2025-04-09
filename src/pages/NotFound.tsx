
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import AppIconSvg from "@/components/AppIconSvg";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  // Force re-render when language changes
  useEffect(() => {
    const handleLanguageChange = () => {
      // This will force the component to re-evaluate translations
      console.log("Language changed, re-rendering NotFound page");
    };
    
    window.addEventListener('languageChanged', handleLanguageChange);
    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange);
    };
  }, []);

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <div className="text-center max-w-md mx-auto animate-fade-in">
        <div className="mb-6">
          <div className="w-24 h-24 mx-auto">
            <AppIconSvg className="w-full h-full" />
          </div>
        </div>
        <h1 className="text-7xl font-bold mb-4 text-primary">404</h1>
        <p className="text-xl text-foreground mb-6">{t("pageNotFound")}</p>
        <p className="text-muted-foreground mb-8">
          {t("pageNotFoundDescription")}
        </p>
        <Button 
          onClick={() => navigate("/")} 
          className="gap-2"
        >
          <Home className="h-4 w-4" />
          {t("returnHome")}
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
