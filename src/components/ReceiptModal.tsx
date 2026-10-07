import React from 'react';
import { Order } from '../types/restaurant';
import { FoodPlanetLogo } from './FoodPlanetLogo';
import { Printer, X, CheckCircle } from 'lucide-react';

interface ReceiptModalProps {
  order: Order;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ order, onClose }) => {
  const handlePrintReceipt = () => {
    window.print();
  };

  const formattedDate = new Date(order.createdAt).toLocaleString('es-BO', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-sm w-full p-5 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
        {/* Top Control Bar (hidden in print) */}
        <div className="no-print flex items-center justify-between pb-2 border-b border-stone-800">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
            <CheckCircle className="w-4 h-4" />
            ¡Pedido Registrado con Éxito!
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* THERMAL TICKET DESIGN */}
        <div
          id="printable-ticket"
          className="bg-white text-stone-900 p-5 rounded-2xl shadow-inner font-mono text-xs space-y-3 print:p-0 print:shadow-none"
        >
          {/* Logo */}
          <div className="flex flex-col items-center text-center pb-2 border-b border-dashed border-stone-300">
            <FoodPlanetLogo size="sm" showSubtitle={true} variant="light" />
            <span className="text-[10px] text-stone-700 font-bold mt-1">
              Calle Sgto. Mayor Diego Bazan #560
            </span>
            <span className="text-[9px] text-stone-600">
              WhatsApp y Delivery: +591 62691600 · 11:00 AM - 21:00 PM
            </span>
            <span className="text-[8px] text-stone-500 italic">
              «Sabores de otro planeta, sabores que te harán volver»
            </span>
          </div>

          {/* Order Details Header */}
          <div className="space-y-0.5 text-[11px] pb-2 border-b border-dashed border-stone-300">
            <div className="flex justify-between font-bold">
              <span>ORDEN #{order.orderNumber}</span>
              <span className="uppercase text-red-600">
                {order.type === 'mesa' ? order.tableNumber || 'MESA' : order.type.toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Cliente:</span>
              <span className="font-semibold text-stone-800">{order.customerName}</span>
            </div>
            <div className="flex justify-between text-stone-500 text-[10px]">
              <span>Fecha:</span>
              <span>{formattedDate}</span>
            </div>
          </div>

          {/* Items Table */}
          <div className="space-y-1.5 py-1 text-[11px]">
            <div className="flex justify-between font-bold text-stone-500 text-[10px] uppercase pb-0.5 border-b border-stone-200">
              <span>Cant. / Detalle</span>
              <span>Importe</span>
            </div>

            {order.items.map((it, idx) => (
              <div key={idx} className="flex justify-between items-start gap-1">
                <div className="flex-1">
                  <div className="font-bold">
                    {it.quantity}x {it.dishName}
                  </div>
                  {it.selectedSoup && (
                    <div className="text-[10px] text-amber-700 pl-2">
                      ↪ Sopa:{' '}
                      {it.selectedSoup === 'mani'
                        ? 'Maní'
                        : it.selectedSoup === 'arroz'
                        ? 'Arroz'
                        : it.selectedSoup === 'fideo'
                        ? 'Fideo'
                        : 'Avena'}
                    </div>
                  )}
                  {it.selectedSauce && (
                    <div className="text-[10px] text-red-700 pl-2">
                      ↪ Salsa: {it.selectedSauce}
                    </div>
                  )}
                  {it.notes && (
                    <div className="text-[9px] text-stone-500 pl-2 italic">
                      Nota: {it.notes}
                    </div>
                  )}
                </div>
                <div className="font-bold whitespace-nowrap">
                  Bs. {(it.price * it.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="pt-2 border-t border-dashed border-stone-300 space-y-1 text-xs">
            <div className="flex justify-between text-stone-600">
              <span>Subtotal:</span>
              <span>Bs. {order.subtotal.toFixed(2)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-red-600">
                <span>Descuento:</span>
                <span>-Bs. {order.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-black text-sm border-t border-stone-200 pt-1 text-stone-900">
              <span>TOTAL:</span>
              <span>Bs. {order.total.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-[10px] text-stone-600 pt-1">
              <span>Método:</span>
              <span className="uppercase font-semibold">{order.paymentMethod}</span>
            </div>

            {order.amountPaid && order.amountPaid > order.total && (
              <>
                <div className="flex justify-between text-[10px] text-stone-600">
                  <span>Pagó con:</span>
                  <span>Bs. {order.amountPaid.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[10px] font-bold text-emerald-800">
                  <span>Cambio:</span>
                  <span>Bs. {(order.change || 0).toFixed(2)}</span>
                </div>
              </>
            )}
          </div>

          {/* Ticket Footer */}
          <div className="pt-3 border-t border-dashed border-stone-300 text-center text-[10px] text-stone-500 space-y-0.5">
            <p className="font-bold text-stone-800">¡GRACIAS POR SU PREFERENCIA!</p>
            <p className="font-semibold text-stone-700 italic">«Sabores de otro planeta, sabores que te harán volver»</p>
          </div>
        </div>

        {/* Buttons (Hidden in print) */}
        <div className="no-print flex items-center gap-2 pt-1">
          <button
            onClick={handlePrintReceipt}
            className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg"
          >
            <Printer className="w-4 h-4" />
            Imprimir Ticket
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-300 font-semibold rounded-xl text-xs cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
