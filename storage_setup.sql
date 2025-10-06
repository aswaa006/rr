-- Supabase Storage Setup for Campus Hero Rides
-- Run this in your Supabase SQL Editor after creating the project

-- 1. Create the storage bucket (if not already created)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'driver-documents',
  'driver-documents',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
) ON CONFLICT (id) DO NOTHING;

-- 2. Create storage policies for public access to driver documents
-- Allow anyone to view files in the driver-documents bucket
CREATE POLICY "Public Access for Driver Documents" ON storage.objects
FOR SELECT USING (bucket_id = 'driver-documents');

-- Allow authenticated users to upload files to driver-documents bucket
CREATE POLICY "Authenticated Upload for Driver Documents" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'driver-documents' 
  AND auth.role() = 'authenticated'
);

-- Allow users to update their own uploaded files
CREATE POLICY "Users can update own files" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'driver-documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own uploaded files
CREATE POLICY "Users can delete own files" ON storage.objects
FOR DELETE USING (
  bucket_id = 'driver-documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- 3. Grant necessary permissions
GRANT USAGE ON SCHEMA storage TO authenticated;
GRANT ALL ON storage.objects TO authenticated;
GRANT ALL ON storage.buckets TO authenticated;

-- 4. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_storage_objects_bucket_id ON storage.objects(bucket_id);
CREATE INDEX IF NOT EXISTS idx_storage_objects_name ON storage.objects(name);
