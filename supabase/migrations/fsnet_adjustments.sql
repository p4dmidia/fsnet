-- FS NET adjustments: align Supabase schema with front-end fields
-- Orders: add customer fields (nullable) used by FS NET forms
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS customer_name text,
  ADD COLUMN IF NOT EXISTS customer_phone text,
  ADD COLUMN IF NOT EXISTS customer_email text;

-- Affiliates: allow integration with external auth (Mocha)
ALTER TABLE public.affiliates
  ADD COLUMN IF NOT EXISTS external_user_id text;

-- Make user_id optional to allow affiliates created before Supabase auth link
ALTER TABLE public.affiliates
  ALTER COLUMN user_id DROP NOT NULL;

-- Index for fast lookup by external_user_id within organizations
CREATE INDEX IF NOT EXISTS affiliates_external_user_id_idx
  ON public.affiliates (external_user_id);

