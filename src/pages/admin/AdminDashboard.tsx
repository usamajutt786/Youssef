import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useI18n } from '../../context/I18nContext';
import { useRouter } from '../../context/RouterContext';
import { Store, Product, Order } from '../../types';
import {
  LayoutDashboard,
  Users,
  Store as StoreIcon,
  Package,
  ShoppingBag,
  DollarSign,
  AlertOctagon,
  Settings,
  History,
  Check,
  X,
  ShieldCheck,
  CheckCircle2,
  RotateCcw,
  Sliders,
  LogOut,
  Eye,
  Glasses
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const {
    stores,
    products,
    orders,
    payouts,
    reviews,
    auditLogs,
    settings,
    approveStore,
    rejectStore,
    suspendStore,
    reactivateStore,
    approveProduct,
    rejectProduct,
    markOrderPaymentCollected,
    processPayout,
    rejectPayout,
    moderateReview,
    resolveDispute,
    updateSettings,
    resetAllDemoData
  } = useMarketplace();
  const { t, formatPrice, formatDate } = useI18n();
  const { navigate } = useRouter();

  // Active tab state
  const [activeTab, setActiveTab] = useState<
    'overview' | 'stores' | 'products' | 'orders' | 'payouts' | 'disputes' | 'reviews' | 'settings' | 'audit'
  >('overview');

  // Reason prompt modal
  const [rejectionModal, setRejectionModal] = useState<{
    type: 'store' | 'product';
    id: string;
    title: string;
  } | null>(null);
  const [rejectionReason, setRejectionReason] = useState('Documents non conformes aux critères de la marketplace.');

  // Settings form state
  const [platformName, setPlatformName] = useState(settings.marketplaceName);
  const [commRate, setCommRate] = useState(settings.globalCommissionRate);
  const [freeShipThreshold, setFreeShipThreshold] = useState(settings.freeShippingThreshold);

  // Route Guard
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-lg font-bold text-neutral-900">Accès réservé aux administrateurs</h2>
        <p className="text-xs text-neutral-500">
          Veuillez vous connecter avec les identifiants d'administration centrale.
        </p>
        <button
          onClick={() => navigate('/admin/login')}
          className="px-4 py-2 bg-neutral-900 text-white rounded-lg text-xs font-semibold"
        >
          {t('adminPortal')}
        </button>
      </div>
    );
  }

  // Aggregate Metrics
  const totalGrossSales = orders.reduce((sum, o) => sum + o.grandTotal, 0);
  const totalCommissions = orders.reduce(
    (sum, o) => sum + o.subOrders.reduce((sSum, s) => sSum + s.commissionAmount, 0),
    0
  );
  const pendingStoreApprovals = stores.filter(s => s.status === 'pending');
  const pendingProductApprovals = products.filter(p => p.status === 'pending_approval');
  const pendingPayouts = payouts.filter(p => p.status === 'pending');
  const openedDisputes = orders.filter(o => o.disputeStatus === 'opened');
  const totalTryOns = products.reduce((sum, p) => sum + (p.tryOnCount || 0), 0);

  const handleConfirmRejection = () => {
    if (!rejectionModal) return;
    if (rejectionModal.type === 'store') {
      rejectStore(rejectionModal.id, rejectionReason);
    } else {
      rejectProduct(rejectionModal.id, rejectionReason);
    }
    setRejectionModal(null);
  };

  const handleSavePlatformSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      marketplaceName: platformName,
      globalCommissionRate: commRate,
      freeShippingThreshold: freeShipThreshold
    });
    alert('Paramètres enregistrés !');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Admin Top Header */}
      <div className="bg-neutral-900 text-white p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-600/30 text-amber-400 flex items-center justify-center font-bold text-lg border border-amber-500/40">
            A
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-xl font-bold tracking-tight">
                Console d'Administration Globale
              </h1>
              <span className="text-[10px] font-semibold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">
                Super Admin
              </span>
            </div>
            <p className="text-xs text-neutral-400">
              Supervision des opticiens, modération des catalogues, commissions et encaissements COD.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (confirm(t('resetConfirm'))) {
                resetAllDemoData();
              }
            }}
            className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t('resetDemo')}</span>
          </button>
          <button
            onClick={() => {
              logout();
              navigate('/admin/login');
            }}
            className="p-2 rounded-lg bg-neutral-800 text-neutral-400 hover:text-red-400 transition-colors"
            title="Déconnexion"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-200 overflow-x-auto pb-px text-xs">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-4 py-2.5 font-semibold whitespace-nowrap transition-colors ${
            activeTab === 'overview' ? 'text-neutral-900 border-b-2 border-neutral-900' : 'text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>{t('adminOverview')}</span>
        </button>

        <button
          onClick={() => setActiveTab('stores')}
          className={`flex items-center gap-2 px-4 py-2.5 font-semibold whitespace-nowrap transition-colors ${
            activeTab === 'stores' ? 'text-neutral-900 border-b-2 border-neutral-900' : 'text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <StoreIcon className="w-4 h-4" />
          <span>{t('adminStores')}</span>
          {pendingStoreApprovals.length > 0 && (
            <span className="w-2 h-2 rounded-full bg-amber-500" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 px-4 py-2.5 font-semibold whitespace-nowrap transition-colors ${
            activeTab === 'products' ? 'text-neutral-900 border-b-2 border-neutral-900' : 'text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>{t('adminProducts')}</span>
          {pendingProductApprovals.length > 0 && (
            <span className="w-2 h-2 rounded-full bg-amber-500" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-4 py-2.5 font-semibold whitespace-nowrap transition-colors ${
            activeTab === 'orders' ? 'text-neutral-900 border-b-2 border-neutral-900' : 'text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>{t('adminOrders')} ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('payouts')}
          className={`flex items-center gap-2 px-4 py-2.5 font-semibold whitespace-nowrap transition-colors ${
            activeTab === 'payouts' ? 'text-neutral-900 border-b-2 border-neutral-900' : 'text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>{t('adminPayouts')} ({pendingPayouts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('disputes')}
          className={`flex items-center gap-2 px-4 py-2.5 font-semibold whitespace-nowrap transition-colors ${
            activeTab === 'disputes' ? 'text-neutral-900 border-b-2 border-neutral-900' : 'text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <AlertOctagon className="w-4 h-4" />
          <span>{t('adminDisputes')} ({openedDisputes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 px-4 py-2.5 font-semibold whitespace-nowrap transition-colors ${
            activeTab === 'settings' ? 'text-neutral-900 border-b-2 border-neutral-900' : 'text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>{t('adminSettings')}</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`flex items-center gap-2 px-4 py-2.5 font-semibold whitespace-nowrap transition-colors ${
            activeTab === 'audit' ? 'text-neutral-900 border-b-2 border-neutral-900' : 'text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <History className="w-4 h-4" />
          <span>{t('adminAudit')}</span>
        </button>
      </div>

      {/* Tab 1: Overview KPIs */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-5 rounded-2xl border border-neutral-200 space-y-2 shadow-xs">
              <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Volume d'affaires Global</span>
              <p className="text-2xl font-bold text-neutral-900 tabular-nums">{formatPrice(totalGrossSales)}</p>
              <span className="text-[11px] text-neutral-400 block">{orders.length} commandes enregistrées</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-neutral-200 space-y-2 shadow-xs">
              <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Revenu Commissions Plateforme</span>
              <p className="text-2xl font-bold text-emerald-700 tabular-nums">{formatPrice(totalCommissions)}</p>
              <span className="text-[11px] text-neutral-400 block">Taux moyen appliqué : {settings.globalCommissionRate}%</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-neutral-200 space-y-2 shadow-xs">
              <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Boutiques & Vendeurs</span>
              <p className="text-2xl font-bold text-neutral-900 tabular-nums">{stores.length}</p>
              <span className="text-[11px] text-amber-700 block">{pendingStoreApprovals.length} dossier(s) en attente</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-neutral-200 space-y-2 shadow-xs">
              <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Engagement Essayage 2D</span>
              <p className="text-2xl font-bold text-amber-600 tabular-nums">{totalTryOns}</p>
              <span className="text-[11px] text-neutral-400 block">Essais photo réalisés en local</span>
            </div>
          </div>

          {/* Pending Actions Ticker */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-2xl border border-neutral-200 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-900">Boutiques à valider</h4>
                <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {pendingStoreApprovals.length}
                </span>
              </div>
              {pendingStoreApprovals.map(s => (
                <div key={s.id} className="p-3 bg-neutral-50 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <strong className="block">{s.name}</strong>
                    <span className="text-neutral-500 text-[11px]">{s.sellerName} · {s.city}</span>
                  </div>
                  <button
                    onClick={() => setActiveTab('stores')}
                    className="text-neutral-900 font-semibold underline text-[11px]"
                  >
                    Examiner
                  </button>
                </div>
              ))}
            </div>

            <div className="bg-white p-5 rounded-2xl border border-neutral-200 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-900">Produits à modérer</h4>
                <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {pendingProductApprovals.length}
                </span>
              </div>
              {pendingProductApprovals.map(p => (
                <div key={p.id} className="p-3 bg-neutral-50 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <strong className="block">{p.name.fr}</strong>
                    <span className="text-neutral-500 text-[11px]">{p.brandName} · {formatPrice(p.price)}</span>
                  </div>
                  <button
                    onClick={() => setActiveTab('products')}
                    className="text-neutral-900 font-semibold underline text-[11px]"
                  >
                    Modérer
                  </button>
                </div>
              ))}
            </div>

            <div className="bg-white p-5 rounded-2xl border border-neutral-200 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-900">Virements en attente</h4>
                <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {pendingPayouts.length}
                </span>
              </div>
              {pendingPayouts.map(pay => (
                <div key={pay.id} className="p-3 bg-neutral-50 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <strong className="block">{pay.storeName}</strong>
                    <span className="text-neutral-500 text-[11px]">{formatPrice(pay.amount)}</span>
                  </div>
                  <button
                    onClick={() => setActiveTab('payouts')}
                    className="text-neutral-900 font-semibold underline text-[11px]"
                  >
                    Traiter
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Stores Management */}
      {activeTab === 'stores' && (
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-6 shadow-xs">
          <h3 className="font-display text-lg font-bold text-neutral-900">
            Gestion & Approbation des Boutiques Partenaires
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="border-b border-neutral-200 text-neutral-500">
                <tr>
                  <th className="py-2.5">Boutique</th>
                  <th>Gérant</th>
                  <th>Localisation</th>
                  <th>Statut</th>
                  <th>Commission</th>
                  <th>Actions Administrateur</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {stores.map(store => (
                  <tr key={store.id} className="hover:bg-neutral-50">
                    <td className="py-3 font-semibold text-neutral-900">{store.name}</td>
                    <td>{store.sellerName}</td>
                    <td>{store.location}</td>
                    <td>
                      <span className={`px-2 py-0.5 rounded font-semibold text-[10px] ${
                        store.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : store.status === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {store.status === 'approved' ? 'Approuvée' : store.status === 'pending' ? 'En attente' : 'Suspendue'}
                      </span>
                    </td>
                    <td>{store.commissionRateOverride ? `${store.commissionRateOverride}% (Spécifique)` : `${settings.globalCommissionRate}% (Standard)`}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        {store.status === 'pending' && (
                          <>
                            <button
                              onClick={() => approveStore(store.id)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-medium"
                            >
                              {t('approve')}
                            </button>
                            <button
                              onClick={() =>
                                setRejectionModal({
                                  type: 'store',
                                  id: store.id,
                                  title: `Refuser la boutique ${store.name}`
                                })
                              }
                              className="px-2.5 py-1 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 rounded font-medium"
                            >
                              {t('reject')}
                            </button>
                          </>
                        )}
                        {store.status === 'approved' && (
                          <button
                            onClick={() => suspendStore(store.id)}
                            className="px-2.5 py-1 bg-red-100 hover:bg-red-200 text-red-800 rounded font-medium"
                          >
                            {t('suspend')}
                          </button>
                        )}
                        {store.status === 'suspended' && (
                          <button
                            onClick={() => reactivateStore(store.id)}
                            className="px-2.5 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded font-medium"
                          >
                            {t('reactivate')}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Products Moderation */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-6 shadow-xs">
          <h3 className="font-display text-lg font-bold text-neutral-900">
            Modération des Produits & Actifs d'Essayage
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="border-b border-neutral-200 text-neutral-500">
                <tr>
                  <th className="py-2.5">Réf</th>
                  <th>Nom Produit</th>
                  <th>Boutique</th>
                  <th>Prix</th>
                  <th>Essayage 2D</th>
                  <th>Statut</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {products.map(prod => (
                  <tr key={prod.id} className="hover:bg-neutral-50">
                    <td className="py-3 font-mono">{prod.reference}</td>
                    <td className="font-semibold text-neutral-900">{prod.name.fr}</td>
                    <td>{stores.find(s => s.id === prod.storeId)?.name || 'Boutique'}</td>
                    <td className="font-bold tabular-nums">{formatPrice(prod.price)}</td>
                    <td>
                      {prod.tryOnAsset?.supported ? (
                        <span className="text-emerald-700 font-medium flex items-center gap-1">
                          <Glasses className="w-3.5 h-3.5" />
                          <span>Actif Validé</span>
                        </span>
                      ) : (
                        <span className="text-neutral-400">Non supporté</span>
                      )}
                    </td>
                    <td>
                      <span className={`px-2 py-0.5 rounded font-semibold text-[10px] ${
                        prod.status === 'published' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {prod.status === 'published' ? 'Publié' : 'En modération'}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        {prod.status === 'pending_approval' && (
                          <button
                            onClick={() => approveProduct(prod.id)}
                            className="px-2.5 py-1 bg-emerald-600 text-white rounded font-medium"
                          >
                            Approuver
                          </button>
                        )}
                        {prod.status === 'published' && (
                          <button
                            onClick={() =>
                              setRejectionModal({
                                type: 'product',
                                id: prod.id,
                                title: `Dépublier le produit ${prod.name.fr}`
                              })
                            }
                            className="px-2 py-1 text-neutral-500 hover:text-red-600"
                          >
                            Masquer
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Orders & Cash on Delivery Processing */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-6 shadow-xs">
          <div>
            <h3 className="font-display text-lg font-bold text-neutral-900">
              Toutes les Commandes Multi-Boutiques ({orders.length})
            </h3>
            <p className="text-xs text-neutral-500 mt-1">
              Rapprochement des encaissements Cash on Delivery (COD) auprès des transporteurs partenaires.
            </p>
          </div>

          <div className="space-y-4">
            {orders.map(order => (
              <div key={order.id} className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 text-xs space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-200 pb-2">
                  <div>
                    <strong className="font-mono text-sm text-neutral-900">{order.id}</strong>
                    <span className="text-neutral-500 block">Client: {order.customerName} ({order.customerPhone})</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-[11px] text-neutral-400 block">Total Commande COD</span>
                      <strong className="text-sm font-bold tabular-nums text-neutral-900">{formatPrice(order.grandTotal)}</strong>
                    </div>

                    {order.paymentStatus === 'pending_cod' ? (
                      <button
                        onClick={() => markOrderPaymentCollected(order.id)}
                        className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold shadow-xs flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{t('markCollected')}</span>
                      </button>
                    ) : (
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-lg font-semibold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>Espèces Encaissées</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Sub-Orders breakdown */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {order.subOrders.map(sub => (
                    <div key={sub.subOrderId} className="p-3 bg-white rounded-xl border border-neutral-200/80 space-y-1">
                      <div className="flex justify-between font-semibold">
                        <span>{sub.storeName} ({sub.subOrderId})</span>
                        <span>{sub.status}</span>
                      </div>
                      <p className="text-neutral-500 text-[11px]">
                        Sous-total: {formatPrice(sub.subtotal)} · Commission ({sub.commissionRate}%): {formatPrice(sub.commissionAmount)} · Net boutique: {formatPrice(sub.netPayout)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Payouts Processing */}
      {activeTab === 'payouts' && (
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-6 shadow-xs">
          <h3 className="font-display text-lg font-bold text-neutral-900">
            Demandes de Reversement Vendeurs ({payouts.length})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="border-b border-neutral-200 text-neutral-500">
                <tr>
                  <th className="py-2.5">Date</th>
                  <th>Boutique</th>
                  <th>Montant</th>
                  <th>Coordonnées bancaires</th>
                  <th>Statut</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {payouts.map(pay => (
                  <tr key={pay.id} className="hover:bg-neutral-50">
                    <td className="py-3 text-neutral-500">{formatDate(pay.requestDate)}</td>
                    <td className="font-semibold text-neutral-900">{pay.storeName}</td>
                    <td className="font-bold tabular-nums">{formatPrice(pay.amount)}</td>
                    <td className="font-mono text-neutral-600 truncate max-w-xs">{pay.paymentMethodDetails}</td>
                    <td>
                      <span className={`px-2 py-0.5 rounded font-semibold text-[10px] ${
                        pay.status === 'processed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {pay.status === 'processed' ? 'Virement Exécuté' : 'En attente'}
                      </span>
                    </td>
                    <td>
                      {pay.status === 'pending' && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => processPayout(pay.id, 'Virement validé par la trésorerie plateforme')}
                            className="px-2.5 py-1 bg-neutral-900 text-white rounded font-medium"
                          >
                            {t('markPayoutProcessed')}
                          </button>
                          <button
                            onClick={() => rejectPayout(pay.id, 'Coordonnées IBAN invalides')}
                            className="px-2 py-1 text-neutral-500 hover:text-red-600"
                          >
                            Rejeter
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 6: Disputes & Returns */}
      {activeTab === 'disputes' && (
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-6 shadow-xs">
          <h3 className="font-display text-lg font-bold text-neutral-900">
            Gestion des Litiges & Demandes de Retour Client
          </h3>

          <div className="space-y-4">
            {orders.filter(o => o.disputeStatus && o.disputeStatus !== 'none').length > 0 ? (
              orders
                .filter(o => o.disputeStatus && o.disputeStatus !== 'none')
                .map(ord => (
                  <div key={ord.id} className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 text-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <strong className="font-mono">{ord.id} · {ord.customerName}</strong>
                      <span className="font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                        Statut : {ord.disputeStatus}
                      </span>
                    </div>
                    <p className="text-neutral-700">
                      <strong>Motif :</strong> {ord.disputeDetails?.customerNotes}
                    </p>
                    {ord.disputeStatus === 'opened' && (
                      <div className="pt-2 flex gap-2">
                        <button
                          onClick={() => resolveDispute(ord.id, 'Retour approuvé et étiquette de retour transmise', 'Accord amiable')}
                          className="px-3 py-1.5 bg-emerald-600 text-white rounded font-semibold"
                        >
                          Valider le retour
                        </button>
                        <button
                          onClick={() => resolveDispute(ord.id, 'Demande rejetée hors délai légal', 'Refus motivé')}
                          className="px-3 py-1.5 bg-neutral-200 text-neutral-800 rounded font-semibold"
                        >
                          Rejeter la demande
                        </button>
                      </div>
                    )}
                  </div>
                ))
            ) : (
              <p className="text-xs text-neutral-500 italic">Aucun litige ou réclamation active.</p>
            )}
          </div>
        </div>
      )}

      {/* Tab 7: Platform Settings */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-6 shadow-xs max-w-xl">
          <h3 className="font-display text-lg font-bold text-neutral-900">
            {t('adminSettings')}
          </h3>
          <form onSubmit={handleSavePlatformSettings} className="space-y-4 text-xs">
            <div>
              <label className="block text-neutral-700 font-medium mb-1">Nom public de la marketplace</label>
              <input
                type="text"
                value={platformName}
                onChange={e => setPlatformName(e.target.value)}
                className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-neutral-700 font-medium mb-1">{t('globalCommissionRate')} *</label>
              <input
                type="number"
                min="0"
                max="50"
                value={commRate}
                onChange={e => setCommRate(parseFloat(e.target.value))}
                className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg font-mono"
              />
            </div>
            <div>
              <label className="block text-neutral-700 font-medium mb-1">Seuil de livraison gratuite (€)</label>
              <input
                type="number"
                value={freeShipThreshold}
                onChange={e => setFreeShipThreshold(parseFloat(e.target.value))}
                className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg font-mono"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-neutral-900 text-white font-semibold rounded-xl hover:bg-neutral-800"
            >
              {t('saveSettings')}
            </button>
          </form>
        </div>
      )}

      {/* Tab 8: Audit Logs */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-6 shadow-xs">
          <h3 className="font-display text-lg font-bold text-neutral-900">
            {t('adminAudit')} (Historique immuable)
          </h3>
          <div className="divide-y divide-neutral-100 text-xs">
            {auditLogs.map(log => (
              <div key={log.id} className="py-2.5 flex items-center justify-between">
                <div>
                  <strong className="text-neutral-900 block font-mono text-[11px]">{log.action}</strong>
                  <span className="text-neutral-600">{log.details}</span>
                </div>
                <div className="text-right text-neutral-400 text-[11px]">
                  <span>{log.actor}</span>
                  <span className="block">{formatDate(log.timestamp)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rejection Prompt Modal */}
      {rejectionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-neutral-200 space-y-4 text-xs">
            <h3 className="font-bold text-sm text-neutral-900">{rejectionModal.title}</h3>
            <div>
              <label className="block text-neutral-700 font-medium mb-1">{t('rejectionReasonPrompt')}</label>
              <textarea
                rows={3}
                value={rejectionReason}
                onChange={e => setRejectionReason(e.target.value)}
                className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setRejectionModal(null)}
                className="px-4 py-2 bg-neutral-100 text-neutral-700 rounded-lg font-semibold"
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleConfirmRejection}
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700"
              >
                Confirmer le refus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
