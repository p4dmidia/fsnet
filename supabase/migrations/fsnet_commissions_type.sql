-- FS NET: adicionar coluna de tipo em commissions
ALTER TABLE public.commissions
  ADD COLUMN IF NOT EXISTS type text;

