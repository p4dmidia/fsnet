import { confirmMonthlyPayment } from "@/shared/mmn";

export async function apiConfirmMonthlyPayment(input: { payer_id: string; organization_id?: string }) {
  return confirmMonthlyPayment(input.payer_id);
}

