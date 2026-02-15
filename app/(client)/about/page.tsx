"use client";

import Image from 'next/image';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { cn } from '@/lib/utils';

export default function AboutPage() {
  return (
    <div className="flex min-h-screen min-w-20 flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gray-50 py-15 md:py-30 lg:py-30 text-sm">
        <div className="absolute inset-0 opacity-100">
          <Image
            src="/images/JFK_homePage_bg.png"
            alt="Background"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="container relative mx-auto px-4">
          <div className="max-w-[100vh]">
            <h1 className={cn(
              "mb-6 text-5xl md:text-7xl text-gray-900 leading-[1.1]", 
              "windsong-medium"
            )}>
              <span className='mr-[25px]'>About Us</span>
            </h1>
            <p className="mb-8 leading-relaxed text-gray-700">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
              tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
              veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
              commodo consequat adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
              tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
              veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
              commodo consequat adipiscing elit.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-15 text-sm">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="relative h-[200px] md:h-[400px] overflow-hidden rounded-lg lg:h-auto">
              <Image
                src="/images/featured-photo-3.png"
                alt="Image"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col justify-center">
              <span className='mb-4 font-semibold tracking-widest text-red-600'>ABOUT US</span>
              <h2 className="mb-4 text-3xl font-bold text-gray-900">
                What is JFK?
              </h2>
              <p className="mb-6 leading-relaxed text-gray-600">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
                tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                commodo consequat. 
              </p>
              <p className="mb-6 leading-relaxed text-gray-600">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
                tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                commodo consequat. 
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white pb-15 text-sm">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="flex flex-col justify-center order-2 lg:order-1">
              <span className='mb-4 font-semibold tracking-widest text-red-600'>ABOUT US</span>
              <h2 className="mb-4 text-3xl font-bold text-gray-900">
                How Did JFK Start?
              </h2>
              <p className="mb-6 leading-relaxed text-gray-600">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
                tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                commodo consequat.
              </p>
              <p className="mb-6 leading-relaxed text-gray-600">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
                tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                commodo consequat. 
              </p>
            </div>
            <div className="relative h-[200px] md:h-[400px] overflow-hidden rounded-lg lg:h-auto order-1 lg:order-2">
              <Image
                src="/images/featured-photo-2.png"
                alt="Image"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white pb-15 text-sm">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="relative h-[200px] md:h-[400px] overflow-hidden rounded-lg lg:h-auto">
              <Image
                src="/images/featured-photo-3.png"
                alt="Image"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col justify-center">
              <span className='mb-4 font-semibold tracking-widest text-red-600'>ABOUT US</span>
              <h2 className="mb-4 text-3xl font-bold text-gray-900">
                What Sets JFK Apart?
              </h2>
              <p className="mb-6 leading-relaxed text-gray-600">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
                tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                commodo consequat.
              </p>
              <p className="mb-6 leading-relaxed text-gray-600">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
                tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                commodo consequat.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}