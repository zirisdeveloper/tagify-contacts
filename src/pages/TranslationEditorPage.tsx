
import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Save } from "lucide-react";

const TranslationEditorPage: React.FC = () => {
  const { t, translations, updateTranslations } = useLanguage();
  const [editableTranslations, setEditableTranslations] = useState<typeof translations>({} as typeof translations);
  const [activeLanguage, setActiveLanguage] = useState<"en" | "fr">("en");
  
  useEffect(() => {
    // Deep clone the translations to make them editable
    setEditableTranslations(JSON.parse(JSON.stringify(translations)));
  }, [translations]);

  const handleSaveTranslations = () => {
    updateTranslations(editableTranslations);
    toast.success("Your translation changes have been saved successfully.");
  };

  const handleInputChange = (key: string, value: string) => {
    setEditableTranslations(prev => ({
      ...prev,
      [activeLanguage]: {
        ...prev[activeLanguage],
        [key]: value
      }
    }));
  };

  const handleExportTranslations = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(editableTranslations, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "translations.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleImportTranslations = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    const file = event.target.files?.[0];
    
    if (!file) return;
    
    fileReader.readAsText(file, "UTF-8");
    fileReader.onload = e => {
      try {
        const content = e.target?.result as string;
        const parsed = JSON.parse(content);
        
        if (parsed.en && parsed.fr) {
          setEditableTranslations(parsed);
          toast.success("Your translation file has been successfully imported.");
        } else {
          throw new Error("Invalid translation format");
        }
      } catch (error) {
        toast.error("The file format is invalid. Please use a proper translation JSON file.");
      }
    };
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header 
        title={t("modifyTranslations")} 
        showBackButton={true}
        rightElement={
          <Button onClick={handleSaveTranslations} size="sm" className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            {t("save")}
          </Button>
        }
      />

      <div className="p-4 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <Tabs 
            defaultValue="en" 
            value={activeLanguage}
            onValueChange={(value) => setActiveLanguage(value as "en" | "fr")}
            className="w-full"
          >
            <TabsList className="mb-4">
              <TabsTrigger value="en" className="flex items-center gap-2">
                <span>🇬🇧</span> English
              </TabsTrigger>
              <TabsTrigger value="fr" className="flex items-center gap-2">
                <span>🇫🇷</span> Français
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex items-center gap-2">
            <Button onClick={handleExportTranslations} variant="outline" size="sm">
              Export
            </Button>
            <div className="relative">
              <Input
                type="file"
                accept=".json"
                id="importTranslations"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleImportTranslations}
              />
              <Button variant="outline" size="sm">
                Import
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-4 mt-4">
          {editableTranslations[activeLanguage] && Object.entries(editableTranslations[activeLanguage]).map(([key, value]) => (
            <div key={key} className="flex flex-col gap-1">
              <label htmlFor={key} className="text-sm font-medium">
                {key}
              </label>
              <Input
                id={key}
                value={value as string}
                onChange={(e) => handleInputChange(key, e.target.value)}
                className="w-full"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TranslationEditorPage;
