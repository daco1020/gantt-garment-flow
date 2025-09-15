import { Calendar, Download, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import NewReferenceDialog from "./NewReferenceDialog";

const Header = () => {
  return (
    <header className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-semibold text-foreground">GanttFlow</h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Lanzamiento: 10 de septiembre</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Importar CSV
            </Button>
            <NewReferenceDialog />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;