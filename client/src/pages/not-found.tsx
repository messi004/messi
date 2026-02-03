import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="space-y-2">
          <h1 className="text-8xl font-bold text-primary font-heading">404</h1>
          <h2 className="text-2xl font-bold font-heading text-foreground">Page Not Found</h2>
          <p className="text-muted-foreground">
            Sorry, the page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link href="/">
            <Button className="gap-2" data-testid="button-go-home">
              <Home size={16} /> Go Home
            </Button>
          </Link>
          <Button 
            variant="outline" 
            onClick={() => window.history.back()} 
            className="gap-2"
            data-testid="button-go-back"
          >
            <ArrowLeft size={16} /> Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}
