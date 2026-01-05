import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { LogOut, User, Shield, Settings } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const roleColors = {
  owner: "bg-red-500/20 text-red-400 border-red-500/50",
  admin: "bg-purple-500/20 text-purple-400 border-purple-500/50",
  staff: "bg-blue-500/20 text-blue-400 border-blue-500/50",
  member: "bg-green-500/20 text-green-400 border-green-500/50"
};

const roleLabels = {
  owner: "Owner",
  admin: "Admin",
  staff: "Staff",
  member: "Membro"
};

export function UserMenu() {
  const { user, roles, signOut, isStaffOrHigher } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <Button asChild variant="outline" size="sm">
        <Link to="/auth">Entrar</Link>
      </Button>
    );
  }

  const primaryRole = roles[0] || "member";
  const initials = user.email?.slice(0, 2).toUpperCase() || "U";

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-gradient-windows text-foreground text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 glass" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-2">
            <p className="text-sm font-medium leading-none">{user.email}</p>
            <div className="flex gap-1">
              {roles.map(role => (
                <Badge 
                  key={role} 
                  variant="outline" 
                  className={`text-xs ${roleColors[role]}`}
                >
                  {roleLabels[role]}
                </Badge>
              ))}
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/my-submissions" className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            Minhas Submissões
          </Link>
        </DropdownMenuItem>
        {isStaffOrHigher && (
          <DropdownMenuItem asChild>
            <Link to="/admin" className="cursor-pointer">
              <Shield className="mr-2 h-4 w-4" />
              Painel Admin
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-400">
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
