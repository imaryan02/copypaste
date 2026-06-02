-- Tighten public paste access and add the visitor counter used by the footer.

DROP POLICY IF EXISTS "Allow public access to pastes" ON pastes;
DROP POLICY IF EXISTS "Allow public read access to pastes" ON pastes;
DROP POLICY IF EXISTS "Allow public insert access to pastes" ON pastes;
DROP POLICY IF EXISTS "Allow public update access to pastes" ON pastes;

CREATE POLICY "Allow public read access to pastes"
  ON pastes
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert access to pastes"
  ON pastes
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update access to pastes"
  ON pastes
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'pastes'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE pastes;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS visit_counts (
  id integer PRIMARY KEY DEFAULT 1,
  count integer NOT NULL DEFAULT 0,
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT visit_counts_singleton CHECK (id = 1)
);

INSERT INTO visit_counts (id, count)
VALUES (1, 0)
ON CONFLICT (id) DO NOTHING;

ALTER TABLE visit_counts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to visit counts" ON visit_counts;

CREATE POLICY "Allow public read access to visit counts"
  ON visit_counts
  FOR SELECT
  TO public
  USING (true);

CREATE OR REPLACE FUNCTION increment_count()
RETURNS void AS $$
BEGIN
  INSERT INTO visit_counts (id, count, updated_at)
  VALUES (1, 1, now())
  ON CONFLICT (id)
  DO UPDATE SET
    count = visit_counts.count + 1,
    updated_at = now();
END;
$$ language 'plpgsql' security definer set search_path = public;

GRANT EXECUTE ON FUNCTION increment_count() TO public;
