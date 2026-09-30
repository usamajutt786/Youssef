import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useI18n } from '../../context/I18nContext';
import { useRouter } from '../../context/RouterContext';
import { ProductCard } from '../../components/common/ProductCard';
import { StoreCard } from '../../components/common/StoreCard';
import { VirtualTryOnCanvas } from '../../components/tryon/VirtualTryOnCanvas';
import { Product } from '../../types';
import {
  Glasses,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Truck,
  RotateCcw
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { products, stores, categories } = useMarketplace();
  const { t, lang } = useI18n();
  const { navigate } = useRouter();

  const [activeTryOnProduct, setActiveTryOnProduct] = useState<Product | null>(null);

  const publishedProducts = products.filter(p => p.status === 'published');
  const featuredProducts = publishedProducts.filter(p => p.isFeatured).slice(0, 4);
  const newArrivals = publishedProducts.filter(p => p.isNewArrival).slice(0, 4);
  const approvedStores = stores.filter(s => s.status === 'approved');

  const ArrowIcon = lang === 'ar' ? ArrowLeft : ArrowRight;

  return (
    <div className="space-y-16 pb-20">
      
      {/* Editorial Hero Section (Max 1 dominant campaign anchor) */}
      <section className="relative overflow-hidden bg-neutral-900 text-white min-h-[520px] flex items-center">
        {/* Background Editorial Image with measured contrast scrim */}
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/hero_eyewear_editorial_1790807933912.jpg"
            alt="Campagne Lunetterie de Créateurs"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center opacity-40 mix-blend-luminosity scale-102"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="max-w-2xl space-y-6">
            
            {/* Subtle editorial kicker */}
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Multi-Boutiques & Essayage Photo 2D</span>
            </div>

            {/* Display headline with balanced wrapping */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-balance">
              {t('heroEyewearTitle')}
            </h1>

            {/* Subtitle measure 65-75ch */}
            <p className="text-base sm:text-lg text-neutral-300 font-light leading-relaxed max-w-xl">
              {t('heroEyewearSubtitle')}
            </p>

            {/* Action buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => navigate('/catalog')}
                className="px-6 py-3.5 bg-white text-neutral-950 text-sm font-semibold rounded-xl hover:bg-neutral-100 transition-all flex items-center gap-2 shadow-lg"
              >
                <span>{t('heroExploreCatalog')}</span>
                <ArrowIcon className="w-4 h-4" />
              </button>

              <button
                onClick={() => navigate('/try-on')}
                className="px-6 py-3.5 bg-neutral-800/90 hover:bg-neutral-800 text-white text-sm font-semibold rounded-xl border border-neutral-700/80 backdrop-blur-md transition-all flex items-center gap-2"
              >
                <Glasses className="w-4 h-4 text-amber-400" />
                <span>{t('heroStartTryOn')}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
              {t('featuredProducts')}
            </h2>
            <p className="text-sm text-neutral-500 mt-1">
              Sélection exclusive forgée par nos opticiens indépendants partenaires.
            </p>
          </div>
          <button
            onClick={() => navigate('/catalog')}
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-neutral-900 hover:text-amber-700 transition-colors"
          >
            <span>{t('viewAll')}</span>
            <ArrowIcon className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onOpenTryOn={p => setActiveTryOnProduct(p)}
            />
          ))}
        </div>
      </section>

      {/* Dedicated Interactive 2D Try-on Banner Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-xl">
          <div className="max-w-xl space-y-4 relative z-10">
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
              {t('tryOnBannerTitle')}
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
              Ajustez chaque monture au millimètre près sur votre photo.
            </h2>
            <p className="text-sm text-neutral-300 leading-relaxed">
              {t('tryOnBannerDesc')}
            </p>
            <div className="pt-2">
              <button
                onClick={() => navigate('/try-on')}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-neutral-950 text-sm font-semibold rounded-xl transition-colors flex items-center gap-2"
              >
                <Glasses className="w-4 h-4" />
                <span>Ouvrir le studio d'essayage</span>
              </button>
            </div>
          </div>

          <div className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 w-80 opacity-90">
            <img
              src="/src/assets/images/product_optics_titanium_1790807943846.jpg"
              alt="Aperçu monture"
              className="rounded-2xl shadow-2xl border border-neutral-700 mix-blend-screen"
            />
          </div>
        </div>
      </section>

      {/* Featured Partner Stores Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
              {t('featuredStores')}
            </h2>
            <p className="text-sm text-neutral-500 mt-1">
              Chaque opticien possède son propre atelier, ses stocks et expédie vos commandes.
            </p>
          </div>
          <button
            onClick={() => navigate('/stores')}
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-neutral-900 hover:text-amber-700 transition-colors"
          >
            <span>{t('viewAll')}</span>
            <ArrowIcon className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {approvedStores.map(store => (
            <StoreCard key={store.id} store={store} />
          ))}
        </div>
      </section>

      {/* Category Discovery */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-display text-2xl font-bold text-neutral-900 tracking-tight mb-6">
          {t('discoverCategories')}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => navigate(`/catalog?category=${cat.id}`)}
              className="p-4 bg-white rounded-xl border border-neutral-200/80 hover:border-neutral-900 transition-all text-left group shadow-xs"
            >
              <h3 className="font-semibold text-sm text-neutral-900 group-hover:text-amber-700 transition-colors">
                {cat.name[lang] || cat.name.fr}
              </h3>
              <p className="text-xs text-neutral-500 mt-1 line-clamp-1">
                {cat.description[lang] || cat.description.fr}
              </p>
              <span className="text-[11px] text-neutral-400 mt-2 block tabular-nums">
                {cat.count} modèles
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Try-On Modal Triggered from Card */}
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
