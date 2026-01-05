import { useState } from "react";
import { Header } from "@/components/Header";
import { PlatformTabs } from "@/components/PlatformTabs";
import { PlatformSection } from "@/components/PlatformSection";

import windowsData from "@/data/windows.json";
import linuxData from "@/data/linux.json";
import androidData from "@/data/android.json";
import isoData from "@/data/iso.json";

type Platform = "windows" | "linux" | "android" | "iso";

const platformData = {
  windows: windowsData,
  linux: linuxData,
  android: androidData,
  iso: isoData,
};

const Index = () => {
  const [activePlatform, setActivePlatform] = useState<Platform>("windows");

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Encontre o <span className="text-gradient-windows">Software</span> Ideal
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Repositório agregador de programas para Windows, Linux e Android.
          Downloads diretos, comandos de instalação e ISOs em um só lugar.
        </p>
      </section>

      {/* Platform Tabs */}
      <div className="container mx-auto px-4">
        <PlatformTabs
          activePlatform={activePlatform}
          onPlatformChange={setActivePlatform}
        />
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <PlatformSection
          data={platformData[activePlatform]}
          platform={activePlatform}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-16">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-sm text-muted-foreground">
            SoftIndex © 2025 — Repositório de software agregador
          </p>
          <p className="text-xs text-muted-foreground/60 mt-2">
            Todos os links direcionam para as páginas oficiais dos desenvolvedores
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
