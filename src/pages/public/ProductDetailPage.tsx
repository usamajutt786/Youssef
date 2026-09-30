import React, { useState } from 'react';
import { useRouter } from '../../context/RouterContext';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useAuth } from '../../context/AuthContext';
import { useI18n } from '../../context/I18nContext';
import { VirtualTryOnCanvas } from '../../components/tryon/VirtualTryOnCanvas';
import {
  Heart,
  ShoppingBag,
  Glasses,
  Store as StoreIcon,
  ShieldCheck,
  Truck,
  RotateCcw,
  Star,
  Check,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const { productIdParam, navigate } = useRouter();
  const { products, stores, addToCart, favorites, toggleFavorite, reviews, addReview } = useMarketplace();
  const { currentUser } = useAuth();
  const { t, lang, formatPrice, formatDate } = useI18n();

  const product = products.find(p => p.id === productIdParam) || products[0];
  const store = stores.find(s => s.id === product?.storeId);

  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    product?.variants[0]?.id || ''
  );
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showTryOn, setShowTryOn] = useState(false);
  const [addedToast, setAddedToast] = useState(false);

  // Review Form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold">Produit introuvable</h2>
        <button
          onClick={() => navigate('/catalog')}
          className="mt-4 px-4 py-2 bg-neutral-900 text-white rounded-lg text-sm"
        >
          Retour au catalogue
        </button>
      </div>
    );
  }

  const selectedVariant =
    product.variants.find(v => v.id === selectedVariantId) || product.variants[0];

  const currentPrice = selectedVariant?.promotionalPrice || selectedVariant?.price || product.promotionalPrice || product.price;
  const originalPrice = selectedVariant?.promotionalPrice ? selectedVariant.price : (product.promotionalPrice ? product.price : null);
  const availableStock = selectedVariant?.stock ?? product.stock;
  const isFav = favorites.includes(product.id);

  // Reviews for this product
  const productReviews = reviews.filter(r => r.productId === product.id && r.status === 'approved');

  const handleAddToCart = () => {
    if (availableStock <= 0) return;
    const success = addToCart(product, selectedVariant?.id, quantity);
    if (success) {
      setAddedToast(true);
      setTimeout(() => setAddedToast(false), 2000);
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    addReview({
      productId: product.id,
      productName: product.name.fr,
      storeId: product.storeId,
      storeName: store?.name || 'Optique Store',
      customerId: currentUser?.id || 'guest',
      customerName: currentUser?.name || 'Client Optique',
      rating: reviewRating,
      comment: reviewComment.trim(),
      verifiedPurchase: true
    });

    setReviewComment('');
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-neutral-500">
        <button onClick={() => navigate('/')} className="hover:text-neutral-900 transition-colors">
          {t('navHome')}
        </button>
        <span>/</span>
        <button onClick={() => navigate('/catalog')} className="hover:text-neutral-900 transition-colors">
          {t('navCatalog')}
        </button>
        <span>/</span>
        <span className="text-neutral-900 font-medium truncate max-w-xs">
          {product.name[lang] || product.name.fr}
        </span>
      </nav>

      {/* Main Contiguous Purchase Module (Gallery Left, Details Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-4/3 bg-neutral-100 rounded-2xl overflow-hidden border border-neutral-200/80 flex items-center justify-center p-6">
            <img
              src={product.images[selectedImageIndex] || product.images[0]}
              alt={product.name[lang] || product.name.fr}
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain mix-blend-multiply"
            />

            {/* Favorite Action */}
            <button
              onClick={() => toggleFavorite(product.id)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-neutral-700 hover:text-red-500 hover:bg-white shadow-xs transition-colors"
            >
              <Heart className={`w-5 h-5 ${isFav ? 'fill-red-500 text-red-500' : ''}`} />
            </button>

            {/* Try-On Button Badge if Supported */}
            {product.tryOnAsset?.supported && (
              <button
                onClick={() => setShowTryOn(true)}
                className="absolute bottom-4 left-4 z-10 bg-neutral-900/90 hover:bg-neutral-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 backdrop-blur-md transition-all"
              >
                <Glasses className="w-4 h-4 text-amber-400" />
                <span>{t('tryOnThisFrame')}</span>
              </button>
            )}
          </div>

          {/* Gallery Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex items-center gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-20 h-16 rounded-lg overflow-hidden border-2 bg-neutral-100 p-1 transition-all ${
                    selectedImageIndex === idx
                      ? 'border-neutral-900 ring-2 ring-neutral-900/20'
                      : 'border-neutral-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Aperçu" className="w-full h-full object-contain mix-blend-multiply" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Contiguous Purchase Module */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            {/* Brand & Reference */}
            <div className="flex items-center justify-between text-xs text-neutral-500 mb-2">
              <span className="font-semibold uppercase tracking-wider text-neutral-700">
                {product.brandName}
              </span>
              <span className="font-mono">{t('ref')}: {product.reference}</span>
            </div>

            {/* Title */}
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-neutral-900 leading-snug">
              {product.name[lang] || product.name.fr}
            </h1>

            {/* Seller Link */}
            {store && (
              <div className="flex items-center gap-1.5 mt-2 text-xs text-neutral-600">
                <span>{t('soldBy')}</span>
                <button
                  onClick={() => navigate(`/store/${store.slug}`)}
                  className="font-semibold text-neutral-900 hover:text-amber-700 underline flex items-center gap-1"
                >
                  <StoreIcon className="w-3.5 h-3.5" />
                  <span>{store.name}</span>
                </button>
              </div>
            )}

            {/* Price block */}
            <div className="flex items-baseline gap-3 mt-4">
              <span className="text-3xl font-extrabold text-neutral-900 tabular-nums">
                {formatPrice(currentPrice)}
              </span>
              {originalPrice && (
                <span className="text-base text-neutral-400 line-through tabular-nums">
                  {formatPrice(originalPrice)}
                </span>
              )}
            </div>
          </div>

          {/* Color Variants Selection */}
          {product.variants.length > 0 && (
            <div className="space-y-2.5 pt-4 border-t border-neutral-100">
              <label className="text-xs font-semibold text-neutral-900 block">
                {t('selectColor')} : <span className="font-normal text-neutral-600">{selectedVariant?.colorName[lang] || selectedVariant?.colorName.fr}</span>
              </label>
              <div className="flex items-center gap-2.5">
                {product.variants.map(variant => (
                  <button
                    key={variant.id}
                    onClick={() => {
                      setSelectedVariantId(variant.id);
                      setQuantity(1);
                    }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs transition-all ${
                      selectedVariantId === variant.id
                        ? 'border-neutral-900 bg-neutral-50 ring-1 ring-neutral-900 font-semibold'
                        : 'border-neutral-200 hover:border-neutral-400'
                    }`}
                  >
                    <span
                      className="w-4 h-4 rounded-full border border-neutral-300"
                      style={{ backgroundColor: variant.colorHex }}
                    />
                    <span>{variant.colorName[lang] || variant.colorName.fr}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size & Stock Information */}
          <div className="flex items-center justify-between text-xs py-2 border-y border-neutral-100">
            <div>
              <span className="text-neutral-500">{t('selectSize')}: </span>
              <span className="font-semibold text-neutral-900">{selectedVariant?.size || 'Standard'}</span>
            </div>
            <div>
              {availableStock > 0 ? (
                <span className="text-emerald-700 font-medium flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>{t('inStock')} ({availableStock})</span>
                </span>
              ) : (
                <span className="text-red-600 font-medium">
                  {t('outOfStock')}
                </span>
              )}
            </div>
          </div>

          {/* Quantity & Buy CTA */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              {/* Quantity stepper */}
              <div className="flex items-center border border-neutral-300 rounded-xl bg-white overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1 || availableStock <= 0}
                  className="px-3.5 py-2.5 text-neutral-600 hover:bg-neutral-100 disabled:opacity-40"
                >
                  -
                </button>
                <span className="px-4 py-2.5 text-xs font-semibold text-neutral-900 tabular-nums">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(availableStock, quantity + 1))}
                  disabled={quantity >= availableStock || availableStock <= 0}
                  className="px-3.5 py-2.5 text-neutral-600 hover:bg-neutral-100 disabled:opacity-40"
                >
                  +
                </button>
              </div>

              {/* Add to Cart CTA */}
              <button
                onClick={handleAddToCart}
                disabled={availableStock <= 0}
                className={`flex-1 py-3 px-6 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-sm ${
                  availableStock <= 0
                    ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                    : addedToast
                    ? 'bg-emerald-600 text-white'
                    : 'bg-neutral-900 text-white hover:bg-neutral-800'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{addedToast ? 'Ajouté au panier !' : t('addToCart')}</span>
              </button>
            </div>

            {/* Try-on Secondary Button */}
            {product.tryOnAsset?.supported && (
              <button
                onClick={() => setShowTryOn(true)}
                className="w-full py-2.5 px-4 rounded-xl border border-neutral-300 text-neutral-800 hover:bg-neutral-50 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <Glasses className="w-4 h-4 text-amber-600" />
                <span>{t('tryOnThisFrame')}</span>
              </button>
            )}
          </div>

          {/* COD Notice Box */}
          <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-3.5 text-xs text-amber-950 space-y-1">
            <div className="font-semibold flex items-center gap-1.5 text-amber-900">
              <Truck className="w-4 h-4" />
              <span>{t('codPaymentMethodTitle')}</span>
            </div>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              {t('codPaymentDescription')}
            </p>
          </div>

          {/* Optical Dimensions Breakdown */}
          <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200/80 space-y-2 text-xs">
            <h4 className="font-semibold text-neutral-900">
              {t('dimensionsTitle')}
            </h4>
            <div className="grid grid-cols-3 gap-2 text-center pt-1 font-mono">
              <div className="bg-white p-2 rounded border border-neutral-200">
                <span className="text-neutral-500 block text-[10px]">{t('lensWidth')}</span>
                <span className="font-bold text-neutral-900">{product.dimensions.lensWidth} mm</span>
              </div>
              <div className="bg-white p-2 rounded border border-neutral-200">
                <span className="text-neutral-500 block text-[10px]">{t('bridgeWidth')}</span>
                <span className="font-bold text-neutral-900">{product.dimensions.bridgeWidth} mm</span>
              </div>
              <div className="bg-white p-2 rounded border border-neutral-200">
                <span className="text-neutral-500 block text-[10px]">{t('templeLength')}</span>
                <span className="font-bold text-neutral-900">{product.dimensions.templeLength} mm</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2 text-xs text-neutral-600 leading-relaxed">
            <h4 className="font-semibold text-neutral-900">Description détaillée</h4>
            <p>{product.description[lang] || product.description.fr}</p>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <section className="pt-8 border-t border-neutral-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-display text-xl font-bold text-neutral-900">
              {t('customerReviews')} ({productReviews.length})
            </h3>
            <div className="flex items-center gap-1.5 mt-1 text-xs">
              <div className="flex items-center text-amber-500">
                <Star className="w-4 h-4 fill-current" />
              </div>
              <span className="font-bold text-neutral-900">{product.rating.toFixed(1)} / 5</span>
              <span className="text-neutral-400">· Avis certifiés</span>
            </div>
          </div>
        </div>

        {/* Existing Reviews List */}
        <div className="space-y-4">
          {productReviews.length > 0 ? (
            productReviews.map(rev => (
              <div key={rev.id} className="p-4 bg-white rounded-xl border border-neutral-200 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-neutral-900">{rev.customerName}</span>
                    {rev.verifiedPurchase && (
                      <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                        {t('verifiedBuyer')}
                      </span>
                    )}
                  </div>
                  <span className="text-neutral-400">{formatDate(rev.createdAt)}</span>
                </div>
                <div className="flex items-center text-amber-500">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <p className="text-neutral-700 leading-relaxed">{rev.comment}</p>
              </div>
            ))
          ) : (
            <p className="text-xs text-neutral-500 italic">{t('noReviewsYet')}</p>
          )}
        </div>

        {/* Write a Review Form */}
        <div className="mt-8 bg-neutral-50 p-6 rounded-2xl border border-neutral-200/80 max-w-xl">
          <h4 className="text-sm font-semibold text-neutral-900 mb-3">{t('writeReview')}</h4>
          <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-neutral-600 mb-1">Votre note</label>
              <div className="flex items-center gap-1 text-amber-500">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star className={`w-5 h-5 ${star <= reviewRating ? 'fill-current' : 'text-neutral-300'}`} />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-neutral-600 mb-1">Commentaire</label>
              <textarea
                rows={3}
                value={reviewComment}
                onChange={e => setReviewComment(e.target.value)}
                placeholder="Partagez votre avis sur le confort, la matière et le rendu de cette monture..."
                className="w-full p-2.5 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
              />
            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-neutral-900 text-white font-medium rounded-lg hover:bg-neutral-800 transition-colors"
            >
              Publier mon avis
            </button>

            {reviewSubmitted && (
              <span className="text-emerald-700 font-medium ml-3">
                Avis enregistré avec succès !
              </span>
            )}
          </form>
        </div>
      </section>

      {/* 2D Try-on Modal */}
      {showTryOn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in">
          <VirtualTryOnCanvas
            initialProductId={product.id}
            onClose={() => setShowTryOn(false)}
          />
        </div>
      )}
    </div>
  );
};
