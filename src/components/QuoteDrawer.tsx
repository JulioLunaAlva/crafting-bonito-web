import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  CalendarClock,
  Check,
  Copy,
  Edit3,
  FileText,
  Gift,
  MessageCircle,
  Minus,
  Plus,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';
import { FIRST_PURCHASE_MIN_SUBTOTAL, WHATSAPP_PHONE } from '../data/products';
import { useQuoteStore } from '../store/useQuoteStore';
import {
  buildWhatsAppMessage,
  calculateItemPricing,
  calculateQuoteSummary,
  formatMXN,
  getPackagingOption,
  getScentOption,
} from '../utils/pricing';
import { springTransition } from './ui/SpotlightCard';

export function QuoteDrawer() {
  const isDrawerOpen = useQuoteStore((s) => s.isDrawerOpen);
  const closeDrawer = useQuoteStore((s) => s.closeDrawer);
  const items = useQuoteStore((s) => s.items);
  const requiresInvoice = useQuoteStore((s) => s.requiresInvoice);
  const setRequiresInvoice = useQuoteStore((s) => s.setRequiresInvoice);
  const isFirstPurchase = useQuoteStore((s) => s.isFirstPurchase);
  const setIsFirstPurchase = useQuoteStore((s) => s.setIsFirstPurchase);
  const customerInfo = useQuoteStore((s) => s.customerInfo);
  const setCustomerInfo = useQuoteStore((s) => s.setCustomerInfo);
  const updateItemQuantity = useQuoteStore((s) => s.updateItemQuantity);
  const removeItem = useQuoteStore((s) => s.removeItem);
  const openCustomizer = useQuoteStore((s) => s.openCustomizer);
  const clearQuote = useQuoteStore((s) => s.clearQuote);

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isDrawerOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeDrawer();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isDrawerOpen, closeDrawer]);

  const summary = calculateQuoteSummary(items, requiresInvoice, isFirstPurchase);
  const whatsAppText = buildWhatsAppMessage(
    items,
    requiresInvoice,
    customerInfo,
    isFirstPurchase
  );
  const whatsAppUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(whatsAppText)}`;

  const handleCopySummary = async () => {
    try {
      await navigator.clipboard.writeText(whatsAppText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Fallback ignored if clipboard blocked
    }
  };

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <div
          key="quote-drawer-overlay"
          className="pointer-events-none fixed inset-0 z-50 flex justify-end"
          role="dialog"
          aria-modal="true"
          aria-label="Resumen de Cotización"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.18 } }}
            onClick={closeDrawer}
            className="pointer-events-auto fixed inset-0 bg-charcoal/55 backdrop-blur-sm"
          />

          {/* Slide-over Drawer */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%', transition: { duration: 0.2, ease: 'easeInOut' } }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="pointer-events-auto relative z-10 flex h-full w-full max-w-lg flex-col border-l border-charcoal/[0.1] bg-bone shadow-2xl"
          >
            {/* Header */}
            <div className="shrink-0 flex items-center justify-between border-b border-charcoal/[0.08] bg-cream/80 px-4 py-3.5 sm:px-6 sm:py-4">
              <div className="flex items-center gap-3">
                <img
                  src={`${import.meta.env.BASE_URL}images/brand/logo-cb.png`}
                  alt="Crafting Bonito"
                  className="h-11 w-11 shrink-0 rounded-full border border-charcoal/15 object-cover shadow-sm"
                />
                <div>
                  <h3 className="font-serif text-2xl font-semibold text-charcoal">
                    Tu Cotización
                  </h3>
                  <p className="font-mono text-[11px] tabular-nums text-charcoal/60">
                    {summary.totalModels} {summary.totalModels === 1 ? 'modelo' : 'modelos'} ·{' '}
                    {summary.totalPieces} piezas totales
                  </p>
                </div>
              </div>

              <motion.button
                type="button"
                whileTap={{ scale: 0.94 }}
                onClick={closeDrawer}
                aria-label="Cerrar cotizador"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-charcoal/10 bg-bone text-charcoal/70 transition-colors hover:bg-cream hover:text-charcoal"
              >
                <X className="h-5 w-5" />
              </motion.button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-6 sm:py-5">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center py-12 text-center">
                  <img
                    src={`${import.meta.env.BASE_URL}images/brand/logo-cb.png`}
                    alt="Crafting Bonito"
                    className="h-20 w-20 rounded-full border border-charcoal/15 object-cover shadow-craft-card"
                  />
                  <h4 className="mt-4 font-serif text-2xl font-semibold text-charcoal">
                    Aún no agregas velas a tu cotización
                  </h4>
                  <p className="mt-2 max-w-xs text-sm text-charcoal/65">
                    Explora los 49 diseños de Blanca Navidad y Eventos 2026 y personaliza tu
                    pedido desde 10 piezas por modelo.
                  </p>
                  <a
                    href="#catalogo"
                    onClick={closeDrawer}
                    className="mt-6 inline-flex min-h-[46px] items-center justify-center rounded-full bg-charcoal px-6 py-2.5 text-xs font-semibold text-bone"
                  >
                    Ir al Catálogo
                  </a>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Items List */}
                  <div className="space-y-3">
                    {items.map((item) => {
                      const pricing = calculateItemPricing(
                        item.product,
                        item.quantity,
                        item.scent,
                        item.packaging
                      );
                      const scent = getScentOption(item.scent);
                      const packaging = getPackagingOption(item.packaging);

                      return (
                        <div
                          key={item.id}
                          className="rounded-2xl border border-charcoal/[0.08] bg-cream/60 p-3.5 shadow-craft-inset sm:p-4"
                        >
                          <div className="flex gap-3">
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="h-16 w-16 shrink-0 rounded-xl border border-charcoal/10 object-cover"
                            />

                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                  <h4 className="truncate font-serif text-lg font-semibold leading-tight text-charcoal">
                                    {item.product.name}
                                  </h4>
                                  <span className="font-mono text-[10px] uppercase tracking-wider text-sage">
                                    Nivel {pricing.tierLabel} · {formatMXN(pricing.finalUnitPrice)} c/u
                                  </span>
                                </div>

                                <div className="flex shrink-0 items-center gap-0.5">
                                  <button
                                    type="button"
                                    onClick={() => openCustomizer(item.product, item.id)}
                                    title="Editar personalización"
                                    aria-label="Editar personalización"
                                    className="flex h-9 w-9 items-center justify-center rounded-lg text-charcoal/55 transition-colors hover:bg-bone hover:text-charcoal"
                                  >
                                    <Edit3 className="h-4 w-4" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => removeItem(item.id)}
                                    title="Eliminar modelo"
                                    aria-label="Eliminar modelo"
                                    className="flex h-9 w-9 items-center justify-center rounded-lg text-charcoal/55 transition-colors hover:bg-red-50 hover:text-red-700"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>

                              {/* Selected Options Summary */}
                              <div className="mt-2 space-y-1 text-xs text-charcoal/75">
                                <p>
                                  <span className="text-charcoal/55">Aroma:</span> {scent.name}{' '}
                                  <span className="font-mono text-[11px]">
                                    ({scent.price === 0 ? '$0' : `+$${scent.price}`})
                                  </span>
                                </p>
                                <p className="flex flex-wrap items-center gap-1.5">
                                  <span className="text-charcoal/55">Empaque:</span>
                                  <span>{packaging.name}</span>
                                  {pricing.isFreePackagingUnlocked ? (
                                    <span className="inline-flex items-center gap-0.5 rounded-full bg-gold/20 px-2 py-0.5 font-mono text-[10px] font-semibold text-charcoal">
                                      <Gift className="h-2.5 w-2.5 text-gold" />
                                      $0 ¡Gratis!
                                    </span>
                                  ) : (
                                    <span className="font-mono text-[11px]">
                                      ({pricing.packagingUnitPrice === 0 ? '$0' : `+$${pricing.packagingUnitPrice}`})
                                    </span>
                                  )}
                                </p>
                                {pricing.isCustomLabelUnlocked && (
                                  <p className="text-[11px] text-charcoal/80">
                                    <span className="font-semibold text-gold">Etiqueta:</span>{' '}
                                    {item.customLabelMessage.trim()
                                      ? `“${item.customLabelMessage.trim()}”`
                                      : 'Incluida gratis (por definir texto)'}
                                  </p>
                                )}
                              </div>

                              {/* Quantity & Subtotal */}
                              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-charcoal/[0.07] pt-2.5">
                                <div className="flex flex-wrap items-center gap-1.5">
                                  <div className="inline-flex items-center rounded-xl border border-charcoal/15 bg-bone">
                                    <motion.button
                                      type="button"
                                      whileTap={{ scale: 0.92 }}
                                      onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                                      disabled={item.quantity <= 10}
                                      className="flex h-9 w-9 items-center justify-center text-charcoal/70 hover:text-charcoal disabled:opacity-35"
                                      aria-label="Disminuir cantidad"
                                    >
                                      <Minus className="h-3.5 w-3.5" />
                                    </motion.button>
                                    <input
                                      type="number"
                                      inputMode="numeric"
                                      min={10}
                                      max={500}
                                      value={item.quantity}
                                      onChange={(e) => {
                                        const val = parseInt(e.target.value, 10);
                                        if (!Number.isNaN(val) && val >= 10) {
                                          updateItemQuantity(item.id, Math.min(500, val));
                                        }
                                      }}
                                      aria-label={`Cantidad de ${item.product.name}`}
                                      className="w-12 bg-transparent text-center font-mono text-xs font-semibold tabular-nums text-charcoal focus:outline-none"
                                    />
                                    <motion.button
                                      type="button"
                                      whileTap={{ scale: 0.92 }}
                                      onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                                      className="flex h-9 w-9 items-center justify-center text-charcoal/70 hover:text-charcoal"
                                      aria-label="Aumentar cantidad"
                                    >
                                      <Plus className="h-3.5 w-3.5" />
                                    </motion.button>
                                  </div>

                                  <div className="flex items-center gap-1">
                                    {[10, 26, 51].map((q) => (
                                      <button
                                        key={q}
                                        type="button"
                                        onClick={() => updateItemQuantity(item.id, q)}
                                        className={`rounded-lg border px-1.5 py-1 font-mono text-[10px] font-semibold transition-colors ${
                                          (q === 10 && item.quantity <= 25) ||
                                          (q === 26 && item.quantity >= 26 && item.quantity <= 50) ||
                                          (q === 51 && item.quantity > 50)
                                            ? 'border-gold bg-gold/20 text-charcoal'
                                            : 'border-charcoal/10 bg-bone text-charcoal/60 hover:border-charcoal/25'
                                        }`}
                                      >
                                        {q === 51 ? '51+' : q}
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                <div className="text-right">
                                  <span className="block font-mono text-sm font-bold tabular-nums text-charcoal">
                                    {formatMXN(pricing.lineSubtotal)} MXN
                                  </span>
                                  {pricing.totalItemSavings > 0 && (
                                    <span className="block font-mono text-[10px] font-medium text-gold">
                                      Ahorro: {formatMXN(pricing.totalItemSavings)}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* First Purchase 10% OFF Card & Progress Bar */}
                  <div className="rounded-2xl border border-gold/40 bg-gold/[0.08] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                        <div>
                          <p className="text-sm font-semibold text-charcoal">
                            Es mi primera compra (-10% OFF)
                          </p>
                          <p className="text-[11px] leading-snug text-charcoal/70">
                            Aplica sobre el valor base de las velas en pedidos desde{' '}
                            {formatMXN(FIRST_PURCHASE_MIN_SUBTOTAL)} MXN.
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        role="switch"
                        aria-checked={isFirstPurchase}
                        aria-label="Es mi primera compra (-10%)"
                        onClick={() => setIsFirstPurchase(!isFirstPurchase)}
                        className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border transition-colors ${
                          isFirstPurchase
                            ? 'border-charcoal bg-charcoal'
                            : 'border-charcoal/20 bg-bone'
                        }`}
                      >
                        <span
                          className={`inline-block h-5 w-5 rounded-full transition-transform duration-200 ${
                            isFirstPurchase
                              ? 'translate-x-6 bg-gold'
                              : 'translate-x-1 bg-charcoal/45'
                          }`}
                        />
                      </button>
                    </div>

                    {!summary.isFirstPurchaseEligible ? (
                      <div className="mt-3 border-t border-gold/25 pt-3">
                        <div className="flex items-center justify-between gap-2 text-xs">
                          <span className="font-medium text-charcoal">
                            Te faltan{' '}
                            <strong className="font-mono text-gold">
                              {formatMXN(summary.amountToUnlockFirstPurchase)} MXN
                            </strong>{' '}
                            para activar tu 10% OFF de primera compra
                          </span>
                          <span className="shrink-0 font-mono text-[10px] text-charcoal/60">
                            {summary.firstPurchaseProgressPct}%
                          </span>
                        </div>
                        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-charcoal/10">
                          <div
                            style={{ width: `${summary.firstPurchaseProgressPct}%` }}
                            className="h-full rounded-full bg-gold transition-all duration-300"
                          />
                        </div>
                      </div>
                    ) : isFirstPurchase ? (
                      <div className="mt-3 flex items-center justify-between border-t border-gold/25 pt-2.5 text-xs font-semibold text-charcoal">
                        <span>Descuento de bienvenida aplicado en velas:</span>
                        <span className="font-mono text-gold">
                          −{formatMXN(summary.firstPurchaseDiscount)} MXN
                        </span>
                      </div>
                    ) : null}
                  </div>

                  {/* Invoice Switch (+16% IVA) */}
                  <div className="flex items-center justify-between gap-3 rounded-2xl border border-charcoal/[0.08] bg-cream/70 p-4">
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 shrink-0 text-sage" />
                      <div>
                        <p className="text-sm font-semibold text-charcoal">
                          Requiero Factura (+16% IVA)
                        </p>
                        <p className="text-[11px] text-charcoal/60">
                          Se calcula sobre el subtotal con descuento
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      role="switch"
                      aria-checked={requiresInvoice}
                      aria-label="Requiero Factura (+16% IVA)"
                      onClick={() => setRequiresInvoice(!requiresInvoice)}
                      className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border transition-colors ${
                        requiresInvoice
                          ? 'border-charcoal bg-charcoal'
                          : 'border-charcoal/20 bg-bone'
                      }`}
                    >
                      <span
                        className={`inline-block h-5 w-5 rounded-full transition-transform duration-200 ${
                          requiresInvoice
                            ? 'translate-x-6 bg-gold'
                            : 'translate-x-1 bg-charcoal/45'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Optional Event Info for WhatsApp Message */}
                  <div className="rounded-2xl border border-charcoal/[0.08] bg-cream/50 p-4">
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-charcoal/60">
                      Datos opcionales para agilizar tu cotización
                    </p>
                    <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                      <input
                        type="text"
                        value={customerInfo.name}
                        onChange={(e) => setCustomerInfo({ name: e.target.value })}
                        placeholder="Tu nombre o empresa"
                        className="min-h-[44px] rounded-xl border border-charcoal/10 bg-bone px-3 py-2 text-xs text-charcoal placeholder:text-charcoal/40 focus:border-gold focus:outline-none sm:col-span-2"
                      />
                      <input
                        type="text"
                        value={customerInfo.eventDate}
                        onChange={(e) => setCustomerInfo({ eventDate: e.target.value })}
                        placeholder="Fecha del evento (ej. 15 Dic)"
                        className="min-h-[44px] rounded-xl border border-charcoal/10 bg-bone px-3 py-2 text-xs text-charcoal placeholder:text-charcoal/40 focus:border-gold focus:outline-none"
                      />
                      <input
                        type="text"
                        value={customerInfo.city}
                        onChange={(e) => setCustomerInfo({ city: e.target.value })}
                        placeholder="Ciudad / Alcaldía de envío"
                        className="min-h-[44px] rounded-xl border border-charcoal/10 bg-bone px-3 py-2 text-xs text-charcoal placeholder:text-charcoal/40 focus:border-gold focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Totals & WhatsApp Checkout */}
            {items.length > 0 && (
              <div className="shrink-0 border-t border-charcoal/[0.08] bg-cream/95 px-4 pt-3.5 pb-safe backdrop-blur-md sm:px-6 sm:py-4">
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between text-charcoal/75">
                    <span>Subtotal de modelos ({summary.totalPieces} pzas)</span>
                    <span className="font-mono tabular-nums">
                      {formatMXN(summary.subtotal)} MXN
                    </span>
                  </div>

                  {summary.totalSavings > 0 && (
                    <div className="flex justify-between font-medium text-sage">
                      <span>Ahorro por volumen y empaques gratis</span>
                      <span className="font-mono tabular-nums">
                        −{formatMXN(summary.totalSavings)} MXN
                      </span>
                    </div>
                  )}

                  {summary.firstPurchaseDiscount > 0 && (
                    <div className="flex justify-between py-0.5 font-semibold text-gold">
                      <span>Descuento 1ra compra (10% en velas)</span>
                      <span className="font-mono tabular-nums">
                        −{formatMXN(summary.firstPurchaseDiscount)} MXN
                      </span>
                    </div>
                  )}

                  {requiresInvoice && (
                    <div className="flex justify-between py-0.5 text-charcoal/75">
                      <span>IVA (16%)</span>
                      <span className="font-mono tabular-nums">
                        +{formatMXN(summary.ivaAmount)} MXN
                      </span>
                    </div>
                  )}

                  <div className="flex items-baseline justify-between border-t border-charcoal/[0.08] pt-2 text-base font-bold text-charcoal">
                    <span>Total Estimado</span>
                    <span className="font-mono text-xl tabular-nums">
                      {formatMXN(summary.grandTotal)} MXN
                    </span>
                  </div>
                </div>

                {/* 50% Anticipo Box */}
                <div className="mt-2.5 rounded-2xl border border-gold/40 bg-gold/[0.1] p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-charcoal">
                      50% de anticipo para apartar fecha:
                    </span>
                    <span className="font-mono text-base font-bold tabular-nums text-charcoal">
                      {formatMXN(summary.depositAmount)} MXN
                    </span>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[11px] text-charcoal/70">
                    <span>50% restante contra fotos de entrega:</span>
                    <span className="font-mono tabular-nums">
                      {formatMXN(summary.remainingAmount)} MXN
                    </span>
                  </div>
                  <p className="mt-1.5 flex items-center gap-1.5 text-[11px] text-charcoal/75">
                    <CalendarClock className="h-3.5 w-3.5 shrink-0 text-gold" />
                    <span>
                      Agenda con <strong>15 días de anticipación</strong>. Envío se cotiza por
                      separado.
                    </span>
                  </p>
                </div>

                {/* Actions */}
                <div className="mt-3 flex flex-col gap-1.5">
                  <motion.a
                    href={whatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.97 }}
                    transition={springTransition}
                    className="inline-flex min-h-[48px] w-full items-center justify-center gap-2.5 rounded-full bg-charcoal px-6 py-3 text-sm font-semibold text-bone shadow-md transition-colors hover:bg-charcoal/90"
                  >
                    <MessageCircle className="h-4 w-4 text-gold" />
                    <span>Enviar Cotización por WhatsApp</span>
                  </motion.a>

                  <div className="flex items-center justify-between gap-2 pt-0.5">
                    <button
                      type="button"
                      onClick={handleCopySummary}
                      className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-medium text-charcoal/70 transition-colors hover:bg-bone hover:text-charcoal"
                    >
                      {copied ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-sage" />
                          <span>¡Resumen copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>Copiar resumen</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={clearQuote}
                      className="min-h-[38px] rounded-lg px-2.5 py-1 text-[11px] font-medium text-charcoal/55 transition-colors hover:text-red-700"
                    >
                      Vaciar cotización
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
