import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useI18n } from '../../context/I18nContext';
import { StoreCard } from '../../components/common/StoreCard';
import { Search, MapPin, Store as StoreIcon } from 'lucide-react';

export const StoreDirectoryPage: React.FC = () => {
  const { stores } = useMarketplace();
  const { t } = useI18n();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('all');

  const approvedStores = stores.filter(s => s.status === 'approved');

  const filteredStores = approvedStores.filter(store => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const match =
        store.name.toLowerCase().includes(q) ||
        store.location.toLowerCase().includes(q) ||
        store.city.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (selectedLocation !== 'all' && store.country !== selectedLocation) {
      return false;
    }
    return true;
  });

  const locations = Array.from(new Set(approvedStores.map(s => s.country)));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-neutral-900 tracking-tight">
          {t('navStores')}
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          Découvrez nos opticiens indépendants et ateliers créateurs partenaires.
        </p>
      </div>

      {/* Filters bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-neutral-200">
        <div className="relative flex-1 w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Rechercher une boutique, ville..."
            className="w-full pl-9 pr-4 py-2 bg-neutral-50 text-xs border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto text-xs">
          <MapPin className="w-4 h-4 text-neutral-400" />
          <select
            value={selectedLocation}
            onChange={e => setSelectedLocation(e.target.value)}
            className="bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 text-xs text-neutral-800"
          >
            <option value="all">Tous les pays</option>
            {locations.map(loc => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Store Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredStores.map(store => (
          <StoreCard key={store.id} store={store} />
        ))}
      </div>

      {filteredStores.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl border border-neutral-200">
          <StoreIcon className="w-10 h-10 text-neutral-300 mx-auto mb-2" />
          <p className="text-sm font-medium text-neutral-700">Aucune boutique ne correspond à vos filtres.</p>
        </div>
      )}
    </div>
  );
};
