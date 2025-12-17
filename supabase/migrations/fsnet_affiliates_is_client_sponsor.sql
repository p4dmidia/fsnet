-- FS NET: adicionar campos de cliente e sponsor em affiliates
ALTER TABLE public.affiliates
  ADD COLUMN IF NOT EXISTS is_client boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS sponsor_code text;

