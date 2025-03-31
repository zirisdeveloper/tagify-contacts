
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Search as SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useContacts } from "@/context/ContactContext";
import ContactSearchBar from "@/components/ContactSearchBar";
import ContactCard from "@/components/ContactCard";
import EmptyState from "@/components/EmptyState";
import Header from "@/components/Header";
import { Contact } from "@/types";

const SearchPage: React.FC = () => {
  const { contacts } = useContacts();
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (searchQuery.trim()) {
      // Search by name
      setFilteredContacts(
        contacts.filter((contact) =>
          `${contact.name} ${contact.familyName || ""}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredContacts([]);
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
        title="Search Contacts" 
        showBackButton={true}
      />

      <div className="px-4 py-3">
        <ContactSearchBar 
          placeholder="Search contacts by name..."
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
                  {filteredContacts.length} {filteredContacts.length === 1 ? 'contact' : 'contacts'} found for "{searchQuery}"
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
                title="No contacts found"
                description={`No contacts with name "${searchQuery}" were found.`}
                action={
                  <Button onClick={handleAddContact} className="gap-2">
                    <User className="h-4 w-4" />
                    Add a new contact
                  </Button>
                }
              />
            )}
          </>
        ) : (
          <EmptyState
            icon={<User className="h-12 w-12 opacity-20" />}
            title="Search for a contact"
            description="Type a contact name to find matches"
            className="mt-12"
          />
        )}
      </div>
    </div>
  );
};

export default SearchPage;
