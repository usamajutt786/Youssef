import React, { useState } from 'react';
import { useRouter } from '../../context/RouterContext';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useI18n } from '../../context/I18nContext';
import { ProductCard } from '../../components/common/ProductCard';
import { VirtualTryOnCanvas } from '../../components/tryon/VirtualTryOnCanvas';
import { Product } from '../../types';
import {
  MapPin,
  Phone,
  Mail,
  Star,
  Bookmark,
  ShieldCheck,
  RotateCcw,
  Glasses
} from 'lucide-react';

export const StoreDetailPage: React.FC = () => {
  const { storeSlugParam, navigate } = useRouter();
  const { stores, products, followedStores, toggleFollowStore } = useMarketplace();
  const { t, lang } = useI18n();

  const store = stores.find(s => s.slug === storeSlugParam) || stores[0];
  const [activeTab, setActiveTab] = useState<'all' | 'prescription' | 'sunglasses' | 'new' | 'promo'>('all');
  const [activeTryOnProduct, setActiveTryOnProduct] = useState<Product | null>(null);

  if (!store) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold">Boutique introuvable</h2>
        <button
          onClick={() => navigate('/stores')}
          className="mt-4 px-4 py-2 bg-neutral-900 text-white rounded-lg text-sm"
        >
          Retour aux boutiques
        </button>
      </div>
    );
  }

  const isFollowed = followedStores.includes(store.id);
  const storeProducts = products.filter(p => p.storeId === store.id && p.status === 'published');

  const filteredProducts = storeProducts.filter(p => {
    if (activeTab === 'prescription') return p.categoryId === 'prescription';
    if (activeTab === 'sunglasses') return p.categoryId === 'sunglasses';
    if (activeTab === 'new') return p.isNewArrival;
    if (activeTab === 'promo') return !!p.promotionalPrice;
    return true;
  });

  return (
    <div className="space-y-8 pb-16">
      
      {/* Store Cover Banner */}
      <div className="relative h-64 sm:h-80 bg-neutral-900 overflow-hidden">
        <img
          src={store.coverImage}
          alt={store.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />

        <div className="absolute bottom-6 inset-x-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white border-2 border-white overflow-hidden shadow-xl flex items-center justify-center shrink-0">
              <img src={store.logo} alt={store.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold">{store.name}</h1>
              <div className="flex items-center gap-3 text-xs text-neutral-300 mt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {store.location}
                </span>
                {store.rating > 0 && (
                  <span className="flex items-center gap-1 text-amber-400 font-semibold">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    {store.rating.toFixed(1)} ({store.reviewCount} avis)
                  </span>
                )}
                <span>· {storeProducts.length} montures</span>
              </div>
            </div>
          </div>

          {/* Follow Button */}
          <button
            onClick={() => toggleFollowStore(store.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              isFollowed
                ? 'bg-amber-600 text-white'
                : 'bg-white text-neutral-900 hover:bg-neutral-100'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isFollowed ? 'fill-current' : ''}`} />
            <span>{isFollowed ? t('unfollowStore') : t('followStore')}</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Store Description & Policies Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-6 rounded-2xl border border-neutral-200">
          <div className="md:col-span-2 space-y-2">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              À propos de l'atelier
            </h2>
            <p className="text-sm text-neutral-700 leading-relaxed">
              {store.description[lang] || store.description.fr}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-500 pt-2">
              <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {store.phone}</span>
              <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {store.email}</span>
            </div>
          </div>

          <div className="border-t md:border-t-0 md:border-l border-neutral-100 md:pl-6 space-y-3 text-xs">
            <div className="flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-neutral-900 block">Garantie Boutique</span>
                <span className="text-neutral-500">{store.storePolicies[lang] || store.storePolicies.fr}</span>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <RotateCcw className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-neutral-900 block">Politique de retour</span>
                <span className="text-neutral-500">{store.returnPolicy[lang] || store.returnPolicy.fr}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Store Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-neutral-200 overflow-x-auto pb-px">
          {[
            { id: 'all', label: 'Toutes les montures' },
            { id: 'prescription', label: t('catPrescription') },
            { id: 'sunglasses', label: t('catSunglasses') },
            { id: 'new', label: t('newArrivals') },
            { id: 'promo', label: 'Offres Spéciales' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition-colors relative ${
                activeTab === tab.id
                  ? 'text-neutral-900 border-b-2 border-neutral-900'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Store Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onOpenTryOn={p => setActiveTryOnProduct(p)}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-neutral-200 text-xs text-neutral-500">
            Aucune monture dans cette sélection pour cette boutique.
          </div>
        )}
      </div>

      {/* 2D Try-on Modal */}
      {activeTryOnProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in">
          <VirtualTryOnCanvas
            initialProductId={activeTryOnProduct.id}
            onClose={() => setActiveTryOnProduct(null)}
          />
        </div>
      )}
    </div>
  );
};
