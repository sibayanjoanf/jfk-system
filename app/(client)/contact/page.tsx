"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useEffect, useState } from "react";
import { InfoBranch } from "@/lib/types";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";
import { Reveal } from "@/components/reveal";
import { Loader2, MapPin, Phone } from "lucide-react";
import { ContactInput } from "@/components/admin/ContactInput";

export default function ContactPage() {
  const [infoCategories, setInfoCategories] = useState<InfoBranch[]>([]);
  const [isSent, setIsSent] = useState(false);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    fetch("/api/info_branch")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setInfoCategories(data.data);
        }
      })
      .catch((err) => console.error("Failed to fetch branches:", err));
  }, []);

  const inputStyles =
    "border-gray-200 focus-visible:border-red-600 bg-gray-50/50 h-12 text-sm";

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [messageBox, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const formatName = (value: string) => {
    return value
      .replace(/[^a-zA-Z\s-']/g, "")
      .replace(/(^|[\s-])([a-z])/g, (_, sep, char) => sep + char.toUpperCase());
  };

  const formatEmail = (value: string) => value.replace(/\s/g, "");

  const isValidEmailFormat = (val: string) => {
    if (!val) return true;
    if (val.length > 100) return false;

    if (!/^[a-zA-Z0-9]/.test(val)) return false;
    if (/\.\./.test(val)) return false;

    const parts = val.split("@");
    if (parts.length !== 2) return false;

    const beforeAt = parts[0];
    const afterAt = parts[1];

    if (!beforeAt || !afterAt) return false;

    if (!/^[a-zA-Z0-9_.+-]+$/.test(beforeAt)) return false;
    if (beforeAt.endsWith(".")) return false;

    if (!/^[a-zA-Z0-9.-]+$/.test(afterAt)) return false;
    if (afterAt.startsWith(".") || afterAt.endsWith(".")) return false;

    return true;
  };

  const resetFields = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setMessage("");
    setErrors({});
  };

  const sendMessage = async () => {
    const newErrors: Record<string, string> = {};

    const nameEdgeRegex = /^[a-zA-Z](.*[a-zA-Z])?$/;

    if (!firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (!nameEdgeRegex.test(firstName.trim())) {
      newErrors.firstName = "First name must start and end with a letter";
    }

    if (!lastName.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (!nameEdgeRegex.test(lastName.trim())) {
      newErrors.lastName = "Last name must start and end with a letter";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!isValidEmailFormat(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!phone || phone.length < 5) {
      newErrors.phone = "Enter a valid phone number";
    }
    if (!messageBox.trim()) newErrors.messageBox = "Message required";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsSending(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/submit-contact`,
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
            message: messageBox,
          }),
        },
      );

      if (!response.ok) {
        console.error("Failed to submit message");
        setIsSending(false);
        return;
      }

      resetFields();
      setIsSent(true);
      setTimeout(() => setIsSent(false), 5000);
    } catch (err) {
      console.error("Error submitting message:", err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex min-h-screen min-w-20 flex-col">
      <Navbar />

      <Reveal>
        <section className="py-10 lg:py-15 text-sm">
          <div className="container mx-auto px-4">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
              {/* Branch Info */}
              <div className="flex flex-col gap-4 order-2 lg:order-1">
                {infoCategories.length > 0 ? (
                  infoCategories.map((info) => (
                    <div key={info.id} className="flex flex-col gap-2 mb-5">
                      <h1 className="font-semibold text-2xl">{info.name}</h1>
                      <div className="flex gap-2 justify-start items-center">
                        <MapPin size={15} className="text-gray-400" />
                        <p className="text-gray-600">{info.address}</p>
                      </div>
                      <div className="flex gap-2 justify-start items-center">
                        <Phone size={15} className="text-red-600" />
                        <p className="text-red-600 font-medium">{info.phone}</p>
                      </div>
                      <div className="flex gap-2 justify-start items-center">
                        <Phone size={15} className="text-red-600" />
                        <p className="text-red-600 font-medium">
                          {info.telephone}
                        </p>
                      </div>

                      {/* GMaps Embed */}
                      <div className="mt-4 w-full rounded-lg overflow-hidden aspect-video">
                        <iframe
                          title={`Map for ${info.name}`}
                          width="100%"
                          height="100%"
                          style={{ border: 0 }}
                          loading="lazy"
                          allowFullScreen
                          src={info.embed_url}
                        />
                      </div>
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
                <h1 className="font-semibold text-2xl text-gray-900">
                  Contact Us
                </h1>

                <div className="flex flex-col gap-4">
                  <FieldGroup className="grid grid-cols-2 gap-4">
                    <Field>
                      <Input
                        id="first-name"
                        autoComplete="given-name"
                        placeholder="First Name"
                        maxLength={50}
                        className={cn(
                          inputStyles,
                          errors.firstName && "border-red-500",
                        )}
                        value={firstName}
                        onChange={(e) => {
                          setFirstName(formatName(e.target.value));
                          if (e.target.value.trim() && errors.firstName) {
                            setErrors((prev) => ({ ...prev, firstName: "" }));
                          }
                        }}
                        required
                      />
                      {errors.firstName && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.firstName}
                        </p>
                      )}
                    </Field>
                    <Field>
                      <Input
                        id="last-name"
                        autoComplete="family-name"
                        placeholder="Last Name"
                        maxLength={50}
                        className={cn(
                          inputStyles,
                          errors.lastName && "border-red-500",
                        )}
                        value={lastName}
                        onChange={(e) => {
                          setLastName(formatName(e.target.value));
                          if (e.target.value.trim() && errors.lastName) {
                            setErrors((prev) => ({ ...prev, lastName: "" }));
                          }
                        }}
                        required
                      />
                      {errors.lastName && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.lastName}
                        </p>
                      )}
                    </Field>
                  </FieldGroup>

                  <Field>
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="Email Address"
                      maxLength={100}
                      className={cn(
                        inputStyles,
                        errors.email && "border-red-500",
                      )}
                      value={email}
                      onChange={(e) => {
                        setEmail(formatEmail(e.target.value));
                        if (e.target.value.trim() && errors.email) {
                          setErrors((prev) => ({ ...prev, email: "" }));
                        }
                      }}
                      onKeyDown={(e) => e.key === " " && e.preventDefault()}
                      required
                    />
                    {errors.email && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.email}
                      </p>
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
                    className="h-12 border-2"
                  />

                  <Field>
                    <Textarea
                      id="message"
                      placeholder="Message"
                      maxLength={500}
                      value={messageBox}
                      onChange={(e) => {
                        setMessage(e.target.value);
                        if (e.target.value.trim() && errors.messageBox) {
                          setErrors((prev) => ({ ...prev, messageBox: "" }));
                        }
                      }}
                      className={cn(
                        "h-[180px] border-2 selection:bg-gray-200 focus-visible:ring-transparent focus-visible:border-red-600 bg-gray-50/50 p-4 text-sm placeholder:text-gray-400",
                        "resize-none overflow-y-auto transition-colors",
                        errors.messageBox && "border-red-500",
                      )}
                    />
                    {errors.messageBox && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.messageBox}
                      </p>
                    )}
                  </Field>

                  <Button
                    onClick={sendMessage}
                    disabled={isSending}
                    className="cursor-pointer w-full h-12 bg-red-600 hover:bg-red-700 text-white font-semibold text-md transition-colors mt-2 disabled:opacity-80 disabled:cursor-not-allowed"
                  >
                    {isSending ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 size={16} className="animate-spin" />
                        Sending...
                      </span>
                    ) : (
                      "Send Message"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      <Footer />
    </div>
  );
}
