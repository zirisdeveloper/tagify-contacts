
import React from "react";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import MainMenu from "@/components/MainMenu";
import { useLanguage } from "@/context/LanguageContext";

interface HomeHeaderProps {
  isHomePage: boolean;
  handleHome: () => void;
  handleAddContact: () => void;
  handleSearchContact: () => void;
  handleExportContacts: () => void;
  handleImportClick: () => void;
  navigateToParameters: () => void;
  handleAboutClick: () => void;
}

const HomeHeader: React.FC<HomeHeaderProps> = ({
  isHomePage,
  handleHome,
  handleAddContact,
  handleSearchContact,
  handleExportContacts,
  handleImportClick,
  navigateToParameters,
  handleAboutClick,
}) => {
  const { t, language } = useLanguage();

  const getAppTitle = () => {
    return language === "en" ? "Backdoor" : "Piston";
  };

  return (
    <Header
      title={getAppTitle()}
      centerTitle={true}
      leftElement={
        !isHomePage && (
          <Button
            variant="default"
            size="icon"
            className="rounded-full h-10 w-10 shadow-sm"
            onClick={handleHome}
            aria-label={t("home")}
          >
            <Home className="h-5 w-5" />
          </Button>
        )
      }
      rightElement={
        <MainMenu
          onAddContact={handleAddContact}
          onSearchContact={handleSearchContact}
          onExportContacts={handleExportContacts}
          onImportClick={handleImportClick}
          onNavigateToParameters={navigateToParameters}
          onAboutClick={handleAboutClick}
        />
      }
    />
  );
};

export default HomeHeader;
