"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { FAQWithCategory } from "@/lib/types";
import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQPage() {
  const [FAQCategories, setFAQCategories] = useState<FAQWithCategory[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/faq_categories') 
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setFAQCategories(data.data);
          if (data.data.length > 0) {
            setActiveCategoryId(data.data[0].id);
          }
        }
      })
      .catch((err) => console.error("Failed to fetch FAQs:", err));
  }, []);

  const activeCategory = FAQCategories.find(cat => cat.id === activeCategoryId);

  return (
    <div className="flex min-h-screen min-w-20 flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gray-50 py-10 md:py-20 lg:py-20">
        <div className="absolute inset-0 opacity-100">
          <Image src="/images/JFK_homePage_bg.png" alt="Background" fill className="object-cover" priority />
        </div>
        <div className="container relative mx-auto px-4">
          <div className="max-w-[100vh]">
            <h1 className={cn("mb-6 text-5xl md:text-7xl text-gray-900 leading-[1.1]", "windsong-medium")}>
              <span className='mr-[25px]'>Faq</span>
            </h1>
            <p className="mb-8 leading-relaxed text-gray-700 text-sm">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
              tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
              veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
              commodo consequat adipiscing elit.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="bg-[#f8f8f8] py-10 lg:py-15 text-sm">
        <div className="container mx-auto px-4">
          
          {/* Small Screen Layout */}
          <div className="lg:hidden mb-8">
            <p className="font-semibold mb-4 uppercase tracking-wider text-gray-500">Categories</p>
            <div className="flex overflow-x-auto pb-4 gap-3 no-scrollbar">
              {FAQCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategoryId(category.id)}
                  className={cn(
                    "whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-all border",
                    activeCategoryId === category.id 
                      ? "bg-red-600 border-red-600 text-white shadow-md" 
                      : "bg-white border-gray-200 text-gray-600 hover:bg-gray-100"
                  )}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16 items-start">
            
            {/* Desktop Layout */}
            <div className="hidden lg:block lg:col-span-1">
              <p className="font-semibold uppercase tracking-widest text-sm text-gray-400 mb-5">Categories</p>
              <ul className="space-y-4 text-gray-600">
                {FAQCategories.map((category) => (
                  <li
                    key={category.id}
                    onClick={() => setActiveCategoryId(category.id)}
                    className={cn(
                      "cursor-pointer transition-all duration-300 border-l-3 py-1",
                      activeCategoryId === category.id 
                        ? "text-red-600 border-red-600 font-semibold pl-6" 
                        : "border-transparent hover:border-gray-300 hover:pl-6"
                    )}
                  >
                    {category.name}
                  </li>
                ))}
              </ul>
            </div>

            {/* Accordion FAQ */}
            <div className="lg:col-span-2">
              {activeCategory ? (
                <div key={activeCategoryId} className="animate-in fade-in slide-in-from-bottom-2 duration-500"> 
                  <Accordion 
                    type="multiple" 
                    className="w-full"
                    defaultValue={activeCategory.faq[0] ? [activeCategory.faq[0].id] : []}
                  >
                    {activeCategory.faq.map((faq) => (
                      <AccordionItem
                        key={faq.id}
                        value={faq.id}
                        className="border-none bg-white rounded-md shadow-lg overflow-hidden mb-6"
                      >
                        <AccordionTrigger
                          className={cn(
                            "p-4 px-6 text-left font-medium transition-all duration-300 hover:no-underline",
                            "hover:bg-gray-100",
                            "data-[state=open]:bg-red-600 data-[state=open]:text-white",
                            "[&_svg]:data-[state=open]:text-white"
                          )}
                        >
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="px-6 py-6 leading-relaxed text-black bg-white">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <div className="h-16 w-full bg-gray-200 animate-pulse rounded-lg" />
                  <div className="h-16 w-full bg-gray-200 animate-pulse rounded-lg" />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
        
      <Footer />
    </div>
  );
}