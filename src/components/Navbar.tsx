import { motion } from 'framer-motion';
import { Instagram, ShoppingBag, Snowflake } from 'lucide-react';
import { useQuoteStore } from '../store/useQuoteStore';
import { calculateQuoteSummary, formatMXN } from '../utils/pricing';

export function Navbar() {
  const items = useQuoteStore((s) => s.items);
  const requiresInvoice = useQuoteStore((s) => s.requiresInvoice);
  const isFirstPurchase = useQuoteStore((s) => s.isFirstPurchase);
  const openDrawer = useQuoteStore((s) => s.openDrawer);
  const activeCollection = useQuoteStore((s) => s.activeCollection);
  const setActiveCollection = useQuoteStore((s) => s.setActiveCollection);
  const cartPulseKey = useQuoteStore((s) => s.cartPulseKey);

  const isNavidad = activeCollection === 'navidad';
  const summary = calculateQuoteSummary(items, requiresInvoice, isFirstPurchase);

  return (
    <div className="sticky top-0 z-40">
      {/* Editorial Announcement Ribbon */}
      <div className="bg-charcoal px-3 py-2 text-center text-[10px] font-medium tracking-[0.1em] text-cream/95 transition-colors duration-700 sm:px-4 sm:text-[11px] sm:uppercase sm:tracking-[0.16em]">
        <span className="text-gold">
          ✨ 10% OFF en tu 1ra compra en pedidos desde $1,500 MXN
        </span>
        <span className="mx-2 hidden text-cream/40 md:inline">·</span>
        <span className="hidden md:inline">
          Caja y etiqueta gratis (+25 pzas)
        </span>
        <a
          href="https://www.instagram.com/craftingbonitomx"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-4 hidden items-center gap-1.5 normal-case tracking-normal text-cream/80 transition-colors hover:text-gold lg:inline-flex"
        >
          <Instagram className="h-3.5 w-3.5" strokeWidth={1.6} />
          @craftingbonitomx
        </a>
      </div>

      {/* Main Maison Header */}
      <header className="border-b border-charcoal/[0.1] bg-cream/90 backdrop-blur-md transition-colors duration-700">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-3.5 lg:px-8">
          {/* Editorial Brand Lockup */}
          <a href="#inicio" className="group flex min-w-0 items-center gap-2.5 sm:gap-3">
            <img
              src={`${import.meta.env.BASE_URL}images/brand/logo-cb.png`}
              alt="Logo Crafting Bonito"
              className="h-9 w-9 shrink-0 rounded-full object-cover ring-1 ring-charcoal/15 shadow-sm transition-transform duration-300 group-hover:scale-105 sm:h-11 sm:w-11"
            />
            <span className="truncate font-serif text-[21px] font-semibold tracking-tight text-charcoal transition-colors group-hover:text-charcoal/80 sm:text-3xl">
              Crafting Bonito
            </span>
            <span className="hidden h-5 w-px bg-charcoal/20 sm:block" />
            <span className="hidden text-[10px] font-semibold uppercase tracking-[0.22em] text-sage sm:block">
              {isNavidad ? 'Blanca Navidad · México' : 'Momentos de Luz · México'}
            </span>
          </a>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden items-center gap-7 text-[13px] font-medium tracking-wide text-charcoal/75 md:flex">
            <a
              href="#promesa"
              className="relative py-1 transition-colors hover:text-charcoal"
            >
              Nuestra Promesa
            </a>
            <a
              href="#catalogo"
              onClick={() => setActiveCollection('navidad')}
              className={`relative inline-flex items-center gap-1.5 py-1 transition-colors ${
                isNavidad
                  ? 'font-semibold text-sage underline decoration-gold decoration-2 underline-offset-4'
                  : 'hover:text-charcoal'
              }`}
            >
              <Snowflake className={`h-3.5 w-3.5 ${isNavidad ? 'text-gold' : 'text-charcoal/50'}`} />
              <span>Blanca Navidad</span>
            </a>
            <a
              href="#catalogo"
              onClick={() => setActiveCollection('eventos')}
              className={`relative py-1 transition-colors ${
                activeCollection === 'eventos'
                  ? 'font-semibold text-charcoal underline decoration-gold decoration-2 underline-offset-4'
                  : 'hover:text-charcoal'
              }`}
            >
              Eventos 2026
            </a>
            <a
              href="#condiciones"
              className="relative py-1 transition-colors hover:text-charcoal"
            >
              Condiciones y Envíos
            </a>
          </nav>

          {/* Boutique Quote Drawer Trigger (Compact on Mobile + Cart Pulse) */}
          <motion.button
            key={cartPulseKey}
            type="button"
            onClick={openDrawer}
            initial={cartPulseKey > 0 ? { scale: 1 } : false}
            animate={cartPulseKey > 0 ? { scale: [1, 1.12, 1] } : { scale: 1 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 420, damping: 20 }}
            className="inline-flex min-h-[42px] shrink-0 items-center gap-2 rounded-full border border-gold/45 bg-charcoal px-3.5 py-2 text-xs font-medium tracking-wide text-bone shadow-sm transition-colors hover:bg-charcoal/90 sm:gap-2.5 sm:px-5 sm:py-2.5 sm:text-[13px]"
          >
            <ShoppingBag className="h-4 w-4 text-gold" strokeWidth={1.7} />
            <span className="hidden sm:inline">Mi Cotización</span>
            {summary.totalPieces > 0 ? (
              <span className="flex items-center gap-1.5 rounded-full bg-gold px-2.5 py-0.5 text-[11px] font-bold tabular-nums text-charcoal shadow-sm">
                <span>{summary.totalPieces} pzas</span>
                <span className="hidden text-charcoal/50 sm:inline">·</span>
                <span className="hidden sm:inline">{formatMXN(summary.grandTotal)}</span>
              </span>
            ) : (
              <span className="rounded-full bg-bone/15 px-2 py-0.5 text-[11px] font-semibold tabular-nums text-bone/85">
                0
              </span>
            )}
          </motion.button>
        </div>
      </header>
    </div>
  );
}
