'use client';

import Link from 'next/link';
import { ChevronDown, ChevronUp, ShoppingCart } from 'lucide-react';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/cart';
import Image from 'next/image';

export default function InquiryFormPage() {

  const logo = "https://zdahzxsipjtwxbraslvb.supabase.co/storage/v1/object/public/JFK%20Assets/logo/jfk_logo.png";
  const inputStyles = "border-gray-300 bg-transparent h-12 text-sm";
  const [sortBy, setSortBy] = useState("all");
  const { items } = useCart();

  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const totalAmount = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <div className="bg-transparent">
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
        <nav>
          <div className="container mx-auto px-4 bg-[#f8f8f8]">
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

              {/* Cart Button */}
              <div className="hidden lg:flex md:space-x-4">
                <Link href="/cart">
                  <ShoppingCart className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </nav>
      </header>

      <main>
        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-20 items-start min-h-[85vh]">
          {/* Form */}
          <div className="flex flex-col gap-5 order-2 lg:order-1 lg:sticky lg:top-32 h-fit pb-10 self-start">
            <h1 className="font-semibold text-lg md:text-2xl text-left">Inquiry Form</h1>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field>
                <Input id="/first-name" placeholder="First Name" className={inputStyles} required />
              </Field>
              <Field>
                <Input id="/last-name" placeholder="Last Name" className={inputStyles} required />
              </Field>
            </div>
            
            <Field>
              <Input id="/email" type="email" placeholder="Email Address" className={inputStyles} required />
            </Field>
            
            <Field>
              <Input id="/phone" type="tel" placeholder="Phone" className={inputStyles} required />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Select onValueChange={setSortBy}>
                <SelectTrigger className="w-full py-6 border-gray-300 bg-transparent text-sm">
                  <SelectValue placeholder="Delivery Preferences"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="a-to-z">Delivery</SelectItem>
                    <SelectItem value="z-to-a">Walk In</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Select onValueChange={setSortBy}>
                <SelectTrigger className="w-full py-6 border-gray-300 bg-transparent text-sm">
                  <SelectValue placeholder="Payment Preferences"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="a-to-z">Cash</SelectItem>
                    <SelectItem value="z-to-a">Online Payment</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <Textarea
              id="message"
              placeholder="Message / Notes"
              className={cn(
                "min-h-[120px] md:min-h-[180px] border-gray-300 bg-transparent p-4 text-sm placeholder:text-gray-400",
                "resize-none overflow-y-auto"
              )}
            />

            <Link href="/confirmation">
              <Button className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm md:text-md transition-colors cursor-pointer">
                Submit Inquiry
              </Button>
            </Link>

            <div className="flex flex-wrap gap-4 md:gap-6 pt-6 border-t border-gray-300 text-xs md:text-sm text-gray-500 justify-center lg:justify-start">
              <Link href="/terms-and-conditions" className="hover:text-red-600">Terms & Conditions</Link>
              <Link href="/privacy-policy" className="hover:text-red-600">Privacy Policy</Link>
              <Link href="/contact" className="hover:text-red-600">Contact</Link>
            </div>
          </div>

          {/* Items */}
          <div className="flex flex-col order-1 lg:order-2 mt-5 lg:min-h-150">
            <button 
              onClick={() => setIsOrderOpen(!isOrderOpen)}
              className="flex lg:hidden items-center justify-between w-full py-4 border-b border-gray-200 mb-2"
            >
              <div className="flex items-center gap-2">
                <h2 className="font-semibold text-lg md:text-2xl">Your Order</h2>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-500">
                  {items.length} {items.length === 1 ? 'item' : 'items'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {isOrderOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
            </button>

            {/* Collapsible Content */}
            <div className={cn(
              "flex-col lg:flex", 
              isOrderOpen ? "flex" : "hidden"
            )}>
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-4 gap-4">
                  <div className="flex items-center gap-4">
                    <div className="relative h-16 w-16 md:h-24 md:w-24 shrink-0 overflow-hidden rounded-md border border-gray-100">
                      <Image
                        src={item.image || '/placeholder.png'}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="text-xs md:text-sm font-medium">
                      <p className="text-gray-900 line-clamp-2">{item.name}</p>
                      <p className="text-gray-400 font-normal mt-1">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="text-right whitespace-nowrap">
                    <p className="text-red-600 font-medium text-sm md:text-base">
                      ₱ {(item.price * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              ))}

              <div className="flex justify-between items-center text-base md:text-lg font-medium py-6 my-2 border-y border-gray-200">
                <p>Total</p>
                <p>
                  ₱ {totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}