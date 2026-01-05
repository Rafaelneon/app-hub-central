import { Package } from "lucide-react";
import { Link } from "react-router-dom";
import { UserMenu } from "@/components/UserMenu";
import { SubmitToolDialog } from "@/components/SubmitToolDialog";
import { useAuth } from "@/contexts/AuthContext";

export function Header() {
  const { user } = useAuth();
  
  return (
    <header className="border-b border-border/50 glass sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-windows">
              <Package className="h-6 w-6 text-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">
                <span className="text-gradient-windows">Soft</span>
                <span className="text-foreground">Index</span>
              </h1>
              <p className="text-xs text-muted-foreground font-mono">
                Marketplace de Software
              </p>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            {user && <SubmitToolDialog />}
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
