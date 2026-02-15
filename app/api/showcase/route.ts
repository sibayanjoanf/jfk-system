import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
    try {
      const { data, error } = await supabase
        .from('showcase')
        .select(`*,
          products!inner (
            name,
            sub_categories!inner (
              name,
              categories!inner (
                name
              )
            )
          )
        `);

      if (error) throw error;
      return NextResponse.json({ success: true, data });
      
    } catch (error: unknown) {
      return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
    }
}