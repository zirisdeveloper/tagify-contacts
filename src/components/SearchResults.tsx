
import React from "react";
import { SearchIcon, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import ContactCard from "@/components/ContactCard";
import EmptyState from "@/components/EmptyState";
import { Contact } from "@/types";
import { useLanguage } from "@/context/LanguageContext";

interface SearchResultsProps {
  searchQuery: string;
  filteredContacts: Contact[];
  handleAddContact: () => void;
  contacts: Contact[];
}

const SearchResults: React.FC<SearchResultsProps> = ({
  searchQuery,
  filteredContacts,
  handleAddContact,
  contacts,
}) => {
  const { t } = useLanguage();

  if (!searchQuery.trim()) {
    if (contacts.length > 0) {
      return (
        <EmptyState
          icon={<SearchIcon className="h-12 w-12 opacity-20" />}
          title={t("searchForService")}
          description={t("typeServiceOrTag")}
          className="mt-12"
        />
      );
    }
    
    return (
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
    );
  }

  if (filteredContacts.length > 0) {
    return (
      <div className="space-y-3 animate-fade-in">
        <p className="text-sm text-muted-foreground">
          {filteredContacts.length}{" "}
          {filteredContacts.length === 1
            ? t("contactFound")
            : t("contactsFound")}{" "}
          "{searchQuery}" {t("searchingServices")}
        </p>
        <div className="space-y-3">
          {filteredContacts.map((contact) => (
            <ContactCard key={contact.id} contact={contact} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <EmptyState
      icon={<SearchIcon className="h-12 w-12 opacity-20" />}
      title={t("noContactsFound")}
      description={`${t(
        "noContactsWithService"
      )} "${searchQuery}" ${t("wereFound")}.`}
      action={
        <Button onClick={handleAddContact} className="gap-2">
          <User className="h-4 w-4" />
          {t("addContact")}
        </Button>
      }
    />
  );
};

export default SearchResults;
