import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { Dish, CategoryType, RecipeIngredient } from '../../types/restaurant';
import {
  UtensilsCrossed,
  Plus,
  Trash2,
  CheckCircle,
  XCircle,
  Edit3,
  DollarSign,
  Clock,
  Sparkles,
  Search,
  X,
} from 'lucide-react';

export const DishManagerView: React.FC = () => {
  const { dishes, ingredients, addDish, updateDish, deleteDish, toggleDishAvailability } =
    useRestaurant();

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('todos');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDishId, setEditingDishId] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('28.00');
  const [category, setCategory] = useState<CategoryType>('milanesas');
  const [prepTime, setPrepTime] = useState('15');
  const [emojiIcon, setEmojiIcon] = useState('🥩');
  const [isSpecialLunch, setIsSpecialLunch] = useState(false);
  const [tagsInput, setTagsInput] = useState('Especialidad, Popular');

  // Recipe Builder
  const [recipeItems, setRecipeItems] = useState<RecipeIngredient[]>([]);
  const [selectedIngId, setSelectedIngId] = useState<string>('');
  const [selectedIngQty, setSelectedIngQty] = useState<string>('0.2');

  const openCreateModal = () => {
    setEditingDishId(null);
    setName('');
    setShortDesc('');
    setDescription('');
    setPrice('28.00');
    setCategory('milanesas');
    setPrepTime('15');
    setEmojiIcon('🥩');
    setIsSpecialLunch(false);
    setTagsInput('Especialidad, Popular');
    setRecipeItems([
      { ingredientId: 'ing-1', quantity: 0.22 },
      { ingredientId: 'ing-10', quantity: 0.25 },
    ]);
    setSelectedIngId(ingredients[0]?.id || '');
    setSelectedIngQty('0.2');
    setModalOpen(true);
  };

  const openEditModal = (dish: Dish) => {
    setEditingDishId(dish.id);
    setName(dish.name);
    setShortDesc(dish.shortDesc);
    setDescription(dish.description);
    setPrice(dish.price.toString());
    setCategory(dish.category);
    setPrepTime(dish.preparationTimeMinutes.toString());
    setEmojiIcon(dish.emojiIcon || '🍽️');
    setIsSpecialLunch(!!dish.isSpecialLunch);
    setTagsInput((dish.tags || []).join(', '));
    setRecipeItems(dish.recipe || []);
    setSelectedIngId(ingredients[0]?.id || '');
    setSelectedIngQty('0.2');
    setModalOpen(true);
  };

  const handleAddRecipeIngredient = () => {
    if (!selectedIngId) return;
    const qty = parseFloat(selectedIngQty);
    if (qty <= 0) return;

    setRecipeItems((prev) => {
      const idx = prev.findIndex((r) => r.ingredientId === selectedIngId);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: qty };
        return next;
      }
      return [...prev, { ingredientId: selectedIngId, quantity: qty }];
    });
  };

  const handleRemoveRecipeIngredient = (ingId: string) => {
    setRecipeItems((prev) => prev.filter((r) => r.ingredientId !== ingId));
  };

  const calculateDishCost = () => {
    return recipeItems.reduce((acc, r) => {
      const ing = ingredients.find((i) => i.id === r.ingredientId);
      return acc + (ing ? ing.costPerUnit * r.quantity : 0);
    }, 0);
  };

  const handleSaveDish = () => {
    if (!name.trim()) return;

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const dishPayload = {
      name: name.trim(),
      shortDesc: shortDesc.trim(),
      description: description.trim(),
      price: parseFloat(price) || 0,
      category,
      isAvailable: true,
      preparationTimeMinutes: parseInt(prepTime) || 15,
      emojiIcon,
      isSpecialLunch,
      tags,
      recipe: recipeItems,
    };

    if (editingDishId) {
      updateDish(editingDishId, dishPayload);
    } else {
      addDish(dishPayload);
    }

    setModalOpen(false);
  };

  const filteredDishes = dishes.filter((dish) => {
    const matchesSearch =
      dish.name.toLowerCase().includes(search.toLowerCase()) ||
      dish.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      categoryFilter === 'todos' || dish.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <UtensilsCrossed className="w-4 h-4" />
            Catálogo & Recetas de la Casa
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Gestión y Creación de Platos
          </h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Crea milanesas, sándwiches, lomitos, combos de alitas y almuerzos completos con recetas vinculadas al inventario.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="w-full md:w-auto px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-red-950/40 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Crear Nuevo Plato
        </button>
      </div>

      {/* Search & Categories */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar plato en el menú..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-stone-900 border border-stone-800 rounded-xl pl-10 pr-4 py-2 text-xs text-stone-100 placeholder:text-stone-500 focus:outline-hidden focus:border-amber-500"
          />
        </div>

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
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap cursor-pointer ${
                categoryFilter === cat.id
                  ? 'bg-amber-500 text-stone-950 font-bold'
                  : 'bg-stone-900 border border-stone-800 text-stone-300 hover:bg-stone-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Dishes Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDishes.map((dish) => {
          const dishCost = (dish.recipe || []).reduce((acc, r) => {
            const ing = ingredients.find((i) => i.id === r.ingredientId);
            return acc + (ing ? ing.costPerUnit * r.quantity : 0);
          }, 0);
          const margin = dish.price > 0 ? ((dish.price - dishCost) / dish.price) * 100 : 0;

          return (
            <div
              key={dish.id}
              className={`bg-stone-900 rounded-2xl border transition-all flex flex-col justify-between p-4 shadow-lg ${
                dish.isAvailable ? 'border-stone-800' : 'border-stone-800/40 opacity-70'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-stone-800 text-xl flex items-center justify-center">
                    {dish.emojiIcon || '🍽️'}
                  </div>

                  <div className="text-right">
                    <span className="font-mono font-black text-amber-400 text-base block">
                      Bs. {dish.price.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-stone-500 font-mono">
                      Costo insumos: Bs. {dishCost.toFixed(2)} ({margin.toFixed(0)}% margen)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-white text-base leading-tight">
                    {dish.name}
                  </h3>
                  {dish.isSpecialLunch && (
                    <span className="text-[10px] font-bold bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/20">
                      4 Sopas
                    </span>
                  )}
                </div>

                <p className="text-xs text-stone-400 mt-1 line-clamp-2">
                  {dish.description}
                </p>

                {/* Recipe Summary */}
                {dish.recipe && dish.recipe.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-stone-800/70 text-[11px] text-stone-400">
                    <span className="text-[10px] uppercase font-bold text-stone-500 block mb-1">
                      Insumos consumidos por porción:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {dish.recipe.map((r) => {
                        const ing = ingredients.find((i) => i.id === r.ingredientId);
                        if (!ing) return null;
                        return (
                          <span
                            key={r.ingredientId}
                            className="bg-stone-950 px-2 py-0.5 rounded-md text-[10px] text-stone-300 border border-stone-800"
                          >
                            {ing.name}: {r.quantity} {ing.unit}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-stone-800 flex items-center justify-between text-xs">
                <button
                  onClick={() => toggleDishAvailability(dish.id)}
                  className={`flex items-center gap-1.5 font-semibold transition-colors cursor-pointer ${
                    dish.isAvailable ? 'text-emerald-400 hover:text-emerald-300' : 'text-stone-500 hover:text-stone-400'
                  }`}
                >
                  {dish.isAvailable ? (
                    <>
                      <CheckCircle className="w-3.5 h-3.5" /> En Carta
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3.5 h-3.5" /> Agotado
                    </>
                  )}
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(dish)}
                    className="p-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg cursor-pointer transition-colors"
                    title="Editar plato y receta"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteDish(dish.id)}
                    className="p-1.5 bg-stone-800 hover:bg-red-950 text-stone-400 hover:text-red-400 rounded-lg cursor-pointer transition-colors"
                    title="Eliminar plato"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CREATE / EDIT DISH MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs overflow-y-auto">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between pb-2 border-b border-stone-800">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                  {editingDishId ? 'Editar Plato' : 'Nuevo Plato'}
                </span>
                <h3 className="text-lg font-bold text-white">
                  {editingDishId ? 'Actualizar Plato y Receta' : 'Crear Plato para Food Planet'}
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
              <div>
                <label className="text-xs text-stone-300 font-medium block mb-1">
                  Nombre del Plato:
                </label>
                <input
                  type="text"
                  placeholder="Ej. Milanesa a Caballo, Almuerzo Especial, etc."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-stone-300 font-medium block mb-1">
                    Categoría:
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as CategoryType)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-amber-500"
                  >
                    <option value="milanesas">Milanesas</option>
                    <option value="sandwiches">Sándwiches & Lomito</option>
                    <option value="comida_rapida">Comida Rápida (Alitas/Pipocas)</option>
                    <option value="almuerzos">Almuerzos & Sopas</option>
                    <option value="bebidas">Bebidas & Refrescos</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-stone-300 font-medium block mb-1">
                    Precio de Venta (Bs.):
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs font-mono text-amber-400 font-bold focus:outline-hidden focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-stone-300 font-medium block mb-1">
                    Tiempo de Cocción (min):
                  </label>
                  <input
                    type="number"
                    value={prepTime}
                    onChange={(e) => setPrepTime(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-hidden focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-xs text-stone-300 font-medium block mb-1">
                    Icono Emoji:
                  </label>
                  <select
                    value={emojiIcon}
                    onChange={(e) => setEmojiIcon(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-amber-500"
                  >
                    <option value="🥩">🥩 Carne / Milanesa Res</option>
                    <option value="🍗">🍗 Pollo / Alitas</option>
                    <option value="🧀">🧀 Napolitana / Mozzarella</option>
                    <option value="🍳">🍳 A Caballo / Huevos</option>
                    <option value="🥪">🥪 Sándwich</option>
                    <option value="🍔">🍔 Lomito</option>
                    <option value="🍿">🍿 Pipocas</option>
                    <option value="🍲">🍲 Almuerzo / Sopa</option>
                    <option value="🥤">🥤 Refresco</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-stone-300 font-medium block mb-1">
                  Descripción Corta (Para comanda / ticket):
                </label>
                <input
                  type="text"
                  placeholder="Ej. Milanesa con papas fritas y arroz"
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs text-stone-300 font-medium block mb-1">
                  Descripción Completa (Para la Hoja de Menú):
                </label>
                <textarea
                  rows={2}
                  placeholder="Detalles sobre preparación, guarniciones y salsa..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-amber-500"
                />
              </div>

              {/* Checkbox: Almuerzo con elección de sopa */}
              <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 flex items-center gap-3">
                <input
                  type="checkbox"
                  id="specialLunchCheckbox"
                  checked={isSpecialLunch}
                  onChange={(e) => setIsSpecialLunch(e.target.checked)}
                  className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                />
                <label htmlFor="specialLunchCheckbox" className="text-xs text-stone-300 cursor-pointer">
                  <strong className="text-white block">Es Almuerzo con Sopa a Elección</strong>
                  Permite al cliente elegir entre Sopa de Maní, Arroz, Fideo o Avena en el POS.
                </label>
              </div>

              {/* RECIPE BUILDER (Vincular ingredientes para descontar del inventario) */}
              <div className="pt-2 border-t border-stone-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    Receta / Consumo de Inventario
                  </span>
                  <span className="text-xs text-stone-400 font-mono">
                    Costo estimado: Bs. {calculateDishCost().toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <select
                    value={selectedIngId}
                    onChange={(e) => setSelectedIngId(e.target.value)}
                    className="flex-1 bg-stone-950 border border-stone-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-hidden"
                  >
                    {ingredients.map((ing) => (
                      <option key={ing.id} value={ing.id}>
                        {ing.name} ({ing.unit}) - Bs. {ing.costPerUnit}/u
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="Cantidad"
                    value={selectedIngQty}
                    onChange={(e) => setSelectedIngQty(e.target.value)}
                    className="w-20 bg-stone-950 border border-stone-800 rounded-xl px-2 py-1.5 text-xs font-mono text-white text-center focus:outline-hidden"
                  />

                  <button
                    type="button"
                    onClick={handleAddRecipeIngredient}
                    className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold rounded-xl cursor-pointer"
                  >
                    + Vincular
                  </button>
                </div>

                {/* Linked recipe items list */}
                <div className="space-y-1.5 max-h-32 overflow-y-auto">
                  {recipeItems.map((r) => {
                    const ing = ingredients.find((i) => i.id === r.ingredientId);
                    if (!ing) return null;
                    const subCost = ing.costPerUnit * r.quantity;

                    return (
                      <div
                        key={r.ingredientId}
                        className="flex items-center justify-between bg-stone-950/80 px-3 py-1.5 rounded-xl border border-stone-800/80 text-xs"
                      >
                        <span className="text-stone-300 font-medium">
                          {ing.name} ({r.quantity} {ing.unit})
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-stone-400 text-[11px]">
                            Bs. {subCost.toFixed(2)}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveRecipeIngredient(r.ingredientId)}
                            className="text-stone-500 hover:text-red-400 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-stone-800">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="flex-1 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold rounded-xl cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveDish}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl cursor-pointer shadow-md"
              >
                {editingDishId ? 'Guardar Cambios' : 'Crear Plato'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
