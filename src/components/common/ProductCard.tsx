import React, { useState } from 'react';
import { Product } from '../../types';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useI18n } from '../../context/I18nContext';
import { useRouter } from '../../context/RouterContext';
import { Heart, ShoppingBag, Glasses } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onOpenTryOn?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onOpenTryOn }) => {
  const { addToCart, favorites, toggleFavorite } = useMarketplace();
  const { lang, formatPrice, t } = useI18n();
  const { navigate } = useRouter();

  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const isFav = favorites.includes(product.id);
  const variant = product.variants[selectedVariantIndex] || product.variants[0];
  const activePrice = variant?.promotionalPrice || variant?.price || product.promotionalPrice || product.price;
  const originalPrice = variant?.promotionalPrice ? variant.price : (product.promotionalPrice ? product.price : null);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    const success = addToCart(product, variant?.id, 1);
    if (success) {
      setAddedAnimation(true);
      setTimeout(() => setAddedAnimation(false), 1200);
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(product.id);
  };

  const handleTryOnClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onOpenTryOn) {
      onOpenTryOn(product);
    } else {
      navigate(`/try-on?productId=${product.id}`);
    }
  };

  return (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      className="group flex flex-col bg-white rounded-xl border border-neutral-200/80 overflow-hidden hover:border-neutral-400/80 transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md"
    >
      {/* Image Showcase (65-75% height ratio) */}
      <div className="relative aspect-4/3 bg-neutral-100/70 overflow-hidden flex items-center justify-center p-4">
        {/* Subtle Category Kicker or Discount */}
        {originalPrice && (
          <div className="absolute top-3 left-3 z-10 text-[11px] font-semibold text-amber-700 bg-amber-50/90 backdrop-blur-xs px-2 py-0.5 rounded border border-amber-200/60">
            Promo
          </div>
        )}

        {/* Favorite Action Button */}
        <button
          onClick={handleFavoriteClick}
          aria-label="Ajouter aux favoris"
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-neutral-600 hover:text-red-500 hover:bg-white transition-all shadow-xs"
        >
          <Heart className={`w-4 h-4 ${isFav ? 'fill-red-500 text-red-500' : ''}`} />
        </button>

        {/* Product Image with Fallback Container */}
        <img
          src={product.images[0]}
          alt={product.name[lang] || product.name.fr}
          referrerPolicy="no-referrer"
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-neutral-100 text-neutral-400">
            <Glasses className="w-8 h-8 opacity-40 animate-pulse" />
          </div>
        )}

        {/* Quick 2D Try-on Hover Bar */}
        {product.tryOnAsset?.supported && (
          <div className="absolute bottom-3 inset-x-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex items-center gap-2">
            <button
              onClick={handleTryOnClick}
              className="flex-1 bg-white/95 backdrop-blur-md text-neutral-900 text-xs font-semibold py-2 px-3 rounded-lg shadow-sm hover:bg-neutral-900 hover:text-white transition-all flex items-center justify-center gap-1.5"
            >
              <Glasses className="w-3.5 h-3.5 text-amber-600" />
              <span>{t('tryOnThisFrame')}</span>
            </button>
          </div>
        )}
      </div>

      {/* Card Content & Clean Unboxed Metadata */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Brand & Shape kicker with typographic separator */}
          <div className="flex items-center gap-1.5 text-xs text-neutral-500 mb-1">
            <span className="font-medium tracking-wide uppercase text-[10px] text-neutral-600">
              {product.brandName}
            </span>
            <span aria-hidden="true">·</span>
            <span className="capitalize">{t(`shape${product.shape.charAt(0).toUpperCase() + product.shape.slice(1).replace('-', '')}` as any) || product.shape}</span>
          </div>

          {/* Product Name */}
          <h3 className="text-sm font-semibold text-neutral-900 group-hover:text-amber-700 transition-colors line-clamp-1">
            {product.name[lang] || product.name.fr}
          </h3>

          {/* Color Swatches */}
          {product.variants.length > 1 && (
            <div className="flex items-center gap-1.5 mt-2" onClick={e => e.stopPropagation()}>
              {product.variants.map((v, i) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariantIndex(i)}
                  title={v.colorName[lang] || v.colorName.fr}
                  className={`w-3.5 h-3.5 rounded-full border transition-all ${
                    selectedVariantIndex === i
                      ? 'ring-2 ring-neutral-900 ring-offset-1 scale-110'
                      : 'border-neutral-300 hover:scale-105'
                  }`}
                  style={{ backgroundColor: v.colorHex }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer: Price + Add to Cart */}
        <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-semibold text-neutral-900 tabular-nums">
              {formatPrice(activePrice)}
            </span>
            {originalPrice && (
              <span className="text-xs text-neutral-400 line-through tabular-nums">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className={`p-2 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
              product.stock <= 0
                ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                : addedAnimation
                ? 'bg-emerald-600 text-white'
                : 'bg-neutral-900 text-white hover:bg-neutral-800'
            }`}
            title={product.stock <= 0 ? t('outOfStock') : t('addToCart')}
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">
              {addedAnimation ? 'Ajouté' : product.stock <= 0 ? t('outOfStock') : '+'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
