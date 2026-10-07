import React from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { FoodPlanetLogo } from './FoodPlanetLogo';
import {
  FileText,
  ShoppingCart,
  ChefHat,
  Package,
  UtensilsCrossed,
  BarChart3,
  AlertTriangle,
  Monitor,
  Smartphone,
} from 'lucide-react';

export type ActiveTab = 'menu_sheet' | 'pos' | 'kitchen' | 'inventory' | 'dishes' | 'reports';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenWindowsInstaller: () => void;
  onOpenAndroidInstaller: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenWindowsInstaller,
  onOpenAndroidInstaller,
}) => {
  const { lowStockIngredients, activeOrders } = useRestaurant();

  const navItems = [
    {
      id: 'menu_sheet' as ActiveTab,
      label: 'Hoja de Menú',
      icon: FileText,
      badge: 'Imprimible',
    },
    {
      id: 'pos' as ActiveTab,
      label: 'Punto de Venta (POS)',
      icon: ShoppingCart,
    },
    {
      id: 'kitchen' as ActiveTab,
      label: 'Cocina en Vivo',
      icon: ChefHat,
      count: activeOrders.length,
    },
    {
      id: 'inventory' as ActiveTab,
      label: 'Inventario',
      icon: Package,
      alert: lowStockIngredients.length > 0 ? lowStockIngredients.length : undefined,
    },
    {
      id: 'dishes' as ActiveTab,
      label: 'Crear / Editar Platos',
      icon: UtensilsCrossed,
    },
    {
      id: 'reports' as ActiveTab,
      label: 'Caja & Reportes',
      icon: BarChart3,
    },
  ];

  return (
    <header className="no-print sticky top-0 z-40 bg-stone-950/90 backdrop-blur-md border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo & Brand */}
          <div
            onClick={() => setActiveTab('menu_sheet')}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <FoodPlanetLogo size="sm" showSubtitle={false} variant="dark" />
            <div className="hidden sm:block border-l border-stone-800 pl-3">
              <span className="text-xs font-black text-white tracking-wider block uppercase font-mono">
                Food Planet POS
              </span>
              <span className="text-[10px] text-stone-400 block">
                Comida Rápida & Almuerzos
              </span>
            </div>
          </div>

          {/* Navigation Items (Desktop & Tablet) */}
          <nav className="hidden lg:flex items-center gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    isActive
                      ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20'
                      : 'text-stone-300 hover:text-white hover:bg-stone-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>

                  {item.badge && !isActive && (
                    <span className="text-[9px] uppercase px-1.5 py-0.2 rounded-md bg-stone-800 text-amber-400 font-extrabold border border-stone-700">
                      {item.badge}
                    </span>
                  )}

                  {typeof item.count === 'number' && item.count > 0 && (
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-black ${
                        isActive
                          ? 'bg-stone-950 text-amber-400'
                          : 'bg-amber-500 text-stone-950'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}

                  {item.alert && (
                    <span className="flex items-center text-[10px] bg-red-600 text-white px-1.5 py-0.2 rounded-full font-bold animate-pulse">
                      <AlertTriangle className="w-2.5 h-2.5 mr-0.5" />
                      {item.alert}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right status pills */}
          <div className="flex items-center gap-3">
            {lowStockIngredients.length > 0 && (
              <button
                onClick={() => setActiveTab('inventory')}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-950/40 border border-red-800/60 text-red-400 text-xs font-bold hover:bg-red-900/40 transition-colors cursor-pointer"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{lowStockIngredients.length} Insumos Bajos</span>
              </button>
            )}

            <button
              onClick={onOpenWindowsInstaller}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-950/50 border border-sky-700/60 text-sky-400 hover:text-sky-300 hover:bg-sky-900/50 text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95"
              title="Instalar Food Planet en PC con Windows"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Windows PC</span>
              <span className="lg:hidden">PC</span>
            </button>

            <button
              onClick={onOpenAndroidInstaller}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/50 border border-emerald-700/60 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-900/50 text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95"
              title="Instalar Food Planet en Android (APK / WebAPK)"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Android APK</span>
              <span className="sm:hidden">APK</span>
            </button>

            <a
              href="https://wa.me/59162691600"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-400 text-xs font-bold hover:bg-emerald-900/40 transition-colors"
              title="Abrir WhatsApp y Delivery Food Planet"
            >
              <span>📱 WhatsApp y Delivery: +591 62691600</span>
            </a>

            <div className="text-right">
              <span className="text-[11px] font-mono font-bold text-amber-400 block">
                11:00 AM - 21:00 PM
              </span>
              <span className="text-[10px] text-stone-400 block truncate max-w-[140px]">
                Diego Bazan #560
              </span>
            </div>
          </div>
        </div>

        {/* Mobile / Tablet Horizontal Navigation Scroll */}
        <div className="lg:hidden flex items-center gap-1.5 overflow-x-auto pb-3 scrollbar-none text-xs">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-amber-500 text-stone-950 shadow-sm'
                    : 'bg-stone-900 text-stone-300 hover:bg-stone-850 border border-stone-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
                {typeof item.count === 'number' && item.count > 0 && (
                  <span className="bg-stone-950 text-amber-400 text-[10px] px-1 rounded-full">
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
