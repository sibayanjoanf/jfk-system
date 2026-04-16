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
  expanded: boolean;      // for UI only, not listed in DB
  subCategories: SubCategory[];
}

export interface NotificationSettings {
  inquiriesPush: boolean;
  inquiriesEmail: boolean;
  reportPush: boolean;
  reportEmail: boolean;
  remindersPush: boolean;
  remindersEmail: boolean;
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

export type MainTab = "categories" | "notifications" | "company" | "storefront";