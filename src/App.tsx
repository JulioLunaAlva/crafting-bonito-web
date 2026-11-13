import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, ShoppingBag, Sparkles } from 'lucide-react';
import { CatalogSection } from './components/CatalogSection';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { Navbar } from './components/Navbar';
import { ProductCustomizerModal } from './components/ProductCustomizerModal';
import { QuoteDrawer } from './components/QuoteDrawer';
import { ValueBentoGrid } from './components/ValueBentoGrid';
import { springTransition } from './components/ui/SpotlightCard';
import { useQuoteStore } from './store/useQuoteStore';
import { calculateQuoteSummary, formatMXN } from './utils/pricing';

export default function App() {
  const items = useQuoteStore((s) => s.items);
  const requiresInvoice = useQuoteStore((s) => s.requiresInvoice);
  const isFirstPurchase = useQuoteStore((s) => s.isFirstPurchase);
  const openDrawer = useQuoteStore((s) => s.openDrawer);
  const isDrawerOpen = useQuoteStore((s) => s.isDrawerOpen);
  const customizerProduct = useQuoteStore((s) => s.customizerProduct);

  const summary = calculateQuoteSummary(items, requiresInvoice, isFirstPurchase);
  const showMobileBar = !isDrawerOpen && !customizerProduct;

  return (
    <div className="craft-grain relative min-h-screen overflow-x-hidden bg-cream pb-24 text-charcoal md:pb-0">
      <Navbar />

      <main>
        <Hero />
        <ValueBentoGrid />
        <CatalogSection />
      </main>

      <Footer />

      {/* Modals & Drawers */}
      <ProductCustomizerModal />
      <QuoteDrawer />

      {/* Mobile-First Sticky Bottom App Bar */}
      <AnimatePresence>
        {showMobileBar && (
          <motion.div
            initial={{ y: 90, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 90, opacity: 0 }}
            transition={springTransition}
            className="fixed inset-x-0 bottom-0 z-30 border-t border-charcoal/[0.12] bg-bone/95 px-4 pt-2.5 pb-safe shadow-[0_-12px_32px_-12px_rgba(44,42,41,0.18)] backdrop-blur-lg md:hidden"
          >
            {summary.totalPieces > 0 ? (
              <div className="mx-auto flex max-w-md items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-sage">
                      {summary.totalPieces} piezas
                    </span>
                    {summary.firstPurchaseDiscount > 0 && (
                      <span className="inline-flex items-center gap-0.5 rounded-full bg-gold/20 px-1.5 py-0.5 text-[10px] font-semibold text-charcoal">
                        <Sparkles className="h-2.5 w-2.5 text-gold" />
                        10% OFF
                      </span>
                    )}
                  </div>
                  <p className="truncate font-serif text-xl font-semibold leading-tight tabular-nums text-charcoal">
                    {formatMXN(summary.grandTotal)} MXN
                  </p>
                </div>

                <motion.button
                  type="button"
                  whileTap={{ scale: 0.97 }}
                  transition={springTransition}
                  onClick={openDrawer}
                  className="inline-flex min-h-[44px] shrink-0 items-center gap-2 rounded-full bg-charcoal px-5 py-2.5 text-xs font-semibold text-bone shadow-md"
                >
                  <ShoppingBag className="h-4 w-4 text-gold" />
                  <span>Cotizar ahora</span>
                </motion.button>
              </div>
            ) : (
              <div className="mx-auto flex max-w-md items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-charcoal">
                    ✨ 10% OFF en 1ra compra
                  </p>
                  <p className="truncate text-[11px] text-charcoal/65">
                    Pedidos desde $1,500 · Mín. 10 pzas/modelo
                  </p>
                </div>

                <motion.a
                  href="#catalogo"
                  whileTap={{ scale: 0.97 }}
                  transition={springTransition}
                  className="inline-flex min-h-[44px] shrink-0 items-center gap-1.5 rounded-full bg-charcoal px-4 py-2.5 text-xs font-semibold text-bone shadow-md"
                >
                  <span>Elegir velas</span>
                  <ArrowRight className="h-3.5 w-3.5 text-gold" />
                </motion.a>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
