export const CATEGORIES = [
  {
    id: 'Sightseeing',
    name: 'Sightseeing',
    iconName: 'Camera',
    color: 'indigo',
    badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    dotClass: 'bg-indigo-500',
    barColor: '#6366f1',
  },
  {
    id: 'Food',
    name: 'Food',
    iconName: 'Utensils',
    color: 'amber',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    dotClass: 'bg-amber-500',
    barColor: '#f59e0b',
  },
  {
    id: 'Transit',
    name: 'Transit',
    iconName: 'Navigation',
    color: 'sky',
    badgeClass: 'bg-sky-50 text-sky-700 border-sky-200',
    dotClass: 'bg-sky-500',
    barColor: '#0ea5e9',
  },
  {
    id: 'Hotel',
    name: 'Hotel',
    iconName: 'BedDouble',
    color: 'emerald',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dotClass: 'bg-emerald-500',
    barColor: '#10b981',
  },
  {
    id: 'Shopping',
    name: 'Shopping',
    iconName: 'ShoppingBag',
    color: 'rose',
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
    dotClass: 'bg-rose-500',
    barColor: '#f43f5e',
  },
];

export const CATEGORY_MAP = CATEGORIES.reduce((acc, cat) => {
  acc[cat.id] = cat;
  return acc;
}, {});
