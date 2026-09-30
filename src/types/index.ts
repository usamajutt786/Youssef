export type Role = 'customer' | 'seller' | 'admin' | 'guest';
export type Language = 'fr' | 'ar';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  sellerStoreId?: string;
  phone?: string;
  avatar?: string;
  createdAt: string;
}

export type StoreStatus = 'pending' | 'approved' | 'rejected' | 'suspended';

export interface Store {
  id: string;
  sellerId: string;
  sellerName: string;
  name: string;
  slug: string;
  logo: string;
  coverImage: string;
  description: {
    fr: string;
    ar: string;
  };
  rating: number;
  reviewCount: number;
  location: string;
  country: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  status: StoreStatus;
  rejectionReason?: string;
  commissionRateOverride?: number; // e.g. 10 for 10%
  layoutTemplate: 'minimal' | 'boutique' | 'modern';
  followerCount: number;
  returnPolicy: {
    fr: string;
    ar: string;
  };
  storePolicies: {
    fr: string;
    ar: string;
  };
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    website?: string;
  };
  featuredProductIds: string[];
  createdAt: string;
}

export interface Category {
  id: string;
  slug: string;
  name: {
    fr: string;
    ar: string;
  };
  description: {
    fr: string;
    ar: string;
  };
  iconName?: string;
  count: number;
}

export interface Brand {
  id: string;
  name: string;
  country: string;
}

export type FrameShape = 'round' | 'aviator' | 'square' | 'cat-eye' | 'geometric' | 'wayfarer' | 'oval';
export type Gender = 'unisex' | 'men' | 'women' | 'kids';
export type Material = 'acetate' | 'titanium' | 'metal' | 'wood' | 'recycled';
export type EyewearStyle = 'classic' | 'minimalist' | 'bold' | 'retro' | 'luxury' | 'sport';

export interface ProductVariant {
  id: string;
  colorName: {
    fr: string;
    ar: string;
  };
  colorHex: string;
  size: string; // e.g., 'M', 'L', '51-19-145'
  sku: string;
  price: number;
  promotionalPrice?: number;
  stock: number;
  isAvailable: boolean;
}

export interface TryOnAsset {
  supported: boolean;
  frameSvgOrPng: string; // Vector SVG data or path
  lensShape: FrameShape;
  frameWidthMm: number;
  frameHeightMm: number;
  lensWidthMm: number;
  bridgeWidthMm: number;
  templeLengthMm: number;
  defaultScale: number;
  defaultOffsetY: number; // percentage offset from center
  defaultRotation: number;
  moderationStatus: 'approved' | 'pending' | 'rejected';
}

export type ProductStatus = 'published' | 'pending_approval' | 'draft' | 'rejected';

export interface Product {
  id: string;
  reference: string;
  slug: string;
  sellerId: string;
  storeId: string;
  brandId: string;
  brandName: string;
  categoryId: string; // e.g., 'sunglasses', 'prescription', 'blue-light'
  name: {
    fr: string;
    ar: string;
  };
  description: {
    fr: string;
    ar: string;
  };
  price: number;
  promotionalPrice?: number;
  stock: number;
  shape: FrameShape;
  gender: Gender;
  ageGroup: 'adult' | 'kids';
  material: Material;
  style: EyewearStyle;
  images: string[];
  tryOnAsset: TryOnAsset;
  status: ProductStatus;
  rejectionReason?: string;
  variants: ProductVariant[];
  dimensions: {
    lensWidth: number;
    bridgeWidth: number;
    templeLength: number;
  };
  rating: number;
  reviewCount: number;
  tryOnCount: number;
  viewsCount: number;
  cartAddCount: number;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  createdAt: string;
}

export interface CartItem {
  id: string;
  productId: string;
  variantId: string;
  storeId: string;
  storeName: string;
  productName: {
    fr: string;
    ar: string;
  };
  reference: string;
  selectedColor: {
    fr: string;
    ar: string;
  };
  selectedColorHex: string;
  selectedSize: string;
  unitPrice: number;
  quantity: number;
  image: string;
  availableStock: number;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'ready_for_shipment'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'returned'
  | 'refunded';

export interface TrackingEntry {
  status: OrderStatus | string;
  timestamp: string;
  note: string;
}

export interface SellerSubOrder {
  subOrderId: string;
  storeId: string;
  storeName: string;
  sellerId: string;
  items: {
    productId: string;
    productName: {
      fr: string;
      ar: string;
    };
    reference: string;
    variantId: string;
    colorName: string;
    size: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
    image: string;
  }[];
  subtotal: number;
  shippingCost: number;
  commissionRate: number; // Snapshot %
  commissionAmount: number;
  netPayout: number;
  status: OrderStatus;
  trackingCarrier?: string;
  trackingNumber?: string;
  trackingTimeline: TrackingEntry[];
  returnRequested?: boolean;
  returnReason?: string;
  returnStatus?: 'none' | 'requested' | 'approved' | 'rejected' | 'processed';
}

export interface Order {
  id: string; // e.g. "OPT-2026-8812"
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    recipientName: string;
    phone: string;
    country: string;
    city: string;
    addressLine: string;
    postalCode: string;
  };
  paymentMethod: 'cod'; // Cash on Delivery ONLY
  paymentStatus: 'pending_cod' | 'collected';
  overallStatus: OrderStatus;
  subOrders: SellerSubOrder[];
  subtotal: number;
  shippingTotal: number;
  couponCode?: string;
  discountTotal: number;
  grandTotal: number;
  createdAt: string;
  notes?: string;
  disputeStatus?: 'none' | 'opened' | 'in_review' | 'resolved' | 'rejected';
  disputeDetails?: {
    type: 'not_received' | 'damaged' | 'wrong_item' | 'return_request' | 'refund_request' | 'payment_issue';
    customerNotes: string;
    adminNotes?: string;
    requestedAt: string;
    resolvedAt?: string;
  };
}

export interface Review {
  id: string;
  productId: string;
  productName: string;
  storeId: string;
  storeName: string;
  customerId: string;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
  status: 'approved' | 'pending' | 'rejected';
  verifiedPurchase: boolean;
}

export interface PayoutRequest {
  id: string;
  sellerId: string;
  storeId: string;
  storeName: string;
  amount: number;
  requestDate: string;
  processedDate?: string;
  status: 'pending' | 'approved' | 'rejected' | 'processed';
  paymentMethodDetails: string;
  adminNotes?: string;
}

export interface NotificationItem {
  id: string;
  recipientRole: Role;
  recipientId?: string; // specific user ID or empty for role broadcast
  title: {
    fr: string;
    ar: string;
  };
  message: {
    fr: string;
    ar: string;
  };
  link?: string;
  isRead: boolean;
  createdAt: string;
  type: 'order' | 'approval' | 'stock' | 'payout' | 'promotion' | 'dispute' | 'system';
}

export interface PromotionCoupon {
  id: string;
  code: string;
  storeId?: string; // undefined = platform-wide
  storeName?: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount?: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  applicableCategory?: string;
}

export interface PlatformSettings {
  marketplaceName: string;
  defaultCurrency: string; // e.g. "€" or "MAD"
  globalCommissionRate: number; // e.g. 12%
  freeShippingThreshold: number; // e.g. 100
  baseShippingCost: number; // e.g. 15
  demoModeNotice: boolean;
  contactEmail: string;
  supportPhone: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  role: Role;
  action: string;
  details: string;
}
