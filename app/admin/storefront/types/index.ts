export interface Announcement {
    id: string;
    text: string;
    active: boolean;
}

export interface ShowcaseImage {
    id: string;
    product_name: string;
    image_url: string;
}

export interface FAQ {
    id: string;
    category_id: string;
    question: string;
    answer: string;
    open: boolean;
}

export interface FaqCategory {
    id: string;
    name: string;
}

export type StorefrontTab = "announcements" | "showcase" | "faq";