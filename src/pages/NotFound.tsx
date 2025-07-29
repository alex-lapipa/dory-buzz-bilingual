import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-nature safe-area-top safe-area-bottom flex items-center justify-center p-4">
      <Card className="shadow-honey border border-border/30 bg-card/70 backdrop-blur max-w-md w-full">
        <CardContent className="p-6 text-center">
          <div className="text-6xl mb-4 animate-bee-bounce">🐝</div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-bee bg-clip-text text-transparent">404</h1>
          <p className="text-lg text-muted-foreground mb-6">Oops! This page doesn't exist in our garden</p>
          <Button asChild className="w-full">
            <a href="/">
              <Home className="h-4 w-4 mr-2" />
              Return to Garden
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
