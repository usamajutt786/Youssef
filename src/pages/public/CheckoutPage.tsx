import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useAuth } from '../../context/AuthContext';
import { useI18n } from '../../context/I18nContext';
import { useRouter } from '../../context/RouterContext';
import { Order } from '../../types';
import {
  Truck,
  CheckCircle2,
  ShieldCheck,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
  Store as StoreIcon
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const { cart, getCartTotal, placeOrder, settings } = useMarketplace();
  const { currentUser } = useAuth();
  const { t, lang, formatPrice } = useI18n();
  const { navigate } = useRouter();

  const totals = getCartTotal();

  // Form Fields
  const [firstName, setFirstName] = useState(currentUser?.name.split(' ')[0] || 'Amina');
  const [lastName, setLastName] = useState(currentUser?.name.split(' ').slice(1).join(' ') || 'Benali');
  const [email, setEmail] = useState(currentUser?.email || 'amina@example.com');
  const [phone, setPhone] = useState(currentUser?.phone || '+212 661 234567');
  const [country, setCountry] = useState('Maroc');
  const [city, setCity] = useState('Casablanca');
  const [addressLine, setAddressLine] = useState('42 Rue Ibn Batouta, Étage 3, Apt 12');
  const [postalCode, setPostalCode] = useState('20250');
  const [orderNotes, setOrderNotes] = useState('');

  // Confirmation state
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (cart.length === 0 && !confirmedOrder) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold">{t('cartEmpty')}</h2>
        <button
          onClick={() => navigate('/catalog')}
          className="px-4 py-2 bg-neutral-900 text-white rounded-lg text-xs"
        >
          {t('continueShopping')}
        </button>
      </div>
    );
  }

  // Handle Order Placement
  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !phone || !addressLine || !city) {
      alert('Veuillez renseigner tous les champs obligatoires.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const order = placeOrder(
        {
          name: `${firstName} ${lastName}`.trim(),
          email: email.trim(),
          phone: phone.trim()
        },
        {
          country,
          city,
          addressLine,
          postalCode
        },
        orderNotes
      );

      setIsSubmitting(false);
      if (order) {
        setConfirmedOrder(order);
      }
    }, 600);
  };

  // Success Screen
  if (confirmedOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-8 animate-in fade-in">
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-neutral-200 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <h1 className="font-display text-2xl sm:text-3xl font-bold text-neutral-900">
            {t('orderSuccessTitle')}
          </h1>

          <p className="text-sm text-neutral-600 max-w-md mx-auto leading-relaxed">
            {t('orderSuccessMsg')}
          </p>

          <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 inline-block text-xs font-mono text-neutral-800">
            {t('orderNumber')} : <strong>{confirmedOrder.id}</strong>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 max-w-lg mx-auto text-left space-y-1">
            <p className="font-bold flex items-center gap-1.5 text-amber-950">
              <Truck className="w-4 h-4" />
              <span>{t('paymentPendingCod')}</span>
            </p>
            <p className="text-amber-800 leading-relaxed">
              Montant total à régler en espèces au livreur lors de la livraison :{' '}
              <strong className="text-neutral-950">{formatPrice(confirmedOrder.grandTotal)}</strong>.
            </p>
          </div>

          {/* Sub-Orders Breakdown for Customer */}
          <div className="pt-6 border-t border-neutral-200 text-left space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Expéditions par boutique ({confirmedOrder.subOrders.length} colis) :
            </h3>
            {confirmedOrder.subOrders.map(sub => (
              <div key={sub.subOrderId} className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 text-xs space-y-2">
                <div className="flex justify-between font-semibold text-neutral-900">
                  <span className="flex items-center gap-1.5">
                    <StoreIcon className="w-3.5 h-3.5 text-amber-600" />
                    {sub.storeName}
                  </span>
                  <span>{formatPrice(sub.subtotal + sub.shippingCost)}</span>
                </div>
                <p className="text-neutral-500 text-[11px]">
                  Sous-commande : {sub.subOrderId} · Transporteur : {sub.trackingCarrier}
                </p>
              </div>
            ))}
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => navigate('/customer/dashboard?tab=orders')}
              className="px-6 py-3 bg-neutral-900 text-white text-xs font-semibold rounded-xl hover:bg-neutral-800 transition-colors"
            >
              {t('viewMyOrders')}
            </button>
            <button
              onClick={() => navigate('/catalog')}
              className="px-6 py-3 bg-neutral-100 text-neutral-800 text-xs font-semibold rounded-xl hover:bg-neutral-200 transition-colors"
            >
              {t('continueShopping')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-neutral-900 tracking-tight">
          {t('checkoutTitle')}
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          Paiement à la livraison uniquement (Cash on Delivery).
        </p>
      </div>

      <form onSubmit={handleConfirmOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Form Steps */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Step 1: Customer Contact */}
          <div className="bg-white p-6 rounded-2xl border border-neutral-200 space-y-4">
            <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-wide">
              {t('step1Contact')}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-neutral-700 font-medium mb-1">{t('firstName')} *</label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>

              <div>
                <label className="block text-neutral-700 font-medium mb-1">{t('lastName')} *</label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>

              <div>
                <label className="block text-neutral-700 font-medium mb-1">{t('email')} *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>

              <div>
                <label className="block text-neutral-700 font-medium mb-1">{t('phone')} *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+212 6..."
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>
            </div>
          </div>

          {/* Step 2: Delivery Address */}
          <div className="bg-white p-6 rounded-2xl border border-neutral-200 space-y-4">
            <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-wide">
              {t('step2Address')}
            </h2>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">{t('country')} *</label>
                  <select
                    value={country}
                    onChange={e => setCountry(e.target.value)}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  >
                    <option value="Maroc">Maroc</option>
                    <option value="France">France</option>
                    <option value="Tunisie">Tunisie</option>
                    <option value="Algérie">Algérie</option>
                    <option value="Belgique">Belgique</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-700 font-medium mb-1">{t('city')} *</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-700 font-medium mb-1">{t('address')} *</label>
                <input
                  type="text"
                  required
                  value={addressLine}
                  onChange={e => setAddressLine(e.target.value)}
                  placeholder="Rue, bâtiment, étage, numéro d'appartement..."
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>

              <div className="w-1/2">
                <label className="block text-neutral-700 font-medium mb-1">{t('postalCode')} *</label>
                <input
                  type="text"
                  required
                  value={postalCode}
                  onChange={e => setPostalCode(e.target.value)}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>
            </div>
          </div>

          {/* Step 3: Shipping by Store */}
          <div className="bg-white p-6 rounded-2xl border border-neutral-200 space-y-4">
            <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-wide">
              {t('step3Shipping')}
            </h2>
            <div className="space-y-3">
              {totals.itemsByStore.map(group => (
                <div key={group.store.id} className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <StoreIcon className="w-4 h-4 text-amber-600" />
                    <div>
                      <strong className="text-neutral-900">{group.store.name}</strong>
                      <span className="text-neutral-500 block text-[11px]">{t('standardDelivery')}</span>
                    </div>
                  </div>
                  <span className="font-semibold text-neutral-900">
                    {group.shipping === 0 ? 'Gratuit' : formatPrice(group.shipping)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Step 4: Payment Method - CASH ON DELIVERY ONLY */}
          <div className="bg-white p-6 rounded-2xl border-2 border-amber-500/60 space-y-3">
            <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-wide">
              {t('step4Payment')}
            </h2>

            <div className="flex items-start gap-3 p-3 bg-amber-50/80 rounded-xl border border-amber-200">
              <input
                type="radio"
                name="payment"
                checked
                readOnly
                className="mt-1 text-amber-600 focus:ring-amber-500"
              />
              <div className="text-xs space-y-1">
                <strong className="text-neutral-900 block font-semibold text-sm">
                  {t('codPaymentMethodTitle')}
                </strong>
                <p className="text-neutral-600 leading-relaxed">
                  {t('codPaymentDescription')}
                </p>
              </div>
            </div>
          </div>

          {/* Additional Notes */}
          <div className="bg-white p-6 rounded-2xl border border-neutral-200 space-y-2">
            <label className="text-xs font-semibold text-neutral-900 block">
              Instructions spéciales de livraison (optionnel)
            </label>
            <textarea
              rows={2}
              value={orderNotes}
              onChange={e => setOrderNotes(e.target.value)}
              placeholder="Exemple : Sonner au 3ème étage, code d'interphone 1234..."
              className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-neutral-900"
            />
          </div>
        </div>

        {/* Right Column: Order Review & Confirm CTA */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-neutral-200 space-y-5 sticky top-24 shadow-xs">
            <h3 className="font-display text-lg font-bold text-neutral-900">
              {t('step5Review')}
            </h3>

            {/* Cart Items Summary */}
            <div className="divide-y divide-neutral-100 max-h-60 overflow-y-auto pr-1 space-y-3">
              {cart.map(item => (
                <div key={item.id} className="pt-3 first:pt-0 flex items-center justify-between text-xs gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <img src={item.image} alt="" className="w-10 h-10 object-contain bg-neutral-50 rounded shrink-0 p-1" />
                    <div className="truncate">
                      <p className="font-semibold text-neutral-900 truncate">{item.productName[lang] || item.productName.fr}</p>
                      <p className="text-neutral-500 text-[11px]">Qté: {item.quantity} · {item.selectedColor[lang] || item.selectedColor.fr}</p>
                    </div>
                  </div>
                  <span className="font-semibold text-neutral-900 shrink-0 tabular-nums">
                    {formatPrice(item.unitPrice * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="space-y-2 text-xs text-neutral-600 pt-3 border-t border-neutral-100">
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

            {/* Confirm Order Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-4 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 uppercase tracking-wide"
            >
              {isSubmitting ? (
                <span>Enregistrement...</span>
              ) : (
                <>
                  <Truck className="w-4 h-4 text-amber-400" />
                  <span>{t('confirmOrderButton')}</span>
                </>
              )}
            </button>

            <p className="text-[11px] text-neutral-400 text-center">
              En confirmant, vous vous engagez à régler le montant en espèces au transporteur lors de la remise du colis.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};
