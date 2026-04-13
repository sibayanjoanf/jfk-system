import { supabase } from "@/lib/supabase";
import { Order, OrderStatus, CreateOrderForm, OrderItem } from "../types";

export function useOrderMutations() {

  const updateStatus = async (id: string, status: OrderStatus): Promise<{ error: string | null }> => {
    try {
      const { error } = await supabase
        .from("inquiries")
        .update({ status })
        .eq("id", id);

      if (error) throw error;
      return { error: null };
    } catch (err) {
      const e = err as { message: string };
      return { error: e.message };
    }
  };

  const updateOrder = async (id: string, updates: Partial<Order>): Promise<{ error: string | null }> => {
    try {
      const { error } = await supabase
        .from("inquiries")
        .update({
          first_name:          updates.first_name,
          last_name:           updates.last_name,
          email:               updates.email,
          phone:               updates.phone,
          delivery_preference: updates.delivery_preference,
          payment_preference:  updates.payment_preference,
          message:             updates.message,
          items:               updates.items,
          total_amount:        updates.total_amount,
        })
        .eq("id", id);

      if (error) throw error;
      return { error: null };
    } catch (err) {
      const e = err as { message: string };
      return { error: e.message };
    }
  };

  const createOrder = async (form: CreateOrderForm): Promise<{ error: string | null }> => {
    try {
      const total = form.items.reduce(
        (sum, item) => sum + item.price * item.quantity, 0
      );

      const { error } = await supabase
        .from("inquiries")
        .insert({
          first_name:          form.first_name,
          last_name:           form.last_name,
          email:               form.email || null,
          phone:               form.phone,
          delivery_preference: form.delivery_preference,
          payment_preference:  form.payment_preference,
          message:             form.message || null,
          order_type:          form.order_type,
          items:               form.items,
          total_amount:        total,
        });

      if (error) throw error;
      return { error: null };
    } catch (err) {
      const e = err as { message: string };
      return { error: e.message };
    }
  };

  // Archive instead of delete
  const archiveOrders = async (ids: string[]): Promise<{ error: string | null }> => {
    try {
      const { error } = await supabase
        .from("inquiries")
        .update({ is_archived: true })
        .in("id", ids);

      if (error) throw error;
      return { error: null };
    } catch (err) {
      const e = err as { message: string };
      return { error: e.message };
    }
  };

  // Restore archived orders
  const restoreOrders = async (ids: string[]): Promise<{ error: string | null }> => {
    try {
      const { error } = await supabase
        .from("inquiries")
        .update({ is_archived: false })
        .in("id", ids);

      if (error) throw error;
      return { error: null };
    } catch (err) {
      const e = err as { message: string };
      return { error: e.message };
    }
  };

  const refundItems = async (
    id: string,
    refundedItems: OrderItem[]
  ): Promise<{ error: string | null }> => {
    try {
      const { error } = await supabase
        .from("inquiries")
        .update({ refunded_items: refundedItems })
        .eq("id", id);

      if (error) throw error;
      return { error: null };
    } catch (err) {
      const e = err as { message: string };
      return { error: e.message };
    }
  };

  const bulkUpdateStatus = async (ids: string[], status: OrderStatus): Promise<{ error: string | null }> => {
    try {
      const { error } = await supabase
        .from("inquiries")
        .update({ status })
        .in("id", ids);

      if (error) throw error;
      return { error: null };
    } catch (err) {
      const e = err as { message: string };
      return { error: e.message };
    }
  };

  return {
    updateStatus,
    updateOrder,
    createOrder,
    archiveOrders, 
    restoreOrders,   
    bulkUpdateStatus,
    refundItems,
  };
}