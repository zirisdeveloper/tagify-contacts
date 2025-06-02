
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Contact } from "@/types";
import TagPill from "./TagPill";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";

interface ContactCardProps {
  contact: Contact;
  className?: string;
}

const ContactCard: React.FC<ContactCardProps> = ({ contact, className }) => {
  const location = useLocation();
  const isSearchPage = location.pathname === '/search';

  const handleClick = (e: React.MouseEvent) => {
    console.log("ContactCard: Clicked contact", contact.name);
    // Prevent default and handle navigation manually on mobile if needed
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) {
      console.log("ContactCard: Mobile click detected");
    }
  };

  return (
    <Link 
      to={`/contact/${contact.id}`}
      state={isSearchPage ? { from: '/search' } : undefined}
      onClick={handleClick}
      className={cn(
        "block p-4 rounded-xl bg-white shadow-sm border border-border/40 transition-all hover:shadow-md hover:border-primary/20 active:scale-[0.98] contact-appear touch-manipulation",
        className
      )}
      style={{ touchAction: 'manipulation' }}
    >
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <User className="h-6 w-6" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-base truncate">
            {contact.name} {contact.familyName || ""}
          </h3>
          {contact.phoneNumber && (
            <p className="text-sm text-muted-foreground truncate">
              {contact.phoneNumber}
            </p>
          )}
        </div>
      </div>
      
      {contact.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {contact.tags.slice(0, 3).map((tag) => (
            <TagPill key={tag.id} tag={tag} size="sm" />
          ))}
          {contact.tags.length > 3 && (
            <span className="tag bg-secondary text-secondary-foreground">
              +{contact.tags.length - 3} more
            </span>
          )}
        </div>
      )}
    </Link>
  );
};

export default ContactCard;
