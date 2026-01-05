import { Package } from "lucide-react";

export function Header() {
  return (
    <header className="border-b border-border/50 glass sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-windows">
              <Package className="h-6 w-6 text-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">
                <span className="text-gradient-windows">Soft</span>
                <span className="text-foreground">Index</span>
              </h1>
              <p className="text-xs text-muted-foreground font-mono">
                Repositório de Software
              </p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
            <span className="px-2 py-1 rounded bg-secondary font-mono">
              v1.0.0
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
