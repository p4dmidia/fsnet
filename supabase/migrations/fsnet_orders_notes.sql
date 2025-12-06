-- FS NET: adicionar coluna de observações em orders
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS notes text;

