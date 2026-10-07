import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { Dish, SoupType, OrderType, PaymentMethod, Order } from '../../types/restaurant';
import { SOUP_OPTIONS } from '../../data/initialData';
import {
  Search,
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  CheckCircle,
  Receipt,
  User,
  UtensilsCrossed,
  Package,
  Bike,
  Sparkles,
} from 'lucide-react';
import { ReceiptModal } from '../ReceiptModal';

export const POSView: React.FC = () => {
  const {
    dishes,
    cart,
    addToCart,
    updateCartItemQty,
    removeFromCart,
    clearCart,
    cartSubtotal,
    createOrder,
  } = useRestaurant();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');

  // Order Details
  const [orderType, setOrderType] = useState<OrderType>('mesa');
  const [tableNumber, setTableNumber] = useState('Mesa 1');
  const [customerName, setCustomerName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('efectivo');
  const [amountPaid, setAmountPaid] = useState<string>('');
  const [discount, setDiscount] = useState<string>('0');

  // Lunch Soup Selector Modal
  const [soupModalOpen, setSoupModalOpen] = useState(false);
  const [pendingLunchDish, setPendingLunchDish] = useState<Dish | null>(null);
  const [selectedSoup, setSelectedSoup] = useState<SoupType>('mani');
  const [lunchNotes, setLunchNotes] = useState('');

  // Sauce Selector Modal for Wings
  const [sauceModalOpen, setSauceModalOpen] = useState(false);
  const [pendingSauceDish, setPendingSauceDish] = useState<Dish | null>(null);
  const [selectedSauce, setSelectedSauce] = useState('BBQ Ahumada');

  // Receipt Modal
  const [lastCreatedOrder, setLastCreatedOrder] = useState<Order | null>(null);

  // Filter Dishes
  const filteredDishes = dishes.filter((dish) => {
    if (!dish.isAvailable) return false;
    const matchesSearch =
      dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dish.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'todos' || dish.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDishClick = (dish: Dish) => {
    if (dish.isSpecialLunch) {
      setPendingLunchDish(dish);
      setSelectedSoup('mani');
      setLunchNotes('');
      setSoupModalOpen(true);
    } else if (dish.id === 'dish-6') {
      // Alitas
      setPendingSauceDish(dish);
      setSelectedSauce('BBQ Ahumada');
      setSauceModalOpen(true);
    } else {
      addToCart(dish);
    }
  };

  const handleConfirmLunchSoup = () => {
    if (pendingLunchDish) {
      addToCart(pendingLunchDish, {
        selectedSoup,
        notes: lunchNotes.trim() ? lunchNotes.trim() : undefined,
      });
      setSoupModalOpen(false);
      setPendingLunchDish(null);
    }
  };

  const handleConfirmSauce = () => {
    if (pendingSauceDish) {
      addToCart(pendingSauceDish, {
        selectedSauce,
      });
      setSauceModalOpen(false);
      setPendingSauceDish(null);
    }
  };

  const discountNum = parseFloat(discount) || 0;
  const totalAmount = Math.max(0, cartSubtotal - discountNum);
  const paidNum = parseFloat(amountPaid) || 0;
  const changeDue = paymentMethod === 'efectivo' && paidNum >= totalAmount ? paidNum - totalAmount : 0;

  const handleCheckout = () => {
    if (cart.length === 0) return;

    const newOrder = createOrder({
      type: orderType,
      tableNumber: orderType === 'mesa' ? tableNumber : undefined,
      customerName: customerName.trim() || (orderType === 'mesa' ? `${tableNumber}` : 'Cliente Mostrador'),
      paymentMethod,
      amountPaid: paymentMethod === 'efectivo' && paidNum > 0 ? paidNum : totalAmount,
      discount: discountNum,
    });

    if (newOrder) {
      setLastCreatedOrder(newOrder);
      setCustomerName('');
      setAmountPaid('');
      setDiscount('0');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* LEFT: DISH CATALOG & FILTERS (8 columns) */}
      <div className="lg:col-span-8 space-y-4">
        {/* Search and Filters */}
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 shadow-lg flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar milanesa, almuerzo, lomito, sopa..."
              className="w-full pl-10 pr-4 py-2 bg-stone-950 border border-stone-800 rounded-xl text-sm text-stone-100 placeholder:text-stone-500 focus:outline-hidden focus:border-amber-500 transition-colors"
            />
          </div>

          {/* Quick Categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none text-xs">
            {[
              { id: 'todos', label: 'Todos' },
              { id: 'milanesas', label: '🥩 Milanesas' },
              { id: 'sandwiches', label: '🥪 Sándwiches' },
              { id: 'comida_rapida', label: '🍗 Pollo & Alitas' },
              { id: 'almuerzos', label: '🍲 Almuerzos' },
              { id: 'bebidas', label: '🥤 Bebidas' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'bg-amber-500 text-stone-950 font-bold'
                    : 'bg-stone-800/80 text-stone-300 hover:bg-stone-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dishes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3.5">
          {filteredDishes.map((dish) => (
            <div
              key={dish.id}
              onClick={() => handleDishClick(dish)}
              className="group bg-stone-900 hover:bg-stone-850 border border-stone-800 hover:border-amber-500/50 rounded-2xl p-4 transition-all duration-150 cursor-pointer flex flex-col justify-between shadow-md active:scale-[0.98]"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-stone-800 group-hover:bg-amber-500/20 text-xl flex items-center justify-center transition-colors">
                    {dish.emojiIcon || '🍽️'}
                  </div>
                  <span className="font-mono font-bold text-amber-400 text-base">
                    Bs. {dish.price.toFixed(2)}
                  </span>
                </div>

                <h3 className="font-bold text-stone-100 group-hover:text-amber-300 text-sm leading-snug transition-colors">
                  {dish.name}
                </h3>
                <p className="text-xs text-stone-400 mt-1 line-clamp-2 leading-relaxed">
                  {dish.shortDesc}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-stone-800/80 flex items-center justify-between text-[11px] text-stone-400">
                <span>⏱️ {dish.preparationTimeMinutes} min</span>
                {dish.isSpecialLunch ? (
                  <span className="text-amber-400 font-bold flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Con 4 Sopas
                  </span>
                ) : (
                  <span className="text-stone-300 group-hover:text-amber-400 font-medium">
                    + Agregar
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredDishes.length === 0 && (
          <div className="text-center py-12 bg-stone-900/40 rounded-2xl border border-dashed border-stone-800">
            <p className="text-stone-400 text-sm">No se encontraron platos que coincidan con la búsqueda.</p>
          </div>
        )}
      </div>

      {/* RIGHT: CURRENT ORDER / CART & CASHIER (4 columns) */}
      <div className="lg:col-span-4 space-y-4">
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col h-full">
          {/* Cart Header */}
          <div className="flex items-center justify-between pb-3 border-b border-stone-800 mb-3">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-amber-400" />
              <h2 className="font-bold text-white text-base">Comanda Actual</h2>
            </div>
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs text-stone-400 hover:text-red-400 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" /> Vaciar
              </button>
            )}
          </div>

          {/* Order Type Toggle */}
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-stone-950 rounded-xl border border-stone-800 mb-3 text-xs">
            <button
              onClick={() => setOrderType('mesa')}
              className={`py-1.5 rounded-lg font-medium flex items-center justify-center gap-1 transition-all cursor-pointer ${
                orderType === 'mesa' ? 'bg-amber-500 text-stone-950 font-bold' : 'text-stone-400 hover:text-white'
              }`}
            >
              <UtensilsCrossed className="w-3.5 h-3.5" /> En Mesa
            </button>
            <button
              onClick={() => setOrderType('llevar')}
              className={`py-1.5 rounded-lg font-medium flex items-center justify-center gap-1 transition-all cursor-pointer ${
                orderType === 'llevar' ? 'bg-amber-500 text-stone-950 font-bold' : 'text-stone-400 hover:text-white'
              }`}
            >
              <Package className="w-3.5 h-3.5" /> Para Llevar
            </button>
            <button
              onClick={() => setOrderType('delivery')}
              className={`py-1.5 rounded-lg font-medium flex items-center justify-center gap-1 transition-all cursor-pointer ${
                orderType === 'delivery' ? 'bg-amber-500 text-stone-950 font-bold' : 'text-stone-400 hover:text-white'
              }`}
            >
              <Bike className="w-3.5 h-3.5" /> Delivery
            </button>
          </div>

          {/* Meta Inputs (Table #, Customer Name) */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            {orderType === 'mesa' ? (
              <select
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                className="bg-stone-950 border border-stone-800 rounded-xl px-2.5 py-1.5 text-xs text-stone-200 focus:outline-hidden focus:border-amber-500"
              >
                {['Mesa 1', 'Mesa 2', 'Mesa 3', 'Mesa 4', 'Mesa 5', 'Mesa 6', 'Mesa 7', 'Mesa 8', 'Barra 1', 'Barra 2'].map(
                  (m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  )
                )}
              </select>
            ) : (
              <div className="text-xs text-stone-400 flex items-center pl-2 font-medium">
                {orderType === 'llevar' ? 'Empaque para llevar' : 'Envío por delivery'}
              </div>
            )}
            <div className="relative">
              <User className="w-3.5 h-3.5 text-stone-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Nombre cliente"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-8 pr-2.5 py-1.5 text-xs text-stone-200 placeholder:text-stone-600 focus:outline-hidden focus:border-amber-500"
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto space-y-2 max-h-60 sm:max-h-80 pr-1 scrollbar-none">
            {cart.length === 0 ? (
              <div className="text-center py-8 text-stone-500 text-xs">
                El carrito está vacío. Haz clic en un plato para agregarlo.
              </div>
            ) : (
              cart.map((item, idx) => (
                <div
                  key={`${item.dishId}-${idx}`}
                  className="bg-stone-950 border border-stone-800/80 rounded-xl p-2.5 flex items-start justify-between gap-2"
                >
                  <div className="flex-1">
                    <div className="text-xs font-bold text-stone-200 leading-tight">
                      {item.dishName}
                    </div>

                    {item.selectedSoup && (
                      <div className="text-[11px] text-amber-400 font-medium mt-0.5">
                        🍲 Sopa:{' '}
                        {item.selectedSoup === 'mani'
                          ? 'Sopa de Maní'
                          : item.selectedSoup === 'arroz'
                          ? 'Sopa de Arroz'
                          : item.selectedSoup === 'fideo'
                          ? 'Sopa de Fideo'
                          : 'Sopa de Avena'}
                      </div>
                    )}

                    {item.selectedSauce && (
                      <div className="text-[11px] text-red-400 font-medium mt-0.5">
                        🍗 Salsa: {item.selectedSauce}
                      </div>
                    )}

                    {item.notes && (
                      <div className="text-[10px] text-stone-400 italic mt-0.5">
                        Nota: {item.notes}
                      </div>
                    )}

                    <div className="font-mono text-xs text-stone-400 mt-1">
                      Bs. {item.price.toFixed(2)} c/u
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => updateCartItemQty(idx, item.quantity - 1)}
                      className="w-6 h-6 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-5 text-center text-xs font-bold font-mono text-white">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateCartItemQty(idx, item.quantity + 1)}
                      className="w-6 h-6 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => removeFromCart(idx)}
                      className="text-stone-500 hover:text-red-400 ml-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pricing Summary */}
          {cart.length > 0 && (
            <div className="mt-3 pt-3 border-t border-stone-800 space-y-2 text-xs">
              <div className="flex justify-between text-stone-400">
                <span>Subtotal</span>
                <span className="font-mono">Bs. {cartSubtotal.toFixed(2)}</span>
              </div>

              <div className="flex items-center justify-between text-stone-400">
                <span>Descuento (Bs.)</span>
                <input
                  type="number"
                  min="0"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  className="w-16 bg-stone-950 border border-stone-800 rounded-lg px-2 py-0.5 text-right font-mono text-stone-200 text-xs focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div className="flex justify-between items-center text-sm font-bold text-white pt-1 border-t border-stone-800/60">
                <span>Total a Pagar</span>
                <span className="text-lg font-black font-mono text-amber-400">
                  Bs. {totalAmount.toFixed(2)}
                </span>
              </div>

              {/* Payment Methods */}
              <div className="pt-2">
                <span className="text-[11px] text-stone-400 block mb-1">Método de Pago</span>
                <div className="grid grid-cols-3 gap-1">
                  {[
                    { id: 'efectivo', label: '💵 Efectivo' },
                    { id: 'qr', label: '📱 QR Simple' },
                    { id: 'tarjeta', label: '💳 Tarjeta' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setPaymentMethod(p.id as PaymentMethod)}
                      className={`py-1.5 px-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                        paymentMethod === p.id
                          ? 'bg-amber-500 text-stone-950 font-bold'
                          : 'bg-stone-950 border border-stone-800 text-stone-400 hover:text-white'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {paymentMethod === 'efectivo' && (
                <div className="bg-stone-950 p-2 rounded-xl border border-stone-800/80 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-stone-400">Paga con:</span>
                    <input
                      type="number"
                      placeholder="Ej. 50"
                      value={amountPaid}
                      onChange={(e) => setAmountPaid(e.target.value)}
                      className="w-24 bg-stone-900 border border-stone-700 rounded-lg px-2 py-1 text-right font-mono text-white text-xs focus:outline-hidden focus:border-amber-500"
                    />
                  </div>
                  {paidNum > 0 && (
                    <div className="flex items-center justify-between font-bold">
                      <span className="text-stone-300">Cambio a entregar:</span>
                      <span
                        className={`font-mono text-sm ${
                          paidNum < totalAmount ? 'text-red-400' : 'text-emerald-400'
                        }`}
                      >
                        {paidNum < totalAmount ? 'Falta dinero' : `Bs. ${changeDue.toFixed(2)}`}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                className="w-full mt-2 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl shadow-lg shadow-red-950/50 flex items-center justify-center gap-2 text-sm transition-all active:scale-95 cursor-pointer"
              >
                <CheckCircle className="w-4 h-4" />
                Registrar Pedido y Enviar a Cocina
              </button>
            </div>
          )}
        </div>
      </div>

      {/* LUNCH SOUP CUSTOMIZER MODAL */}
      {soupModalOpen && pendingLunchDish && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                  Elección de Entrada
                </span>
                <h3 className="text-lg font-bold text-white">
                  ¿Qué sopa desea para el almuerzo?
                </h3>
              </div>
              <span className="text-2xl">🍲</span>
            </div>

            <p className="text-xs text-stone-400">
              El Almuerzo Ejecutivo incluye una entrada caliente a elección. Selecciona la opción preferida por el comensal:
            </p>

            <div className="space-y-2">
              {SOUP_OPTIONS.map((soup) => (
                <label
                  key={soup.id}
                  onClick={() => setSelectedSoup(soup.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedSoup === soup.id
                      ? 'bg-amber-500/10 border-amber-500 text-white'
                      : 'bg-stone-950 border-stone-800 text-stone-300 hover:border-stone-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="soupOption"
                    checked={selectedSoup === soup.id}
                    onChange={() => setSelectedSoup(soup.id)}
                    className="accent-amber-500"
                  />
                  <div className="flex-1">
                    <div className="font-bold text-sm flex items-center gap-2">
                      <span>{soup.icon}</span>
                      <span>{soup.name}</span>
                    </div>
                    <div className="text-[11px] text-stone-400">{soup.desc}</div>
                  </div>
                </label>
              ))}
            </div>

            <div>
              <label className="text-xs text-stone-300 font-medium block mb-1">
                Nota adicional para cocina (opcional):
              </label>
              <input
                type="text"
                value={lunchNotes}
                onChange={(e) => setLunchNotes(e.target.value)}
                placeholder="Ej. Sopa bien caliente, sin cebolla, etc."
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-200 placeholder:text-stone-600 focus:outline-hidden focus:border-amber-500"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setSoupModalOpen(false)}
                className="flex-1 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold rounded-xl cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmLunchSoup}
                className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold rounded-xl cursor-pointer shadow-md"
              >
                Confirmar y Agregar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SAUCE SELECTOR MODAL FOR WINGS */}
      {sauceModalOpen && pendingSauceDish && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-red-400 uppercase tracking-wider block">
                  Alitas de Pollo
                </span>
                <h3 className="text-lg font-bold text-white">Selecciona la salsa</h3>
              </div>
              <span className="text-2xl">🍗</span>
            </div>

            <div className="space-y-2">
              {['BBQ Ahumada', 'Picante Especial (Spicy)', 'Miel y Mostaza', 'Salsa Aparte / Mixta'].map(
                (sauce) => (
                  <label
                    key={sauce}
                    onClick={() => setSelectedSauce(sauce)}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      selectedSauce === sauce
                        ? 'bg-red-500/10 border-red-500 text-white'
                        : 'bg-stone-950 border-stone-800 text-stone-300 hover:border-stone-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="sauceOption"
                      checked={selectedSauce === sauce}
                      onChange={() => setSelectedSauce(sauce)}
                      className="accent-red-500"
                    />
                    <span className="font-bold text-sm">{sauce}</span>
                  </label>
                )
              )}
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setSauceModalOpen(false)}
                className="flex-1 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold rounded-xl cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmSauce}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl cursor-pointer shadow-md"
              >
                Confirmar Alitas
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RECEIPT / TICKET MODAL */}
      {lastCreatedOrder && (
        <ReceiptModal order={lastCreatedOrder} onClose={() => setLastCreatedOrder(null)} />
      )}
    </div>
  );
};
