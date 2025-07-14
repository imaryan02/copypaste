-- Enable pgcrypto extension for uuid generation (if not already present)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create the pastes table
CREATE TABLE IF NOT EXISTS pastes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id text NOT NULL,
  content text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create unique index on room_id to ensure one paste per room
CREATE UNIQUE INDEX IF NOT EXISTS pastes_room_id_idx ON pastes(room_id);

-- Enable Row Level Security
ALTER TABLE pastes ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public access (no authentication required)
CREATE POLICY "Allow public access to pastes"
  ON pastes
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Enable realtime for the pastes table
ALTER PUBLICATION supabase_realtime ADD TABLE pastes;

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_pastes_updated_at
  BEFORE UPDATE ON pastes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
