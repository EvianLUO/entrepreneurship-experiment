import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://cvjhbvypxjgpwtanoegn.supabase.co";
const supabaseAnonKey = "sb_publishable_XrCdbdSm-xcXPa0DLp20vQ_6uxn-fGQ";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(req: NextRequest) {
  try {
    const { study_version } = await req.json();

    const { data: counter, error: counterError } = await supabase
      .from("group_counter")
      .select("*")
      .single();

    if (counterError) {
      console.error("Counter error:", counterError);
      return NextResponse.json(
        { error: "Failed to fetch counter" },
        { status: 500 }
      );
    }

    // 新的2×2设计：人机顺序 × AI深度思考
    // 组1: human_first + reasoner_off
    // 组2: human_first + reasoner_on
    // 组3: ai_first + reasoner_off
    // 组4: ai_first + reasoner_on
    
    const group1Count = (counter as any).group1_human_first_reasoner_off ?? 0;
    const group2Count = (counter as any).group2_human_first_reasoner_on ?? 0;
    const group3Count = (counter as any).group3_ai_first_reasoner_off ?? 0;
    const group4Count = (counter as any).group4_ai_first_reasoner_on ?? 0;

    // 找到人数最少的组
    const counts = [
      { group: 1, count: group1Count },
      { group: 2, count: group2Count },
      { group: 3, count: group3Count },
      { group: 4, count: group4Count },
    ];
    const minGroup = counts.reduce((min, curr) => 
      curr.count < min.count ? curr : min
    );

    let interaction_order: "human_first" | "ai_first";
    let ai_reasoner: "on" | "off";

    switch (minGroup.group) {
      case 1:
        interaction_order = "human_first";
        ai_reasoner = "off";
        break;
      case 2:
        interaction_order = "human_first";
        ai_reasoner = "on";
        break;
      case 3:
        interaction_order = "ai_first";
        ai_reasoner = "off";
        break;
      case 4:
        interaction_order = "ai_first";
        ai_reasoner = "on";
        break;
      default:
        interaction_order = "human_first";
        ai_reasoner = "off";
    }

    const participant_id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random()}`;

    const { data: participant, error: insertError } = await supabase
      .from("participants")
      .insert({
        participant_id,
        study_version,
        interaction_order,
        ai_reasoner,
        status: "in_progress",
      })
      .select("*")
      .single();

    if (insertError) {
      console.error("Insert error:", insertError);
      return NextResponse.json(
        {
          error: "Failed to create participant",
          supabase: {
            message: insertError.message,
            details: (insertError as any).details,
            hint: (insertError as any).hint,
            code: (insertError as any).code,
          },
        },
        { status: 500 }
      );
    }

    // 更新计数器（如果字段存在）
    const updates: any = {};
    try {
      switch (minGroup.group) {
        case 1:
          updates.group1_human_first_reasoner_off = group1Count + 1;
          break;
        case 2:
          updates.group2_human_first_reasoner_on = group2Count + 1;
          break;
        case 3:
          updates.group3_ai_first_reasoner_off = group3Count + 1;
          break;
        case 4:
          updates.group4_ai_first_reasoner_on = group4Count + 1;
          break;
      }

      await supabase
        .from("group_counter")
        .update(updates)
        .eq("id", counter.id);
    } catch (updateError) {
      // 如果更新失败（可能是字段不存在），记录错误但不阻止创建参与者
      console.warn("Failed to update group counter:", updateError);
    }

    return NextResponse.json({ participant });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
