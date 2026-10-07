import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Dish,
  Ingredient,
  Order,
  OrderItem,
  InventoryLog,
  OrderStatus,
  SoupType,
  OrderType,
  PaymentMethod,
} from '../types/restaurant';
import { INITIAL_DISHES, INITIAL_INGREDIENTS } from '../data/initialData';

interface RestaurantContextType {
  dishes: Dish[];
  ingredients: Ingredient[];
  orders: Order[];
  inventoryLogs: InventoryLog[];
  cart: OrderItem[];
  lowStockIngredients: Ingredient[];

  // Dish management
  addDish: (dish: Omit<Dish, 'id'>) => Dish;
  updateDish: (id: string, updates: Partial<Dish>) => void;
  deleteDish: (id: string) => void;
  toggleDishAvailability: (id: string) => void;

  // Inventory management
  addIngredient: (ing: Omit<Ingredient, 'id' | 'updatedAt'>) => void;
  updateIngredient: (id: string, updates: Partial<Ingredient>) => void;
  replenishStock: (id: string, amount: number, cost?: number, reason?: string) => void;
  adjustStock: (id: string, newStock: number, reason: string) => void;

  // Cart & POS
  addToCart: (dish: Dish, options?: { selectedSoup?: SoupType; selectedSauce?: string; notes?: string }) => void;
  updateCartItemQty: (index: number, quantity: number) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;
  cartSubtotal: number;

  // Orders & Kitchen
  createOrder: (orderData: {
    type: OrderType;
    tableNumber?: string;
    customerName?: string;
    customerPhone?: string;
    deliveryAddress?: string;
    paymentMethod: PaymentMethod;
    amountPaid?: number;
    discount?: number;
  }) => Order | null;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  activeOrders: Order[];
  completedOrders: Order[];

  // Utilities
  resetToInitialData: () => void;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

const STORAGE_KEYS = {
  DISHES: 'food_planet_dishes_v1',
  INGREDIENTS: 'food_planet_ingredients_v1',
  ORDERS: 'food_planet_orders_v1',
  LOGS: 'food_planet_logs_v1',
};

export const RestaurantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dishes, setDishes] = useState<Dish[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DISHES);
      if (saved) {
        const parsed: Dish[] = JSON.parse(saved);
        const existingIds = new Set(parsed.map((d) => d.id));
        const missing = INITIAL_DISHES.filter((d) => !existingIds.has(d.id));
        return missing.length > 0 ? [...parsed, ...missing] : parsed;
      }
      return INITIAL_DISHES;
    } catch {
      return INITIAL_DISHES;
    }
  });

  const [ingredients, setIngredients] = useState<Ingredient[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INGREDIENTS);
      return saved ? JSON.parse(saved) : INITIAL_INGREDIENTS;
    } catch {
      return INITIAL_INGREDIENTS;
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (saved) return JSON.parse(saved);
      // Sample recent orders for demo
      return [
        {
          id: 'ord-101',
          orderNumber: 101,
          createdAt: new Date(Date.now() - 25 * 60000).toISOString(),
          type: 'mesa',
          tableNumber: 'Mesa 3',
          customerName: 'Carlos M.',
          items: [
            { dishId: 'dish-1', dishName: 'Milanesa Clásica de Res', price: 28, quantity: 1 },
            { dishId: 'dish-12', dishName: 'Refresco Natural / Mocochinchi Helado', price: 5, quantity: 1 },
          ],
          subtotal: 33,
          discount: 0,
          total: 33,
          paymentMethod: 'efectivo',
          status: 'listo',
          statusUpdatedAt: new Date(Date.now() - 5 * 60000).toISOString(),
        },
        {
          id: 'ord-102',
          orderNumber: 102,
          createdAt: new Date(Date.now() - 12 * 60000).toISOString(),
          type: 'mesa',
          tableNumber: 'Mesa 1',
          customerName: 'Valeria R.',
          items: [
            {
              dishId: 'dish-10',
              dishName: 'Almuerzo Ejecutivo Food Planet',
              price: 18,
              quantity: 2,
              selectedSoup: 'mani',
              notes: 'Sopa bien caliente con extra llajwa',
            },
          ],
          subtotal: 36,
          discount: 0,
          total: 36,
          paymentMethod: 'qr',
          status: 'preparando',
          statusUpdatedAt: new Date(Date.now() - 10 * 60000).toISOString(),
        },
      ];
    } catch {
      return [];
    }
  });

  const [inventoryLogs, setInventoryLogs] = useState<InventoryLog[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LOGS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [cart, setCart] = useState<OrderItem[]>([]);

  // Sync state to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.DISHES, JSON.stringify(dishes));
    } catch (e) {
      console.error(e);
    }
  }, [dishes]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.INGREDIENTS, JSON.stringify(ingredients));
    } catch (e) {
      console.error(e);
    }
  }, [ingredients]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(inventoryLogs));
    } catch (e) {
      console.error(e);
    }
  }, [inventoryLogs]);

  // Derived low stock items
  const lowStockIngredients = ingredients.filter((ing) => ing.currentStock <= ing.minStock);

  // Cart Subtotal
  const cartSubtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Dish Methods
  const addDish = (dishData: Omit<Dish, 'id'>) => {
    const newDish: Dish = {
      ...dishData,
      id: `dish-${Date.now()}`,
    };
    setDishes((prev) => [newDish, ...prev]);
    return newDish;
  };

  const updateDish = (id: string, updates: Partial<Dish>) => {
    setDishes((prev) => prev.map((d) => (d.id === id ? { ...d, ...updates } : d)));
  };

  const deleteDish = (id: string) => {
    setDishes((prev) => prev.filter((d) => d.id !== id));
  };

  const toggleDishAvailability = (id: string) => {
    setDishes((prev) => prev.map((d) => (d.id === id ? { ...d, isAvailable: !d.isAvailable } : d)));
  };

  // Ingredient Methods
  const addIngredient = (ingData: Omit<Ingredient, 'id' | 'updatedAt'>) => {
    const newIng: Ingredient = {
      ...ingData,
      id: `ing-${Date.now()}`,
      updatedAt: new Date().toISOString(),
    };
    setIngredients((prev) => [...prev, newIng]);
    const log: InventoryLog = {
      id: `log-${Date.now()}`,
      ingredientId: newIng.id,
      ingredientName: newIng.name,
      change: newIng.currentStock,
      type: 'inicial',
      reason: 'Creación de insumo',
      timestamp: new Date().toISOString(),
    };
    setInventoryLogs((prev) => [log, ...prev]);
  };

  const updateIngredient = (id: string, updates: Partial<Ingredient>) => {
    setIngredients((prev) =>
      prev.map((ing) => (ing.id === id ? { ...ing, ...updates, updatedAt: new Date().toISOString() } : ing))
    );
  };

  const replenishStock = (id: string, amount: number, cost?: number, reason?: string) => {
    const target = ingredients.find((i) => i.id === id);
    if (!target) return;

    const updatedStock = Number((target.currentStock + amount).toFixed(2));
    updateIngredient(id, {
      currentStock: updatedStock,
      costPerUnit: cost !== undefined ? cost : target.costPerUnit,
    });

    const log: InventoryLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      ingredientId: id,
      ingredientName: target.name,
      change: amount,
      type: 'reposicion',
      reason: reason || 'Compra de reabastecimiento',
      timestamp: new Date().toISOString(),
      cost: cost ? cost * amount : undefined,
    };
    setInventoryLogs((prev) => [log, ...prev]);
  };

  const adjustStock = (id: string, newStock: number, reason: string) => {
    const target = ingredients.find((i) => i.id === id);
    if (!target) return;

    const diff = Number((newStock - target.currentStock).toFixed(2));
    updateIngredient(id, { currentStock: newStock });

    const log: InventoryLog = {
      id: `log-${Date.now()}`,
      ingredientId: id,
      ingredientName: target.name,
      change: diff,
      type: 'ajuste_merma',
      reason: reason || 'Ajuste manual de inventario / merma',
      timestamp: new Date().toISOString(),
    };
    setInventoryLogs((prev) => [log, ...prev]);
  };

  // Cart Methods
  const addToCart = (
    dish: Dish,
    options?: { selectedSoup?: SoupType; selectedSauce?: string; notes?: string }
  ) => {
    setCart((prev) => {
      // Check if identical item already exists in cart (matching soup, sauce, notes)
      const existingIdx = prev.findIndex(
        (it) =>
          it.dishId === dish.id &&
          it.selectedSoup === options?.selectedSoup &&
          it.selectedSauce === options?.selectedSauce &&
          (it.notes || '') === (options?.notes || '')
      );

      if (existingIdx >= 0) {
        const next = [...prev];
        next[existingIdx] = {
          ...next[existingIdx],
          quantity: next[existingIdx].quantity + 1,
        };
        return next;
      }

      const newItem: OrderItem = {
        dishId: dish.id,
        dishName: dish.name,
        price: dish.price,
        quantity: 1,
        selectedSoup: options?.selectedSoup,
        selectedSauce: options?.selectedSauce,
        notes: options?.notes,
      };
      return [...prev, newItem];
    });
  };

  const updateCartItemQty = (index: number, quantity: number) => {
    setCart((prev) => {
      if (quantity <= 0) {
        return prev.filter((_, i) => i !== index);
      }
      const next = [...prev];
      next[index] = { ...next[index], quantity };
      return next;
    });
  };

  const removeFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const clearCart = () => setCart([]);

  // Create Order and automatically deduct recipe inventory
  const createOrder = (orderData: {
    type: OrderType;
    tableNumber?: string;
    customerName?: string;
    customerPhone?: string;
    deliveryAddress?: string;
    paymentMethod: PaymentMethod;
    amountPaid?: number;
    discount?: number;
  }): Order | null => {
    if (cart.length === 0) return null;

    const discount = orderData.discount || 0;
    const total = Math.max(0, cartSubtotal - discount);
    const orderNum = orders.length > 0 ? Math.max(...orders.map((o) => o.orderNumber)) + 1 : 101;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      createdAt: new Date().toISOString(),
      type: orderData.type,
      tableNumber: orderData.tableNumber,
      customerName: orderData.customerName || 'Cliente Mostrador',
      customerPhone: orderData.customerPhone,
      deliveryAddress: orderData.deliveryAddress,
      items: [...cart],
      subtotal: cartSubtotal,
      discount,
      total,
      paymentMethod: orderData.paymentMethod,
      amountPaid: orderData.amountPaid,
      change: orderData.amountPaid ? Math.max(0, orderData.amountPaid - total) : undefined,
      status: 'pendiente',
      statusUpdatedAt: new Date().toISOString(),
    };

    // Deduce inventory for each ordered dish based on recipe
    const ingredientDeductions: Record<string, number> = {};

    cart.forEach((item) => {
      const dish = dishes.find((d) => d.id === item.dishId);
      if (dish && dish.recipe && dish.recipe.length > 0) {
        dish.recipe.forEach((rec) => {
          const used = rec.quantity * item.quantity;
          ingredientDeductions[rec.ingredientId] = (ingredientDeductions[rec.ingredientId] || 0) + used;
        });
      }

      // If it's a lunch soup, deduct specific soup ingredient
      if (item.selectedSoup) {
        if (item.selectedSoup === 'mani') {
          ingredientDeductions['ing-14'] = (ingredientDeductions['ing-14'] || 0) + 0.05 * item.quantity;
        } else if (item.selectedSoup === 'arroz') {
          ingredientDeductions['ing-11'] = (ingredientDeductions['ing-11'] || 0) + 0.06 * item.quantity;
        } else if (item.selectedSoup === 'fideo') {
          ingredientDeductions['ing-12'] = (ingredientDeductions['ing-12'] || 0) + 0.06 * item.quantity;
        } else if (item.selectedSoup === 'avena') {
          ingredientDeductions['ing-13'] = (ingredientDeductions['ing-13'] || 0) + 0.05 * item.quantity;
        }
      }
    });

    // Apply inventory deductions
    const newLogs: InventoryLog[] = [];
    setIngredients((prev) =>
      prev.map((ing) => {
        const deduction = ingredientDeductions[ing.id];
        if (deduction && deduction > 0) {
          const remaining = Math.max(0, Number((ing.currentStock - deduction).toFixed(2)));
          newLogs.push({
            id: `log-${Date.now()}-${ing.id}`,
            ingredientId: ing.id,
            ingredientName: ing.name,
            change: -deduction,
            type: 'venta',
            reason: `Orden #${orderNum}`,
            timestamp: new Date().toISOString(),
          });
          return {
            ...ing,
            currentStock: remaining,
            updatedAt: new Date().toISOString(),
          };
        }
        return ing;
      })
    );

    if (newLogs.length > 0) {
      setInventoryLogs((prev) => [...newLogs, ...prev]);
    }

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === orderId
          ? {
              ...ord,
              status,
              statusUpdatedAt: new Date().toISOString(),
            }
          : ord
      )
    );
  };

  const activeOrders = orders.filter((o) => o.status !== 'entregado' && o.status !== 'cancelado');
  const completedOrders = orders.filter((o) => o.status === 'entregado');

  const resetToInitialData = () => {
    setDishes(INITIAL_DISHES);
    setIngredients(INITIAL_INGREDIENTS);
    setOrders([]);
    setInventoryLogs([]);
    setCart([]);
    localStorage.removeItem(STORAGE_KEYS.DISHES);
    localStorage.removeItem(STORAGE_KEYS.INGREDIENTS);
    localStorage.removeItem(STORAGE_KEYS.ORDERS);
    localStorage.removeItem(STORAGE_KEYS.LOGS);
  };

  return (
    <RestaurantContext.Provider
      value={{
        dishes,
        ingredients,
        orders,
        inventoryLogs,
        cart,
        lowStockIngredients,
        addDish,
        updateDish,
        deleteDish,
        toggleDishAvailability,
        addIngredient,
        updateIngredient,
        replenishStock,
        adjustStock,
        addToCart,
        updateCartItemQty,
        removeFromCart,
        clearCart,
        cartSubtotal,
        createOrder,
        updateOrderStatus,
        activeOrders,
        completedOrders,
        resetToInitialData,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
};

export const useRestaurant = () => {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error('useRestaurant must be used within a RestaurantProvider');
  }
  return context;
};
