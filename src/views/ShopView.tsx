import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';
import { 
  Search, 
  ShoppingCart, 
  Eye, 
  Check, 
  Star, 
  Phone, 
  CheckCircle2, 
  ShieldCheck, 
  FlaskConical, 
  SlidersHorizontal, 
  LayoutGrid, 
  List, 
  ArrowRight,
  FileText,
  BadgePercent,
  X
} from 'lucide-react';

export const ShopView: React.FC = () => {
  const { products, addToCart, openQuickView, setSelectedProduct, setCurrentRoute } = useStore();

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [labTestedOnly, setLabTestedOnly] = useState(true);
  const [maxPrice, setMaxPrice] = useState<number>(2500);
  const [sortBy, setSortBy] = useState<'popularity' | 'rating' | 'price-asc' | 'price-desc'>('popularity');
  const [viewLayout, setViewLayout] = useState<'grid' | 'list'>('grid');
  const [showComboOnly, setShowComboOnly] = useState(false);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedSize('all');
    setLabTestedOnly(false);
    setMaxPrice(2500);
    setShowComboOnly(false);
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setCurrentRoute('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category
        if (selectedCategory !== 'all') {
          if (selectedCategory === 'bozz' && p.brand !== 'BOZZ') return false;
          if (selectedCategory === 'mshine' && p.brand !== 'MORNING SHINE') return false;
          if (selectedCategory === 'skyfresh' && p.brand !== 'SKY FRESH') return false;
          if (selectedCategory === 'pride' && p.brand !== 'POWER RIDE') return false;
          if (selectedCategory === 'bulk' && p.category !== 'Institutional Bulk') return false;
          if (selectedCategory === 'acc' && p.category !== 'Accessories') return false;
        }

        // Pack Size
        if (selectedSize !== 'all') {
          if (selectedSize === '500ml' && !p.packSize.includes('500')) return false;
          if (selectedSize === '1L' && !p.packSize.includes('1 Litre') && !p.packSize.includes('1L')) return false;
          if (selectedSize === '5L' && !p.packSize.includes('5 Litres') && !p.packSize.includes('5L')) return false;
        }

        // Lab tested
        if (labTestedOnly && !p.labCertified) return false;

        // Combo only
        if (showComboOnly && !p.freebie) return false;

        // Price
        if (p.price > maxPrice) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        return b.reviewCount - a.reviewCount; // Popularity
      });
  }, [products, selectedCategory, selectedSize, labTestedOnly, maxPrice, sortBy, showComboOnly]);

  return (
    <div className="w-full bg-[#f8f9ff] min-h-screen pb-16">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6">
        
        {/* Breadcrumb & Meta Status Bar */}
        <nav className="flex flex-wrap items-center justify-between gap-4 py-1 text-xs">
          <div className="flex items-center gap-2 text-slate-500 font-medium">
            <button onClick={() => setCurrentRoute('home')} className="hover:text-[#00355f]">
              Home
            </button>
            <span>/</span>
            <span className="text-[#0A2540] font-bold">Shop</span>
            <span>/</span>
            <span className="text-slate-700">All Cleaning &amp; Hygiene Products</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#eff4ff] text-[#00355f] text-xs font-semibold border border-slate-200">
              <ShieldCheck className="w-3.5 h-3.5 text-[#006e2d]" />
              <span>Direct Manufacturer Stock · Live Warehouse: Chennai</span>
            </span>
          </div>
        </nav>

        {/* Catalog Hero Banner */}
        <section className="relative bg-gradient-to-r from-[#0A2540] via-[#00355f] to-[#004e78] rounded-2xl p-6 sm:p-8 text-white shadow-xl overflow-hidden">
          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="max-w-3xl flex flex-col gap-2.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-extrabold uppercase tracking-wide">
                  Factory Outlet Rates
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-white/15 backdrop-blur-md text-white text-[10px] font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-secondary-fixed" />
                  ISO 9001:2015 Certified
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-white/15 backdrop-blur-md text-white text-[10px] font-bold flex items-center gap-1">
                  <FlaskConical className="w-3 h-3 text-sky-300" />
                  Tamilnadu Test House Tested
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-headline font-bold text-white tracking-tight">
                Essendaar Cleaning Products Catalog
              </h1>
              <p className="text-xs sm:text-sm text-slate-200 max-w-2xl leading-relaxed">
                Direct manufacturer pricing on premium consumer detergents, surface disinfectants, institutional 5L/20L drums, and industrial facility accessories.
              </p>
            </div>

            {/* Quick Stat Badges Strip */}
            <div className="flex sm:flex-row flex-col items-center gap-3 w-full lg:w-auto">
              <div className="flex-1 lg:flex-initial flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-3 rounded-xl border border-white/20 min-w-[160px]">
                <span className="text-2xl">🚚</span>
                <div className="flex flex-col text-left">
                  <span className="text-[10px] uppercase font-bold text-slate-300">Doorstep Logistics</span>
                  <span className="text-sm font-headline font-bold text-white">Chennai Metro</span>
                </div>
              </div>

              <div className="flex-1 lg:flex-initial flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-3 rounded-xl border border-white/20 min-w-[160px]">
                <span className="text-2xl">🧾</span>
                <div className="flex flex-col text-left">
                  <span className="text-[10px] uppercase font-bold text-slate-300">Tax Savings</span>
                  <span className="text-sm font-headline font-bold text-white">100% GST Credit</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main 2-Column Catalog Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2">
          
          {/* Left Sidebar (3 cols) */}
          <aside className="lg:col-span-3 flex flex-col gap-5 w-full">
            
            {/* Filter Container */}
            <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200 flex flex-col gap-5">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#00355f]" />
                  <h2 className="font-headline font-bold text-sm text-[#0A2540]">Filter Catalog</h2>
                </div>
                <button
                  onClick={resetFilters}
                  className="text-slate-500 hover:text-rose-600 text-xs font-semibold underline transition-colors cursor-pointer"
                >
                  Clear All
                </button>
              </div>

              {/* Lab Certification Guarantee Pill */}
              <div className="p-3 rounded-xl bg-[#F0FDF4] border border-emerald-200 flex flex-col gap-1.5">
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={labTestedOnly}
                    onChange={(e) => setLabTestedOnly(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded text-[#006e2d] focus:ring-[#006e2d] accent-[#006e2d] cursor-pointer"
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-[#14532D] flex items-center gap-1">
                      <span>Tamilnadu Test House Tested</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#006e2d]" />
                    </span>
                    <span className="text-[11px] text-slate-600 leading-tight">
                      Show lab-certified safe, skin-friendly, bio-tested batches.
                    </span>
                  </div>
                </label>
              </div>

              {/* Categories Tree */}
              <div className="flex flex-col gap-2.5">
                <span className="text-xs font-bold text-[#0A2540] uppercase tracking-wider font-headline">
                  Product Categories
                </span>
                
                <ul className="space-y-1 text-xs font-medium">
                  {[
                    { id: 'all', label: 'All Products', count: products.length },
                    { id: 'bozz', label: 'BOZZ Laundry Care', count: products.filter(p => p.brand === 'BOZZ').length },
                    { id: 'mshine', label: 'MORNING SHINE Kitchen Care', count: products.filter(p => p.brand === 'MORNING SHINE').length },
                    { id: 'skyfresh', label: 'SKY FRESH Surface & Vehicle', count: products.filter(p => p.brand === 'SKY FRESH').length },
                    { id: 'pride', label: 'POWER RIDE Toilet Care', count: products.filter(p => p.brand === 'POWER RIDE').length },
                    { id: 'bulk', label: 'Institutional & Bulk Hygiene', count: products.filter(p => p.category === 'Institutional Bulk').length },
                    { id: 'acc', label: 'Housekeeping Accessories', count: products.filter(p => p.category === 'Accessories').length },
                  ].map((cat) => (
                    <li key={cat.id}>
                      <button
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`w-full flex items-center justify-between p-2 rounded-lg transition-colors cursor-pointer text-left ${
                          selectedCategory === cat.id
                            ? 'bg-[#eff4ff] font-bold text-[#00355f] border border-blue-200'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full ${selectedCategory === cat.id ? 'bg-[#00355f]' : 'bg-slate-300'}`} />
                          <span>{cat.label}</span>
                        </span>
                        <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                          {cat.count}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Volume / Pack Size Chips */}
              <div className="flex flex-col gap-2.5">
                <span className="text-xs font-bold text-[#0A2540] uppercase tracking-wider font-headline">
                  Volume / Pack Size
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                  {[
                    { id: 'all', label: 'All Sizes' },
                    { id: '500ml', label: '500 ml' },
                    { id: '1L', label: '1 Litre' },
                    { id: '5L', label: '5 Litres' },
                  ].map((size) => (
                    <button
                      key={size.id}
                      onClick={() => setSelectedSize(size.id)}
                      className={`px-3 py-2 rounded-lg text-left transition-colors cursor-pointer flex items-center justify-between ${
                        selectedSize === size.id
                          ? 'bg-[#00355f] text-white shadow-xs font-bold'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      <span>{size.label}</span>
                      {selectedSize === size.id && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Special Offers Filter */}
              <div className="flex flex-col gap-2 text-xs">
                <span className="font-bold text-[#0A2540] uppercase tracking-wider font-headline">
                  Special Offers
                </span>
                <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showComboOnly}
                    onChange={(e) => setShowComboOnly(e.target.checked)}
                    className="rounded text-[#006e2d] focus:ring-[#006e2d] accent-[#006e2d]"
                  />
                  <span>Free Scrub &amp; Sponge Bundles Only</span>
                </label>
              </div>

              {/* Price Range Slider */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#0A2540] uppercase tracking-wider font-headline">
                    Max Price
                  </span>
                  <span className="font-bold text-[#00355f] font-mono">
                    Up to ₹{maxPrice}
                  </span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="2500"
                  step="50"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#00355f]"
                />
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>₹50</span>
                  <span>₹2,500</span>
                </div>
              </div>

              {/* Hotline Callout Box */}
              <div className="bg-[#EBF3FA] p-3.5 rounded-xl border border-sky-200 text-xs space-y-1">
                <span className="font-bold text-[#00355f] block">Need 50L Direct Barrels?</span>
                <p className="text-slate-600 text-[11px]">
                  Call our factory dispatch desk directly for customized institutional rate sheets.
                </p>
                <a
                  href="tel:+919787979757"
                  className="font-bold text-[#00355f] hover:underline flex items-center gap-1 pt-1"
                >
                  <Phone className="w-3.5 h-3.5 text-[#006e2d]" />
                  <span>+91 97879 79757</span>
                </a>
              </div>

            </div>

            {/* Quality Certifications Card */}
            <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200 flex flex-col gap-3">
              <span className="text-xs font-bold text-[#0A2540] uppercase tracking-wider font-headline">
                Quality Certifications
              </span>
              <div className="flex flex-col gap-2 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#006e2d]" />
                  <span>ISO 9001:2015 Registered Facility</span>
                </div>
                <div className="flex items-center gap-2">
                  <FlaskConical className="w-4 h-4 text-[#00355f]" />
                  <span>Chemical Bio-Degradable Assured</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600" />
                  <span>Tamilnadu Test House Tested</span>
                </div>
              </div>
            </div>

          </aside>

          {/* Right Main Catalog (9 cols) */}
          <main className="lg:col-span-9 flex flex-col gap-6">
            
            {/* Top Filter Bar */}
            <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-2 text-slate-600">
                <span>Showing</span>
                <strong className="text-[#0A2540]">{filteredProducts.length}</strong>
                <span>hygiene products</span>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 hidden sm:inline">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-[#eff4ff] text-slate-800 font-semibold py-1.5 px-3 rounded-lg border border-slate-200 focus:outline-none cursor-pointer"
                  >
                    <option value="popularity">Sort by popularity</option>
                    <option value="rating">Sort by average rating</option>
                    <option value="price-asc">Sort by price: low to high</option>
                    <option value="price-desc">Sort by price: high to low</option>
                  </select>
                </div>

                {/* Grid / List toggle */}
                <div className="flex items-center bg-slate-100 p-1 rounded-lg">
                  <button
                    onClick={() => setViewLayout('grid')}
                    className={`p-1 rounded ${viewLayout === 'grid' ? 'bg-white text-[#00355f] shadow-xs' : 'text-slate-500'}`}
                    title="Grid View"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewLayout('list')}
                    className={`p-1 rounded ${viewLayout === 'list' ? 'bg-white text-[#00355f] shadow-xs' : 'text-slate-500'}`}
                    title="List View"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Product Grid */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl text-center border border-slate-200 space-y-3">
                <p className="text-sm font-semibold text-slate-700">No products match your selected filters.</p>
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 bg-[#00355f] text-white text-xs font-bold rounded-lg cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className={
                viewLayout === 'grid' 
                  ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                  : "grid grid-cols-1 gap-4"
              }>
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className={`bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-lg transition-all border border-slate-200 flex ${
                      viewLayout === 'grid' ? 'flex-col justify-between' : 'flex-col sm:flex-row'
                    }`}
                  >
                    {/* Image Area */}
                    <div className={`relative bg-[#eff4ff] flex items-center justify-center p-4 ${
                      viewLayout === 'grid' ? 'w-full' : 'sm:w-64 shrink-0'
                    }`}>
                      {product.badge && (
                        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
                          <span className="px-2.5 py-0.5 rounded bg-amber-400 text-slate-950 text-[10px] font-extrabold uppercase shadow-xs">
                            {product.badge}
                          </span>
                          {product.freebie && (
                            <span className="px-2 py-0.5 rounded bg-[#006e2d] text-white text-[9px] font-bold">
                              {product.freebie}
                            </span>
                          )}
                        </div>
                      )}

                      <div 
                        onClick={() => handleProductClick(product)}
                        className="w-full h-48 sm:h-52 flex items-center justify-center cursor-pointer overflow-hidden"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-44 w-auto object-contain hover:scale-105 transition-transform duration-300"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    </div>

                    {/* Content Area */}
                    <div className="p-5 flex flex-col flex-1 justify-between gap-3">
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-[10px] font-extrabold text-[#00355f] uppercase tracking-wide">
                            {product.brand}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[10px] font-semibold text-slate-500">
                            {product.packSize}
                          </span>
                        </div>

                        <h3 
                          onClick={() => handleProductClick(product)}
                          className="font-headline font-bold text-sm text-[#0A2540] line-clamp-2 leading-snug hover:text-[#00355f] transition-colors cursor-pointer"
                        >
                          {product.name}
                        </h3>

                        {/* Rating */}
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <div className="flex text-amber-400">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                          <span className="text-[11px] text-slate-500 font-semibold">
                            {product.rating} ({product.reviewCount})
                          </span>
                        </div>
                      </div>

                      {/* Price & Actions */}
                      <div className="pt-2 border-t border-slate-100 space-y-2.5">
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl font-headline font-bold text-[#00355f]">
                            ₹{product.price}
                          </span>
                          <span className="text-xs text-slate-400 line-through">
                            ₹{product.regularPrice}
                          </span>
                          <span className="text-[11px] font-bold text-[#006e2d]">
                            Save {Math.round(((product.regularPrice - product.price) / product.regularPrice) * 100)}%
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => addToCart(product, 1)}
                            className="w-full py-2.5 px-3 rounded-lg bg-[#006e2d] hover:bg-[#14532D] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                          >
                            <ShoppingCart className="w-3.5 h-3.5" />
                            <span>Add to Cart</span>
                          </button>

                          <button
                            onClick={() => setCurrentRoute('contact')}
                            className="w-full py-2.5 px-2 rounded-lg bg-[#eff4ff] hover:bg-[#dce9ff] text-[#00355f] text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer border border-blue-200"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>B2B Quote</span>
                          </button>
                        </div>
                      </div>

                    </div>

                  </div>
                ))}
              </div>
            )}

            {/* Bottom B2B Institutional Wholesale Strip */}
            <section className="mt-4 bg-gradient-to-br from-[#0A2540] via-[#00355f] to-[#004e78] rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-8 flex flex-col gap-2.5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-slate-950 w-fit text-[10px] font-bold uppercase font-headline">
                    Institutional B2B Contract Desk
                  </span>
                  <h3 className="text-xl sm:text-2xl font-headline font-bold text-white">
                    Need bulk institutional supply for your school, college, or hotel?
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                    Get custom tiered wholesale pricing with 100% compliant GST input tax invoices, free chemical samples, dedicated account managers, and scheduled doorstep delivery across Tamil Nadu.
                  </p>
                </div>

                <div className="lg:col-span-4 flex flex-col gap-2.5">
                  <button
                    onClick={() => setCurrentRoute('contact')}
                    className="w-full py-3 px-4 rounded-lg bg-[#006e2d] hover:bg-[#14532D] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                  >
                    <span>Request Custom Rate Card</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <a
                    href="tel:+919787979757"
                    className="w-full py-2.5 px-4 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-amber-400" />
                    <span>Call Dispatch: +91 97879 79757</span>
                  </a>
                </div>
              </div>
            </section>

          </main>

        </div>

      </div>

    </div>
  );
};
