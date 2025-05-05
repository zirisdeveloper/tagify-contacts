import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  User,
  Tag as TagIcon,
  Search as SearchIcon,
  Import,
  FileText,
  Home,
  Info,
  Facebook,
  Mail,
  Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useContacts } from "@/context/ContactContext";
import { useLanguage } from "@/context/LanguageContext";
import ServiceSearchBar from "@/components/ServiceSearchBar";
import ContactCard from "@/components/ContactCard";
import EmptyState from "@/components/EmptyState";
import Header from "@/components/Header";
import { Contact } from "@/types";
import { toast } from "sonner";
import { exportJsonToFile, readFileFromAllStorageLocations, openFilePickerInDocuments } from "@/utils/fileSystem";
import AppIconSvg from "@/components/AppIconSvg";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

const removeAccents = (str: string): string => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

const HomePage: React.FC = () => {
  const { contacts, addContact } = useContacts();
  const { t, language } = useLanguage();
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const [, setRenderKey] = useState(0);
  const [aboutDialogOpen, setAboutDialogOpen] = useState(false);

  useEffect(() => {
    const handleLanguageChange = () => {
      setRenderKey((prev) => prev + 1);
    };

    window.addEventListener("languageChanged", handleLanguageChange);
    return () => {
      window.removeEventListener("languageChanged", handleLanguageChange);
    };
  }, []);

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
    const searchInput = document.querySelector(
      'input[type="search"]'
    ) as HTMLInputElement;
    if (searchInput) {
      searchInput.value = "";
    }
  };

  const handleAboutClick = () => {
    setAboutDialogOpen(true);
  };

  const handleExportContacts = async () => {
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

  const handleImportClick = async () => {
    // First, try to open the file picker in the Documents directory
    await openFilePickerInDocuments();
    
    if (fileInputRef.current) {
      // Reset the file input value before showing the picker
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log("Selected file:", file.name, "Type:", file.type, "Size:", file.size);
    
    // First try with Web File API
    try {
      // Create a URL for the selected file
      const fileURL = URL.createObjectURL(file);
      console.log("Created URL for file:", fileURL);
      
      // Read the file content
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const content = e.target?.result;
          if (!content || typeof content !== 'string') {
            throw new Error("Failed to read file content");
          }
          
          console.log("File content length:", content.length);
          
          // Try to parse as JSON regardless of extension
          const importedData = JSON.parse(content);

          if (
            !importedData ||
            !importedData.contacts ||
            !Array.isArray(importedData.contacts)
          ) {
            throw new Error("Invalid file format");
          }

          console.log("Found contacts array with", importedData.contacts.length, "items");

          const validContacts = importedData.contacts.filter(
            (contact: any) =>
              contact &&
              typeof contact.name === "string" &&
              Array.isArray(contact.tags)
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

          toast.success(`${importedCount} ${t("contactsImported")}`);
        } catch (error) {
          console.error("Import error during parsing:", error);
          
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
          
          toast.error(
            `${t("importFailed")}: ${
              error instanceof Error ? error.message : t("invalidFileFormat")
            }`
          );
        } finally {
          // Clean up the object URL
          URL.revokeObjectURL(fileURL);
        }
      };

      reader.onerror = (error) => {
        console.error("Error reading file with FileReader:", error);
        toast.error(t("errorReadingFile"));
        
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      };

      // Start reading the file
      reader.readAsText(file);
    } catch (webError) {
      console.error("Web File API error:", webError);
      
      // Try Capacitor Filesystem API as fallback for Android
      if ('Capacitor' in window) {
        try {
          console.log("Trying Capacitor Filesystem for file:", file.name);
          
          // For Android 10+ we need a different approach
          // The file object doesn't have a direct path we can use
          // We will try to save the file first to a known location, then read from there
          
          // Step 1: Convert file to base64
          const reader = new FileReader();
          reader.readAsDataURL(file);
          
          reader.onload = async (e) => {
            try {
              if (!e.target?.result) {
                throw new Error("Failed to read file content");
              }
              
              const result = e.target.result;
              if (typeof result !== 'string') {
                throw new Error("Invalid file content format");
              }
              
              const base64Data = result.split(',')[1];
              const tempFileName = `temp_import_${Date.now()}.json`;
              
              console.log("Saving file temporarily to read it");
              
              // Step 2: Write the file to Documents directory
              await Filesystem.writeFile({
                path: tempFileName,
                data: base64Data,
                directory: Directory.Cache,
                encoding: Encoding.UTF8
              });
              
              console.log("File saved temporarily, now reading it");
              
              // Step 3: Read the file back
              const fileResult = await Filesystem.readFile({
                path: tempFileName,
                directory: Directory.Cache,
                encoding: Encoding.UTF8
              });
              
              // Step 4: Process the content
              const fileContent = fileResult.data;
              if (typeof fileContent !== 'string') {
                throw new Error("Invalid file content format");
              }
              
              console.log("File content read successfully, length:", fileContent.length);
              
              // Parse the content
              const importedData = JSON.parse(fileContent);
              
              if (!importedData || !importedData.contacts || !Array.isArray(importedData.contacts)) {
                throw new Error("Invalid file format");
              }
              
              const validContacts = importedData.contacts.filter(
                (contact: any) =>
                  contact &&
                  typeof contact.name === "string" &&
                  Array.isArray(contact.tags)
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
              
              // Step 5: Clean up temporary file
              try {
                await Filesystem.deleteFile({
                  path: tempFileName,
                  directory: Directory.Cache
                });
                console.log("Temporary file deleted");
              } catch (deleteErr) {
                console.log("Failed to delete temporary file:", deleteErr);
                // Non-critical error, we can still proceed
              }
              
              if (fileInputRef.current) {
                fileInputRef.current.value = "";
              }
              
              toast.success(`${importedCount} ${t("contactsImported")}`);
            } catch (processingError) {
              console.error("Error processing file:", processingError);
              toast.error(`${t("importFailed")}: ${processingError instanceof Error ? processingError.message : t("processingError")}`);
              
              if (fileInputRef.current) {
                fileInputRef.current.value = "";
              }
            }
          };
          
          reader.onerror = (readerError) => {
            console.error("Error reading file as base64:", readerError);
            toast.error(t("errorReadingFile"));
            
            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }
          };
        } catch (capacitorError) {
          console.error("Capacitor Filesystem error:", capacitorError);
          toast.error(`${t("importFailed")}: ${capacitorError instanceof Error ? capacitorError.message : t("capacitorReadError")}`);
          
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        }
      } else {
        // No Capacitor available
        toast.error(t("importFailed"));
        
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    }
  };

  const getAppTitle = () => {
    return language === "en" ? "Backdoor" : "Piston";
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <input
        type="file"
        ref={fileInputRef}
        accept="*/*"
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
            <DropdownMenuContent
              align="end"
              className="bg-popover border border-border"
            >
              <DropdownMenuItem onClick={handleAddContact}>
                <User className="h-4 w-4 mr-2" />
                {t("newContact")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSearchContact}>
                <SearchIcon className="h-4 w-4 mr-2" />
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
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/parameters')}>
                <Settings className="h-4 w-4 mr-2" />
                {t("parameters")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleAboutClick}>
                <Info className="h-4 w-4 mr-2" />
                {t("about")}
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
            ) : (
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

      <AlertDialog open={aboutDialogOpen} onOpenChange={setAboutDialogOpen}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <div className="mx-auto mb-6">
              <div className="w-20 h-20 mx-auto">
                <AppIconSvg className="w-full h-full" />
              </div>
            </div>
            <AlertDialogTitle className="text-center text-xl">
              {language === "en" ? "Backdoor" : "Piston"} v.2.1
            </AlertDialogTitle>
            <div className="py-4 text-center">
              {t("developedBy")} Mahfoud Bouziri
            </div>
          </AlertDialogHeader>
          <div className="flex items-center justify-between mt-8">
            <div className="flex items-center space-x-2">
              <a
                href="https://facebook.com/zirisdeveloper"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full hover:bg-accent transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="mailto:zirisdeveloper@gmail.com"
                className="p-2 rounded-full hover:bg-accent transition-colors"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
            <span className="text-sm text-muted-foreground">
              copyright zirisdeveloper
            </span>
          </div>
          <AlertDialogFooter>
            <AlertDialogAction>{t("close")}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default HomePage;
