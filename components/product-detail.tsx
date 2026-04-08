"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { useCart } from "@/hooks/cart";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import Link from "next/link";
import Image from "next/image";

interface ProductActionsProps {
  product: {
    sku: string;
    name: string;
    price: number;
    image_url: string;
    stock_qty: number;
    category: string;
    sub_category: string;
    description?: string;
  };
}

export function ProductDetailActions({ product }: ProductActionsProps) {
  const [isAddedtoCart, setIsAddedToCart] = useState(false);
  const [selectedQty, setSelectedQty] = useState(1);
  const { items, addItem } = useCart();

  const stockQtyNum = Number(product.stock_qty);
  const isOutOfStock = stockQtyNum <= 0;
  const itemInCart = items.find((item) => item.id === product.sku);
  const currentQtyInCart = itemInCart ? itemInCart.quantity : 0;

  const isLimitReached = currentQtyInCart + selectedQty > stockQtyNum;
  const isFullyStockedInCart = currentQtyInCart >= stockQtyNum;

  useEffect(() => {
    if (isAddedtoCart) {
      const timer = setTimeout(() => {
        setIsAddedToCart(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isAddedtoCart, setIsAddedToCart]);

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

  const handleAddToCart = () => {
    if (isOutOfStock || isFullyStockedInCart) return;

    addItem(
      {
        id: product.sku,
        name: product.name,
        sku: product.sku,
        price: product.price,
        image: product.image_url,
        stock_qty: product.stock_qty,
        category: product.category,
        sub_category: product.sub_category,
        description: product.description,
      },
      stockQtyNum,
      selectedQty,
    );
    setIsAddedToCart(true);
  };

  return (
    <div className="space-y-5">
      {/* Quantity Selector */}
      {!isOutOfStock && !isFullyStockedInCart && (
        <div className="space-y-2">
          <p className="font-semibold">Quantity:</p>
          <div className="flex items-center border rounded-md w-fit bg-white">
            <button
              onClick={handleDecrement}
              disabled={selectedQty <= 1}
              className="px-4 py-2 border-r hover:bg-gray-100 disabled:opacity-30 transition-colors"
            >
              <Minus size={18} />
            </button>
            <input
              id="quantity"
              type="text"
              inputMode="numeric"
              value={selectedQty === 0 ? "" : selectedQty}
              onChange={(e) => {
                const val = e.target.value;
                if (val === "") {
                  setSelectedQty(0);
                  return;
                }

                if (/^\d+$/.test(val)) {
                  const num = parseInt(val, 10);
                  const maxAllowed = stockQtyNum - currentQtyInCart;
                  setSelectedQty(Math.min(num, maxAllowed));
                }
              }}
              onBlur={() => {
                if (selectedQty < 1) {
                  setSelectedQty(1);
                }
              }}
              className="w-14 text-center font-semibold text-sm bg-transparent focus:outline-none"
            />
            <button
              onClick={handleIncrement}
              disabled={currentQtyInCart + selectedQty >= stockQtyNum}
              className="px-4 py-2 border-l hover:bg-gray-100 disabled:opacity-30 transition-colors"
            >
              <Plus size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Add to Cart Button */}
      <div className="flex flex-col sm:flex-row gap-3 mt-2">
        <Button
          onClick={handleAddToCart}
          disabled={isOutOfStock || isLimitReached || isFullyStockedInCart}
          className={cn(
            "cursor-pointer flex-1 h-14 rounded-lg font-bold uppercase tracking-wider text-md md:text-lg transition-all",
            isOutOfStock || isLimitReached || isFullyStockedInCart
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-red-600 hover:bg-red-700 text-white active:scale-[0.98]",
          )}
        >
          {isOutOfStock
            ? "Out of Stock"
            : isFullyStockedInCart
              ? "Max in Cart"
              : isLimitReached
                ? "Limit Reached"
                : "Add to Cart"}
        </Button>
      </div>

      <Dialog open={isAddedtoCart} onOpenChange={setIsAddedToCart}>
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
              {product.name} is added to your cart.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="items-center justify-center flex pb-3">
              <Image
                src={product.image_url}
                alt={product.name}
                width={200}
                height={200}
                className="object-fill rounded-lg"
              />
            </div>
            <div className="md:col-span-2 flex flex-col leading-tight">
              <DialogHeader>
                <DialogTitle className="text-md text-center md:text-start">
                  {product.name}
                </DialogTitle>
                <p className="text-sm text-center md:text-start text-gray-500">
                  {product.sku}
                </p>
                <div className="flex flex-row justify-between items-center">
                  <p className="text-lg text-center md:text-start font-medium text-red-600">
                    ₱{" "}
                    {(product.price * selectedQty).toLocaleString(undefined, {
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
                    onClick={() => setIsAddedToCart(false)}
                  >
                    Keep Browsing
                  </Button>
                  <Link href={"/cart"} className="flex-1">
                    <Button
                      className="h-10 bg-red-600 hover:bg-red-700 text-white w-full mt-5 cursor-pointer"
                      onClick={() => setIsAddedToCart(false)}
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

      {currentQtyInCart > 0 && (
        <p className="text-xs text-gray-500 italic">
          You currently have {currentQtyInCart} in your cart.
        </p>
      )}
    </div>
  );
}
