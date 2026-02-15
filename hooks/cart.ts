import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
  stock_qty: number;
  category: string;
  sub_category: string;
}

export function useCart() {
  const queryClient = useQueryClient();

  const { data: items = [] } = useQuery<CartItem[]>({
    queryKey: ['cart'],
    queryFn: () => {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('jfk-cart');
        try {
          return saved ? JSON.parse(saved) : [];
        } catch (e) {
          console.error("Cart parse error:", e);
          return [];
        }
      }
      return [];
    },
    staleTime: Infinity,
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('jfk-cart', JSON.stringify(items));
    }
  }, [items]);

  const addItem = (product: Omit<CartItem, 'quantity'>, maxStock: number, selectedQty: number) => {
    const limit = Number(maxStock);
    
    queryClient.setQueryData(['cart'], (old: CartItem[] = []) => {
      const existing = old.find(item => item.id === product.id);
      
      if (existing) {
        if (existing.quantity + selectedQty > limit) {
          alert(`Cannot add ${selectedQty} more. Only ${limit - existing.quantity} units left in stock.`);
          return old;
        }

        return old.map(item =>
          item.id === product.id 
            ? { ...item, quantity: item.quantity + selectedQty } 
            : item
        );
      }
      
      if (limit <= 0 || selectedQty > limit) {
        alert(`Only ${limit} units available.`);
        return old;
      }

      return [...old, { ...product, quantity: selectedQty }];
    });
  };

  const removeItem = (id: string) => {
    queryClient.setQueryData(['cart'], (old: CartItem[] = []) => 
      old.filter(item => item.id !== id)
    );
  };

  const clearCart = () => {
    queryClient.setQueryData(['cart'], []);
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id);
      return;
    }

    queryClient.setQueryData(['cart'], (old: CartItem[] = []) => {
      return old.map(item =>
        item.id === id 
          ? { ...item, quantity: newQuantity } 
          : item
      );
    });
  };

  const totalPrice = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return { items, addItem, removeItem, clearCart, updateQuantity, totalPrice };
}