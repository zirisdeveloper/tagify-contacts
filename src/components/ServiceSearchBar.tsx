
import React from "react";
import SearchBar from "./SearchBar";

interface ServiceSearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  className?: string;
  autoFocus?: boolean;
}

const ServiceSearchBar: React.FC<ServiceSearchBarProps> = ({
  placeholder,
  onSearch,
  className,
  autoFocus = false,
}) => {
  return (
    <SearchBar
      type="service"
      placeholder={placeholder}
      onSearch={onSearch}
      className={className}
      autoFocus={autoFocus}
    />
  );
};

export default ServiceSearchBar;
