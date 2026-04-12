export interface DbSubCategory {
  id: string;
  name: string;
  categories: { name: string } | null;
}

export interface DbVariant {
  id: string;
  sku: string;
  price: number;
  stock_qty: number;
  image_url: string | null;
  attribute_value: string | null;
  attribute_name: string | null;
  dimension: string | null;
  keywords: string | null;
  is_archived: boolean;
}

export interface DbProduct {
  id: string;
  name: string;
  description: string | null;
  sub_categories: DbSubCategory | null;
  product_variants: DbVariant[] | null;
}

export interface ProductRow {
  id: string;
  product_id: string;
  name: string;
  description: string | null;
  type: string;
  sku: string;
  status: "In Stock" | "Low Stock" | "Out of Stock";
  price: number;
  category: string;
  sub_category: string;
  sub_category_id: string;
  stock: number;
  image_url: string;
  attribute_name: string | null;
  attribute_value: string | null;
  dimension: string | null;
  keywords: string | null;
}

export interface VariantForm {
  _key: string;
  sku: string;
  attribute_name: string;
  attribute_value: string;
  price: string;
  stock_qty: string;
  dimension: string;
  keywords: string;
  image_url: string;
  image_file: File | null;
  image_preview: string;
}

export interface EditableVariant {
  id: string;
  sku: string;
  attribute_name: string;
  attribute_value: string;
  price: string;
  stock_qty: string;
  dimension: string;
  keywords: string;
  image_url: string;
  image_file: File | null;
  image_preview: string;
}

export interface CategoryOption {
  id: string;
  name: string;
}

export interface SubCategoryOption {
  id: string;
  name: string;
  category_id: string;
}

export type SortField = "name" | "sku" | "price" | "stock" | null;
export type SortDir = "asc" | "desc";

export const PAGE_SIZE_OPTIONS = [10, 20, 50];

export const emptyVariant = (): VariantForm => ({
  _key: Date.now().toString() + Math.random(),
  sku: "",
  attribute_name: "",
  attribute_value: "",
  price: "",
  stock_qty: "0",
  dimension: "",
  keywords: "",
  image_url: "",
  image_file: null,
  image_preview: "",
});