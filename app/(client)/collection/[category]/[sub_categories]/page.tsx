"use client";

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { Footer } from '@/components/footer';
import { Navbar } from '@/components/navbar';
import { SlidersHorizontal, Loader2 } from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductCard } from '@/components/product-card';
import { Product } from '@/lib/types';

interface PageProps {
  params: Promise<{
    sub_categories: string;
  }>;
}

export default function SubCategoryPage({ params }: PageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [subCategoryName, setSubCategoryName] = useState("");
  const [inStockOnly, setInStockOnly] = useState(true);
  const [sortBy, setSortBy] = useState("all");

  useEffect(() => {
    async function loadData() {
      const resolvedParams = await params;
      const slug = resolvedParams.sub_categories;
      const name = slug ? slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : '';
      setSubCategoryName(name);

      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          sub_categories!inner (
            name,
            categories!inner (
              name
            )
          )
        `)
        .eq('sub_categories.name', name);

      if (!error && data) setProducts(data);
      setLoading(false);
    }
    loadData();
  }, [params]);

  const displayProducts = useMemo(() => {
    let result = [...products];

    // Stock Filer
    if (inStockOnly) {
      result = result.filter(p => p.stock_qty > 0);
    }

    // Sort Filter
    switch (sortBy) {
      case "a-to-z":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "z-to-a":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "price-low-to-high":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high-to-low":
        result.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }
    return result;
  }, [products, inStockOnly, sortBy]);

  if (loading) return (
    <div className="h-screen w-full flex items-center justify-center">
      <Loader2 className="animate-spin text-red-600" size={40} />
    </div>
  );

  return (
    <main className="min-h-screen bg-white">  
    <Navbar />   
      {/* Header */}
      <section className="relative h-[20vh] md:h-[30vh] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/featured-photo-2.png" 
            alt="Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" /> 
        </div>
        <div className="container relative z-10 mx-auto px-4 h-full flex items-center justify-center">
          <h1 className={cn("text-4xl md:text-7xl font-bold text-white text-center", "windsong-medium")}>
            {subCategoryName}
          </h1>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12"> 
        <div className="flex justify-between items-center mb-6 pb-6">
          <div className ="flex flex-row items-center">
            <SlidersHorizontal className="text-gray-900 mr-4" size={20} />
            <h2 className="text-md font-semibold text-gray-900">Filters</h2>
          </div>

          <div className="flex flex-row items-center">
            <h2 className="text-md font-semibold text-gray-900 mr-4">Sort by:</h2>
            <Select onValueChange={setSortBy} defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">All Items</SelectItem>
                    <SelectItem value="a-to-z">A to Z</SelectItem>
                    <SelectItem value="z-to-a">Z to A</SelectItem>
                    <SelectItem value="price-low-to-high">Price: Low to High</SelectItem>
                    <SelectItem value="price-high-to-low">Price: High to Low</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12"> 
          
          {/* Side Filter */}
          <aside className="lg:col-span-1">
            <div className="flex flex-row justify-between items-center rounded-lg">
              <p className="text-md font-medium text-gray-900">In Stock Only</p>
              <Switch 
                checked={inStockOnly}
                onCheckedChange={setInStockOnly}
                className="scale-120 data-[state=checked]:bg-red-600" 
              />
            </div>
          </aside>

          {/* Product List */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-x-6 gap-y-10">
              {displayProducts.map((product) => (
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
            {displayProducts.length === 0 && (
              <div className="text-center py-20 text-gray-500">
                No products found matching these filters.
              </div>
            )}
          </div>

        </div>
      </div>
      
      <Footer />
    </main>
  );
}