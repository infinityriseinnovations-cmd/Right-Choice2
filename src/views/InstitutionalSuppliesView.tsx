import React from 'react';
import { useStore } from '../context/StoreContext';
import { 
  PackageCheck, 
  Truck, 
  FileSpreadsheet, 
  ShieldAlert, 
  Layers, 
  ArrowRight,
  Download,
  PhoneCall
} from 'lucide-react';

export const InstitutionalSuppliesView: React.FC = () => {
  const { setCurrentRoute, products, addToCart } = useStore();

  const bulkPacks = products.filter(p => p.category === 'Institutional Bulk' || p.packSize.includes('5L') || p.packSize.includes('50L'));

  return (
    <div className="w-full bg-[#f8f9ff] min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-xs text-slate-500 mb-6">
          <button onClick={() => setCurrentRoute('home')} className="hover:text-[#00355f] cursor-pointer">Home</button>
          <span>/</span>
          <span className="text-[#00355f] font-bold">Institutional Supplies</span>
        </div>

        {/* Hero Section */}
        <div className="bg-[#0A2540] rounded-3xl text-white p-8 sm:p-12 mb-12 relative overflow-hidden shadow-md">
          <div className="max-w-3xl relative z-10">
            <div className="inline-flex items-center space-x-2 bg-[#006e2d] text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
              <PackageCheck className="w-4 h-4" />
              <span>Direct Factory Drums (5L, 25L, 50L Carboys)</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black font-headline tracking-tight leading-tight mb-4">
              Institutional Bulk Chemicals &amp; Facility Supplies
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8">
              High-concentration cleaning formulations, mechanised chemicals, tissue dispensers, mops, and hygiene accessories delivered directly to schools, hospitals, and factories across Tamil Nadu.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => setCurrentRoute('contact')}
                className="px-6 py-3 bg-[#006e2d] hover:bg-[#14532D] text-white rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-md cursor-pointer"
              >
                <span>Request B2B Wholesale Rate Card</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setCurrentRoute('shop')}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-sm flex items-center gap-2 border border-white/20 transition-all cursor-pointer"
              >
                <span>Browse All 5L &amp; 50L Packs</span>
              </button>
            </div>
          </div>
        </div>

        {/* Featured Bulk Products */}
        <div className="mb-16">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-2xl font-black font-headline text-[#0A2540]">Factory Bulk Drum Formulations</h2>
              <p className="text-xs sm:text-sm text-slate-600">Manufactured in Mangadu, Chennai to Tamilnadu Test House norms</p>
            </div>
            <button 
              onClick={() => setCurrentRoute('shop')}
              className="text-xs font-bold text-[#00355f] hover:underline hidden sm:block cursor-pointer"
            >
              View Full Catalog &rarr;
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bulkPacks.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col">
                <div className="h-48 bg-slate-100 relative">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  <span className="absolute top-3 left-3 bg-[#0A2540] text-white text-[10px] font-bold px-2 py-1 rounded">
                    {item.packSize}
                  </span>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-[#006e2d] uppercase tracking-wider">{item.brand}</span>
                    <h3 className="text-base font-bold font-headline text-slate-900 mt-1">{item.name}</h3>
                    <p className="text-xs text-slate-600 mt-2 line-clamp-2">{item.shortDescription}</p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-500 block">Factory Price</span>
                      <span className="text-lg font-black text-[#00355f]">₹{item.price}</span>
                    </div>
                    <button 
                      onClick={() => addToCart(item, 1)}
                      className="px-4 py-2 bg-[#00355f] hover:bg-[#0A2540] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* GST & Invoicing */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-2xl">
            <span className="text-[11px] font-bold text-[#006e2d] uppercase tracking-wider">B2B Tax Credit</span>
            <h3 className="text-xl font-black font-headline text-[#0A2540] mt-1">18% GST Input Credit Tax Invoices</h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              All institutional orders are billed directly under Essendaar Suppliers with official 18% GST e-way bills and certificate of analysis (COA) test sheets for your audits.
            </p>
          </div>
          <button 
            onClick={() => setCurrentRoute('contact')}
            className="px-6 py-3 bg-[#0A2540] text-white rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer hover:bg-slate-800"
          >
            Submit Corporate GST Order
          </button>
        </div>

      </div>
    </div>
  );
};
