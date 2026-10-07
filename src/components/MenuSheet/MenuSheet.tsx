import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { FoodPlanetLogo } from '../FoodPlanetLogo';
import { Printer, Eye, Flame, Award, Phone, Clock, MapPin, Sparkles, Upload, Monitor, Smartphone } from 'lucide-react';
import { SOUP_OPTIONS } from '../../data/initialData';

interface MenuSheetProps {
  onOpenWindowsInstaller?: () => void;
  onOpenAndroidInstaller?: () => void;
}

export const MenuSheet: React.FC<MenuSheetProps> = ({
  onOpenWindowsInstaller,
  onOpenAndroidInstaller,
}) => {
  const { dishes } = useRestaurant();
  const [layoutMode, setLayoutMode] = useState<'digital' | 'print_preview'>('digital');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('todos');

  // Filter available dishes for the menu
  const menuDishes = dishes.filter((d) => d.isAvailable);

  const milanesas = menuDishes.filter((d) => d.category === 'milanesas');
  const comidaRapida = menuDishes.filter((d) => d.category === 'comida_rapida');
  const sandwiches = menuDishes.filter((d) => d.category === 'sandwiches');
  const almuerzos = menuDishes.filter((d) => d.category === 'almuerzos');
  const bebidas = menuDishes.filter((d) => d.category === 'bebidas');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Action Header - Hidden when printing */}
      <div className="no-print bg-stone-900 border border-stone-800 rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            Carta Oficial Imprimible & Digital
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Hoja de Menú Food Planet
          </h2>
          <p className="text-sm text-stone-400 mt-0.5">
            Menú optimizado para exhibición en mesa, mostrador, clientes o impresión física en alta calidad.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Layout Mode Selector */}
          <div className="bg-stone-800 p-1 rounded-xl flex items-center border border-stone-700/60 text-xs font-semibold">
            <button
              onClick={() => setLayoutMode('digital')}
              className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
                layoutMode === 'digital'
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-md'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              Vista Interactiva
            </button>
            <button
              onClick={() => setLayoutMode('print_preview')}
              className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
                layoutMode === 'print_preview'
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-md'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              <Printer className="w-3.5 h-3.5" />
              Hoja de Impresión
            </button>
          </div>

          {onOpenWindowsInstaller && (
            <button
              onClick={onOpenWindowsInstaller}
              className="px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-all cursor-pointer border border-stone-700"
              title="Instalar Food Planet como programa en Windows"
            >
              <Monitor className="w-4 h-4 text-sky-400" />
              <span>Instalar en PC Windows</span>
            </button>
          )}

          {onOpenAndroidInstaller && (
            <button
              onClick={onOpenAndroidInstaller}
              className="px-4 py-2.5 bg-emerald-950/40 hover:bg-emerald-900/40 text-emerald-300 font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-all cursor-pointer border border-emerald-700/60"
              title="Instalar Food Planet en celular o tablet Android (APK / WebAPK)"
            >
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span>Instalar en Android (APK)</span>
            </button>
          )}

          <button
            onClick={handlePrint}
            className="flex-1 md:flex-initial px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl shadow-lg shadow-red-950/40 flex items-center justify-center gap-2 text-sm transition-all active:scale-95 cursor-pointer border border-red-500/30"
          >
            <Printer className="w-4 h-4" />
            Imprimir Hoja de Menú
          </button>
        </div>
      </div>

      {/* FILTER TABS (Only in digital mode, hidden in print) */}
      {layoutMode === 'digital' && (
        <div className="no-print flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs font-semibold">
          {[
            { id: 'todos', label: 'Todo el Menú' },
            { id: 'milanesas', label: '🥩 Milanesas Especiales' },
            { id: 'sandwiches', label: '🥪 Sándwiches & Lomitos' },
            { id: 'comida_rapida', label: '🍗 Pollo a la Parrilla, Alitas & Pipocas' },
            { id: 'almuerzos', label: '🍲 Almuerzos & Sopas' },
            { id: 'bebidas', label: '🥤 Bebidas' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategoryFilter(cat.id)}
              className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                activeCategoryFilter === cat.id
                  ? 'bg-red-600 text-white font-bold shadow-md shadow-red-950/30'
                  : 'bg-stone-900 text-stone-300 hover:bg-stone-800 border border-stone-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      )}

      {/* 
        THE MENU SHEET CONTAINER:
        Designed to be stunning on screen and print cleanly on standard A4 or Letter sheet 
      */}
      <div
        id="printable-menu-sheet"
        className={`bg-stone-950 text-stone-100 rounded-3xl border border-stone-800 overflow-hidden shadow-2xl transition-all print:border-none print:shadow-none print:rounded-none print:bg-white print:text-black ${
          layoutMode === 'print_preview'
            ? 'max-w-4xl mx-auto ring-1 ring-amber-500/30 bg-stone-950 p-6 sm:p-10'
            : 'p-4 sm:p-8'
        }`}
      >
        {/* TOP BRAND HEADER */}
        <div className="relative text-center pb-8 border-b border-stone-800/80 print:border-stone-300 mb-8">
          {/* Subtle background glow */}
          <div className="absolute inset-0 bg-radial from-red-600/10 via-amber-500/5 to-transparent blur-2xl pointer-events-none" />

          {/* Official Food Planet Logo */}
          <div className="flex flex-col items-center justify-center mb-2">
            <FoodPlanetLogo size="lg" showSubtitle={true} variant="dark" />
            <button
              onClick={() => document.getElementById('logo-file-input')?.click()}
              className="no-print mt-2 text-[10px] text-stone-500 hover:text-amber-400 transition-colors flex items-center gap-1 cursor-pointer bg-stone-900/60 px-2.5 py-0.5 rounded-full border border-stone-800"
              title="Cargar o reemplazar imagen de logo"
            >
              <Upload className="w-2.5 h-2.5" />
              <span>Cargar / Reemplazar Imagen de Logo</span>
            </button>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-stone-400 print:text-stone-600 font-medium">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              Horario de Atención: 11:00 AM - 21:00 PM
            </span>
            <span className="hidden sm:inline" aria-hidden="true">·</span>
            <a
              href="https://wa.me/59162691600"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-500" />
              WhatsApp y Delivery: +591 62691600
            </a>
            <span className="hidden sm:inline" aria-hidden="true">·</span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-500" />
              Calle Sgto. Mayor Diego Bazan #560
            </span>
          </div>

          <div className="mt-4 inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-stone-900 border border-stone-800 text-[11px] text-amber-400 print:bg-stone-100 print:text-stone-800 print:border-stone-300 font-bold uppercase tracking-widest shadow-inner">
            ★ Sabores de otro planeta, sabores que te harán volver ★
          </div>
        </div>

        {/* SPECIAL PROMO BANNER / ALMUERZO COMPLETO HIGHLIGHT */}
        {(activeCategoryFilter === 'todos' || activeCategoryFilter === 'almuerzos') && (
          <div className="mb-10 bg-linear-to-r from-red-950/40 via-stone-900/90 to-amber-950/30 border border-red-800/40 print:border-stone-400 print:bg-stone-50 rounded-2xl p-5 sm:p-6 shadow-lg">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400 print:text-amber-800 uppercase tracking-wider">
                  <Flame className="w-4 h-4 text-red-500" />
                  Especial de Mediodía
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white print:text-stone-900 tracking-tight">
                  Almuerzo Completo Food Planet · Bs. 18.00
                </h3>
                <p className="text-xs sm:text-sm text-stone-300 print:text-stone-700 mt-1">
                  Incluye <strong className="text-amber-400 print:text-stone-900">Sopa Caliente a Elección</strong> + Segundo Plato Contundente con guarniciones + Vaso de Refresco Helado.
                </p>
              </div>

              <div className="shrink-0 bg-stone-950/80 print:bg-white border border-amber-500/40 px-4 py-2.5 rounded-xl text-center shadow-inner">
                <span className="text-[10px] text-stone-400 print:text-stone-600 block uppercase font-bold tracking-wider">
                  Precio Ejecutivo
                </span>
                <span className="text-2xl font-black text-amber-400 print:text-stone-900 font-mono">
                  Bs. 18
                </span>
              </div>
            </div>

            {/* The 4 requested soups prominently featured */}
            <div className="mt-4 pt-4 border-t border-stone-800/80 print:border-stone-300">
              <div className="text-xs font-bold text-stone-300 print:text-stone-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                <span>El Rincón de las Sopas (Elige tu favorita):</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {SOUP_OPTIONS.map((soup) => (
                  <div
                    key={soup.id}
                    className="bg-stone-900/90 print:bg-white border border-stone-800 print:border-stone-300 rounded-xl p-3 flex flex-col justify-between"
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-xl">{soup.icon}</span>
                      <h4 className="font-bold text-sm text-amber-300 print:text-stone-900">
                        {soup.name}
                      </h4>
                    </div>
                    <p className="text-[11px] text-stone-400 print:text-stone-600 leading-tight">
                      {soup.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* MENU COLUMNS / SECTIONS */}
        <div className="space-y-10">
          {/* SECTION: MILANESAS */}
          {(activeCategoryFilter === 'todos' || activeCategoryFilter === 'milanesas') && (
            <div>
              <div className="flex items-center justify-between pb-2 mb-4 border-b-2 border-red-600">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-red-600/20 text-red-500 flex items-center justify-center font-black text-base print:bg-stone-200">
                    🥩
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-black text-white print:text-stone-900 uppercase tracking-tight">
                      Milanesas Especiales Food Planet
                    </h3>
                    <p className="text-xs text-stone-400 print:text-stone-600">
                      Todas nuestras milanesas se sirven con abundante porción de papas fritas crocantes y arroz blanco
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {milanesas.map((dish) => (
                  <div
                    key={dish.id}
                    className="p-4 rounded-xl bg-stone-900/70 hover:bg-stone-900 transition-colors border border-stone-800/80 print:bg-white print:border-stone-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{dish.emojiIcon || '🥩'}</span>
                          <h4 className="font-bold text-base text-white print:text-stone-900 leading-tight">
                            {dish.name}
                          </h4>
                        </div>
                        <span className="font-mono font-black text-amber-400 print:text-stone-900 text-lg whitespace-nowrap">
                          Bs. {dish.price.toFixed(2)}
                        </span>
                      </div>
                      <p className="text-xs text-stone-300 print:text-stone-700 leading-relaxed mt-1">
                        {dish.description}
                      </p>
                    </div>

                    {dish.tags && dish.tags.length > 0 && (
                      <div className="mt-3 pt-2 border-t border-stone-800/60 print:border-stone-200 flex items-center gap-2 text-[10px] text-stone-400 print:text-stone-600">
                        {dish.tags.map((t, idx) => (
                          <React.Fragment key={t}>
                            {idx > 0 && <span>·</span>}
                            <span>{t}</span>
                          </React.Fragment>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION: SANDWICHES & LOMITO */}
          {(activeCategoryFilter === 'todos' || activeCategoryFilter === 'sandwiches') && (
            <div>
              <div className="flex items-center justify-between pb-2 mb-4 border-b-2 border-amber-500">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-500 flex items-center justify-center font-black text-base print:bg-stone-200">
                    🥪
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-black text-white print:text-stone-900 uppercase tracking-tight">
                      Sándwiches & Lomitos Planetarios
                    </h3>
                    <p className="text-xs text-stone-400 print:text-stone-600">
                      En pan artesanal recién horneado, con queso derretido, jamón, huevo frito y papas
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sandwiches.map((dish) => (
                  <div
                    key={dish.id}
                    className="p-4 rounded-xl bg-stone-900/70 hover:bg-stone-900 transition-colors border border-stone-800/80 print:bg-white print:border-stone-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{dish.emojiIcon || '🥪'}</span>
                          <h4 className="font-bold text-base text-white print:text-stone-900 leading-tight">
                            {dish.name}
                          </h4>
                        </div>
                        <span className="font-mono font-black text-amber-400 print:text-stone-900 text-lg whitespace-nowrap">
                          Bs. {dish.price.toFixed(2)}
                        </span>
                      </div>
                      <p className="text-xs text-stone-300 print:text-stone-700 leading-relaxed mt-1">
                        {dish.description}
                      </p>
                    </div>

                    {dish.tags && dish.tags.length > 0 && (
                      <div className="mt-3 pt-2 border-t border-stone-800/60 print:border-stone-200 flex items-center gap-2 text-[10px] text-stone-400 print:text-stone-600">
                        {dish.tags.map((t, idx) => (
                          <React.Fragment key={t}>
                            {idx > 0 && <span>·</span>}
                            <span>{t}</span>
                          </React.Fragment>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION: COMIDA RAPIDA & PARRILLA (POLLO A LA PARRILLA, ALITAS Y PIPOCAS) */}
          {(activeCategoryFilter === 'todos' || activeCategoryFilter === 'comida_rapida') && (
            <div>
              <div className="flex items-center justify-between pb-2 mb-4 border-b-2 border-red-500">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-red-500/20 text-red-500 flex items-center justify-center font-black text-base print:bg-stone-200">
                    🍗
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-black text-white print:text-stone-900 uppercase tracking-tight">
                      Pollo a la Parrilla, Alitas & Bocados Crocantes
                    </h3>
                    <p className="text-xs text-stone-400 print:text-stone-600">
                      Pollo a las brasas, crocancia extrema, salsas especiales de la casa y abundantes guarniciones
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {comidaRapida.map((dish) => (
                  <div
                    key={dish.id}
                    className="p-4 rounded-xl bg-stone-900/70 hover:bg-stone-900 transition-colors border border-stone-800/80 print:bg-white print:border-stone-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{dish.emojiIcon || '🍗'}</span>
                          <h4 className="font-bold text-base text-white print:text-stone-900 leading-tight">
                            {dish.name}
                          </h4>
                        </div>
                        <span className="font-mono font-black text-amber-400 print:text-stone-900 text-lg whitespace-nowrap">
                          Bs. {dish.price.toFixed(2)}
                        </span>
                      </div>
                      <p className="text-xs text-stone-300 print:text-stone-700 leading-relaxed mt-1">
                        {dish.description}
                      </p>
                    </div>

                    {dish.tags && dish.tags.length > 0 && (
                      <div className="mt-3 pt-2 border-t border-stone-800/60 print:border-stone-200 flex items-center gap-2 text-[10px] text-stone-400 print:text-stone-600">
                        {dish.tags.map((t, idx) => (
                          <React.Fragment key={t}>
                            {idx > 0 && <span>·</span>}
                            <span>{t}</span>
                          </React.Fragment>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION: BEBIDAS & EXTRAS */}
          {(activeCategoryFilter === 'todos' || activeCategoryFilter === 'bebidas') && (
            <div>
              <div className="flex items-center justify-between pb-2 mb-4 border-b-2 border-cyan-500">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-black text-base print:bg-stone-200">
                    🥤
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-black text-white print:text-stone-900 uppercase tracking-tight">
                      Bebidas & Refrescos Helados
                    </h3>
                    <p className="text-xs text-stone-400 print:text-stone-600">
                      Refrescos caseros hervidos y gaseosas heladas para acompañar tu comida
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {bebidas.map((dish) => (
                  <div
                    key={dish.id}
                    className="p-3.5 rounded-xl bg-stone-900/70 border border-stone-800/80 print:bg-white print:border-stone-300 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{dish.emojiIcon || '🥤'}</span>
                      <div>
                        <h4 className="font-bold text-sm text-white print:text-stone-900">
                          {dish.name}
                        </h4>
                        <span className="text-[11px] text-stone-400 print:text-stone-600 block">
                          {dish.shortDesc}
                        </span>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-amber-400 print:text-stone-900 whitespace-nowrap">
                      Bs. {dish.price.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* FOOTER OF THE MENU SHEET */}
        <div className="mt-12 pt-6 border-t border-stone-800 print:border-stone-400 text-center text-xs text-stone-400 print:text-stone-700">
          <p className="font-bold text-amber-400 print:text-stone-900">
            «Sabores de otro planeta, sabores que te harán volver»
          </p>
          <p className="font-medium mt-1">
            Food Planet Restaurante · Horarios: 11:00 AM a 21:00 PM · Calle Sgto. Mayor Diego Bazan #560 · WhatsApp y Delivery: +591 62691600
          </p>
          <p className="text-[11px] text-stone-500 print:text-stone-500 mt-1">
            Precios expresados en Bolivianos (Bs.) · Factura disponible a solicitud · Servicio a mesa y para llevar.
          </p>
        </div>
      </div>
    </div>
  );
};
