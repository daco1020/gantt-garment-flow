-- Agregar columna distribucion a la tabla references
ALTER TABLE public.references 
ADD COLUMN distribucion TEXT;