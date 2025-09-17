-- Create references table for storing reference data
CREATE TABLE public.references (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  referencia TEXT NOT NULL UNIQUE,
  ingreso_a_bodega DATE,
  curva TEXT NOT NULL,
  cantidad INTEGER NOT NULL CHECK (cantidad > 0),
  lanzamiento_capsula DATE,
  fecha_desbloqueo DATE,
  dias_desbloqueado INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security (optional for public data)
ALTER TABLE public.references ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public access for now (adjust based on authentication needs)
CREATE POLICY "Allow public read access on references" 
ON public.references 
FOR SELECT 
USING (true);

CREATE POLICY "Allow public insert access on references" 
ON public.references 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public update access on references" 
ON public.references 
FOR UPDATE 
USING (true);

CREATE POLICY "Allow public delete access on references" 
ON public.references 
FOR DELETE 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_references_updated_at
BEFORE UPDATE ON public.references
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add constraint for curva values
ALTER TABLE public.references 
ADD CONSTRAINT valid_curva_values 
CHECK (curva IN ('XS-S-M-L-XL', 'S-M-L-XL', 'M-L-XL-XXL', 'ONE-SIZE'));