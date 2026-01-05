import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProgramCard } from "./ProgramCard";
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

interface Category {
  name: string;
  programs: Program[];
}

interface PlatformData {
  platform: string;
  icon: string;
  categories: Category[];
}

interface PlatformSectionProps {
  data: PlatformData;
  platform: "windows" | "linux" | "android" | "iso";
}

const platformStyles = {
  windows: {
    gradient: "text-gradient-windows",
    button: "data-[active=true]:bg-gradient-windows data-[active=true]:text-foreground",
  },
  linux: {
    gradient: "text-gradient-linux",
    button: "data-[active=true]:bg-gradient-linux data-[active=true]:text-foreground",
  },
  android: {
    gradient: "text-gradient-android",
    button: "data-[active=true]:bg-gradient-android data-[active=true]:text-foreground",
  },
  iso: {
    gradient: "text-gradient-iso",
    button: "data-[active=true]:bg-gradient-iso data-[active=true]:text-foreground",
  },
};

export function PlatformSection({ data, platform }: PlatformSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const styles = platformStyles[platform];

  const filteredCategories = useMemo(() => {
    return data.categories
      .map((category) => ({
        ...category,
        programs: category.programs.filter(
          (program) =>
            program.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            program.description.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      }))
      .filter((category) => category.programs.length > 0);
  }, [data.categories, searchQuery]);

  const displayedCategories = useMemo(() => {
    if (selectedCategory) {
      return filteredCategories.filter((cat) => cat.name === selectedCategory);
    }
    return filteredCategories;
  }, [filteredCategories, selectedCategory]);

  const totalPrograms = data.categories.reduce(
    (acc, cat) => acc + cat.programs.length,
    0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className={cn("text-2xl font-bold", styles.gradient)}>
            {data.platform}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {totalPrograms} programas disponíveis
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar programas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-secondary/50 border-border"
          />
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant="secondary"
          size="sm"
          data-active={selectedCategory === null}
          onClick={() => setSelectedCategory(null)}
          className={cn(
            "transition-all",
            styles.button
          )}
        >
          Todos
        </Button>
        {data.categories.map((category) => (
          <Button
            key={category.name}
            variant="secondary"
            size="sm"
            data-active={selectedCategory === category.name}
            onClick={() => setSelectedCategory(category.name)}
            className={cn(
              "transition-all",
              styles.button
            )}
          >
            {category.name}
          </Button>
        ))}
      </div>

      {/* Programs Grid */}
      {displayedCategories.length > 0 ? (
        <div className="space-y-8">
          {displayedCategories.map((category) => (
            <div key={category.name}>
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
                {category.name}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.programs.map((program) => (
                  <ProgramCard
                    key={program.id}
                    program={program}
                    platform={platform}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            Nenhum programa encontrado para "{searchQuery}"
          </p>
        </div>
      )}
    </div>
  );
}
