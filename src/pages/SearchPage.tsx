
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Search as SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useContacts } from "@/context/ContactContext";
import { useLanguage } from "@/context/LanguageContext";
import ContactSearchBar from "@/components/ContactSearchBar";
import ContactCard from "@/components/ContactCard";
import EmptyState from "@/components/EmptyState";
import Header from "@/components/Header";
import { Contact } from "@/types";
import { removeAccents } from "@/utils/contactUtils";

const SearchPage: React.FC = () => {
  const { contacts } = useContacts();
  const { t } = useLanguage();
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Initialize filteredContacts with all contacts on mount
  useEffect(() => {
    setFilteredContacts(contacts);
  }, [contacts]);

  useEffect(() => {
    if (searchQuery.trim()) {
      // Search by name with accent insensitivity
      const normalizedQuery = removeAccents(searchQuery.toLowerCase());
      
      const filtered = contacts.filter((contact) => {
        const normalizedName = removeAccents(`${contact.name} ${contact.familyName || ""}`.toLowerCase());
        return normalizedName.includes(normalizedQuery);
      });
      
      setFilteredContacts(filtered);
    } else {
      // Show all contacts when search is empty
      setFilteredContacts(contacts);
    }
  }, [searchQuery, contacts]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleAddContact = () => {
    navigate("/add-contact");
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header 
        title={t("searchContacts")} 
        showBackButton={true}
      />

      <div className="px-4 py-3">
        <ContactSearchBar 
          placeholder={t("searchContactsByName")}
          onSearch={handleSearch}
          autoFocus
        />
      </div>

      <div className="flex-1 p-4">
        {contacts.length === 0 ? (
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
        ) : filteredContacts.length > 0 ? (
          <div className="space-y-3 animate-fade-in">
            {searchQuery.trim() && (
              <p className="text-sm text-muted-foreground">
                {filteredContacts.length} {filteredContacts.length === 1 
                  ? t("contactFound") 
                  : t("contactsFound")} 
                {searchQuery && ` "${searchQuery}"`}
              </p>
            )}
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
            description={`${t("noContactsWithName")} "${searchQuery}" ${t("wereFound")}.`}
            action={
              <Button onClick={handleAddContact} className="gap-2">
                <User className="h-4 w-4" />
                {t("addContact")}
              </Button>
            }
          />
        )}
      </div>
    </div>
  );
};

export default SearchPage;
