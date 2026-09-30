import React from 'react';
import { Store } from '../../types';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useI18n } from '../../context/I18nContext';
import { useRouter } from '../../context/RouterContext';
import { MapPin, Star, Bookmark, ArrowRight, ArrowLeft } from 'lucide-react';

interface StoreCardProps {
  store: Store;
}

export const StoreCard: React.FC<StoreCardProps> = ({ store }) => {
  const { followedStores, toggleFollowStore, products } = useMarketplace();
  const { lang, t } = useI18n();
  const { navigate } = useRouter();

  const isFollowed = followedStores.includes(store.id);
  const storeProductCount = products.filter(p => p.storeId === store.id && p.status === 'published').length;

  const handleFollowClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFollowStore(store.id);
  };

  return (
    <div
      onClick={() => navigate(`/store/${store.slug}`)}
      className="group bg-white rounded-xl border border-neutral-200/80 overflow-hidden hover:border-neutral-400/80 transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md flex flex-col justify-between"
    >
      <div>
        {/* Cover Image */}
        <div className="relative h-32 bg-neutral-100 overflow-hidden">
          <img
            src={store.coverImage}
            alt={store.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          {/* Follow Button */}
          <button
            onClick={handleFollowClick}
            className={`absolute top-3 right-3 z-10 px-2.5 py-1 rounded-md text-xs font-medium backdrop-blur-md transition-colors flex items-center gap-1.5 ${
              isFollowed
                ? 'bg-amber-600 text-white'
                : 'bg-white/90 text-neutral-800 hover:bg-white'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isFollowed ? 'fill-current' : ''}`} />
            <span>{isFollowed ? t('unfollowStore') : t('followStore')}</span>
          </button>
        </div>

        {/* Store Info & Logo Lockup */}
        <div className="px-5 pt-0 pb-4 relative">
          {/* Circular Store Logo */}
          <div className="-mt-7 mb-3 relative">
            <div className="w-14 h-14 rounded-xl border-2 border-white bg-white overflow-hidden shadow-sm flex items-center justify-center">
              <img
                src={store.logo}
                alt={store.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 mb-1.5">
            <h3 className="font-semibold text-base text-neutral-900 group-hover:text-amber-700 transition-colors">
              {store.name}
            </h3>
            {store.rating > 0 && (
              <div className="flex items-center gap-1 text-xs font-semibold text-neutral-800">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span className="tabular-nums">{store.rating.toFixed(1)}</span>
                <span className="text-neutral-400 font-normal">({store.reviewCount})</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 text-xs text-neutral-500 mb-3">
            <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <span className="truncate">{store.location}</span>
          </div>

          <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed mb-4">
            {store.description[lang] || store.description.fr}
          </p>
        </div>
      </div>

      {/* Footer bar */}
      <div className="px-5 py-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500 bg-neutral-50/50">
        <span>{storeProductCount} montures</span>
        <span className="font-medium text-neutral-900 group-hover:text-amber-700 flex items-center gap-1">
          {t('visitStore')}
          {lang === 'ar' ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
        </span>
      </div>
    </div>
  );
};
