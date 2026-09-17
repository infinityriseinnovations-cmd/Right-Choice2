import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, AppRoute, StoreSettings, Order, ProductVariant } from '../types';
import { products } from '../data/products';

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
  setCurrentRoute: (route: AppRoute) => void;
  setSelectedProduct: (product: Product | null) => void;
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

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Prepopulate initial cart as shown in the user's checkout HTML
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

  const [currentRoute, setCurrentRoute] = useState<AppRoute>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(() => products[0]);
  const [settings, setSettings] = useState<StoreSettings>(initialSettings);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);

  // Pre-applied coupon ESSENDAAR10 from the HTML
  const [couponCode, setCouponCode] = useState<string | null>('ESSENDAAR10');
  const [latestOrder, setLatestOrder] = useState<Order | null>(null);

  // Viewport mode: Desktop or Mobile Device Preview Frame
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile-preview'>('desktop');
  const [showTouchErgonomics, setShowTouchErgonomics] = useState(false);

  const cartTotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Calculate discount (10% if ESSENDAAR10 applied)
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
