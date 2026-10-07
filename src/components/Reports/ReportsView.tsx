import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { Order } from '../../types/restaurant';
import {
  DollarSign,
  TrendingUp,
  ShoppingBag,
  Award,
  Calendar,
  Printer,
  RotateCcw,
} from 'lucide-react';
import { ReceiptModal } from '../ReceiptModal';

export const ReportsView: React.FC = () => {
  const { orders, dishes, resetToInitialData } = useRestaurant();
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState<Order | null>(null);

  // Sales totals
  const totalSales = orders.reduce((acc, o) => acc + o.total, 0);
  const totalOrders = orders.length;
  const avgTicket = totalOrders > 0 ? totalSales / totalOrders : 0;

  // Breakdown by payment method
  const salesByPayment = orders.reduce((acc, o) => {
    acc[o.paymentMethod] = (acc[o.paymentMethod] || 0) + o.total;
    return acc;
  }, {} as Record<string, number>);

  // Dish sales ranking
  const dishSalesMap: Record<string, { name: string; count: number; totalRev: number }> = {};
  orders.forEach((o) => {
    o.items.forEach((it) => {
      if (!dishSalesMap[it.dishId]) {
        dishSalesMap[it.dishId] = {
          name: it.dishName,
          count: 0,
          totalRev: 0,
        };
      }
      dishSalesMap[it.dishId].count += it.quantity;
      dishSalesMap[it.dishId].totalRev += it.price * it.quantity;
    });
  });

  const rankedDishes = Object.values(dishSalesMap).sort((a, b) => b.count - a.count);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <TrendingUp className="w-4 h-4" />
            Caja Registradora & Finanzas
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Reportes de Ventas y Rendimiento
          </h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Métricas acumuladas del día, platos más vendidos y distribución de ingresos por canal.
          </p>
        </div>

        <button
          onClick={() => {
            if (window.confirm('¿Deseas reiniciar los datos a la configuración inicial demo de Food Planet?')) {
              resetToInitialData();
            }
          }}
          className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 font-medium rounded-xl text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Restaurar Datos Iniciales
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-xs text-stone-400 font-bold uppercase tracking-wider block">
              Ventas Totales
            </span>
            <div className="text-3xl font-black text-amber-400 mt-1 font-mono">
              Bs. {totalSales.toFixed(2)}
            </div>
            <span className="text-[11px] text-stone-500 mt-0.5 block">
              Ingresos brutos facturados
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-xs text-stone-400 font-bold uppercase tracking-wider block">
              Comandas Procesadas
            </span>
            <div className="text-3xl font-black text-white mt-1 font-mono">
              {totalOrders} pedidos
            </div>
            <span className="text-[11px] text-stone-500 mt-0.5 block">
              Órdenes de mesa y para llevar
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-stone-800 text-stone-200 flex items-center justify-center">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-xs text-stone-400 font-bold uppercase tracking-wider block">
              Ticket Promedio
            </span>
            <div className="text-3xl font-black text-white mt-1 font-mono">
              Bs. {avgTicket.toFixed(2)}
            </div>
            <span className="text-[11px] text-stone-500 mt-0.5 block">
              Gasto medio por cliente
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-stone-800 text-amber-400 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Platos más vendidos (7 cols) */}
        <div className="lg:col-span-7 bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-800">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              Ranking de Platos Más Vendidos
            </h3>
            <span className="text-xs text-stone-400 font-mono">
              {rankedDishes.length} platos con salida
            </span>
          </div>

          <div className="space-y-2.5">
            {rankedDishes.length === 0 ? (
              <div className="text-center py-10 text-stone-500 text-xs">
                No hay ventas registradas aún.
              </div>
            ) : (
              rankedDishes.map((dish, idx) => (
                <div
                  key={dish.name}
                  className="bg-stone-950 p-3 rounded-xl border border-stone-800/80 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-6 h-6 rounded-lg font-mono font-bold flex items-center justify-center text-xs ${
                        idx === 0
                          ? 'bg-amber-500 text-stone-950'
                          : idx === 1
                          ? 'bg-stone-300 text-stone-950'
                          : idx === 2
                          ? 'bg-amber-800 text-white'
                          : 'bg-stone-800 text-stone-400'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <div>
                      <div className="font-bold text-white text-sm">{dish.name}</div>
                      <div className="text-stone-400 text-[11px]">
                        {dish.count} porciones servidas
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-mono font-bold text-amber-400 text-sm">
                      Bs. {dish.totalRev.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Métodos de Pago & Resumen (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-xl space-y-4">
            <h3 className="font-bold text-white text-base pb-3 border-b border-stone-800">
              Ingresos por Método de Pago
            </h3>

            <div className="space-y-3">
              {[
                { key: 'efectivo', label: '💵 Efectivo', amount: salesByPayment.efectivo || 0 },
                { key: 'qr', label: '📱 QR Simple', amount: salesByPayment.qr || 0 },
                { key: 'tarjeta', label: '💳 Tarjeta Débito/Crédito', amount: salesByPayment.tarjeta || 0 },
              ].map((p) => {
                const percent = totalSales > 0 ? (p.amount / totalSales) * 100 : 0;

                return (
                  <div key={p.key} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-stone-300 font-medium">{p.label}</span>
                      <span className="font-mono font-bold text-white">
                        Bs. {p.amount.toFixed(2)} ({percent.toFixed(0)}%)
                      </span>
                    </div>
                    <div className="w-full bg-stone-950 h-2 rounded-full overflow-hidden border border-stone-800">
                      <div
                        className="bg-amber-500 h-full rounded-full transition-all"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Historial de Ventas / Tickets */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 bg-stone-950 border-b border-stone-800 flex items-center justify-between">
          <h3 className="font-bold text-sm text-stone-200">
            Registro Histórico de Tickets & Ventas
          </h3>
          <span className="text-xs text-stone-400">
            Haz clic en "Ver Ticket" para reimprimir comprobante
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-950 text-stone-400 uppercase font-semibold border-b border-stone-800">
              <tr>
                <th className="px-4 py-3"># Orden</th>
                <th className="px-4 py-3">Hora</th>
                <th className="px-4 py-3">Tipo / Mesa</th>
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">Detalle Platos</th>
                <th className="px-4 py-3">Método</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3 text-right">Comprobante</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/80">
              {orders.map((ord) => {
                const timeStr = new Date(ord.createdAt).toLocaleTimeString('es-BO', {
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <tr key={ord.id} className="hover:bg-stone-850/60 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-white">
                      #{ord.orderNumber}
                    </td>
                    <td className="px-4 py-3 text-stone-400 font-mono">
                      {timeStr}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-bold text-amber-400">
                        {ord.type === 'mesa' ? ord.tableNumber || 'Mesa' : ord.type.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-stone-300 font-medium">
                      {ord.customerName}
                    </td>
                    <td className="px-4 py-3 text-stone-300 max-w-xs truncate">
                      {ord.items.map((it) => `${it.quantity}x ${it.dishName}`).join(', ')}
                    </td>
                    <td className="px-4 py-3 uppercase text-stone-400 font-mono text-[11px]">
                      {ord.paymentMethod}
                    </td>
                    <td className="px-4 py-3 font-mono font-black text-amber-400 text-sm">
                      Bs. {ord.total.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setSelectedReceiptOrder(ord)}
                        className="px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg text-[11px] font-semibold flex items-center gap-1 ml-auto cursor-pointer transition-colors"
                      >
                        <Printer className="w-3 h-3" />
                        Ticket
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {selectedReceiptOrder && (
        <ReceiptModal
          order={selectedReceiptOrder}
          onClose={() => setSelectedReceiptOrder(null)}
        />
      )}
    </div>
  );
};
