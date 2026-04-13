"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { cn } from "@/lib/utils";
import { useCart } from "@/hooks/cart";
import { Minus, Plus, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Reveal } from "@/components/reveal";

export default function CartPage() {
  const { items, totalPrice, removeItem, updateQuantity } = useCart();
  const [showAll, setShowAll] = useState(true);

  const visibleItems = showAll ? items : items.slice(0, 3);
  const hasMore = items.length > 3;

  const handleQuantityChange = (
    itemId: string,
    newQuantity: number,
    stockQty: number,
  ) => {
    if (newQuantity < 1) return;
    if (newQuantity > stockQty) {
      alert(`Only ${stockQty} units available in stock.`);
      return;
    }
    updateQuantity(itemId, newQuantity);
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      <Reveal>
        <div className="container mx-auto my-15 md:my-20 px-4">
          {/* Header */}
          <div className="flex flex-col items-center mb-10 md:mb-20">
            <h1
              className={cn(
                "text-5xl md:text-7xl text-gray-900",
                "windsong-medium",
              )}
            >
              Cart
            </h1>
          </div>

          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <p className="text-md font-medium text-gray-500">
                Your cart is empty
              </p>
              <Link href="/collection">
                <Button variant="outline">Continue Shopping</Button>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-15 items-start">
              {/* Cart Items */}
              <div className="w-full lg:flex-1">
                {/* Table Header */}
                <div className="hidden lg:grid grid-cols-4 border-b py-4 text-sm font-semibold uppercase tracking-wider text-gray-700">
                  <p className="col-span-2">Product</p>
                  <p className="col-span-1 text-center">Quantity</p>
                  <p className="col-span-1 text-right">Total</p>
                </div>

                <div className="flex flex-col">
                  {visibleItems.map((item, i) => (
                    <Reveal key={item.id} delay={i * 30}>
                      <div
                        key={item.id}
                        className="flex flex-col lg:grid lg:grid-cols-4 items-center py-6 border-b gap-4"
                      >
                        {/* Product Info */}
                        <div className="flex items-center w-full lg:col-span-2">
                          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md">
                            <Image
                              src={item.image || "/placeholder.png"}
                              alt={item.name}
                              fill
                              className="object-cover"
                              sizes="80px"
                            />
                          </div>
                          <div className="ml-6">
                            <p className="font-semibold text-gray-900 text-sm md:text-base">
                              {item.name}
                            </p>
                            <p className="text-xs text-gray-500">{item.sku}</p>
                            <p className="text-xs md:text-sm text-red-600 mt-3">
                              ₱{" "}
                              {item.price.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                              })}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-row items-center justify-between w-full lg:contents">
                          <div className="flex flex-col lg:flex-row lg:justify-end lg:col-span-1 lg:order-last">
                            <span className="lg:hidden text-sm text-gray-500 mr-2">
                              Total:
                            </span>
                            <p className="font-medium text-red-600 text-sm md:text-lg">
                              ₱{" "}
                              {(item.price * item.quantity).toLocaleString(
                                undefined,
                                { minimumFractionDigits: 2 },
                              )}
                            </p>
                          </div>

                          {/* Quantity Selector */}
                          <div className="flex flex-col items-end lg:items-center justify-center lg:col-span-1 gap-2">
                            <div className="flex items-center border rounded-md bg-transparent">
                              <button
                                onClick={() =>
                                  handleQuantityChange(
                                    item.id,
                                    item.quantity - 1,
                                    item.stock_qty,
                                  )
                                }
                                disabled={item.quantity <= 1}
                                className="p-2 border-r hover:bg-gray-100 disabled:opacity-30 transition-colors"
                              >
                                <Minus size={10} />
                              </button>
                              <input
                                id={`quantity-${item.id}`}
                                type="number"
                                value={item.quantity}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value);
                                  if (!isNaN(val)) {
                                    handleQuantityChange(
                                      item.id,
                                      Math.min(
                                        Math.max(1, val),
                                        item.stock_qty,
                                      ),
                                      item.stock_qty,
                                    );
                                  } else if (e.target.value === "") {
                                    handleQuantityChange(
                                      item.id,
                                      0,
                                      item.stock_qty,
                                    );
                                  }
                                }}
                                onBlur={(e) => {
                                  if (
                                    e.target.value === "" ||
                                    parseInt(e.target.value) < 1
                                  ) {
                                    handleQuantityChange(
                                      item.id,
                                      1,
                                      item.stock_qty,
                                    );
                                  }
                                }}
                                className="w-8 md:w-14 text-center font-semibold text-xs md:text-sm bg-transparent focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                              />
                              <button
                                onClick={() =>
                                  handleQuantityChange(
                                    item.id,
                                    item.quantity + 1,
                                    item.stock_qty,
                                  )
                                }
                                disabled={item.quantity >= item.stock_qty}
                                className="p-2 border-l hover:bg-gray-100 disabled:opacity-30 transition-colors"
                              >
                                <Plus size={10} />
                              </button>
                            </div>

                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-xs text-gray-400 underline hover:text-gray-500 transition-colors"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </Reveal>
                  ))}
                </div>

                {/* Show more/less */}
                {hasMore && (
                  <button
                    onClick={() => setShowAll((prev) => !prev)}
                    className="mt-4 flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showAll ? (
                      <>
                        <ChevronUp size={14} /> Show less
                      </>
                    ) : (
                      <>
                        <ChevronDown size={14} /> Show all {items.length} items
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Order Summary */}
              <div className="w-full lg:w-72 lg:sticky lg:top-30">
                <div className="border rounded-xl p-6 bg-white shadow-sm space-y-4">
                  <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-400">
                    Order Summary
                  </h2>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>
                        Items ({items.reduce((acc, i) => acc + i.quantity, 0)})
                      </span>
                      <span>
                        ₱{" "}
                        {totalPrice.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="border-t pt-4 flex justify-between items-center font-semibold text-gray-900">
                    <span>Subtotal</span>
                    <span>
                      ₱{" "}
                      {totalPrice.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 italic">
                    * Final pricing may vary depending on delivery,
                    installation, and other charges.
                  </p>
                  <Link href="/inquiry-form">
                    <Button className="cursor-pointer w-full bg-red-600 h-12 text-sm font-semibold hover:bg-red-700">
                      Proceed
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </Reveal>

      <Footer />
    </div>
  );
}
