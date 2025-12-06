-- FS NET: adicionar campos de observação e data de pagamento em commissions
ALTER TABLE public.commissions
  ADD COLUMN IF NOT EXISTS admin_note text,
  ADD COLUMN IF NOT EXISTS payment_date timestamp with time zone;

