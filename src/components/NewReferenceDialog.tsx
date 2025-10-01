import { useState } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useLaunchDate } from "@/contexts/LaunchDateContext";

interface NewReferenceForm {
  referencia: string;
  ingresoABodega?: string;
  curva: string;
  cantidad: number;
  imagen?: FileList;
}

const curvaOptions = [
  { value: "XS-S-M-L-XL", label: "XS-S-M-L-XL" },
  { value: "S-M-L-XL", label: "S-M-L-XL" },
  { value: "M-L-XL-XXL", label: "M-L-XL-XXL" },
  { value: "ONE-SIZE", label: "Talla Única" }
];

const NewReferenceDialog = () => {
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const { launchDate } = useLaunchDate();
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<NewReferenceForm>();

  const selectedCurva = watch("curva");

  const onSubmit = async (data: NewReferenceForm) => {
    try {
      setUploading(true);
      let imagenUrl = null;

      // Upload image if selected
      if (data.imagen && data.imagen.length > 0) {
        const file = data.imagen[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('reference-images')
          .upload(filePath, file);

        if (uploadError) {
          console.error('Error uploading image:', uploadError);
          toast({
            title: "Error",
            description: "Hubo un error al subir la imagen. Continuando sin imagen.",
            variant: "destructive"
          });
        } else {
          const { data: { publicUrl } } = supabase.storage
            .from('reference-images')
            .getPublicUrl(filePath);
          imagenUrl = publicUrl;
        }
      }

      const { error } = await supabase
        .from('references')
        .insert({
          referencia: data.referencia,
          ingreso_a_bodega: data.ingresoABodega || null,
          lanzamiento_capsula: launchDate?.toISOString().split('T')[0] || null,
          curva: data.curva,
          cantidad: data.cantidad,
          imagen_url: imagenUrl
        });

      if (error) {
        console.error('Error creating reference:', error);
        toast({
          title: "Error",
          description: "Hubo un error al crear la referencia. Por favor, intenta de nuevo.",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Referencia creada",
        description: `La referencia ${data.referencia} ha sido creada exitosamente.`,
      });
      reset();
      setOpen(false);
    } catch (error) {
      console.error('Error creating reference:', error);
      toast({
        title: "Error",
        description: "Hubo un error inesperado. Por favor, intenta de nuevo.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2 bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4" />
          Nueva Referencia
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Crear Nueva Referencia</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="referencia">Referencia *</Label>
            <Input
              id="referencia"
              placeholder="Ej: XiI5bZiVniqX9ZCP"
              {...register("referencia", { 
                required: "La referencia es obligatoria" 
              })}
            />
            {errors.referencia && (
              <p className="text-sm text-destructive">{errors.referencia.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="ingresoABodega">Ingreso a Bodega</Label>
            <Input
              id="ingresoABodega"
              type="date"
              {...register("ingresoABodega")}
            />
            <p className="text-xs text-muted-foreground">Campo opcional</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="curva">Curva *</Label>
            <Select onValueChange={(value) => setValue("curva", value)} value={selectedCurva}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una curva" />
              </SelectTrigger>
              <SelectContent>
                {curvaOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.curva && (
              <p className="text-sm text-destructive">{errors.curva.message}</p>
            )}
            <input
              type="hidden"
              {...register("curva", { required: "La curva es obligatoria" })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cantidad">Cantidad *</Label>
            <Input
              id="cantidad"
              type="number"
              min="1"
              placeholder="Ej: 75"
              {...register("cantidad", { 
                required: "La cantidad es obligatoria",
                min: { value: 1, message: "La cantidad debe ser mayor a 0" },
                valueAsNumber: true
              })}
            />
            {errors.cantidad && (
              <p className="text-sm text-destructive">{errors.cantidad.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="imagen">Imagen de Referencia</Label>
            <div className="flex items-center gap-2">
              <Input
                id="imagen"
                type="file"
                accept="image/*"
                {...register("imagen")}
                className="cursor-pointer"
              />
              <Upload className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground">Campo opcional - Formatos: JPG, PNG, WEBP</p>
          </div>

          <div className="flex justify-end gap-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              disabled={uploading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={uploading}>
              {uploading ? "Subiendo..." : "Crear Referencia"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewReferenceDialog;