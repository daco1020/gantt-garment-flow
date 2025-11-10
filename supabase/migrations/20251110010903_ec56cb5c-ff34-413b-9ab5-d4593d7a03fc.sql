-- Fix conflicting check constraint name and values on public.references.curva
ALTER TABLE public.references
  DROP CONSTRAINT IF EXISTS valid_curva_values,
  DROP CONSTRAINT IF EXISTS references_curva_check;

-- Recreate a single canonical constraint with the updated allowed values
ALTER TABLE public.references
  ADD CONSTRAINT valid_curva_values CHECK (
    curva IN (
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
    )
  );