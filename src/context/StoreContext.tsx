import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, AppRoute, StoreSettings, Order, ProductVariant } from '../types';
import { products as initialProducts } from '../data/products';

interface StoreContextType {
  products: Product[];
  cart: CartItem[];
  currentRoute: AppRoute;
  selectedProduct: Product | null;
  settings: StoreSettings;
  isCartDrawerOpen: boolean;
  isQuickViewOpen: boolean;
  quickViewProduct: Product | null;
  isSearchOpen: boolean;
  isCustomizerOpen: boolean;
  couponCode: string | null;
  appliedDiscount: number;
  latestOrder: Order | null;
  viewMode: 'desktop' | 'mobile-preview';
  showTouchErgonomics: boolean;

  // Actions
  addToCart: (product: Product, quantity?: number, variant?: ProductVariant) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  setCurrentRoute: (route: AppRoute, pushHistory?: boolean) => void;
  setSelectedProduct: (product: Product | null, pushHistory?: boolean) => void;
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;
  setIsCartDrawerOpen: (open: boolean) => void;
  setIsSearchOpen: (open: boolean) => void;
  setIsCustomizerOpen: (open: boolean) => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  updateSettings: (newSettings: Partial<StoreSettings>) => void;
  setLatestOrder: (order: Order | null) => void;
  setViewMode: (mode: 'desktop' | 'mobile-preview') => void;
  setShowTouchErgonomics: (show: boolean) => void;
  cartTotal: number;
  cartCount: number;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const initialSettings: StoreSettings = {
  storeName: 'ESSENDAAR',
  tagline: 'Clean Solutions. Reliable Services.',
  phone: '+91 97879 79757',
  email: 'essendaargroup@gmail.com',
  location: 'Mangadu, Chennai, Tamil Nadu - 600122',
  announcementText: 'ISO 9001:2015 Certified | Tamilnadu Test House Tested Formulation | Chennai Metro 24h Express Dispatch',
  currencySymbol: '₹',
  freeShippingThreshold: 499,
  isElementorMode: false,
  enableUpiQr: true,
};

// Helper to resolve route and product from URL pathname
const parseRouteFromUrl = (productsList: Product[]) => {
  if (typeof window === 'undefined') {
    return { route: 'home' as AppRoute, product: productsList[0] || null };
  }

  const path = window.location.pathname.toLowerCase().replace(/\/+$/, '') || '/';

  if (path === '' || path === '/') {
    return { route: 'home' as AppRoute, product: productsList[0] || null };
  }
  if (path.includes('/shop')) {
    return { route: 'shop' as AppRoute, product: null };
  }
  if (path.includes('/checkout')) {
    return { route: 'checkout' as AppRoute, product: null };
  }
  if (path.includes('/contact')) {
    return { route: 'contact' as AppRoute, product: null };
  }
  if (path.includes('/about')) {
    return { route: 'about-us' as AppRoute, product: null };
  }
  if (path.includes('/facility-management')) {
    return { route: 'facility-management' as AppRoute, product: null };
  }
  if (path.includes('/manpower-support')) {
    return { route: 'manpower-support' as AppRoute, product: null };
  }
  if (path.includes('/institutional-supplies')) {
    return { route: 'institutional-supplies' as AppRoute, product: null };
  }

  // Check product URL pattern: /product/:slug or /shop/:slug
  const productMatch = path.match(/\/(?:product|item|p)\/([^/]+)/i);
  if (productMatch && productMatch[1]) {
    const slug = productMatch[1].trim();
    const found = productsList.find(
      (p) => p.slug.toLowerCase() === slug || p.id.toLowerCase() === slug
    );
    if (found) {
      return { route: 'product' as AppRoute, product: found };
    } else {
      // Dynamic fallback for newly added products (like test1 or custom WooCommerce products)
      const formattedTitle = slug
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');

      const dynamicProduct: Product = {
        id: slug,
        name: formattedTitle || 'Product Details',
        slug: slug,
        brand: 'ESSENDAAR BULK',
        category: 'Surface Care',
        price: 99,
        regularPrice: 120,
        rating: 5.0,
        reviewCount: 1,
        packSize: 'Standard Unit',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWsqgCY-jIhZJv6Okv_M4F_bRMGmEwd9HhZ8Pwwv1wIZWBGzCmPegx9mE5ld8MYDnee9JDiR8IZHwpMqCbz1A3A9HilUlvpoHjLwKbOprquqRRgS9DBvehTZpPGbdsXfDWWccSZjIVqKrc4BhVST623U6qF_9-I4sHkseS4RtyjjA-Z19ju2MuIKmIZjfBbRg7LXVZvcy-dqXOapJ7hc5HPQvm4Fda9BIUsYAWmgen30EOiwHLESUK5A',
        gallery: [
          'https://lh3.googleusercontent.com/aida-public/AB6AXuCWsqgCY-jIhZJv6Okv_M4F_bRMGmEwd9HhZ8Pwwv1wIZWBGzCmPegx9mE5ld8MYDnee9JDiR8IZHwpMqCbz1A3A9HilUlvpoHjLwKbOprquqRRgS9DBvehTZpPGbdsXfDWWccSZjIVqKrc4BhVST623U6qF_9-I4sHkseS4RtyjjA-Z19ju2MuIKmIZjfBbRg7LXVZvcy-dqXOapJ7hc5HPQvm4Fda9BIUsYAWmgen30EOiwHLESUK5A'
        ],
        shortDescription: 'Certified hygiene & cleaning product by Essendaar Suppliers.',
        description: `High performance cleaning and hygiene formulation. Packaged and quality tested according to ISO 9001:2015 standards at our Mangadu, Chennai facility.`,
        stockStatus: 'In Stock (Factory Direct)',
        sku: slug.toUpperCase(),
        badge: 'ACTIVE PRODUCT',
        features: [
          'ISO 9001:2015 Quality Tested',
          'Tamilnadu Test House Certified Quality',
          'Direct Dispatch from Mangadu Plant'
        ],
        pH: 'Balanced',
        fragrance: 'Fresh Clean',
        shelfLife: '24 Months',
        labCertified: true
      };

      return { route: 'product' as AppRoute, product: dynamicProduct };
    }
  }

  return { route: 'home' as AppRoute, product: productsList[0] || null };
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products] = useState<Product[]>(initialProducts);

  const initialRouteData = parseRouteFromUrl(products);
  const [currentRoute, _setCurrentRouteState] = useState<AppRoute>(initialRouteData.route);
  const [selectedProduct, _setSelectedProductState] = useState<Product | null>(initialRouteData.product);

  // Sync route changes with browser URL
  const setCurrentRoute = (route: AppRoute, pushHistory = true) => {
    _setCurrentRouteState(route);
    if (pushHistory && typeof window !== 'undefined') {
      let path = '/';
      switch (route) {
        case 'shop':
          path = '/shop';
          break;
        case 'about-us':
          path = '/about-us';
          break;
        case 'contact':
          path = '/contact';
          break;
        case 'checkout':
          path = '/checkout';
          break;
        case 'facility-management':
          path = '/facility-management';
          break;
        case 'manpower-support':
          path = '/manpower-support';
          break;
        case 'institutional-supplies':
          path = '/institutional-supplies';
          break;
        case 'product':
          path = selectedProduct ? `/product/${selectedProduct.slug}` : '/shop';
          break;
        default:
          path = '/';
      }
      if (window.location.pathname !== path) {
        window.history.pushState({ route }, '', path);
      }
    }
  };

  const setSelectedProduct = (product: Product | null, pushHistory = true) => {
    _setSelectedProductState(product);
    if (product) {
      _setCurrentRouteState('product');
      if (pushHistory && typeof window !== 'undefined') {
        const path = `/product/${product.slug}`;
        if (window.location.pathname !== path) {
          window.history.pushState({ route: 'product', slug: product.slug }, '', path);
        }
      }
    }
  };

  // Listen to browser Back / Forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const parsed = parseRouteFromUrl(products);
      _setCurrentRouteState(parsed.route);
      if (parsed.product) {
        _setSelectedProductState(parsed.product);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [products]);

  // Prepopulate initial cart items
  const [cart, setCart] = useState<CartItem[]>(() => {
    const p1 = products.find(p => p.id === 'prod-ms-1l');
    const p2 = products.find(p => p.id === 'prod-bozz-1l');
    const p3 = products.find(p => p.id === 'prod-sf-5l');
    const initialItems: CartItem[] = [];

    if (p1) initialItems.push({ product: p1, quantity: 2 });
    if (p2) initialItems.push({ product: p2, quantity: 1 });
    if (p3) initialItems.push({ product: p3, quantity: 1 });

    return initialItems;
  });

  const [settings, setSettings] = useState<StoreSettings>(initialSettings);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);

  // Pre-applied coupon ESSENDAAR10
  const [couponCode, setCouponCode] = useState<string | null>('ESSENDAAR10');
  const [latestOrder, setLatestOrder] = useState<Order | null>(null);

  const [viewMode, setViewMode] = useState<'desktop' | 'mobile-preview'>('desktop');
  const [showTouchErgonomics, setShowTouchErgonomics] = useState(false);

  const cartTotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const appliedDiscount = couponCode === 'ESSENDAAR10' ? Math.round(cartTotal * 0.1) : 0;

  const addToCart = (product: Product, quantity = 1, variant?: ProductVariant) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity, selectedVariant: variant }];
    });
    setIsCartDrawerOpen(true);
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const openQuickView = (product: Product) => {
    setQuickViewProduct(product);
    setIsQuickViewOpen(true);
  };

  const closeQuickView = () => {
    setIsQuickViewOpen(false);
    setQuickViewProduct(null);
  };

  const applyCoupon = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'ESSENDAAR10') {
      setCouponCode('ESSENDAAR10');
      return { success: true, message: 'Coupon ESSENDAAR10 applied (-10% introductory savings)' };
    }
    if (clean === 'FREESHIP') {
      setCouponCode('FREESHIP');
      return { success: true, message: 'Free Express Shipping unlocked' };
    }
    return { success: false, message: 'Invalid coupon code. Try ESSENDAAR10' };
  };

  const removeCoupon = () => {
    setCouponCode(null);
  };

  const updateSettings = (newSettings: Partial<StoreSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        cart,
        currentRoute,
        selectedProduct,
        settings,
        isCartDrawerOpen,
        isQuickViewOpen,
        quickViewProduct,
        isSearchOpen,
        isCustomizerOpen,
        couponCode,
        appliedDiscount,
        latestOrder,
        viewMode,
        showTouchErgonomics,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        setCurrentRoute,
        setSelectedProduct,
        openQuickView,
        closeQuickView,
        setIsCartDrawerOpen,
        setIsSearchOpen,
        setIsCustomizerOpen,
        applyCoupon,
        removeCoupon,
        updateSettings,
        setLatestOrder,
        setViewMode,
        setShowTouchErgonomics,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
