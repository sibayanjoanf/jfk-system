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
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [messageBox, setMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const formatName = (value: string) => {
    return value
      .replace(/[^a-zA-Z\s-]/g, '') 
      .toLowerCase()
      .replace(/(^|[\s-])([a-z])/g, (_, sep, char) => sep + char.toUpperCase()); 
  };

  const formatEmail = (value: string) =>
    value.replace(/\s/g, ''); 
    
  const isValidEmail = (value: string) => {
    if (value.includes(' ')) return false;  
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value
      .replace(/^\+63/, '')
      .replace(/\D/g, '')
      .slice(0, 10);
    setPhone('+63' + digits);
  };

  const handlePhoneFocus = () => {
    if (!phone) setPhone('+63'); 
  };

  const handlePhoneBlur = () => {
    if (phone === '+63') setPhone('');
  };
  
  const sendMessage = async () => {
    const newErrors: Record<string, string> = {};

    if (!firstName.trim()) newErrors.firstName = 'First name is required.';
    if (!lastName.trim()) newErrors.lastName = 'Last name is required.';
    if (!email.trim()) newErrors.email = 'Email is required.';
    else if (!isValidEmail(email)) newErrors.email = 'Enter a valid email address.';
    if (phone.length < 13) newErrors.phone = 'Enter a valid phone number.';
    if (!messageBox.trim()) newErrors.messageBox = 'Message required.';
    
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const response = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/submit-contact`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        phone,
        message: messageBox
      }),
    }
    
  );
  setIsSent(true);

  if (!response.ok) {
    console.error('Failed to submit message');
    setTimeout(() => setIsSent(false), 5000);
    return;
  }
    
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
            <div className="flex flex-col gap-6 order-1 lg:order-2 mb-5">
              {isSent && (
                <div className="bg-[#9797971A] text-center text-gray-500 font-semibold p-4 rounded-md animate-in fade-in slide-in-from-top-100 slide duration-300">
                  <span>Your message has been sent!</span>
                </div>
              )}
              <h1 className="font-semibold text-2xl text-gray-900">Contact Us</h1>
              
              <div className="flex flex-col gap-4">
                <FieldGroup className="grid grid-cols-2 gap-4">
                  <Field>
                    <Input id="first-name" placeholder="First Name" className={cn(inputStyles, errors.firstName && 'border-red-500')} 
                    value={firstName}
                    onChange={(e) => setFirstName(formatName(e.target.value))} 
                    required />
                    {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>}
                  </Field>
                  <Field>
                    <Input id="last-name" placeholder="Last Name" className={cn(inputStyles, errors.lastName && 'border-red-500')}
                    value={lastName}
                    onChange={(e) => setLastName(formatName(e.target.value))} 
                    required />
                    {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>}
                  </Field>
                </FieldGroup>

                <Field>
                  <Input id="email" type="email" placeholder="Email Address" className={cn(inputStyles, errors.email && 'border-red-500')} 
                  value={email}
                  onChange={(e) => setEmail(formatEmail(e.target.value))} 
                  onKeyDown={(e) => e.key === ' ' && e.preventDefault()}
                  required />
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                </Field>
                
                <Field>
                  <Input id="phone" type="tel" placeholder="Phone" className={cn(inputStyles, errors.phone && 'border-red-500')}
                  value={phone} 
                  onChange={handlePhoneChange}
                  onFocus={handlePhoneFocus}
                  onBlur={handlePhoneBlur}
                  required />
                  {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                </Field>

                <Field>
                  <Textarea id="message" placeholder="Message"
                    value={messageBox}
                    onChange={(e) => setMessage(e.target.value)}
                    className={cn(
                      "min-h-[180px] border shadow-xs selection:bg-gray-200 focus-visible:ring-transparent focus-visible:border-red-600 bg-gray-50/50 p-4 text-sm placeholder:text-gray-400",
                      "resize-none overflow-y-auto transition-colors",
                      errors.messageBox && "border-red-500"
                    )}
                  />
                  {errors.messageBox && <p className="text-xs text-red-500 mt-1">{errors.messageBox}</p>}
                </Field>

                <Button
                  onClick={sendMessage} 
                  className="cursor-pointer w-full h-12 bg-red-600 hover:bg-red-700 text-white font-semibold text-md transition-colors mt-2"
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