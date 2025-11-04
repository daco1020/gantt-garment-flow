-- Add color and cantidad_colores columns to references table
ALTER TABLE public.references 
ADD COLUMN color TEXT,
ADD COLUMN cantidad_colores TEXT;