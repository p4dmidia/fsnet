import { orgInsert } from "./orgDb";

export interface NewOrderInput {
  affiliate_id: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string | null;
  amount: number;
  status?: string;
  subscription_plan_id?: string | null;
  plan_name?: string;
  referred_by_code?: string;
  commission_amount?: number;
  notes?: string | null;
}

export async function createOrder(input: NewOrderInput) {
  const payload = {
    affiliate_id: input.affiliate_id,
    customer_name: input.customer_name,
    customer_phone: input.customer_phone,
    customer_email: input.customer_email ?? null,
    amount: input.amount,
    status: input.status ?? "pending",
    subscription_plan_id: input.subscription_plan_id ?? null,
    plan_name: input.plan_name,
    referred_by_code: input.referred_by_code,
    commission_amount: input.commission_amount ?? null,
    notes: input.notes ?? null,
  };
  return orgInsert("orders", payload);
}

export async function createCommission(params: {
  affiliate_id: string;
  order_id: string;
  amount: number;
  level?: number;
  status?: string;
}) {
  const payload = {
    affiliate_id: params.affiliate_id,
    order_id: params.order_id,
    amount: params.amount,
    level: params.level ?? 1,
    status: params.status ?? "pending",
  };
  return orgInsert("commissions", payload);
}

