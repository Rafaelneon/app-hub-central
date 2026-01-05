import { Monitor, Terminal, Smartphone, Disc } from "lucide-react";
import { cn } from "@/lib/utils";

type Platform = "windows" | "linux" | "android" | "iso";

interface PlatformTabsProps {
  activePlatform: Platform;
  onPlatformChange: (platform: Platform) => void;
}

const platforms = [
  {
    id: "windows" as const,
    label: "Windows",
    icon: Monitor,
    gradient: "bg-gradient-windows",
    text: "text-gradient-windows",
    glow: "glow-windows",
  },
  {
    id: "linux" as const,
    label: "Linux",
    icon: Terminal,
    gradient: "bg-gradient-linux",
    text: "text-gradient-linux",
    glow: "glow-linux",
  },
  {
    id: "android" as const,
    label: "Android",
    icon: Smartphone,
    gradient: "bg-gradient-android",
    text: "text-gradient-android",
    glow: "glow-android",
  },
  {
    id: "iso" as const,
    label: "ISOs",
    icon: Disc,
    gradient: "bg-gradient-iso",
    text: "text-gradient-iso",
    glow: "glow-iso",
  },
];

export function PlatformTabs({ activePlatform, onPlatformChange }: PlatformTabsProps) {
  return (
    <div className="flex flex-wrap justify-center gap-3 py-6">
      {platforms.map((platform) => {
        const Icon = platform.icon;
        const isActive = activePlatform === platform.id;

        return (
          <button
            key={platform.id}
            onClick={() => onPlatformChange(platform.id)}
            className={cn(
              "group relative flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-300",
              "border border-transparent",
              isActive
                ? cn(platform.gradient, "text-foreground", platform.glow)
                : "glass hover:border-border text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="h-5 w-5" />
            <span className="font-medium">{platform.label}</span>
            {isActive && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-foreground/50" />
            )}
          </button>
        );
      })}
    </div>
  );
}
