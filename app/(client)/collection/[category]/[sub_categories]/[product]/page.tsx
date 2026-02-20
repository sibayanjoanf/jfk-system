import Image from 'next/image';
import { cn } from '@/lib/utils';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Footer } from '@/components/footer';
import { Navbar } from '@/components/navbar'; 
import { ProductDetailActions } from '@/components/product-detail';
import Link from 'next/link';

interface PageProps {
  params: Promise<{
    category: string;
    sub_categories: string;
    product: string;
  }>;
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
          <div className="flex flex-col space-y-5">
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
            
            <h2 className="text-3xl font-bold text-gray-900">{product.name}</h2>
            
            <p className="text-2xl font-medium text-red-600">
              ₱ {product.price.toLocaleString(undefined, { minimumFractionDigits: 2 })} <span className="text-sm font-normal text-gray-500">/ PC</span>
            </p>

            <div className="border-t py-7">
              <p className="text-xs text-gray-400 uppercase tracking-widest">SKU: {product.sku}</p>
            </div>

            {/* Placeholder, ito muna */}
            <div>
              <p className="font-semibold mb-2">Color: <span className="text-gray-500 font-normal">Steel</span></p>
              <div className="flex flex-wrap gap-2">
                {['Steel', 'Bronze', 'Gold', 'Black'].map((color) => (
                  <Button key={color} variant="outline" className={cn("px-6", color === 'Steel' && "bg-red-600 text-white hover:bg-red-700")}>
                    {color}
                  </Button>
                ))}
              </div>
            </div>

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
      <section className="border-t bg-white mt-12 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            
            {/* Main Description */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-red-600 mb-4">Description</h3>
                <div className="prose prose-slate max-w-none text-gray-600 leading-relaxed">
                  {product.description ? (
                    <p className="whitespace-pre-line text-lg">
                      {product.description}
                    </p>
                  ) : (
                    <p className="italic text-gray-400">
                      Our {product.name} is meticulously selected to ensure the highest quality for your home renovation or construction project. Perfect for creating a sophisticated atmosphere in any space.
                    </p>
                  )}
                </div>
              </div>

              {/* Sub Description */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-gray-100">
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Lorem Ipsum</h4>
                  <p className="text-sm text-gray-600">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
                    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                    veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                    commodo consequat adipiscing elit.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Lorem Ipsum</h4>
                  <p className="text-sm text-gray-600">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
                    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                    veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                    commodo consequat adipiscing elit.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Lorem Ipsum</h4>
                  <p className="text-sm text-gray-600">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
                    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                    veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                    commodo consequat adipiscing elit.
                  </p>
                </div>
              </div>
            </div>

            {/* Product Important Specs */}
            <div className="bg-gray-50 p-8 rounded-xl h-fit">
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
      </div>
      
      <Footer />
    </main>
  );
}