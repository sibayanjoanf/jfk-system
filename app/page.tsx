import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { ProductCard } from '@/components/product-card';
import { cn } from '@/lib/utils';
import { TypewriterText } from '@/components/typewriter-text';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Categories, Product, ShowcaseProducts } from '@/lib/types';

interface CategorySectionProps {
  image: string;
  categoryLabel: string;
}

interface ProductFeatureProps {
  title: string;
  products: Product[];
  categoryLink: string;
}

function ProductFeatureSection({ title, products, categoryLink }: ProductFeatureProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 flex flex-col justify-between">
      <div className={cn("mb-8 flex flex-col lg:flex-row lg:justify-between gap-2",
        title === "Tiles" ? "mt-0" : "mt-15")}>
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <Link
          href={`/collection/${categoryLink.toLowerCase()}`}
          className="flex items-center text-sm font-medium text-red-600 hover:text-red-700"
        >
          View all <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
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

function CategorySection({ image, categoryLabel }: CategorySectionProps) {
  return (
    <Link href={`/collection/${categoryLabel.toLowerCase()}`}>
      <div className="aspect-4/2 md:aspect-square group relative overflow-hidden rounded-lg bg-gray-100 cursor-pointer">
        <Image
          src={image || '/placeholder.png'}
          alt={categoryLabel}
          fill
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
        <div className="hidden lg:flex absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="absolute flex inset-0 items-center justify-center lg:opacity-0 transition-all duration-300 lg:translate-y-4 group-hover:opacity-100 group-hover:translate-y-0">
          <span className="text-[#f8f8f8] text-3xl font-bold">
            {categoryLabel}
          </span>
        </div>
      </div>
    </Link>
  )
}

// SERVER COMPONENT - Fetches data server-side
async function getProducts(category?: string): Promise<Product[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const url = category
      ? `${baseUrl}/api/products?category=${category}`
      : `${baseUrl}/api/products`;

    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) throw new Error('Failed to fetch products');
    
    const data = await response.json();
    return data.products || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

async function getCategories(): Promise<Categories[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/categories`, { cache: 'no-store' });
    if (!response.ok) throw new Error('Failed to fetch categories');
    
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

async function getShowcase(): Promise<ShowcaseProducts[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/showcase`, { cache: 'no-store' });
    if (!response.ok) throw new Error('Failed to fetch showcase');
    
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching showcase:', error);
    return [];
  }
}

export default async function HomePage() {
  // Fetch all data server-side in parallel
  const [tilesProducts, stonesProducts, fixturesProducts, categories, showcase] = await Promise.all([
    getProducts('Tiles'),
    getProducts('Stones'),
    getProducts('Fixtures'),
    getCategories(),
    getShowcase(),
  ]);

  return (
    <div className="flex min-h-screen min-w-20 flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gray-50 py-20 md:py-30 lg:py-30">
        <div className="absolute inset-0 opacity-100">
          <Image
            src="/images/JFK_homePage_bg.png"
            alt="Background"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="container relative mx-auto px-4">
          <div className="max-w-[100vh]">
            <h1 className={cn(
              "mb-6 text-5xl md:text-7xl text-gray-900 leading-[1.1]", 
              "windsong-medium"
            )}>
              <span className='mr-[25px]'>We build</span>
              <span className='sm:whitespace-nowrap sm:inline-block'>
                <TypewriterText />
              </span>
            </h1>
            <p className="mb-8 leading-relaxed text-gray-700 text-sm">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
              tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
              veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
              commodo consequat adipiscing elit.
            </p>
            <Link href={"/collection"}>
              <Button size="lg" className="bg-red-600 hover:bg-red-700 cursor-pointer">
                View Our Collections
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Product Category Section */}
      <section className="py-30">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <div className="mb-[-40] flex justify-center">
            </div>
            <h2 className="mb-4 text-3xl font-bold text-gray-900">
              Product Category
            </h2>
            <p className="text-sm mx-auto max-w-2xl text-gray-700">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
              tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>

          <div className="grid gap-4 md:gap-8 md:grid-cols-3">
            {categories.map((category) => (
              <CategorySection 
                key={category.id}
                categoryLabel={category.name}
                image={category.image_url ?? '/images/placeholder.png'} 
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className='bg-white py-20'>
        <ProductFeatureSection
          title="Tiles"
          products={tilesProducts}
          categoryLink="Tiles"
        />

        <ProductFeatureSection
          title="Stones"
          products={stonesProducts}
          categoryLink="Stones"
        />

        <ProductFeatureSection
          title="Fixtures"
          products={fixturesProducts}
          categoryLink="Fixtures"
        />
      </section>

      {/* Experience Section */}
      <section className="bg-[#f8f8f8] py-10 pt-25">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="relative h-[400px] overflow-hidden rounded-lg lg:h-auto">
              <Image
                src="/images/featured-photo-3.png"
                alt="Image"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col justify-center">
              <span className='mb-4 font-semibold tracking-widest text-red-600 text-sm'>EXPERIENCE</span>
              <h2 className="mb-4 text-3xl font-bold text-gray-900">
                We Provide You The Best Experience
              </h2>
              <p className="mb-6 leading-relaxed text-gray-600 text-sm">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
                tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                commodo consequat.
              </p>
              <Link
                href="/about"
                className="flex items-center justify-end text-sm font-medium text-red-600 hover:text-red-700"
              >
                Read More <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Concern Section */}
      <section className="bg-[#f8f8f8] py-10 pb-25">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="flex flex-col justify-center order-2 lg:order-1">
              <span className='mb-4 font-semibold tracking-widest text-red-600 text-sm'>CONCERNS</span>
              <h2 className="mb-4 text-3xl font-bold text-gray-900">
                Got Questions? We&apos;re Here to Help!
              </h2>
              <p className="mb-6 leading-relaxed text-gray-600 text-sm">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
                tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                commodo consequat.
              </p>
              <Link
                href="/faq"
                className="flex items-center justify-end text-sm font-medium text-red-600 hover:text-red-700"
              >
                Go to FAQs <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            <div className="relative h-[400px] overflow-hidden rounded-lg lg:h-auto order-1 lg:order-2">
              <Image
                src="/images/featured-photo-2.png"
                alt="Image"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Showcase Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">
            Showcase From Our Clients
          </h2>
          {showcase.length === 0 ? (
            <p className="text-center text-gray-500">No showcase items available</p>
          ) : (
            <Carousel
              opts={{
                align: "start",
                loop: false,
              }}
              className="w-full"
            >
              <CarouselContent>
                {showcase.map((item, index) => {
                  const productURL = `/collection/${item.products?.sub_categories?.categories?.name?.toLowerCase().replace(/\s+/g, '-')}/${item.products?.sub_categories?.name?.toLowerCase().replace(/\s+/g, '-')}/${item.product_name.toLowerCase().replace(/\s+/g, '-')}`;
                  
                  return (
                    <CarouselItem key={index} className="basis-1/2 md:basis-1/3 lg:basis-1/5">
                      <Link href={productURL}>
                        <div className="group relative aspect-[3/4] overflow-hidden rounded-lg bg-gray-100 cursor-pointer">
                          <Image
                            src={item.image_url}
                            alt={`Showcase ${index + 1}`}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                          <div className="absolute inset-x-0 bottom-0 p-4 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                            <p className="text-white text-sm font-medium">{item.product_name}</p>
                            <p className="text-gray-300 text-xs">{item.products?.sub_categories?.name}</p>
                          </div>
                        </div> 
                      </Link>
                    </CarouselItem>
                  );
                })}
              </CarouselContent>
              <div className="hidden md:block">
                <CarouselPrevious className="-left-15 bg-white hover:bg-gray-100 border-gray-200" />
                <CarouselNext className="-right-15 bg-white hover:bg-gray-100 border-gray-200" />
              </div>
            </Carousel>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}