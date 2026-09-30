import React, { useState, useMemo } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useI18n } from '../../context/I18nContext';
import { ProductCard } from '../../components/common/ProductCard';
import { VirtualTryOnCanvas } from '../../components/tryon/VirtualTryOnCanvas';
import { Product, FrameShape, Gender, Material } from '../../types';
import {
  Search,
  Filter,
  X,
  SlidersHorizontal,
  Glasses,
  Check,
  RotateCcw
} from 'lucide-react';

export const CatalogPage: React.FC = () => {
  const { products, stores, categories, brands } = useMarketplace();
  const { t, lang, formatPrice } = useI18n();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedGender, setSelectedGender] = useState<string>('all');
  const [selectedShape, setSelectedShape] = useState<string>('all');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [selectedStore, setSelectedStore] = useState<string>('all');
  const [onlyTryOn, setOnlyTryOn] = useState(false);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [maxPrice, setMaxPrice] = useState<number>(350);
  const [sortBy, setSortBy] = useState<string>('relevance');

  // Mobile filter drawer
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [activeTryOnProduct, setActiveTryOnProduct] = useState<Product | null>(null);

  // Read URL query params if present
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q');
    const cat = params.get('category');
    if (q) setSearchQuery(q);
    if (cat) setSelectedCategory(cat);
  }, []);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      if (p.status !== 'published') return false;

      // Search match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const nameFr = (p.name.fr || '').toLowerCase();
        const nameAr = (p.name.ar || '').toLowerCase();
        const brand = (p.brandName || '').toLowerCase();
        const ref = (p.reference || '').toLowerCase();
        const shape = (p.shape || '').toLowerCase();
        const matches =
          nameFr.includes(query) ||
          nameAr.includes(query) ||
          brand.includes(query) ||
          ref.includes(query) ||
          shape.includes(query);
        if (!matches) return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && p.categoryId !== selectedCategory) {
        return false;
      }

      // Gender filter
      if (selectedGender !== 'all' && p.gender !== selectedGender && p.gender !== 'unisex') {
        return false;
      }

      // Shape filter
      if (selectedShape !== 'all' && p.shape !== selectedShape) {
        return false;
      }

      // Material filter
      if (selectedMaterial !== 'all' && p.material !== selectedMaterial) {
        return false;
      }

      // Brand filter
      if (selectedBrand !== 'all' && p.brandId !== selectedBrand) {
        return false;
      }

      // Store filter
      if (selectedStore !== 'all' && p.storeId !== selectedStore) {
        return false;
      }

      // Try-on filter
      if (onlyTryOn && !p.tryOnAsset?.supported) {
        return false;
      }

      // In-stock filter
      if (onlyInStock && p.stock <= 0) {
        return false;
      }

      // Price filter
      const price = p.promotionalPrice || p.price;
      if (price > maxPrice) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      const priceA = a.promotionalPrice || a.price;
      const priceB = b.promotionalPrice || b.price;

      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'priceAsc') {
        return priceA - priceB;
      }
      if (sortBy === 'priceDesc') {
        return priceB - priceA;
      }
      if (sortBy === 'bestSelling') {
        return (b.cartAddCount || 0) - (a.cartAddCount || 0);
      }
      if (sortBy === 'highestRated') {
        return b.rating - a.rating;
      }
      if (sortBy === 'mostTried') {
        return (b.tryOnCount || 0) - (a.tryOnCount || 0);
      }
      return 0; // relevance
    });
  }, [
    products,
    searchQuery,
    selectedCategory,
    selectedGender,
    selectedShape,
    selectedMaterial,
    selectedBrand,
    selectedStore,
    onlyTryOn,
    onlyInStock,
    maxPrice,
    sortBy
  ]);

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedGender('all');
    setSelectedShape('all');
    setSelectedMaterial('all');
    setSelectedBrand('all');
    setSelectedStore('all');
    setOnlyTryOn(false);
    setOnlyInStock(false);
    setMaxPrice(350);
    setSortBy('relevance');
  };

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedCategory !== 'all' ||
    selectedGender !== 'all' ||
    selectedShape !== 'all' ||
    selectedMaterial !== 'all' ||
    selectedBrand !== 'all' ||
    selectedStore !== 'all' ||
    onlyTryOn ||
    onlyInStock ||
    maxPrice < 350;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Header & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <h1 className="font-display text-3xl font-bold text-neutral-900 tracking-tight">
            {t('navCatalog')}
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            {filteredProducts.length} {t('resultsCount')}
          </p>
        </div>

        {/* Search input with live suggestion pills */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full pl-9 pr-8 py-2 bg-white text-xs border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 text-neutral-900"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Mobile Filter Button */}
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="md:hidden flex items-center gap-1.5 px-3 py-2 bg-neutral-900 text-white rounded-lg text-xs font-medium"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{t('filters')}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Sidebar Filters + Products */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Desktop Left Filter Sidebar */}
        <aside className="hidden md:block space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-900">
              {t('filters')}
            </span>
            {hasActiveFilters && (
              <button
                onClick={resetAllFilters}
                className="text-xs text-amber-700 hover:underline flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{t('clearFilters')}</span>
              </button>
            )}
          </div>

          {/* Quick Toggles: 2D Try-on & In Stock */}
          <div className="space-y-2.5">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-neutral-700">
              <input
                type="checkbox"
                checked={onlyTryOn}
                onChange={e => setOnlyTryOn(e.target.checked)}
                className="rounded text-neutral-900 focus:ring-neutral-900"
              />
              <Glasses className="w-3.5 h-3.5 text-amber-600" />
              <span>{t('hasTryOn')}</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-neutral-700">
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={e => setOnlyInStock(e.target.checked)}
                className="rounded text-neutral-900 focus:ring-neutral-900"
              />
              <span>{t('inStockOnly')}</span>
            </label>
          </div>

          {/* Category Filter */}
          <div>
            <label className="text-xs font-semibold text-neutral-900 block mb-2">
              {t('filterCategory')}
            </label>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-full text-xs py-2 px-2.5 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
            >
              <option value="all">Toutes les catégories</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name[lang] || c.name.fr}
                </option>
              ))}
            </select>
          </div>

          {/* Shape Filter */}
          <div>
            <label className="text-xs font-semibold text-neutral-900 block mb-2">
              {t('filterShape')}
            </label>
            <select
              value={selectedShape}
              onChange={e => setSelectedShape(e.target.value)}
              className="w-full text-xs py-2 px-2.5 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
            >
              <option value="all">Toutes les formes</option>
              <option value="round">{t('shapeRound')}</option>
              <option value="aviator">{t('shapeAviator')}</option>
              <option value="square">{t('shapeSquare')}</option>
              <option value="cat-eye">{t('shapeCatEye')}</option>
              <option value="geometric">{t('shapeGeometric')}</option>
            </select>
          </div>

          {/* Gender Filter */}
          <div>
            <label className="text-xs font-semibold text-neutral-900 block mb-2">
              {t('filterGender')}
            </label>
            <select
              value={selectedGender}
              onChange={e => setSelectedGender(e.target.value)}
              className="w-full text-xs py-2 px-2.5 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
            >
              <option value="all">Tous les genres</option>
              <option value="unisex">{t('genderUnisex')}</option>
              <option value="men">{t('genderMen')}</option>
              <option value="women">{t('genderWomen')}</option>
            </select>
          </div>

          {/* Material Filter */}
          <div>
            <label className="text-xs font-semibold text-neutral-900 block mb-2">
              {t('filterMaterial')}
            </label>
            <select
              value={selectedMaterial}
              onChange={e => setSelectedMaterial(e.target.value)}
              className="w-full text-xs py-2 px-2.5 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
            >
              <option value="all">Toutes les matières</option>
              <option value="titanium">{t('materialTitanium')}</option>
              <option value="acetate">{t('materialAcetate')}</option>
              <option value="metal">{t('materialMetal')}</option>
            </select>
          </div>

          {/* Brand Filter */}
          <div>
            <label className="text-xs font-semibold text-neutral-900 block mb-2">
              {t('filterBrand')}
            </label>
            <select
              value={selectedBrand}
              onChange={e => setSelectedBrand(e.target.value)}
              className="w-full text-xs py-2 px-2.5 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
            >
              <option value="all">Toutes les marques</option>
              {brands.map(b => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.country})
                </option>
              ))}
            </select>
          </div>

          {/* Store Filter */}
          <div>
            <label className="text-xs font-semibold text-neutral-900 block mb-2">
              {t('filterSeller')}
            </label>
            <select
              value={selectedStore}
              onChange={e => setSelectedStore(e.target.value)}
              className="w-full text-xs py-2 px-2.5 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
            >
              <option value="all">Toutes les boutiques</option>
              {stores.filter(s => s.status === 'approved').map(s => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range Slider */}
          <div>
            <div className="flex justify-between text-xs text-neutral-700 mb-1">
              <span className="font-semibold">{t('filterPrice')} max</span>
              <span className="tabular-nums font-mono">{formatPrice(maxPrice)}</span>
            </div>
            <input
              type="range"
              min="40"
              max="350"
              step="10"
              value={maxPrice}
              onChange={e => setMaxPrice(parseInt(e.target.value))}
              className="w-full accent-neutral-900"
            />
          </div>
        </aside>

        {/* Right Content Area */}
        <div className="md:col-span-3 space-y-6">
          
          {/* Active Filter Chips & Sort Dropdown */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-neutral-100/60 p-3 rounded-xl border border-neutral-200/60">
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-neutral-500 font-medium mr-1">Filtres actifs :</span>
              {selectedCategory !== 'all' && (
                <span className="bg-white px-2 py-0.5 rounded border border-neutral-200 text-neutral-800 flex items-center gap-1">
                  Catégorie
                  <button onClick={() => setSelectedCategory('all')} className="hover:text-red-500">×</button>
                </span>
              )}
              {selectedShape !== 'all' && (
                <span className="bg-white px-2 py-0.5 rounded border border-neutral-200 text-neutral-800 flex items-center gap-1">
                  Forme: {selectedShape}
                  <button onClick={() => setSelectedShape('all')} className="hover:text-red-500">×</button>
                </span>
              )}
              {onlyTryOn && (
                <span className="bg-white px-2 py-0.5 rounded border border-neutral-200 text-neutral-800 flex items-center gap-1">
                  Avec Essayage 2D
                  <button onClick={() => setOnlyTryOn(false)} className="hover:text-red-500">×</button>
                </span>
              )}
              {!hasActiveFilters && (
                <span className="text-neutral-400">Aucun filtre particulier</span>
              )}
            </div>

            {/* Sort Select */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-neutral-500 font-medium whitespace-nowrap">{t('sortBy')}:</span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="bg-white border border-neutral-200 rounded-lg px-2.5 py-1.5 font-medium text-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-900"
              >
                <option value="relevance">{t('sortRelevance')}</option>
                <option value="newest">{t('sortNewest')}</option>
                <option value="priceAsc">{t('sortPriceAsc')}</option>
                <option value="priceDesc">{t('sortPriceDesc')}</option>
                <option value="bestSelling">{t('sortBestSelling')}</option>
                <option value="highestRated">{t('sortHighestRated')}</option>
                <option value="mostTried">{t('sortMostTried')}</option>
              </select>
            </div>
          </div>

          {/* Product Cards Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onOpenTryOn={p => setActiveTryOnProduct(p)}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center space-y-4">
              <Glasses className="w-12 h-12 text-neutral-300 mx-auto" />
              <h3 className="text-base font-semibold text-neutral-800">
                {t('noResults')}
              </h3>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                Modifiez vos critères de recherche ou réinitialisez les filtres pour découvrir l'ensemble des collections.
              </p>
              <button
                onClick={resetAllFilters}
                className="px-4 py-2 bg-neutral-900 text-white text-xs font-semibold rounded-lg hover:bg-neutral-800 transition-colors"
              >
                {t('clearFilters')}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Try-on Modal */}
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
