import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const categoryId = searchParams.get('categoryId');

  try {
    let query = supabase.from('sub_categories').select('id, name, category_id, image_url');
    
    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    const { data, error } = await query.order('name', { ascending: true });
    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}