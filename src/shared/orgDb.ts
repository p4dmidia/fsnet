import { supabase } from "./supabaseClient";
import { FS_ORGANIZATION_ID } from "./tenant";

export async function orgSelect<T = any>(
  table: string,
  columns: string = "*",
  apply?: (q: any) => any
): Promise<T[]> {
  // Always filter by organization_id
  let q: any = (supabase.from(table) as any).select(columns).eq("organization_id", FS_ORGANIZATION_ID);
  if (apply) q = apply(q);
  const { data, error } = await q;
  if (error) throw error;
  return data as T[];
}

export async function orgInsert<T = any>(table: string, values: Record<string, any>): Promise<T> {
  const payload = { ...values, organization_id: FS_ORGANIZATION_ID };
  const { data, error } = await (supabase.from(table) as any)
    .insert(payload)
    .select()
    .single();
  if (error) throw error;
  return data as T;
}

export async function orgUpdate<T = any>(
  table: string,
  match: Record<string, any>,
  values: Record<string, any>
): Promise<T[]> {
  const { data, error } = await (supabase.from(table) as any)
    .update(values)
    .eq("organization_id", FS_ORGANIZATION_ID)
    .match(match)
    .select();
  if (error) throw error;
  return data as T[];
}

export async function orgDelete(
  table: string,
  match: Record<string, any>
): Promise<void> {
  const { error } = await (supabase.from(table) as any)
    .delete()
    .eq("organization_id", FS_ORGANIZATION_ID)
    .match(match);
  if (error) throw error;
}

