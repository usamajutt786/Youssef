import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useI18n } from '../../context/I18nContext';
import { useRouter } from '../../context/RouterContext';
import { Order, OrderStatus } from '../../types';
import {
  Package,
  Heart,
  Bookmark,
  MapPin,
  Bell,
  User as UserIcon,
  LogOut,
  RotateCcw,
  Truck,
  CheckCircle2,
  Clock,
  Store as StoreIcon,
  Glasses
} from 'lucide-react';

export const CustomerDashboard: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const {
    orders,
    favorites,
    followedStores,
    products,
    stores,
    notifications,
    markNotificationRead,
    requestOrderReturn
  } = useMarketplace();
  const { t, lang, formatPrice, formatDate } = useI18n();
  const { navigate } = useRouter();

  // Tab state
  const [activeTab, setActiveTab] = useState<'orders' | 'favorites' | 'followed' | 'notifications' | 'profile'>('orders');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Return dialog state
  const [returnDialogOpen, setReturnDialogOpen] = useState(false);
  const [returnSubOrderId, setReturnSubOrderId] = useState('');
  const [returnReason, setReturnReason] = useState('La monture ne convient pas à la morphologie de mon visage');
  const [returnNotes, setReturnNotes] = useState('');
  const [returnSuccess, setReturnSuccess] = useState(false);

  // Route Guard check
  if (!currentUser || currentUser.role !== 'customer') {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-lg font-bold text-neutral-900">Accès réservé aux clients</h2>
        <p className="text-xs text-neutral-500">
          Veuillez vous connecter avec un compte client pour accéder à cet espace.
        </p>
        <button
          onClick={() => navigate('/customer/login')}
          className="px-4 py-2 bg-neutral-900 text-white rounded-lg text-xs font-semibold"
        >
          {t('customerPortal')}
        </button>
      </div>
    );
  }

  // Filter orders for this customer
  const customerOrders = orders.filter(
    o => o.customerId === currentUser.id || o.customerEmail === currentUser.email
  );

  // Filter favorite products
  const favoriteProducts = products.filter(p => favorites.includes(p.id));

  // Filter followed stores
  const myFollowedStores = stores.filter(s => followedStores.includes(s.id));

  // Customer notifications
  const customerNotifs = notifications.filter(
    n => n.recipientRole === 'customer' && (!n.recipientId || n.recipientId === currentUser.id)
  );

  const handleOpenReturn = (order: Order, subOrderId: string) => {
    setSelectedOrder(order);
    setReturnSubOrderId(subOrderId);
    setReturnDialogOpen(true);
    setReturnSuccess(false);
  };

  const handleSubmitReturn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder || !returnSubOrderId) return;
    requestOrderReturn(selectedOrder.id, returnSubOrderId, returnReason, returnNotes);
    setReturnSuccess(true);
    setTimeout(() => {
      setReturnDialogOpen(false);
    }, 1800);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Profile Summary */}
      <div className="bg-white p-6 rounded-2xl border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-lg">
            {currentUser.name.charAt(0)}
          </div>
          <div>
            <h1 className="font-display text-xl font-bold text-neutral-900">
              {currentUser.name}
            </h1>
            <p className="text-xs text-neutral-500">
              {currentUser.email} · {currentUser.phone || 'Non renseigné'}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            logout();
            navigate('/');
          }}
          className="px-3.5 py-2 rounded-lg border border-neutral-200 hover:bg-red-50 hover:text-red-600 text-xs font-medium text-neutral-600 transition-colors flex items-center gap-1.5 self-start sm:self-center"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>{t('navLogout')}</span>
        </button>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-neutral-200 overflow-x-auto pb-px">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition-colors relative ${
            activeTab === 'orders' ? 'text-neutral-900 border-b-2 border-neutral-900' : 'text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>{t('customerTabOrders')} ({customerOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('favorites')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition-colors relative ${
            activeTab === 'favorites' ? 'text-neutral-900 border-b-2 border-neutral-900' : 'text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>{t('customerTabFavorites')} ({favoriteProducts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('followed')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition-colors relative ${
            activeTab === 'followed' ? 'text-neutral-900 border-b-2 border-neutral-900' : 'text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>{t('customerTabFollowed')} ({myFollowedStores.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition-colors relative ${
            activeTab === 'notifications' ? 'text-neutral-900 border-b-2 border-neutral-900' : 'text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>{t('customerTabNotifications')} ({customerNotifs.filter(n => !n.isRead).length})</span>
        </button>
      </div>

      {/* Tab 1: Orders */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {customerOrders.length > 0 ? (
            customerOrders.map(order => (
              <div key={order.id} className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs">
                
                {/* Order Top Bar */}
                <div className="bg-neutral-50/80 px-6 py-4 border-b border-neutral-200 flex flex-wrap items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-4">
                    <div>
                      <span className="text-neutral-500 block text-[11px]">{t('orderNumber')}</span>
                      <strong className="text-neutral-900 font-mono text-sm">{order.id}</strong>
                    </div>
                    <div>
                      <span className="text-neutral-500 block text-[11px]">{t('date')}</span>
                      <span className="text-neutral-800">{formatDate(order.createdAt)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div>
                      <span className="text-neutral-500 block text-[11px]">Total Commande</span>
                      <strong className="text-neutral-900 tabular-nums text-sm">{formatPrice(order.grandTotal)}</strong>
                    </div>
                    <div className="bg-amber-100 text-amber-900 px-2.5 py-1 rounded-full font-medium text-[11px]">
                      {order.paymentStatus === 'collected' ? 'Espèces Encaissées' : 'COD en attente de paiement'}
                    </div>
                  </div>
                </div>

                {/* Sub-Orders by Seller */}
                <div className="p-6 divide-y divide-neutral-100 space-y-6">
                  {order.subOrders.map(sub => (
                    <div key={sub.subOrderId} className="pt-6 first:pt-0 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <StoreIcon className="w-4 h-4 text-amber-600" />
                          <h4 className="text-sm font-bold text-neutral-900">
                            Colis {sub.storeName}
                          </h4>
                          <span className="text-neutral-400 text-xs">({sub.subOrderId})</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-semibold text-neutral-900 bg-neutral-100 px-2.5 py-1 rounded-md">
                            Statut : {t(`orderStatus${sub.status.charAt(0).toUpperCase() + sub.status.slice(1).replace(/_/g, '')}` as any) || sub.status}
                          </span>
                          {sub.status === 'delivered' && !sub.returnRequested && (
                            <button
                              onClick={() => handleOpenReturn(order, sub.subOrderId)}
                              className="text-xs text-neutral-600 hover:text-amber-700 underline flex items-center gap-1"
                            >
                              <RotateCcw className="w-3 h-3" />
                              <span>{t('requestReturn')}</span>
                            </button>
                          )}
                          {sub.returnRequested && (
                            <span className="text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                              Retour demandé
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Items */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {sub.items.map(item => (
                          <div key={item.variantId} className="flex items-center gap-3 bg-neutral-50/60 p-3 rounded-xl border border-neutral-100">
                            <img src={item.image} alt="" className="w-12 h-12 object-contain bg-white rounded p-1" />
                            <div className="text-xs min-w-0 flex-1">
                              <h5 className="font-semibold text-neutral-900 truncate">
                                {item.productName[lang] || item.productName.fr}
                              </h5>
                              <p className="text-neutral-500 text-[11px]">
                                {item.colorName} · Taille: {item.size} · Qté: {item.quantity}
                              </p>
                              <span className="font-medium text-neutral-900 tabular-nums">
                                {formatPrice(item.unitPrice)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Shipping Tracking Timeline */}
                      <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200/80 space-y-3">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <Truck className="w-4 h-4 text-neutral-600" />
                            <span className="font-semibold text-neutral-900">
                              {t('carrier')} : {sub.trackingCarrier || 'Colis Express'}
                            </span>
                          </div>
                          {sub.trackingNumber && (
                            <span className="font-mono text-neutral-600">
                              {t('trackingNumber')} : {sub.trackingNumber}
                            </span>
                          )}
                        </div>

                        {/* Timeline steps */}
                        <div className="space-y-2 pt-2 border-t border-neutral-200/60">
                          {sub.trackingTimeline.map((step, idx) => (
                            <div key={idx} className="flex items-start gap-2.5 text-xs">
                              <div className="w-2 h-2 rounded-full bg-emerald-600 mt-1 shrink-0" />
                              <div className="flex-1">
                                <span className="font-medium text-neutral-900">{step.note}</span>
                                <span className="text-[10px] text-neutral-400 block">{formatDate(step.timestamp)}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white p-12 text-center rounded-2xl border border-neutral-200 space-y-3">
              <Package className="w-10 h-10 text-neutral-300 mx-auto" />
              <p className="text-sm font-medium text-neutral-700">Vous n'avez pas encore passé de commande.</p>
              <button
                onClick={() => navigate('/catalog')}
                className="px-4 py-2 bg-neutral-900 text-white rounded-lg text-xs"
              >
                Découvrir les montures
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Favorites */}
      {activeTab === 'favorites' && (
        <div className="space-y-4">
          {favoriteProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteProducts.map(prod => (
                <div key={prod.id} className="bg-white p-4 rounded-xl border border-neutral-200 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={prod.images[0]} alt="" className="w-14 h-14 object-contain bg-neutral-50 rounded p-1 shrink-0" />
                    <div className="truncate text-xs">
                      <h4 className="font-semibold text-neutral-900 truncate">{prod.name[lang] || prod.name.fr}</h4>
                      <p className="text-neutral-500">{prod.brandName}</p>
                      <span className="font-bold text-neutral-900 tabular-nums">{formatPrice(prod.price)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(`/product/${prod.id}`)}
                    className="px-3 py-1.5 bg-neutral-900 text-white text-xs font-semibold rounded-lg shrink-0"
                  >
                    Voir
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-12 text-center rounded-2xl border border-neutral-200 text-xs text-neutral-500">
              Aucun favori enregistré. Cliquez sur le cœur pour mémoriser vos montures préférées.
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Followed Stores */}
      {activeTab === 'followed' && (
        <div className="space-y-4">
          {myFollowedStores.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {myFollowedStores.map(store => (
                <div key={store.id} className="bg-white p-4 rounded-xl border border-neutral-200 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img src={store.logo} alt="" className="w-12 h-12 rounded-xl object-cover" />
                    <div className="text-xs">
                      <h4 className="font-semibold text-neutral-900">{store.name}</h4>
                      <p className="text-neutral-500">{store.location}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(`/store/${store.slug}`)}
                    className="px-3 py-1.5 bg-neutral-900 text-white text-xs font-semibold rounded-lg"
                  >
                    Visiter
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-12 text-center rounded-2xl border border-neutral-200 text-xs text-neutral-500">
              Vous ne suivez aucune boutique pour le moment.
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Notifications */}
      {activeTab === 'notifications' && (
        <div className="space-y-3">
          {customerNotifs.length > 0 ? (
            customerNotifs.map(n => (
              <div
                key={n.id}
                onClick={() => markNotificationRead(n.id)}
                className={`p-4 rounded-xl border text-xs cursor-pointer transition-colors ${
                  n.isRead ? 'bg-white border-neutral-200' : 'bg-amber-50/60 border-amber-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-bold text-neutral-900">{n.title[lang] || n.title.fr}</h4>
                  <span className="text-[10px] text-neutral-400">{formatDate(n.createdAt)}</span>
                </div>
                <p className="text-neutral-600">{n.message[lang] || n.message.fr}</p>
              </div>
            ))
          ) : (
            <div className="bg-white p-12 text-center rounded-2xl border border-neutral-200 text-xs text-neutral-500">
              {t('noNotifications')}
            </div>
          )}
        </div>
      )}

      {/* Return Request Modal */}
      {returnDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-neutral-200 space-y-4">
            <h3 className="font-bold text-base text-neutral-900">{t('requestReturn')}</h3>
            <p className="text-xs text-neutral-500">
              Pour le colis {returnSubOrderId} de la commande {selectedOrder?.id}.
            </p>

            {returnSuccess ? (
              <div className="p-4 bg-emerald-50 rounded-xl text-center text-xs text-emerald-800 space-y-1">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <p className="font-bold">Demande transmise avec succès !</p>
                <p>La boutique et l'administrateur ont été notifiés pour traitement.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReturn} className="space-y-4 text-xs">
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">{t('returnReason')} *</label>
                  <select
                    value={returnReason}
                    onChange={e => setReturnReason(e.target.value)}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs"
                  >
                    <option value="La monture ne convient pas à mon visage">La monture ne convient pas à mon visage</option>
                    <option value="Article endommagé ou défaut optique">Article endommagé ou défaut optique</option>
                    <option value="Erreur de modèle ou de coloris reçu">Erreur de modèle ou de coloris reçu</option>
                    <option value="Autre motif">Autre motif</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-700 font-medium mb-1">{t('returnNotes')} *</label>
                  <textarea
                    rows={3}
                    required
                    value={returnNotes}
                    onChange={e => setReturnNotes(e.target.value)}
                    placeholder="Précisez les détails de votre demande..."
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setReturnDialogOpen(false)}
                    className="px-4 py-2 bg-neutral-100 text-neutral-700 rounded-lg text-xs font-semibold"
                  >
                    {t('cancel')}
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-neutral-900 text-white rounded-lg text-xs font-semibold"
                  >
                    {t('submitReturn')}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
