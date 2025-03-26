
import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  rightElement?: React.ReactNode;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({
  title,
  showBackButton = false,
  rightElement,
  className,
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
        <h1 className="text-xl font-medium">{title}</h1>
      </div>
      {rightElement && <div>{rightElement}</div>}
    </header>
  );
};

export default Header;
