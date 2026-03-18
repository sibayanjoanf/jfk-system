export interface Inquiry {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  message: string;
  status: "New" | "Viewed" | "Resolved";
  created_at: string;
}

export const formatDate = (iso: string) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const formatDateFull = (iso: string) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-PH", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

export const getStatusTextColor = (status: string) => {
  switch (status) {
    case "New":      return "text-[#20B2DF]";
    case "Viewed":   return "text-[#FF8E29]";
    case "Resolved": return "text-[#27D095]";
    default:         return "text-gray-500";
  }
};

export const getStatusDot = (status: string) => {
  switch (status) {
    case "New":      return "bg-[#20B2DF]";
    case "Viewed":   return "bg-[#FF8E29]";
    case "Resolved": return "bg-[#27D095]";
    default:         return "bg-gray-400";
  }
};

export const getStatusBg = (status: string) => {
  switch (status) {
    case "New":      return "bg-[#20B2DF]/10";
    case "Viewed":   return "bg-[#FF8E29]/10";
    case "Resolved": return "bg-[#27D095]/10";
    default:         return "bg-gray-100";
  }
};

export const initials = (first: string, last: string) =>
  `${first?.[0] ?? ""}${last?.[0] ?? ""}`.toUpperCase();