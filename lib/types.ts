// Database Types

export interface SubCategories {
  id: string;
  name: string;
  image_url?: string;
}

export interface Categories {
  id: string;
  name: string;
  image_url?: string;
}

export interface CategoryWithSub {
  id: string;
  name: string;
  image_url?: string;
  sub_categories: {
    id: string;
    name: string;
  }[];
}

export interface FAQWithCategory {
  id: string;
  name: string;
  faq: {
    id: string;
    question: string;
    answer: string;
  }[];
}

export interface InfoBranch {
  id: string;
  name: string;
  address: string;
  phone: string;
  telephone: string;
}

export interface ShowcaseProducts {
  id: string;
  product_name: string;
  image_url: string;
  products?: {
    name: string;
    sub_categories?: {
      name: string;
      categories?: {
        name: string;
      };
    }
  }
}

export interface Order {
  order_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  order_status: OrderStatus;
  items: OrderItem[];
  notes?: string;
  qr_code?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  product_id: string;
  product_name: string;
  qty: number;
  price: number;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  description?: string;
  price: number;
  stock_qty: number;
  image_url?: string | null;
  created_at: string;
  sub_categories?: {
    name: string;
    categories?: {
      name: string;
    };
  };
}

export type OrderStatus = 
  | 'orderPending' 
  | 'orderProcessing' 
  | 'orderPaid' 
  | 'orderCompleted';

// Form Types
export interface OrderFormData {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  items: OrderItem[];
  notes?: string;
}

export interface ProductFormData {
  name: string;
  description?: string;
  category: string;
  price: number;
  stock_quantity: number;
  image_url?: string;
}

export interface SiteSettings {
  id: number;
  business_name: string;
  logo_url?: string;
  hero_tagline?: string;
  hero_description?: string;
  business_email?: string;
  bulangon_phone?: string;
  bulangon_telephone?: string;
  bulangon_address?: string;
  barit_phone?: string;
  barit_telephone?: string;
  barit_address?: string;
  rizal_phone?: string;
  rizal_telephone?: string;
  rizal_address?: string;
  social_link_1?: string;
  social_link_2?: string;
  social_link_3?: string;
}

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}