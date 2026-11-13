import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FREE_PACKAGING_THRESHOLD, MIN_ORDER_PER_MODEL } from '../data/products';
import {
  CollectionFilter,
  CustomerInfo,
  PackagingId,
  Product,
  QuoteItem,
  ScentId,
} from '../types/quote';

interface QuoteStoreState {
  items: QuoteItem[];
  requiresInvoice: boolean;
  isFirstPurchase: boolean;
  customerInfo: CustomerInfo;
  isDrawerOpen: boolean;
  customizerProduct: Product | null;
  editingItemId: string | null;
  customizerInitialQty: number;
  activeCollection: CollectionFilter;

  openCustomizer: (product: Product, existingItemId?: string, initialQty?: number) => void;
  closeCustomizer: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  setActiveCollection: (collection: CollectionFilter) => void;

  addOrUpdateItem: (payload: {
    product: Product;
    quantity: number;
    scent: ScentId;
    packaging: PackagingId;
    customLabelMessage: string;
    editingItemId?: string | null;
  }) => void;
  updateItemQuantity: (itemId: string, nextQuantity: number) => void;
  removeItem: (itemId: string) => void;
  clearQuote: () => void;
  setRequiresInvoice: (value: boolean) => void;
  setIsFirstPurchase: (value: boolean) => void;
  setCustomerInfo: (patch: Partial<CustomerInfo>) => void;
}

export const useQuoteStore = create<QuoteStoreState>()(
  persist(
    (set, get) => ({
      items: [],
      requiresInvoice: false,
      isFirstPurchase: true,
      customerInfo: {
        name: '',
        eventDate: '',
        city: '',
      },
      isDrawerOpen: false,
      customizerProduct: null,
      editingItemId: null,
      customizerInitialQty: MIN_ORDER_PER_MODEL,
      activeCollection: 'eventos',

      openCustomizer: (product, existingItemId, initialQty) => {
        set({
          customizerProduct: product,
          editingItemId: existingItemId ?? null,
          customizerInitialQty: Math.max(
            MIN_ORDER_PER_MODEL,
            Math.floor(initialQty ?? MIN_ORDER_PER_MODEL)
          ),
        });
      },

      closeCustomizer: () => {
        set({
          customizerProduct: null,
          editingItemId: null,
          customizerInitialQty: MIN_ORDER_PER_MODEL,
        });
      },

      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),
      toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),
      setActiveCollection: (collection) => set({ activeCollection: collection }),

      addOrUpdateItem: ({
        product,
        quantity,
        scent,
        packaging,
        customLabelMessage,
        editingItemId,
      }) => {
        const cleanQty = Math.max(MIN_ORDER_PER_MODEL, Math.floor(quantity || MIN_ORDER_PER_MODEL));
        const cleanMessage = cleanQty > FREE_PACKAGING_THRESHOLD ? customLabelMessage : '';

        set((state) => {
          if (editingItemId) {
            return {
              items: state.items.map((item) =>
                item.id === editingItemId
                  ? {
                      ...item,
                      product,
                      quantity: cleanQty,
                      scent,
                      packaging,
                      customLabelMessage: cleanMessage,
                    }
                  : item
              ),
              customizerProduct: null,
              editingItemId: null,
              isDrawerOpen: true,
            };
          }

          // Si ya existe exactamente el mismo modelo + aroma + empaque, acumulamos cantidad;
          // si tiene configuración distinta, lo agregamos como nueva partida para permitir variantes.
          const matchingExisting = state.items.find(
            (item) =>
              item.product.id === product.id &&
              item.scent === scent &&
              item.packaging === packaging &&
              item.customLabelMessage.trim() === cleanMessage.trim()
          );

          if (matchingExisting) {
            return {
              items: state.items.map((item) =>
                item.id === matchingExisting.id
                  ? { ...item, quantity: item.quantity + cleanQty }
                  : item
              ),
              customizerProduct: null,
              editingItemId: null,
              isDrawerOpen: true,
            };
          }

          const newItem: QuoteItem = {
            id: `${product.id}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            product,
            quantity: cleanQty,
            scent,
            packaging,
            customLabelMessage: cleanMessage,
          };

          return {
            items: [...state.items, newItem],
            customizerProduct: null,
            editingItemId: null,
            isDrawerOpen: true,
          };
        });
      },

      updateItemQuantity: (itemId, nextQuantity) => {
        const cleanQty = Math.max(MIN_ORDER_PER_MODEL, Math.floor(nextQuantity || MIN_ORDER_PER_MODEL));
        set((state) => ({
          items: state.items.map((item) => {
            if (item.id !== itemId) return item;
            const crossedIntoFree =
              item.quantity <= FREE_PACKAGING_THRESHOLD &&
              cleanQty > FREE_PACKAGING_THRESHOLD &&
              item.packaging === 'sin-caja';

            return {
              ...item,
              quantity: cleanQty,
              packaging: crossedIntoFree ? 'caja-con-ventana' : item.packaging,
            };
          }),
        }));
      },

      removeItem: (itemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        }));
      },

      clearQuote: () => {
        set({ items: [], requiresInvoice: false });
      },

      setRequiresInvoice: (value) => {
        set({ requiresInvoice: value });
      },

      setIsFirstPurchase: (value) => {
        set({ isFirstPurchase: value });
      },

      setCustomerInfo: (patch) => {
        const current = get().customerInfo;
        set({ customerInfo: { ...current, ...patch } });
      },
    }),
    {
      name: 'crafting-bonito-quote-v2',
      partialize: (state) => ({
        items: state.items,
        requiresInvoice: state.requiresInvoice,
        isFirstPurchase: state.isFirstPurchase,
        customerInfo: state.customerInfo,
      }),
    }
  )
);
