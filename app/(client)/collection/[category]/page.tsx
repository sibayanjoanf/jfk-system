"use client";

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { Footer } from '@/components/footer';
import { Navbar } from '@/components/navbar';
import { SlidersHorizontal, Loader2, ChevronDown } from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductCard } from '@/components/product-card';
import { Product, CategoryWithSub } from '@/lib/types';
import { useSearchParams } from 'next/navigation';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface PageProps {
  params: Promise<{
    category: string;
  }>;
}

export default function CategoryPage({ params }: PageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [navCategories, setNavCategories] = useState<CategoryWithSub[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState("");
  const [inStockOnly, setInStockOnly] = useState(true);
  const [sortBy, setSortBy] = useState("all");
  const [activeSubCategory, setActiveSubCategory] = useState<string | null>(null);
  const [sortExpand, setSortExpand] = useState(false);
  const searchParams = useSearchParams();
  const subQuery = searchParams.get('sub');

  useEffect(() => {
    async function loadData() {
      const resolvedParams = await params;
      const slug = resolvedParams.category;
      const name = slug
        ? slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
        : '';
      setCategoryName(name);

      if (subQuery) {
        setActiveSubCategory(subQuery);
      } else {
        setActiveSubCategory(null);
      }

      const { data: bySubCat } = await supabase
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

      const { data: byCat } = await supabase
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
        .eq('sub_categories.categories.name', name);

      const merged = [...(bySubCat || []), ...(byCat || [])];
      const productData = merged.filter(
        (p, index, self) => index === self.findIndex(t => t.id === p.id)
      );

      const { data: catData } = await supabase
        .from('categories')
        .select('*, sub_categories(*)')
        .order('name');

      setProducts(productData);
      if (catData) setNavCategories(catData);

      setLoading(false);
    }
    loadData();
  }, [params]);

  const displayProducts = useMemo(() => {
    let result = [...products];

    if (activeSubCategory) {
      result = result.filter(p => p.sub_categories?.name === activeSubCategory);
    }

    if (inStockOnly) {
      result = result.filter(p => p.stock_qty > 0);
    }

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
  }, [products, inStockOnly, sortBy, activeSubCategory]);

  if (loading) return (
    <div className="h-screen w-full flex items-center justify-center -mt-25">
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
          <h1 className={cn("text-5xl md:text-7xl font-bold text-white text-center", "windsong-medium")}>
            {categoryName}
          </h1>
        </div>
      </section>

      {/* Filters (Stock & Categories) */}
      <div className="container mx-auto px-4 pb-10 md:py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 pb-6 gap-4">
          <div className="flex items-center justify-between w-full md:w-auto">
            <div className="hidden lg:flex items-center">
              <SlidersHorizontal className="text-gray-900 mr-3" size={18} />
              <h2 className="text-md font-semibold text-gray-900">Filters</h2>
            </div>
            
            <div className="lg:hidden fixed bottom-8 left-0 right-0 z-40 flex justify-center">
              <Sheet>
                <SheetTrigger asChild>
                  <button className="cursor-pointer shadow-2xl text-sm font-semibold text-white bg-red-600 px-6 py-3 rounded-full flex items-center gap-2">
                    <SlidersHorizontal size={16} />
                    Filters & Sort
                  </button>
                </SheetTrigger>
                <SheetContent 
                  side="bottom" 
                  className="h-[60vh] rounded-t-4xl p-0 border-none bg-white flex flex-col [&>button]:hidden"
                >
                  <SheetHeader className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <SheetTitle className="sr-only"></SheetTitle>
                    </div>
                  </SheetHeader>
                  
                  <div className="flex-1 overflow-y-auto px-6 pb-10">
                    {/* Stock Toggle */}
                    <div className="flex flex-row justify-between items-center pb-6">
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">In Stock Only</p>
                      </div>
                      <Switch
                        checked={inStockOnly}
                        onCheckedChange={setInStockOnly}
                        className="data-[state=checked]:bg-red-600"
                      />
                    </div>

                    {/* Sort Selection */}
                    <div className="border-y py-2 mb-7">
                      <button 
                        onClick={() => setSortExpand(!sortExpand)}
                        className="flex flex-row justify-between items-center w-full py-4 outline-none"
                      >
                        <p className={"font-semibold text-gray-900 text-sm"}>
                          Sort by
                        </p>
                        <ChevronDown 
                          size={20} 
                          className={cn("transition-transform duration-200", sortExpand && "rotate-180")} 
                        />
                      </button>

                      <div className={cn(
                        "grid transition-all duration-300 ease-in-out",
                        sortExpand ? "grid-rows-[1fr] opacity-100 mb-6" : "grid-rows-[0fr] opacity-0"
                      )}>
                        <div className="overflow-hidden">
                          <RadioGroup 
                            value={sortBy} 
                            onValueChange={(value) => {
                              setSortBy(value);
                            }}
                            className="space-y-4 pt-2"
                          >
                            <div className="flex items-center justify-between">
                              <Label htmlFor="all" className="text-sm font-medium text-gray-700 cursor-pointer flex-1">All Items</Label>
                              <RadioGroupItem value="all" id="all" className="border-gray-300" />
                            </div>
                            <div className="flex items-center justify-between">
                              <Label htmlFor="a-to-z" className="text-sm font-medium text-gray-700 cursor-pointer flex-1">A to Z</Label>
                              <RadioGroupItem value="a-to-z" id="a-to-z" className="border-gray-300" />
                            </div>
                            <div className="flex items-center justify-between">
                              <Label htmlFor="z-to-a" className="text-sm font-medium text-gray-700 cursor-pointer flex-1">Z to A</Label>
                              <RadioGroupItem value="z-to-a" id="z-to-a" className="border-gray-300" />
                            </div>
                            <div className="flex items-center justify-between">
                              <Label htmlFor="price-low-to-high" className="text-sm font-medium text-gray-700 cursor-pointer flex-1">Price: Low to High</Label>
                              <RadioGroupItem value="price-low-to-high" id="price-low-to-high" className="border-gray-300" />
                            </div>
                            <div className="flex items-center justify-between">
                              <Label htmlFor="price-high-to-low" className="text-sm font-medium text-gray-700 cursor-pointer flex-1">Price: High to Low</Label>
                              <RadioGroupItem value="price-high-to-low" id="price-high-to-low" className="border-gray-300" />
                            </div>
                          </RadioGroup>
                        </div>
                      </div>
                    </div>

                    {/* SubCategories */}
                    <div className="space-y-6">
                      <ul className="space-y-4">
                        {navCategories.map((cat) => {
                          const catSlug = cat.name.toLowerCase().replace(/\s+/g, '-');
                          const isCatActive = categoryName === cat.name;
                          const hasActiveSub = cat.sub_categories?.some(sub => sub.name === categoryName);
                          const shouldBeOpen = isCatActive || hasActiveSub;

                          return (
                            <li key={cat.id} className="space-y-3">
                              <Link 
                                href={`/collection/${catSlug}`} 
                                className={cn(
                                  "block text-sm font-semibold transition-colors", 
                                  isCatActive ? "text-red-600" : "text-gray-900"
                                )}
                              >
                                <div className="flex justify-between">
                                  {cat.name}
                                  <ChevronDown size={20} className={cn(isCatActive && "rotate-180")} />
                                </div>
                              </Link>
                              
                              <div className={cn(
                                "grid grid-cols-2 gap-2 overflow-hidden transition-all",
                                shouldBeOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                              )}>
                                {cat.sub_categories?.map((sub) => (
                                  <button 
                                    key={sub.id}
                                    onClick={() => setActiveSubCategory(prev => prev === sub.name ? null : sub.name)} 
                                    className={cn(
                                      "px-4 py-3 rounded-xl text-xs font-medium transition-all text-center border", 
                                      activeSubCategory === sub.name 
                                        ? "bg-red-50 border-red-200 text-red-600 shadow-sm" 
                                        : "bg-white border-gray-100 text-gray-600"
                                    )}
                                  >
                                    {sub.name}
                                  </button>
                                ))}
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Sort Selection */}
          <div className="hidden lg:flex flex-row items-center w-full md:w-auto justify-between md:justify-end">
            <h2 className="text-sm md:text-md font-semibold text-gray-900 mr-4">Sort by:</h2>
            <Select onValueChange={setSortBy} defaultValue="all">
              <SelectTrigger className="w-[140px] md:w-[180px]">
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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-20 md:gap-12">
          {/* Desktop Sidebar Filter */}
          <aside className="sticky top-30 self-start hidden lg:block lg:col-span-1 space-y-5">
            <div className="flex flex-row justify-between items-center border-y py-7">
              <p className="text-md font-semibold text-gray-900">In Stock Only</p>
              <Switch
                checked={inStockOnly}
                onCheckedChange={setInStockOnly}
                className="scale-110 data-[state=checked]:bg-red-600"
              />
            </div>

            <div className="space-y-4">
              <ul className="space-y-1">
                {navCategories.map((cat) => {
                  const catSlug = cat.name.toLowerCase().replace(/\s+/g, '-');
                  const isCatActive = categoryName === cat.name;
                  const hasActiveSub = cat.sub_categories?.some(sub => sub.name === categoryName);
                  const shouldBeOpen = isCatActive || hasActiveSub;
                  return (
                    <li key={cat.id} className="group">
                      <Link href={`/collection/${catSlug}`} className={cn("block py-2 text-md font-semibold transition-colors hover:text-red-600", isCatActive ? "text-red-600 font-semibold" : "text-gray-800")}>
                        {cat.name}
                      </Link>
                      <ul className={cn("pl-4 space-y-2 border-l-2 border-gray-100 ml-1 transition-all", shouldBeOpen ? "block" : "hidden group-hover:block")}>
                        {cat.sub_categories?.map((sub) => (
                          <li key={sub.id}>
                            {isCatActive ? (
                              <button onClick={() => setActiveSubCategory(prev => prev === sub.name ? null : sub.name)} className={cn("block w-full text-left py-1 text-sm transition-colors hover:text-red-600", activeSubCategory === sub.name ? "text-red-600 font-medium" : "text-gray-500")}>
                                {sub.name}
                              </button>
                            ) : (
                              <Link href={{
                                pathname: `/collection/${catSlug}`,
                                query: { sub: sub.name }
                              }} 
                                className={cn("block py-1 text-sm transition-colors hover:text-red-600", categoryName === sub.name ? "text-red-600 font-bold" : "text-gray-500")}>
                                {sub.name}
                              </Link>
                            )}
                          </li>
                        ))}
                      </ul>
                    </li>
                  );
                })}
              </ul>
            </div>
          </aside>

          {/* Main Product Grid */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-10">
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