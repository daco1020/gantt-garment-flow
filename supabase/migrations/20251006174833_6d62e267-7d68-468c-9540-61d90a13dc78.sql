-- Drop the existing constraint
ALTER TABLE public.references DROP CONSTRAINT IF EXISTS valid_curva_values;

-- Add the updated constraint with all valid curva values
ALTER TABLE public.references ADD CONSTRAINT valid_curva_values 
CHECK (curva = ANY (ARRAY[
  'XS-S-M-L-XL',
  'S-M-L-XL',
  'S-M-L',
  'XL-XXL-XXXL',
  'XL-XXL-3XL',
  '28-30-32-34-36',
  '28-30-32-34-36-40',
  '06-08-10-12-14',
  'ONE-SIZE',
  'M-L-XL-XXL'
]::text[]));