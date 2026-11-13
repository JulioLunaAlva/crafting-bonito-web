import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Check,
  Gift,
  Minus,
  Package,
  Plus,
  ShoppingBag,
  Sparkles,
  Tag,
  Wind,
  X,
} from 'lucide-react';
import {
  FREE_PACKAGING_THRESHOLD,
  MIN_ORDER_PER_MODEL,
  PACKAGING_OPTIONS,
  SCENT_OPTIONS,
} from '../data/products';
import { useQuoteStore } from '../store/useQuoteStore';
import { PackagingId, ScentId } from '../types/quote';
import { calculateItemPricing, formatMXN } from '../utils/pricing';
import { springTransition } from './ui/SpotlightCard';

const QUICK_QUANTITIES = [10, 26, 51, 100];
const NAVIDAD_LABEL_PRESETS = [
  'Feliz Navidad · Familia García',
  'Posada Anual 2026 · Gracias por tu entrega',
  'Boda de Invierno · Camila & Diego',
];
const EVENTOS_LABEL_PRESETS = [
  '¡Gracias por acompañarnos! · Baby Shower',
  'Nuestra Boda · Camila & Diego',
  'Mi Bautizo · Recuerdo con amor',
];

export function ProductCustomizerModal() {
  const product = useQuoteStore((s) => s.customizerProduct);
  const editingItemId = useQuoteStore((s) => s.editingItemId);
  const customizerInitialQty = useQuoteStore((s) => s.customizerInitialQty);
  const items = useQuoteStore((s) => s.items);
  const closeCustomizer = useQuoteStore((s) => s.closeCustomizer);
  const addOrUpdateItem = useQuoteStore((s) => s.addOrUpdateItem);

  const [quantity, setQuantity] = useState<number>(MIN_ORDER_PER_MODEL);
  const [rawQtyInput, setRawQtyInput] = useState<string>(String(MIN_ORDER_PER_MODEL));
  const [scent, setScent] = useState<ScentId>('vainilla');
  const [packaging, setPackaging] = useState<PackagingId>('sin-caja');
  const [customLabelMessage, setCustomLabelMessage] = useState<string>('');

  useEffect(() => {
    if (!product) return;
    if (editingItemId) {
      const existing = items.find((it) => it.id === editingItemId);
      if (existing) {
        setQuantity(existing.quantity);
        setRawQtyInput(String(existing.quantity));
        setScent(existing.scent);
        setPackaging(existing.packaging);
        setCustomLabelMessage(existing.customLabelMessage);
        return;
      }
    }
    const startQty = Math.max(MIN_ORDER_PER_MODEL, customizerInitialQty || MIN_ORDER_PER_MODEL);
    setQuantity(startQty);
    setRawQtyInput(String(startQty));
    setScent('vainilla');
    setPackaging(startQty > FREE_PACKAGING_THRESHOLD ? 'caja-con-ventana' : 'sin-caja');
    setCustomLabelMessage('');
  }, [product, editingItemId, customizerInitialQty, items]);

  useEffect(() => {
    if (!product) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCustomizer();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [product, closeCustomizer]);

  const applyQuantity = (nextQty: number) => {
    const clamped = Math.max(MIN_ORDER_PER_MODEL, Math.min(500, Math.floor(nextQty)));
    const crossedIntoFree =
      quantity <= FREE_PACKAGING_THRESHOLD &&
      clamped > FREE_PACKAGING_THRESHOLD &&
      packaging === 'sin-caja';

    setQuantity(clamped);
    setRawQtyInput(String(clamped));
    if (crossedIntoFree) {
      setPackaging('caja-con-ventana');
    }
  };

  const pricing = product ? calculateItemPricing(product, quantity, scent, packaging) : null;
  const sliderMax = Math.max(120, quantity);
  const progressToFreePct = Math.min(100, Math.round((quantity / 26) * 100));
  const labelPresets =
    product?.collection === 'eventos' ? EVENTOS_LABEL_PRESETS : NAVIDAD_LABEL_PRESETS;

  const handleSubmit = () => {
    if (!product || !pricing) return;
    const parsed = parseInt(rawQtyInput, 10);
    const finalQty =
      !Number.isNaN(parsed) && parsed >= MIN_ORDER_PER_MODEL
        ? Math.min(500, Math.floor(parsed))
        : pricing.quantity;

    addOrUpdateItem({
      product,
      quantity: finalQty,
      scent,
      packaging,
      customLabelMessage,
      editingItemId,
    });
  };

  return (
    <AnimatePresence>
      {product && pricing && (
        <div
          key="customizer-overlay"
          className="pointer-events-none fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="customizer-title"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.18 } }}
            onClick={closeCustomizer}
            className="pointer-events-auto fixed inset-0 bg-charcoal/55 backdrop-blur-sm"
          />

          {/* Bottom Sheet (Mobile) / Modal (Desktop) */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40, transition: { duration: 0.18, ease: 'easeIn' } }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="pointer-events-auto relative z-10 flex max-h-[92dvh] w-full max-w-4xl flex-col overflow-hidden rounded-t-3xl border border-charcoal/[0.12] bg-bone shadow-2xl sm:max-h-[90vh] sm:rounded-3xl"
          >
            {/* Mobile Sheet Handle */}
            <div className="flex justify-center bg-cream/80 pt-2.5 pb-1 sm:hidden">
              <span className="h-1.5 w-11 rounded-full bg-charcoal/20" />
            </div>

            {/* Sticky Header with Live Price */}
            <div className="shrink-0 flex items-center justify-between gap-3 border-b border-charcoal/[0.08] bg-cream/80 px-4 py-3 sm:px-7 sm:py-4">
              <div className="flex min-w-0 items-center gap-3">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-12 w-12 shrink-0 rounded-xl border border-charcoal/10 object-cover"
                />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-sage">
                      {product.category}
                    </span>
                    {product.isGoldHandPainted && (
                      <span className="hidden items-center gap-1 rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-semibold text-gold sm:inline-flex">
                        <Sparkles className="h-2.5 w-2.5" />
                        Pintado a mano en dorado
                      </span>
                    )}
                  </div>
                  <h3
                    id="customizer-title"
                    className="truncate font-serif text-xl font-semibold text-charcoal sm:text-3xl"
                  >
                    {product.name}
                  </h3>
                  <p className="mt-0.5 text-[11px] font-semibold tabular-nums text-charcoal/75 sm:hidden">
                    {formatMXN(pricing.finalUnitPrice)} c/u ·{' '}
                    <span className="text-charcoal">
                      Subtotal {formatMXN(pricing.lineSubtotal)}
                    </span>
                  </p>
                </div>
              </div>

              <motion.button
                type="button"
                whileTap={{ scale: 0.94 }}
                onClick={closeCustomizer}
                aria-label="Cerrar personalizador"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-charcoal/10 bg-bone text-charcoal/70 transition-colors hover:bg-cream hover:text-charcoal"
              >
                <X className="h-5 w-5" />
              </motion.button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-5 sm:px-7 sm:py-6">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-7">
                {/* Left Column: Specs & Quantity Slider */}
                <div className="space-y-5 lg:col-span-6">
                  {/* Product Mini Card */}
                  <div className="rounded-2xl border border-charcoal/[0.08] bg-cream/60 p-4">
                    <p className="text-xs leading-relaxed text-charcoal/75">
                      {product.description}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-3 font-mono text-[11px] text-charcoal/70">
                      <span>Peso: {product.weight}</span>
                      <span>·</span>
                      <span>Medidas: {product.dimensions}</span>
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="rounded-2xl border border-charcoal/[0.08] bg-cream/40 p-4 sm:p-5">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="qty-number-input"
                        className="text-sm font-semibold text-charcoal"
                      >
                        1. Cantidad de piezas
                      </label>
                      <span className="font-mono text-[11px] text-charcoal/60">
                        Mín. 10 piezas
                      </span>
                    </div>

                    <div className="mt-4 flex items-center gap-3">
                      <motion.button
                        type="button"
                        whileTap={{ scale: 0.94 }}
                        onClick={() => applyQuantity(quantity - 1)}
                        disabled={quantity <= MIN_ORDER_PER_MODEL}
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-charcoal/15 bg-bone text-charcoal transition-colors hover:bg-cream disabled:opacity-40"
                        aria-label="Restar una pieza"
                      >
                        <Minus className="h-4 w-4" />
                      </motion.button>

                      <div className="relative flex-1">
                        <input
                          id="qty-number-input"
                          type="number"
                          inputMode="numeric"
                          min={MIN_ORDER_PER_MODEL}
                          max={500}
                          value={rawQtyInput}
                          onChange={(e) => {
                            const val = e.target.value;
                            setRawQtyInput(val);
                            const parsed = parseInt(val, 10);
                            if (!Number.isNaN(parsed) && parsed >= MIN_ORDER_PER_MODEL) {
                              applyQuantity(parsed);
                            }
                          }}
                          onBlur={() => {
                            const parsed = parseInt(rawQtyInput, 10);
                            if (Number.isNaN(parsed) || parsed < MIN_ORDER_PER_MODEL) {
                              applyQuantity(MIN_ORDER_PER_MODEL);
                            } else {
                              applyQuantity(parsed);
                            }
                          }}
                          className="min-h-[48px] w-full rounded-xl border border-charcoal/15 bg-bone py-2 text-center font-mono text-lg font-semibold tabular-nums text-charcoal focus:border-gold focus:outline-none"
                        />
                        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 font-mono text-xs text-charcoal/50">
                          pzas
                        </span>
                      </div>

                      <motion.button
                        type="button"
                        whileTap={{ scale: 0.94 }}
                        onClick={() => applyQuantity(quantity + 1)}
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-charcoal/15 bg-bone text-charcoal transition-colors hover:bg-cream"
                        aria-label="Sumar una pieza"
                      >
                        <Plus className="h-4 w-4" />
                      </motion.button>
                    </div>

                    {/* Slider */}
                    <div className="mt-5">
                      <input
                        type="range"
                        min={MIN_ORDER_PER_MODEL}
                        max={sliderMax}
                        value={quantity}
                        onChange={(e) => applyQuantity(Number(e.target.value))}
                        className="craft-slider w-full"
                        aria-label="Deslizador de cantidad"
                      />
                      <div className="mt-2.5 flex justify-between font-mono text-[10px] text-charcoal/55">
                        <span>10 pzas</span>
                        <span className="font-semibold text-gold">26 pzas (Caja Gratis)</span>
                        <span>51+ (Mayoreo)</span>
                      </div>
                    </div>

                    {/* Quick Chips */}
                    <div className="mt-3.5 grid grid-cols-4 gap-1.5 sm:flex sm:flex-wrap">
                      {QUICK_QUANTITIES.map((q) => (
                        <motion.button
                          key={q}
                          type="button"
                          whileTap={{ scale: 0.96 }}
                          onClick={() => applyQuantity(q)}
                          className={`min-h-[44px] rounded-xl border px-2 py-1.5 font-mono text-[11px] font-medium transition-colors sm:px-3 ${
                            quantity === q
                              ? 'border-charcoal bg-charcoal text-bone'
                              : 'border-charcoal/10 bg-bone text-charcoal/75 hover:border-charcoal/30'
                          }`}
                        >
                          {q} pzas
                        </motion.button>
                      ))}
                    </div>

                    {/* Interactive Volume Tier Indicator */}
                    <div className="mt-4 grid grid-cols-3 gap-2">
                      {[
                        { tier: 1 as const, label: '10–25', minQty: 10, price: product.prices.tier1 },
                        { tier: 2 as const, label: '26–50', minQty: 26, price: product.prices.tier2 },
                        { tier: 3 as const, label: '+50', minQty: 51, price: product.prices.tier3 },
                      ].map((t) => {
                        const active = pricing.activeTier === t.tier;
                        return (
                          <motion.button
                            key={t.tier}
                            type="button"
                            whileTap={{ scale: 0.96 }}
                            onClick={() => applyQuantity(t.minQty)}
                            aria-pressed={active}
                            className={`cursor-pointer rounded-xl border p-2.5 text-center transition-all ${
                              active
                                ? 'border-gold bg-gold/15 shadow-sm'
                                : 'border-charcoal/[0.08] bg-bone opacity-75 hover:border-gold/50 hover:opacity-100'
                            }`}
                          >
                            <span className="block font-mono text-[10px] text-charcoal/70">
                              {t.label} pzas
                            </span>
                            <span className="mt-0.5 block font-mono text-xs font-bold tabular-nums text-charcoal">
                              {formatMXN(t.price)}
                            </span>
                          </motion.button>
                        );
                      })}
                    </div>

                    {/* Live Unlock Progress Banner */}
                    {!pricing.isFreePackagingUnlocked ? (
                      <div className="mt-4 rounded-xl border border-gold/30 bg-gold/[0.08] p-3">
                        <div className="flex items-center justify-between gap-2 text-xs">
                          <span className="font-medium text-charcoal">
                            ¡Te faltan{' '}
                            <strong className="font-mono text-gold">
                              {pricing.piecesToFreePackaging} pzas
                            </strong>{' '}
                            para caja y etiqueta gratis!
                          </span>
                          <span className="shrink-0 font-mono text-[11px] text-charcoal/65">
                            {quantity}/26
                          </span>
                        </div>
                        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-charcoal/10">
                          <motion.div
                            initial={false}
                            animate={{ width: `${progressToFreePct}%` }}
                            transition={springTransition}
                            className="h-full rounded-full bg-gold"
                          />
                        </div>
                      </div>
                    ) : (
                      <motion.div
                        key="unlocked-banner"
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={springTransition}
                        className="relative mt-4 overflow-hidden rounded-xl border border-gold/50 bg-gold/[0.14] p-3 shadow-sm"
                      >
                        <div className="relative z-10 flex items-start gap-2 text-xs text-charcoal">
                          <Gift className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                          <div>
                            <p className="font-semibold">
                              ¡Beneficio de volumen desbloqueado (+25 piezas)!
                            </p>
                            <p className="mt-0.5 text-charcoal/75">
                              Tu empaque craft seleccionado pasa a{' '}
                              <strong className="text-gold">$0 MXN</strong> y ya puedes
                              personalizar tu etiqueta.
                              {pricing.piecesToTier3 > 0 && (
                                <span className="ml-1">
                                  (Agrega {pricing.piecesToTier3} pzas más para precio +50).
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Right Column: Scent, Packaging & Custom Label */}
                <div className="space-y-5 lg:col-span-6">
                  {/* 2. Aroma */}
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-charcoal">
                        <Wind className="h-4 w-4 text-sage" />
                        2. Aroma por vela
                      </span>
                      <span className="font-mono text-[11px] text-charcoal/60">
                        Incluidos $0 · Premium +$15
                      </span>
                    </div>

                    <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {SCENT_OPTIONS.map((option) => {
                        const selected = scent === option.id;
                        return (
                          <motion.button
                            key={option.id}
                            type="button"
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setScent(option.id)}
                            className={`flex min-h-[56px] flex-col items-start rounded-xl border p-3.5 text-left transition-all ${
                              selected
                                ? 'border-charcoal bg-cream shadow-sm ring-1 ring-charcoal/15'
                                : 'border-charcoal/[0.08] bg-bone hover:border-charcoal/25'
                            }`}
                          >
                            <div className="flex w-full items-center justify-between gap-2">
                              <span className="text-sm font-semibold text-charcoal">
                                {option.name}
                              </span>
                              <span
                                className={`rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold ${
                                  option.price === 0
                                    ? 'bg-sage/15 text-sage'
                                    : 'bg-gold/15 text-gold'
                                }`}
                              >
                                {option.price === 0 ? 'Incluido $0' : `+$${option.price} c/u`}
                              </span>
                            </div>
                            <p className="mt-1 text-[11px] leading-snug text-charcoal/65">
                              {option.notes}
                            </p>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 3. Empaque */}
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-charcoal">
                        <Package className="h-4 w-4 text-sage" />
                        3. Empaque
                      </span>
                      {pricing.isFreePackagingUnlocked && (
                        <span className="rounded-full border border-gold/40 bg-gold/15 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-gold">
                          ¡Empaque Gratis Activo!
                        </span>
                      )}
                    </div>

                    <div className="mt-3 space-y-2">
                      {PACKAGING_OPTIONS.map((option) => {
                        const selected = packaging === option.id;
                        const isFreeByRule =
                          pricing.isFreePackagingUnlocked && option.basePrice > 0;

                        return (
                          <motion.button
                            key={option.id}
                            type="button"
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setPackaging(option.id)}
                            className={`flex min-h-[56px] w-full items-start justify-between gap-3 rounded-xl border p-3.5 text-left transition-all ${
                              selected
                                ? 'border-charcoal bg-cream shadow-sm ring-1 ring-charcoal/15'
                                : 'border-charcoal/[0.08] bg-bone hover:border-charcoal/25'
                            }`}
                          >
                            <div className="flex items-start gap-2.5">
                              <div
                                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                                  selected
                                    ? 'border-charcoal bg-charcoal text-bone'
                                    : 'border-charcoal/30'
                                }`}
                              >
                                {selected && <Check className="h-3 w-3" />}
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-charcoal">
                                  {option.name}
                                </p>
                                <p className="mt-0.5 text-[11px] text-charcoal/65">
                                  {option.description}
                                </p>
                              </div>
                            </div>

                            <div className="shrink-0 text-right font-mono">
                              {option.basePrice === 0 ? (
                                <span className="text-xs font-semibold text-charcoal/70">$0</span>
                              ) : isFreeByRule ? (
                                <div>
                                  <span className="block text-[10px] text-charcoal/45 line-through">
                                    +${option.basePrice} c/u
                                  </span>
                                  <span className="block text-xs font-bold text-gold">
                                    $0 ¡Gratis!
                                  </span>
                                </div>
                              ) : (
                                <span className="text-xs font-semibold text-charcoal">
                                  +${option.basePrice} c/u
                                </span>
                              )}
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 4. Etiqueta Personalizada (Desbloqueada en >25 piezas) */}
                  {pricing.isCustomLabelUnlocked && (
                    <div className="rounded-2xl border border-gold/40 bg-gold/[0.07] p-4">
                      <label
                        htmlFor="custom-label-input"
                        className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gold"
                      >
                        <Tag className="h-3.5 w-3.5" />
                        Mensaje de etiqueta personalizada (Incluida)
                      </label>
                      <input
                        id="custom-label-input"
                        type="text"
                        maxLength={85}
                        value={customLabelMessage}
                        onChange={(e) => setCustomLabelMessage(e.target.value)}
                        placeholder="Ej. Feliz Navidad · Familia Mendoza 2026"
                        className="mt-2.5 min-h-[44px] w-full rounded-xl border border-gold/40 bg-bone px-3.5 py-2.5 text-sm text-charcoal placeholder:text-charcoal/40 focus:border-charcoal focus:outline-none"
                      />
                      <div className="mt-2.5 flex flex-wrap gap-1.5">
                        {labelPresets.map((preset) => (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => setCustomLabelMessage(preset)}
                            className="min-h-[34px] rounded-full border border-charcoal/10 bg-bone px-3 py-1 text-[11px] text-charcoal/70 transition-colors hover:border-gold hover:text-charcoal"
                          >
                            {preset}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sticky Bottom Summary Bar with High-Visibility CTA */}
            <div className="shrink-0 border-t border-charcoal/[0.08] bg-cream/95 px-4 pt-3 pb-safe backdrop-blur-md sm:px-7 sm:py-4">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center sm:gap-4">
                <div className="flex items-center justify-between gap-3 sm:justify-start sm:gap-6">
                  <div>
                    <span className="block font-mono text-[10px] uppercase tracking-wider text-charcoal/55">
                      Precio c/u
                    </span>
                    <span className="font-mono text-base font-bold tabular-nums text-charcoal sm:text-lg">
                      {formatMXN(pricing.finalUnitPrice)} MXN
                    </span>
                  </div>

                  <div>
                    <span className="block font-mono text-[10px] uppercase tracking-wider text-charcoal/55">
                      Subtotal ({pricing.quantity} pzas)
                    </span>
                    <span className="font-mono text-lg font-bold tabular-nums text-charcoal sm:text-xl">
                      {formatMXN(pricing.lineSubtotal)} MXN
                    </span>
                  </div>

                  {pricing.totalItemSavings > 0 && (
                    <div className="rounded-xl border border-gold/40 bg-gold/15 px-2.5 py-1 sm:px-3 sm:py-1.5">
                      <span className="block font-mono text-[9px] uppercase tracking-wider text-gold sm:text-[10px]">
                        Ahorras
                      </span>
                      <span className="font-mono text-xs font-bold tabular-nums text-charcoal sm:text-sm">
                        {formatMXN(pricing.totalItemSavings)}
                      </span>
                    </div>
                  )}
                </div>

                <motion.button
                  type="button"
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.96 }}
                  transition={springTransition}
                  onClick={handleSubmit}
                  className="inline-flex min-h-[50px] w-full items-center justify-center gap-2.5 rounded-full border border-gold/60 bg-charcoal px-7 py-3 text-sm font-semibold text-bone shadow-[0_12px_28px_-10px_rgba(44,42,41,0.55)] transition-colors hover:bg-charcoal/90 sm:w-auto"
                >
                  <ShoppingBag className="h-4 w-4 text-gold" />
                  <span>
                    {editingItemId
                      ? `Actualizar en Cotización · ${formatMXN(pricing.lineSubtotal)} MXN`
                      : `Agregar a mi Cotización · ${formatMXN(pricing.lineSubtotal)} MXN`}
                  </span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
