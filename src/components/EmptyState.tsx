
import React from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center space-y-3",
        className
      )}
    >
      {icon ? (
        <div className="mb-2">{icon}</div>
      ) : (
        <div className="mb-2 w-16 h-16 bg-[#0B5681] rounded-full flex items-center justify-center">
          <svg 
            viewBox="0 0 108 108" 
            className="h-12 w-12"
            aria-hidden="true"
          >
            <circle cx="54" cy="54" r="30" fill="#FFFFFF" />
            <circle cx="54" cy="54" r="25" fill="#0B5681" />
            <circle cx="54" cy="38" r="10" fill="#FFFFFF" />
            <path d="M42,60 L66,60 Q72,60 72,66 L72,70 L36,70 L36,66 Q36,60 42,60" fill="#FFFFFF" />
            <path d="M54,50 L58,56 L50,56 Z" fill="#0B5681" />
            <path d="M54,54 L54,70" fill="#0B5681" />
          </svg>
        </div>
      )}
      <h3 className="text-lg font-medium">{title}</h3>
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};

export default EmptyState;
