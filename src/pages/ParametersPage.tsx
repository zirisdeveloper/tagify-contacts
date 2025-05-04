
import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import Header from "@/components/Header";
import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const ParametersPage: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const [selectedLanguage, setSelectedLanguage] = useState(language);
  const navigate = useNavigate();
  // Set theme state locally since context might not have it
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });

  useEffect(() => {
    setSelectedLanguage(language);
  }, [language]);

  const handleLanguageChange = (newLanguage: string) => {
    setSelectedLanguage(newLanguage);
  };

  useEffect(() => {
    if (selectedLanguage && selectedLanguage !== language) {
      setLanguage(selectedLanguage);
    }
  }, [selectedLanguage, language, setLanguage]);

  const handleThemeToggle = () => {
    const newTheme = isDarkMode ? 'light' : 'dark';
    setIsDarkMode(!isDarkMode);
    
    // Apply the theme to the document
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Save the theme preference
    localStorage.setItem('theme', newTheme);
  };

  const handleSaveSettings = () => {
    toast.success("Settings saved");
  };

  const handleHome = () => {
    navigate("/");
  };

  // Available languages based on the context setup
  const availableLanguages = [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'Français' },
    { code: 'ar', name: 'العربية' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header
        title="Parameters"
        centerTitle={true}
        leftElement={
          <Button
            variant="default"
            size="icon"
            className="rounded-full h-10 w-10 shadow-sm"
            onClick={handleHome}
            aria-label="home"
          >
            <Home className="h-5 w-5" />
          </Button>
        }
      />
      <div className="container py-8">
        <div className="grid gap-6">
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="language">Language</Label>
            <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
              <SelectTrigger id="language">
                <SelectValue placeholder="Select a language" />
              </SelectTrigger>
              <SelectContent>
                {availableLanguages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between rounded-md border p-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">Dark Mode</p>
              <p className="text-sm text-muted-foreground">
                Enable dark mode for a better viewing experience at night.
              </p>
            </div>
            <Switch id="dark-mode" checked={isDarkMode} onCheckedChange={handleThemeToggle} />
          </div>
          <Button onClick={handleSaveSettings}>Save settings</Button>
        </div>
      </div>
    </div>
  );
};

export default ParametersPage;
