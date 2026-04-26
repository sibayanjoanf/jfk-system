export interface SubCategory {
  id: string;
  category_id: string;
  name: string;
  image_url: string;
}

export interface Category {
  id: string;
  name: string;
  image_url: string;
  expanded: boolean;
  subCategories: SubCategory[];
}

export interface CompanyForm {
  companyName: string;
  companyLogo: string;
  branchName: string;
  address: string;
  phone: string;
  telephone: string;
  companyEmail: string;
}

export type MainTab = "categories" | "company" | "storefront";