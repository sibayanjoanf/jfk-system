"use client";

import { useState, useEffect, useMemo } from 'react';
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ProductCard } from '@/components/product-card';
import { Product } from '@/lib/types';
import { supabase } from '@/lib/supabase';

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
  if (searchTerm.trim().length < 2) {
    setProducts([]); 
    return;
  }

  const fetchData = async () => {
  setLoading(true);
  try {
    const fuzzyPattern = `%${searchTerm.split('').join('%')}%`;

    const { data, error } = await supabase
      .from('products')
      .select(`*, 
        sub_categories!inner(
          name, categories!inner(
            name
          )
        )
      `)
      .or(`name.ilike.%${searchTerm}%, name.ilike.${fuzzyPattern}`)
      .limit(10); 

    if (error) throw error;
    setProducts(data || []);
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};

  fetchData();
}, [searchTerm]);

  return (
    <div className="flex min-h-screen flex-col bg-[#f8f8f8]">
      <Navbar />

      {/* Search Header Section */}
      <div className="container mx-auto mt-20 mb-10 md:mt-32 px-4 flex flex-col items-center">
        <div className="w-full max-w-2xl flex flex-col space-y-8 text-center">
          <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 tracking-tight">
            Search
          </h1>

          <div className="relative flex items-center border-b-2 border-gray-200 focus-within:border-black transition-colors duration-200 pb-2">
            <Input 
              placeholder="Search our collection..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-0 shadow-none ring-0 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent text-md md:text-xl placeholder:text-gray-400 h-12 w-full px-0" 
            />
            {loading ? (
              <Loader2 className="ml-4 h-6 w-6 animate-spin text-red-600" />
            ) : (
              <Search className="ml-4 h-6 w-6 text-black" />
            )}
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="container mx-auto px-4 py-12 flex-grow">
        {searchTerm.length >= 2 && (
          <div className="mb-8">
            <p className="text-gray-500">
              Showing results for: <span className="text-black font-semibold">&quot;{searchTerm}&quot;</span>
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-10">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              sku={product.sku}
              name={product.name}
              price={product.price}
              image={product.image_url || '/placeholder.png'}
              category={product.sub_categories?.categories?.name || 'General'}
              sub_category={product.sub_categories?.name || 'General'}
              stock_qty={product.stock_qty}
            />
          ))}
        </div>

        {/* Empty States */}
        {searchTerm.length >= 2 && !loading && products.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            No products found matching &quot;{searchTerm}&quot;.
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}