import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  const { data, error } = await supabase
    .from("announcements")
    .select("id, text")
    .eq("active", true)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ success: false }, { status: 500 });

  return NextResponse.json({ success: true, data });
}