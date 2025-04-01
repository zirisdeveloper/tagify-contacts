import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, User, Tag as TagIcon, Search as SearchIcon, Import, FileText, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useContacts } from "@/context/ContactContext";
import { useLanguage } from "@/context/LanguageContext";
import ServiceSearchBar from "@/components/ServiceSearchBar";
import ContactCard from "@/components/ContactCard";
import EmptyState from "@/components/EmptyState";
import Header from "@/components/Header";
import { Contact } from "@/types";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const HomePage: React.FC = () => {
  const { contacts, findContactsByTag, addContact } = useContacts();
  const { t, language } = useLanguage();
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  
  // Force re-render when language changes
  const [, setRenderKey] = useState(0);
  
  useEffect(() => {
    const handleLanguageChange = () => {
      setRenderKey(prev => prev + 1);
    };
    
    window.addEventListener('languageChanged', handleLanguageChange);
    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange);
    };
  }, []);
  
  useEffect(() => {
    if (searchQuery.trim()) {
      // Only search by tag/service in the home page
      setFilteredContacts(findContactsByTag(searchQuery));
    } else {
      setFilteredContacts([]);
    }
  }, [searchQuery, contacts, findContactsByTag]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleAddContact = () => {
    navigate("/add-contact");
  };

  const handleSearchContact = () => {
    navigate("/search");
    toast.info(t("typeNameToFind"));
  };

  const handleHome = () => {
    setSearchQuery("");
    const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement;
    if (searchInput) {
      searchInput.value = "";
    }
  };

  const handleExportContacts = () => {
    if (contacts.length === 0) {
      toast.error(t("noContactsToExport"));
      return;
    }

    const dataToExport = {
      contacts: contacts,
      exportDate: new Date().toISOString()
    };

    const jsonString = JSON.stringify(dataToExport, null, 2);
    
    const blob = new Blob([jsonString], { type: "application/json" });
    
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = `piston-contacts-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    toast.success(`${contacts.length} ${t("contactsExported")}`);
  };

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importedData = JSON.parse(content);
        
        if (!importedData || !importedData.contacts || !Array.isArray(importedData.contacts)) {
          throw new Error("Invalid file format");
        }
        
        const validContacts = importedData.contacts.filter((contact: any) => 
          contact && typeof contact.name === "string" && Array.isArray(contact.tags)
        );
        
        if (validContacts.length === 0) {
          throw new Error("No valid contacts found in the file");
        }
        
        let importedCount = 0;
        validContacts.forEach((contact: Omit<Contact, "id">) => {
          try {
            addContact(contact);
            importedCount++;
          } catch (error) {
            console.error("Error importing contact:", error);
          }
        });
        
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        
        toast.success(`${importedCount} contacts imported successfully`);
        
      } catch (error) {
        console.error("Import error:", error);
        toast.error(`Import failed: ${error instanceof Error ? error.message : "Invalid file format"}`);
        
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    };
    
    reader.readAsText(file);
  };

  const getAppTitle = () => {
    return language === "en" ? "Backdoor" : "Piston";
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <input
        type="file"
        ref={fileInputRef}
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
      />
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
            <DropdownMenuContent align="end" className="bg-popover border border-border">
              <DropdownMenuItem onClick={handleAddContact}>
                {t("newContact")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSearchContact}>
                {t("searchContacts")}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleExportContacts}>
                <FileText className="h-4 w-4 mr-2" />
                {t("exportContacts")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleImportClick}>
                <Import className="h-4 w-4 mr-2" />
                {t("importContacts")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        }
      />

      <div className="px-4 py-3">
        <ServiceSearchBar 
          placeholder={t("searchByServiceOrTag")}
          onSearch={handleSearch}
          autoFocus
        />
      </div>

      <div className="flex-1 p-4">
        {searchQuery.trim() ? (
          <>
            {filteredContacts.length > 0 ? (
              <div className="space-y-3 animate-fade-in">
                <p className="text-sm text-muted-foreground">
                  {filteredContacts.length} {filteredContacts.length === 1 ? t("contactFound") : t("contactsFound")} "{searchQuery}" {t("searchingServices")}
                </p>
                <div className="space-y-3">
                  {filteredContacts.map((contact) => (
                    <ContactCard key={contact.id} contact={contact} />
                  ))}
                </div>
              </div>
            ) : (
              <EmptyState
                icon={<SearchIcon className="h-12 w-12 opacity-20" />}
                title={t("noContactsFound")}
                description={`${t("noContactsWithService")} "${searchQuery}" ${t("wereFound")}.`}
                action={
                  <Button onClick={handleAddContact} className="gap-2">
                    <User className="h-4 w-4" />
                    {t("addContact")}
                  </Button>
                }
              />
            )}
          </>
        ) : contacts.length > 0 ? (
          <EmptyState
            icon={<TagIcon className="h-12 w-12 opacity-20" />}
            title={t("searchForService")}
            description={t("typeServiceOrTag")}
            className="mt-12"
          />
        ) : (
          <EmptyState
            icon={<User className="h-12 w-12 opacity-20" />}
            title={t("noContacts")}
            description={t("addYourFirstContact")}
            action={
              <Button onClick={handleAddContact} className="gap-2">
                <User className="h-4 w-4" />
                {t("addContact")}
              </Button>
            }
            className="mt-12"
          />
        )}
      </div>
    </div>
  );
};

export default HomePage;
