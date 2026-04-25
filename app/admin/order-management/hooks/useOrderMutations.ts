import { supabase } from "@/lib/supabase";
import { Order, OrderStatus, CreateOrderForm, OrderItem } from "../types";

export function useOrderMutations() {

  const updateStatus = async (id: string, status: OrderStatus, performedBy = "system"): Promise<{ error: string | null }> => {
    try {
      const { data: orders } = await supabase
        .from("inquiries")
        .select("id, order_number, status")
        .eq("id", id)
        .single();

      const { error } = await supabase
        .from("inquiries")
        .update({ status })
        .eq("id", id);

      if (error) throw error;

      if (orders && status !== "Pending") {
        await supabase.from("order_status_history").insert({
          order_id: orders.id,
          order_number: orders.order_number,
          from_status: orders.status,
          status: status,
          changed_by: performedBy,
          action: "status_change",
        });
      }

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
  const archiveOrders = async (ids: string[], performedBy = "system"): Promise<{ error: string | null }> => {
  try {
    const { data: orders } = await supabase
      .from("inquiries")
      .select("id, order_number, status")
      .in("id", ids);

    const { error } = await supabase
      .from("inquiries")
      .update({ is_archived: true })
      .in("id", ids);

    if (error) throw error;

    if (orders) {
      await supabase.from("order_status_history").insert(
        orders.map((o) => ({
          order_id: o.id,
          order_number: o.order_number,
          from_status: o.status,
          status: o.status,
          changed_by: performedBy,
          action: "archived",
        }))
      );
    }

    return { error: null };
  } catch (err) {
    const e = err as { message: string };
    return { error: e.message };
  }
};

const restoreOrders = async (ids: string[], performedBy = "system"): Promise<{ error: string | null }> => {
  try {
    const { data: orders } = await supabase
      .from("inquiries")
      .select("id, order_number, status")
      .in("id", ids);

    const { error } = await supabase
      .from("inquiries")
      .update({ is_archived: false })
      .in("id", ids);

    if (error) throw error;

    if (orders) {
      await supabase.from("order_status_history").insert(
        orders.map((o) => ({
          order_id: o.id,
          order_number: o.order_number,
          from_status: o.status,
          status: o.status,
          changed_by: performedBy,
          action: "restored",
        }))
      );
    }

    return { error: null };
  } catch (err) {
    const e = err as { message: string };
    return { error: e.message };
  }
};

  const refundItems = async (
  id: string,
  refundedItems: OrderItem[],
  newRefundedItems: OrderItem[]
): Promise<{ error: string | null }> => {
  try {
    const { error } = await supabase.rpc("record_partial_refund", {
      p_order_id: id,
      p_refunded_items: refundedItems,
      p_new_refund_items: newRefundedItems,
    });

    if (error) throw error;
    return { error: null };
  } catch (err) {
    const e = err as { message: string };
    return { error: e.message };
  }
};

  const bulkUpdateStatus = async (ids: string[], status: OrderStatus, performedBy = "system"): Promise<{ error: string | null }> => {
    try {
      const { data: orders } = await supabase
        .from("inquiries")
        .select("id, order_number, status")
        .in("id", ids);

      const { error } = await supabase
        .from("inquiries")
        .update({ status })
        .in("id", ids);

      if (error) throw error;

      if (orders && status !== "Pending") {
        await supabase.from("order_status_history").insert(
          orders.map((o) => ({
            order_id: o.id,
            order_number: o.order_number,
            from_status: o.status,
            status: status,
            changed_by: performedBy,
            action: "status_change",
          }))
        );
      }

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