import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../types';
import { toast } from 'sonner';

interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

/**
 * CONTEXTO DEL CARRITO:
 * Centraliza el estado de los productos seleccionados por el usuario.
 * Permite que cualquier componente de la app acceda al carrito sin pasar props manualmente.
 */
export function CartProvider({ children }: { children: React.ReactNode }) {
  // Inicializamos el estado del carrito intentando leer del LocalStorage
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('jakka_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // PERSISTENCIA: Cada vez que el carrito cambia, guardamos una copia en LocalStorage
  useEffect(() => {
    localStorage.setItem('jakka_cart', JSON.stringify(items));
  }, [items]);

  /**
   * AGREGAR PRODUCTO:
   * Si el producto ya existe, aumenta su cantidad. Si no, lo agrega como nuevo.
   */
  const addToCart = (product: Product) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        toast.success(`Cantidad de ${product.name} actualizada`);
        return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      toast.success(`${product.name} añadido al carrito`);
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  /**
   * ACTUALIZAR CANTIDAD:
   * Evita que la cantidad sea menor a 1.
   */
  const updateQuantity = (id: string, delta: number) => {
    setItems(prev => prev.map(i => {
      if (i.id === id) {
        const newQty = Math.max(1, i.quantity + delta);
        return { ...i, quantity: newQty };
      }
      return i;
    }));
  };

  const clearCart = () => setItems([]);

  // Cálculos derivados (se recalculan cada vez que 'items' cambia)
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, total, itemCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}
