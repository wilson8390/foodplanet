import React from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { OrderStatus } from '../../types/restaurant';
import { Clock, CheckCircle2, ChefHat, Bell, AlertTriangle } from 'lucide-react';

export const KitchenView: React.FC = () => {
  const { orders, updateOrderStatus } = useRestaurant();

  // Active tickets for the kitchen
  const kitchenOrders = orders.filter(
    (o) => o.status === 'pendiente' || o.status === 'preparando' || o.status === 'listo'
  );

  const getElapsedTime = (isoString: string) => {
    const diffMs = Date.now() - new Date(isoString).getTime();
    const mins = Math.floor(diffMs / 60000);
    return mins < 1 ? 'Hace un instante' : `${mins} min`;
  };

  const getMinutesCount = (isoString: string) => {
    const diffMs = Date.now() - new Date(isoString).getTime();
    return Math.floor(diffMs / 60000);
  };

  return (
    <div className="space-y-6">
      {/* Top Kitchen Bar */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <ChefHat className="w-4 h-4" />
            Kitchen Display System (KDS)
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Comandas de Cocina en Vivo
          </h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Monitoreo en tiempo real de pedidos entrantes, tiempos de cocción y especificaciones de comensales.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold">
          <div className="px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1.5">
            <Bell className="w-3.5 h-3.5 animate-pulse" />
            {kitchenOrders.length} Comandas Activas
          </div>
        </div>
      </div>

      {/* Orders Grid */}
      {kitchenOrders.length === 0 ? (
        <div className="text-center py-20 bg-stone-900/50 rounded-3xl border border-dashed border-stone-800">
          <ChefHat className="w-12 h-12 text-stone-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-stone-300">¡Cocina al día!</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1">
            No hay órdenes pendientes en este momento. Las nuevas comandas desde el POS aparecerán aquí al instante.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {kitchenOrders.map((order) => {
            const minutes = getMinutesCount(order.createdAt);
            const isLate = minutes >= 15;

            return (
              <div
                key={order.id}
                className={`bg-stone-900 rounded-2xl border transition-all flex flex-col justify-between overflow-hidden shadow-xl ${
                  order.status === 'listo'
                    ? 'border-emerald-500/40 ring-1 ring-emerald-500/30'
                    : order.status === 'preparando'
                    ? 'border-amber-500/50'
                    : isLate
                    ? 'border-red-500/80 ring-2 ring-red-500/30'
                    : 'border-stone-800'
                }`}
              >
                {/* Header of Ticket */}
                <div
                  className={`p-3.5 border-b flex items-center justify-between ${
                    order.status === 'listo'
                      ? 'bg-emerald-950/40 border-emerald-900/50'
                      : order.status === 'preparando'
                      ? 'bg-amber-950/30 border-amber-900/40'
                      : 'bg-stone-950 border-stone-800'
                  }`}
                >
                  <div>
                    <span className="font-mono font-black text-sm text-white">
                      #{order.orderNumber}
                    </span>
                    <span className="text-xs font-bold text-amber-400 ml-2">
                      {order.type === 'mesa' ? order.tableNumber || 'Mesa' : order.type.toUpperCase()}
                    </span>
                  </div>

                  <div
                    className={`flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-lg ${
                      isLate
                        ? 'bg-red-500 text-white font-bold animate-pulse'
                        : 'bg-stone-800 text-stone-300'
                    }`}
                  >
                    <Clock className="w-3 h-3" />
                    <span>{getElapsedTime(order.createdAt)}</span>
                  </div>
                </div>

                {/* Body: Items & Specifications */}
                <div className="p-4 flex-1 space-y-3">
                  <div className="text-[11px] text-stone-400 font-medium">
                    Cliente: <strong className="text-stone-200">{order.customerName}</strong>
                  </div>

                  <div className="space-y-2.5">
                    {order.items.map((it, idx) => (
                      <div
                        key={idx}
                        className="bg-stone-950/70 p-2.5 rounded-xl border border-stone-800/80"
                      >
                        <div className="flex items-start justify-between">
                          <span className="text-xs font-black text-white leading-tight">
                            <span className="text-amber-400 font-mono text-sm mr-1">
                              {it.quantity}x
                            </span>
                            {it.dishName}
                          </span>
                        </div>

                        {/* SPECIFIED SOUPS (Crucial for user request!) */}
                        {it.selectedSoup && (
                          <div className="mt-1.5 p-1.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-[11px] text-amber-300 font-bold flex items-center gap-1.5">
                            <span>🍲 Entrada:</span>
                            <span>
                              {it.selectedSoup === 'mani'
                                ? 'Sopa de Maní (Papas Hilo)'
                                : it.selectedSoup === 'arroz'
                                ? 'Sopa de Arroz con Verduras'
                                : it.selectedSoup === 'fideo'
                                ? 'Sopa de Fideo Tostado'
                                : 'Sopa de Avena Nutritiva'}
                            </span>
                          </div>
                        )}

                        {it.selectedSauce && (
                          <div className="mt-1 p-1 rounded-md bg-red-500/15 border border-red-500/20 text-[10px] text-red-300 font-bold">
                            🍗 Salsa: {it.selectedSauce}
                          </div>
                        )}

                        {it.notes && (
                          <div className="mt-1 text-[10px] text-stone-400 italic flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />
                            <span>{it.notes}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Action Buttons */}
                <div className="p-3 bg-stone-950 border-t border-stone-800">
                  {order.status === 'pendiente' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'preparando')}
                      className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-95"
                    >
                      <ChefHat className="w-3.5 h-3.5" />
                      Empezar a Cocinar
                    </button>
                  )}

                  {order.status === 'preparando' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'listo')}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-95"
                    >
                      <Bell className="w-3.5 h-3.5" />
                      ¡Plato Listo para Servir!
                    </button>
                  )}

                  {order.status === 'listo' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'entregado')}
                      className="w-full py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      Entregado a Mesa / Cliente
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
