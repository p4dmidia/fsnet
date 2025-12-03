import { supabase } from "./supabaseClient";
import { FS_ORGANIZATION_ID } from "./tenant";

export async function getSession() {
  const { data } = await supabase.auth.getSession();
  return data.session ?? null;
}

export async function signInWithPassword(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data.session ?? null;
}

export async function signOut() {
  await supabase.auth.signOut();
}

export async function getProfileByUserId(userId: string) {
  const { data, error } = await (supabase.from("profiles") as any)
    .select("*")
    .eq("user_id", userId)
    .eq("organization_id", FS_ORGANIZATION_ID)
    .single();
  if (error) throw error;
  return data;
}

export async function isAdminOfFSNet(userId: string) {
  try {
    const profile = await getProfileByUserId(userId);
    return profile?.role === "admin";
  } catch {
    return false;
  }
}

export async function signUpWithEmailPassword(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return data.user?.id ?? null;
}

