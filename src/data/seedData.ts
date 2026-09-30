import {
  User,
  Store,
  Category,
  Brand,
  Product,
  Order,
  Review,
  PayoutRequest,
  NotificationItem,
  PromotionCoupon,
  PlatformSettings,
  AuditLog
} from '../types';
import { FRAME_DEFINITIONS } from '../assets/frames/framesData';

export const SEED_USERS: User[] = [
  {
    id: 'user-cust-1',
    email: 'amina@example.com',
    name: 'Amina Benali',
    role: 'customer',
    phone: '+212 661 234567',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-08-10T10:00:00Z'
  },
  {
    id: 'user-seller-1',
    email: 'karim@atelier-optique.com',
    name: 'Karim Alami',
    role: 'seller',
    sellerStoreId: 'store-1',
    phone: '+33 1 42 68 55 00',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-08-01T09:00:00Z'
  },
  {
    id: 'user-seller-2',
    email: 'sofia@luxe-eyewear.com',
    name: 'Sofia Mansouri',
    role: 'seller',
    sellerStoreId: 'store-2',
    phone: '+212 522 998877',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-08-05T14:30:00Z'
  },
  {
    id: 'user-seller-3',
    email: 'henrik@nordic-frames.com',
    name: 'Henrik Lindqvist',
    role: 'seller',
    sellerStoreId: 'store-3',
    phone: '+45 33 12 34 56',
    createdAt: '2026-09-28T11:00:00Z'
  },
  {
    id: 'user-admin-1',
    email: 'admin@eyewear-marketplace.demo',
    name: 'Youssef Admin',
    role: 'admin',
    phone: '+33 1 00 00 00 00',
    createdAt: '2026-07-01T08:00:00Z'
  }
];

export const SEED_STORES: Store[] = [
  {
    id: 'store-1',
    sellerId: 'user-seller-1',
    sellerName: 'Karim Alami',
    name: 'Atelier Optique Paris',
    slug: 'atelier-optique',
    logo: 'https://images.unsplash.com/photo-1509695503495-cd293c66f91f?w=200&auto=format&fit=crop&q=80',
    coverImage: '/src/assets/images/store_artisan_atelier_1790807967991.jpg',
    description: {
      fr: 'Maison d\'optique artisanale fondée dans le Marais. Montures en titane japonais et acétates mûris au Japon, façonnées à la main pour un confort absolu.',
      ar: 'دار بصريات حرفية متخصصة في إطارات التيتانيوم الياباني والأسيتات الإيطالي المعتق، تصنع يدوياً لراحة متناهية وأناقة تدوم.'
    },
    rating: 4.9,
    reviewCount: 38,
    location: 'Paris, France',
    country: 'France',
    city: 'Paris',
    address: '14 Rue des Rosiers, 75004 Paris',
    phone: '+33 1 42 68 55 00',
    email: 'contact@atelier-optique.com',
    status: 'approved',
    layoutTemplate: 'boutique',
    followerCount: 240,
    returnPolicy: {
      fr: 'Retour accepté sous 14 jours après réception sous réserve que la monture soit non portée dans son étui d\'origine.',
      ar: 'يقبل الإرجاع خلال 14 يوماً من تاريخ الاستلام بشرط ألا يكون الإطار مستعملاً وأن يعاد في علبته الأصلية.'
    },
    storePolicies: {
      fr: 'Garantie monture 2 ans contre tout défaut de fabrication. Ajustement gratuit en atelier.',
      ar: 'ضمان لمدة سنتين ضد عيوب التصنيع مع إمكانية تعديل الإطار مجاناً في الورشة.'
    },
    socialLinks: {
      instagram: '@atelieroptiqueparis',
      website: 'https://atelier-optique.demo'
    },
    featuredProductIds: ['prod-1', 'prod-3', 'prod-5'],
    createdAt: '2026-08-01T09:00:00Z'
  },
  {
    id: 'store-2',
    sellerId: 'user-seller-2',
    sellerName: 'Sofia Mansouri',
    name: 'Luxe & Vision Studio',
    slug: 'luxe-vision',
    logo: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=200&auto=format&fit=crop&q=80',
    coverImage: '/src/assets/images/hero_eyewear_editorial_1790807933912.jpg',
    description: {
      fr: 'Studio de lunetterie avant-gardiste sélectionnant les créateurs solaires les plus audacieux. Protection UV maximale et finitions haute couture.',
      ar: 'استوديو بصريات فاخر يعرض أحدث تصميمات النظارات الشمسية الجريئة لأشهر المصممين. حماية فائقة من الأشعة فوق البنفسجية بلمسات كوتور.'
    },
    rating: 4.8,
    reviewCount: 29,
    location: 'Casablanca, Maroc',
    country: 'Maroc',
    city: 'Casablanca',
    address: 'Boulevard d\'Anfa, Quartier Gauthier',
    phone: '+212 522 998877',
    email: 'info@luxe-eyewear.com',
    status: 'approved',
    layoutTemplate: 'modern',
    followerCount: 185,
    returnPolicy: {
      fr: 'Échange ou retour sous 10 jours après vérification de la conformité du produit.',
      ar: 'الاستبدال أو الإرجاع متاح خلال 10 أيام بعد التأكد من سلامة المنتج وخلوه من الخدوش.'
    },
    storePolicies: {
      fr: 'Verres solaires catégorie 3 avec certificat de conformité UV400 inclus.',
      ar: 'عدسات شمسية من الفئة الثالثة مع شهادة مطابقة للحماية من الأشعة فوق البنفسجية UV400.'
    },
    featuredProductIds: ['prod-2', 'prod-4', 'prod-6'],
    createdAt: '2026-08-05T14:30:00Z'
  },
  {
    id: 'store-3',
    sellerId: 'user-seller-3',
    sellerName: 'Henrik Lindqvist',
    name: 'Nordic Frames Lab',
    slug: 'nordic-frames',
    logo: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=200&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1000&auto=format&fit=crop&q=80',
    description: {
      fr: 'Design scandinave pur, montures ultralégères en acétate biodégradable et acier chirurgical (dossier en attente de validation admin).',
      ar: 'تصميم اسكندنافي أنيق، إطارات فائقة الخفة من مواد مستدامة قابلة للتحلل وفولاذ جراحي (الملف قيد تدقيق الإدارة).'
    },
    rating: 0,
    reviewCount: 0,
    location: 'Copenhague, Danemark',
    country: 'Danemark',
    city: 'Copenhague',
    address: 'Østergade 12, 1100 København',
    phone: '+45 33 12 34 56',
    email: 'henrik@nordic-frames.com',
    status: 'pending', // Pending Admin Approval
    layoutTemplate: 'minimal',
    followerCount: 12,
    returnPolicy: {
      fr: 'Retour 14 jours.',
      ar: 'إرجاع خلال 14 يوماً.'
    },
    storePolicies: {
      fr: 'Garantie européenne 24 mois.',
      ar: 'ضمان أوروبي 24 شهراً.'
    },
    featuredProductIds: [],
    createdAt: '2026-09-28T11:00:00Z'
  }
];

export const SEED_CATEGORIES: Category[] = [
  {
    id: 'prescription',
    slug: 'prescription',
    name: { fr: 'Lunettes de Vue', ar: 'نظارات طبية' },
    description: { fr: 'Montures optiques alliant précision ergonomique et élégance intemporelle.', ar: 'إطارات بصرية تجمع بين الراحة الفائقة والتصميم الراقي.' },
    count: 24
  },
  {
    id: 'sunglasses',
    slug: 'sunglasses',
    name: { fr: 'Lunettes de Soleil', ar: 'نظارات شمسية' },
    description: { fr: 'Verres polarisés et montures solaires de créateurs avec protection UV400 intégrale.', ar: 'عدسات مستقطبة وإطارات شمسية حصرية مع حماية كاملة من الأشعة فوق البنفسجية.' },
    count: 32
  },
  {
    id: 'blue-light',
    slug: 'blue-light',
    name: { fr: 'Anti-Lumière Bleue', ar: 'حماية من الشاشات' },
    description: { fr: 'Verres filtrants pour réduire la fatigue oculaire face aux écrans d\'ordinateur.', ar: 'عدسات خاصة لتقليل إجهاد العين الناتج عن العمل المستمر أمام شاشات الأجهزة.' },
    count: 18
  },
  {
    id: 'reading',
    slug: 'reading',
    name: { fr: 'Lunettes de Lecture', ar: 'نظارات القراءة' },
    description: { fr: 'Confort de lecture rapproché sans compromis sur l\'esthétique.', ar: 'إطارات مريحة للقراءة والاستخدام اليومي عن قرب بتصاميم جذابة.' },
    count: 12
  },
  {
    id: 'kids',
    slug: 'kids',
    name: { fr: 'Enfants & Juniors', ar: 'نظارات الأطفال' },
    description: { fr: 'Matériaux souples et charnières incassables adaptées aux plus jeunes.', ar: 'إطارات مرنة وغير قابلة للكسر صممت خصيصاً لحركة الأطفال ونشاطهم.' },
    count: 10
  },
  {
    id: 'sports',
    slug: 'sports',
    name: { fr: 'Sports & Performance', ar: 'نظارات رياضية' },
    description: { fr: 'Montures aérodynamiques et grip antidérapant pour le cyclisme, la course et la voile.', ar: 'إطارات انسيابية مضادة للانزلاق مخصصة للجري وركوب الدراجات والرياضات المختلفة.' },
    count: 8
  },
  {
    id: 'luxury',
    slug: 'luxury',
    name: { fr: 'Haute Lunetterie', ar: 'نظارات فاخرة' },
    description: { fr: 'Pièces d\'exception numérotées, dorure à l\'or fin et acétates japonais rares.', ar: 'قطع حصرية محدودة الإصدار مطلية بالذهب وتفاصيل يدوية نادرة.' },
    count: 15
  },
  {
    id: 'accessories',
    slug: 'accessories',
    name: { fr: 'Accessoires & Étuis', ar: 'ملحقات وحافظات' },
    description: { fr: 'Étuis en cuir pleine fleur, microfibres soyeuses et cordons créateur.', ar: 'حافظات جلدية فاخرة ومناديل تنظيف دقيقة وسلاسل أنيقة.' },
    count: 9
  }
];

export const SEED_BRANDS: Brand[] = [
  { id: 'brand-matsuda', name: 'Matsuda Optics', country: 'Japon' },
  { id: 'brand-oliver', name: 'Oliver & Co', country: 'Royaume-Uni' },
  { id: 'brand-atelier', name: 'Atelier Lunetier', country: 'France' },
  { id: 'brand-silhouette', name: 'Silhouette Craft', country: 'Autriche' },
  { id: 'brand-visiotech', name: 'Visiotech Lab', country: 'Italie' }
];

export const SEED_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    reference: 'OPT-TIT-01',
    slug: 'aura-titanium-round',
    sellerId: 'user-seller-1',
    storeId: 'store-1',
    brandId: 'brand-matsuda',
    brandName: 'Matsuda Optics',
    categoryId: 'prescription',
    name: {
      fr: 'Aura Titane Rond Brossé',
      ar: 'أورا تيتانيوم دائري خفيف'
    },
    description: {
      fr: 'Monture ronde d\'une pureté absolue forgée dans un bloc de titane bêta japonais. Son pont cintré et ses plaquettes ergonomiques assurent une légèreté plume de 14 grammes pour une tenue sans pression.',
      ar: 'إطار دائري بتصميم هندسي فائق النقاء مصنوع من تيتانيوم بيتا الياباني. يتميز بجسر مقوس متين ووسادات أنف مريحة تضمن وزناً خفيفاً لا يتجاوز 14 غراماً لراحة مستمرة طوال اليوم.'
    },
    price: 245,
    promotionalPrice: 215,
    stock: 12,
    shape: 'round',
    gender: 'unisex',
    ageGroup: 'adult',
    material: 'titanium',
    style: 'minimalist',
    images: [
      '/src/assets/images/product_optics_titanium_1790807943846.jpg',
      'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=800&auto=format&fit=crop&q=80'
    ],
    tryOnAsset: {
      supported: true,
      frameSvgOrPng: FRAME_DEFINITIONS[0].id,
      lensShape: 'round',
      frameWidthMm: 132,
      frameHeightMm: 46,
      lensWidthMm: 48,
      bridgeWidthMm: 20,
      templeLengthMm: 145,
      defaultScale: 1.0,
      defaultOffsetY: 0,
      defaultRotation: 0,
      moderationStatus: 'approved'
    },
    status: 'published',
    variants: [
      {
        id: 'var-1-gold',
        colorName: { fr: 'Or Brossé', ar: 'ذهبي مطفي' },
        colorHex: '#C5A059',
        size: '48-20-145',
        sku: 'AURA-TIT-GLD',
        price: 215,
        stock: 5,
        isAvailable: true
      },
      {
        id: 'var-1-silver',
        colorName: { fr: 'Argent Platine', ar: 'فضي بلاتيني' },
        colorHex: '#D1D5DB',
        size: '48-20-145',
        sku: 'AURA-TIT-SLV',
        price: 215,
        stock: 4,
        isAvailable: true
      },
      {
        id: 'var-1-black',
        colorName: { fr: 'Noir Mat', ar: 'أسود مطفي' },
        colorHex: '#1F2937',
        size: '48-20-145',
        sku: 'AURA-TIT-BLK',
        price: 215,
        stock: 3,
        isAvailable: true
      }
    ],
    dimensions: {
      lensWidth: 48,
      bridgeWidth: 20,
      templeLength: 145
    },
    rating: 4.9,
    reviewCount: 16,
    tryOnCount: 148,
    viewsCount: 840,
    cartAddCount: 42,
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true,
    createdAt: '2026-08-12T10:00:00Z'
  },
  {
    id: 'prod-2',
    reference: 'SOL-TOR-02',
    slug: 'solstice-tortoiseshell-bold',
    sellerId: 'user-seller-2',
    storeId: 'store-2',
    brandId: 'brand-oliver',
    brandName: 'Oliver & Co',
    categoryId: 'sunglasses',
    name: {
      fr: 'Solstice Solaire Écaille Havane',
      ar: 'سولستيس شمسية بنقشة السلحفاة'
    },
    description: {
      fr: 'Monture solaire audacieuse taillée dans un acétate italien de 8mm aux reflets miel et chocolat. Équipée de verres solaires polarisés vert forêt catégorie 3 pour une clarté optique sans éblouissement.',
      ar: 'إطار شمسي بارز مصقول من الأسيتات الإيطالي الفاخر بسماكة 8 ملم بتدرجات العسل والشوكولاتة. مزودة بعدسات مستقطبة باللون الأخضر الزيتي فئة 3 لحماية فائقة من الوهج الشمسي.'
    },
    price: 280,
    promotionalPrice: 249,
    stock: 9,
    shape: 'square',
    gender: 'unisex',
    ageGroup: 'adult',
    material: 'acetate',
    style: 'bold',
    images: [
      '/src/assets/images/product_sunglasses_tortoise_1790807956638.jpg',
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop&q=80'
    ],
    tryOnAsset: {
      supported: true,
      frameSvgOrPng: FRAME_DEFINITIONS[2].id,
      lensShape: 'square',
      frameWidthMm: 142,
      frameHeightMm: 48,
      lensWidthMm: 52,
      bridgeWidthMm: 19,
      templeLengthMm: 145,
      defaultScale: 1.02,
      defaultOffsetY: 0,
      defaultRotation: 0,
      moderationStatus: 'approved'
    },
    status: 'published',
    variants: [
      {
        id: 'var-2-tortoise',
        colorName: { fr: 'Écaille Havane', ar: 'هافانا سلحفاة' },
        colorHex: '#78350f',
        size: '52-19-145',
        sku: 'SOL-TOR-HAV',
        price: 249,
        stock: 5,
        isAvailable: true
      },
      {
        id: 'var-2-black',
        colorName: { fr: 'Noir Onyx', ar: 'أسود نفاث' },
        colorHex: '#000000',
        size: '52-19-145',
        sku: 'SOL-TOR-BLK',
        price: 249,
        stock: 4,
        isAvailable: true
      }
    ],
    dimensions: {
      lensWidth: 52,
      bridgeWidth: 19,
      templeLength: 145
    },
    rating: 4.8,
    reviewCount: 22,
    tryOnCount: 195,
    viewsCount: 1120,
    cartAddCount: 56,
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true,
    createdAt: '2026-08-20T11:30:00Z'
  },
  {
    id: 'prod-3',
    reference: 'AVI-GOLD-03',
    slug: 'riviera-aviator-double-bridge',
    sellerId: 'user-seller-1',
    storeId: 'store-1',
    brandId: 'brand-atelier',
    brandName: 'Atelier Lunetier',
    categoryId: 'sunglasses',
    name: {
      fr: 'Riviera Aviateur Double Pont Or',
      ar: 'ريفييرا أفياتور ذهبي كلاسيكي'
    },
    description: {
      fr: 'Réinterprétation contemporaine de la légendaire silhouette aviateur. Double pont ciselé au laser, verres minéraux antireflet face interne et manchons en acétate écaille.',
      ar: 'إعادة إحياء عصرية لتصميم الأفياتور الأسطوري. جسر مزدوج منقوش بالليزر، وعدسات زجاجية نقية مع طبقة مانعة للانعكاس وأطراف أذرع مريحة من الأسيتات.'
    },
    price: 260,
    stock: 7,
    shape: 'aviator',
    gender: 'men',
    ageGroup: 'adult',
    material: 'metal',
    style: 'classic',
    images: [
      'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800&auto=format&fit=crop&q=80'
    ],
    tryOnAsset: {
      supported: true,
      frameSvgOrPng: FRAME_DEFINITIONS[1].id,
      lensShape: 'aviator',
      frameWidthMm: 140,
      frameHeightMm: 52,
      lensWidthMm: 58,
      bridgeWidthMm: 14,
      templeLengthMm: 140,
      defaultScale: 1.05,
      defaultOffsetY: 2,
      defaultRotation: 0,
      moderationStatus: 'approved'
    },
    status: 'published',
    variants: [
      {
        id: 'var-3-gold',
        colorName: { fr: 'Or Poli & Vert Solaire', ar: 'ذهبي مصقول وعدسات خضراء' },
        colorHex: '#D97706',
        size: '58-14-140',
        sku: 'RIV-AVI-GLD',
        price: 260,
        stock: 4,
        isAvailable: true
      },
      {
        id: 'var-3-gunmetal',
        colorName: { fr: 'Canon de Fusil', ar: 'رمادي معدني' },
        colorHex: '#4B5563',
        size: '58-14-140',
        sku: 'RIV-AVI-GUN',
        price: 260,
        stock: 3,
        isAvailable: true
      }
    ],
    dimensions: {
      lensWidth: 58,
      bridgeWidth: 14,
      templeLength: 140
    },
    rating: 4.7,
    reviewCount: 11,
    tryOnCount: 112,
    viewsCount: 650,
    cartAddCount: 28,
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: false,
    createdAt: '2026-08-25T15:00:00Z'
  },
  {
    id: 'prod-4',
    reference: 'CAT-COU-04',
    slug: 'panthere-cat-eye-couture',
    sellerId: 'user-seller-2',
    storeId: 'store-2',
    brandId: 'brand-silhouette',
    brandName: 'Silhouette Craft',
    categoryId: 'luxury',
    name: {
      fr: 'Panthère Papillon Œil de Chat',
      ar: 'بانثر عين القطة كوتور'
    },
    description: {
      fr: 'Courbes féline et angles effilés pour cette monture couture inspirée des années soixante. Acétate bordeaux profond poli à la main selon la tradition artisanale.',
      ar: 'منحنيات مستوحاة من أناقة الستينات مع زوايا ناعمة مسحوبة للأعلى. أسيتات بلون العنابي الملكي مصقول يدوياً لمنح إطلالة مفعمة بالجاذبية.'
    },
    price: 295,
    promotionalPrice: 265,
    stock: 6,
    shape: 'cat-eye',
    gender: 'women',
    ageGroup: 'adult',
    material: 'acetate',
    style: 'luxury',
    images: [
      'https://images.unsplash.com/photo-1509695503495-cd293c66f91f?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1577803645773-f96470509666?w=800&auto=format&fit=crop&q=80'
    ],
    tryOnAsset: {
      supported: true,
      frameSvgOrPng: FRAME_DEFINITIONS[3].id,
      lensShape: 'cat-eye',
      frameWidthMm: 136,
      frameHeightMm: 44,
      lensWidthMm: 53,
      bridgeWidthMm: 17,
      templeLengthMm: 140,
      defaultScale: 1.0,
      defaultOffsetY: -1,
      defaultRotation: 0,
      moderationStatus: 'approved'
    },
    status: 'published',
    variants: [
      {
        id: 'var-4-bordeaux',
        colorName: { fr: 'Bordeaux Profond', ar: 'عنابي فاخر' },
        colorHex: '#831843',
        size: '53-17-140',
        sku: 'PAN-CAT-BRD',
        price: 265,
        stock: 3,
        isAvailable: true
      },
      {
        id: 'var-4-black',
        colorName: { fr: 'Noir Glamour', ar: 'أسود براق' },
        colorHex: '#0f172a',
        size: '53-17-140',
        sku: 'PAN-CAT-BLK',
        price: 265,
        stock: 3,
        isAvailable: true
      }
    ],
    dimensions: {
      lensWidth: 53,
      bridgeWidth: 17,
      templeLength: 140
    },
    rating: 4.9,
    reviewCount: 14,
    tryOnCount: 178,
    viewsCount: 780,
    cartAddCount: 35,
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: false,
    createdAt: '2026-09-01T09:15:00Z'
  },
  {
    id: 'prod-5',
    reference: 'GEO-OCT-05',
    slug: 'tokyo-geometric-wireframe',
    sellerId: 'user-seller-1',
    storeId: 'store-1',
    brandId: 'brand-matsuda',
    brandName: 'Matsuda Optics',
    categoryId: 'blue-light',
    name: {
      fr: 'Tokyo Géométrique Verres Écran',
      ar: 'طوكيو هندسية مضلعة ضد الشاشات'
    },
    description: {
      fr: 'Profil octogonal facetté ultra-moderne avec traitement BlueFilter Pro 420nm. Protège les yeux de la fatigue visuelle sans jaunir la perception des couleurs.',
      ar: 'تصميم ثماني الأضلاع مبتكر ومستقبلي مع طبقة حماية متقدمة من الضوء الأزرق 420 نانومتر، يحمي عينيك من الإجهاد دون التأثير على تدرج الألوان الطبيعي.'
    },
    price: 195,
    stock: 15,
    shape: 'geometric',
    gender: 'unisex',
    ageGroup: 'adult',
    material: 'titanium',
    style: 'retro',
    images: [
      'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=800&auto=format&fit=crop&q=80'
    ],
    tryOnAsset: {
      supported: true,
      frameSvgOrPng: FRAME_DEFINITIONS[4].id,
      lensShape: 'geometric',
      frameWidthMm: 135,
      frameHeightMm: 45,
      lensWidthMm: 50,
      bridgeWidthMm: 19,
      templeLengthMm: 142,
      defaultScale: 1.0,
      defaultOffsetY: 0,
      defaultRotation: 0,
      moderationStatus: 'approved'
    },
    status: 'published',
    variants: [
      {
        id: 'var-5-rosegold',
        colorName: { fr: 'Or Rose Satiné', ar: 'وردي ذهبي' },
        colorHex: '#E0A899',
        size: '50-19-142',
        sku: 'TOK-GEO-RSG',
        price: 195,
        stock: 8,
        isAvailable: true
      },
      {
        id: 'var-5-black',
        colorName: { fr: 'Noir Anthracite', ar: 'أسود رمادي' },
        colorHex: '#334155',
        size: '50-19-142',
        sku: 'TOK-GEO-BLK',
        price: 195,
        stock: 7,
        isAvailable: true
      }
    ],
    dimensions: {
      lensWidth: 50,
      bridgeWidth: 19,
      templeLength: 142
    },
    rating: 4.6,
    reviewCount: 9,
    tryOnCount: 94,
    viewsCount: 490,
    cartAddCount: 22,
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: false,
    createdAt: '2026-09-05T14:00:00Z'
  },
  {
    id: 'prod-6',
    reference: 'ACC-CASE-07',
    slug: 'ecrin-cuir-artisan',
    sellerId: 'user-seller-1',
    storeId: 'store-1',
    brandId: 'brand-atelier',
    brandName: 'Atelier Lunetier',
    categoryId: 'accessories',
    name: {
      fr: 'Étui Lunettes Cuir Pleine Fleur',
      ar: 'حافظة نظارات جلدية طبيعية فاخرة'
    },
    description: {
      fr: 'Étui rigide confectionné à la main dans un cuir au tannage végétal de première qualité. Doublure intérieure en velours anti-rayures pour protéger vos montures les plus précieuses.',
      ar: 'حافظة صلبة مصنوعة يدوياً من الجلد الطبيعي المدبوغ نباتياً. مبطنة بالمخمل الناعم المقاوم للخدوش لحماية نظاراتك الثمينة بأعلى مستوى.'
    },
    price: 45,
    stock: 20,
    shape: 'square',
    gender: 'unisex',
    ageGroup: 'adult',
    material: 'wood',
    style: 'classic',
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80'
    ],
    tryOnAsset: {
      supported: false, // Accessory without virtual try-on!
      frameSvgOrPng: '',
      lensShape: 'square',
      frameWidthMm: 0,
      frameHeightMm: 0,
      lensWidthMm: 0,
      bridgeWidthMm: 0,
      templeLengthMm: 0,
      defaultScale: 1,
      defaultOffsetY: 0,
      defaultRotation: 0,
      moderationStatus: 'approved'
    },
    status: 'published',
    variants: [
      {
        id: 'var-6-cognac',
        colorName: { fr: 'Cuir Cognac', ar: 'جلد بني عسلي' },
        colorHex: '#9a3412',
        size: 'Unique',
        sku: 'ACC-CASE-CGN',
        price: 45,
        stock: 12,
        isAvailable: true
      },
      {
        id: 'var-6-black',
        colorName: { fr: 'Cuir Noir Ébène', ar: 'جلد أسود أبنوسي' },
        colorHex: '#18181b',
        size: 'Unique',
        sku: 'ACC-CASE-BLK',
        price: 45,
        stock: 8,
        isAvailable: true
      }
    ],
    dimensions: {
      lensWidth: 0,
      bridgeWidth: 0,
      templeLength: 0
    },
    rating: 4.9,
    reviewCount: 8,
    tryOnCount: 0,
    viewsCount: 220,
    cartAddCount: 19,
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: false,
    createdAt: '2026-08-15T12:00:00Z'
  }
];

export const SEED_ORDERS: Order[] = [
  {
    id: 'OPT-2026-8812',
    customerId: 'user-cust-1',
    customerName: 'Amina Benali',
    customerEmail: 'amina@example.com',
    customerPhone: '+212 661 234567',
    shippingAddress: {
      recipientName: 'Amina Benali',
      phone: '+212 661 234567',
      country: 'Maroc',
      city: 'Casablanca',
      addressLine: '42 Rue Ibn Batouta, Étage 3, Apt 12',
      postalCode: '20250'
    },
    paymentMethod: 'cod',
    paymentStatus: 'pending_cod', // Cash on delivery pending payment
    overallStatus: 'shipped',
    subOrders: [
      {
        subOrderId: 'SUB-8812-STORE1',
        storeId: 'store-1',
        storeName: 'Atelier Optique Paris',
        sellerId: 'user-seller-1',
        items: [
          {
            productId: 'prod-1',
            productName: { fr: 'Aura Titane Rond Brossé', ar: 'أورا تيتانيوم دائري خفيف' },
            reference: 'OPT-TIT-01',
            variantId: 'var-1-gold',
            colorName: 'Or Brossé',
            size: '48-20-145',
            quantity: 1,
            unitPrice: 215,
            subtotal: 215,
            image: '/src/assets/images/product_optics_titanium_1790807943846.jpg'
          }
        ],
        subtotal: 215,
        shippingCost: 15,
        commissionRate: 12,
        commissionAmount: 25.8,
        netPayout: 189.2,
        status: 'shipped',
        trackingCarrier: 'Chronopost Express COD',
        trackingNumber: 'CHRO-882910-FR',
        trackingTimeline: [
          { status: 'confirmed', timestamp: '2026-09-25T10:00:00Z', note: 'Commande confirmée par Atelier Optique' },
          { status: 'processing', timestamp: '2026-09-25T14:30:00Z', note: 'Monture ajustée et emballée en atelier' },
          { status: 'shipped', timestamp: '2026-09-26T09:00:00Z', note: 'Colis confié au transporteur — En transit' }
        ]
      },
      {
        subOrderId: 'SUB-8812-STORE2',
        storeId: 'store-2',
        storeName: 'Luxe & Vision Studio',
        sellerId: 'user-seller-2',
        items: [
          {
            productId: 'prod-2',
            productName: { fr: 'Solstice Solaire Écaille Havane', ar: 'سولستيس شمسية بنقشة السلحفاة' },
            reference: 'SOL-TOR-02',
            variantId: 'var-2-tortoise',
            colorName: 'Écaille Havane',
            size: '52-19-145',
            quantity: 1,
            unitPrice: 249,
            subtotal: 249,
            image: '/src/assets/images/product_sunglasses_tortoise_1790807956638.jpg'
          }
        ],
        subtotal: 249,
        shippingCost: 15,
        commissionRate: 12,
        commissionAmount: 29.88,
        netPayout: 219.12,
        status: 'ready_for_shipment',
        trackingCarrier: 'Amana Express COD',
        trackingNumber: 'AMN-554210-MA',
        trackingTimeline: [
          { status: 'confirmed', timestamp: '2026-09-25T10:15:00Z', note: 'Commande confirmée par Luxe & Vision' },
          { status: 'processing', timestamp: '2026-09-25T16:00:00Z', note: 'Contrôle qualité verres solaires effectué' },
          { status: 'ready_for_shipment', timestamp: '2026-09-26T11:00:00Z', note: 'Prêt pour ramassage par le coursier' }
        ]
      }
    ],
    subtotal: 464,
    shippingTotal: 30,
    couponCode: 'BIENVENUE10',
    discountTotal: 46.4,
    grandTotal: 447.6,
    createdAt: '2026-09-25T09:45:00Z'
  },
  {
    id: 'OPT-2026-7901',
    customerId: 'user-cust-1',
    customerName: 'Amina Benali',
    customerEmail: 'amina@example.com',
    customerPhone: '+212 661 234567',
    shippingAddress: {
      recipientName: 'Amina Benali',
      phone: '+212 661 234567',
      country: 'Maroc',
      city: 'Casablanca',
      addressLine: '42 Rue Ibn Batouta, Apt 12',
      postalCode: '20250'
    },
    paymentMethod: 'cod',
    paymentStatus: 'collected', // Payment already collected upon delivery!
    overallStatus: 'delivered',
    subOrders: [
      {
        subOrderId: 'SUB-7901-STORE1',
        storeId: 'store-1',
        storeName: 'Atelier Optique Paris',
        sellerId: 'user-seller-1',
        items: [
          {
            productId: 'prod-5',
            productName: { fr: 'Tokyo Géométrique Verres Écran', ar: 'طوكيو هندسية مضلعة ضد الشاشات' },
            reference: 'GEO-OCT-05',
            variantId: 'var-5-rosegold',
            colorName: 'Or Rose Satiné',
            size: '50-19-142',
            quantity: 1,
            unitPrice: 195,
            subtotal: 195,
            image: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=800&auto=format&fit=crop&q=80'
          }
        ],
        subtotal: 195,
        shippingCost: 15,
        commissionRate: 12,
        commissionAmount: 23.4,
        netPayout: 171.6,
        status: 'delivered',
        trackingCarrier: 'Colissimo COD',
        trackingNumber: 'COLI-338291-FR',
        trackingTimeline: [
          { status: 'confirmed', timestamp: '2026-09-10T08:00:00Z', note: 'Commande validée' },
          { status: 'shipped', timestamp: '2026-09-11T10:00:00Z', note: 'Expédié' },
          { status: 'delivered', timestamp: '2026-09-14T14:20:00Z', note: 'Colis remis en main propre, paiement en espèces encaissé' }
        ]
      }
    ],
    subtotal: 195,
    shippingTotal: 15,
    discountTotal: 0,
    grandTotal: 210,
    createdAt: '2026-09-10T07:30:00Z'
  }
];

export const SEED_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    productId: 'prod-1',
    productName: 'Aura Titane Rond Brossé',
    storeId: 'store-1',
    storeName: 'Atelier Optique Paris',
    customerId: 'user-cust-1',
    customerName: 'Amina Benali',
    rating: 5,
    comment: 'Monture d\'une légèreté incomparable. L\'essayage photo 2D m\'a permis de valider la taille exacte avant de commander en paiement à la livraison. Parfait !',
    createdAt: '2026-09-16T18:00:00Z',
    status: 'approved',
    verifiedPurchase: true
  },
  {
    id: 'rev-2',
    productId: 'prod-2',
    productName: 'Solstice Solaire Écaille Havane',
    storeId: 'store-2',
    storeName: 'Luxe & Vision Studio',
    customerId: 'user-cust-2',
    customerName: 'Yassine Kabbaj',
    rating: 5,
    comment: 'L\'acétate est splendide avec une finition très haut de gamme. Les verres polarisés sont d\'un grand confort pour la conduite.',
    createdAt: '2026-09-18T11:20:00Z',
    status: 'approved',
    verifiedPurchase: true
  }
];

export const SEED_PAYOUTS: PayoutRequest[] = [
  {
    id: 'pay-1',
    sellerId: 'user-seller-1',
    storeId: 'store-1',
    storeName: 'Atelier Optique Paris',
    amount: 171.6,
    requestDate: '2026-09-15T09:00:00Z',
    processedDate: '2026-09-16T14:00:00Z',
    status: 'processed',
    paymentMethodDetails: 'Virement bancaire IBAN FR76 3000 4000 5000 6000 700',
    adminNotes: 'Reversement suite encaissement commande livrée OPT-2026-7901.'
  },
  {
    id: 'pay-2',
    sellerId: 'user-seller-2',
    storeId: 'store-2',
    storeName: 'Luxe & Vision Studio',
    amount: 219.12,
    requestDate: '2026-09-28T16:00:00Z',
    status: 'pending',
    paymentMethodDetails: 'Virement bancaire CIH Bank Casablanca MA64 0117 8000 0012 3456',
    adminNotes: ''
  }
];

export const SEED_COUPONS: PromotionCoupon[] = [
  {
    id: 'coup-1',
    code: 'BIENVENUE10',
    discountType: 'percentage',
    discountValue: 10,
    minOrderAmount: 100,
    startDate: '2026-08-01',
    endDate: '2026-12-31',
    isActive: true
  },
  {
    id: 'coup-2',
    code: 'OPTIC15',
    storeId: 'store-1',
    storeName: 'Atelier Optique Paris',
    discountType: 'percentage',
    discountValue: 15,
    minOrderAmount: 150,
    startDate: '2026-09-01',
    endDate: '2026-10-31',
    isActive: true
  }
];

export const SEED_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    recipientRole: 'customer',
    recipientId: 'user-cust-1',
    title: { fr: 'Commande expédiée', ar: 'تم شحن طلبيتك' },
    message: {
      fr: 'Votre colis Atelier Optique pour la commande OPT-2026-8812 a été expédié.',
      ar: 'تم شحن طردك من أتيليه باريس للطلبية رقم OPT-2026-8812.'
    },
    isRead: false,
    createdAt: '2026-09-26T09:05:00Z',
    type: 'order'
  },
  {
    id: 'notif-2',
    recipientRole: 'seller',
    recipientId: 'user-seller-1',
    title: { fr: 'Nouvelle commande reçue', ar: 'طلبية جديدة واردة' },
    message: {
      fr: 'Nouvelle commande OPT-2026-8812 pour "Aura Titane Rond Brossé".',
      ar: 'طلبية جديدة رقم OPT-2026-8812 لإطار أورا تيتانيوم دائري.'
    },
    isRead: true,
    createdAt: '2026-09-25T09:46:00Z',
    type: 'order'
  },
  {
    id: 'notif-3',
    recipientRole: 'admin',
    title: { fr: 'Boutique en attente de validation', ar: 'متجر جديد بانتظار الاعتماد' },
    message: {
      fr: 'La boutique "Nordic Frames Lab" a soumis sa demande d\'adhésion.',
      ar: 'قدم متجر Nordic Frames Lab طلباً جديداً للانضمام للمنصة.'
    },
    isRead: false,
    createdAt: '2026-09-28T11:05:00Z',
    type: 'approval'
  }
];

export const SEED_SETTINGS: PlatformSettings = {
  marketplaceName: 'Optique Marketplace',
  defaultCurrency: '€',
  globalCommissionRate: 12, // 12% demo commission
  freeShippingThreshold: 150,
  baseShippingCost: 15,
  demoModeNotice: true,
  contactEmail: 'contact@eyewear-marketplace.demo',
  supportPhone: '+33 1 80 00 20 26'
};

export const SEED_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    timestamp: '2026-08-01T09:30:00Z',
    actor: 'admin@eyewear-marketplace.demo',
    role: 'admin',
    action: 'STORE_APPROVED',
    details: 'Approbation de la boutique Atelier Optique Paris'
  },
  {
    id: 'log-2',
    timestamp: '2026-08-05T15:00:00Z',
    actor: 'admin@eyewear-marketplace.demo',
    role: 'admin',
    action: 'STORE_APPROVED',
    details: 'Approbation de la boutique Luxe & Vision Studio'
  },
  {
    id: 'log-3',
    timestamp: '2026-09-16T14:00:00Z',
    actor: 'admin@eyewear-marketplace.demo',
    role: 'admin',
    action: 'PAYOUT_PROCESSED',
    details: 'Reversement de 171.60 € à Atelier Optique Paris'
  }
];
