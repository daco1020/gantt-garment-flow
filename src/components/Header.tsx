import { Calendar, Download, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import NewReferenceDialog from "./NewReferenceDialog";
import { useLaunchDate } from "@/contexts/LaunchDateContext";

const Header = () => {
  const { launchDate, setLaunchDate } = useLaunchDate();

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
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground",
                  !launchDate && "text-muted-foreground"
                )}
              >
                <Calendar className="h-4 w-4" />
                <span>
                  Lanzamiento: {launchDate ? format(launchDate, "d 'de' MMMM", { locale: undefined }) : "Seleccionar fecha"}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={launchDate}
                onSelect={setLaunchDate}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
          
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