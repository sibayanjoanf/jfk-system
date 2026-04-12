"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ProductDetailActions } from "@/components/product-detail";
import { ProductVariant } from "@/lib/types";
import { Hammer, Palette, ShieldCheck, Wrench } from "lucide-react";
import { Reveal } from "./reveal";

interface Props {
  product: {
    name: string;
    description?: string;
    sub_categories?: {
      name: string;
      categories?: { name: string };
    };
  };
  variants: ProductVariant[];
}

export function ProductDetailVariant({ product, variants }: Props) {
  const [selectedVariant, setSelectedVariant] = useState(
    variants.find((v) => v.stock_qty > 0) ?? variants[0],
  );

  const category = product.sub_categories?.categories?.name || "General";
  const sub_category = product.sub_categories?.name || "General";

  const grouped = variants.reduce(
    (acc, v) => {
      const key = v.attribute_name || "Variant";
      if (!acc[key]) acc[key] = [];
      acc[key].push(v);
      return acc;
    },
    {} as Record<string, ProductVariant[]>,
  );

  const hasVariants = variants.length > 1 || variants[0]?.attribute_value;

  return (
    <>
      <Reveal>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Image */}
          <div className="flex gap-4">
            <div className="flex-1 relative aspect-square rounded-lg overflow-hidden">
              <Image
                src={selectedVariant.image_url || "/placeholder.png"}
                alt={product.name}
                fill
                className="object-cover transition-all duration-300"
              />
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col space-y-2 md:space-y-5">
            <nav className="text-sm font-medium text-gray-400 flex">
              <Link
                className="hover:text-gray-500 hover:no-underline underline"
                href={`/collection/${category.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {category}
              </Link>
              <span className="px-3">/</span>
              <Link
                className="hover:text-gray-500 hover:no-underline underline"
                href={{
                  pathname: `/collection/${category.toLowerCase().replace(/\s+/g, "-")}`,
                  query: { sub: sub_category },
                }}
              >
                {sub_category}
              </Link>
              <span className="px-3">/</span>
              <span>{product.name}</span>
            </nav>

            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              {product.name}
            </h2>

            <p className="text-xl md:text-2xl font-medium text-red-600">
              ₱
              {selectedVariant.price.toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </p>

            <div className="border-y py-8 my-5">
              <h3 className="text-sm font-bold uppercase tracking-widest text-red-600 mb-4">
                Description
              </h3>
              <div className="prose prose-slate max-w-none text-gray-600 leading-relaxed">
                {product.description ? (
                  <p className="whitespace-pre-line text-sm md:text-md">
                    {product.description}
                  </p>
                ) : (
                  <p className="italic text-gray-400">
                    Our {product.name} is meticulously selected to ensure the
                    highest quality for your home renovation or construction
                    project. Perfect for creating a sophisticated atmosphere in
                    any space.
                  </p>
                )}
              </div>
            </div>

            {/* Variant Selector */}
            {hasVariants &&
              Object.entries(grouped).map(([attrName, attrVariants]) => (
                <div key={attrName} className="mb-8">
                  <p className="font-semibold my-2">{attrName}:</p>
                  <div className="flex flex-wrap gap-2">
                    {attrVariants.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariant(v)}
                        disabled={v.stock_qty <= 0}
                        className={cn(
                          "relative px-6 py-2 border rounded-md text-xs font-medium transition-all overflow-hidden",
                          selectedVariant.id === v.id
                            ? "bg-red-600 text-white border-red-600"
                            : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100",
                          v.stock_qty <= 0 && "opacity-40 cursor-not-allowed",
                        )}
                      >
                        {v.attribute_value}
                        {v.stock_qty <= 0 && (
                          <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <span className="absolute w-[140%] h-[1px] bg-current rotate-[-18deg]" />
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

            <ProductDetailActions
              product={{
                sku: selectedVariant.sku,
                name: product.name,
                price: selectedVariant.price,
                image_url: selectedVariant.image_url || "",
                stock_qty: selectedVariant.stock_qty,
                category,
                sub_category,
              }}
            />
          </div>
        </div>
      </Reveal>

      {/* Product Description Section */}
      <Reveal>
        <section className="bg-white mt-12 py-8">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Technical Details */}
              <div className="bg-gray-100/40 border border-gray-200 p-8 rounded-xl h-fit">
                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900 mb-6 border-b pb-4">
                  Technical Details
                </h3>
                <ul className="space-y-4">
                  <li className="flex justify-between text-sm">
                    <span className="text-gray-500">SKU</span>
                    <span className="font-medium text-gray-900">
                      {selectedVariant.sku}
                    </span>
                  </li>
                  <li className="flex justify-between text-sm">
                    <span className="text-gray-500">Category</span>
                    <span className="font-medium text-gray-900">
                      {category}
                    </span>
                  </li>
                  <li className="flex justify-between text-sm">
                    <span className="text-gray-500">Sub-Category</span>
                    <span className="font-medium text-gray-900">
                      {sub_category}
                    </span>
                  </li>
                  <li className="flex justify-between text-sm">
                    <span className="text-gray-500">Stock Status</span>
                    <span
                      className={cn(
                        "font-medium",
                        selectedVariant.stock_qty > 0
                          ? "text-green-600"
                          : "text-red-600",
                      )}
                    >
                      {selectedVariant.stock_qty > 0
                        ? `In Stock (${selectedVariant.stock_qty})`
                        : "Out of Stock"}
                    </span>
                  </li>
                  <li className="flex justify-between text-sm border-t pt-4">
                    <span className="text-gray-500">Dimension</span>
                    <span className="font-medium text-gray-900">
                      {selectedVariant.dimension}
                    </span>
                  </li>
                </ul>
              </div>

              {/* Feature Cards */}
              <div className="lg:col-span-2 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-gray-100">
                  <div className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 bg-gray-100/40">
                    <div className="p-2 bg-white rounded-md shadow-sm">
                      <Hammer size={24} className="text-red-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm uppercase tracking-tight">
                        Quality & Durability
                      </h4>
                      <p className="text-xs text-gray-600 leading-relaxed mt-1">
                        Engineered for high-traffic areas with a reinforced,
                        wear-resistant finish. Provides long-lasting integrity
                        for any project.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 bg-gray-100/40">
                    <div className="p-2 bg-white rounded-md shadow-sm">
                      <Palette size={24} className="text-red-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm uppercase tracking-tight">
                        Style & Maintenance
                      </h4>
                      <p className="text-xs text-gray-600 leading-relaxed mt-1">
                        Designed with a modern aesthetic, these products fit
                        seamlessly into any architectural space. The
                        low-maintenance surfaces are easy to clean and resist
                        daily wear and tear.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 bg-gray-100/40">
                    <div className="p-2 bg-white rounded-md shadow-sm">
                      <Wrench size={24} className="text-red-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm uppercase tracking-tight">
                        Installation & Value
                      </h4>
                      <p className="text-xs text-gray-600 leading-relaxed mt-1">
                        Standardized dimensions ensure a seamless installation
                        for both DIYers and professional contractors. A
                        high-quality choice that adds immediate value and beauty
                        to your home.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 bg-gray-100/40">
                    <div className="p-2 bg-white rounded-md shadow-sm">
                      <ShieldCheck size={24} className="text-red-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm uppercase tracking-tight">
                        Safety & Health
                      </h4>
                      <p className="text-xs text-gray-600 leading-relaxed mt-1">
                        Compliant with safety standards and health regulations.
                        Designed to be non-toxic and easy to maintain, ensuring
                        a safe environment for all users.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Reveal>
    </>
  );
}
