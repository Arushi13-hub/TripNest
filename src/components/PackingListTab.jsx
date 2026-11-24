import React, { useState, useMemo } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Plus, 
  Trash2, 
  Sparkles, 
  Briefcase, 
  FileText, 
  Shirt, 
  Smartphone, 
  Sparkle,
  Layers,
  RotateCcw,
  CheckCheck
} from 'lucide-react';
import { PACKING_CATEGORIES, ESSENTIAL_PACKING_ITEMS } from '../data/packingEssentials';

const CATEGORY_ICONS = {
  Documents: FileText,
  Clothes: Shirt,
  Electronics: Smartphone,
  Toiletries: Sparkle,
  All: Layers,
};

const CATEGORY_COLORS = {
  Documents: 'bg-amber-50 text-amber-700 border-amber-200',
  Clothes: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  Electronics: 'bg-sky-50 text-sky-700 border-sky-200',
  Toiletries: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

export default function PackingListTab({ packingList = [], onUpdatePackingList }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Clothes');

  // Stats calculation
  const totalCount = packingList.length;
  const packedCount = packingList.filter((item) => item.packed).length;
  const progressPercent = totalCount > 0 ? Math.round((packedCount / totalCount) * 100) : 0;

  // Filtered items
  const filteredItems = useMemo(() => {
    if (selectedCategory === 'All') return packingList;
    return packingList.filter((item) => item.category === selectedCategory);
  }, [packingList, selectedCategory]);

  // Toggle item packed status
  const handleTogglePacked = (itemId) => {
    const updated = packingList.map((item) =>
      item.id === itemId ? { ...item, packed: !item.packed } : item
    );
    onUpdatePackingList(updated);
  };

  // Add new item
  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItemTitle.trim()) return;

    const newItem = {
      id: `pack-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      title: newItemTitle.trim(),
      category: newItemCategory,
      packed: false,
    };

    onUpdatePackingList([...packingList, newItem]);
    setNewItemTitle('');
  };

  // Delete item
  const handleDeleteItem = (itemId) => {
    onUpdatePackingList(packingList.filter((item) => item.id !== itemId));
  };

  // Auto-populate essential items with one click
  const handlePopulateEssentials = () => {
    const existingTitles = new Set(packingList.map((i) => i.title.toLowerCase().trim()));
    const itemsToAdd = ESSENTIAL_PACKING_ITEMS.filter(
      (ess) => !existingTitles.has(ess.title.toLowerCase().trim())
    ).map((ess) => ({
      ...ess,
      id: `pack-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    }));

    if (itemsToAdd.length === 0) {
      // If already all present, re-seed fresh list
      const freshList = ESSENTIAL_PACKING_ITEMS.map((ess) => ({
        ...ess,
        id: `pack-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      }));
      onUpdatePackingList(freshList);
      return;
    }

    onUpdatePackingList([...packingList, ...itemsToAdd]);
  };

  // Mark all as packed
  const handleMarkAllPacked = () => {
    const allPacked = packingList.every((i) => i.packed);
    const updated = packingList.map((i) => ({ ...i, packed: !allPacked }));
    onUpdatePackingList(updated);
  };

  // Clear all items
  const handleClearAll = () => {
    if (window.confirm('Clear all items from your packing checklist?')) {
      onUpdatePackingList([]);
    }
  };

  return (
    <div className="space-y-5 max-w-4xl mx-auto p-2 sm:p-4">
      {/* Top Banner / Progress Summary */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-3xl p-5 sm:p-6 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-rose-500/10 via-transparent to-transparent pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2 text-rose-300 text-xs font-bold uppercase tracking-wider mb-1">
              <Briefcase className="w-4 h-4" />
              <span>Luggage & Packing Checklist</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              {packedCount} of {totalCount} items packed ({progressPercent}%)
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              {totalCount === 0 
                ? 'Your suitcase is waiting! Add custom items or populate essentials with 1 click.'
                : progressPercent === 100 
                ? '🎉 Fantastic! Everything is packed and ready for departure.'
                : 'Stay organized so you never leave passports, adapters, or essentials behind.'}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handlePopulateEssentials}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-500 via-rose-600 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 shadow-md shadow-rose-500/20 active:scale-98 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              <span>Auto-Populate Essentials</span>
            </button>

            {totalCount > 0 && (
              <button
                onClick={handleMarkAllPacked}
                className="inline-flex items-center space-x-1 px-3 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>{packedCount === totalCount ? 'Uncheck All' : 'Check All'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 pt-3 border-t border-white/10">
          <div className="h-2.5 w-full bg-white/20 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                progressPercent === 100
                  ? 'bg-gradient-to-r from-emerald-400 to-teal-400'
                  : 'bg-gradient-to-r from-rose-500 via-amber-400 to-emerald-400'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Add Item Bar */}
      <form onSubmit={handleAddItem} className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3 sm:space-y-0 sm:flex sm:items-center sm:space-x-3">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Add packing item (e.g. Hiking boots, Waterproof camera, Sunglasses)..."
            value={newItemTitle}
            onChange={(e) => setNewItemTitle(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
          />
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={newItemCategory}
            onChange={(e) => setNewItemCategory(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-slate-50 focus:outline-none focus:border-indigo-500"
          >
            <option value="Clothes">Clothes</option>
            <option value="Documents">Documents</option>
            <option value="Electronics">Electronics</option>
            <option value="Toiletries">Toiletries</option>
          </select>

          <button
            type="submit"
            className="inline-flex items-center space-x-1 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-rose-600 to-orange-500 hover:from-rose-500 hover:to-orange-400 shadow-sm cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Add Item</span>
          </button>
        </div>
      </form>

      {/* Category Filter Pills */}
      <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
          {PACKING_CATEGORIES.map((cat) => {
            const Icon = CATEGORY_ICONS[cat.id] || Layers;
            const count = cat.id === 'All' 
              ? packingList.length 
              : packingList.filter((i) => i.category === cat.id).length;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 bg-white border border-slate-200/80'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-rose-400' : 'text-slate-400'}`} />
                <span>{cat.label}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {totalCount > 0 && (
          <button
            onClick={handleClearAll}
            className="text-xs text-slate-400 hover:text-rose-600 transition-colors p-1"
          >
            Clear List
          </button>
        )}
      </div>

      {/* Items Checklist Grid */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-8 text-center space-y-3 my-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-2xs">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-800">
              No items in {selectedCategory === 'All' ? 'checklist' : selectedCategory} yet
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Add your custom packing necessities or load the curated travel essentials list with one click.
            </p>
          </div>
          <button
            onClick={handlePopulateEssentials}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Populate Travel Essentials</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {filteredItems.map((item) => {
            const catBadge = CATEGORY_COLORS[item.category] || 'bg-slate-100 text-slate-700';

            return (
              <div
                key={item.id}
                onClick={() => handleTogglePacked(item.id)}
                className={`group flex items-center justify-between p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer ${
                  item.packed
                    ? 'bg-slate-50 border-slate-200/60 opacity-75'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs hover:shadow-xs'
                }`}
              >
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <div className="shrink-0 text-slate-400 group-hover:text-rose-600 transition-colors">
                    {item.packed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-50" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`text-xs sm:text-sm font-semibold truncate ${
                      item.packed ? 'line-through text-slate-400' : 'text-slate-800'
                    }`}>
                      {item.title}
                    </p>
                    <span className={`inline-block mt-0.5 px-2 py-0.2 rounded-md text-[10px] font-bold border ${catBadge}`}>
                      {item.category}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteItem(item.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all ml-2"
                  title="Remove item"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
