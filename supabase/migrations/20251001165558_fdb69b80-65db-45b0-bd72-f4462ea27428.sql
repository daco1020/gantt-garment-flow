-- Create storage bucket for reference images
INSERT INTO storage.buckets (id, name, public)
VALUES ('reference-images', 'reference-images', true);

-- Add image_url column to references table
ALTER TABLE public.references
ADD COLUMN imagen_url TEXT;

-- Create storage policies for reference images
CREATE POLICY "Public can view reference images"
ON storage.objects FOR SELECT
USING (bucket_id = 'reference-images');

CREATE POLICY "Public can upload reference images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'reference-images');

CREATE POLICY "Public can update reference images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'reference-images');

CREATE POLICY "Public can delete reference images"
ON storage.objects FOR DELETE
USING (bucket_id = 'reference-images');