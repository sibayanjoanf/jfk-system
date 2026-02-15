"use client";

import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { SubCategories } from '@/lib/types';

export default function CollectionPage() {
  const [subCategories, setSubCategories] = useState<SubCategories[]>([]);

  useEffect(() => {
    fetch('/api/sub_categories')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSubCategories(data.data);
        }
      })
      .catch((err) => console.error("Failed to fetch branches:", err));
  }, []);

  return (
    <div className="flex min-h-screen min-w-20 flex-col">
      <Navbar />

      <section className="relative py-15 md:py-20 lg:py-20 text-sm">
        <div className="absolute inset-0 opacity-100"></div>
        <div className="container relative mx-auto px-4 flex justify-center">
          <div>
            <h1 className={cn(
              "mb-10 md:mb-20 text-5xl md:text-7xl text-gray-900 text-center", 
              "windsong-medium"
            )}>All Collection</h1>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {subCategories.length > 0 ? (
                subCategories
                  .slice() 
                  .sort((a, b) => String(a.id).localeCompare(String(b.id)))
                  .map((subCat) => (
                    <div key={subCat.id} className="group relative flex flex-col items-center cursor-pointer">
                      <div className="relative overflow-hidden bg-gray-200 border rounded-xl w-40 sm:w-60 aspect-square flex items-center justify-center">
                        <span className="absolute text-white text-shadow-lg font-semibold text-md md:hidden text-center leading-tight">{subCat.name}</span>
                        {subCat.image_url ? (
                          <img 
                            src={subCat.image_url} 
                            alt={subCat.name} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        ) : (
                          <span className="text-gray-500 text-xs"></span>  
                        )}
                        <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center">
                          <span className="p-10 text-white font-semibold text-md text-shadow-lg md:text-lg text-center leading-tight">{subCat.name}</span>
                        </div>
                      </div>
                    </div>
                  ))
              ) : (
                <p className="col-span-full text-center text-gray-500">No subcategories available.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}