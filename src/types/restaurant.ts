export type CategoryType = 
  | 'milanesas'
  | 'comida_rapida'
  | 'sandwiches'
  | 'almuerzos'
  | 'bebidas';

export type SoupType = 'mani' | 'arroz' | 'fideo' | 'avena';

export interface Ingredient {
  id: string;
  name: string;
  unit: 'kg' | 'g' | 'litro' | 'ml' | 'unidad' | 'paquete';
  currentStock: number;
  minStock: number;
  costPerUnit: number; // Costo unitario en Bs.
  category: 'carnes' | 'verduras' | 'granos_secos' | 'panaderia' | 'lacteos' | 'abarrotes' | 'salsas';
  updatedAt: string;
}

export interface RecipeIngredient {
  ingredientId: string;
  quantity: number;
}

export interface Dish {
  id: string;
  name: string;
  shortDesc: string;
  description: string;
  price: number; // en Bs.
  category: CategoryType;
  isAvailable: boolean;
  recipe: RecipeIngredient[];
  preparationTimeMinutes: number;
  tags?: string[];
  isSpecialLunch?: boolean; // Para los almuerzos del día que permiten seleccionar sopa
  imageBadgeText?: string;
  emojiIcon?: string;
}

export type OrderType = 'mesa' | 'llevar' | 'delivery';
export type OrderStatus = 'pendiente' | 'preparando' | 'listo' | 'entregado' | 'cancelado';
export type PaymentMethod = 'efectivo' | 'qr' | 'tarjeta';

export interface OrderItem {
  dishId: string;
  dishName: string;
  price: number;
  quantity: number;
  selectedSoup?: SoupType;
  selectedSauce?: string;
  notes?: string;
}

export interface Order {
  id: string;
  orderNumber: number;
  createdAt: string;
  type: OrderType;
  tableNumber?: string;
  customerName?: string;
  customerPhone?: string;
  deliveryAddress?: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  amountPaid?: number;
  change?: number;
  status: OrderStatus;
  statusUpdatedAt: string;
}

export interface InventoryLog {
  id: string;
  ingredientId: string;
  ingredientName: string;
  change: number;
  type: 'venta' | 'reposicion' | 'ajuste_merma' | 'inicial';
  reason?: string;
  timestamp: string;
  cost?: number;
}
