import { Download, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from "xlsx";
import NewReferenceDialog from "./NewReferenceDialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const Header = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [showImportDialog, setShowImportDialog] = useState(false);

  const handleImportClick = () => {
    setShowImportDialog(true);
  };

  const handleProceedToFileSelect = () => {
    setShowImportDialog(false);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    console.log("File selected:", file?.name);
    
    if (!file) {
      console.log("No file selected");
      return;
    }

    try {
      console.log("Reading file...");
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      
      console.log("Parsed data:", jsonData);

      const references = jsonData.map((row: any) => ({
        referencia: row.referencia || row.Referencia,
        cantidad: parseInt(row.cantidad || row.Cantidad) || 0,
        curva: row.curva || row.Curva,
        color: row.color || row.Color || null,
        cantidad_colores: row.cantidad_colores || row["Cantidad Colores"] || null,
        lanzamiento_capsula: row.lanzamiento_capsula || row["Lanzamiento Capsula"] || null,
        ingreso_a_bodega: row.ingreso_a_bodega || row["Ingreso a Bodega"] || null,
        fecha_desbloqueo: row.fecha_desbloqueo || row["Fecha Desbloqueo"] || null,
        imagen_url: row.imagen_url || row["Imagen URL"] || null,
      }));

      console.log("References to insert:", references);

      const { error } = await supabase
        .from("references")
        .insert(references);

      if (error) throw error;

      toast({
        title: "Importación exitosa",
        description: `Se importaron ${references.length} referencias correctamente.`,
      });

      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Reload page to show new data
      window.location.reload();
    } catch (error: any) {
      console.error("Error importing CSV:", error);
      toast({
        title: "Error al importar",
        description: error?.message || "Hubo un problema al importar el archivo CSV.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-semibold text-foreground">GanttFlow</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileChange}
              className="hidden"
            />
            <Button variant="outline" size="sm" className="gap-2" onClick={handleImportClick}>
              <Download className="h-4 w-4" />
              Importar CSV
            </Button>
            <NewReferenceDialog />
          </div>
        </div>
      </header>

      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Formato del archivo CSV</DialogTitle>
            <DialogDescription>
              El archivo debe contener las siguientes columnas:
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-3">
            <div className="border border-border rounded-md p-4">
              <h4 className="font-semibold text-sm mb-2">Columnas requeridas:</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li><span className="font-medium text-foreground">referencia</span> - Código de referencia</li>
                <li><span className="font-medium text-foreground">cantidad</span> - Cantidad numérica</li>
                <li><span className="font-medium text-foreground">curva</span> - Tallas (ej: XL-XXL-XXXL)</li>
              </ul>
            </div>
            
            <div className="border border-border rounded-md p-4">
              <h4 className="font-semibold text-sm mb-2">Columnas opcionales:</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li><span className="font-medium text-foreground">color</span> - Color del producto</li>
                <li><span className="font-medium text-foreground">cantidad_colores</span> - Número de colores</li>
                <li><span className="font-medium text-foreground">lanzamiento_capsula</span> - Fecha (YYYY-MM-DD)</li>
                <li><span className="font-medium text-foreground">ingreso_a_bodega</span> - Fecha (YYYY-MM-DD)</li>
                <li><span className="font-medium text-foreground">fecha_desbloqueo</span> - Fecha (YYYY-MM-DD)</li>
                <li><span className="font-medium text-foreground">imagen_url</span> - URL de la imagen</li>
              </ul>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowImportDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleProceedToFileSelect}>
              Continuar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Header;