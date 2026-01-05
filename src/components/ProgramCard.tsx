import { ExternalLink, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface Program {
  id: string;
  name: string;
  description: string;
  version: string;
  size: string;
  downloadUrl: string;
  installCommand?: string;
  icon: string;
}

interface ProgramCardProps {
  program: Program;
  platform: "windows" | "linux" | "android" | "iso";
}

const platformStyles = {
  windows: {
    glow: "hover:glow-windows",
    border: "hover:border-windows/50",
    button: "bg-gradient-windows hover:opacity-90",
    text: "text-windows",
  },
  linux: {
    glow: "hover:glow-linux",
    border: "hover:border-linux/50",
    button: "bg-gradient-linux hover:opacity-90",
    text: "text-linux",
  },
  android: {
    glow: "hover:glow-android",
    border: "hover:border-android/50",
    button: "bg-gradient-android hover:opacity-90",
    text: "text-android",
  },
  iso: {
    glow: "hover:glow-iso",
    border: "hover:border-iso/50",
    button: "bg-gradient-iso hover:opacity-90",
    text: "text-iso",
  },
};

export function ProgramCard({ program, platform }: ProgramCardProps) {
  const [copied, setCopied] = useState(false);
  const styles = platformStyles[platform];

  const handleCopy = async () => {
    if (program.installCommand) {
      await navigator.clipboard.writeText(program.installCommand);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className={cn(
        "glass rounded-xl p-5 transition-all duration-300 group",
        styles.glow,
        styles.border
      )}
    >
      <div className="flex items-start gap-4">
        <div className="text-4xl">{program.icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-semibold text-foreground truncate">
              {program.name}
            </h3>
            <span className={cn("text-xs font-mono", styles.text)}>
              v{program.version}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {program.description}
          </p>
          <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
            <span>{program.size}</span>
          </div>
        </div>
      </div>

      {program.installCommand && (
        <div className="mt-4 flex items-center gap-2 bg-background/50 rounded-lg p-2">
          <code className="text-xs font-mono text-muted-foreground flex-1 truncate">
            {program.installCommand}
          </code>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 shrink-0"
            onClick={handleCopy}
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-android" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </Button>
        </div>
      )}

      <div className="mt-4 flex gap-2">
        <Button
          asChild
          className={cn(
            "flex-1 text-sm font-medium transition-opacity",
            styles.button,
            "text-foreground"
          )}
        >
          <a href={program.downloadUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4 mr-2" />
            Download
          </a>
        </Button>
      </div>
    </div>
  );
}
