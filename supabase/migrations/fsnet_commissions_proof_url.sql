-- FS NET: adicionar coluna de comprovante em commissions
ALTER TABLE public.commissions
  ADD COLUMN IF NOT EXISTS proof_url text;

