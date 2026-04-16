"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Minus, Plus, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { useCart } from "@/hooks/cart";
import { cn } from "@/lib/utils";
import { ProductVariant } from "@/lib/types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ProductCardProps {
  sku: string;
  name: string;
  price: number;
  image: string;
  category: string;
  sub_category: string;
  stock_qty: number;
  description?: string;
  variants?: ProductVariant[];
}

export function ProductCard({
  sku,
  name,
  price,
  image,
  category,
  sub_category,
  stock_qty,
  description,
  variants,
}: ProductCardProps) {
  const [isAddedtoCart, setIsAddedtoCart] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedQty, setSelectedQty] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    variants && variants.length > 0
      ? (variants.find((v) => v.stock_qty > 0) ?? variants[0])
      : null,
  );
  const { items, addItem } = useCart();

  useEffect(() => {
    if (isAddedtoCart) {
      const timer = setTimeout(() => {
        setIsAddedtoCart(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isAddedtoCart, setIsAddedtoCart]);

  const activePrice = selectedVariant?.price ?? price;
  const activeImage = selectedVariant?.image_url || image;
  const activeSku = selectedVariant?.sku ?? sku;
  const activeStockQty = selectedVariant?.stock_qty ?? stock_qty;

  const stockQtyNum = Number(activeStockQty);
  const itemInCart = items.find((item) => item.id === activeSku);
  const currentQtyInCart = itemInCart ? itemInCart.quantity : 0;
  const isLimitReached = currentQtyInCart + selectedQty > stockQtyNum;
  const isFullyStockedInCart = currentQtyInCart >= stockQtyNum;

  const isOutOfStock =
    variants && variants.length > 0
      ? variants.every((v) => v.stock_qty <= 0)
      : stockQtyNum <= 0;

  const hasVariants = variants && variants.length > 1;

  // variants by attribute_name
  const grouped = hasVariants
    ? variants!.reduce(
        (acc, v) => {
          const key = v.attribute_name || "Variant";
          if (!acc[key]) acc[key] = [];
          acc[key].push(v);
          return acc;
        },
        {} as Record<string, ProductVariant[]>,
      )
    : {};

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedQty(1);
    setIsOpen(true);
  };

  const handleIncrement = () => {
    if (currentQtyInCart + selectedQty < stockQtyNum) {
      setSelectedQty((prev) => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (selectedQty > 1) {
      setSelectedQty((prev) => prev - 1);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock || isFullyStockedInCart) return;
    addItem(
      {
        id: activeSku,
        name,
        sku: activeSku,
        price: activePrice,
        image: activeImage,
        stock_qty: activeStockQty,
        category,
        sub_category,
      },
      stockQtyNum,
      selectedQty,
    );
    setIsOpen(false);
    setIsAddedtoCart(true);
  };

  const productUrl = `/collection/${category.toLowerCase().replace(/\s+/g, "-")}/${sub_category.toLowerCase().replace(/\s+/g, "-")}/${name.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <>
      <Link href={productUrl}>
        <Card className="group relative flex h-full flex-col overflow-hidden pt-0 pb-4 border-none shadow-none rounded-none">
          <CardContent className="p-0">
            <div className="relative aspect-square overflow-hidden bg-white">
              <Image
                src={activeImage}
                alt={name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform group-hover:scale-105 rounded-lg"
              />
              <div
                onClick={handleQuickView}
                className="hidden lg:flex absolute bottom-3 right-4 bg-red-600 hover:bg-red-700 py-2 px-4 rounded-lg transition-all duration-300 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 shadow-md z-10 cursor-pointer"
              >
                <span className="text-[#f8f8f8] text-sm font-medium whitespace-nowrap">
                  Quick View
                </span>
              </div>
            </div>
            <div className="grow py-2 pr-12">
              {isOutOfStock ? (
                <span className="inline-block mb-2 bg-red-600 text-white px-3 py-1 rounded-md text-[8px] font-bold uppercase tracking-wider">
                  Out of Stock
                </span>
              ) : stockQtyNum <= 5 ? (
                <span className="inline-block mb-2 bg-amber-500 text-white px-3 py-1 rounded-md text-[8px] font-bold uppercase tracking-wider">
                  Low Stock
                </span>
              ) : null}
              <h3 className="mb-2 text-sm md:text-md font-semibold text-gray-900">
                {name}
              </h3>
              <p className="text-sm font-medium text-red-600">
                ₱{price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </div>
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    onClick={handleQuickView}
                    className="lg:hidden absolute bottom-4 right-4 bg-white hover:bg-red-50 p-2 rounded-full border border-red-100 text-red-600 pointer-events-auto"
                  >
                    <Eye size={20} />
                  </div>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  align="center"
                  sideOffset={5}
                  className="text-[10px] py-1 px-2 bg-red-600"
                >
                  <p>Quick View</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardContent>
        </Card>
      </Link>

      {/* Quick View Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="w-[95vw] md:max-w-4xl lg:max-w-4xl h-auto max-h-[90vh] p-0 border-none shadow-none [&>button]:hidden overflow-y-auto">
          <DialogHeader className="sr-only">
            <DialogTitle>{name}</DialogTitle>
            <DialogDescription>
              Product details and purchase options for {name}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col md:grid md:grid-cols-2 min-h-full relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 z-50 text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-color rounded-full p-1 bg-white/80 backdrop-blur-sm"
            >
              <X size={20} />
            </button>

            {/* Image */}
            <div className="relative aspect-square md:aspect-auto md:h-full max-h-[40vh] md:max-h-none bg-white">
              <Image
                src={activeImage}
                alt={name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1 bg-white">
              <div className="flex-1 p-6 md:p-12 pb-2 md:pb-12">
                <div className="w-full">
                  <h2 className="block text-md md:text-xl font-semibold text-center md:text-left break-words leading-snug text-gray-900 pr-6">
                    {name}
                  </h2>
                  <p className="text-center md:text-left text-sm text-gray-400 font-semibold mt-1 mb-6">
                    Category <span className="font-normal">{sub_category}</span>
                  </p>

                  <div className="grid gap-4 text-sm font-semibold py-6 border-t border-gray-100">
                    {hasVariants ? (
                      Object.entries(grouped).map(
                        ([attrName, attrVariants]) => (
                          <div key={attrName}>
                            <p className="font-semibold mb-2">{attrName}:</p>
                            <div className="flex flex-wrap gap-2">
                              {attrVariants.map((v) => (
                                <button
                                  key={v.id}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setSelectedVariant(v);
                                    setSelectedQty(1);
                                  }}
                                  disabled={v.stock_qty <= 0}
                                  className={cn(
                                    "relative px-4 py-1.5 border rounded-md text-xs font-medium transition-all",
                                    selectedVariant?.id === v.id
                                      ? "bg-red-600 text-white border-red-600"
                                      : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100",
                                    v.stock_qty <= 0 &&
                                      "opacity-40 cursor-not-allowed",
                                  )}
                                >
                                  {v.attribute_value}
                                </button>
                              ))}
                            </div>
                            <p className="mt-3 text-xs text-gray-500 font-medium">
                              Stock: <span>{activeStockQty}</span>
                            </p>
                          </div>
                        ),
                      )
                    ) : (
                      <div className="space-y-2">
                        <p className="font-normal text-gray-600 leading-relaxed">
                          {description}
                        </p>
                        <p>
                          Stock:{" "}
                          <span className="font-normal">{activeStockQty}</span>
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Pricing + Add to Cart Btn */}
              <div className="sticky bottom-0 z-20 mt-auto md:-mt-5 bg-white border border-t-gray-100 p-6 md:p-12 md:border-none md:pt-0 shadow-[0_-10px_20px_-5px_rgba(0,0,0,0,0.05)] md:shadow-none">
                <div className="flex flex-col gap-3">
                  <div className="flex gap-1 justify-between items-center">
                    <span className="text-2xl font-medium text-red-600">
                      ₱{" "}
                      {activePrice.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                    </span>

                    {!isOutOfStock && !isFullyStockedInCart && (
                      <div className="flex items-center border rounded-md h-10 bg-white">
                        <button
                          onClick={handleDecrement}
                          className="p-2 hover:bg-gray-100"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-10 text-center font-semibold text-sm">
                          {selectedQty}
                        </span>
                        <button
                          onClick={handleIncrement}
                          className="p-2 hover:bg-gray-100"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock || isLimitReached}
                    className={cn(
                      "w-full h-12 py-3 rounded-lg font-bold uppercase tracking-wider",
                      isOutOfStock || isLimitReached
                        ? "bg-gray-300 text-gray-500"
                        : "bg-red-600 text-white hover:bg-red-700",
                    )}
                  >
                    {isOutOfStock
                      ? "Out of Stock"
                      : isLimitReached
                        ? "Limit Reached"
                        : "Add to Cart"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Added to Cart Modal */}
      <Dialog open={isAddedtoCart} onOpenChange={setIsAddedtoCart}>
        <DialogContent
          className="
          left-auto top-auto translate-x-0 translate-y-0
          fixed bottom-4 left-4 right-4 sm:bottom-6 sm:right-6 sm:left-auto
          w-auto sm:w-[400px] md:w-[500px] h-auto min-h-0
          p-4 shadow-2xl rounded-xl border border-gray-100
          [&>button]:hidden duration-500 animate-in fade-in slide-in-from-bottom-10
        "
        >
          <DialogHeader>
            <DialogTitle className="text-center text-sm bg-gray-200 text-gray-500 py-3 rounded-lg">
              Item Added to Cart!
            </DialogTitle>
            <DialogDescription className="sr-only">
              {name} is added to your cart.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="items-center justify-center flex pb-3">
              <Image
                src={activeImage}
                alt={name}
                width={200}
                height={200}
                className="object-fill rounded-lg"
              />
            </div>
            <div className="md:col-span-2 flex flex-col leading-tight">
              <DialogHeader>
                <DialogTitle className="text-md text-center md:text-start">
                  {name}
                </DialogTitle>
                <p className="text-sm text-center md:text-start text-gray-500">
                  {activeSku}
                </p>
                <div className="flex flex-row justify-between items-center">
                  <p className="text-lg text-center md:text-start font-medium text-red-600">
                    ₱
                    {(activePrice * selectedQty).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                  <p className="text-sm text-center font-normal text-gray-500">
                    Qty: {selectedQty}
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button
                    className="border border-gray-200 h-10 flex-1 text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300 w-full mt-5 cursor-pointer"
                    variant="ghost"
                    onClick={() => setIsAddedtoCart(false)}
                  >
                    Keep Browsing
                  </Button>
                  <Link href={"/cart"} className="flex-1">
                    <Button
                      className="h-10 bg-red-600 hover:bg-red-700 text-white w-full mt-5 cursor-pointer"
                      onClick={() => setIsAddedtoCart(false)}
                    >
                      View Cart
                    </Button>
                  </Link>
                </div>
              </DialogHeader>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
