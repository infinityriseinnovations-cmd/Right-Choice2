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
  isLoadingLiveProduct: boolean;

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
  refreshWooCommerceProducts: () => Promise<void>;
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

// Convert raw WooCommerce REST API Product object to our Product interface
const mapWcProductToAppProduct = (wcProduct: any): Product => {
  // WooCommerce Store API returns prices in minor currency units (paisa) or string
  let price = 0;
  let regularPrice = 0;

  if (wcProduct.prices) {
    const rawPrice = wcProduct.prices.price || wcProduct.prices.regular_price || '0';
    const rawReg = wcProduct.prices.regular_price || rawPrice;
    const decimals = wcProduct.prices.currency_minor_unit ?? 2;
    price = parseFloat(rawPrice) / Math.pow(10, decimals);
    regularPrice = parseFloat(rawReg) / Math.pow(10, decimals);
  } else if (wcProduct.price !== undefined) {
    price = parseFloat(wcProduct.price) || 0;
    regularPrice = parseFloat(wcProduct.regular_price || wcProduct.price) || price;
  }

  if (regularPrice < price || regularPrice === 0) {
    regularPrice = price;
  }

  // Extract images from media library
  const imageList: string[] = [];
  if (Array.isArray(wcProduct.images)) {
    wcProduct.images.forEach((img: any) => {
      if (img.src) imageList.push(img.src);
      else if (img.url) imageList.push(img.url);
    });
  } else if (wcProduct._embedded?.['wp:featuredmedia']?.[0]?.source_url) {
    imageList.push(wcProduct._embedded['wp:featuredmedia'][0].source_url);
  }

  const primaryImage = imageList[0] || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWsqgCY-jIhZJv6Okv_M4F_bRMGmEwd9HhZ8Pwwv1wIZWBGzCmPegx9mE5ld8MYDnee9JDiR8IZHwpMqCbz1A3A9HilUlvpoHjLwKbOprquqRRgS9DBvehTZpPGbdsXfDWWccSZjIVqKrc4BhVST623U6qF_9-I4sHkseS4RtyjjA-Z19ju2MuIKmIZjfBbRg7LXVZvcy-dqXOapJ7hc5HPQvm4Fda9BIUsYAWmgen30EOiwHLESUK5A';

  // Category mapping
  let categoryName = 'Surface Care';
  if (Array.isArray(wcProduct.categories) && wcProduct.categories.length > 0) {
    categoryName = wcProduct.categories[0].name || categoryName;
  }

  // Parse HTML strings safely
  const cleanHtml = (htmlStr: string = '') => {
    if (!htmlStr) return '';
    return htmlStr.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  };

  const shortDesc = cleanHtml(wcProduct.short_description || wcProduct.excerpt?.rendered || '');
  const longDesc = cleanHtml(wcProduct.description || wcProduct.content?.rendered || '') || shortDesc || 'High performance formulation by Essendaar Suppliers.';

  const brandName = wcProduct.attributes?.find((a: any) => a.name?.toLowerCase().includes('brand'))?.terms?.[0]?.name ||
                    (wcProduct.categories?.[0]?.name?.toUpperCase().includes('BOZZ') ? 'BOZZ' : 
                     wcProduct.categories?.[0]?.name?.toUpperCase().includes('MORNING') ? 'MORNING SHINE' :
                     wcProduct.categories?.[0]?.name?.toUpperCase().includes('SKY') ? 'SKY FRESH' :
                     wcProduct.categories?.[0]?.name?.toUpperCase().includes('POWER') ? 'POWER RIDE' : 'ESSENDAAR BULK');

  const slug = wcProduct.slug || `prod-${wcProduct.id}`;

  // Extract attributes (Weight, Length, Size, Pack Size, etc.)
  const rawAttributes: any[] = Array.isArray(wcProduct.attributes) ? wcProduct.attributes : [];
  const parsedAttributes = rawAttributes.map((attr: any) => {
    const attrName = attr.name || '';
    let options: string[] = [];
    if (Array.isArray(attr.terms)) {
      options = attr.terms.map((t: any) => t.name || t.slug || String(t));
    } else if (Array.isArray(attr.options)) {
      options = attr.options.map(String);
    }
    return { name: attrName, options };
  });

  // Extract Weight & Dimensions
  let weightStr = wcProduct.weight ? `${wcProduct.weight} kg` : undefined;
  let dimensionsStr = undefined;
  if (wcProduct.dimensions) {
    const { length, width, height } = wcProduct.dimensions;
    if (length || width || height) {
      dimensionsStr = `${length || '0'} x ${width || '0'} x ${height || '0'} cm`;
    }
  }

  // Extract default pack size or attribute label
  const primaryAttr = rawAttributes.find((a: any) => {
    const n = (a.name || '').toLowerCase();
    return n.includes('pack') || n.includes('size') || n.includes('weight') || n.includes('length') || n.includes('volume');
  });

  const packSizeVal = primaryAttr?.terms?.[0]?.name || primaryAttr?.options?.[0] || weightStr || 'Standard Unit';

  // Parse variations if attached or construct from multi-option attributes
  let variants: ProductVariant[] | undefined = undefined;

  if (Array.isArray(wcProduct.variation_data) && wcProduct.variation_data.length > 0) {
    variants = wcProduct.variation_data.map((v: any) => ({
      id: String(v.id || ''),
      size: v.attribute_summary || v.name || 'Option',
      price: parseFloat(v.price || v.sale_price || price),
      regularPrice: parseFloat(v.regular_price || price),
      mrp: parseFloat(v.regular_price || price),
      sku: v.sku || wcProduct.sku || slug.toUpperCase(),
      weight: v.weight ? `${v.weight} kg` : undefined,
      dimensions: v.dimensions ? `${v.dimensions.length}x${v.dimensions.width}x${v.dimensions.height} cm` : undefined,
      inStock: v.is_in_stock !== false
    }));
  } else if (primaryAttr && primaryAttr.options && primaryAttr.options.length > 1) {
    // If multiple options exist in attributes
    variants = primaryAttr.options.map((opt: string, idx: number) => ({
      size: opt,
      price: price,
      regularPrice: regularPrice,
      mrp: regularPrice,
      sku: `${(wcProduct.sku || slug).toUpperCase()}-${idx + 1}`,
      inStock: true
    }));
  }

  // Extract custom meta fields for Directions & Dilution, Safety Data & Ingredients
  const getCustomMeta = (keys: string[]): string | undefined => {
    // 1. Check meta_data array
    if (Array.isArray(wcProduct.meta_data)) {
      for (const k of keys) {
        const item = wcProduct.meta_data.find((m: any) => m.key === k || m.key === `_${k}`);
        if (item && item.value) {
          const val = typeof item.value === 'string' ? item.value : JSON.stringify(item.value);
          if (val.trim()) return val.trim();
        }
      }
    }
    // 2. Check meta object or root properties
    for (const k of keys) {
      if (wcProduct[k] && typeof wcProduct[k] === 'string' && wcProduct[k].trim()) return wcProduct[k].trim();
      if (wcProduct[`_${k}`] && typeof wcProduct[`_${k}`] === 'string' && wcProduct[`_${k}`].trim()) return wcProduct[`_${k}`].trim();
      if (wcProduct.meta && typeof wcProduct.meta === 'object') {
        if (wcProduct.meta[k] && typeof wcProduct.meta[k] === 'string' && wcProduct.meta[k].trim()) return wcProduct.meta[k].trim();
        if (wcProduct.meta[`_${k}`] && typeof wcProduct.meta[`_${k}`] === 'string' && wcProduct.meta[`_${k}`].trim()) return wcProduct.meta[`_${k}`].trim();
      }
    }
    return undefined;
  };

  const howToUseVal = getCustomMeta(['directions_and_dilution', 'directions_dilution', 'how_to_use', 'usage_instructions', 'usage', 'dilution']);
  const safetyDataVal = getCustomMeta(['safety_data_ingredients', 'safety_data', 'ingredients', 'safety', 'material_safety']);

  return {
    id: String(wcProduct.id || slug),
    name: wcProduct.name || wcProduct.title?.rendered || slug,
    slug: slug,
    brand: brandName as any,
    category: categoryName as any,
    price: price || 99,
    regularPrice: regularPrice || price || 120,
    rating: parseFloat(wcProduct.average_rating) || 5.0,
    reviewCount: parseInt(wcProduct.review_count) || 1,
    packSize: packSizeVal,
    weight: weightStr,
    dimensions: dimensionsStr,
    image: primaryImage,
    gallery: imageList.length > 0 ? imageList : [primaryImage],
    shortDescription: shortDesc || 'Certified hygiene & cleaning formulation by Essendaar Suppliers.',
    description: longDesc,
    howToUse: howToUseVal,
    safetyData: safetyDataVal,
    stockStatus: wcProduct.is_in_stock !== false ? 'In Stock (Chennai Warehouse)' : 'Out of Stock',
    sku: wcProduct.sku || slug.toUpperCase(),
    badge: wcProduct.on_sale ? 'ON SALE' : 'VERIFIED PRODUCT',
    features: [
      'ISO 9001:2015 Quality Tested',
      'Tamilnadu Test House Certified Quality',
      'Direct Dispatch from Mangadu Plant'
    ],
    pH: 'Balanced',
    fragrance: 'Fresh Clean',
    shelfLife: '24 Months',
    attributes: parsedAttributes.length > 0 ? parsedAttributes : undefined,
    variants: variants,
    labCertified: true
  };
};

// Helper to resolve route and product from URL pathname
const parseRouteFromUrl = (productsList: Product[]) => {
  if (typeof window === 'undefined') {
    return { route: 'home' as AppRoute, product: productsList[0] || null, slug: null };
  }

  const path = window.location.pathname.toLowerCase().replace(/\/+$/, '') || '/';

  if (path === '' || path === '/') {
    return { route: 'home' as AppRoute, product: productsList[0] || null, slug: null };
  }
  if (path.includes('/shop')) {
    return { route: 'shop' as AppRoute, product: null, slug: null };
  }
  if (path.includes('/checkout')) {
    return { route: 'checkout' as AppRoute, product: null, slug: null };
  }
  if (path.includes('/contact')) {
    return { route: 'contact' as AppRoute, product: null, slug: null };
  }
  if (path.includes('/about')) {
    return { route: 'about-us' as AppRoute, product: null, slug: null };
  }
  if (path.includes('/facility-management')) {
    return { route: 'facility-management' as AppRoute, product: null, slug: null };
  }
  if (path.includes('/manpower-support')) {
    return { route: 'manpower-support' as AppRoute, product: null, slug: null };
  }
  if (path.includes('/institutional-supplies')) {
    return { route: 'institutional-supplies' as AppRoute, product: null, slug: null };
  }

  // Check product URL pattern: /product/:slug or /shop/:slug
  const productMatch = path.match(/\/(?:product|item|p)\/([^/]+)/i);
  if (productMatch && productMatch[1]) {
    const slug = productMatch[1].trim();
    const found = productsList.find(
      (p) => p.slug.toLowerCase() === slug || p.id.toLowerCase() === slug
    );
    if (found) {
      return { route: 'product' as AppRoute, product: found, slug };
    } else {
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
        stockStatus: 'In Stock (Chennai Warehouse)',
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

      return { route: 'product' as AppRoute, product: dynamicProduct, slug };
    }
  }

  return { route: 'home' as AppRoute, product: productsList[0] || null, slug: null };
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isLoadingLiveProduct, setIsLoadingLiveProduct] = useState<boolean>(false);

  const initialRouteData = parseRouteFromUrl(initialProducts);
  const [currentRoute, _setCurrentRouteState] = useState<AppRoute>(initialRouteData.route);
  const [selectedProduct, _setSelectedProductState] = useState<Product | null>(initialRouteData.product);

  // Live WooCommerce REST API Fetcher for single product
  const fetchLiveWooProduct = async (slug: string) => {
    if (!slug) return;
    setIsLoadingLiveProduct(true);

    const endpoints = [
      `/wp-json/wc/store/v1/products?slug=${encodeURIComponent(slug)}`,
      `https://rightchoiceindia.com/wp-json/wc/store/v1/products?slug=${encodeURIComponent(slug)}`,
      `/wp-json/wp/v2/product?slug=${encodeURIComponent(slug)}&_embed`,
      `https://rightchoiceindia.com/wp-json/wp/v2/product?slug=${encodeURIComponent(slug)}&_embed`
    ];

    for (const url of endpoints) {
      try {
        const response = await fetch(url, { headers: { Accept: 'application/json' } });
        if (response.ok) {
          const data = await response.json();
          const items = Array.isArray(data) ? data : [data];
          if (items.length > 0 && items[0]) {
            const mapped = mapWcProductToAppProduct(items[0]);
            _setSelectedProductState(mapped);
            // Merge into product list
            setProducts((prev) => {
              const exists = prev.some((p) => p.slug.toLowerCase() === slug.toLowerCase() || p.id === mapped.id);
              if (exists) {
                return prev.map((p) => (p.slug.toLowerCase() === slug.toLowerCase() || p.id === mapped.id ? mapped : p));
              }
              return [mapped, ...prev];
            });
            setIsLoadingLiveProduct(false);
            return;
          }
        }
      } catch {
        // Continue to fallback endpoints
      }
    }
    setIsLoadingLiveProduct(false);
  };

  // Live WooCommerce catalog fetcher
  const refreshWooCommerceProducts = async () => {
    const endpoints = [
      `/wp-json/wc/store/v1/products?per_page=100`,
      `https://rightchoiceindia.com/wp-json/wc/store/v1/products?per_page=100`
    ];

    for (const url of endpoints) {
      try {
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            const mappedList = data.map(mapWcProductToAppProduct);
            // Merge unique products
            setProducts((prev) => {
              const map = new Map<string, Product>();
              prev.forEach((p) => map.set(p.slug.toLowerCase(), p));
              mappedList.forEach((p) => map.set(p.slug.toLowerCase(), p));
              return Array.from(map.values());
            });
            return;
          }
        }
      } catch {
        // Ignore fallback
      }
    }
  };

  // Initial load effect
  useEffect(() => {
    refreshWooCommerceProducts();
    const parsed = parseRouteFromUrl(products);
    if (parsed.slug) {
      fetchLiveWooProduct(parsed.slug);
    }
  }, []);

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
      if (product.slug) {
        fetchLiveWooProduct(product.slug);
      }
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
        if (parsed.slug) {
          fetchLiveWooProduct(parsed.slug);
        }
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
        isLoadingLiveProduct,
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
        refreshWooCommerceProducts,
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
