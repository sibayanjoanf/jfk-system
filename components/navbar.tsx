'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ChevronDown, Menu, Package, Search, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CategoryWithSub } from '@/lib/types';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { Spinner } from './ui/spinner';
import Image from 'next/image';
import { useCart } from '@/hooks/cart';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCollectionOpen, setIsCollectionOpen] = useState(false);
  const [categories, setCategories] = useState<CategoryWithSub[]>([]);

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const order = ['Tiles', 'Stones', 'Fixtures'];
          const sortedCategories = data.data.sort((a: CategoryWithSub, b: CategoryWithSub) => {
            const indexA = order.indexOf(a.name);
            const indexB = order.indexOf(b.name);
            const posA = indexA === -1 ? 99 : indexA;
            const posB = indexB === -1 ? 99 : indexB;
            return posA - posB;
          });
          setCategories(sortedCategories);
        }
      });
  }, []);

  const logo = "https://zdahzxsipjtwxbraslvb.supabase.co/storage/v1/object/public/JFK%20Assets/logo/jfk_logo.png";
  const { items, totalPrice, removeItem, clearCart } = useCart();
  const totalQty = items.reduce((acc, item) => acc + item.quantity, 0);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About Us' },
    { label: 'Collection', icon: ChevronDown },
    { href: '/faq', label: 'FAQ' },
    { href: '/contact', label: 'Contact' },
  ];

  const navBtns = [
    { href: '/search', icon: Search },
    { href: '/track-order', icon: Package },
    { href: '/cart', icon: ShoppingCart, onClick: () => setIsCartOpen(true) },
  ];

  return (
    <header className="fixed top-0 z-50 w-full">
      {/* Top Red Marquee */}
      <div className="bg-red-600 text-white py-2 overflow-hidden">
        <div className="animate-marquee text-[10px] md:text-[10px] font-medium uppercase tracking-[0.2em]">
          <span className="marquee-content">
            Special Offer: Get 10% off on all Floor Tiles this month! • 
            Free delivery for orders over ₱50,000 • 
            Visit our showrooms in Barit, Bulangon, and Rizal • 
            Quality Tile and Stone Builders since 2009
          </span>
          <span className="marquee-content">
            Special Offer: Get 10% off on all Floor Tiles this month! • 
            Free delivery for orders over ₱50,000 • 
            Visit our showrooms in Barit, Bulangon, and Rizal • 
            Quality Tile and Stone Builders since 2009 
          </span>
        </div>
      </div>

      {/* Main Navbar */}
      <nav 
        className={cn(
          "w-full bg-[#f8f8f8] transition-all duration-300",
          isCollectionOpen ? "border-b border-gray-200" : "border-b border-transparent"
        )}
        onMouseLeave={() => setIsCollectionOpen(false)}
      >
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <img 
                src={logo} 
                alt="JFK Logo" 
                className='h-9 w-auto object-contain'
              />
              <div className='flex flex-col gap-[-10] leading-tight'>
                <span className="text-xs font-semibold text-gray-900">Tile and </span>
                <span className="text-xs font-semibold text-gray-900">Stone Builders</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link) => {
                const isCollection = link.label === 'Collection';
                
                const content = (
                  <>
                    <span>{link.label}</span>
                    {link.icon && (
                      <link.icon className={cn(
                        "h-4 w-4 transition-transform duration-300", 
                        isCollectionOpen && isCollection && "rotate-180"
                      )} />
                    )}
                  </>
                );

                const commonClasses = cn(
                  "flex items-center space-x-1 text-sm font-medium transition-colors",
                  isCollection && isCollectionOpen ? "text-red-600" : "text-black hover:text-red-600"
                );

                return (
                  <div 
                    key={link.label}
                    onMouseEnter={() => isCollection ? setIsCollectionOpen(true) : setIsCollectionOpen(false)}
                    className="relative h-16 flex items-center"
                  >
                    {link.href ? (
                      <Link href={link.href} className={commonClasses}>
                        {content}
                      </Link>
                    ) : (
                      <button type="button" className={cn(commonClasses, "cursor-default")}>
                        {content}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Desktop Buttons */}
            <div className="hidden lg:flex md:space-x-4">
              {navBtns.map((link) => {
                const Icon = link.icon;
                const commonClasses = "flex items-center space-x-1 text-sm font-normal text-black transition-colors hover:text-red-600";
                const isCart = Icon === ShoppingCart;

                if (link.onClick) {
                  return (
                    <button
                      key={link.href}
                      onClick={link.onClick}
                      className={cn(commonClasses, "bg-transparent border-none cursor-pointer relative")}
                    >
                      {Icon && <Icon className="h-4 w-4" />}
                      
                      {isCart && totalQty > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                          {totalQty}
                        </span>
                      )}
                    </button>
                  );
                }

                return (
                  <Link key={link.href} href={link.href} className={commonClasses}>
                    {Icon && <Icon className="h-4 w-4" />}
                  </Link>
                );
              })}
            </div>

            {/* Mobile Burger Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle className="flex items-center space-x-2">
                    <img 
                      src={logo} 
                      alt="JFK Logo" 
                      className='h-9 w-auto object-contain'
                    />
                    <div className='flex flex-col gap-[-10] leading-tight'>
                      <span className="text-xs font-semibold text-gray-900">Tile and </span>
                      <span className="text-xs font-semibold text-gray-900">Stone Builders</span>
                    </div>
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-6 flex flex-col space-y-4 px-4">
                  {navLinks.map((link) => {
                    const isCollection = link.label === 'Collection';
                    const commonClasses = "flex items-center space-x-3 text-md font-normal text-gray-900 transition-colors hover:text-red-600";

                    if (link.href) {
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setIsOpen(false)}
                          className={commonClasses}
                        >
                          <span>{link.label}</span>
                        </Link>
                      );
                    }
                    return (
                      <div 
                        key={link.label} 
                        className={cn(commonClasses, "cursor-pointer")}
                        onClick={() => {
                          console.log("Collection clicked on mobile");
                        }}
                      >
                        <span>{link.label}</span>
                        {link.icon && <link.icon className="h-4 w-4" />}
                      </div>
                    );
                  })}
                </div>
              </SheetContent>
            </Sheet>

            {/* Cart Menu */}
            <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
              <SheetContent side="right" className="bg-white w-full"> 
                <SheetTitle className="sr-only"></SheetTitle>
                <div className="mt-10 flex flex-col">
                  <div className="py-3 mx-6 flex justify-between font-medium text-sm text-gray-600 border-b">
                    <p className="uppercase">Items in Cart ({items.length})</p>
                    <p onClick={() => clearCart()} className="text-red-600 cursor-pointer">Clear Cart</p>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                  {items.length === 0 ? (
                    <div className="flex h-full flex-col justify-center items-center space-y-4">
                      <ShoppingCart className="h-10 w-10 text-red-600" />
                      <p className="text-md font-medium text-red-600">Your cart is empty</p>
                      <Button 
                        variant="outline" 
                        onClick={() => setIsCartOpen(false)}
                        className="hover:bg-gray-100 text-gray-500 text-xs bg-transparent"
                      >
                        Continue Shopping
                      </Button>
                    </div>
                  ) : (
                    items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center py-6 border-b mx-6">
                        <Link 
                          href={`/collection/${item.category.toLowerCase().replace(/\s+/g, '-')}/${item.sub_category.toLowerCase().replace(/\s+/g, '-')}/${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                        >
                          <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md  border-gray-200 mr-4">
                            <Image 
                              src={item.image || '/placeholder.png'} 
                              alt={item.name} 
                              fill 
                              className="object-cover" 
                            />
                          </div>
                        </Link>
                        <div className="relative -ml-8">
                          <p className="font-medium text-sm w-[15vh]">{item.name}</p>
                          <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-sm">
                            <span className="font-medium">₱</span>
                            {(item.price * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                          <button 
                            onClick={() => removeItem(item.id)}
                            className="text-xs text-red-500 underline cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {items.length > 0 && (
                  <div className="mt-auto p-6">
                    <div className="flex justify-between font-semibold text-md">
                      <span>Total</span>
                      <span>
                        <span className="font-medium">₱ </span> 
                          {totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                    </div>
                    <Link href="/cart" onClick={() => setIsCartOpen(false)}>
                      <Button className="w-full mt-5 bg-red-600 h-10 hover:bg-red-700 cursor-pointer">View Cart</Button>
                    </Link>
                  </div>
                )}
              </SheetContent>
            </Sheet>

            {/* Collection Overlay */}
            <div 
              className={cn(
                "fixed inset-0 top-[90px] bg-black/30 transition-opacity duration-500 z-[-2] pointer-events-none",
                isCollectionOpen ? "opacity-100" : "opacity-0"
              )}
            />
            <div 
              className={cn(
                "absolute left-0 top-[90px] w-full bg-[#f8f8f8] border-b border-gray-200 shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] z-[-1] overflow-hidden",
                isCollectionOpen ? "max-h-fit opacity-100" : "max-h-0 opacity-0"
              )}
            >
              <div className="container mx-auto py-12 px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                {categories.map((category) => (
                  <div key={category.id} className="flex flex-col space-y-4">
                    <Link 
                      href={`/collection/${category.name.toLowerCase().replace(/\s+/g, '-')}`} 
                      className="hover:text-red-600 transition-colors"
                      onClick={() => setIsCollectionOpen(false)}
                    >
                      <h3 className="text-[17px] font-semibold">
                        {category.name}
                      </h3>
                    </Link>
                    
                    <div className="flex flex-col space-y-4 text-sm text-gray-600 border-l border-gray-100">
                      {category.sub_categories?.map((sub) => (
                        <Link 
                          key={sub.id} 
                          href={`/collection/${category.name.toLowerCase().replace(/\s+/g, '-')}/${sub.name.toLowerCase().replace(/\s+/g, '-')}`} 
                          className="hover:text-red-600 transition-colors"
                          onClick={() => setIsCollectionOpen(false)}
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}

                <Link href="/collection">
                  <div className="relative bg-gray-300 flex justify-center items-center rounded-md h-32 shadow-2xl">
                    <div className="absolute inset-0 z-0">
                      <Image 
                        src="/images/featured-photo-3.png"
                        alt='all_collection_img'
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                    <div className="absolute inset-0 rounded-md bg-black/30 hover:bg-black/0 transition-colors duration-300 z-10"></div>
                    <p className="relative text-lg font-semibold text-white z-20">All Collection</p>
                  </div>
                </Link>

                {categories.length === 0 && (
                  <div className="flex gap-2 col-span-4 text-center text-gray-400 py-10">
                    <Spinner />
                    <span className="text-gray-400">Loading branches...</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}