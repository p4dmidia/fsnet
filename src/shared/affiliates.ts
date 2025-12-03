import { orgSelect, orgInsert } from "./orgDb";

export function generateReferralCode(full_name: string) {
  const first = full_name.trim().split(" ")[0].replace(/[^A-Za-zÀ-ÿ]/g, "").slice(0, 4).toUpperCase();
  const num = Math.floor(10 + Math.random() * 90);
  return `${first}${num}`;
}

export async function getAffiliateByExternalUserId(externalUserId: string) {
  const rows = await orgSelect("affiliates", "*", (q: any) => q.eq("external_user_id", externalUserId));
  return rows[0] ?? null;
}

export async function getAffiliateByReferralCode(code: string) {
  const rows = await orgSelect("affiliates", "*", (q: any) => q.eq("referral_code", code));
  return rows[0] ?? null;
}

export async function getAffiliateByUserId(userId: string) {
  const rows = await orgSelect("affiliates", "*", (q: any) => q.eq("user_id", userId));
  return rows[0] ?? null;
}

export async function createAffiliateForExternalUser(externalUserId: string, full_name: string, phone: string) {
  const referral_code = generateReferralCode(full_name);
  return orgInsert("affiliates", { external_user_id: externalUserId, full_name, phone, referral_code });
}

export async function createAffiliateManual(input: {
  full_name: string;
  cpf?: string;
  phone?: string;
  email?: string;
  pix_key?: string;
}) {
  const referral_code = generateReferralCode(input.full_name);
  return orgInsert("affiliates", { full_name: input.full_name, cpf: input.cpf ?? null, phone: input.phone ?? null, referral_code, pix_key: input.pix_key ?? null });
}

