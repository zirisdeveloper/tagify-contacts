
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
            viewBox="0 0 200 200" 
            className="h-12 w-12"
            aria-hidden="true"
          >
            <circle cx="100" cy="100" r="80" fill="none" stroke="#FFFFFF" strokeWidth="8" />
            <circle cx="100" cy="100" r="65" fill="none" stroke="#FFFFFF" strokeWidth="4" />
            <circle cx="100" cy="70" r="20" fill="#FFFFFF" />
            <path d="M70,115 L130,115 Q140,115 140,125 L140,145 L60,145 L60,125 Q60,115 70,115" fill="#FFFFFF" />
            <path d="M100,90 L100,145" stroke="#0B5681" strokeWidth="6" />
            <path d="M100,90 L100,105 L110,115 L90,115 Z" fill="#0B5681" />
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
