-- FS NET: adicionar colunas em orders para fluxo manual de vendas
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS customer_name text,
  ADD COLUMN IF NOT EXISTS customer_phone text,
  ADD COLUMN IF NOT EXISTS customer_address text,
  ADD COLUMN IF NOT EXISTS plan_name text,
  ADD COLUMN IF NOT EXISTS commission_amount numeric,
  ADD COLUMN IF NOT EXISTS referred_by_code text;

