-- Drop existing constraint if it exists
ALTER TABLE public.references DROP CONSTRAINT IF EXISTS references_curva_check;

-- Add new constraint with all valid curva values including the new ones
ALTER TABLE public.references ADD CONSTRAINT references_curva_check 
CHECK (curva IN (
  'XS-S-M-L-XL',
  'S-M-L-XL',
  'S-M-L',
  'XS-S-M-L',
  'XL-XXL-XXXL',
  'XL-XXL-3XL',
  '28-30-32-34-36',
  '28-30-32-34-36-40',
  '06-08-10-12',
  '06-08-10-12-14',
  '14-16-18-20',
  '14-16-18-20-22',
  'ONE-SIZE',
  'M-L-XL-XXL'
));