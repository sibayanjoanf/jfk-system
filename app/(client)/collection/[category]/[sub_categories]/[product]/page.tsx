import Image from 'next/image';
import { cn } from '@/lib/utils';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Footer } from '@/components/footer';
import { Navbar } from '@/components/navbar'; 
import { ProductDetailActions } from '@/components/product-detail';
import Link from 'next/link';
import { Hammer, Palette, ShieldCheck, Wrench } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { ProductCard } from '@/components/product-card';
import { Product } from '@/lib/types';

interface PageProps {
  params: Promise<{
    category: string;
    sub_categories: string;
    product: string;
  }>;
}

interface ProductFeatureProps {
  title: string;
  products: Product[];
}

function AlsoLikeSection({ title, products }: ProductFeatureProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <div className="container mx-auto flex flex-col justify-between">
      <div className={cn("mb-8 flex flex-col lg:flex-row lg:justify-between gap-2",
        title === "Tiles" ? "mt-0" : "mt-15")}>
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      </div>
      <Carousel
        opts={{
          align: "start",
          loop: false,
        }}
        className="w-full"
      >
        <CarouselContent>
          {products.map((product) => (
            <CarouselItem key={product.id} className="basis-3/4 sm:basis-1/3 md:basis-1/3 lg:basis-1/5">
              <ProductCard
                sku={product.sku}
                name={product.name}
                price={product.price}
                image={product.image_url || '/placeholder.png'}
                category={product.sub_categories?.categories?.name || 'General'}
                sub_category={product.sub_categories?.name || 'General'}
                stock_qty={product.stock_qty}
                description={product.description}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="hidden md:block">
          <CarouselPrevious className="-left-15 bg-white hover:bg-gray-100 border-gray-200" />
          <CarouselNext className="-right-15 bg-white hover:bg-gray-100 border-gray-200" />
        </div>
      </Carousel>
    </div>
  )
}

export default async function ProductDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const urlName = (slug: string) => slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  const categoryName = urlName(resolvedParams.category);
  const subcatName = urlName(resolvedParams.sub_categories);
  const productName = urlName(resolvedParams.product);

  const { data: product, error } = await supabase
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
    .ilike('name', productName)
    .eq('sub_categories.name', subcatName)
    .eq('sub_categories.categories.name', categoryName)
    .single();

  if (error || !product) return notFound();

  const { data: relatedProducts } = await supabase
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
    .eq('sub_categories.categories.name', categoryName)
    .neq('name', productName) 
    .limit(10);

  return (
    <main className="min-h-screen bg-white">    
    <Navbar />
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
            {product.sub_categories?.name || "Product Details"}
          </h1>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          <div className="flex gap-4">
            {/* Product Color */}
            {/* <div className="flex flex-col gap-2">
              {[].map((i) => (
                <div key={i} className="w-16 h-16 border rounded-md overflow-hidden p-1 cursor-pointer hover:border-red-500">
                  <Image src={product.image_url} alt="thumbnail" width={64} height={64} className="object-contain" />
                </div>
              ))}
            </div> */}
            <div className="flex-1 relative aspect-square rounded-lg overflow-hidden">
              <Image src={product.image_url} alt={product.name} fill className="object-cover" />
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col space-y-2 md:space-y-5">
            <nav className="text-sm font-medium text-gray-400 flex">
              <Link 
                href={`/collection/${product.sub_categories?.categories?.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {product.sub_categories?.categories?.name}
              </Link>
              <span className="px-3">•</span> 
              <Link 
                href={{
                  pathname: `/collection/${product.sub_categories?.categories?.name.toLowerCase().replace(/\s+/g, '-')}`,
                  query: { sub: product.sub_categories?.name }
                }}
              >
                {product.sub_categories?.name}
              </Link>
            </nav>
            
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{product.name}</h2>
            <p className="text-xl md:text-2xl font-medium text-red-600">
              ₱ {product.price.toLocaleString(undefined, { minimumFractionDigits: 2 })} <span className="text-sm font-normal text-gray-500"></span>
            </p>
            <div className="border-y py-8 my-5">
              <h3 className="text-sm font-bold uppercase tracking-widest text-red-600 mb-4">Description</h3>
              <div className="prose prose-slate max-w-none text-gray-600 leading-relaxed">
                {product.description ? (
                  <p className="whitespace-pre-line text-sm md:text-md">
                    {product.description}
                  </p>
                ) : (
                  <p className="italic text-gray-400">
                    Our {product.name} is meticulously selected to ensure the highest quality for your home renovation or construction project. Perfect for creating a sophisticated atmosphere in any space.
                  </p>
                )}
              </div>
            </div>

            {/* Placeholder, ito muna */}
            {/* <div>
              <p className="font-semibold mb-2">Color: <span className="text-gray-500 font-normal">Steel</span></p>
              <div className="flex flex-wrap gap-2">
                {['Steel', 'Bronze', 'Gold', 'Black'].map((color) => (
                  <Button key={color} variant="outline" className={cn("px-6", color === 'Steel' && "bg-red-600 text-white hover:bg-red-700")}>
                    {color}
                  </Button>
                ))}
              </div>
            </div> */}

            <ProductDetailActions 
              product={{
                sku: product.sku,
                name: product.name,
                price: product.price,
                image_url: product.image_url,
                stock_qty: product.stock_qty,
                category: product.sub_categories?.categories?.name || 'General',
                sub_category: product.sub_categories?.name || 'General',
              }} 
            />
          </div>
        </div>

      {/* Product Description */}
      <section className="bg-white mt-12 py-8">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Main Description */}
            <div className="lg:col-span-2 space-y-8">

              {/* Sub Description */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-gray-100">
                <div className="flex items-start gap-4 p-4 rounded-lg border border-gray-100 bg-gray-50/50">
                  <div className="p-2 bg-white rounded-md shadow-sm">
                    <Hammer size={24} className="text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm uppercase tracking-tight">
                      Quality & Durability
                    </h4>
                    <p className="text-xs text-gray-600 leading-relaxed mt-1">
                      Engineered for high-traffic areas with a reinforced, wear-resistant finish. 
                      Provides long-lasting integrity for any project.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-lg border border-gray-100 bg-gray-50/50">
                  <div className="p-2 bg-white rounded-md shadow-sm">
                    <Palette size={24} className="text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm uppercase tracking-tight">
                      Style & Maintenance
                    </h4>
                    <p className="text-xs text-gray-600 leading-relaxed mt-1">
                      Designed with a modern aesthetic, these products fit seamlessly into any architectural 
                      space. The low-maintenance surfaces are easy to clean and resist daily wear and tear.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-lg border border-gray-100 bg-gray-50/50">
                  <div className="p-2 bg-white rounded-md shadow-sm">
                    <Wrench size={24} className="text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm uppercase tracking-tight">
                      Installation & Value
                    </h4>
                    <p className="text-xs text-gray-600 leading-relaxed mt-1">
                      Standardized dimensions ensure a seamless installation for both DIYers and professional 
                      contractors. A high-quality choice that adds immediate value and beauty to your home.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-lg border border-gray-100 bg-gray-50/50">
                  <div className="p-2 bg-white rounded-md shadow-sm">
                    <ShieldCheck size={24} className="text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm uppercase tracking-tight">
                      Safety & Health
                    </h4>
                    <p className="text-xs text-gray-600 leading-relaxed mt-1">
                      Compliant with safety standards and health regulations. Designed to be non-toxic and easy to maintain, ensuring a safe environment for all users.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Important Specs */}
            <div className="bg-gray-50/50 border border-gray-100 p-8 rounded-xl h-fit">
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900 mb-6 border-b pb-4">
                Technical Details
              </h3>
              <ul className="space-y-4">
                <li className="flex justify-between text-sm">
                  <span className="text-gray-500">SKU</span>
                  <span className="font-medium text-gray-900">{product.sku}</span>
                </li>
                <li className="flex justify-between text-sm">
                  <span className="text-gray-500">Category</span>
                  <span className="font-medium text-gray-900">{product.sub_categories?.categories?.name}</span>
                </li>
                <li className="flex justify-between text-sm">
                  <span className="text-gray-500">Sub-Category</span>
                  <span className="font-medium text-gray-900">{product.sub_categories?.name}</span>
                </li>
                <li className="flex justify-between text-sm">
                  <span className="text-gray-500">Stock Status</span>
                  <span className={cn(
                    "font-medium",
                    product.stock_qty > 0 ? "text-green-600" : "text-red-600"
                  )}>
                    {product.stock_qty > 0 ? `In Stock (${product.stock_qty})` : 'Out of Stock'}
                  </span>
                </li>
                <li className="flex justify-between text-sm border-t pt-4">
                  <span className="text-gray-500">Unit</span>
                  <span className="font-medium text-gray-900">Per Piece (PC)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-8">
        <AlsoLikeSection
          title="You Might Also Like"
          products={relatedProducts ?? []}
        />
      </section>

      </div>
      <Footer />
    </main>
  );
}