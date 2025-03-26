
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Edit, Trash2, Plus, User, Phone } from "lucide-react";
import { useContacts } from "@/context/ContactContext";
import { Tag } from "@/types";
import Header from "@/components/Header";
import TagPill from "@/components/TagPill";
import TagInput from "@/components/TagInput";
import EmptyState from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ContactDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { contacts, updateContact, deleteContact, addTagToContact, removeTagFromContact } = useContacts();
  const contact = contacts.find((c) => c.id === id);
  
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedFamilyName, setEditedFamilyName] = useState("");
  const [editedPhoneNumber, setEditedPhoneNumber] = useState("");
  const [isAddTagOpen, setIsAddTagOpen] = useState(false);
  const [newTags, setNewTags] = useState<Tag[]>([]);

  if (!contact) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header title="Contact Not Found" showBackButton />
        <EmptyState
          icon={<User className="h-12 w-12 opacity-20" />}
          title="Contact not found"
          description="The contact you're looking for doesn't exist or has been deleted."
          action={
            <Button onClick={() => navigate("/")} variant="secondary">
              Back to Home
            </Button>
          }
          className="flex-1"
        />
      </div>
    );
  }

  const handleOpenEdit = () => {
    setEditedName(contact.name);
    setEditedFamilyName(contact.familyName || "");
    setEditedPhoneNumber(contact.phoneNumber || "");
    setIsEditOpen(true);
  };

  const handleSaveEdit = () => {
    if (editedName.trim()) {
      updateContact(contact.id, {
        name: editedName,
        familyName: editedFamilyName || undefined,
        phoneNumber: editedPhoneNumber || undefined,
      });
      setIsEditOpen(false);
    }
  };

  const handleOpenAddTag = () => {
    setNewTags([]);
    setIsAddTagOpen(true);
  };

  const handleAddTag = (tagName: string) => {
    if (!newTags.some((tag) => tag.name.toLowerCase() === tagName.toLowerCase()) &&
        !contact.tags.some((tag) => tag.name.toLowerCase() === tagName.toLowerCase())) {
      setNewTags([...newTags, { id: crypto.randomUUID(), name: tagName }]);
    }
  };

  const handleRemoveNewTag = (tagId: string) => {
    setNewTags(newTags.filter((tag) => tag.id !== tagId));
  };

  const handleSaveNewTags = () => {
    newTags.forEach((tag) => {
      addTagToContact(contact.id, { name: tag.name });
    });
    setIsAddTagOpen(false);
  };
  
  const handleDeleteContact = () => {
    deleteContact(contact.id);
    navigate("/");
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header 
        title="Contact Details" 
        showBackButton 
        rightElement={
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleOpenEdit}
              className="rounded-full"
              aria-label="Edit contact"
            >
              <Edit className="h-5 w-5" />
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full text-destructive"
                  aria-label="Delete contact"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete contact</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this contact? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteContact} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        }
      />

      <div className="p-4 animate-fade-in">
        <div className="rounded-xl bg-white shadow-sm border border-border/40 p-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <User className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-xl font-medium">
                {contact.name} {contact.familyName}
              </h2>
              {contact.phoneNumber && (
                <div className="flex items-center gap-1 text-muted-foreground mt-1">
                  <Phone className="h-3.5 w-3.5" /> 
                  <span>{contact.phoneNumber}</span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium">Tags / Services</h3>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-1 h-8" 
                onClick={handleOpenAddTag}
              >
                <Plus className="h-3.5 w-3.5" /> Add
              </Button>
            </div>
            
            {contact.tags.length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-3">
                {contact.tags.map((tag) => (
                  <TagPill 
                    key={tag.id} 
                    tag={tag} 
                    onRemove={() => removeTagFromContact(contact.id, tag.id)} 
                  />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No tags added</p>
            )}
          </div>
        </div>
      </div>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Contact</DialogTitle>
            <DialogDescription>
              Make changes to your contact here.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                placeholder="Enter name"
              />
              {!editedName.trim() && (
                <p className="text-sm text-destructive">Name is required</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="familyName">Family Name</Label>
              <Input
                id="familyName"
                value={editedFamilyName}
                onChange={(e) => setEditedFamilyName(e.target.value)}
                placeholder="Enter family name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                value={editedPhoneNumber}
                onChange={(e) => setEditedPhoneNumber(e.target.value)}
                placeholder="Enter phone number"
                type="tel"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} disabled={!editedName.trim()}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isAddTagOpen} onOpenChange={setIsAddTagOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Tags</DialogTitle>
            <DialogDescription>
              Add new tags or services for this contact.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-2">
            <TagInput
              tags={newTags}
              onAddTag={handleAddTag}
              onRemoveTag={handleRemoveNewTag}
              placeholder="Type and press Enter to add..."
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddTagOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSaveNewTags} 
              disabled={newTags.length === 0}
            >
              Add Tags
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContactDetailsPage;
