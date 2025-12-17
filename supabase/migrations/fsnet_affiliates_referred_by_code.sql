-- FS NET: adicionar coluna de código de indicação em affiliates
ALTER TABLE public.affiliates
  ADD COLUMN IF NOT EXISTS referred_by_code text;

