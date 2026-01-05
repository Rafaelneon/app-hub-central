import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Plus, Loader2 } from "lucide-react";

const platforms = [
  { value: "windows", label: "Windows" },
  { value: "linux", label: "Linux" },
  { value: "android", label: "Android" },
  { value: "iso", label: "ISO" }
];

const categories = {
  windows: ["Navegadores", "Desenvolvimento", "Mídia", "Utilitários", "Escritório", "Comunicação", "Segurança"],
  linux: ["Navegadores", "Desenvolvimento", "Mídia", "Utilitários", "Escritório", "Sistema"],
  android: ["Navegadores", "Redes Sociais", "Mídia", "Utilitários", "Produtividade", "Segurança"],
  iso: ["Windows", "Linux", "Utilitários", "Recuperação"]
};

export function SubmitToolDialog() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    platform: "windows" as keyof typeof categories,
    download_url: "",
    install_command: "",
    icon: "",
    version: "",
    size: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Você precisa estar logado para enviar uma ferramenta");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("tool_submissions")
        .insert({
          user_id: user.id,
          name: formData.name,
          description: formData.description,
          category: formData.category,
          platform: formData.platform,
          download_url: formData.download_url || null,
          install_command: formData.install_command || null,
          icon: formData.icon || null,
          version: formData.version || null,
          size: formData.size || null
        });

      if (error) throw error;

      toast.success("Ferramenta enviada para revisão!");
      setOpen(false);
      setFormData({
        name: "",
        description: "",
        category: "",
        platform: "windows",
        download_url: "",
        install_command: "",
        icon: "",
        version: "",
        size: ""
      });
    } catch (error: any) {
      toast.error(error.message || "Erro ao enviar ferramenta");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Plus className="h-4 w-4" />
          Sugerir Ferramenta
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] glass">
        <DialogHeader>
          <DialogTitle>Sugerir Nova Ferramenta</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="platform">Plataforma</Label>
              <Select
                value={formData.platform}
                onValueChange={(value: keyof typeof categories) => 
                  setFormData({ ...formData, platform: value, category: "" })
                }
              >
                <SelectTrigger className="bg-background/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {platforms.map(p => (
                    <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger className="bg-background/50">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {categories[formData.platform].map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Nome da Ferramenta</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-background/50"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-background/50"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="version">Versão</Label>
              <Input
                id="version"
                value={formData.version}
                onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                className="bg-background/50"
                placeholder="ex: 1.0.0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="size">Tamanho</Label>
              <Input
                id="size"
                value={formData.size}
                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                className="bg-background/50"
                placeholder="ex: 50 MB"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="download_url">URL de Download</Label>
            <Input
              id="download_url"
              type="url"
              value={formData.download_url}
              onChange={(e) => setFormData({ ...formData, download_url: e.target.value })}
              className="bg-background/50"
              placeholder="https://..."
            />
          </div>

          {(formData.platform === "linux") && (
            <div className="space-y-2">
              <Label htmlFor="install_command">Comando de Instalação</Label>
              <Input
                id="install_command"
                value={formData.install_command}
                onChange={(e) => setFormData({ ...formData, install_command: e.target.value })}
                className="bg-background/50 font-mono text-sm"
                placeholder="sudo apt install ..."
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="icon">Ícone (emoji ou URL)</Label>
            <Input
              id="icon"
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              className="bg-background/50"
              placeholder="🔧 ou https://..."
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-windows"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Enviar para Revisão"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
