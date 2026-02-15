import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select(`
        *,
        sub_categories (
          id, 
          name
        )
      `)
      .order('name', { ascending: true });

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}