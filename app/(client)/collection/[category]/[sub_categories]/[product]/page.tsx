import Image from "next/image";
import { cn } from "@/lib/utils";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ProductCard } from "@/components/product-card";
import { Product } from "@/lib/types";
import { ProductDetailVariant } from "@/components/product-detail-variant";
import { Reveal } from "@/components/reveal";

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
      <div
        className={cn(
          "mb-8 flex flex-col lg:flex-row lg:justify-between gap-2",
          title === "Tiles" ? "mt-0" : "mt-5",
        )}
      >
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
          {products.map((product) => {
            const variant = product.product_variants?.[0];
            if (!variant) return null;

            return (
              <CarouselItem
                key={product.id}
                className="basis-3/4 sm:basis-1/3 md:basis-1/3 lg:basis-1/5"
              >
                <ProductCard
                  sku={variant.sku}
                  name={product.name}
                  price={variant.price}
                  image={variant.image_url || "/placeholder.png"}
                  category={
                    product.sub_categories?.categories?.name || "General"
                  }
                  sub_category={product.sub_categories?.name || "General"}
                  stock_qty={variant.stock_qty}
                  description={product.description}
                  variants={product.product_variants}
                />
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <div className="hidden md:block">
          <CarouselPrevious className="-left-15 bg-white hover:bg-gray-100 border-gray-200" />
          <CarouselNext className="-right-15 bg-white hover:bg-gray-100 border-gray-200" />
        </div>
      </Carousel>
    </div>
  );
}

export default async function ProductDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const urlName = (slug: string) =>
    slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  const categoryName = urlName(resolvedParams.category);
  const subcatName = urlName(resolvedParams.sub_categories);
  const productName = urlName(resolvedParams.product);

  const { data: product, error } = await supabase
    .from("products")
    .select(
      `
    *,
    sub_categories!inner (
      name,
      categories!inner ( name )
    ),
    product_variants(*)
  `,
    )
    .ilike("name", productName)
    .eq("sub_categories.name", subcatName)
    .eq("sub_categories.categories.name", categoryName)
    .eq("is_archived", false)
    .single();

  if (error || !product) return notFound();

  // Fetch available_qty from view
  const { data: available } = await supabase
    .from("product_variants_available")
    .select("id, available_qty");

  const availableMap = Object.fromEntries(
    (available || []).map((v) => [v.id, v.available_qty]),
  );

  const activeVariants = (product.product_variants ?? [])
    .filter((v: { is_archived: boolean }) => !v.is_archived)
    .map((v: { id: string; is_archived: boolean }) => ({
      ...v,
      stock_qty: availableMap[v.id] ?? 0,
    }));

  const firstVariant = activeVariants[0];
  if (!firstVariant) return notFound();

  const { data: relatedProducts } = await supabase
    .from("products")
    .select(
      `
    *,
    sub_categories!inner (
      name,
      categories!inner ( name )
    ),
    product_variants(*)
  `,
    )
    .eq("sub_categories.categories.name", categoryName)
    .eq("is_archived", false)
    .neq("name", productName)
    .limit(10);

  const activeRelated = (relatedProducts ?? [])
    .map((p) => ({
      ...p,
      product_variants: (p.product_variants ?? [])
        .filter((v: { is_archived: boolean }) => !v.is_archived)
        .map((v: { id: string; is_archived: boolean }) => ({
          ...v,
          stock_qty: availableMap[v.id] ?? 0,
        })),
    }))
    .filter((p) => p.product_variants.length > 0);

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <section className="relative h-[20vh] md:h-[30vh] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/featured-photo-2.png"
            alt="Background"
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="container relative z-10 mx-auto px-4 h-full flex items-center justify-center">
          <h1
            className={cn(
              "text-4xl md:text-7xl font-bold text-white text-center",
              "windsong-medium",
            )}
          >
            {product.sub_categories?.name || "Product Details"}
          </h1>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <ProductDetailVariant product={product} variants={activeVariants} />

        <Reveal>
          <section className="bg-white py-8">
            <AlsoLikeSection
              title="You Might Also Like"
              products={activeRelated}
            />
          </section>
        </Reveal>
      </div>

      <Footer />
    </main>
  );
}
