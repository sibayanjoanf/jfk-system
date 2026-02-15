"use client";

import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { useEffect, useState } from 'react';
import { InfoBranch } from '@/lib/types';
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Spinner } from "@/components/ui/spinner"

export default function ContactPage() {
  const [infoCategories, setInfoCategories] = useState<InfoBranch[]>([]);
  const [isSent, setIsSent] = useState(false);

  useEffect(() => {
    fetch('/api/info_branch')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setInfoCategories(data.data);
        }
      })
      .catch((err) => console.error("Failed to fetch branches:", err));
  }, []);

  const inputStyles = "border-gray-200 focus-visible:border-red-600 bg-gray-50/50 h-12 text-sm";
  const sendMessage = () => {
    setIsSent(true);
    setTimeout(() => setIsSent(false), 5000);
  };

  return (
    <div className="flex min-h-screen min-w-20 flex-col">
      <Navbar />

      <section className="py-10 lg:py-15 text-sm">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            
            {/* Branch Info */}
            <div className="flex flex-col gap-4 order-2 lg:order-1">
              {infoCategories.length > 0 ? (
                infoCategories.map((info) => (
                  <div key={info.id} className="text-black flex flex-col gap-2 mb-5">
                    <h1 className="font-semibold text-2xl">{info.name}</h1>
                    <p className="text-gray-600">{info.address}</p>
                    <p className="text-red-600 font-medium">{info.phone}</p>
                    <p className="text-red-600 font-medium">{info.telephone}</p>
                  </div>
                ))
              ) : (
                <div className="flex gap-2">
                  <Spinner />
                  <span className="text-gray-400">Loading branches...</span>
                </div>
              )}
            </div>

            {/* Contact Form */}
            <div className="flex flex-col gap-6 order-1 lg:order-2">
              {isSent && (
                <div className="bg-[#9797971A] text-center text-gray-500 font-semibold p-4 rounded-md animate-in fade-in slide-in-from-top-100 slide duration-300">
                  <span>Your message has been sent!</span>
                </div>
              )}
              <h1 className="font-semibold text-2xl text-gray-900">Contact Us</h1>
              
              <div className="flex flex-col gap-4">
                <FieldGroup className="grid grid-cols-2 gap-4">
                  <Field>
                    <Input id="first-name" placeholder="First Name" className={inputStyles} required />
                  </Field>
                  <Field>
                    <Input id="last-name" placeholder="Last Name" className={inputStyles} required />
                  </Field>
                </FieldGroup>

                <Field>
                  <Input id="email" type="email" placeholder="Email Address" className={inputStyles} />
                </Field>
                
                <Field>
                  <Input id="phone" type="tel" placeholder="Phone" className={inputStyles} />
                </Field>

                <Field>
                  <Textarea
                    id="message"
                    placeholder="Message"
                    className={cn(
                      "min-h-[180px] border shadow-xs selection:bg-gray-200 focus-visible:ring-ring/30 focus-visible:border-none bg-gray-50/50 p-4 text-sm placeholder:text-gray-400",
                      "resize-none overflow-y-auto transition-colors"
                    )}
                  />
                </Field>

                <Button
                  onClick={sendMessage} 
                  className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-semibold text-md transition-colors mt-2"
                >
                  Send Message
                </Button>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}