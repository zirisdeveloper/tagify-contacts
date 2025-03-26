
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, User, Tag as TagIcon, Search as SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useContacts } from "@/context/ContactContext";
import SearchBar from "@/components/SearchBar";
import ContactCard from "@/components/ContactCard";
import EmptyState from "@/components/EmptyState";
import Header from "@/components/Header";
import { Contact } from "@/types";

const HomePage: React.FC = () => {
  const { contacts, findContactsByTag } = useContacts();
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  
  useEffect(() => {
    if (searchQuery.trim()) {
      setFilteredContacts(findContactsByTag(searchQuery));
    } else {
      setFilteredContacts([]);
    }
  }, [searchQuery, findContactsByTag, contacts]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleAddContact = () => {
    navigate("/add-contact");
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header 
        title="Tagify Contacts" 
        rightElement={
          <Button
            size="icon"
            onClick={handleAddContact}
            className="rounded-full h-10 w-10 shadow-sm"
            aria-label="Add contact"
          >
            <Plus className="h-5 w-5" />
          </Button>
        }
      />

      <div className="px-4 py-3">
        <SearchBar 
          placeholder="Search by tag or service..."
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
                description={`No contacts with the service "${searchQuery}" were found.`}
                action={
                  <Button onClick={handleAddContact} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add a new contact
                  </Button>
                }
              />
            )}
          </>
        ) : contacts.length > 0 ? (
          <EmptyState
            icon={<TagIcon className="h-12 w-12 opacity-20" />}
            title="Search for a service"
            description="Type a service or tag name to find contacts"
            className="mt-12"
          />
        ) : (
          <EmptyState
            icon={<User className="h-12 w-12 opacity-20" />}
            title="No contacts yet"
            description="Add your first contact to get started"
            action={
              <Button onClick={handleAddContact} className="gap-2">
                <Plus className="h-4 w-4" />
                Add a contact
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
