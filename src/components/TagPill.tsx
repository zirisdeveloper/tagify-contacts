
import React from "react";
import { Tag } from "@/types";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface TagPillProps {
  tag: Tag;
  onRemove?: () => void;
  size?: "sm" | "md";
  className?: string;
}

const TagPill: React.FC<TagPillProps> = ({ 
  tag, 
  onRemove, 
  size = "md",
  className 
}) => {
  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRemove) onRemove();
  };

  return (
    <span 
      className={cn(
        "tag bg-primary/10 text-primary",
        {
          "px-2 py-0.5 text-xs": size === "sm",
          "px-3 py-1 text-sm": size === "md",
        },
        className
      )}
    >
      {tag.name}
      {onRemove && (
        <button 
          type="button"
          onClick={handleRemoveClick}
          className="ml-1 hover:bg-primary/20 rounded-full p-0.5"
          aria-label={`Remove ${tag.name} tag`}
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </span>
  );
};

export default TagPill;
