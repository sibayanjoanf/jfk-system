"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { cn } from "@/lib/utils";
import { useCart } from '@/hooks/cart';
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from 'next/image';
import Link from 'next/link';

export default function CartPage() {
  const { items, totalPrice, removeItem, updateQuantity } = useCart();

  const handleQuantityChange = (itemId: string, newQuantity: number, stockQty: number) => {
    if (newQuantity < 1) return;

    if (newQuantity > stockQty) {
      alert(`Only ${stockQty} units available in stock.`);
      return;
    }
    updateQuantity(itemId, newQuantity);
  };

  return (
    <div className="flex min-h-screen flex-col bg-transparent">
      <Navbar />

      <div className="container mx-auto my-10 md:my-20 px-4">
        {/* Header */}
        <div className="flex flex-col items-center mb-12">
          <h1 className={cn("text-5xl md:text-7xl text-gray-900", "windsong-medium")}>
            Cart
          </h1>
        </div>

        <div className="w-full">
          {/* Table Header */}
          <div className="hidden lg:grid grid-cols-4 border-b py-4 text-sm font-semibold uppercase tracking-wider text-gray-700">
            <p className="col-span-2">Product</p>
            <p className="col-span-1 text-center">Quantity</p>
            <p className="col-span-1 text-right">Total</p>
          </div>

          <div className="flex flex-col">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <p className="text-md font-medium text-gray-500">Your cart is empty</p>
                <Link href="/collection">
                  <Button variant="outline">Continue Shopping</Button>
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex flex-col lg:grid lg:grid-cols-4 items-center py-6 border-b gap-4">
                  {/* Product Info */}
                  <div className="flex items-center w-full lg:col-span-2">
                    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md border border-gray-100">
                      <Image 
                        src={item.image || '/placeholder.png'} 
                        alt={item.name} 
                        fill 
                        className="object-cover" 
                      />
                    </div>
                    <div className="ml-6">
                      <p className="font-semibold text-gray-900 text-sm md:text-base">{item.name}</p>
                      <p className="text-xs md:text-sm text-red-600 mt-1">₱ 
                        {item.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-row items-center justify-between w-full lg:contents">
                    <div className="flex flex-col lg:flex-row lg:justify-end lg:col-span-1 lg:order-last">
                      <span className="lg:hidden text-sm text-gray-500 mr-2">Total:</span>
                      <p className="font-medium text-red-600 text-sm md:text-lg">
                        ₱ {(item.price * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </p>
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex flex-col items-end lg:items-center justify-center lg:col-span-1 gap-2">
                      <div className="flex items-center border rounded-md bg-transparent">
                        <button 
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1, item.stock_qty)}
                          disabled={item.quantity <= 1}
                          className="p-2 border-r hover:bg-gray-100 disabled:opacity-30 transition-colors"
                        >
                          <Minus size={10} />
                        </button>
                        <span className="w-6 md:w-12 text-center font-semibold text-xs md:text-sm">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1, item.stock_qty)}
                          disabled={item.quantity >= item.stock_qty}
                          className="p-2 border-l hover:bg-gray-100 disabled:opacity-30 transition-colors"
                        >
                          <Plus size={10} />
                        </button>
                      </div>
                      
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-xs text-gray-400 underline hover:text-gray-500 transition-colors flex items-center gap-1"
                      >
                        Remove
                      </button>
                    </div>

                  </div>
                </div>
              ))
            )}
          </div>

          {/* Checkout Summary */}
          {items.length > 0 && (
            <div className="mt-10 flex flex-col items-end pt-5">
              <div className="w-full lg:w-1/3 space-y-4">
                <div className="flex justify-between text-lg md:text-xl font-semibold text-gray-900 pb-3">
                  <span>Subtotal</span>
                  <span>
                    <span className="font-medium">₱ </span>
                    {totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <Link href="/inquiry-form">
                  <Button className="cursor-pointer w-full bg-red-600 h-12 text-md font-semibold hover:bg-red-700">
                    Next
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}