
import React from "react";
import SearchBar from "./SearchBar";

interface ContactSearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  className?: string;
  autoFocus?: boolean;
}

const ContactSearchBar: React.FC<ContactSearchBarProps> = ({
  placeholder,
  onSearch,
  className,
  autoFocus = false,
}) => {
  return (
    <SearchBar
      type="contact"
      placeholder={placeholder}
      onSearch={onSearch}
      className={className}
      autoFocus={autoFocus}
    />
  );
};

export default ContactSearchBar;
