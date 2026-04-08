"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchOrderById } from "../hooks/fetchOrderById";
import OrderDetailView from "./components/OrderDetailView";
import { Order } from "../types";
import { Loader2 } from "lucide-react";

export default function OrderDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      const data = await fetchOrderById(id);
      setOrder(data);
      setLoading(false);
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        <Loader2 className="animate-spin" size={20} />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        <p className="text-sm">Order not found.</p>
      </div>
    );
  }

  return <OrderDetailView initialOrder={order} />;
}
