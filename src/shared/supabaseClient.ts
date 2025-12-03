import { createClient } from "@supabase/supabase-js";

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string) || "https://vmhqgniynjkiyuuqfdzb.supabase.co";
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZtaHFnbml5bmpraXl1dXFmZHpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2ODI4MTIsImV4cCI6MjA3OTI1ODgxMn0.Vh-39UY-LwJiXbt3Ip6INledlB-A3bF_IXcuRQmp7LY";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

