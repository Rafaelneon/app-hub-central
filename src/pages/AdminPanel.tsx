import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Check, X, Clock, ExternalLink, Loader2 } from "lucide-react";

interface ToolSubmission {
  id: string;
  name: string;
  description: string;
  category: string;
  platform: string;
  download_url: string | null;
  install_command: string | null;
  version: string | null;
  size: string | null;
  status: string;
  created_at: string;
  user_id: string;
}

export default function AdminPanel() {
  const { user, loading, isStaffOrHigher } = useAuth();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<ToolSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [rejectionReasons, setRejectionReasons] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!loading && (!user || !isStaffOrHigher)) {
      navigate("/");
    }
  }, [user, loading, isStaffOrHigher, navigate]);

  useEffect(() => {
    if (isStaffOrHigher) {
      fetchSubmissions();
    }
  }, [isStaffOrHigher]);

  const fetchSubmissions = async () => {
    const { data, error } = await supabase
      .from("tool_submissions")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setSubmissions(data);
    }
    setIsLoading(false);
  };

  const handleApprove = async (id: string) => {
    setProcessingId(id);
    const { error } = await supabase
      .from("tool_submissions")
      .update({ 
        status: "approved",
        reviewed_by: user?.id,
        reviewed_at: new Date().toISOString()
      })
      .eq("id", id);

    if (error) {
      toast.error("Erro ao aprovar");
    } else {
      toast.success("Ferramenta aprovada!");
      fetchSubmissions();
    }
    setProcessingId(null);
  };

  const handleReject = async (id: string) => {
    setProcessingId(id);
    const { error } = await supabase
      .from("tool_submissions")
      .update({ 
        status: "rejected",
        reviewed_by: user?.id,
        reviewed_at: new Date().toISOString(),
        rejection_reason: rejectionReasons[id] || null
      })
      .eq("id", id);

    if (error) {
      toast.error("Erro ao rejeitar");
    } else {
      toast.success("Ferramenta rejeitada");
      fetchSubmissions();
    }
    setProcessingId(null);
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

  const pendingSubmissions = submissions.filter(s => s.status === "pending");
  const reviewedSubmissions = submissions.filter(s => s.status !== "pending");

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Painel de Administração</h1>

        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-400" />
              Pendentes ({pendingSubmissions.length})
            </h2>
            
            {pendingSubmissions.length === 0 ? (
              <Card className="glass">
                <CardContent className="py-8 text-center text-muted-foreground">
                  Nenhuma submissão pendente
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {pendingSubmissions.map(sub => (
                  <Card key={sub.id} className="glass">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{sub.name}</CardTitle>
                          <div className="flex gap-2 mt-2">
                            <Badge variant="outline">{sub.platform}</Badge>
                            <Badge variant="secondary">{sub.category}</Badge>
                            {sub.version && <Badge variant="outline">v{sub.version}</Badge>}
                          </div>
                        </div>
                        <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50">
                          Pendente
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">{sub.description}</p>
                      
                      <div className="flex flex-wrap gap-4 text-sm">
                        {sub.download_url && (
                          <a 
                            href={sub.download_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-blue-400 hover:underline"
                          >
                            <ExternalLink className="h-3 w-3" />
                            Download
                          </a>
                        )}
                        {sub.size && <span>Tamanho: {sub.size}</span>}
                      </div>

                      {sub.install_command && (
                        <code className="block bg-background/50 p-2 rounded text-xs font-mono">
                          {sub.install_command}
                        </code>
                      )}

                      <div className="space-y-2">
                        <Textarea
                          placeholder="Motivo da rejeição (opcional)"
                          value={rejectionReasons[sub.id] || ""}
                          onChange={(e) => setRejectionReasons({
                            ...rejectionReasons,
                            [sub.id]: e.target.value
                          })}
                          className="bg-background/50"
                        />
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleApprove(sub.id)}
                            disabled={processingId === sub.id}
                            className="flex-1 bg-green-600 hover:bg-green-700"
                          >
                            {processingId === sub.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <>
                                <Check className="h-4 w-4 mr-2" />
                                Aprovar
                              </>
                            )}
                          </Button>
                          <Button
                            onClick={() => handleReject(sub.id)}
                            disabled={processingId === sub.id}
                            variant="destructive"
                            className="flex-1"
                          >
                            {processingId === sub.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <>
                                <X className="h-4 w-4 mr-2" />
                                Rejeitar
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">
              Histórico ({reviewedSubmissions.length})
            </h2>
            
            <div className="grid gap-2">
              {reviewedSubmissions.map(sub => (
                <Card key={sub.id} className="glass">
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium">{sub.name}</span>
                        <span className="text-muted-foreground text-sm ml-2">
                          {sub.platform} / {sub.category}
                        </span>
                      </div>
                      <Badge 
                        className={sub.status === "approved" 
                          ? "bg-green-500/20 text-green-400" 
                          : "bg-red-500/20 text-red-400"
                        }
                      >
                        {sub.status === "approved" ? "Aprovado" : "Rejeitado"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
