"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ProductCard } from "@/components/product-card";
import { Product, ProductVariant } from "@/lib/types";
import { supabase } from "@/lib/supabase";
import { Reveal } from "@/components/reveal";

function levenshtein(a: string, b: string): number {
  const matrix = Array.from({ length: b.length + 1 }, (_, i) => [i]);
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      matrix[i][j] =
        b[i - 1] === a[j - 1]
          ? matrix[i - 1][j - 1]
          : 1 +
            Math.min(matrix[i - 1][j - 1], matrix[i - 1][j], matrix[i][j - 1]);
    }
  }
  return matrix[b.length][a.length];
}

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
        const selectQuery = `*, 
      sub_categories!inner(
        name, categories!inner(
          name
        )
      ),
      product_variants(*)
    `;

        const { data: exactData, error: exactError } = await supabase
          .from("products")
          .select(selectQuery)
          .ilike("name", `%${searchTerm}%`)
          .limit(200);

        if (exactError) throw exactError;

        if (exactData && exactData.length > 0) {
          setProducts(exactData);
          return;
        }

        const { data: allData, error: allError } = await supabase
          .from("products")
          .select(selectQuery)
          .limit(200);

        if (allError) throw allError;

        const term = searchTerm.toLowerCase();

        const fuzzyResults = (allData || []).filter((product) => {
          const variantKeywords =
            product.product_variants
              ?.map((v: ProductVariant) => v.keywords?.toLowerCase() || "")
              .join(" ") || "";

          const fields = [product.name?.toLowerCase() || "", variantKeywords];

          return fields.some((field) => {
            const words = field.split(/[\s,]+/);
            return words.some((word: string) => levenshtein(word, term) <= 2);
          });
        });

        setProducts(fuzzyResults);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchTerm]);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      {/* Search Header Section */}
      <Reveal>
        <div className="container mx-auto mt-20 mb-10 md:mt-32 px-4 flex flex-col items-center">
          <div className="w-full max-w-2xl flex flex-col space-y-8 text-center">
            <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 tracking-tight">
              Search
            </h1>

            <div className="relative flex items-center border-b-2 border-gray-200 focus-within:border-black transition-colors duration-200 pb-2">
              <Input
                id="search"
                placeholder="Search our collection..."
                maxLength={100}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-0 shadow-none ring-0 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent text-md md:text-xl placeholder:text-gray-400 h-12 w-full px-0"
              />
              {loading ? (
                <Loader2 className="ml-4 h-6 w-6 animate-spin text-black" />
              ) : (
                <Search className="ml-4 h-6 w-6 text-black" />
              )}
            </div>
          </div>
        </div>
      </Reveal>

      {/* Results Section */}
      <div className="container mx-auto px-4 py-12 flex-grow">
        {searchTerm.length >= 2 && (
          <div className="mb-8">
            <p className="text-gray-500">
              Showing results for:{" "}
              <span className="text-black font-semibold">
                &quot;{searchTerm}&quot;
              </span>
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-8">
          {products.map((product, i) => {
            const variant = product.product_variants?.[0];
            if (!variant) return null;

            return (
              <Reveal key={product.id} delay={i * 30}>
                <ProductCard
                  key={product.id}
                  sku={variant.sku}
                  name={product.name}
                  price={variant.price}
                  image={variant.image_url || "/placeholder.png"}
                  category={
                    product.sub_categories?.categories?.name || "General"
                  }
                  sub_category={product.sub_categories?.name || "General"}
                  stock_qty={variant.stock_qty}
                  description={product.description || ""}
                  variants={product.product_variants || []}
                />
              </Reveal>
            );
          })}
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
