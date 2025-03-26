
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, User, Tag as TagIcon, Search as SearchIcon, Import, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useContacts } from "@/context/ContactContext";
import SearchBar from "@/components/SearchBar";
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
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  const handleSearchContact = () => {
    // This is already the search page, so we'll just focus the search input
    const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement;
    if (searchInput) {
      searchInput.focus();
    }
  };

  const handleExportContacts = () => {
    if (contacts.length === 0) {
      toast.error("No contacts to export");
      return;
    }

    // Create a data object to export
    const dataToExport = {
      contacts: contacts,
      exportDate: new Date().toISOString()
    };

    // Convert the data to a JSON string
    const jsonString = JSON.stringify(dataToExport, null, 2);
    
    // Create a blob with the data
    const blob = new Blob([jsonString], { type: "application/json" });
    
    // Create a URL for the blob
    const url = URL.createObjectURL(blob);
    
    // Create a temporary anchor element to trigger the download
    const a = document.createElement("a");
    a.href = url;
    a.download = `piston-contacts-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    toast.success(`${contacts.length} contacts exported successfully`);
  };

  const handleImportClick = () => {
    // Trigger the hidden file input
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
        
        // Check if contacts have the required structure
        const validContacts = importedData.contacts.filter((contact: any) => 
          contact && typeof contact.name === "string" && Array.isArray(contact.tags)
        );
        
        if (validContacts.length === 0) {
          throw new Error("No valid contacts found in the file");
        }
        
        // Import each valid contact
        let importedCount = 0;
        validContacts.forEach((contact: Omit<Contact, "id">) => {
          try {
            addContact(contact);
            importedCount++;
          } catch (error) {
            console.error("Error importing contact:", error);
          }
        });
        
        // Reset the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        
        toast.success(`${importedCount} contacts imported successfully`);
        
      } catch (error) {
        console.error("Import error:", error);
        toast.error(`Import failed: ${error instanceof Error ? error.message : "Invalid file format"}`);
        
        // Reset the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    };
    
    reader.readAsText(file);
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
        title="Piston" 
        rightElement={
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                className="rounded-full h-10 w-10 shadow-sm"
                aria-label="Menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-popover border border-border">
              <DropdownMenuItem onClick={handleAddContact}>
                New Contact
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSearchContact}>
                Search Contact
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleExportContacts}>
                <FileText className="h-4 w-4 mr-2" />
                Export Contacts
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleImportClick}>
                <Import className="h-4 w-4 mr-2" />
                Import Contacts
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
                    <SearchIcon className="h-4 w-4" />
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
                <SearchIcon className="h-4 w-4" />
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
