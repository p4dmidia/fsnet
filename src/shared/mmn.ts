import { orgInsert, orgSelect } from "./orgDb";

export async function confirmMonthlyPayment(payerId: string) {
  const payerRows = await orgSelect("affiliates", "*", (q: any) => q.eq("id", payerId));
  const payer = payerRows[0];
  if (!payer) throw new Error("Afiliado pagador não encontrado");
  const uplines: any[] = [];
  let currentCode: string | null = payer.referred_by_code || null;
  for (let level = 1; level <= 3 && currentCode; level++) {
    const uRows = await orgSelect("affiliates", "*", (q: any) => q.eq("referral_code", currentCode));
    const u = uRows[0] || null;
    uplines.push(u);
    currentCode = u?.referred_by_code || null;
  }
  const amounts = [1.5, 0.9, 0.6];
  for (let i = 0; i < uplines.length; i++) {
    const receiver = uplines[i];
    if (receiver && receiver.is_client === true) {
      await orgInsert("commissions", {
        affiliate_id: receiver.id,
        amount: amounts[i],
        status: "paid",
        type: "recurring",
        description: `Comissão recorrente - Nível ${i + 1} do ${payer.referral_code || ""}`,
        order_id: null,
      });
    }
  }
  return { distributed: uplines.filter((u) => !!u && u.is_client === true).length };
}

export async function distributeNetworkBonus(payerId: string) {
  return confirmMonthlyPayment(payerId);
}
