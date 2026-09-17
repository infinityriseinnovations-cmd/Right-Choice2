export interface ProductVariant {
  id?: string;
  title?: string;
  size: string;
  price: number;
  mrp?: number;
  regularPrice?: number;
  sku?: string;
  gift?: string;
  note?: string;
  inStock?: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: 'BOZZ' | 'MORNING SHINE' | 'SKY FRESH' | 'POWER RIDE' | 'ESSENDAAR BULK' | 'ACCESSORIES';
  category: 'Kitchen Care' | 'Laundry Care' | 'Surface Care' | 'Sanitation' | 'Vehicle Care' | 'Institutional Bulk' | 'Accessories';
  price: number;
  regularPrice: number;
  packSize: string;
  rating: number;
  reviewCount: number;
  image: string;
  gallery: string[];
  shortDescription: string;
  description: string;
  stockStatus: 'In Stock (Factory Direct)' | 'In Stock' | 'High Stock in Warehouse';
  sku: string;
  badge?: string;
  freebie?: string;
  features: string[];
  dilution?: string;
  pH?: string;
  fragrance?: string;
  shelfLife?: string;
  howToUse?: string;
  variants?: ProductVariant[];
  labCertified?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: ProductVariant;
}

export type AppRoute = 
  | 'home' 
  | 'shop' 
  | 'product' 
  | 'contact' 
  | 'checkout' 
  | 'order-confirmation'
  | 'facility-management'
  | 'manpower-support'
  | 'institutional-supplies'
  | 'about-us';

export interface CheckoutFormData {
  buyerType: 'retail' | 'business';
  companyName?: string;
  gstin?: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  landmark?: string;
  city: string;
  postalCode: string;
  shippingMethod: 'chennai-express' | 'tn-standard' | 'depot-pickup';
  paymentMethod: 'upi' | 'card' | 'netbanking' | 'cod' | 'po';
  cardNumber?: string;
  cardExpiry?: string;
  cardCvc?: string;
  notes?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  items: CartItem[];
  customer: CheckoutFormData;
  subtotal: number;
  discount: number;
  freeSpongePack: boolean;
  shippingCost: number;
  tax: number;
  total: number;
  status: 'processing' | 'completed' | 'on-hold';
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  phone: string;
  email: string;
  location: string;
  announcementText: string;
  currencySymbol: string;
  freeShippingThreshold: number;
  isElementorMode: boolean;
  enableUpiQr: boolean;
}
