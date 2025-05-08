
import React, { useState, useRef, useEffect } from "react";
import { X, Plus } from "lucide-react";
import { Tag } from "@/types";
import { cn } from "@/lib/utils";

interface TagInputProps {
  tags: Tag[];
  onAddTag: (tagName: string) => void;
  onRemoveTag: (tagId: string) => void;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
}

const TagInput: React.FC<TagInputProps> = ({
  tags,
  onAddTag,
  onRemoveTag,
  className,
  placeholder = "Add tag...",
  disabled = false,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleContainerClick = () => {
    if (!disabled && inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      onAddTag(inputValue.trim());
      setInputValue("");
    } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      onRemoveTag(tags[tags.length - 1].id);
    }
  };

  const handleRemoveTag = (tagId: string) => (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemoveTag(tagId);
  };

  const handleAddTag = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (inputValue.trim()) {
      onAddTag(inputValue.trim());
      setInputValue("");
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "flex flex-wrap items-center gap-2 p-2 border rounded-md min-h-[42px] transition-all",
        isFocused ? "ring-2 ring-primary border-primary" : "border-input",
        disabled ? "bg-muted opacity-60 cursor-not-allowed" : "cursor-text",
        className
      )}
      onClick={handleContainerClick}
    >
      {tags.map((tag) => (
        <span
          key={tag.id}
          className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-sm text-primary"
        >
          {tag.name}
          {!disabled && (
            <button
              type="button"
              onClick={handleRemoveTag(tag.id)}
              className="ml-1 hover:bg-primary/20 rounded-full p-0.5"
              aria-label={`Remove ${tag.name} tag`}
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </span>
      ))}

      {!disabled && (
        <div className="flex flex-1 min-w-[120px] items-center">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            className="flex-1 outline-none bg-transparent text-sm border-none"
            placeholder={tags.length === 0 ? placeholder : ""}
            disabled={disabled}
          />
          {inputValue && (
            <button
              type="button"
              onClick={handleAddTag}
              className="ml-1 p-1 hover:bg-secondary rounded-full text-muted-foreground"
              aria-label="Add tag"
            >
              <Plus className="h-4 w-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default TagInput;
