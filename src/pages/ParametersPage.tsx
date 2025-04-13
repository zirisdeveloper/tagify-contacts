
import React, { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import Header from "@/components/Header";
import { Directory } from '@capacitor/filesystem';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

// Available storage locations for file exports
const storageOptions = [
  { name: 'Documents', directory: Directory.Documents, key: 'documents' },
  { name: 'External Storage', directory: Directory.External, key: 'external' },
  { name: 'Cache Directory', directory: Directory.Cache, key: 'cache' },
  { name: 'Data Directory', directory: Directory.Data, key: 'data' }
];

const ParametersPage: React.FC = () => {
  const { t } = useLanguage();
  const [selectedStorage, setSelectedStorage] = useState<string>('documents');

  // Load the saved storage preference
  useEffect(() => {
    const loadStoragePreference = () => {
      const savedPreference = localStorage.getItem('preferredStorageLocation');
      if (savedPreference) {
        setSelectedStorage(savedPreference);
      }
    };
    
    loadStoragePreference();
  }, []);

  // Save storage preference
  const handleStorageChange = (value: string) => {
    setSelectedStorage(value);
    localStorage.setItem('preferredStorageLocation', value);
    
    // Find the name of the selected storage for the toast message
    const selectedOption = storageOptions.find(option => option.key === value);
    toast.success(t("storageSaved", { storage: selectedOption?.name || '' }));
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header
        title={t("parameters")}
        showBackButton
        className="sticky top-0 z-10"
      />

      <div className="flex-1 p-4 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("storageSettings")}</CardTitle>
            <CardDescription>{t("chooseDefaultStorage")}</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup 
              value={selectedStorage} 
              onValueChange={handleStorageChange}
              className="space-y-3"
            >
              {storageOptions.map((option) => (
                <div key={option.key} className="flex items-center justify-between space-x-2 border p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={option.key} id={option.key} />
                    <Label htmlFor={option.key} className="text-base font-medium cursor-pointer">
                      {option.name}
                    </Label>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ParametersPage;
