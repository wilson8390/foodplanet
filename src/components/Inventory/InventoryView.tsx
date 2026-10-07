import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { Ingredient } from '../../types/restaurant';
import {
  Package,
  Plus,
  AlertTriangle,
  History,
  TrendingUp,
  DollarSign,
  Search,
  CheckCircle,
  X,
  Edit2,
} from 'lucide-react';

export const InventoryView: React.FC = () => {
  const {
    ingredients,
    lowStockIngredients,
    replenishStock,
    adjustStock,
    addIngredient,
    updateIngredient,
    inventoryLogs,
  } = useRestaurant();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('todos');
  const [activeTab, setActiveTab] = useState<'stock' | 'logs'>('stock');

  // Modals state
  const [replenishModalOpen, setReplenishModalOpen] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  const [replenishAmount, setReplenishAmount] = useState<string>('');
  const [replenishCost, setReplenishCost] = useState<string>('');
  const [replenishReason, setReplenishReason] = useState<string>('Compra de reabastecimiento');

  const [adjustModalOpen, setAdjustModalOpen] = useState(false);
  const [adjustNewStock, setAdjustNewStock] = useState<string>('');
  const [adjustReason, setAdjustReason] = useState<string>('Merma / Conteo físico');

  const [newIngredientModalOpen, setNewIngredientModalOpen] = useState(false);
  const [newIngName, setNewIngName] = useState('');
  const [newIngUnit, setNewIngUnit] = useState<Ingredient['unit']>('kg');
  const [newIngStock, setNewIngStock] = useState('10');
  const [newIngMinStock, setNewIngMinStock] = useState('3');
  const [newIngCost, setNewIngCost] = useState('20');
  const [newIngCategory, setNewIngCategory] = useState<Ingredient['category']>('carnes');

  // Total Inventory Valuation in Bs.
  const totalValuation = ingredients.reduce(
    (acc, item) => acc + item.currentStock * item.costPerUnit,
    0
  );

  const filteredIngredients = ingredients.filter((ing) => {
    const matchesSearch = ing.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'todos' || ing.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleOpenReplenish = (ing: Ingredient) => {
    setSelectedIngredient(ing);
    setReplenishAmount('5');
    setReplenishCost(ing.costPerUnit.toString());
    setReplenishReason('Compra de reabastecimiento');
    setReplenishModalOpen(true);
  };

  const handleConfirmReplenish = () => {
    if (!selectedIngredient) return;
    const amt = parseFloat(replenishAmount);
    const cost = parseFloat(replenishCost);
    if (amt > 0) {
      replenishStock(selectedIngredient.id, amt, cost > 0 ? cost : undefined, replenishReason);
      setReplenishModalOpen(false);
      setSelectedIngredient(null);
    }
  };

  const handleOpenAdjust = (ing: Ingredient) => {
    setSelectedIngredient(ing);
    setAdjustNewStock(ing.currentStock.toString());
    setAdjustReason('Merma / Ajuste de peso');
    setAdjustModalOpen(true);
  };

  const handleConfirmAdjust = () => {
    if (!selectedIngredient) return;
    const stock = parseFloat(adjustNewStock);
    if (!isNaN(stock) && stock >= 0) {
      adjustStock(selectedIngredient.id, stock, adjustReason);
      setAdjustModalOpen(false);
      setSelectedIngredient(null);
    }
  };

  const handleCreateIngredient = () => {
    if (!newIngName.trim()) return;
    addIngredient({
      name: newIngName.trim(),
      unit: newIngUnit,
      currentStock: parseFloat(newIngStock) || 0,
      minStock: parseFloat(newIngMinStock) || 0,
      costPerUnit: parseFloat(newIngCost) || 0,
      category: newIngCategory,
    });
    setNewIngredientModalOpen(false);
    setNewIngName('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & KPI Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* KPI 1: Insumos Totales */}
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-xs text-stone-400 font-bold uppercase tracking-wider block">
              Insumos Registrados
            </span>
            <div className="text-2xl font-black text-white mt-1 font-mono">
              {ingredients.length} artículos
            </div>
            <span className="text-[11px] text-stone-500 mt-0.5 block">
              Control de recetas y mermas
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-stone-800 text-amber-400 flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 2: Valorización */}
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-xs text-stone-400 font-bold uppercase tracking-wider block">
              Valor del Inventario
            </span>
            <div className="text-2xl font-black text-amber-400 mt-1 font-mono">
              Bs. {totalValuation.toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <span className="text-[11px] text-stone-500 mt-0.5 block">
              Costo acumulado en almacén
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 3: Stock Crítico */}
        <div
          className={`border rounded-2xl p-5 shadow-lg flex items-center justify-between transition-colors ${
            lowStockIngredients.length > 0
              ? 'bg-red-950/20 border-red-800/60'
              : 'bg-stone-900 border-stone-800'
          }`}
        >
          <div>
            <span className="text-xs text-stone-400 font-bold uppercase tracking-wider block">
              Alertas de Stock Crítico
            </span>
            <div
              className={`text-2xl font-black mt-1 font-mono ${
                lowStockIngredients.length > 0 ? 'text-red-400' : 'text-emerald-400'
              }`}
            >
              {lowStockIngredients.length} insumos bajos
            </div>
            <span className="text-[11px] text-stone-400 mt-0.5 block">
              {lowStockIngredients.length > 0
                ? 'Requieren compra inmediata'
                : 'Inventario en niveles óptimos'}
            </span>
          </div>
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              lowStockIngredients.length > 0
                ? 'bg-red-600/20 text-red-400'
                : 'bg-emerald-600/20 text-emerald-400'
            }`}
          >
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Control Header & Tabs */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Tab switchers */}
        <div className="flex items-center gap-1 bg-stone-950 p-1 rounded-xl border border-stone-800 text-xs font-semibold w-full md:w-auto">
          <button
            onClick={() => setActiveTab('stock')}
            className={`flex-1 md:flex-initial px-4 py-2 rounded-lg transition-all cursor-pointer ${
              activeTab === 'stock'
                ? 'bg-amber-500 text-stone-950 font-bold shadow-md'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            Almacén & Existencias ({ingredients.length})
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`flex-1 md:flex-initial px-4 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'logs'
                ? 'bg-amber-500 text-stone-950 font-bold shadow-md'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            Movimientos & Auditoría ({inventoryLogs.length})
          </button>
        </div>

        {/* Action button */}
        <button
          onClick={() => setNewIngredientModalOpen(true)}
          className="w-full md:w-auto px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Registrar Nuevo Insumo
        </button>
      </div>

      {/* TAB 1: STOCK VIEW */}
      {activeTab === 'stock' && (
        <div className="space-y-4">
          {/* Filters & Search */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar insumo (carne, papas, maní, pollo, etc.)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-stone-900 border border-stone-800 rounded-xl pl-10 pr-4 py-2 text-xs text-stone-100 placeholder:text-stone-500 focus:outline-hidden focus:border-amber-500"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none text-xs">
              {[
                { id: 'todos', label: 'Todos' },
                { id: 'carnes', label: '🥩 Carnes' },
                { id: 'granos_secos', label: '🌾 Granos & Maní' },
                { id: 'verduras', label: '🥔 Papas & Verduras' },
                { id: 'panaderia', label: '🥖 Panes' },
                { id: 'lacteos', label: '🧀 Quesos' },
                { id: 'abarrotes', label: '🍳 Abarrotes' },
                { id: 'salsas', label: '🥫 Salsas' },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setFilterCategory(c.id)}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap cursor-pointer ${
                    filterCategory === c.id
                      ? 'bg-amber-500 text-stone-950 font-bold'
                      : 'bg-stone-900 border border-stone-800 text-stone-300 hover:bg-stone-800'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Table of items */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-950 text-stone-400 uppercase font-semibold border-b border-stone-800">
                  <tr>
                    <th className="px-4 py-3">Insumo</th>
                    <th className="px-4 py-3">Categoría</th>
                    <th className="px-4 py-3">Stock Actual</th>
                    <th className="px-4 py-3">Stock Mínimo</th>
                    <th className="px-4 py-3">Costo Unitario</th>
                    <th className="px-4 py-3">Valor Total</th>
                    <th className="px-4 py-3">Estado</th>
                    <th className="px-4 py-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/80">
                  {filteredIngredients.map((ing) => {
                    const isLow = ing.currentStock <= ing.minStock;
                    const stockValuation = ing.currentStock * ing.costPerUnit;

                    return (
                      <tr
                        key={ing.id}
                        className={`hover:bg-stone-850/60 transition-colors ${
                          isLow ? 'bg-red-950/10' : ''
                        }`}
                      >
                        <td className="px-4 py-3 font-bold text-stone-100">
                          {ing.name}
                        </td>
                        <td className="px-4 py-3 text-stone-400 capitalize">
                          {ing.category.replace('_', ' ')}
                        </td>
                        <td className="px-4 py-3 font-mono font-bold text-sm">
                          <span
                            className={isLow ? 'text-red-400 font-black' : 'text-stone-100'}
                          >
                            {ing.currentStock.toFixed(2)} {ing.unit}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-mono text-stone-400">
                          {ing.minStock.toFixed(2)} {ing.unit}
                        </td>
                        <td className="px-4 py-3 font-mono text-stone-300">
                          Bs. {ing.costPerUnit.toFixed(2)} / {ing.unit}
                        </td>
                        <td className="px-4 py-3 font-mono font-semibold text-amber-400">
                          Bs. {stockValuation.toFixed(2)}
                        </td>
                        <td className="px-4 py-3">
                          {isLow ? (
                            <span className="text-red-400 font-bold flex items-center gap-1">
                              <AlertTriangle className="w-3.5 h-3.5" /> ¡Bajo Stock!
                            </span>
                          ) : (
                            <span className="text-emerald-400 font-medium flex items-center gap-1">
                              <CheckCircle className="w-3.5 h-3.5" /> Abundante
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenReplenish(ing)}
                              className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-lg text-[11px] cursor-pointer transition-colors shadow-xs"
                              title="Reabastecer stock"
                            >
                              + Reabastecer
                            </button>
                            <button
                              onClick={() => handleOpenAdjust(ing)}
                              className="px-2 py-1 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg text-[11px] cursor-pointer transition-colors"
                              title="Ajustar merma o cantidad"
                            >
                              Merma
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: AUDIT LOGS */}
      {activeTab === 'logs' && (
        <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 bg-stone-950 border-b border-stone-800 flex items-center justify-between">
            <h3 className="font-bold text-sm text-stone-200">
              Historial de Consumo, Ventas y Reabastecimiento
            </h3>
            <span className="text-xs text-stone-400">
              Registrado automáticamente por comanda
            </span>
          </div>

          <div className="divide-y divide-stone-800/80 max-h-96 overflow-y-auto">
            {inventoryLogs.length === 0 ? (
              <div className="text-center py-12 text-stone-500 text-xs">
                No hay movimientos registrados todavía. Las ventas del POS deducirán ingredientes automáticamente.
              </div>
            ) : (
              inventoryLogs.map((log) => {
                const isDeduction = log.change < 0;
                const timeStr = new Date(log.timestamp).toLocaleString('es-BO', {
                  dateStyle: 'short',
                  timeStyle: 'short',
                });

                return (
                  <div
                    key={log.id}
                    className="p-3.5 flex items-center justify-between text-xs hover:bg-stone-850/50"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold font-mono ${
                          isDeduction
                            ? 'bg-red-500/10 text-red-400'
                            : 'bg-emerald-500/10 text-emerald-400'
                        }`}
                      >
                        {isDeduction ? '-' : '+'}
                      </div>
                      <div>
                        <div className="font-bold text-stone-200">
                          {log.ingredientName}
                        </div>
                        <div className="text-[11px] text-stone-400">
                          {log.reason || log.type} · {timeStr}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span
                        className={`font-mono font-bold text-sm ${
                          isDeduction ? 'text-red-400' : 'text-emerald-400'
                        }`}
                      >
                        {log.change > 0 ? `+${log.change}` : log.change}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* MODAL: REPLENISH STOCK */}
      {replenishModalOpen && selectedIngredient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                  Reabastecer Insumo
                </span>
                <h3 className="text-lg font-bold text-white">
                  {selectedIngredient.name}
                </h3>
              </div>
              <button
                onClick={() => setReplenishModalOpen(false)}
                className="text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-stone-950 p-3 rounded-xl border border-stone-800 text-xs space-y-1">
              <div className="flex justify-between text-stone-400">
                <span>Stock Actual:</span>
                <span className="font-mono text-white font-bold">
                  {selectedIngredient.currentStock} {selectedIngredient.unit}
                </span>
              </div>
              <div className="flex justify-between text-stone-400">
                <span>Stock Mínimo Requerido:</span>
                <span className="font-mono text-amber-400">
                  {selectedIngredient.minStock} {selectedIngredient.unit}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-stone-300 font-medium block mb-1">
                  Cantidad a ingresar ({selectedIngredient.unit}):
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.1"
                  value={replenishAmount}
                  onChange={(e) => setReplenishAmount(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-sm font-mono text-white focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs text-stone-300 font-medium block mb-1">
                  Costo de compra (Bs. por {selectedIngredient.unit}):
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={replenishCost}
                  onChange={(e) => setReplenishCost(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-sm font-mono text-white focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs text-stone-300 font-medium block mb-1">
                  Proveedor / Motivo:
                </label>
                <input
                  type="text"
                  value={replenishReason}
                  onChange={(e) => setReplenishReason(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-amber-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setReplenishModalOpen(false)}
                className="flex-1 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold rounded-xl cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmReplenish}
                className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold rounded-xl cursor-pointer shadow-md"
              >
                Confirmar Ingreso
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADJUST MERMA */}
      {adjustModalOpen && selectedIngredient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-red-400 uppercase tracking-wider block">
                  Ajustar Existencia / Merma
                </span>
                <h3 className="text-lg font-bold text-white">
                  {selectedIngredient.name}
                </h3>
              </div>
              <button
                onClick={() => setAdjustModalOpen(false)}
                className="text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-stone-300 font-medium block mb-1">
                  Nuevo Stock Físico Real ({selectedIngredient.unit}):
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={adjustNewStock}
                  onChange={(e) => setAdjustNewStock(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-sm font-mono text-white focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs text-stone-300 font-medium block mb-1">
                  Motivo del ajuste / Merma:
                </label>
                <input
                  type="text"
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  placeholder="Ej. Merma de corte, desperdicio, etc."
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-amber-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setAdjustModalOpen(false)}
                className="flex-1 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold rounded-xl cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmAdjust}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl cursor-pointer shadow-md"
              >
                Guardar Ajuste
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CREATE INGREDIENT */}
      {newIngredientModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">
                Registrar Nuevo Insumo
              </h3>
              <button
                onClick={() => setNewIngredientModalOpen(false)}
                className="text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-stone-300 font-medium block mb-1">
                  Nombre del Insumo:
                </label>
                <input
                  type="text"
                  placeholder="Ej. Pechuga de pavo, Salsa tártara"
                  value={newIngName}
                  onChange={(e) => setNewIngName(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-stone-300 font-medium block mb-1">
                    Unidad de Medida:
                  </label>
                  <select
                    value={newIngUnit}
                    onChange={(e) => setNewIngUnit(e.target.value as any)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-amber-500"
                  >
                    <option value="kg">Kilogramos (kg)</option>
                    <option value="unidad">Unidades (u)</option>
                    <option value="litro">Litros (l)</option>
                    <option value="g">Gramos (g)</option>
                    <option value="ml">Mililitros (ml)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-stone-300 font-medium block mb-1">
                    Categoría:
                  </label>
                  <select
                    value={newIngCategory}
                    onChange={(e) => setNewIngCategory(e.target.value as any)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-amber-500"
                  >
                    <option value="carnes">Carnes</option>
                    <option value="granos_secos">Granos / Maní</option>
                    <option value="verduras">Verduras / Papas</option>
                    <option value="panaderia">Panadería</option>
                    <option value="lacteos">Lácteos / Quesos</option>
                    <option value="salsas">Salsas</option>
                    <option value="abarrotes">Abarrotes</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs text-stone-300 font-medium block mb-1">
                    Stock Inicial:
                  </label>
                  <input
                    type="number"
                    value={newIngStock}
                    onChange={(e) => setNewIngStock(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-hidden focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-stone-300 font-medium block mb-1">
                    Stock Mínimo:
                  </label>
                  <input
                    type="number"
                    value={newIngMinStock}
                    onChange={(e) => setNewIngMinStock(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-hidden focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-stone-300 font-medium block mb-1">
                    Costo (Bs.):
                  </label>
                  <input
                    type="number"
                    value={newIngCost}
                    onChange={(e) => setNewIngCost(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-hidden focus:border-amber-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setNewIngredientModalOpen(false)}
                className="flex-1 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold rounded-xl cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateIngredient}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl cursor-pointer shadow-md"
              >
                Registrar Insumo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
