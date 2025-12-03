import z from "zod";

export const AffiliateSchema = z.object({
  id: z.number(),
  user_id: z.string(),
  full_name: z.string().nullable(),
  phone: z.string().nullable(),
  commission_rate: z.number(),
  total_sales: z.number(),
  total_commission: z.number(),
  is_active: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Affiliate = z.infer<typeof AffiliateSchema>;

export const SaleSchema = z.object({
  id: z.number(),
  affiliate_id: z.number(),
  customer_name: z.string(),
  customer_phone: z.string(),
  customer_email: z.string().nullable(),
  plan_name: z.string(),
  plan_value: z.number(),
  commission_amount: z.number(),
  status: z.string(),
  sale_date: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Sale = z.infer<typeof SaleSchema>;

export const CreateAffiliateSchema = z.object({
  full_name: z.string().min(1, "Nome completo é obrigatório"),
  phone: z.string().min(1, "Telefone é obrigatório"),
});

export const CreateSaleSchema = z.object({
  customer_name: z.string().min(1, "Nome do cliente é obrigatório"),
  customer_phone: z.string().min(1, "Telefone do cliente é obrigatório"),
  customer_email: z.string().email().optional().or(z.literal("")),
  plan_name: z.string().min(1, "Nome do plano é obrigatório"),
  plan_value: z.number().positive("Valor do plano deve ser maior que zero"),
  sale_date: z.string().optional(),
});
