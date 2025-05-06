
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Search } from "lucide-react";
import { useContacts } from "@/context/ContactContext";
import { Tag } from "@/types";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import ContactCard from "@/components/ContactCard";
import TagInput from "@/components/TagInput";
import EmptyState from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { generateId } from "@/utils/idGenerator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  familyName: z.string().optional(),
  phoneNumber: z.string().optional(),
  phoneNumber2: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const AddContactPage: React.FC = () => {
  const { contacts, addContact, findContactByName, findContactByPhone } = useContacts();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredContacts, setFilteredContacts] = useState(contacts);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [tagsError, setTagsError] = useState<string | null>(null);
  
  // Dialog states for duplicate contacts
  const [nameDialogOpen, setNameDialogOpen] = useState(false);
  const [phoneDialogOpen, setPhoneDialogOpen] = useState(false);
  const [duplicateContactId, setDuplicateContactId] = useState<string | null>(null);
  
  // State to track keyboard visibility
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  const navigate = useNavigate();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      familyName: "",
      phoneNumber: "",
      phoneNumber2: "",
    },
  });

  // Add effect to handle keyboard visibility
  useEffect(() => {
    // Function to detect if keyboard is visible by checking window height changes
    const handleResize = () => {
      const isKeyboard = window.innerHeight < window.outerHeight * 0.8;
      setIsKeyboardVisible(isKeyboard);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
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

  useEffect(() => {
    if (selectedTags.length > 0 && tagsError) {
      setTagsError(null);
    }
  }, [selectedTags, tagsError]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleAddTag = (tagName: string) => {
    if (
      !selectedTags.some(
        (tag) => tag.name.toLowerCase() === tagName.toLowerCase()
      )
    ) {
      setSelectedTags([...selectedTags, { id: generateId(), name: tagName }]);
      if (tagsError) {
        setTagsError(null);
      }
    } else {
      toast.info(`Tag "${tagName}" already added`);
    }
  };

  const handleRemoveTag = (tagId: string) => {
    setSelectedTags(selectedTags.filter((tag) => tag.id !== tagId));
  };

  const checkForDuplicateContact = (data: FormData) => {
    // Check for duplicate name and family name
    const existingContactByName = findContactByName(data.name, data.familyName);
    if (existingContactByName) {
      setDuplicateContactId(existingContactByName.id);
      setNameDialogOpen(true);
      return true;
    }

    // Check for duplicate phone numbers (if provided)
    if (data.phoneNumber) {
      const existingContactByPhone = findContactByPhone(data.phoneNumber);
      if (existingContactByPhone) {
        setDuplicateContactId(existingContactByPhone.id);
        setPhoneDialogOpen(true);
        return true;
      }
    }

    if (data.phoneNumber2) {
      const existingContactByPhone2 = findContactByPhone(data.phoneNumber2);
      if (existingContactByPhone2) {
        setDuplicateContactId(existingContactByPhone2.id);
        setPhoneDialogOpen(true);
        return true;
      }
    }

    return false;
  };

  const onSubmit = (data: FormData) => {
    if (selectedTags.length === 0) {
      setTagsError("At least one tag is required");
      return;
    }

    // Check for duplicates
    if (checkForDuplicateContact(data)) {
      return;
    }

    // If no duplicates, add the contact
    addContact({
      name: data.name,
      familyName: data.familyName,
      phoneNumber: data.phoneNumber,
      phoneNumber2: data.phoneNumber2,
      tags: selectedTags,
    });

    navigate("/");
  };

  const handleUpdateExistingContact = () => {
    if (duplicateContactId) {
      navigate(`/contact/${duplicateContactId}`);
    }
  };

  const handleCancelUpdate = () => {
    setNameDialogOpen(false);
    setPhoneDialogOpen(false);
    setDuplicateContactId(null);
    navigate("/");
  };

  // Helper function to handle input focus
  const handleInputFocus = () => {
    // Add small timeout to ensure UI updates after focus
    setTimeout(() => {
      window.scrollTo({
        top: window.pageYOffset + 200,
        behavior: 'smooth'
      });
    }, 300);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header title="Add Contact" showBackButton />

      <div className="p-4">
        <SearchBar
          placeholder="Search existing contacts..."
          onSearch={handleSearch}
          autoFocus
        />
      </div>

      {searchQuery.trim() && filteredContacts.length > 0 ? (
        <div className="p-4 space-y-4">
          <h2 className="text-lg font-medium">Existing contacts</h2>
          <div className="space-y-3">
            {filteredContacts.map((contact) => (
              <ContactCard key={contact.id} contact={contact} />
            ))}
          </div>
        </div>
      ) : searchQuery.trim() ? (
        <div className="p-4">
          <EmptyState
            icon={<Search className="h-8 w-8 opacity-20" />}
            title="No matching contacts"
            description="Create a new contact below"
          />
        </div>
      ) : null}

      <div className="p-4 pt-2 pb-24">
        <div className="rounded-xl bg-white shadow-sm border border-border/40 p-4">
          <h2 className="text-lg font-medium mb-4">New Contact</h2>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name *</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="Enter name" 
                        onFocus={handleInputFocus}
                        autoComplete="off"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="familyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Family Name</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="Enter family name" 
                        onFocus={handleInputFocus}
                        autoComplete="off"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter primary phone number"
                        type="tel"
                        onFocus={handleInputFocus}
                        autoComplete="off"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phoneNumber2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Secondary Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter secondary phone number"
                        type="tel"
                        onFocus={handleInputFocus}
                        autoComplete="off"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <FormLabel>Tags / Services *</FormLabel>
                <TagInput
                  tags={selectedTags}
                  onAddTag={handleAddTag}
                  onRemoveTag={handleRemoveTag}
                  placeholder="Add service or tag..."
                />
                {tagsError && (
                  <p className="text-sm text-destructive">{tagsError}</p>
                )}
              </div>

              <Button type="submit" className="w-full gap-2">
                <Plus className="h-4 w-4" />
                Create Contact
              </Button>
            </form>
          </Form>
        </div>
      </div>

      {/* Dialog for duplicate name */}
      <AlertDialog open={nameDialogOpen} onOpenChange={setNameDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Duplicate Contact Name</AlertDialogTitle>
            <AlertDialogDescription>
              A contact with this name and family name already exists. Would you like to update the existing contact?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelUpdate}>No</AlertDialogCancel>
            <AlertDialogAction onClick={handleUpdateExistingContact}>Yes, Update</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog for duplicate phone */}
      <AlertDialog open={phoneDialogOpen} onOpenChange={setPhoneDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Duplicate Phone Number</AlertDialogTitle>
            <AlertDialogDescription>
              This phone number is already associated with another contact. Would you like to update the existing contact?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelUpdate}>No</AlertDialogCancel>
            <AlertDialogAction onClick={handleUpdateExistingContact}>Yes, Update</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AddContactPage;
