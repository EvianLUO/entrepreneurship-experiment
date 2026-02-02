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
      .from("pretest_data")
      .insert({ participant_id, data });

    if (error) {
      console.error("Insert error:", error);
      return NextResponse.json(
        {
          error: "Failed to save pretest data",
          supabase: {
            message: error.message,
            details: (error as any).details,
            hint: (error as any).hint,
            code: (error as any).code,
          },
        },
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
