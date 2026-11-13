import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, ShoppingBag, Sparkles, X } from 'lucide-react';
import { CatalogSection } from './components/CatalogSection';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { HolidaySnowOverlay } from './components/HolidaySnowOverlay';
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
  const activeCollection = useQuoteStore((s) => s.activeCollection);
  const cartPulseKey = useQuoteStore((s) => s.cartPulseKey);
  const toastNotification = useQuoteStore((s) => s.toastNotification);
  const dismissToast = useQuoteStore((s) => s.dismissToast);

  const isNavidadTheme = activeCollection === 'navidad';
  const summary = calculateQuoteSummary(items, requiresInvoice, isFirstPurchase);
  const isOverlayOpen = isDrawerOpen || Boolean(customizerProduct);
  const showMobileBar = !isOverlayOpen;

  useEffect(() => {
    document.documentElement.classList.toggle('theme-navidad', isNavidadTheme);
    return () => {
      document.documentElement.classList.remove('theme-navidad');
    };
  }, [isNavidadTheme]);

  // Garantiza limpieza absoluta de overflow/touchAction al cerrar cualquier overlay
  useEffect(() => {
    if (isOverlayOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [isOverlayOpen]);

  // Auto-cierre del Toast flotante tras 4.8s
  useEffect(() => {
    if (!toastNotification) return;
    const timer = window.setTimeout(() => {
      dismissToast();
    }, 4800);
    return () => window.clearTimeout(timer);
  }, [toastNotification, dismissToast]);

  return (
    <div
      className={`craft-grain relative min-h-screen overflow-x-hidden bg-cream pb-24 text-charcoal transition-colors duration-700 md:pb-0 ${
        isNavidadTheme ? 'theme-navidad' : ''
      }`}
    >
      <HolidaySnowOverlay isActive={isNavidadTheme} />
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

      {/* Floating Added-to-Quote Toast Notification */}
      <AnimatePresence>
        {toastNotification && !isOverlayOpen && (
          <div className="pointer-events-none fixed inset-x-0 bottom-24 z-40 flex justify-center px-4 md:bottom-6 md:justify-end md:px-6">
            <motion.div
              key={toastNotification.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.96, transition: { duration: 0.16 } }}
              transition={springTransition}
              className="pointer-events-auto flex w-full max-w-md items-center justify-between gap-3 rounded-2xl border border-gold/50 bg-charcoal p-3.5 text-bone shadow-[0_20px_45px_-12px_rgba(44,42,41,0.55)] backdrop-blur-md"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold/20 text-gold">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-gold">
                    ✨ Agregado a tu cotización
                  </p>
                  <p className="truncate text-xs text-cream/90">
                    {toastNotification.quantity} pzas · {toastNotification.productName} (
                    {formatMXN(toastNotification.subtotal)})
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    dismissToast();
                    openDrawer();
                  }}
                  className="inline-flex min-h-[36px] items-center gap-1 rounded-full bg-gold px-3.5 py-1.5 text-[11px] font-bold text-charcoal shadow-sm transition-transform active:scale-95"
                >
                  <span>Ver Cotización</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
                <button
                  type="button"
                  onClick={dismissToast}
                  aria-label="Cerrar notificación"
                  className="flex h-8 w-8 items-center justify-center rounded-full text-cream/60 hover:bg-white/10 hover:text-bone"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mobile-First Sticky Bottom App Bar */}
      <AnimatePresence>
        {showMobileBar && (
          <motion.div
            key="mobile-sticky-bar"
            initial={{ y: 90, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 90, opacity: 0, transition: { duration: 0.16 } }}
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
                  key={cartPulseKey}
                  type="button"
                  initial={cartPulseKey > 0 ? { scale: 1 } : false}
                  animate={cartPulseKey > 0 ? { scale: [1, 1.1, 1] } : { scale: 1 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: 'spring', stiffness: 420, damping: 20 }}
                  onClick={openDrawer}
                  className="inline-flex min-h-[44px] shrink-0 items-center gap-2 rounded-full border border-gold/50 bg-charcoal px-5 py-2.5 text-xs font-semibold text-bone shadow-md"
                >
                  <ShoppingBag className="h-4 w-4 text-gold" />
                  <span>Ver Cotización</span>
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
