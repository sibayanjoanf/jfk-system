"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Menu,
  Minus,
  Package,
  Plus,
  Search,
  SearchIcon,
  ShoppingCart,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CategoryWithSub } from "@/lib/types";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Spinner } from "./ui/spinner";
import Image from "next/image";
import { useCart } from "@/hooks/cart";
import { LucideIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type NavItem = {
  label: string;
  href?: string;
  icon?: LucideIcon;
  onClick?: () => void;
};

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<CategoryWithSub | null>(
    null,
  );
  const [isCollectionOpen, setIsCollectionOpen] = useState(false);
  const [categories, setCategories] = useState<CategoryWithSub[]>([]);

  const { updateQuantity } = useCart();
  const handleQuantityChange = (
    itemId: string,
    newQuantity: number,
    stockQty: number,
  ) => {
    if (newQuantity < 1) return;

    if (newQuantity > stockQty) {
      alert(`Only ${stockQty} units available in stock.`);
      return;
    }
    updateQuantity(itemId, newQuantity);
  };

  const [announcements, setAnnouncements] = useState<
    { id: string; text: string }[]
  >([]);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const order = ["Tiles", "Stones", "Fixtures"];
          const sortedCategories = data.data.sort(
            (a: CategoryWithSub, b: CategoryWithSub) => {
              const indexA = order.indexOf(a.name);
              const indexB = order.indexOf(b.name);
              const posA = indexA === -1 ? 99 : indexA;
              const posB = indexB === -1 ? 99 : indexB;
              return posA - posB;
            },
          );
          setCategories(sortedCategories);
        }
      });

    fetch("api/announcements")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setAnnouncements(data.data);
      });

    fetch("/api/company")
      .then((res) => res.json())
      .then((data) => {
        if (data.company_logo) setLogo(data.company_logo);
      });
  }, []);

  const [logo, setLogo] = useState(
    "https://zdahzxsipjtwxbraslvb.supabase.co/storage/v1/object/public/JFK%20Assets/logo/jfk_logo.png",
  );
  const { items, totalPrice, removeItem, clearCart } = useCart();
  const totalQty = items.reduce((acc, item) => acc + item.quantity, 0);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Us" },
    { label: "Collection", icon: ChevronDown },
    { href: "/faq", label: "FAQ" },
    { href: "/contact", label: "Contact" },
  ];

  const navLinksMobile: NavItem[] = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Us" },
    { href: "/collection", label: "All Collection" },
    ...categories.map((cat) => ({
      label: cat.name,
      icon: ChevronDown,
      onClick: () => {
        setActiveCategory(cat);
        setIsCategoryOpen(true);
      },
    })),
    { href: "/faq", label: "FAQ" },
    { href: "/contact", label: "Contact" },
  ];

  const navBtns = [
    { href: "/search", icon: Search, isCart: false, onClick: undefined },
    { href: "/track-order", icon: Package, isCart: false, onClick: undefined },
    {
      href: "/cart",
      icon: ShoppingCart,
      isCart: true,
      onClick: () => setIsCartOpen(true),
    },
  ];

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

        {/* Announcement text */}
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
    <header className="fixed top-0 z-50 w-full">
      {/* Top Red Marquee */}
      <div className="bg-red-600 text-white py-2 overflow-hidden">
        <AnnouncementBar announcements={announcements} />
      </div>

      {/* Main Navbar */}
      <nav
        className={cn(
          "w-full bg-[#f8f8f8] transition-all duration-300",
          isCollectionOpen
            ? "border-b border-gray-200"
            : "border-b border-transparent",
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
                className="h-9 w-auto object-contain"
              />
              <div className="flex flex-col gap-[-10] leading-tight">
                <span className="text-xs font-semibold text-gray-900">
                  Tile and{" "}
                </span>
                <span className="text-xs font-semibold text-gray-900">
                  Stone Builders
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link) => {
                const isCollection = link.label === "Collection";
                const isActive = link.href
                  ? pathname === link.href
                  : isCollection
                    ? pathname.startsWith("/collection")
                    : false;

                const content = (
                  <>
                    <span>{link.label}</span>
                    {link.icon && (
                      <link.icon
                        className={cn(
                          "h-4 w-4 transition-transform duration-300",
                          isCollectionOpen && isCollection && "rotate-180",
                        )}
                      />
                    )}
                  </>
                );

                const commonClasses = cn(
                  "flex items-center space-x-1 text-sm font-medium transition-colors",
                  isActive || (isCollection && isCollectionOpen)
                    ? "text-red-600"
                    : "text-black hover:text-red-600",
                );

                return (
                  <div
                    key={link.label}
                    onMouseEnter={() =>
                      isCollection
                        ? setIsCollectionOpen(true)
                        : setIsCollectionOpen(false)
                    }
                    className="relative h-16 flex items-center"
                  >
                    {link.href ? (
                      <Link href={link.href} className={commonClasses}>
                        {content}
                      </Link>
                    ) : (
                      <button
                        type="button"
                        className={cn(commonClasses, "cursor-default")}
                      >
                        {content}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Desktop Buttons */}
            <div className="hidden lg:flex md:space-x-4">
              <TooltipProvider delayDuration={200}>
                {navBtns.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  const commonClasses = cn(
                    "flex items-center space-x-1 text-sm font-normal transition-colors",
                    isActive ? "text-red-600" : "text-black hover:text-red-600",
                  );
                  const isCart = Icon === ShoppingCart;

                  const tooltipLabel = link.isCart
                    ? "Cart"
                    : link.href.includes("search")
                      ? "Search"
                      : "Track Order Status";

                  return (
                    <Tooltip key={link.href}>
                      <TooltipTrigger asChild>
                        {link.onClick ? (
                          <button
                            onClick={link.onClick}
                            className={cn(
                              commonClasses,
                              "bg-transparent border-none cursor-pointer relative",
                            )}
                          >
                            {Icon && <Icon className="h-4 w-4" />}
                            {isCart && totalQty > 0 && (
                              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                                {totalQty}
                              </span>
                            )}
                          </button>
                        ) : (
                          <Link href={link.href} className={commonClasses}>
                            {Icon && <Icon className="h-4 w-4" />}
                          </Link>
                        )}
                      </TooltipTrigger>
                      <TooltipContent
                        side="bottom"
                        sideOffset={10}
                        className="text-[10px] py-1 px-2 bg-red-600"
                      >
                        <p>{tooltipLabel}</p>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </TooltipProvider>
            </div>

            {/* Mobile Burger Menu */}
            <TooltipProvider delayDuration={200}>
              <div className="flex lg:hidden items-center space-x-2">
                {/* Cart Button Tooltip */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setIsCartOpen(true)}
                      className="relative p-2 mr-0"
                    >
                      <ShoppingCart size={18} className="hover:text-red-600" />
                      <span className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                        {totalQty}
                      </span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent
                    side="bottom"
                    className="text-[10px] py-1 px-2 bg-red-600"
                  >
                    <p>Cart</p>
                  </TooltipContent>
                </Tooltip>

                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <SheetTrigger asChild className="lg:hidden">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover:text-red-600 hover:bg-transparent"
                        >
                          <Menu size={18} className="hover:text-red-600" />
                          <span className="sr-only">Toggle Menu</span>
                        </Button>
                      </SheetTrigger>
                    </TooltipTrigger>
                    <TooltipContent
                      side="bottom"
                      className="text-[10px] py-1 px-2 bg-red-600"
                    >
                      <p>Menu</p>
                    </TooltipContent>
                  </Tooltip>
                  <SheetContent
                    side="left"
                    className="w-full sm:w-100 flex flex-col h-full p-0"
                  >
                    {/* Header Section */}
                    <div className="p-auto pb-2">
                      <SheetHeader>
                        <SheetTitle className="flex items-center space-x-2">
                          <img
                            src={logo}
                            alt="JFK Logo"
                            className="h-9 w-auto object-contain"
                          />
                          <div className="flex flex-col leading-tight">
                            <span className="text-xs font-semibold text-gray-900">
                              Tile and{" "}
                            </span>
                            <span className="text-xs font-semibold text-gray-900">
                              Stone Builders
                            </span>
                          </div>
                        </SheetTitle>
                        <SheetDescription className="sr-only">
                          Categories
                        </SheetDescription>
                      </SheetHeader>
                    </div>

                    {/* Navigations */}
                    <div className="flex-1 overflow-y-auto mt-4 flex flex-col space-y-6 px-6">
                      {navLinksMobile.map((link) => {
                        const isActive = link.href
                          ? pathname === link.href
                          : false;

                        const commonClasses = cn(
                          "flex items-center space-x-3 text-md font-normal transition-colors",
                          isActive
                            ? "text-red-600"
                            : "text-gray-900 hover:text-red-600",
                        );

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
                              link.onClick?.();
                              setIsOpen(false);
                            }}
                          >
                            <span>{link.label}</span>
                            {link.icon && <link.icon className="h-4 w-4" />}
                          </div>
                        );
                      })}
                    </div>

                    {/* Button Section (Search & Track) */}
                    <div className="mt-auto p-6">
                      <div className="flex justify-between gap-4">
                        <Link
                          href="/search"
                          className="flex-1"
                          onClick={() => setIsOpen(false)}
                        >
                          <div className="bg-gray-100 rounded-lg py-5 flex flex-col items-center justify-center text-gray-800 font-medium transition-colors hover:bg-gray-200">
                            <SearchIcon className="mb-1" />
                            <span className="text-sm">Search</span>
                          </div>
                        </Link>
                        <Link
                          href="/track-order"
                          className="flex-1"
                          onClick={() => setIsOpen(false)}
                        >
                          <div className="bg-gray-100 rounded-lg py-5 flex flex-col items-center justify-center text-gray-800 font-medium transition-colors hover:bg-gray-200">
                            <Package className="mb-1" />
                            <span className="text-sm">Track Order</span>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </TooltipProvider>

            {/* Mobile Category Menu */}
            <Sheet open={isCategoryOpen} onOpenChange={setIsCategoryOpen}>
              <SheetContent
                side="left"
                className="w-full sm:w-100 flex flex-col h-full p-0"
              >
                <SheetHeader>
                  <SheetTitle className="sr-only">Category Menu</SheetTitle>
                  <SheetDescription className="sr-only">
                    Sub-Categories
                  </SheetDescription>
                  <div className="py-5">
                    <button
                      onClick={() => {
                        setIsCategoryOpen(false);
                        setIsOpen(true);
                      }}
                      className="flex items-center text-sm font-medium text-gray-600 hover:text-red-600 transition-colors"
                    >
                      <ChevronDown className="rotate-90 h-4 w-4 mr-1" />
                      Main Menu
                    </button>
                  </div>

                  {/* Sub-Categorues */}
                  <div className="flex-1 overflow-y-auto flex flex-col">
                    {activeCategory && (
                      <Link
                        href={`/collection/${activeCategory.name.toLowerCase().replace(/\s+/g, "-")}`}
                        onClick={() => {
                          setIsCategoryOpen(false);
                          setIsOpen(false);
                        }}
                        className="group px-6 py-4 text-lg font-semibold text-red-600 flex justify-between items-center"
                      >
                        All {activeCategory.name}
                        <span className="text-xs uppercase tracking-widest group-hover:underline">
                          Explore
                        </span>
                      </Link>
                    )}
                    <div className="flex flex-col">
                      {activeCategory?.sub_categories?.map((sub) => (
                        <Link
                          key={sub.id}
                          href={{
                            pathname: `/collection/${activeCategory?.name?.toLowerCase().replace(/\s+/g, "-")}`,
                            query: { sub: sub.name },
                          }}
                          onClick={() => {
                            setIsCategoryOpen(false);
                            setIsOpen(false);
                          }}
                          className="group px-6 py-4 text-gray-900 hover:text-red-600 transition-colors flex justify-between items-center"
                        >
                          {sub.name}
                          <ChevronDown className="-rotate-90 h-4 w-4 text-gray-300 group-hover:text-red-600 transition-colors" />
                        </Link>
                      ))}
                    </div>
                  </div>
                </SheetHeader>
              </SheetContent>
            </Sheet>

            {/* Cart Menu */}
            <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
              <SheetContent
                side="right"
                className="bg-white w-full [&>button]:hidden"
              >
                <SheetTitle className="sr-only"></SheetTitle>
                <SheetDescription className="sr-only"></SheetDescription>
                <div className="mt-3 flex flex-col">
                  <div className="py-3 mx-6 flex justify-between items-center font-medium text-sm text-gray-600 border-b">
                    <p className="uppercase">Items in Cart ({items.length})</p>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="text-gray-400 hover:text-gray-500 hover:bg-gray-100 p-1 rounded-sm transition-all"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                  {items.length === 0 ? (
                    <div className="flex h-full flex-col justify-center items-center space-y-4">
                      <ShoppingCart className="h-10 w-10 text-red-600" />
                      <p className="text-md font-medium text-red-600">
                        Your cart is empty
                      </p>
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
                      <div
                        key={item.id}
                        className="flex justify-between items-center py-6 border-b mx-6"
                      >
                        <Link
                          href={`/collection/${item.category.toLowerCase().replace(/\s+/g, "-")}/${item.sub_category.toLowerCase().replace(/\s+/g, "-")}/${item.name.toLowerCase().replace(/\s+/g, "-")}`}
                        >
                          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md  border-gray-200 mr-4">
                            <Image
                              src={item.image || "/placeholder.png"}
                              alt={item.name}
                              fill
                              className="object-cover"
                              sizes="80px"
                            />
                          </div>
                        </Link>
                        <div className="relative -ml-8">
                          <p className="font-medium text-sm w-[15vh]">
                            {item.name}
                          </p>
                          <p className="font-normal text-xs w-[15vh] text-gray-500 mt-1">
                            {item.sku}
                          </p>
                          <div className="w-fit flex items-center border rounded-md bg-transparent mt-2">
                            <button
                              onClick={() =>
                                handleQuantityChange(
                                  item.id,
                                  item.quantity - 1,
                                  item.stock_qty,
                                )
                              }
                              disabled={item.quantity <= 1}
                              className="p-2 border-r hover:bg-gray-100 disabled:opacity-30 transition-colors"
                            >
                              <Minus size={10} />
                            </button>
                            <input
                              id={`quantity-${item.id}`}
                              type="number"
                              value={item.quantity}
                              tabIndex={-1}
                              onChange={(e) => {
                                const val = parseInt(e.target.value);
                                if (!isNaN(val)) {
                                  handleQuantityChange(
                                    item.id,
                                    Math.min(Math.max(1, val), item.stock_qty),
                                    item.stock_qty,
                                  );
                                } else if (e.target.value === "") {
                                  handleQuantityChange(
                                    item.id,
                                    0,
                                    item.stock_qty,
                                  );
                                }
                              }}
                              onBlur={(e) => {
                                if (
                                  e.target.value === "" ||
                                  parseInt(e.target.value) < 1
                                ) {
                                  handleQuantityChange(
                                    item.id,
                                    1,
                                    item.stock_qty,
                                  );
                                }
                              }}
                              className="w-10 text-center font-semibold text-xs bg-transparent focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                            <button
                              onClick={() =>
                                handleQuantityChange(
                                  item.id,
                                  item.quantity + 1,
                                  item.stock_qty,
                                )
                              }
                              disabled={item.quantity >= item.stock_qty}
                              className="p-2 border-l hover:bg-gray-100 disabled:opacity-30 transition-colors"
                            >
                              <Plus size={10} />
                            </button>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-sm">
                            <span className="font-medium">₱ </span>
                            {(item.price * item.quantity).toLocaleString(
                              undefined,
                              { minimumFractionDigits: 2 },
                            )}
                          </p>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-xs text-red-500 hover:text-red-700 underline cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {items.length > 0 && (
                  <div className="px-6 pb-6 pt-3">
                    <div className="flex justify-between font-semibold text-md">
                      <span>Total</span>
                      <span>
                        <span className="font-medium">₱ </span>
                        {totalPrice.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                    <div className="flex w-full mt-5 gap-3">
                      <Button
                        onClick={() => clearCart()}
                        variant="ghost"
                        className="flex-1 h-11 border border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-300 rounded-lg font-medium text-sm cursor-pointer transition-colors"
                      >
                        Clear Cart
                      </Button>
                      <Link
                        href="/cart"
                        onClick={() => setIsCartOpen(false)}
                        className="flex-1"
                      >
                        <Button className="w-full h-11 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold text-sm cursor-pointer">
                          View Cart
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
              </SheetContent>
            </Sheet>

            {/* Collection Overlay */}
            <div
              className={cn(
                "fixed inset-0 top-22.5 bg-black/30 transition-opacity duration-500 z-[-2] pointer-events-none",
                isCollectionOpen ? "opacity-100" : "opacity-0",
              )}
            />
            <div
              className={cn(
                "absolute left-0 top-22.5 w-full bg-[#f8f8f8] border-b border-gray-200 shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] z-[-1] overflow-hidden",
                isCollectionOpen
                  ? "max-h-100 opacity-100 overflow-y-auto"
                  : "max-h-0 opacity-0",
              )}
            >
              <div className="container mx-auto py-12 px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                {categories.map((category) => (
                  <div key={category.id} className="flex flex-col space-y-4">
                    <Link
                      href={`/collection/${category.name.toLowerCase().replace(/\s+/g, "-")}`}
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
                          href={{
                            pathname: `/collection/${category.name.toLowerCase().replace(/\s+/g, "-")}`,
                            query: { sub: sub.name },
                          }}
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
                        alt="all_collection_img"
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                    <div className="absolute inset-0 rounded-md bg-black/30 hover:bg-black/0 transition-colors duration-300 z-10"></div>
                    <p className="relative text-lg font-semibold text-white z-20">
                      All Collection
                    </p>
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
