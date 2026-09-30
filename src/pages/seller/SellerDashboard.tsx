import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useI18n } from '../../context/I18nContext';
import { useRouter } from '../../context/RouterContext';
import { Product, OrderStatus, Store, PromotionCoupon, Order, SellerSubOrder } from '../../types';
import { FRAME_DEFINITIONS } from '../../assets/frames/framesData';
import {
  LayoutDashboard,
  Package,
  Boxes,
  ShoppingBag,
  Glasses,
  Wallet,
  Tag,
  Settings,
  Plus,
  Edit2,
  Trash2,
  Copy,
  Truck,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  DollarSign,
  Eye,
  LogOut,
  Save
} from 'lucide-react';

export const SellerDashboard: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const {
    stores,
    products,
    orders,
    payouts,
    requestPayout,
    createProduct,
    updateProduct,
    deleteProduct,
    duplicateProduct,
    adjustStock,
    updateSubOrderStatus,
    updateStore,
    settings,
    coupons
  } = useMarketplace();
  const { t, lang, formatPrice, formatDate } = useI18n();
  const { navigate } = useRouter();

  // Navigation tab
  const [activeTab, setActiveTab] = useState<
    'overview' | 'products' | 'inventory' | 'orders' | 'tryon' | 'finances' | 'store' | 'promotions'
  >('overview');

  // Modal states
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  // Stock Adjust Dialog
  const [stockModalOpen, setStockModalOpen] = useState(false);
  const [stockAdjustProduct, setStockAdjustProduct] = useState<Product | null>(null);
  const [newStockQty, setNewStockQty] = useState(10);
  const [stockReason, setStockReason] = useState('Réapprovisionnement atelier');

  // Shipping Update Dialog
  const [shippingModalOpen, setShippingModalOpen] = useState(false);
  const [activeOrderToShip, setActiveOrderToShip] = useState<{ orderId: string; subOrderId: string } | null>(null);
  const [carrierInput, setCarrierInput] = useState('Chronopost Express');
  const [trackingNumberInput, setTrackingNumberInput] = useState('');
  const [statusSelect, setStatusSelect] = useState<OrderStatus>('shipped');

  // Payout Dialog
  const [payoutModalOpen, setPayoutModalOpen] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState(150);
  const [payoutIban, setPayoutIban] = useState('FR76 3000 4000 5000 6000 700');

  // Product Form State
  const [pNameFr, setPNameFr] = useState('');
  const [pNameAr, setPNameAr] = useState('');
  const [pDescFr, setPDescFr] = useState('');
  const [pDescAr, setPDescAr] = useState('');
  const [pCategory, setPCategory] = useState('prescription');
  const [pBrand, setPBrand] = useState('Matsuda Optics');
  const [pPrice, setPPrice] = useState(180);
  const [pPromoPrice, setPPromoPrice] = useState<number | undefined>(undefined);
  const [pStock, setPStock] = useState(12);
  const [pShape, setPShape] = useState<'round' | 'aviator' | 'square' | 'cat-eye' | 'geometric'>('round');
  const [pMaterial, setPMaterial] = useState<'titanium' | 'acetate' | 'metal'>('titanium');
  const [pTryOnSupported, setPTryOnSupported] = useState(true);
  const [pFrameDefId, setPFrameDefId] = useState(FRAME_DEFINITIONS[0].id);

  // Route Guard
  if (!currentUser || currentUser.role !== 'seller') {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-lg font-bold text-neutral-900">Accès réservé aux opticiens vendeurs</h2>
        <p className="text-xs text-neutral-500">
          Veuillez vous connecter avec un compte vendeur pour gérer votre boutique.
        </p>
        <button
          onClick={() => navigate('/seller/login')}
          className="px-4 py-2 bg-neutral-900 text-white rounded-lg text-xs font-semibold"
        >
          {t('sellerPortal')}
        </button>
      </div>
    );
  }

  // Find this seller's store
  const sellerStore =
    stores.find(s => s.sellerId === currentUser.id || s.id === currentUser.sellerStoreId) ||
    stores[0];

  // Isolated seller data: seller must ONLY see their own products and orders
  const myProducts = products.filter(p => p.storeId === sellerStore.id);

  // Orders that contain this seller's sub-orders
  const myOrdersWithSub = orders
    .map(order => {
      const mySub = order.subOrders.find(s => s.storeId === sellerStore.id);
      return mySub ? { order, subOrder: mySub } : null;
    })
    .filter((item): item is { order: Order; subOrder: Order['subOrders'][0] } => item !== null);

  // Financial metrics calculated strictly from seller's orders
  const grossSales = myOrdersWithSub.reduce((sum, item) => sum + item.subOrder.subtotal, 0);
  const platformCommissionTotal = myOrdersWithSub.reduce((sum, item) => sum + item.subOrder.commissionAmount, 0);
  const netRevenue = grossSales - platformCommissionTotal;

  // Available balance is from collected COD orders, pending is from uncollected
  const collectedSubOrders = myOrdersWithSub.filter(it => it.order.paymentStatus === 'collected');
  const pendingSubOrders = myOrdersWithSub.filter(it => it.order.paymentStatus === 'pending_cod');

  const availableBalance = Number(
    collectedSubOrders.reduce((sum, it) => sum + it.subOrder.netPayout, 0).toFixed(2)
  );
  const pendingBalance = Number(
    pendingSubOrders.reduce((sum, it) => sum + it.subOrder.netPayout, 0).toFixed(2)
  );

  const lowStockProducts = myProducts.filter(p => p.stock <= 5);
  const myPayouts = payouts.filter(p => p.storeId === sellerStore.id);

  // Open Create Product
  const handleOpenCreateProduct = () => {
    setEditingProductId(null);
    setPNameFr('');
    setPNameAr('');
    setPDescFr('');
    setPDescAr('');
    setPCategory('prescription');
    setPBrand('Matsuda Optics');
    setPPrice(180);
    setPPromoPrice(undefined);
    setPStock(10);
    setPShape('round');
    setPMaterial('titanium');
    setPTryOnSupported(true);
    setPFrameDefId(FRAME_DEFINITIONS[0].id);
    setProductModalOpen(true);
  };

  // Open Edit Product
  const handleOpenEditProduct = (prod: Product) => {
    setEditingProductId(prod.id);
    setPNameFr(prod.name.fr);
    setPNameAr(prod.name.ar);
    setPDescFr(prod.description.fr);
    setPDescAr(prod.description.ar);
    setPCategory(prod.categoryId);
    setPBrand(prod.brandName);
    setPPrice(prod.price);
    setPPromoPrice(prod.promotionalPrice);
    setPStock(prod.stock);
    setPShape(prod.shape as any);
    setPMaterial(prod.material as any);
    setPTryOnSupported(prod.tryOnAsset?.supported ?? true);
    setPFrameDefId(prod.tryOnAsset?.frameSvgOrPng || FRAME_DEFINITIONS[0].id);
    setProductModalOpen(true);
  };

  // Save Product
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pNameFr) return;

    if (editingProductId) {
      updateProduct(editingProductId, {
        name: { fr: pNameFr, ar: pNameAr || pNameFr },
        description: { fr: pDescFr, ar: pDescAr || pDescFr },
        categoryId: pCategory,
        brandName: pBrand,
        price: pPrice,
        promotionalPrice: pPromoPrice,
        shape: pShape,
        material: pMaterial,
        tryOnAsset: {
          supported: pTryOnSupported,
          frameSvgOrPng: pFrameDefId,
          lensShape: pShape,
          frameWidthMm: 135,
          frameHeightMm: 46,
          lensWidthMm: 50,
          bridgeWidthMm: 19,
          templeLengthMm: 145,
          defaultScale: 1.0,
          defaultOffsetY: 0,
          defaultRotation: 0,
          moderationStatus: 'approved'
        }
      });
    } else {
      createProduct({
        storeId: sellerStore.id,
        sellerId: currentUser.id,
        name: { fr: pNameFr, ar: pNameAr || pNameFr },
        description: { fr: pDescFr, ar: pDescAr || pDescFr },
        categoryId: pCategory,
        brandName: pBrand,
        price: pPrice,
        promotionalPrice: pPromoPrice,
        stock: pStock,
        shape: pShape,
        material: pMaterial,
        tryOnAsset: {
          supported: pTryOnSupported,
          frameSvgOrPng: pFrameDefId,
          lensShape: pShape,
          frameWidthMm: 135,
          frameHeightMm: 46,
          lensWidthMm: 50,
          bridgeWidthMm: 19,
          templeLengthMm: 145,
          defaultScale: 1.0,
          defaultOffsetY: 0,
          defaultRotation: 0,
          moderationStatus: 'pending'
        }
      });
    }

    setProductModalOpen(false);
  };

  // Handle Stock Adjust
  const handleConfirmStockAdjust = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stockAdjustProduct) return;
    const variant = stockAdjustProduct.variants[0];
    if (variant) {
      adjustStock(stockAdjustProduct.id, variant.id, newStockQty, stockReason);
    }
    setStockModalOpen(false);
  };

  // Handle Shipping Update
  const handleConfirmShipping = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOrderToShip) return;
    updateSubOrderStatus(
      activeOrderToShip.orderId,
      activeOrderToShip.subOrderId,
      statusSelect,
      carrierInput,
      trackingNumberInput,
      `Mise à jour par la boutique ${sellerStore.name}`
    );
    setShippingModalOpen(false);
  };

  // Handle Payout Request
  const handleConfirmPayout = (e: React.FormEvent) => {
    e.preventDefault();
    if (payoutAmount <= 0) return;
    requestPayout(currentUser.id, sellerStore.id, sellerStore.name, payoutAmount, payoutIban);
    setPayoutModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner / Store Header */}
      <div className="bg-white p-6 rounded-2xl border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-neutral-100 overflow-hidden border border-neutral-200 shrink-0">
            <img src={sellerStore.logo} alt={sellerStore.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-xl font-bold text-neutral-900">
                {sellerStore.name}
              </h1>
              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                  sellerStore.status === 'approved'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {sellerStore.status === 'approved' ? 'Boutique Validée' : 'En Attente de Validation'}
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">
              Gérant : {currentUser.name} ({currentUser.email}) · {sellerStore.location}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/store/${sellerStore.slug}`)}
            className="px-3 py-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-100 text-xs font-semibold text-neutral-800 flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Voir boutique publique</span>
          </button>
          <button
            onClick={() => {
              logout();
              navigate('/seller/login');
            }}
            className="p-2 rounded-lg border border-neutral-200 text-neutral-500 hover:text-red-600 hover:bg-red-50"
            title="Déconnexion"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Seller Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-neutral-200 overflow-x-auto pb-px">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition-colors ${
            activeTab === 'overview' ? 'text-neutral-900 border-b-2 border-neutral-900' : 'text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>{t('sellerOverview')}</span>
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition-colors ${
            activeTab === 'products' ? 'text-neutral-900 border-b-2 border-neutral-900' : 'text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>{t('sellerProducts')} ({myProducts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('inventory')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition-colors ${
            activeTab === 'inventory' ? 'text-neutral-900 border-b-2 border-neutral-900' : 'text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <Boxes className="w-4 h-4" />
          <span>{t('sellerInventory')}</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition-colors ${
            activeTab === 'orders' ? 'text-neutral-900 border-b-2 border-neutral-900' : 'text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>{t('sellerOrders')} ({myOrdersWithSub.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('tryon')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition-colors ${
            activeTab === 'tryon' ? 'text-neutral-900 border-b-2 border-neutral-900' : 'text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <Glasses className="w-4 h-4 text-amber-600" />
          <span>{t('sellerTryOnAssets')}</span>
        </button>

        <button
          onClick={() => setActiveTab('finances')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition-colors ${
            activeTab === 'finances' ? 'text-neutral-900 border-b-2 border-neutral-900' : 'text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <Wallet className="w-4 h-4" />
          <span>{t('sellerFinance')}</span>
        </button>

        <button
          onClick={() => setActiveTab('store')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition-colors ${
            activeTab === 'store' ? 'text-neutral-900 border-b-2 border-neutral-900' : 'text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>{t('sellerStore')}</span>
        </button>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          
          {/* Metrics 4-Grid (Tabular numbers) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-5 rounded-2xl border border-neutral-200 space-y-2 shadow-xs">
              <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">{t('totalSales')}</span>
              <p className="text-2xl font-bold text-neutral-900 tabular-nums">{formatPrice(grossSales)}</p>
              <span className="text-[11px] text-neutral-400 block">Commandes reçues par votre boutique</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-neutral-200 space-y-2 shadow-xs">
              <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">{t('netRevenue')}</span>
              <p className="text-2xl font-bold text-emerald-700 tabular-nums">{formatPrice(netRevenue)}</p>
              <span className="text-[11px] text-neutral-400 block">Après déduction commission ({sellerStore.commissionRateOverride || settings.globalCommissionRate}%)</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-neutral-200 space-y-2 shadow-xs">
              <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">{t('availableBalance')}</span>
              <p className="text-2xl font-bold text-neutral-900 tabular-nums">{formatPrice(availableBalance)}</p>
              <span className="text-[11px] text-emerald-700 block">Fonds collectés en COD prêts au retrait</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-neutral-200 space-y-2 shadow-xs">
              <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">{t('pendingBalance')}</span>
              <p className="text-2xl font-bold text-amber-700 tabular-nums">{formatPrice(pendingBalance)}</p>
              <span className="text-[11px] text-neutral-400 block">En cours de livraison / encaissement</span>
            </div>
          </div>

          {/* Quick Alerts for Low Stock */}
          {lowStockProducts.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between text-xs text-amber-950">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  <strong>Alerte stock :</strong> {lowStockProducts.length} monture(s) ont un stock inférieur ou égal à 5 exemplaires.
                </span>
              </div>
              <button
                onClick={() => setActiveTab('inventory')}
                className="font-bold underline text-amber-900"
              >
                Gérer l'inventaire
              </button>
            </div>
          )}

          {/* Recent Orders Table */}
          <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs space-y-3 p-6">
            <h3 className="font-display text-base font-bold text-neutral-900">
              Dernières commandes reçues
            </h3>
            {myOrdersWithSub.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="border-b border-neutral-200 text-neutral-500">
                    <tr>
                      <th className="py-2.5">Sous-Commande</th>
                      <th>Client</th>
                      <th>Articles</th>
                      <th>Total Sous-Commande</th>
                      <th>Statut</th>
                      <th>Paiement COD</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {myOrdersWithSub.slice(0, 5).map(({ order, subOrder }) => (
                      <tr key={subOrder.subOrderId} className="hover:bg-neutral-50/50">
                        <td className="py-3 font-mono font-semibold text-neutral-900">{subOrder.subOrderId}</td>
                        <td>{order.customerName}</td>
                        <td>{subOrder.items.length} article(s)</td>
                        <td className="font-semibold tabular-nums">{formatPrice(subOrder.subtotal + subOrder.shippingCost)}</td>
                        <td>
                          <span className="bg-neutral-100 text-neutral-800 px-2 py-0.5 rounded font-medium">
                            {subOrder.status}
                          </span>
                        </td>
                        <td>
                          <span className={`px-2 py-0.5 rounded font-medium ${
                            order.paymentStatus === 'collected' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {order.paymentStatus === 'collected' ? 'Encaissé' : 'En attente COD'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-xs text-neutral-500 italic py-4">Aucune commande reçue pour le moment.</p>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Products CRUD */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-bold text-neutral-900">
              Montures en catalogue ({myProducts.length})
            </h3>
            <button
              onClick={handleOpenCreateProduct}
              className="px-4 py-2 bg-neutral-900 text-white rounded-xl text-xs font-semibold hover:bg-neutral-800 transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t('addProduct')}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myProducts.map(prod => (
              <div key={prod.id} className="bg-white rounded-2xl border border-neutral-200 p-4 space-y-3 shadow-xs">
                <div className="aspect-4/3 bg-neutral-50 rounded-xl overflow-hidden p-2 flex items-center justify-center">
                  <img src={prod.images[0]} alt="" className="w-full h-full object-contain mix-blend-multiply" />
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs text-neutral-500 mb-1">
                    <span className="font-mono">{prod.reference}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      prod.status === 'published' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {prod.status === 'published' ? 'Publié' : 'En modération'}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-neutral-900 line-clamp-1">{prod.name.fr}</h4>
                  <p className="text-xs text-neutral-400 font-arabic">{prod.name.ar}</p>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-neutral-100">
                  <span className="font-bold text-neutral-900 tabular-nums">{formatPrice(prod.price)}</span>
                  <span className="text-neutral-500">Stock : {prod.stock}</span>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-1 pt-2 border-t border-neutral-100">
                  <button
                    onClick={() => handleOpenEditProduct(prod)}
                    className="p-1.5 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg"
                    title={t('editProduct')}
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => duplicateProduct(prod.id)}
                    className="p-1.5 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg"
                    title={t('duplicateProduct')}
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Supprimer définitivement la monture ${prod.name.fr} ?`)) {
                        deleteProduct(prod.id);
                      }
                    }}
                    className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
                    title={t('deleteProduct')}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Inventory */}
      {activeTab === 'inventory' && (
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-6 shadow-xs">
          <h3 className="font-display text-lg font-bold text-neutral-900">
            Gestion des stocks & inventaire
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="border-b border-neutral-200 text-neutral-500">
                <tr>
                  <th className="py-2.5">Réf</th>
                  <th>Nom de la Monture</th>
                  <th>Variantes</th>
                  <th>Stock Actuel</th>
                  <th>Statut</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {myProducts.map(prod => (
                  <tr key={prod.id} className="hover:bg-neutral-50/50">
                    <td className="py-3 font-mono text-neutral-700">{prod.reference}</td>
                    <td className="font-semibold text-neutral-900">{prod.name.fr}</td>
                    <td>{prod.variants.length} coloris</td>
                    <td className="font-bold tabular-nums text-neutral-900">{prod.stock} ex.</td>
                    <td>
                      {prod.stock <= 0 ? (
                        <span className="text-red-600 font-semibold">Rupture</span>
                      ) : prod.stock <= 5 ? (
                        <span className="text-amber-700 font-semibold">Faible</span>
                      ) : (
                        <span className="text-emerald-700 font-semibold">Optimal</span>
                      )}
                    </td>
                    <td>
                      <button
                        onClick={() => {
                          setStockAdjustProduct(prod);
                          setNewStockQty(prod.stock);
                          setStockModalOpen(true);
                        }}
                        className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded font-semibold text-[11px]"
                      >
                        {t('adjustStock')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Orders & Shipping Tracking */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <h3 className="font-display text-lg font-bold text-neutral-900">
            Commandes à préparer & expédier ({myOrdersWithSub.length})
          </h3>

          <div className="space-y-4">
            {myOrdersWithSub.map(({ order, subOrder }) => (
              <div key={subOrder.subOrderId} className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-4 shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-100 pb-3 text-xs">
                  <div>
                    <span className="text-neutral-400 block text-[10px]">Sous-commande boutique</span>
                    <strong className="text-sm font-mono text-neutral-900">{subOrder.subOrderId}</strong>
                    <span className="text-neutral-500 block">Commande client parente : {order.id}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-neutral-100 font-semibold text-neutral-900 rounded-lg">
                      {subOrder.status}
                    </span>
                    <button
                      onClick={() => {
                        setActiveOrderToShip({ orderId: order.id, subOrderId: subOrder.subOrderId });
                        setStatusSelect(subOrder.status);
                        setCarrierInput(subOrder.trackingCarrier || 'Chronopost COD');
                        setTrackingNumberInput(subOrder.trackingNumber || '');
                        setShippingModalOpen(true);
                      }}
                      className="px-3 py-1.5 bg-neutral-900 text-white rounded-lg text-xs font-semibold hover:bg-neutral-800 transition-colors flex items-center gap-1.5"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Mettre à jour expédition</span>
                    </button>
                  </div>
                </div>

                {/* Items in this sub order */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {subOrder.items.map((it: SellerSubOrder['items'][0]) => (
                    <div key={it.variantId} className="flex items-center gap-3 p-2 bg-neutral-50 rounded-xl">
                      <img src={it.image} alt="" className="w-12 h-12 object-contain bg-white rounded p-1" />
                      <div>
                        <p className="font-semibold text-neutral-900">{it.productName.fr}</p>
                        <p className="text-neutral-500">Coloris: {it.colorName} · Taille: {it.size} · Qté: {it.quantity}</p>
                        <span className="font-bold tabular-nums">{formatPrice(it.unitPrice)}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Shipping info */}
                <div className="text-xs text-neutral-600 bg-neutral-50 p-3 rounded-xl flex flex-wrap justify-between gap-4">
                  <div>
                    <span className="text-neutral-400 block text-[10px]">Destinataire & Adresse</span>
                    <p className="font-semibold text-neutral-900">{order.customerName} ({order.customerPhone})</p>
                    <p>{order.shippingAddress.addressLine}, {order.shippingAddress.city} - {order.shippingAddress.country}</p>
                  </div>
                  <div>
                    <span className="text-neutral-400 block text-[10px]">Paiement à la livraison</span>
                    <p className="font-semibold text-amber-900">
                      Montant à encaisser par le transporteur : {formatPrice(subOrder.subtotal + subOrder.shippingCost)}
                    </p>
                    <p className="text-[11px] text-neutral-500">
                      Net à reverser à la boutique : {formatPrice(subOrder.netPayout)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Try-On Assets Configuration */}
      {activeTab === 'tryon' && (
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-6 shadow-xs">
          <div>
            <h3 className="font-display text-lg font-bold text-neutral-900">
              {t('sellerTryOnAssets')} (Montures 2D)
            </h3>
            <p className="text-xs text-neutral-500 mt-1">
              Associez chaque modèle optique à un fichier SVG transparent calibré en millimètres pour l'essayage photo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myProducts.filter(p => p.tryOnAsset?.supported).map(prod => (
              <div key={prod.id} className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <strong className="text-sm font-semibold text-neutral-900">{prod.name.fr}</strong>
                  <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    Actif 2D Validé
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 font-mono text-center">
                  <div className="bg-white p-2 rounded border border-neutral-200">
                    <span className="text-[10px] text-neutral-500 block">Largeur</span>
                    <strong>{prod.tryOnAsset.frameWidthMm} mm</strong>
                  </div>
                  <div className="bg-white p-2 rounded border border-neutral-200">
                    <span className="text-[10px] text-neutral-500 block">Pont</span>
                    <strong>{prod.tryOnAsset.bridgeWidthMm} mm</strong>
                  </div>
                  <div className="bg-white p-2 rounded border border-neutral-200">
                    <span className="text-[10px] text-neutral-500 block">Branches</span>
                    <strong>{prod.tryOnAsset.templeLengthMm} mm</strong>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/try-on?productId=${prod.id}`)}
                  className="w-full py-2 bg-neutral-900 text-white rounded-lg font-semibold hover:bg-neutral-800 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Glasses className="w-3.5 h-3.5" />
                  <span>Tester dans le studio photo 2D</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 6: Finances & Payouts */}
      {activeTab === 'finances' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-neutral-200 space-y-4 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-display text-lg font-bold text-neutral-900">{t('sellerFinance')}</h3>
                <p className="text-xs text-neutral-500">
                  Suivi des encaissements COD et demandes de reversement vers votre compte bancaire.
                </p>
              </div>
              <button
                onClick={() => setPayoutModalOpen(true)}
                disabled={availableBalance <= 0}
                className="px-4 py-2.5 bg-neutral-900 disabled:opacity-40 text-white text-xs font-semibold rounded-xl hover:bg-neutral-800 transition-colors flex items-center gap-1.5"
              >
                <DollarSign className="w-3.5 h-3.5" />
                <span>{t('requestPayout')}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                <span className="text-xs text-neutral-500 uppercase">{t('availableBalance')}</span>
                <p className="text-xl font-bold text-emerald-700 tabular-nums">{formatPrice(availableBalance)}</p>
                <span className="text-[11px] text-neutral-400">Prêt pour virement bancaire</span>
              </div>
              <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                <span className="text-xs text-neutral-500 uppercase">{t('pendingBalance')}</span>
                <p className="text-xl font-bold text-amber-700 tabular-nums">{formatPrice(pendingBalance)}</p>
                <span className="text-[11px] text-neutral-400">En cours de livraison / transporteur</span>
              </div>
              <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                <span className="text-xs text-neutral-500 uppercase">Taux de Commission Plateforme</span>
                <p className="text-xl font-bold text-neutral-900 tabular-nums">
                  {sellerStore.commissionRateOverride || settings.globalCommissionRate}%
                </p>
                <span className="text-[11px] text-neutral-400">Prélevé lors du reversement</span>
              </div>
            </div>
          </div>

          {/* Payout Requests History */}
          <div className="bg-white p-6 rounded-2xl border border-neutral-200 space-y-4 shadow-xs">
            <h4 className="font-bold text-sm text-neutral-900">Historique des demandes de reversement</h4>
            {myPayouts.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="border-b border-neutral-200 text-neutral-500">
                    <tr>
                      <th className="py-2">Date demande</th>
                      <th>Montant</th>
                      <th>Coordonnées bancaires</th>
                      <th>Statut</th>
                      <th>Notes admin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {myPayouts.map(p => (
                      <tr key={p.id} className="hover:bg-neutral-50">
                        <td className="py-2.5 text-neutral-500">{formatDate(p.requestDate)}</td>
                        <td className="font-bold tabular-nums text-neutral-900">{formatPrice(p.amount)}</td>
                        <td className="font-mono text-neutral-600 truncate max-w-xs">{p.paymentMethodDetails}</td>
                        <td>
                          <span className={`px-2 py-0.5 rounded font-semibold text-[10px] ${
                            p.status === 'processed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {p.status === 'processed' ? 'Payé (Simulé)' : 'En attente admin'}
                          </span>
                        </td>
                        <td className="text-neutral-500 italic">{p.adminNotes || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-xs text-neutral-500 italic">Aucun virement demandé à ce jour.</p>
            )}
          </div>
        </div>
      )}

      {/* Tab 7: Store Settings & Profile */}
      {activeTab === 'store' && (
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 space-y-6 shadow-xs max-w-2xl">
          <h3 className="font-display text-lg font-bold text-neutral-900">
            Personnalisation de la boutique
          </h3>
          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-neutral-700 font-medium mb-1">Nom de la boutique</label>
              <input
                type="text"
                value={sellerStore.name}
                onChange={e => updateStore(sellerStore.id, { name: e.target.value })}
                className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block text-neutral-700 font-medium mb-1">Description (Français)</label>
              <textarea
                rows={3}
                value={sellerStore.description.fr}
                onChange={e =>
                  updateStore(sellerStore.id, {
                    description: { ...sellerStore.description, fr: e.target.value }
                  })
                }
                className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block text-neutral-700 font-medium mb-1">Description (Arabe)</label>
              <textarea
                rows={3}
                value={sellerStore.description.ar}
                onChange={e =>
                  updateStore(sellerStore.id, {
                    description: { ...sellerStore.description, ar: e.target.value }
                  })
                }
                className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs font-arabic"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-neutral-700 font-medium mb-1">Téléphone</label>
                <input
                  type="text"
                  value={sellerStore.phone}
                  onChange={e => updateStore(sellerStore.id, { phone: e.target.value })}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block text-neutral-700 font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={sellerStore.email}
                  onChange={e => updateStore(sellerStore.id, { email: e.target.value })}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs"
                />
              </div>
            </div>
            <p className="text-[11px] text-emerald-700">
              Les modifications sont sauvegardées en temps réel dans votre session démo.
            </p>
          </div>
        </div>
      )}

      {/* Modal: Create / Edit Product */}
      {productModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-neutral-200 max-h-[90vh] overflow-y-auto space-y-6">
            <h3 className="font-display text-lg font-bold text-neutral-900">
              {editingProductId ? t('editProduct') : t('addProduct')}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">{t('productTitleFr')} *</label>
                  <input
                    type="text"
                    required
                    value={pNameFr}
                    onChange={e => setPNameFr(e.target.value)}
                    placeholder="Ex: Monture Titane Solaire"
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">{t('productTitleAr')} *</label>
                  <input
                    type="text"
                    required
                    value={pNameAr}
                    onChange={e => setPNameAr(e.target.value)}
                    placeholder="إطار تيتانيوم شمسي"
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg font-arabic"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">{t('productDescFr')}</label>
                  <textarea
                    rows={2}
                    value={pDescFr}
                    onChange={e => setPDescFr(e.target.value)}
                    className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">{t('productDescAr')}</label>
                  <textarea
                    rows={2}
                    value={pDescAr}
                    onChange={e => setPDescAr(e.target.value)}
                    className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded-lg font-arabic"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">{t('price')} *</label>
                  <input
                    type="number"
                    required
                    value={pPrice}
                    onChange={e => setPPrice(parseFloat(e.target.value))}
                    className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">{t('promoPrice')}</label>
                  <input
                    type="number"
                    value={pPromoPrice || ''}
                    onChange={e => setPPromoPrice(e.target.value ? parseFloat(e.target.value) : undefined)}
                    placeholder="Optionnel"
                    className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">{t('initialStock')} *</label>
                  <input
                    type="number"
                    required
                    value={pStock}
                    onChange={e => setPStock(parseInt(e.target.value))}
                    className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">{t('filterShape')}</label>
                  <select
                    value={pShape}
                    onChange={e => setPShape(e.target.value as any)}
                    className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded-lg"
                  >
                    <option value="round">Ronde</option>
                    <option value="aviator">Aviateur</option>
                    <option value="square">Carrée</option>
                    <option value="cat-eye">Œil de chat</option>
                    <option value="geometric">Géométrique</option>
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">{t('filterMaterial')}</label>
                  <select
                    value={pMaterial}
                    onChange={e => setPMaterial(e.target.value as any)}
                    className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded-lg"
                  >
                    <option value="titanium">Titane</option>
                    <option value="acetate">Acétate</option>
                    <option value="metal">Métal</option>
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">Catégorie</label>
                  <select
                    value={pCategory}
                    onChange={e => setPCategory(e.target.value)}
                    className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded-lg"
                  >
                    <option value="prescription">Lunettes de Vue</option>
                    <option value="sunglasses">Lunettes de Soleil</option>
                    <option value="blue-light">Anti-Lumière Bleue</option>
                    <option value="luxury">Haute Lunetterie</option>
                  </select>
                </div>
              </div>

              {/* 2D Try-on Option */}
              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-neutral-900">
                  <input
                    type="checkbox"
                    checked={pTryOnSupported}
                    onChange={e => setPTryOnSupported(e.target.checked)}
                    className="rounded text-neutral-900"
                  />
                  <span>Activer l'essayage photo 2D pour cette monture</span>
                </label>
                {pTryOnSupported && (
                  <div>
                    <label className="block text-neutral-500 text-[11px] mb-1">Modèle SVG 2D associé</label>
                    <select
                      value={pFrameDefId}
                      onChange={e => setPFrameDefId(e.target.value)}
                      className="w-full p-2 bg-white border border-neutral-200 rounded-lg"
                    >
                      {FRAME_DEFINITIONS.map(f => (
                        <option key={f.id} value={f.id}>{f.name.fr} ({f.shape})</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="px-4 py-2 bg-neutral-100 text-neutral-700 rounded-lg font-semibold"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-neutral-900 text-white rounded-lg font-semibold"
                >
                  {t('saveProduct')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Adjust Stock */}
      {stockModalOpen && stockAdjustProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-neutral-200 space-y-4">
            <h3 className="font-bold text-sm text-neutral-900">
              Ajustement du stock · {stockAdjustProduct.name.fr}
            </h3>
            <form onSubmit={handleConfirmStockAdjust} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-700 font-medium mb-1">Nouvelle quantité en stock *</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={newStockQty}
                  onChange={e => setNewStockQty(parseInt(e.target.value))}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg font-mono text-sm"
                />
              </div>
              <div>
                <label className="block text-neutral-700 font-medium mb-1">{t('stockAdjustmentReason')} *</label>
                <input
                  type="text"
                  required
                  value={stockReason}
                  onChange={e => setStockReason(e.target.value)}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStockModalOpen(false)}
                  className="px-4 py-2 bg-neutral-100 text-neutral-700 rounded-lg font-semibold"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-neutral-900 text-white rounded-lg font-semibold"
                >
                  Mettre à jour le stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Update Shipping */}
      {shippingModalOpen && activeOrderToShip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-neutral-200 space-y-4">
            <h3 className="font-bold text-sm text-neutral-900">
              Mise à jour expédition · {activeOrderToShip.subOrderId}
            </h3>
            <form onSubmit={handleConfirmShipping} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-700 font-medium mb-1">Nouveau statut d'acheminement</label>
                <select
                  value={statusSelect}
                  onChange={e => setStatusSelect(e.target.value as any)}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg"
                >
                  <option value="processing">En cours de préparation</option>
                  <option value="ready_for_shipment">Prête pour expédition</option>
                  <option value="shipped">Expédiée (Remis au livreur)</option>
                  <option value="delivered">Livrée au client</option>
                </select>
              </div>
              <div>
                <label className="block text-neutral-700 font-medium mb-1">{t('carrier')}</label>
                <input
                  type="text"
                  value={carrierInput}
                  onChange={e => setCarrierInput(e.target.value)}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-neutral-700 font-medium mb-1">{t('trackingNumber')}</label>
                <input
                  type="text"
                  value={trackingNumberInput}
                  onChange={e => setTrackingNumberInput(e.target.value)}
                  placeholder="Ex: CHRO-998231-FR"
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg font-mono"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShippingModalOpen(false)}
                  className="px-4 py-2 bg-neutral-100 text-neutral-700 rounded-lg font-semibold"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-neutral-900 text-white rounded-lg font-semibold"
                >
                  Enregistrer l'expédition
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Request Payout */}
      {payoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-neutral-200 space-y-4">
            <h3 className="font-bold text-sm text-neutral-900">
              Demande de reversement de vos fonds COD
            </h3>
            <p className="text-xs text-neutral-500">
              Solde disponible : <strong>{formatPrice(availableBalance)}</strong>
            </p>
            <form onSubmit={handleConfirmPayout} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-700 font-medium mb-1">Montant souhaité (€) *</label>
                <input
                  type="number"
                  min="10"
                  max={availableBalance}
                  required
                  value={payoutAmount}
                  onChange={e => setPayoutAmount(parseFloat(e.target.value))}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg font-mono"
                />
              </div>
              <div>
                <label className="block text-neutral-700 font-medium mb-1">Coordonnées bancaires (IBAN / RIB) *</label>
                <input
                  type="text"
                  required
                  value={payoutIban}
                  onChange={e => setPayoutIban(e.target.value)}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg font-mono"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPayoutModalOpen(false)}
                  className="px-4 py-2 bg-neutral-100 text-neutral-700 rounded-lg font-semibold"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-neutral-900 text-white rounded-lg font-semibold"
                >
                  Transmettre la demande à l'administrateur
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
