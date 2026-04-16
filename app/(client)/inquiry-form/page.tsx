"use client";

import Link from "next/link";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ShoppingCart,
  Loader2,
} from "lucide-react";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/cart";
import Image from "next/image";
import { ContactInput } from "@/components/admin/ContactInput";

export default function InquiryFormPage() {
  const [logo, setLogo] = useState(
    "https://zdahzxsipjtwxbraslvb.supabase.co/storage/v1/object/public/JFK%20Assets/logo/jfk_logo.png",
  );
  const [announcements, setAnnouncements] = useState<
    { id: string; text: string }[]
  >([]);
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [deliveryPref, setDeliveryPref] = useState("");
  const [paymentPref, setPaymentPref] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { items, clearCart } = useCart();
  const totalAmount = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  useEffect(() => {
    fetch("/api/company")
      .then((res) => res.json())
      .then((data) => {
        if (data.company_logo) setLogo(data.company_logo);
      });

    fetch("/api/announcements")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setAnnouncements(data.data);
      });
  }, []);

  const inputStyles =
    "border-gray-200 bg-transparent h-12 text-sm focus-visible:ring-1 focus-visible:ring-red-500 focus-visible:border-red-500";

  const formatName = (value: string) => {
    return value
      .replace(/[^a-zA-Z\s-]/g, "")
      .toLowerCase()
      .replace(/(^|[\s-])([a-z])/g, (_, sep, char) => sep + char.toUpperCase());
  };

  const formatEmail = (value: string) => value.replace(/\s/g, "");

  const isValidEmail = (value: string) => {
    if (value.includes(" ")) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const handleSubmit = async () => {
    const newErrors: Record<string, string> = {};
    if (!firstName.trim()) newErrors.firstName = "First name is required.";
    if (!lastName.trim()) newErrors.lastName = "Last name is required.";
    if (!email.trim()) newErrors.email = "Email is required.";
    else if (!isValidEmail(email))
      newErrors.email = "Enter a valid email address.";
    if (!phone || phone.length < 5) {
      newErrors.phone = "Enter a valid phone number.";
    }
    if (!deliveryPref)
      newErrors.deliveryPref = "Please select a delivery preference.";
    if (!paymentPref)
      newErrors.paymentPref = "Please select a payment preference.";
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/submit-inquiry`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
            },
            body: JSON.stringify({
              firstName,
              lastName,
              email,
              phone,
              deliveryPreference: deliveryPref,
              paymentPreference: paymentPref,
              message,
              items,
              totalAmount,
            }),
          },
        );

        if (!res.ok) throw new Error("Submission failed");

        const data = await res.json();
        const orderNumber = data.order_number;

        clearCart();
        window.location.href = `/order-qr?order_id=${orderNumber}`;
      } catch (error) {
        console.error(error);
        setIsSubmitting(false);
      }
    }
  };

  const AnnouncementBar = ({
    announcements,
  }: {
    announcements: { id: string; text: string }[];
  }) => {
    const [current, setCurrent] = useState(0);
    const [visible, setVisible] = useState(true);
    const [hovered, setHovered] = useState(false);

    const switchTo = (index: number) => {
      setVisible(false);
      setTimeout(() => {
        setCurrent(index);
        setVisible(true);
      }, 300);
    };

    const prev = () =>
      switchTo((current - 1 + announcements.length) % announcements.length);
    const next = () => switchTo((current + 1) % announcements.length);

    useEffect(() => {
      if (announcements.length === 0 || hovered) return;
      const interval = setInterval(() => {
        setVisible(false);
        setTimeout(() => {
          setCurrent((prev) => (prev + 1) % announcements.length);
          setVisible(true);
        }, 500);
      }, 10000);
      return () => clearInterval(interval);
    }, [announcements, hovered]);

    if (announcements.length === 0) {
      return (
        <p className="text-center text-[10px] font-medium uppercase tracking-[0.2em]">
          Welcome to JFK Tile and Stone Builders
        </p>
      );
    }

    return (
      <div
        className="relative flex items-center justify-center"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <button
          onClick={prev}
          className={`absolute left-4 transition-opacity duration-200 hover:text-white/70 ${hovered ? "opacity-100" : "opacity-0"}`}
        >
          <ChevronLeft size={14} />
        </button>
        <p
          className="text-center text-[10px] font-medium uppercase tracking-[0.2em] transition-opacity duration-300 px-10"
          style={{ opacity: visible ? 1 : 0 }}
        >
          {announcements[current]?.text}
        </p>
        <button
          onClick={next}
          className={`absolute right-4 transition-opacity duration-200 hover:text-white/70 ${hovered ? "opacity-100" : "opacity-0"}`}
        >
          <ChevronRight size={14} />
        </button>
      </div>
    );
  };

  return (
    <div className="bg-white">
      <header className="fixed top-0 z-50 w-full">
        <div className="bg-red-600 text-white py-2 overflow-hidden">
          <AnnouncementBar announcements={announcements} />
        </div>
        <nav className="border-b border-gray-100 bg-white/80 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="flex h-16 items-center justify-between">
              <Link href="/" className="flex items-center space-x-2">
                <img
                  src={logo}
                  alt="JFK Logo"
                  className="h-9 w-auto object-contain"
                />
                <div className="flex flex-col leading-tight">
                  <span className="text-xs font-semibold text-gray-900">
                    Tile and
                  </span>
                  <span className="text-xs font-semibold text-gray-900">
                    Stone Builders
                  </span>
                </div>
              </Link>
              <Link href="/cart">
                <ShoppingCart className="h-4 w-4 text-gray-600 hover:text-red-600 transition-colors" />
              </Link>
            </div>
          </div>
        </nav>
      </header>

      <main className="pt-10">
        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-start pb-10">
          <div className="flex flex-col gap-5 order-2 lg:order-1 lg:sticky lg:top-32 self-start">
            <div>
              <h1 className="font-semibold text-xl md:text-2xl text-gray-900">
                Inquiry Form
              </h1>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field>
                <Input
                  id="firstName"
                  placeholder="First Name"
                  className={cn(
                    inputStyles,
                    errors.firstName && "border-red-400",
                  )}
                  value={firstName}
                  onChange={(e) => setFirstName(formatName(e.target.value))}
                  disabled={isSubmitting}
                />
                {errors.firstName && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.firstName}
                  </p>
                )}
              </Field>
              <Field>
                <Input
                  id="lastName"
                  placeholder="Last Name"
                  className={cn(
                    inputStyles,
                    errors.lastName && "border-red-400",
                  )}
                  value={lastName}
                  onChange={(e) => setLastName(formatName(e.target.value))}
                  disabled={isSubmitting}
                />
                {errors.lastName && (
                  <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>
                )}
              </Field>
            </div>

            <Field>
              <Input
                id="email"
                type="email"
                placeholder="Email Address"
                className={cn(inputStyles, errors.email && "border-red-400")}
                value={email}
                onChange={(e) => setEmail(formatEmail(e.target.value))}
                onKeyDown={(e) => e.key === " " && e.preventDefault()}
                disabled={isSubmitting}
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">{errors.email}</p>
              )}
            </Field>

            <ContactInput
              label=""
              value={phone}
              error={errors.phone}
              onChange={(value) => {
                setPhone(value);
                if (value && errors.phone) {
                  setErrors((prev) => ({ ...prev, phone: "" }));
                }
              }}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Select
                  disabled={isSubmitting}
                  onValueChange={(val) => {
                    setDeliveryPref(val);
                    setErrors((p) => ({ ...p, deliveryPref: "" }));
                  }}
                >
                  <SelectTrigger
                    className={cn(
                      "w-full py-6 bg-transparent text-sm border-gray-200 border-2 text-gray-900",
                      errors.deliveryPref && "border-red-400 border-2",
                    )}
                  >
                    <SelectValue placeholder="Delivery Preference" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="delivery">Delivery</SelectItem>
                      <SelectItem value="pickup">Pickup</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errors.deliveryPref && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.deliveryPref}
                  </p>
                )}
              </div>
              <div>
                <Select
                  disabled={isSubmitting}
                  onValueChange={(val) => {
                    setPaymentPref(val);
                    setErrors((p) => ({ ...p, paymentPref: "" }));
                  }}
                >
                  <SelectTrigger
                    className={cn(
                      "w-full py-6 bg-transparent text-sm border-gray-200 border-2",
                      errors.paymentPref && "border-red-400 border-2",
                    )}
                  >
                    <SelectValue placeholder="Payment Preference" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="online">Online Payment</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errors.paymentPref && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.paymentPref}
                  </p>
                )}
              </div>
            </div>

            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Message / Notes (optional)"
              disabled={isSubmitting}
              className="min-h-[120px] md:min-h-[160px] border-gray-200 bg-transparent p-4 text-sm placeholder:text-gray-400 resize-none"
            />

            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm transition-colors cursor-pointer disabled:bg-red-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </div>
              ) : (
                "Submit Inquiry"
              )}
            </Button>

            <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-100 text-xs text-gray-400 justify-center lg:justify-start">
              <Link
                href="/terms-and-conditions"
                className="hover:text-red-600 transition-colors underline"
              >
                Terms & Conditions
              </Link>
              <Link
                href="/privacy-policy"
                className="hover:text-red-600 transition-colors underline"
              >
                Privacy Policy
              </Link>
              <Link
                href="/contact"
                className="hover:text-red-600 transition-colors underline"
              >
                Contact
              </Link>
            </div>
          </div>

          <div className="flex flex-col order-1 lg:order-2 lg:sticky lg:top-32 self-start">
            <button
              onClick={() => setIsOrderOpen(!isOrderOpen)}
              className="flex lg:hidden items-center justify-between w-full py-2 border-b border-gray-100"
            >
              <div className="flex items-center gap-2">
                <h2 className="font-semibold text-xl text-gray-900">
                  Your Order
                </h2>
                <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-500">
                  {items.length} {items.length === 1 ? "item" : "items"}
                </span>
              </div>
              {isOrderOpen ? (
                <ChevronUp size={15} className="text-gray-400" />
              ) : (
                <ChevronDown size={15} className="text-gray-400" />
              )}
            </button>

            <div className="hidden lg:block mb-4">
              <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">
                Your Order
              </p>
              <h2 className="font-semibold text-xl md:text-2xl text-gray-900">
                {items.length} {items.length === 1 ? "item" : "items"}
              </h2>
            </div>

            <div
              className={cn(
                "flex-col lg:flex",
                isOrderOpen ? "flex" : "hidden",
              )}
            >
              <div className="divide-y divide-gray-100">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between py-4 gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative h-14 w-14 md:h-16 md:w-16 shrink-0 overflow-hidden rounded-lg border border-gray-100">
                        <Image
                          src={item.image || "/placeholder.png"}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 line-clamp-1">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {item.sku}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-red-600 whitespace-nowrap">
                      ₱{" "}
                      {(item.price * item.quantity).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center font-semibold text-gray-900 pt-5 pb-2 border-t border-gray-200">
                <p>Subtotal</p>
                <p>
                  ₱{" "}
                  {totalAmount.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </p>
              </div>
              <p className="text-xs text-gray-400 italic mt-3">
                * Final pricing may vary depending on delivery, installation,
                and other charges.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
