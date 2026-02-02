import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://cvjhbvypxjgpwtanoegn.supabase.co";
const supabaseAnonKey = "sb_publishable_XrCdbdSm-xcXPa0DLp20vQ_6uxn-fGQ";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { participant_id, data } = body;

    const { error } = await supabase
      .from("posttest_data")
      .insert({ participant_id, data });

    if (error) {
      console.error("Insert error:", error);
      return NextResponse.json(
        { error: "Failed to save posttest data" },
        { status: 500 }
      );
    }

    await supabase
      .from("participants")
      .update({ status: "completed" })
      .eq("participant_id", participant_id);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
