'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Minus, Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from 'react';
import { useCart } from '@/hooks/cart';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  sku: string;
  name: string;
  price: number;
  image: string;
  category: string;
  sub_category: string;
  stock_qty: number;
}

export function ProductCard({ sku, name, price, image, category, sub_category, stock_qty }: ProductCardProps) {
  const [isAddedtoCart, setIsAddedtoCart] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedQty, setSelectedQty] = useState(1);
  const { items, addItem } = useCart();
  const stockQtyNum = Number(stock_qty);
  const isOutOfStock = stockQtyNum <= 0;

  const itemInCart = items.find(item => item.id === sku);
  const currentQtyInCart = itemInCart ? itemInCart.quantity : 0;

  const isLimitReached = (currentQtyInCart + selectedQty) > stockQtyNum;
  const isFullyStockedInCart = currentQtyInCart >= stockQtyNum;


  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedQty(1);
    setIsOpen(true);
  };

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

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock || isFullyStockedInCart) return;

    addItem({ 
      id: sku, 
      name, 
      price, 
      image,
      stock_qty,
      category,
      sub_category,
    }, stockQtyNum, selectedQty);
    setIsOpen(false);

    setIsAddedtoCart(true);
  };

  const productUrl = `/collection/${category.toLowerCase().replace(/\s+/g, '-')}/${sub_category.toLowerCase().replace(/\s+/g, '-')}/${name.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <>
      <Link href={productUrl}>
        <Card className="group relative flex h-full flex-col overflow-hidden transition-shadow hover:shadow-lg">
          <CardContent className='p-0'>
            <div className="relative aspect-square overflow-hidden bg-white">
              <Image
                src={image}
                alt={name}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
              {isOutOfStock ? (
                <div className="absolute left-5 z-20 bg-red-600 text-white px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
                  Out of Stock
                </div>
              ) : stockQtyNum <= 5 ? (
                <div className="absolute left-5 z-20 bg-amber-500 text-white px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
                  Low Stock: {stockQtyNum} left
                </div>
              ) : null}
              <div 
                onClick={handleQuickView} 
                className="hidden lg:flex absolute bottom-3 right-4 bg-red-600 py-2 px-4 rounded-lg transition-all duration-300 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 shadow-md z-10 cursor-pointer"
              >
                <span className="text-[#f8f8f8] text-sm font-medium whitespace-nowrap">
                  Quick View
                </span>
              </div>
            </div>
            <div className="grow p-4 pr-12">
              <h3 className="mb-2 text-sm font-semibold text-gray-900 line-clamp-2">
                {name}
              </h3>
              <p className="text-md font-medium text-red-600">₱
                {price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                <span className='text-xs text-gray-400'> / PC </span>
              </p>
            </div>
            <div 
              onClick={handleQuickView} 
              className="lg:hidden absolute bottom-4 right-4 bg-white p-2 rounded-full border border-gray-200 text-gray-900 pointer-events-auto">
                <Eye size={20} />
            </div>
          </CardContent>
        </Card>
      </Link>

      {/* Quick View Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="w-[95vw] sm:max-w-sm md:max-w-2xl lg:max-w-4xl h-fit max-h-[90vh] overflow-y-auto p-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> 
            <div className="relative aspect-square rounded-lg overflow-hidden bg-white">
              <Image src={image} alt={name} fill className="object-fill" />
            </div>
            <div className="flex flex-col justify-between mx-8 mb-8 md:my-12 md:mr-12">
              <div>
                <DialogHeader>
                  <DialogTitle className="text-md md:text-xl font-semibold text-center md:text-left">{name}</DialogTitle>
                </DialogHeader>
                <p className="text-center md:text-left text-sm text-gray-400 font-semibold mt-1 mb-6">Category
                  <span className="font-normal"> {sub_category}</span>
                </p>
                <div className="grid grid-cols-[1fr_2fr] gap-4 text-sm font-semibold py-4">
                  <div className="gap-2 flex flex-col">
                    <p className="mt-1">SKU: <span className="font-normal">{sku}</span></p>
                    <p>Stock: <span className="font-normal">{stock_qty}</span></p>
                  </div>
                  <div>
                    <p className="mt-1 font-normal text-gray-600 leading-relaxed line-clamp-10">
                      High-quality {sub_category} perfect for modern architectural designs. Durable, aesthetic, and built to last.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex flex-col gap-3">
                  <div className="flex gap-1 justify-between">
                    <span className="text-2xl font-medium text-red-600">₱
                      {price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                    {/* <span className="text-sm text-gray-400 uppercase font-medium">/ PC</span> */}

                    {!isOutOfStock && !isFullyStockedInCart && (
                      <div className="flex items-center border rounded-md">
                        <button 
                          onClick={handleDecrement}
                          className="p-2 hover:bg-gray-100 transition-colors"
                          disabled={selectedQty <= 1}
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-10 text-center font-semibold text-sm">
                          {selectedQty}
                        </span>
                        <button 
                          onClick={handleIncrement}
                          className="p-2 hover:bg-gray-100 transition-colors"
                          disabled={currentQtyInCart + selectedQty >= stockQtyNum}
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 mt-2">
                    <Button 
                      onClick={handleAddToCart}
                      disabled={isOutOfStock || isLimitReached}
                      className={cn(
                        "flex-1 h-12 rounded-lg font-bold uppercase tracking-wider",
                        (isOutOfStock || isLimitReached) ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-red-600 hover:bg-red-700 text-white"
                      )}
                    >
                      {isOutOfStock ? "Out of Stock" : isLimitReached ? "Limit Reached" : "Add to Cart"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Added to Card Modal */}
      <Dialog open={isAddedtoCart} onOpenChange={setIsAddedtoCart}>
        <DialogContent className="
          left-auto top-auto translate-x-0 translate-y-0 
          
          fixed bottom-4 left-4 right-4 sm:bottom-6 sm:right-6 sm:left-auto
          
          w-auto sm:w-[400px] md:w-[500px] h-auto min-h-0
          
          p-4 shadow-2xl rounded-xl border border-gray-100
          [&>button]:hidden duration-500 animate-in fade-in slide-in-from-bottom-10
        ">
          <DialogHeader>
            <DialogTitle className="text-center text-sm bg-gray-200 text-gray-500 py-3 rounded-lg">Item Added to Cart!</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="items-center justify-center flex pb-3">
              <Image src={image} alt={name} width={200} height={200} className="object-fill" />
            </div>
            <div className="md:col-span-2 flex flex-col leading-tight">
              <DialogHeader>
                <DialogTitle className="text-md text-center md:text-start">{name}</DialogTitle>
                <p className="text-sm text-center md:text-start text-gray-500">{sku}</p>
                <div className="flex flex-row justify-between items-center">
                  <p className="text-lg text-center md:text-start font-medium text-red-600">₱ {(price * selectedQty).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                  <p className="text-sm text-center font-normal text-gray-500">Qty: {selectedQty}</p>
                </div>
                <Link href={"/cart"}>
                  <Button className="bg-red-600 hover:bg-red-700 text-white w-full mt-5 cursor-pointer" onClick={() => setIsAddedtoCart(false)}>
                    View Cart 
                  </Button>
                </Link>
              </DialogHeader>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}