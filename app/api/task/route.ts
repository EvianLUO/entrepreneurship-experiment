import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://cvjhbvypxjgpwtanoegn.supabase.co";
const supabaseAnonKey = "sb_publishable_XrCdbdSm-xcXPa0DLp20vQ_6uxn-fGQ";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { participant_id, result } = body;

    const { error } = await supabase.from("task_data").insert({
      participant_id,
      preliminary_plan: result.preliminary_plan ?? null,
      final_plan: result.final_plan,
      chat_log: result.chat_log,
      phase1_duration: result.phase1_duration ?? null,
      phase2_duration: result.phase2_duration ?? null,
    });

    if (error) {
      console.error("Insert error:", error);
      return NextResponse.json(
        { error: "Failed to save task data" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
