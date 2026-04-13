import { supabase } from "@/lib/supabase";
import { Order } from "../types";

export async function fetchOrderById(id: string): Promise<Order | null> {
  const { data, error } = await supabase
    .from("inquiries")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;

  return {
    id:                  data.id,
    order_number:        data.order_number,
    status:              data.status,
    order_type:          data.order_type,
    first_name:          data.first_name,
    last_name:           data.last_name,
    email:               data.email,
    phone:               data.phone,
    delivery_preference: data.delivery_preference,
    payment_preference:  data.payment_preference,
    message:             data.message,
    items:               data.items ?? [],
    total_amount:        data.total_amount,
    created_at:          data.created_at,
    refunded_items:       data.refunded_items ?? [],
  };
}