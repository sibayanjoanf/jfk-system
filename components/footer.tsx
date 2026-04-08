"use client";

import Link from "next/link";
import { Mail, Phone, MapPin, UserRound } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const [info, setInfo] = useState({
    company_name: "JFK Tile and Stone Builders",
    address: "Laoag City, Ilocos Norte",
    phone: "0960 288 7539",
    telephone: "",
    company_email: "jesusforeverking2009@gmail.com",
  });

  useEffect(() => {
    const fetchInfo = () => {
      fetch("/api/company")
        .then((res) => res.json())
        .then((data) => {
          if (data) {
            setInfo({
              company_name: data.company_name || "JFK Tile and Stone Builders",
              address: data.address || "Laoag City, Ilocos Norte",
              phone: data.phone || "0960 288 7539",
              telephone: data.telephone || "",
              company_email:
                data.company_email || "jesusforeverking2009@gmail.com",
            });
          }
        });
    };

    fetchInfo();
    const interval = setInterval(fetchInfo, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="bg-[#f8f8f8]">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="text-lg text-gray-800 font-semibold">
                {info.company_name}
              </span>
            </div>
            <p className="text-sm text-gray-600">
              Your trusted partner for quality tiles, stones, and construction
              materials in Laoag City.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-medium uppercase text-red-600">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/about"
                  className="text-gray-600 hover:text-red-600"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-600 hover:text-red-600">
                  FAQs
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-600 hover:text-red-600"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/track-order"
                  className="text-gray-600 hover:text-red-600"
                >
                  Track Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Products */}
          <div>
            <h3 className="mb-4 text-sm font-medium uppercase text-red-600">
              Products
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/collection/tiles"
                  className="text-gray-600 hover:text-red-600"
                >
                  Tiles
                </Link>
              </li>
              <li>
                <Link
                  href="/collection/stones"
                  className="text-gray-600 hover:text-red-600"
                >
                  Stones
                </Link>
              </li>
              <li>
                <Link
                  href="/collection/fixtures"
                  className="text-gray-600 hover:text-red-600"
                >
                  Fixtures
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="mb-4 text-sm font-medium uppercase text-red-600">
              Contact Us
            </h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 shrink-0" />
                <span>{info.address}</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 shrink-0" />
                <span>{info.phone}</span>
              </li>
              {info.telephone && (
                <li className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 shrink-0" />
                  <span>{info.telephone}</span>
                </li>
              )}
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 shrink-0" />
                <span>{info.company_email}</span>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-between space-y-4 text-sm text-gray-600 md:flex-row md:space-y-0">
          <p>
            © {currentYear} {info.company_name}. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <Link
              href="/terms-and-conditions"
              className="hover:text-red-600 underline"
            >
              Terms & Conditions
            </Link>
            <Link
              href="/privacy-policy"
              className="hover:text-red-600 underline"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
