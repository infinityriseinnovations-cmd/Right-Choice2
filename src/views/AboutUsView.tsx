import React from 'react';
import { useStore } from '../context/StoreContext';
import { 
  ShieldCheck, 
  Factory, 
  MapPin, 
  Award, 
  PhoneCall, 
  Mail, 
  CheckCircle2, 
  ArrowRight,
  FlaskConical
} from 'lucide-react';

export const AboutUsView: React.FC = () => {
  const { setCurrentRoute } = useStore();

  return (
    <div className="w-full bg-[#f8f9ff] min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-xs text-slate-500 mb-6">
          <button onClick={() => setCurrentRoute('home')} className="hover:text-[#00355f] cursor-pointer">Home</button>
          <span>/</span>
          <span className="text-[#00355f] font-bold">About Us</span>
        </div>

        {/* Hero */}
        <div className="bg-[#0A2540] rounded-3xl text-white p-8 sm:p-12 mb-12 relative overflow-hidden shadow-md">
          <div className="max-w-3xl relative z-10">
            <div className="inline-flex items-center space-x-2 bg-[#006e2d] text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
              <Award className="w-4 h-4" />
              <span>ISO 9001:2015 Certified Manufacturer</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black font-headline tracking-tight leading-tight mb-4">
              Pioneering Hygiene Formulations &amp; Campus Facility Care
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
              Based in Mangadu, Chennai, Essendaar Suppliers &amp; Facility Care manufactures industrial-grade and consumer cleaning chemicals while delivering turnkey facility management services across Tamil Nadu.
            </p>
          </div>
        </div>

        {/* Factory & Lab Standards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs">
            <div className="p-3 bg-[#eff4ff] text-[#00355f] rounded-2xl w-fit mb-4">
              <Factory className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-black font-headline text-[#0A2540] mb-3">Our Mangadu Manufacturing Plant</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
              Our automated mixing tanks, quality control titration labs, and semi-automated bottling lines produce 25,000+ liters of high-potency detergents and sanitizers monthly.
            </p>
            <ul className="space-y-2 text-xs text-slate-700 font-semibold">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#006e2d]" />
                <span>Zero-residue active matter formulations</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#006e2d]" />
                <span>Direct batch testing for stable pH and germicidal kill rate</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#006e2d]" />
                <span>Eco-friendly biodegradable surfactants</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs">
            <div className="p-3 bg-emerald-50 text-[#006e2d] rounded-2xl w-fit mb-4">
              <FlaskConical className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-black font-headline text-[#0A2540] mb-3">Certified by Tamilnadu Test House</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
              Every formulation (BOZZ, MORNING SHINE, SKY FRESH, POWER RIDE) is independently tested and verified by Tamilnadu Test House Pvt. Ltd. for chemical safety, heavy-metal absence, and bactericidal efficacy.
            </p>
            <ul className="space-y-2 text-xs text-slate-700 font-semibold">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#006e2d]" />
                <span>ISO 9001:2015 Quality Management Systems</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#006e2d]" />
                <span>NABH &amp; Hospital hygiene compliant chemistry</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#006e2d]" />
                <span>Batch Certificate of Analysis (COA) issued per shipment</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Contact & Map Strip */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <h3 className="text-xl font-black font-headline text-[#0A2540]">Visit Our Facility &amp; Head Office</h3>
            <p className="text-xs text-slate-600 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-500" />
              <span>Mangadu, Chennai, Tamil Nadu - 600122</span>
            </p>
            <p className="text-xs text-slate-600 flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-emerald-600" />
              <span>Direct Hotline: +91 97879 79757</span>
            </p>
          </div>
          <button 
            onClick={() => setCurrentRoute('contact')}
            className="px-6 py-3 bg-[#00355f] hover:bg-[#0A2540] text-white rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-colors"
          >
            Schedule Factory Visit / Meeting
          </button>
        </div>

      </div>
    </div>
  );
};
