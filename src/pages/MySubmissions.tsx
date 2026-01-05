import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Clock, Check, X } from "lucide-react";

interface Submission {
  id: string;
  name: string;
  description: string;
  category: string;
  platform: string;
  status: string;
  rejection_reason: string | null;
  created_at: string;
}

const statusConfig = {
  pending: { label: "Pendente", icon: Clock, color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50" },
  approved: { label: "Aprovado", icon: Check, color: "bg-green-500/20 text-green-400 border-green-500/50" },
  rejected: { label: "Rejeitado", icon: X, color: "bg-red-500/20 text-red-400 border-red-500/50" }
};

export default function MySubmissions() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchSubmissions();
    }
  }, [user]);

  const fetchSubmissions = async () => {
    const { data, error } = await supabase
      .from("tool_submissions")
      .select("*")
      .eq("user_id", user?.id)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setSubmissions(data);
    }
    setIsLoading(false);
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Minhas Submissões</h1>

        {submissions.length === 0 ? (
          <Card className="glass">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                Você ainda não enviou nenhuma ferramenta.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {submissions.map(sub => {
              const status = statusConfig[sub.status as keyof typeof statusConfig];
              const StatusIcon = status.icon;
              
              return (
                <Card key={sub.id} className="glass">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{sub.name}</CardTitle>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="outline">{sub.platform}</Badge>
                          <Badge variant="secondary">{sub.category}</Badge>
                        </div>
                      </div>
                      <Badge className={status.color}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {status.label}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{sub.description}</p>
                    
                    {sub.status === "rejected" && sub.rejection_reason && (
                      <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                        <p className="text-sm text-red-400">
                          <strong>Motivo da rejeição:</strong> {sub.rejection_reason}
                        </p>
                      </div>
                    )}
                    
                    <p className="text-xs text-muted-foreground mt-4">
                      Enviado em {new Date(sub.created_at).toLocaleDateString("pt-BR")}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
