
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useContacts } from "@/context/ContactContext";
import { useLanguage } from "@/context/LanguageContext";
import { toast } from "sonner";
import ServiceSearchBar from "@/components/ServiceSearchBar";
import HomeHeader from "@/components/HomeHeader";
import SearchResults from "@/components/SearchResults";
import AboutDialog from "@/components/AboutDialog";
import { useRef } from "react";
import { handleFileChange, handleImportClick } from "@/utils/importHandlers";

const removeAccents = (str: string): string => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

const HomePage: React.FC = () => {
  const { contacts, addContact } = useContacts();
  const { t } = useLanguage();
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const [aboutDialogOpen, setAboutDialogOpen] = useState(false);

  // Effect to update filtered contacts when search query or contacts change
  useEffect(() => {
    if (searchQuery.trim()) {
      const normalizedQuery = removeAccents(searchQuery.toLowerCase());

      setFilteredContacts(
        contacts.filter((contact) =>
          contact.tags.some((tag) => {
            const normalizedTag = removeAccents(tag.name.toLowerCase());
            return normalizedTag.includes(normalizedQuery);
          })
        )
      );
    } else {
      setFilteredContacts([]);
    }
  }, [searchQuery, contacts]);

  // Search handler
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Navigation handlers
  const handleAddContact = () => {
    navigate("/add-contact");
  };

  const handleSearchContact = () => {
    navigate("/search");
  };

  const handleHome = () => {
    setSearchQuery("");
    const searchInput = document.querySelector(
      'input[type="search"]'
    ) as HTMLInputElement;
    if (searchInput) {
      searchInput.value = "";
    }
  };

  const navigateToParameters = () => {
    navigate('/parameters');
  };

  // Dialog handlers
  const handleAboutClick = () => {
    setAboutDialogOpen(true);
  };

  // Export/Import handlers
  const handleExportContacts = async () => {
    const { exportJsonToFile } = await import('@/utils/fileSystem');
    if (contacts.length === 0) {
      toast.error(t("noContactsToExport"));
      return;
    }

    const dataToExport = {
      contacts: contacts,
      exportDate: new Date().toISOString(),
    };

    const filename = `piston-contacts-${
      new Date().toISOString().split("T")[0]
    }.json`;

    await exportJsonToFile(
      dataToExport,
      filename,
      `${contacts.length} ${t("contactsExported")}`,
      t("exportError") || "Export failed"
    );
  };

  // File import handler using the imported utility function
  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFileChange(event, fileInputRef, addContact, t);
  };

  // Import click handler using the imported utility function
  const handleImportButtonClick = async () => {
    await handleImportClick(fileInputRef);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <input
        type="file"
        ref={fileInputRef}
        accept="*/*"
        onChange={handleFileInputChange}
        className="hidden"
      />
      
      <HomeHeader
        isHomePage={isHomePage}
        handleHome={handleHome}
        handleAddContact={handleAddContact}
        handleSearchContact={handleSearchContact}
        handleExportContacts={handleExportContacts}
        handleImportClick={handleImportButtonClick}
        navigateToParameters={navigateToParameters}
        handleAboutClick={handleAboutClick}
      />

      <div className="px-4 py-3">
        <ServiceSearchBar
          placeholder={t("searchByServiceOrTag")}
          onSearch={handleSearch}
          autoFocus
        />
      </div>

      <div className="flex-1 p-4">
        <SearchResults
          searchQuery={searchQuery}
          filteredContacts={filteredContacts}
          handleAddContact={handleAddContact}
          contacts={contacts}
        />
      </div>

      <AboutDialog 
        open={aboutDialogOpen} 
        onOpenChange={setAboutDialogOpen} 
      />
    </div>
  );
};

export default HomePage;
