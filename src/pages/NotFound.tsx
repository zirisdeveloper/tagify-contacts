
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <div className="text-center max-w-md mx-auto animate-fade-in">
        <h1 className="text-7xl font-bold mb-4 text-primary">404</h1>
        <p className="text-xl text-foreground mb-6">This page doesn't exist</p>
        <p className="text-muted-foreground mb-8">
          The page you're looking for couldn't be found. It might have been removed, renamed, or it never existed.
        </p>
        <Button 
          onClick={() => navigate("/")} 
          className="gap-2"
        >
          <Home className="h-4 w-4" />
          Back to Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
