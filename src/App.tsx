import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { WpAdminBar } from './components/WpAdminBar';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { QuickViewModal } from './components/QuickViewModal';
import { SearchModal } from './components/SearchModal';
import { ElementorCustomizer } from './components/ElementorCustomizer';
import { HomeView } from './views/HomeView';
import { ShopView } from './views/ShopView';
import { ProductView } from './views/ProductView';
import { ContactView } from './views/ContactView';
import { CheckoutView } from './views/CheckoutView';
import { OrderConfirmationView } from './views/OrderConfirmationView';
import { 
  Smartphone, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  Layers, 
  HelpCircle,
  Wifi,
  Battery,
  Signal
} from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentRoute, viewMode, showTouchErgonomics, settings } = useStore();

  const renderActiveView = () => {
    switch (currentRoute) {
      case 'home':
        return <HomeView />;
      case 'shop':
        return <ShopView />;
      case 'product':
        return <ProductView />;
      case 'contact':
        return <ContactView />;
      case 'checkout':
        return <CheckoutView />;
      case 'order-confirmation':
        return <OrderConfirmationView />;
      default:
        return <HomeView />;
    }
  };

  // Normal Desktop / Fluid View
  if (viewMode === 'desktop') {
    return (
      <div className="min-h-screen flex flex-col bg-white text-stone-900 font-sans selection:bg-stone-900 selection:text-white">
        <WpAdminBar />
        <Header />
        <main className="flex-1">
          {renderActiveView()}
        </main>
        <Footer />

        {/* Global Overlays */}
        <CartDrawer />
        <QuickViewModal />
        <SearchModal />
        <ElementorCustomizer />
      </div>
    );
  }

  // Mobile Device Conversion Preview Mode (Framed iPhone 16 Pro)
  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans">
      <WpAdminBar />

      {/* Mobile Optimization Insights Bar */}
      <div className="bg-stone-900/90 border-b border-stone-800 py-2.5 px-4 text-xs">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2 text-emerald-400 font-medium">
            <Zap className="w-4 h-4" />
            <span>Mobile Conversion Test Viewport (iPhone 16 Pro Frame)</span>
          </div>

          <div className="flex items-center space-x-4 text-[11px] text-stone-400 font-mono">
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              <span>Express Pay Enabled</span>
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">Sticky Bottom CTA Active</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">Min 48px Tap Targets</span>
          </div>
        </div>
      </div>

      {/* Centered Device Canvas */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 overflow-y-auto">
        <div className="relative">
          
          {/* Simulated iPhone Device Frame */}
          <div className="w-[390px] h-[844px] bg-black rounded-[54px] p-3.5 shadow-2xl ring-12 ring-stone-800/80 border-4 border-stone-700/60 relative overflow-hidden flex flex-col">
            
            {/* Dynamic Island Notch */}
            <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-full z-50 flex items-center justify-between px-2.5 pointer-events-none border border-stone-800/40">
              <div className="w-2.5 h-2.5 rounded-full bg-stone-900/90" />
              <div className="w-3 h-3 rounded-full bg-stone-900/90 border border-blue-950/30" />
            </div>

            {/* iOS Status Bar */}
            <div className="h-10 bg-white text-stone-900 px-7 flex items-center justify-between text-[13px] font-semibold shrink-0 z-40 select-none rounded-t-[40px]">
              <span>9:41</span>
              <div className="flex items-center space-x-1.5 text-stone-800">
                <Signal className="w-3.5 h-3.5" />
                <Wifi className="w-3.5 h-3.5" />
                <Battery className="w-4 h-4" />
              </div>
            </div>

            {/* Scrollable Viewport Inner Screen */}
            <div className="flex-1 bg-white text-stone-900 overflow-y-auto relative rounded-b-[40px] scrollbar-none">
              <Header />
              <div className="min-h-full">
                {renderActiveView()}
              </div>
              <Footer />

              {/* Thumb Ergonomics Overlay */}
              {showTouchErgonomics && (
                <div className="pointer-events-none absolute inset-0 z-50 flex flex-col justify-end bg-gradient-to-t from-emerald-500/20 via-amber-500/10 to-transparent">
                  <div className="bg-emerald-600/85 text-white text-[11px] p-2 text-center font-bold tracking-wide backdrop-blur-xs">
                    Natural 1-Hand Thumb Reach Zone (Sticky CTAs & Primary Actions)
                  </div>
                </div>
              )}
            </div>

            {/* iOS Bottom Home Indicator Bar */}
            <div className="h-5 bg-white flex items-center justify-center shrink-0 rounded-b-[40px] -mt-1 z-40 pointer-events-none">
              <div className="w-32 h-1 bg-stone-800 rounded-full" />
            </div>

          </div>

        </div>
      </div>

      {/* Global Modals & Drawers */}
      <CartDrawer />
      <QuickViewModal />
      <SearchModal />
      <ElementorCustomizer />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
