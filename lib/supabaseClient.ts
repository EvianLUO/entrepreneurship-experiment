"use client";

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://cvjhbvypxjgpwtanoegn.supabase.co";
const supabaseAnonKey = "sb_publishable_XrCdbdSm-xcXPa0DLp20vQ_6uxn-fGQ";

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabaseBrowserClient = createClient(supabaseUrl, supabaseAnonKey);
