'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Minus, Plus } from 'lucide-react';
import { useCart } from '@/hooks/cart';
import { cn } from '@/lib/utils';

interface ProductActionsProps {
  product: {
    sku: string;
    name: string;
    price: number;
    image_url: string;
    stock_qty: number;
    category: string;
    sub_category: string;
  };
}

export function ProductDetailActions({ product }: ProductActionsProps) {
  const [selectedQty, setSelectedQty] = useState(1);
  const { items, addItem } = useCart();
  
  const stockQtyNum = Number(product.stock_qty);
  const isOutOfStock = stockQtyNum <= 0;
  const itemInCart = items.find(item => item.id === product.sku);
  const currentQtyInCart = itemInCart ? itemInCart.quantity : 0;

  const isLimitReached = (currentQtyInCart + selectedQty) > stockQtyNum;
  const isFullyStockedInCart = currentQtyInCart >= stockQtyNum;

  const handleIncrement = () => {
    if (currentQtyInCart + selectedQty < stockQtyNum) {
      setSelectedQty(prev => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (selectedQty > 1) {
      setSelectedQty(prev => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (isOutOfStock || isFullyStockedInCart) return;

    addItem({ 
      id: product.sku, 
      name: product.name, 
      price: product.price, 
      image: product.image_url,
      stock_qty: product.stock_qty,
      category: product.category,
      sub_category: product.sub_category
    }, stockQtyNum, selectedQty);
  };

  return (
    <div className="space-y-6">
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
            <span className="w-14 text-center font-semibold text-lg">
              {selectedQty}
            </span>
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
            "flex-1 h-14 rounded-lg font-bold uppercase tracking-wider text-lg transition-all",
            (isOutOfStock || isLimitReached || isFullyStockedInCart) 
              ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
              : "bg-red-600 hover:bg-red-700 text-white shadow-md active:scale-[0.98]"
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
      
      {/* Small stock indicator helper */}
      {currentQtyInCart > 0 && (
        <p className="text-xs text-gray-500 italic">
          You currently have {currentQtyInCart} in your cart.
        </p>
      )}
    </div>
  );
}