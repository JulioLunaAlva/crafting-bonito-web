import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, PencilRuler, Ruler, Scale, Sparkles } from 'lucide-react';
import { useQuoteStore } from '../store/useQuoteStore';
import { Product } from '../types/quote';
import { formatMXN } from '../utils/pricing';
import { SpotlightCard, springTransition } from './ui/SpotlightCard';

interface ProductCardProps {
  product: Product;
  previewTier: 1 | 2 | 3;
  index: number;
  showCollectionTag?: boolean;
}

const TIER_MIN_QTY: Record<1 | 2 | 3, number> = {
  1: 10,
  2: 26,
  3: 51,
};

export function ProductCard({
  product,
  previewTier,
  index,
  showCollectionTag = false,
}: ProductCardProps) {
  const openCustomizer = useQuoteStore((s) => s.openCustomizer);
  const items = useQuoteStore((s) => s.items);
  const [selectedTier, setSelectedTier] = useState<1 | 2 | 3>(previewTier);

  useEffect(() => {
    setSelectedTier(previewTier);
  }, [previewTier]);

  const inQuoteCount = items
    .filter((it) => it.product.id === product.id)
    .reduce((acc, it) => acc + it.quantity, 0);

  const activePreviewPrice =
    selectedTier === 1
      ? product.prices.tier1
      : selectedTier === 2
      ? product.prices.tier2
      : product.prices.tier3;

  const initialQty = TIER_MIN_QTY[selectedTier];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.985 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ ...springTransition, delay: Math.min((index % 6) * 0.04, 0.2) }}
      whileHover={{ y: -6, scale: 1.008 }}
      className="h-full"
    >
      <SpotlightCard className="group flex h-full flex-col rounded-3xl transition-shadow duration-300 hover:shadow-[0_26px_52px_-16px_rgba(197,160,89,0.22),0_14px_30px_-14px_rgba(44,42,41,0.12)]">
        {/* Clean Bright Studio Image Frame */}
        <div className="relative aspect-[4/4.3] overflow-hidden bg-cream/60">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full scale-105 object-cover object-center transition-transform duration-700 group-hover:scale-110"
          />

          {/* Category & Occasion Pills */}
          <div className="absolute left-3.5 top-3.5 flex flex-wrap items-center gap-1.5 pr-10">
            <span className="rounded-full border border-charcoal/10 bg-bone/95 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-charcoal shadow-sm backdrop-blur-sm">
              {product.category}
            </span>
            {showCollectionTag ? (
              <span className="rounded-full border border-charcoal/10 bg-charcoal/85 px-2.5 py-1 text-[10px] font-medium tracking-wide text-bone shadow-sm backdrop-blur-sm">
                {product.collection === 'eventos' ? 'Eventos 2026' : 'Blanca Navidad'}
              </span>
            ) : (
              product.collection === 'eventos' && (
                <span className="rounded-full border border-sage/25 bg-bone/90 px-2.5 py-1 text-[10px] font-medium text-sage shadow-sm backdrop-blur-sm">
                  {product.occasion}
                </span>
              )
            )}
          </div>

          {/* Gold Hand-painted Badge */}
          {product.isGoldHandPainted && (
            <div className="absolute right-3.5 top-3.5">
              <span className="inline-flex items-center gap-1 rounded-full border border-gold/60 bg-charcoal/90 px-3 py-1 text-[10px] font-semibold tracking-wide text-gold shadow-sm backdrop-blur-md">
                <Sparkles className="h-3 w-3" />
                Pintado a mano en dorado
              </span>
            </div>
          )}

          {/* Already in quote pill */}
          {inQuoteCount > 0 && (
            <div className="absolute bottom-3.5 left-3.5">
              <span className="inline-flex items-center gap-1 rounded-full bg-sage px-3 py-1 text-[11px] font-semibold tabular-nums text-bone shadow-sm">
                <Check className="h-3 w-3" />
                En cotización: {inQuoteCount} pzas
              </span>
            </div>
          )}
        </div>

        {/* Editorial Content Body */}
        <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
          <div>
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-serif text-2xl font-semibold leading-tight text-charcoal">
                {product.name}
              </h3>
              <div className="shrink-0 text-right">
                <span className="block font-serif text-2xl font-semibold leading-none tabular-nums text-charcoal">
                  {formatMXN(activePreviewPrice)}
                </span>
                <span className="mt-1 block text-[10px] font-medium uppercase tracking-wider text-charcoal/55">
                  c/u · {selectedTier === 1 ? '10–25 pzas' : selectedTier === 2 ? '26–50 pzas' : '+50 pzas'}
                </span>
              </div>
            </div>

            <p className="mt-2.5 line-clamp-2 text-xs leading-relaxed text-charcoal/70">
              {product.description}
            </p>

            {/* Specs */}
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-y border-charcoal/[0.08] py-2.5 text-[11px] font-medium text-charcoal/70 tabular-nums">
              <span className="inline-flex items-center gap-1.5">
                <Scale className="h-3.5 w-3.5 text-sage" />
                {product.weight}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Ruler className="h-3.5 w-3.5 text-sage" />
                {product.dimensions}
              </span>
            </div>

            {/* Interactive Volume Tier Selector */}
            <div
              className="mt-4 grid grid-cols-3 divide-x divide-charcoal/10 overflow-hidden rounded-xl border border-charcoal/10 bg-cream/55"
              role="group"
              aria-label={`Seleccionar rango de piezas para ${product.name}`}
            >
              {[
                { tier: 1 as const, label: '10–25 pzas', price: product.prices.tier1 },
                { tier: 2 as const, label: '26–50 pzas', price: product.prices.tier2 },
                { tier: 3 as const, label: '+50 pzas', price: product.prices.tier3 },
              ].map((t) => {
                const isSelected = selectedTier === t.tier;
                return (
                  <button
                    key={t.tier}
                    type="button"
                    onClick={() => setSelectedTier(t.tier)}
                    aria-pressed={isSelected}
                    className={`min-h-[46px] cursor-pointer px-2 py-2 text-center transition-colors focus:outline-none ${
                      isSelected
                        ? 'bg-gold/20 ring-1 ring-inset ring-gold/55'
                        : 'hover:bg-gold/10'
                    }`}
                  >
                    <span
                      className={`block text-[10px] font-medium ${
                        isSelected ? 'font-semibold text-charcoal' : 'text-charcoal/60'
                      }`}
                    >
                      {t.label}
                    </span>
                    <span className="mt-0.5 block text-xs font-bold tabular-nums text-charcoal">
                      {formatMXN(t.price)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* CTA Button */}
          <motion.button
            type="button"
            whileTap={{ scale: 0.97 }}
            transition={springTransition}
            onClick={() => openCustomizer(product, undefined, initialQty)}
            className="mt-5 inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-full border border-charcoal bg-charcoal px-4 py-2.5 text-xs font-semibold tracking-wide text-bone transition-colors hover:bg-charcoal/90"
          >
            <PencilRuler className="h-3.5 w-3.5 text-gold" />
            <span>
              {selectedTier > 1
                ? `Personalizar y Cotizar (${initialQty}+ pzas)`
                : 'Personalizar y Cotizar'}
            </span>
          </motion.button>
        </div>
      </SpotlightCard>
    </motion.div>
  );
}
