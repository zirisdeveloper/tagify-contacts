
import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
  className?: string;
  centerTitle?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  title,
  showBackButton = false,
  leftElement,
  rightElement,
  className,
  centerTitle = false,
}) => {
  const navigate = useNavigate();

  return (
    <header className={cn(
      "sticky top-0 z-10 flex items-center justify-between h-16 px-4 bg-background/90 backdrop-blur-md border-b border-border/40",
      className
    )}>
      <div className="flex items-center gap-2">
        {showBackButton && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="rounded-full"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        {leftElement}
      </div>
      <h1 className={cn(
        "text-xl font-medium",
        centerTitle && "absolute left-1/2 transform -translate-x-1/2"
      )}>
        {title}
      </h1>
      {rightElement && <div>{rightElement}</div>}
    </header>
  );
};

export default Header;
