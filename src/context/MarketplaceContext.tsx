import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  Store,
  Order,
  CartItem,
  Review,
  PayoutRequest,
  NotificationItem,
  PlatformSettings,
  AuditLog,
  PromotionCoupon,
  OrderStatus,
  Role,
  Category,
  Brand
} from '../types';
import {
  SEED_STORES,
  SEED_PRODUCTS,
  SEED_ORDERS,
  SEED_REVIEWS,
  SEED_PAYOUTS,
  SEED_NOTIFICATIONS,
  SEED_COUPONS,
  SEED_SETTINGS,
  SEED_AUDIT_LOGS,
  SEED_CATEGORIES,
  SEED_BRANDS
} from '../data/seedData';

interface MarketplaceContextType {
  stores: Store[];
  products: Product[];
  categories: Category[];
  brands: Brand[];
  orders: Order[];
  cart: CartItem[];
  appliedCoupon: PromotionCoupon | null;
  favorites: string[]; // product IDs
  followedStores: string[]; // store IDs
  reviews: Review[];
  payouts: PayoutRequest[];
  notifications: NotificationItem[];
  settings: PlatformSettings;
  auditLogs: AuditLog[];
  coupons: PromotionCoupon[];

  // Cart
  addToCart: (product: Product, variantId?: string, quantity?: number) => boolean;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  clearCart: () => void;
  getCartTotal: () => {
    subtotal: number;
    shippingTotal: number;
    discountTotal: number;
    grandTotal: number;
    itemsByStore: { store: Store; items: CartItem[]; subtotal: number; shipping: number }[];
  };

  // Checkout (COD)
  placeOrder: (
    customerInfo: { name: string; email: string; phone: string },
    shippingAddress: { country: string; city: string; addressLine: string; postalCode: string },
    notes?: string
  ) => Order | null;

  // Order Management
  updateSubOrderStatus: (
    orderId: string,
    subOrderId: string,
    status: OrderStatus,
    carrier?: string,
    trackingNumber?: string,
    note?: string
  ) => void;
  markOrderPaymentCollected: (orderId: string) => void;
  requestOrderReturn: (orderId: string, subOrderId: string, reason: string, notes: string) => void;
  resolveDispute: (orderId: string, resolution: string, adminNotes: string) => void;

  // Products
  createProduct: (productData: Partial<Product> & { storeId: string; sellerId: string }) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  duplicateProduct: (id: string) => Product | null;
  adjustStock: (productId: string, variantId: string, newStock: number, reason: string) => void;
  approveProduct: (id: string) => void;
  rejectProduct: (id: string, reason: string) => void;

  // Stores
  createStore: (storeData: Partial<Store> & { sellerId: string; sellerName: string }) => Store;
  updateStore: (id: string, updates: Partial<Store>) => void;
  approveStore: (id: string) => void;
  rejectStore: (id: string, reason: string) => void;
  suspendStore: (id: string) => void;
  reactivateStore: (id: string) => void;

  // Payouts
  requestPayout: (sellerId: string, storeId: string, storeName: string, amount: number, paymentDetails: string) => void;
  processPayout: (payoutId: string, adminNotes?: string) => void;
  rejectPayout: (payoutId: string, adminNotes?: string) => void;

  // Reviews
  addReview: (review: Omit<Review, 'id' | 'createdAt' | 'status'>) => void;
  moderateReview: (reviewId: string, status: 'approved' | 'rejected') => void;

  // User interactions
  toggleFavorite: (productId: string) => void;
  toggleFollowStore: (storeId: string) => void;
  incrementTryOnCount: (productId: string) => void;

  // Notifications
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: (role?: Role) => void;

  // Settings & Demo Reset
  updateSettings: (newSettings: Partial<PlatformSettings>) => void;
  resetAllDemoData: () => void;
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

const STORAGE_PREFIX = 'optique_v1_';

export const MarketplaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state with local storage fallback to seed data
  const [stores, setStores] = useState<Store[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PREFIX + 'stores');
      return saved ? JSON.parse(saved) : SEED_STORES;
    } catch {
      return SEED_STORES;
    }
  });

  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PREFIX + 'products');
      return saved ? JSON.parse(saved) : SEED_PRODUCTS;
    } catch {
      return SEED_PRODUCTS;
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PREFIX + 'orders');
      return saved ? JSON.parse(saved) : SEED_ORDERS;
    } catch {
      return SEED_ORDERS;
    }
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PREFIX + 'cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<PromotionCoupon | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PREFIX + 'applied_coupon');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PREFIX + 'favorites');
      return saved ? JSON.parse(saved) : ['prod-1'];
    } catch {
      return ['prod-1'];
    }
  });

  const [followedStores, setFollowedStores] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PREFIX + 'followed_stores');
      return saved ? JSON.parse(saved) : ['store-1'];
    } catch {
      return ['store-1'];
    }
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PREFIX + 'reviews');
      return saved ? JSON.parse(saved) : SEED_REVIEWS;
    } catch {
      return SEED_REVIEWS;
    }
  });

  const [payouts, setPayouts] = useState<PayoutRequest[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PREFIX + 'payouts');
      return saved ? JSON.parse(saved) : SEED_PAYOUTS;
    } catch {
      return SEED_PAYOUTS;
    }
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PREFIX + 'notifications');
      return saved ? JSON.parse(saved) : SEED_NOTIFICATIONS;
    } catch {
      return SEED_NOTIFICATIONS;
    }
  });

  const [settings, setSettings] = useState<PlatformSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PREFIX + 'settings');
      return saved ? JSON.parse(saved) : SEED_SETTINGS;
    } catch {
      return SEED_SETTINGS;
    }
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PREFIX + 'audit_logs');
      return saved ? JSON.parse(saved) : SEED_AUDIT_LOGS;
    } catch {
      return SEED_AUDIT_LOGS;
    }
  });

  const [coupons, setCoupons] = useState<PromotionCoupon[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PREFIX + 'coupons');
      return saved ? JSON.parse(saved) : SEED_COUPONS;
    } catch {
      return SEED_COUPONS;
    }
  });

  // Sync state to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PREFIX + 'stores', JSON.stringify(stores));
    } catch (e) {
      console.warn('Failed to save stores', e);
    }
  }, [stores]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PREFIX + 'products', JSON.stringify(products));
    } catch (e) {
      console.warn('Failed to save products', e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PREFIX + 'orders', JSON.stringify(orders));
    } catch (e) {
      console.warn('Failed to save orders', e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PREFIX + 'cart', JSON.stringify(cart));
    } catch (e) {
      console.warn('Failed to save cart', e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PREFIX + 'applied_coupon', JSON.stringify(appliedCoupon));
    } catch (e) {
      console.warn('Failed to save coupon', e);
    }
  }, [appliedCoupon]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PREFIX + 'favorites', JSON.stringify(favorites));
    } catch (e) {
      console.warn('Failed to save favorites', e);
    }
  }, [favorites]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PREFIX + 'followed_stores', JSON.stringify(followedStores));
    } catch (e) {
      console.warn('Failed to save followed stores', e);
    }
  }, [followedStores]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PREFIX + 'reviews', JSON.stringify(reviews));
    } catch (e) {
      console.warn('Failed to save reviews', e);
    }
  }, [reviews]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PREFIX + 'payouts', JSON.stringify(payouts));
    } catch (e) {
      console.warn('Failed to save payouts', e);
    }
  }, [payouts]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PREFIX + 'notifications', JSON.stringify(notifications));
    } catch (e) {
      console.warn('Failed to save notifications', e);
    }
  }, [notifications]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PREFIX + 'settings', JSON.stringify(settings));
    } catch (e) {
      console.warn('Failed to save settings', e);
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PREFIX + 'audit_logs', JSON.stringify(auditLogs));
    } catch (e) {
      console.warn('Failed to save audit logs', e);
    }
  }, [auditLogs]);

  // Helper to log audit actions
  const logAudit = (actor: string, role: Role, action: string, details: string) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
      actor,
      role,
      action,
      details
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Cart operations
  const addToCart = (product: Product, variantId?: string, quantity = 1): boolean => {
    const variant = variantId
      ? product.variants.find(v => v.id === variantId) || product.variants[0]
      : product.variants[0];

    if (!variant || variant.stock < 1) {
      return false;
    }

    const store = stores.find(s => s.id === product.storeId);
    const storeName = store ? store.name : 'Optique Partner';

    const cartItemId = `${product.id}-${variant.id}`;
    const unitPrice = variant.promotionalPrice || variant.price || product.promotionalPrice || product.price;

    setCart(prev => {
      const existing = prev.find(item => item.id === cartItemId);
      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, variant.stock);
        return prev.map(item =>
          item.id === cartItemId ? { ...item, quantity: newQty } : item
        );
      } else {
        const newItem: CartItem = {
          id: cartItemId,
          productId: product.id,
          variantId: variant.id,
          storeId: product.storeId,
          storeName,
          productName: product.name,
          reference: product.reference,
          selectedColor: variant.colorName,
          selectedColorHex: variant.colorHex,
          selectedSize: variant.size,
          unitPrice,
          quantity: Math.min(quantity, variant.stock),
          image: product.images[0] || '',
          availableStock: variant.stock
        };
        return [...prev, newItem];
      }
    });

    // Update product metrics
    setProducts(prev =>
      prev.map(p => (p.id === product.id ? { ...p, cartAddCount: p.cartAddCount + 1 } : p))
    );

    return true;
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(item => item.id !== cartItemId));
  };

  const updateCartQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart(prev =>
      prev.map(item => {
        if (item.id === cartItemId) {
          const validQty = Math.min(quantity, item.availableStock);
          return { ...item, quantity: validQty };
        }
        return item;
      })
    );
  };

  const applyCoupon = (code: string): { success: boolean; message: string } => {
    const cleanCode = code.trim().toUpperCase();
    const found = coupons.find(c => c.code.toUpperCase() === cleanCode && c.isActive);
    if (!found) {
      return { success: false, message: 'Code promo invalide ou expiré' };
    }
    setAppliedCoupon(found);
    return { success: true, message: 'Code promo appliqué avec succès' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const getCartTotal = () => {
    // Group by store
    const storeMap = new Map<string, CartItem[]>();
    cart.forEach(item => {
      const list = storeMap.get(item.storeId) || [];
      list.push(item);
      storeMap.set(item.storeId, list);
    });

    const itemsByStore: { store: Store; items: CartItem[]; subtotal: number; shipping: number }[] = [];
    let subtotal = 0;
    let shippingTotal = 0;

    storeMap.forEach((items, storeId) => {
      const store = stores.find(s => s.id === storeId) || {
        id: storeId,
        sellerId: '',
        sellerName: 'Vendeur',
        name: items[0]?.storeName || 'Boutique',
        slug: storeId,
        logo: '',
        coverImage: '',
        description: { fr: '', ar: '' },
        rating: 5,
        reviewCount: 1,
        location: '',
        country: '',
        city: '',
        address: '',
        phone: '',
        email: '',
        status: 'approved' as const,
        layoutTemplate: 'minimal' as const,
        followerCount: 0,
        returnPolicy: { fr: '', ar: '' },
        storePolicies: { fr: '', ar: '' },
        featuredProductIds: [],
        createdAt: ''
      };

      const storeSubtotal = items.reduce((sum, it) => sum + it.unitPrice * it.quantity, 0);
      const storeShipping = storeSubtotal >= settings.freeShippingThreshold ? 0 : settings.baseShippingCost;

      subtotal += storeSubtotal;
      shippingTotal += storeShipping;

      itemsByStore.push({
        store,
        items,
        subtotal: storeSubtotal,
        shipping: storeShipping
      });
    });

    let discountTotal = 0;
    if (appliedCoupon) {
      if (appliedCoupon.discountType === 'percentage') {
        discountTotal = (subtotal * appliedCoupon.discountValue) / 100;
      } else {
        discountTotal = appliedCoupon.discountValue;
      }
      discountTotal = Math.min(discountTotal, subtotal);
    }

    const grandTotal = Math.max(0, subtotal + shippingTotal - discountTotal);

    return {
      subtotal,
      shippingTotal,
      discountTotal,
      grandTotal,
      itemsByStore
    };
  };

  // Place Order with multi-seller sub-orders and COD only
  const placeOrder = (
    customerInfo: { name: string; email: string; phone: string },
    shippingAddress: { country: string; city: string; addressLine: string; postalCode: string },
    notes?: string
  ): Order | null => {
    if (cart.length === 0) return null;

    const totals = getCartTotal();
    const orderId = `OPT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Build seller sub-orders
    const subOrders = totals.itemsByStore.map((storeGroup, idx) => {
      const subOrderId = `SUB-${orderId.replace('OPT-', '')}-${idx + 1}`;
      const commissionRate = storeGroup.store.commissionRateOverride || settings.globalCommissionRate;
      const commissionAmount = Number(((storeGroup.subtotal * commissionRate) / 100).toFixed(2));
      const netPayout = Number((storeGroup.subtotal - commissionAmount).toFixed(2));

      return {
        subOrderId,
        storeId: storeGroup.store.id,
        storeName: storeGroup.store.name,
        sellerId: storeGroup.store.sellerId,
        items: storeGroup.items.map(it => ({
          productId: it.productId,
          productName: it.productName,
          reference: it.reference,
          variantId: it.variantId,
          colorName: it.selectedColor.fr,
          size: it.selectedSize,
          quantity: it.quantity,
          unitPrice: it.unitPrice,
          subtotal: it.unitPrice * it.quantity,
          image: it.image
        })),
        subtotal: storeGroup.subtotal,
        shippingCost: storeGroup.shipping,
        commissionRate,
        commissionAmount,
        netPayout,
        status: 'pending' as OrderStatus,
        trackingCarrier: 'Transporteur Express Partenaire (COD)',
        trackingTimeline: [
          {
            status: 'pending',
            timestamp: new Date().toISOString(),
            note: 'Commande reçue — En attente de confirmation par la boutique'
          }
        ]
      };
    });

    const newOrder: Order = {
      id: orderId,
      customerId: 'user-cust-1', // active demo customer session ID
      customerName: customerInfo.name,
      customerEmail: customerInfo.email,
      customerPhone: customerInfo.phone,
      shippingAddress: {
        recipientName: customerInfo.name,
        phone: customerInfo.phone,
        country: shippingAddress.country,
        city: shippingAddress.city,
        addressLine: shippingAddress.addressLine,
        postalCode: shippingAddress.postalCode
      },
      paymentMethod: 'cod', // CASH ON DELIVERY ONLY
      paymentStatus: 'pending_cod',
      overallStatus: 'pending',
      subOrders,
      subtotal: totals.subtotal,
      shippingTotal: totals.shippingTotal,
      couponCode: appliedCoupon?.code,
      discountTotal: totals.discountTotal,
      grandTotal: totals.grandTotal,
      createdAt: new Date().toISOString(),
      notes
    };

    // Deduct stock for each purchased item
    setProducts(prevProducts => {
      const updated = [...prevProducts];
      cart.forEach(cartItem => {
        const prodIndex = updated.findIndex(p => p.id === cartItem.productId);
        if (prodIndex !== -1) {
          const prod = { ...updated[prodIndex] };
          const variantIndex = prod.variants.findIndex(v => v.id === cartItem.variantId);
          if (variantIndex !== -1) {
            const variant = { ...prod.variants[variantIndex] };
            variant.stock = Math.max(0, variant.stock - cartItem.quantity);
            prod.variants = [
              ...prod.variants.slice(0, variantIndex),
              variant,
              ...prod.variants.slice(variantIndex + 1)
            ];
          }
          prod.stock = prod.variants.reduce((sum, v) => sum + v.stock, 0);
          updated[prodIndex] = prod;
        }
      });
      return updated;
    });

    // Save order
    setOrders(prev => [newOrder, ...prev]);

    // Send notifications to Customer, Sellers, Admin
    const newNotifications: NotificationItem[] = [
      {
        id: `notif-cust-${Date.now()}`,
        recipientRole: 'customer',
        recipientId: 'user-cust-1',
        title: {
          fr: 'Commande confirmée (Paiement à la livraison)',
          ar: 'تم تأكيد طلبيتك (الدفع عند الاستلام)'
        },
        message: {
          fr: `Votre commande ${orderId} de ${totals.grandTotal} ${settings.defaultCurrency} est en cours de traitement.`,
          ar: `طلبك رقم ${orderId} بقيمة ${totals.grandTotal} ${settings.defaultCurrency} قيد التجهيز الآن.`
        },
        isRead: false,
        createdAt: new Date().toISOString(),
        type: 'order'
      },
      {
        id: `notif-admin-${Date.now()}`,
        recipientRole: 'admin',
        title: {
          fr: 'Nouvelle commande multi-boutiques',
          ar: 'طلبية جديدة متعددة المتاجر'
        },
        message: {
          fr: `Commande ${orderId} passée par ${customerInfo.name} pour ${subOrders.length} boutique(s).`,
          ar: `طلبية ${orderId} من الزبون ${customerInfo.name} تضم ${subOrders.length} متجر.`
        },
        isRead: false,
        createdAt: new Date().toISOString(),
        type: 'order'
      }
    ];

    // Notification for each seller
    subOrders.forEach(sub => {
      newNotifications.push({
        id: `notif-seller-${sub.sellerId}-${Date.now()}`,
        recipientRole: 'seller',
        recipientId: sub.sellerId,
        title: {
          fr: 'Nouvelle sous-commande reçue',
          ar: 'طلبية جديدة واردة لمتجرك'
        },
        message: {
          fr: `Nouvelle commande ${sub.subOrderId} reçue (${sub.items.length} article(s) pour ${sub.subtotal} ${settings.defaultCurrency}).`,
          ar: `طلبية جديدة ${sub.subOrderId} بقيمة ${sub.subtotal} ${settings.defaultCurrency}.`
        },
        isRead: false,
        createdAt: new Date().toISOString(),
        type: 'order'
      });
    });

    setNotifications(prev => [...newNotifications, ...prev]);

    logAudit(
      customerInfo.email,
      'customer',
      'ORDER_PLACED',
      `Commande ${orderId} enregistrée (Paiement COD: ${totals.grandTotal} ${settings.defaultCurrency})`
    );

    clearCart();
    return newOrder;
  };

  // Seller updates their sub-order status and shipping tracking
  const updateSubOrderStatus = (
    orderId: string,
    subOrderId: string,
    status: OrderStatus,
    carrier?: string,
    trackingNumber?: string,
    note?: string
  ) => {
    setOrders(prevOrders => {
      return prevOrders.map(order => {
        if (order.id !== orderId) return order;

        const updatedSubOrders = order.subOrders.map(sub => {
          if (sub.subOrderId !== subOrderId) return sub;

          const newTimelineEntry = {
            status,
            timestamp: new Date().toISOString(),
            note: note || `Statut mis à jour: ${status}`
          };

          return {
            ...sub,
            status,
            trackingCarrier: carrier || sub.trackingCarrier,
            trackingNumber: trackingNumber || sub.trackingNumber,
            trackingTimeline: [...sub.trackingTimeline, newTimelineEntry]
          };
        });

        // Compute overall order status based on sub-orders
        let overallStatus: OrderStatus = order.overallStatus;
        const allStatuses = updatedSubOrders.map(s => s.status);
        if (allStatuses.every(s => s === 'delivered')) {
          overallStatus = 'delivered';
        } else if (allStatuses.some(s => s === 'shipped')) {
          overallStatus = 'shipped';
        } else if (allStatuses.some(s => s === 'processing' || s === 'ready_for_shipment')) {
          overallStatus = 'processing';
        } else if (allStatuses.every(s => s === 'cancelled')) {
          overallStatus = 'cancelled';
        }

        return {
          ...order,
          subOrders: updatedSubOrders,
          overallStatus
        };
      });
    });

    // Notify customer
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        recipientRole: 'customer',
        recipientId: 'user-cust-1',
        title: {
          fr: `Mise à jour d'expédition (${subOrderId})`,
          ar: `تحديث حالة الشحن (${subOrderId})`
        },
        message: {
          fr: `Le statut de votre colis est désormais: ${status}. ${trackingNumber ? `N° suivi: ${trackingNumber}` : ''}`,
          ar: `تم تحديث حالة شحنتك إلى: ${status}. ${trackingNumber ? `رقم التتبع: ${trackingNumber}` : ''}`
        },
        isRead: false,
        createdAt: new Date().toISOString(),
        type: 'order'
      },
      ...prev
    ]);
  };

  // Administrator marks Cash on Delivery collected
  const markOrderPaymentCollected = (orderId: string) => {
    setOrders(prev =>
      prev.map(ord => {
        if (ord.id !== orderId) return ord;
        return {
          ...ord,
          paymentStatus: 'collected'
        };
      })
    );

    logAudit('admin', 'admin', 'COD_PAYMENT_COLLECTED', `Paiement en espèces pour la commande ${orderId} validé`);

    setNotifications(prev => [
      {
        id: `notif-cod-${Date.now()}`,
        recipientRole: 'customer',
        title: {
          fr: 'Paiement à la livraison encaissé',
          ar: 'تم تأكيد تحصيل المبلغ نقداً'
        },
        message: {
          fr: `Le paiement en espèces de votre commande ${orderId} a été confirmé.`,
          ar: `تم تأكيد استلام المبلغ نقداً للطلبية ${orderId}.`
        },
        isRead: false,
        createdAt: new Date().toISOString(),
        type: 'order'
      },
      ...prev
    ]);
  };

  const requestOrderReturn = (orderId: string, subOrderId: string, reason: string, notes: string) => {
    setOrders(prev =>
      prev.map(ord => {
        if (ord.id !== orderId) return ord;
        return {
          ...ord,
          disputeStatus: 'opened',
          disputeDetails: {
            type: 'return_request',
            customerNotes: `${reason} - ${notes}`,
            requestedAt: new Date().toISOString()
          },
          subOrders: ord.subOrders.map(sub =>
            sub.subOrderId === subOrderId
              ? { ...sub, returnRequested: true, returnReason: reason, returnStatus: 'requested' }
              : sub
          )
        };
      })
    );

    setNotifications(prev => [
      {
        id: `notif-dispute-${Date.now()}`,
        recipientRole: 'admin',
        title: {
          fr: 'Nouvelle demande de retour client',
          ar: 'طلب إرجاع جديد من الزبون'
        },
        message: {
          fr: `Demande de retour pour la commande ${orderId} (${subOrderId}) - Motif: ${reason}`,
          ar: `طلب إرجاع للطلبية ${orderId} (${subOrderId}) - السبب: ${reason}`
        },
        isRead: false,
        createdAt: new Date().toISOString(),
        type: 'dispute'
      },
      ...prev
    ]);
  };

  const resolveDispute = (orderId: string, resolution: string, adminNotes: string) => {
    setOrders(prev =>
      prev.map(ord => {
        if (ord.id !== orderId) return ord;
        return {
          ...ord,
          disputeStatus: 'resolved',
          disputeDetails: {
            ...ord.disputeDetails!,
            adminNotes,
            resolvedAt: new Date().toISOString()
          }
        };
      })
    );
    logAudit('admin', 'admin', 'DISPUTE_RESOLVED', `Litige pour ${orderId} résolu: ${resolution}`);
  };

  // Products CRUD
  const createProduct = (productData: Partial<Product> & { storeId: string; sellerId: string }): Product => {
    const newId = `prod-${Date.now()}`;
    const newProduct: Product = {
      id: newId,
      reference: productData.reference || `REF-${Math.floor(1000 + Math.random() * 9000)}`,
      slug: (productData.name?.fr || 'monture').toLowerCase().replace(/\s+/g, '-'),
      sellerId: productData.sellerId,
      storeId: productData.storeId,
      brandId: productData.brandId || 'brand-atelier',
      brandName: productData.brandName || 'Atelier Créateur',
      categoryId: productData.categoryId || 'prescription',
      name: productData.name || { fr: 'Nouvelle Monture', ar: 'إطار جديد' },
      description: productData.description || { fr: 'Description du produit', ar: 'وصف المنتج' },
      price: productData.price || 150,
      promotionalPrice: productData.promotionalPrice,
      stock: productData.stock || 10,
      shape: productData.shape || 'round',
      gender: productData.gender || 'unisex',
      ageGroup: productData.ageGroup || 'adult',
      material: productData.material || 'acetate',
      style: productData.style || 'classic',
      images: productData.images && productData.images.length > 0 ? productData.images : [
        '/src/assets/images/product_optics_titanium_1790807943846.jpg'
      ],
      tryOnAsset: productData.tryOnAsset || {
        supported: true,
        frameSvgOrPng: 'round-titanium-01',
        lensShape: 'round',
        frameWidthMm: 135,
        frameHeightMm: 46,
        lensWidthMm: 48,
        bridgeWidthMm: 20,
        templeLengthMm: 145,
        defaultScale: 1.0,
        defaultOffsetY: 0,
        defaultRotation: 0,
        moderationStatus: 'pending'
      },
      status: 'pending_approval', // Requires admin moderation
      variants: productData.variants && productData.variants.length > 0 ? productData.variants : [
        {
          id: `var-${Date.now()}-1`,
          colorName: { fr: 'Classique', ar: 'كلاسيكي' },
          colorHex: '#18181b',
          size: 'M (50-19-145)',
          sku: `SKU-${Date.now()}`,
          price: productData.price || 150,
          stock: productData.stock || 10,
          isAvailable: true
        }
      ],
      dimensions: productData.dimensions || { lensWidth: 50, bridgeWidth: 19, templeLength: 145 },
      rating: 5,
      reviewCount: 0,
      tryOnCount: 0,
      viewsCount: 1,
      cartAddCount: 0,
      createdAt: new Date().toISOString()
    };

    setProducts(prev => [newProduct, ...prev]);

    // Admin alert for product moderation
    setNotifications(prev => [
      {
        id: `notif-prod-${Date.now()}`,
        recipientRole: 'admin',
        title: {
          fr: 'Nouveau produit en attente de modération',
          ar: 'منتج جديد بانتظار المراجعة والاعتماد'
        },
        message: {
          fr: `Le produit "${newProduct.name.fr}" a été soumis pour approbation.`,
          ar: `تم تقديم المنتج "${newProduct.name.ar}" للمراجعة والاعتماد.`
        },
        isRead: false,
        createdAt: new Date().toISOString(),
        type: 'approval'
      },
      ...prev
    ]);

    logAudit(productData.sellerId, 'seller', 'PRODUCT_CREATED', `Produit ${newProduct.reference} créé`);
    return newProduct;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, ...updates } : p))
    );
    logAudit('user', 'seller', 'PRODUCT_UPDATED', `Produit ${id} modifié`);
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    logAudit('user', 'seller', 'PRODUCT_DELETED', `Produit ${id} supprimé`);
  };

  const duplicateProduct = (id: string): Product | null => {
    const existing = products.find(p => p.id === id);
    if (!existing) return null;
    const duplicated: Product = {
      ...existing,
      id: `prod-${Date.now()}`,
      reference: `${existing.reference}-COPY`,
      name: {
        fr: `${existing.name.fr} (Copie)`,
        ar: `${existing.name.ar} (نسخة)`
      },
      status: 'draft',
      createdAt: new Date().toISOString()
    };
    setProducts(prev => [duplicated, ...prev]);
    return duplicated;
  };

  const adjustStock = (productId: string, variantId: string, newStock: number, reason: string) => {
    setProducts(prev =>
      prev.map(p => {
        if (p.id !== productId) return p;
        const variants = p.variants.map(v => (v.id === variantId ? { ...v, stock: Math.max(0, newStock) } : v));
        const totalStock = variants.reduce((sum, v) => sum + v.stock, 0);
        return { ...p, variants, stock: totalStock };
      })
    );
    logAudit('seller', 'seller', 'STOCK_ADJUSTED', `Stock pour ${productId} / ${variantId} ajusté à ${newStock}. Raison: ${reason}`);
  };

  const approveProduct = (id: string) => {
    setProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, status: 'published' } : p))
    );
    logAudit('admin', 'admin', 'PRODUCT_APPROVED', `Produit ${id} approuvé et publié`);
  };

  const rejectProduct = (id: string, reason: string) => {
    setProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, status: 'rejected', rejectionReason: reason } : p))
    );
    logAudit('admin', 'admin', 'PRODUCT_REJECTED', `Produit ${id} refusé. Motif: ${reason}`);
  };

  // Stores CRUD & Approvals
  const createStore = (storeData: Partial<Store> & { sellerId: string; sellerName: string }): Store => {
    const newStore: Store = {
      id: `store-${Date.now()}`,
      sellerId: storeData.sellerId,
      sellerName: storeData.sellerName,
      name: storeData.name || 'Nouvelle Boutique Optique',
      slug: (storeData.name || 'optique').toLowerCase().replace(/\s+/g, '-'),
      logo: storeData.logo || 'https://images.unsplash.com/photo-1509695503495-cd293c66f91f?w=200&auto=format&fit=crop&q=80',
      coverImage: storeData.coverImage || '/src/assets/images/store_artisan_atelier_1790807967991.jpg',
      description: storeData.description || {
        fr: 'Description de la nouvelle boutique optique.',
        ar: 'وصف المتجر الجديد للنظارات.'
      },
      rating: 5,
      reviewCount: 0,
      location: storeData.location || 'Paris, France',
      country: storeData.country || 'France',
      city: storeData.city || 'Paris',
      address: storeData.address || '123 Rue de la Paix',
      phone: storeData.phone || '+33 1 00 00 00 00',
      email: storeData.email || 'boutique@example.com',
      status: 'pending', // Pending Admin approval
      layoutTemplate: 'modern',
      followerCount: 1,
      returnPolicy: {
        fr: 'Retours acceptés sous 14 jours.',
        ar: 'الاسترجاع مقبول خلال 14 يوماً.'
      },
      storePolicies: {
        fr: 'Garantie légale 2 ans.',
        ar: 'ضمان لمدة سنتين.'
      },
      featuredProductIds: [],
      createdAt: new Date().toISOString()
    };

    setStores(prev => [...prev, newStore]);

    setNotifications(prev => [
      {
        id: `notif-store-${Date.now()}`,
        recipientRole: 'admin',
        title: {
          fr: 'Nouvelle demande d\'ouverture de boutique',
          ar: 'طلب فتح متجر جديد بانتظار الموافقة'
        },
        message: {
          fr: `La boutique "${newStore.name}" demande l'approbation de la plateforme.`,
          ar: `طلب المتجر "${newStore.name}" الاعتماد من الإدارة.`
        },
        isRead: false,
        createdAt: new Date().toISOString(),
        type: 'approval'
      },
      ...prev
    ]);

    logAudit(storeData.sellerId, 'seller', 'STORE_REGISTRATION', `Demande d'inscription boutique ${newStore.name}`);
    return newStore;
  };

  const updateStore = (id: string, updates: Partial<Store>) => {
    setStores(prev =>
      prev.map(s => (s.id === id ? { ...s, ...updates } : s))
    );
    logAudit('seller', 'seller', 'STORE_UPDATED', `Boutique ${id} mise à jour`);
  };

  const approveStore = (id: string) => {
    setStores(prev =>
      prev.map(s => (s.id === id ? { ...s, status: 'approved' } : s))
    );
    logAudit('admin', 'admin', 'STORE_APPROVED', `Boutique ${id} approuvée`);
  };

  const rejectStore = (id: string, reason: string) => {
    setStores(prev =>
      prev.map(s => (s.id === id ? { ...s, status: 'rejected', rejectionReason: reason } : s))
    );
    logAudit('admin', 'admin', 'STORE_REJECTED', `Boutique ${id} refusée: ${reason}`);
  };

  const suspendStore = (id: string) => {
    setStores(prev =>
      prev.map(s => (s.id === id ? { ...s, status: 'suspended' } : s))
    );
    logAudit('admin', 'admin', 'STORE_SUSPENDED', `Boutique ${id} suspendue`);
  };

  const reactivateStore = (id: string) => {
    setStores(prev =>
      prev.map(s => (s.id === id ? { ...s, status: 'approved' } : s))
    );
    logAudit('admin', 'admin', 'STORE_REACTIVATED', `Boutique ${id} réactivée`);
  };

  // Payouts
  const requestPayout = (sellerId: string, storeId: string, storeName: string, amount: number, paymentDetails: string) => {
    const newPayout: PayoutRequest = {
      id: `pay-${Date.now()}`,
      sellerId,
      storeId,
      storeName,
      amount,
      requestDate: new Date().toISOString(),
      status: 'pending',
      paymentMethodDetails: paymentDetails
    };
    setPayouts(prev => [newPayout, ...prev]);

    setNotifications(prev => [
      {
        id: `notif-pay-${Date.now()}`,
        recipientRole: 'admin',
        title: {
          fr: 'Nouvelle demande de reversement vendeur',
          ar: 'طلب سحب أرباح جديد من بائع'
        },
        message: {
          fr: `${storeName} a demandé un reversement de ${amount} ${settings.defaultCurrency}.`,
          ar: `طلب متجر ${storeName} سحب مبلغ ${amount} ${settings.defaultCurrency}.`
        },
        isRead: false,
        createdAt: new Date().toISOString(),
        type: 'payout'
      },
      ...prev
    ]);

    logAudit(sellerId, 'seller', 'PAYOUT_REQUESTED', `Demande de reversement de ${amount} ${settings.defaultCurrency} par ${storeName}`);
  };

  const processPayout = (payoutId: string, adminNotes?: string) => {
    setPayouts(prev =>
      prev.map(p =>
        p.id === payoutId
          ? { ...p, status: 'processed', processedDate: new Date().toISOString(), adminNotes }
          : p
      )
    );
    logAudit('admin', 'admin', 'PAYOUT_PROCESSED', `Reversement ${payoutId} validé et marqué comme payé`);
  };

  const rejectPayout = (payoutId: string, adminNotes?: string) => {
    setPayouts(prev =>
      prev.map(p =>
        p.id === payoutId
          ? { ...p, status: 'rejected', processedDate: new Date().toISOString(), adminNotes }
          : p
      )
    );
    logAudit('admin', 'admin', 'PAYOUT_REJECTED', `Reversement ${payoutId} refusé`);
  };

  // Reviews
  const addReview = (review: Omit<Review, 'id' | 'createdAt' | 'status'>) => {
    const newRev: Review = {
      ...review,
      id: `rev-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'approved'
    };
    setReviews(prev => [newRev, ...prev]);

    // Recalculate product rating
    setProducts(prev =>
      prev.map(p => {
        if (p.id !== review.productId) return p;
        const prodReviews = [...reviews.filter(r => r.productId === p.id && r.status === 'approved'), newRev];
        const avg = prodReviews.reduce((sum, r) => sum + r.rating, 0) / prodReviews.length;
        return {
          ...p,
          rating: Number(avg.toFixed(1)),
          reviewCount: prodReviews.length
        };
      })
    );
  };

  const moderateReview = (reviewId: string, status: 'approved' | 'rejected') => {
    setReviews(prev =>
      prev.map(r => (r.id === reviewId ? { ...r, status } : r))
    );
  };

  // Interactions
  const toggleFavorite = (productId: string) => {
    setFavorites(prev =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  const toggleFollowStore = (storeId: string) => {
    setFollowedStores(prev => {
      const isFollowing = prev.includes(storeId);
      const next = isFollowing ? prev.filter(id => id !== storeId) : [...prev, storeId];
      // Update store followerCount
      setStores(storesList =>
        storesList.map(s =>
          s.id === storeId
            ? { ...s, followerCount: Math.max(0, s.followerCount + (isFollowing ? -1 : 1)) }
            : s
        )
      );
      return next;
    });
  };

  const incrementTryOnCount = (productId: string) => {
    setProducts(prev =>
      prev.map(p => (p.id === productId ? { ...p, tryOnCount: p.tryOnCount + 1 } : p))
    );
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsRead = (role?: Role) => {
    setNotifications(prev =>
      prev.map(n => (!role || n.recipientRole === role ? { ...n, isRead: true } : n))
    );
  };

  // Settings
  const updateSettings = (newSettings: Partial<PlatformSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    logAudit('admin', 'admin', 'SETTINGS_UPDATED', 'Paramètres de la plateforme mis à jour');
  };

  // Reset demo
  const resetAllDemoData = () => {
    try {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(STORAGE_PREFIX)) {
          localStorage.removeItem(key);
        }
      });
    } catch {
      // ignore
    }
    setStores(SEED_STORES);
    setProducts(SEED_PRODUCTS);
    setOrders(SEED_ORDERS);
    setCart([]);
    setAppliedCoupon(null);
    setFavorites(['prod-1']);
    setFollowedStores(['store-1']);
    setReviews(SEED_REVIEWS);
    setPayouts(SEED_PAYOUTS);
    setNotifications(SEED_NOTIFICATIONS);
    setSettings(SEED_SETTINGS);
    setAuditLogs(SEED_AUDIT_LOGS);
    setCoupons(SEED_COUPONS);
  };

  return (
    <MarketplaceContext.Provider
      value={{
        stores,
        products,
        categories: SEED_CATEGORIES,
        brands: SEED_BRANDS,
        orders,
        cart,
        appliedCoupon,
        favorites,
        followedStores,
        reviews,
        payouts,
        notifications,
        settings,
        auditLogs,
        coupons,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        applyCoupon,
        removeCoupon,
        clearCart,
        getCartTotal,
        placeOrder,
        updateSubOrderStatus,
        markOrderPaymentCollected,
        requestOrderReturn,
        resolveDispute,
        createProduct,
        updateProduct,
        deleteProduct,
        duplicateProduct,
        adjustStock,
        approveProduct,
        rejectProduct,
        createStore,
        updateStore,
        approveStore,
        rejectStore,
        suspendStore,
        reactivateStore,
        requestPayout,
        processPayout,
        rejectPayout,
        addReview,
        moderateReview,
        toggleFavorite,
        toggleFollowStore,
        incrementTryOnCount,
        markNotificationRead,
        markAllNotificationsRead,
        updateSettings,
        resetAllDemoData
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
};

export const useMarketplace = () => {
  const context = useContext(MarketplaceContext);
  if (!context) {
    throw new Error('useMarketplace must be used within a MarketplaceProvider');
  }
  return context;
};
