
import React from "react";
import {
  User,
  Search as SearchIcon,
  Import,
  FileText,
  Settings,
  Info,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface MainMenuProps {
  onAddContact: () => void;
  onSearchContact: () => void;
  onExportContacts: () => void;
  onImportClick: () => void;
  onNavigateToParameters: () => void;
  onAboutClick: () => void;
}

const MainMenu: React.FC<MainMenuProps> = ({
  onAddContact,
  onSearchContact,
  onExportContacts,
  onImportClick,
  onNavigateToParameters,
  onAboutClick,
}) => {
  const { t } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="default"
          size="icon"
          className="rounded-full h-10 w-10 shadow-sm"
          aria-label={t("menu")}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="bg-popover border border-border"
      >
        <DropdownMenuItem onClick={onAddContact}>
          <User className="h-4 w-4 mr-2" />
          {t("newContact")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onSearchContact}>
          <SearchIcon className="h-4 w-4 mr-2" />
          {t("searchContacts")}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onExportContacts}>
          <FileText className="h-4 w-4 mr-2" />
          {t("exportContacts")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onImportClick}>
          <Import className="h-4 w-4 mr-2" />
          {t("importContacts")}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onNavigateToParameters}>
          <Settings className="h-4 w-4 mr-2" />
          {t("parameters")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onAboutClick}>
          <Info className="h-4 w-4 mr-2" />
          {t("about")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MainMenu;
