CREATE TABLE IF NOT EXISTS email_signups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb
);

ALTER TABLE email_signups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert email signups"
  ON email_signups FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Service role can read signups"
  ON email_signups FOR SELECT TO authenticated USING (true);
