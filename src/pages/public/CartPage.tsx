import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useI18n } from '../../context/I18nContext';
import { useRouter } from '../../context/RouterContext';
import {
  ShoppingBag,
  Trash2,
  Store as StoreIcon,
  Tag,
  ArrowRight,
  ArrowLeft,
  Truck,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export const CartPage: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    getCartTotal
  } = useMarketplace();
  const { t, lang, formatPrice } = useI18n();
  const { navigate } = useRouter();

  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ success?: boolean; message?: string } | null>(null);

  const totals = getCartTotal();

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    setCouponFeedback(res);
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto text-neutral-400">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h1 className="font-display text-2xl font-bold text-neutral-900">
          {t('shoppingCart')}
        </h1>
        <p className="text-sm text-neutral-500">
          {t('cartEmpty')}
        </p>
        <div className="pt-2">
          <button
            onClick={() => navigate('/catalog')}
            className="px-6 py-3 bg-neutral-900 text-white text-xs font-semibold rounded-xl hover:bg-neutral-800 transition-colors"
          >
            {t('continueShopping')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-neutral-900 tracking-tight">
          {t('shoppingCart')}
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          {t('itemsGroupedByStore')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Store-Grouped Cart Items */}
        <div className="lg:col-span-8 space-y-6">
          {totals.itemsByStore.map(group => (
            <div
              key={group.store.id}
              className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs"
            >
              {/* Store Header */}
              <div className="bg-neutral-50/80 px-6 py-3.5 border-b border-neutral-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <StoreIcon className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-bold text-neutral-900 uppercase tracking-wide">
                    {group.store.name}
                  </span>
                  <span className="text-[11px] text-neutral-400">({group.store.location})</span>
                </div>
                <div className="text-xs text-neutral-600 flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-neutral-400" />
                  <span>
                    Livraison :{' '}
                    <strong className="text-neutral-900">
                      {group.shipping === 0 ? 'Offerte' : formatPrice(group.shipping)}
                    </strong>
                  </span>
                </div>
              </div>

              {/* Items List */}
              <div className="divide-y divide-neutral-100 p-6 space-y-4">
                {group.items.map(item => (
                  <div key={item.id} className="pt-4 first:pt-0 flex items-center gap-4">
                    {/* Item Image */}
                    <div className="w-20 h-20 bg-neutral-100 rounded-xl overflow-hidden p-2 shrink-0 border border-neutral-200/60">
                      <img
                        src={item.image}
                        alt={item.productName.fr}
                        className="w-full h-full object-contain mix-blend-multiply"
                      />
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-neutral-900 truncate">
                        {item.productName[lang] || item.productName.fr}
                      </h4>
                      <p className="text-xs text-neutral-500 mt-0.5">
                        Réf: {item.reference} · Coloris: {item.selectedColor[lang] || item.selectedColor.fr} · Taille: {item.selectedSize}
                      </p>
                      <div className="text-xs font-semibold text-neutral-900 mt-1 tabular-nums">
                        {formatPrice(item.unitPrice)}
                      </div>
                    </div>

                    {/* Quantity Stepper */}
                    <div className="flex items-center border border-neutral-200 rounded-lg bg-white overflow-hidden">
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="px-2.5 py-1 text-neutral-600 hover:bg-neutral-100 text-xs"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 text-xs font-semibold text-neutral-900 tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.availableStock}
                        className="px-2.5 py-1 text-neutral-600 hover:bg-neutral-100 text-xs disabled:opacity-40"
                      >
                        +
                      </button>
                    </div>

                    {/* Total Item Price */}
                    <div className="text-right min-w-20">
                      <span className="text-sm font-bold text-neutral-900 tabular-nums">
                        {formatPrice(item.unitPrice * item.quantity)}
                      </span>
                    </div>

                    {/* Delete action */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-1.5 text-neutral-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Store Subtotal Footer */}
              <div className="bg-neutral-50/50 px-6 py-3 border-t border-neutral-100 flex justify-between text-xs text-neutral-600">
                <span>{t('storeSubtotal')} ({group.items.length} articles)</span>
                <span className="font-semibold text-neutral-900 tabular-nums">
                  {formatPrice(group.subtotal + group.shipping)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Order Summary & Coupon */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-neutral-200 space-y-5 shadow-xs">
            <h3 className="font-display text-lg font-bold text-neutral-900">
              {t('orderSummary')}
            </h3>

            {/* Coupon Code Input */}
            <form onSubmit={handleApplyCoupon} className="space-y-2">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
                  <input
                    type="text"
                    value={couponInput}
                    onChange={e => setCouponInput(e.target.value)}
                    placeholder={t('couponCodePlaceholder')}
                    className="w-full pl-8 pr-3 py-2 text-xs border border-neutral-200 rounded-lg uppercase tracking-wider focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3 py-2 bg-neutral-900 text-white text-xs font-semibold rounded-lg hover:bg-neutral-800 transition-colors"
                >
                  {t('applyCoupon')}
                </button>
              </div>

              {couponFeedback && (
                <p className={`text-[11px] flex items-center gap-1 ${couponFeedback.success ? 'text-emerald-700' : 'text-red-600'}`}>
                  {couponFeedback.success ? <CheckCircle className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                  <span>{couponFeedback.message}</span>
                </p>
              )}

              {appliedCoupon && (
                <div className="flex items-center justify-between text-xs bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-lg border border-emerald-200">
                  <span>Code <strong>{appliedCoupon.code}</strong> actif (-{appliedCoupon.discountValue}%)</span>
                  <button onClick={removeCoupon} className="text-emerald-900 hover:underline">
                    Retirer
                  </button>
                </div>
              )}
            </form>

            {/* Totals Breakdown */}
            <div className="space-y-2.5 text-xs text-neutral-600 pt-3 border-t border-neutral-100">
              <div className="flex justify-between">
                <span>{t('subtotal')}</span>
                <span className="font-medium text-neutral-900 tabular-nums">{formatPrice(totals.subtotal)}</span>
              </div>

              <div className="flex justify-between">
                <span>{t('shippingTotal')}</span>
                <span className="font-medium text-neutral-900 tabular-nums">
                  {totals.shippingTotal === 0 ? 'Gratuit' : formatPrice(totals.shippingTotal)}
                </span>
              </div>

              {totals.discountTotal > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>{t('discount')}</span>
                  <span className="font-semibold tabular-nums">-{formatPrice(totals.discountTotal)}</span>
                </div>
              )}

              <div className="flex justify-between text-base font-bold text-neutral-900 pt-3 border-t border-neutral-200">
                <span>{t('grandTotal')}</span>
                <span className="tabular-nums">{formatPrice(totals.grandTotal)}</span>
              </div>
            </div>

            {/* Cash on Delivery Notice */}
            <div className="bg-amber-50 rounded-xl p-3 border border-amber-200 text-[11px] text-amber-900 space-y-1">
              <p className="font-semibold">{t('codPaymentMethodTitle')}</p>
              <p className="text-amber-800">
                {t('codPaymentDescription')}
              </p>
            </div>

            {/* Checkout Action */}
            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-3.5 px-4 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <span>{t('proceedToCheckout')}</span>
              {lang === 'ar' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
