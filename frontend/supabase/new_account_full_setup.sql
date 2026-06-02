-- CopyPasteGuru full Supabase setup for a new account/project.
--
-- Run this once in the new Supabase project's SQL Editor.
-- It is intentionally idempotent so it can be rerun safely.
--
-- After running it, update the frontend environment variables:
-- VITE_SUPABASE_URL=<new project URL>
-- VITE_SUPABASE_ANON_KEY=<new project anon key>

BEGIN;

-- Required for gen_random_uuid().
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Keep all app objects in public, matching the frontend Supabase client.
CREATE SCHEMA IF NOT EXISTS public;

-- Room content table. The app expects one row per room_id.
CREATE TABLE IF NOT EXISTS public.pastes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id text NOT NULL,
  content text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS pastes_room_id_idx
  ON public.pastes (room_id);

-- Keep updated_at current on every update.
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_pastes_updated_at ON public.pastes;

CREATE TRIGGER update_pastes_updated_at
  BEFORE UPDATE ON public.pastes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Visitor counter used by the footer.
CREATE TABLE IF NOT EXISTS public.visit_counts (
  id integer PRIMARY KEY DEFAULT 1,
  count integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT visit_counts_singleton CHECK (id = 1)
);

INSERT INTO public.visit_counts (id, count)
VALUES (1, 0)
ON CONFLICT (id) DO NOTHING;

CREATE OR REPLACE FUNCTION public.increment_count()
RETURNS void AS $$
BEGIN
  INSERT INTO public.visit_counts (id, count, updated_at)
  VALUES (1, 1, now())
  ON CONFLICT (id)
  DO UPDATE SET
    count = public.visit_counts.count + 1,
    updated_at = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Row level security.
ALTER TABLE public.pastes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visit_counts ENABLE ROW LEVEL SECURITY;

-- Reset legacy/current policy names so reruns do not conflict.
DROP POLICY IF EXISTS "Allow public access to pastes" ON public.pastes;
DROP POLICY IF EXISTS "Allow public read access to pastes" ON public.pastes;
DROP POLICY IF EXISTS "Allow public insert access to pastes" ON public.pastes;
DROP POLICY IF EXISTS "Allow public update access to pastes" ON public.pastes;
DROP POLICY IF EXISTS "Allow public read access to visit counts" ON public.visit_counts;

-- The app is intentionally unauthenticated:
-- users may read/create/update rooms, but cannot delete room rows.
CREATE POLICY "Allow public read access to pastes"
  ON public.pastes
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert access to pastes"
  ON public.pastes
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update access to pastes"
  ON public.pastes
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public read access to visit counts"
  ON public.visit_counts
  FOR SELECT
  TO public
  USING (true);

-- Explicit privileges for Supabase API roles.
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.pastes TO anon, authenticated;
GRANT SELECT ON public.visit_counts TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.increment_count() TO anon, authenticated;

-- Realtime support for postgres_changes subscriptions on pastes.
-- REPLICA IDENTITY FULL gives complete row payloads for updates.
ALTER TABLE public.pastes REPLICA IDENTITY FULL;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_publication
    WHERE pubname = 'supabase_realtime'
  )
  AND NOT EXISTS (
    SELECT 1
    FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'pastes'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.pastes;
  END IF;
END $$;

COMMIT;
