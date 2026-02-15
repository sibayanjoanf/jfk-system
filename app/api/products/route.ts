import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const categoryName = searchParams.get('category');

  try {
    let query = supabase
      .from('products')
      .select(`
        *,
        sub_categories!inner (
          name,
          categories!inner (
            name
          )
        )
      `);

    if (categoryName) {
      query = query.eq('sub_categories.categories.name', categoryName);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase Error:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, products: data });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}