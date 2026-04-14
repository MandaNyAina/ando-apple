-- ============================================
-- ASE TECH — Reset & Reseed
-- Drops all tables and re-runs seed
-- WARNING: This deletes all data!
-- ============================================

-- Drop policies first
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN
    SELECT policyname, tablename, schemaname
    FROM pg_policies
    WHERE schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', pol.policyname, pol.schemaname, pol.tablename);
  END LOOP;
END $$;

-- Drop storage policies
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN
    SELECT policyname FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects'
    AND policyname LIKE '%product-images%' OR policyname LIKE '%site-assets%'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', pol.policyname);
  END LOOP;
END $$;

-- Drop tables
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS site_content CASCADE;
DROP TABLE IF EXISTS settings CASCADE;
DROP TABLE IF EXISTS pages CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
