import { distributeNetworkBonus } from "@/shared/mmn";

export async function apiDistributeNetworkBonus(input: { payer_id: string; organization_id?: string }) {
  return distributeNetworkBonus(input.payer_id);
}

