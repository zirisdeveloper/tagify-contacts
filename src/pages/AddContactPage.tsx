
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Search, User } from "lucide-react";
import { useContacts } from "@/context/ContactContext";
import { Tag } from "@/types";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import ContactCard from "@/components/ContactCard";
import TagInput from "@/components/TagInput";
import EmptyState from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
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

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  familyName: z.string().optional(),
  phoneNumber: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const AddContactPage: React.FC = () => {
  const { contacts, addContact } = useContacts();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredContacts, setFilteredContacts] = useState(contacts);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [tagsError, setTagsError] = useState<string | null>(null);
  const navigate = useNavigate();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      familyName: "",
      phoneNumber: "",
    },
  });

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

  // Clear tags error when tags are added
  useEffect(() => {
    if (selectedTags.length > 0 && tagsError) {
      setTagsError(null);
    }
  }, [selectedTags, tagsError]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleAddTag = (tagName: string) => {
    if (!selectedTags.some((tag) => tag.name.toLowerCase() === tagName.toLowerCase())) {
      setSelectedTags([...selectedTags, { id: crypto.randomUUID(), name: tagName }]);
      // Clear any tag error when a tag is added
      if (tagsError) {
        setTagsError(null);
      }
    } else {
      toast.info(`Tag "${tagName}" already added`);
    }
  };

  const handleRemoveTag = (tagId: string) => {
    setSelectedTags(selectedTags.filter((tag) => tag.id !== tagId));
    // Set error if removing the last tag
    if (selectedTags.length <= 1) {
      setTagsError("At least one tag is required");
    }
  };

  const onSubmit = (data: FormData) => {
    // Validate tags before submission
    if (selectedTags.length === 0) {
      setTagsError("At least one tag is required");
      return;
    }

    addContact({
      name: data.name,
      familyName: data.familyName,
      phoneNumber: data.phoneNumber,
      tags: selectedTags,
    });

    navigate("/");
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

      <div className="p-4 pt-2">
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
                      <Input {...field} placeholder="Enter name" />
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
                      <Input {...field} placeholder="Enter family name" />
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
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="Enter phone number" 
                        type="tel"
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
                  <p className="text-sm text-destructive">
                    {tagsError}
                  </p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full gap-2"
              >
                <Plus className="h-4 w-4" />
                Create Contact
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default AddContactPage;
