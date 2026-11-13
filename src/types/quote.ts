export type ProductCategory = 'Velas Solas' | 'Velas en Vaso';

export type ProductCollection = 'eventos' | 'navidad';

export type CollectionFilter = 'todas' | 'eventos' | 'navidad';

export type ProductOccasion =
  | 'Baby Shower'
  | 'Bodas y Bautizos'
  | 'Cumpleaños y Mascotas'
  | 'Minimalista / Corporativo'
  | 'Navidad y Posadas';

export type CatalogFilter =
  | 'Todas'
  | 'Velas Solas'
  | 'Velas en Vaso'
  | 'Baby Shower & Infantil'
  | 'Bodas & Minimalista'
  | 'Acabado Dorado';

export type ScentId = 'vainilla' | 'canela' | 'sandalo' | 'lavanda' | 'patchouli';

export type PackagingId = 'sin-caja' | 'caja-sin-ventana' | 'caja-con-ventana';

export interface PriceTiers {
  tier1: number; // 10 - 25 piezas
  tier2: number; // 26 - 50 piezas
  tier3: number; // +50 piezas
}

export interface Product {
  id: number;
  name: string;
  category: ProductCategory;
  collection: ProductCollection;
  occasion: ProductOccasion;
  weight: string;
  dimensions: string;
  prices: PriceTiers;
  badge?: string;
  isGoldHandPainted?: boolean;
  description: string;
  image: string;
}

export interface ScentOption {
  id: ScentId;
  name: string;
  price: number;
  tier: 'incluido' | 'premium';
  notes: string;
}

export interface PackagingOption {
  id: PackagingId;
  name: string;
  basePrice: number;
  description: string;
}

export interface QuoteItem {
  id: string;
  product: Product;
  quantity: number;
  scent: ScentId;
  packaging: PackagingId;
  customLabelMessage: string;
}

export interface ItemPricingBreakdown {
  quantity: number;
  activeTier: 1 | 2 | 3;
  tierLabel: string;
  baseUnitPrice: number;
  scentUnitPrice: number;
  basePackagingPrice: number;
  packagingUnitPrice: number;
  isFreePackagingUnlocked: boolean;
  isCustomLabelUnlocked: boolean;
  piecesToFreePackaging: number;
  piecesToTier3: number;
  finalUnitPrice: number;
  lineSubtotal: number;
  volumeSavings: number;
  packagingSavings: number;
  totalItemSavings: number;
}

export interface CustomerInfo {
  name: string;
  eventDate: string;
  city: string;
}
